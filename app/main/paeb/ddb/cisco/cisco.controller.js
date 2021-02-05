(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cisco')
        .controller('CiscoController', CiscoController);
    /** @ngInject */
    function CiscoController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allcisco = [] ;

        vm.alldistrict = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true,
          order:[]          
        };

        //col table
        vm.cisco_column = [{titre:"Code"},{titre:"Description"},{titre:"District"},{titre:"Action"}];
        
        //recuperation donnée cisco
        apiFactory.getAll("cisco/index").then(function(result)
        {
            vm.allcisco = result.data.response; 
            //console.log(vm.allcisco);
        });

        //recuperation donnée district
        apiFactory.getAll("district/index").then(function(result)
        {
          vm.alldistrict= result.data.response;
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              description: '',
              id_district: ''
            };         
            vm.allcisco.unshift(items);
            vm.allcisco.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout cisco','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(cisco,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (cisco,suppression); 
            } 
            else
            {
                insert_in_base(cisco,suppression);
            }
        }

        //fonction de bouton d'annulation cisco
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.description       = currentItem.description ;
            item.id_district       = currentItem.id_district ; 
          }else
          {
            vm.allcisco = vm.allcisco.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.allcisco= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allcisco) return;
             vm.allcisco.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item cisco
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allcisco.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.description       = vm.selectedItem.description;
            item.id_district       = vm.selectedItem.district.id; 
        };

        //fonction bouton suppression item cisco
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enciscoistrement ?')
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

        //function teste s'il existe une modification item cisco
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allcisco.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].code!=currentItem.code)
                    || (cis[0].id_district!=currentItem.id_district))                    
                      { 
                         insert_in_base(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_base(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd cisco
        function insert_in_base(cisco,suppression)
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
                    code:      cisco.code,
                    description: cisco.description,
                    id_district: cisco.id_district               
                });
                //console.log(cisco.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("cisco/index",datas, config).success(function (data)
            {
                
                var dist = vm.alldistrict.filter(function(obj)
                {
                    return obj.id == cisco.id_district;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = cisco.description;
                        vm.selectedItem.code       = cisco.code;
                        vm.selectedItem.district       = dist[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allcisco = vm.allcisco.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  cisco.description =  cisco.description;
                  cisco.code=  cisco.code;
                  cisco.district = dist[0];
                  cisco.id  =   String(data.response);              
                  NouvelItem=false;
            }
              cisco.$selected = false;
              cisco.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
    }
})();
