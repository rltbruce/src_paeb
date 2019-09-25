(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.plan_comptable')
        .controller('Plan_comptableController', Plan_comptableController);
    /** @ngInject */
    function Plan_comptableController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allplan_comptable = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.plan_comptable_column = [{titre:"Code"},{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée plan_comptable
        apiFactory.getAll("plan_comptable/index").then(function(result)
        {
            vm.allplan_comptable = result.data.response; 
            //console.log(vm.allplan_comptable);
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
              description: ''
            };         
            vm.allplan_comptable.push(items);
            vm.allplan_comptable.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout plan_comptable','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(plan_comptable,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (plan_comptable,suppression); 
            } 
            else
            {
                insert_in_base(plan_comptable,suppression);
            }
        }

        //fonction de bouton d'annulation plan_comptable
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.description       = currentItem.description ; 
          }else
          {
            vm.allplan_comptable = vm.allplan_comptable.filter(function(obj)
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
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.allplan_comptable= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allplan_comptable) return;
             vm.allplan_comptable.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item plan_comptable
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allplan_comptable.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item plan_comptable
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enplan_comptableistrement ?')
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

        //function teste s'il existe une modification item plan_comptable
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var comp = vm.allplan_comptable.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(comp[0])
                {
                   if((comp[0].description!=currentItem.description) 
                    || (comp[0].code!=currentItem.code))                    
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

        //insertion ou mise a jours ou suppression item dans bdd plan_comptable
        function insert_in_base(plan_comptable,suppression)
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
                    code:      plan_comptable.code,
                    description: plan_comptable.description               
                });
                //console.log(plan_comptable.pays_id);
                //factory
            apiFactory.add("plan_comptable/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = plan_comptable.description;
                        vm.selectedItem.code       = plan_comptable.code;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allplan_comptable = vm.allplan_comptable.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  plan_comptable.description =  plan_comptable.description;
                  plan_comptable.code=  plan_comptable.code;
                  plan_comptable.id  =   String(data.response);              
                  NouvelItem=false;
            }
              plan_comptable.$selected = false;
              plan_comptable.$edit = false;
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
