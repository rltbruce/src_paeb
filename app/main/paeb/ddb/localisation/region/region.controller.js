(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.localisation.region')
        .controller('RegionController', RegionController);
    /** @ngInject */
    function RegionController($mdDialog, $scope, apiFactory, $state)
    {
        var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allregion = [] ;
        vm.allreg = [] ;
        
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true
        };
        //col table
        vm.region_column = [{titre:"Code"},{titre:"Nom"},{titre:"Action"}];

        apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion = result.data.response; 

        });
        
        function ajout(region,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (region,suppression); 
            } 
            else
            {
                insert_in_base(region,suppression);
            }
        }
        
        function insert_in_base(region,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    code:      region.code,
                    nom:       region.nom               
                });
                //console.log(region.pays_id);
                //factory
            apiFactory.add("region/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.nom        = region.nom;
                        vm.selectedItem.code       = region.code;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allregion = vm.allregion.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                        }
                }
                else
                {
                  region.nom =  region.nom;
                  region.code=  region.code;
                  region.id  =   String(data.response);              
                  NouvelItem=false;
            }
              region.$selected = false;
              region.$edit = false;
          }).error(function (data){alert('Error');});                
        }
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allregion) return;
             vm.allregion.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });
          //function cache masque de saisie
        vm.ajouter = function ()
        {
          vm.selectedItem.$selected = false;
          NouvelItem = true ;
          var items = {
            id:'0',
            code:' ',
            nom:' ',
            $edit: true,
            $selected: true,
            supprimer:0
          };          
          vm.allregion.unshift(items);
          vm.allregion.forEach(function(reg)
          {
            if(reg.$selected==true)
            {
              vm.selectedItem = reg;
            }
          });
          console.log(vm.allregion);
            
        };
        vm.annuler = function(item)
        {
          item.$edit = false;
          item.$selected = false;
          item.code      = currentItem.code ;
          item.nom       = currentItem.nom ; 
          vm.selectedItem = {} ;
          NouvelItem      = false;
        };
        
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allregion.forEach(function(reg) {
              reg.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.nom       = vm.selectedItem.nom ; 
        };
        
        vm.supprimer = function()
        {
            vm.affichageMasque = 0 ;
            vm.afficherboutonModifSupr = 0 ;
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout(vm.selectedItem,1);
              }, function() {
                //alert('rien');
              });
        };

        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var reg = vm.allregion.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(reg[0])
                {
                   if((reg[0].nom!=currentItem.nom) || (reg[0].code!=currentItem.code))                    
                      { 
                         insert_in_base(item,suppression);
                      }
                      else
                      {  
                        item.$selected = false;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_base(item,suppression);
        }
    }
})();
