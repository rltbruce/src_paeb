(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.type_cout_divers')
        .controller('type_cout_diversController', type_cout_diversController);
    /** @ngInject */
    function type_cout_diversController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltype_cout_divers = [] ;

        vm.alldistrict = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.type_cout_divers_column = [{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée type_cout_divers
        apiFactory.getAll("type_cout_divers/index").then(function(result)
        {
            vm.alltype_cout_divers = result.data.response; 
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
              description: ''
            };         
            vm.alltype_cout_divers.push(items);
            vm.alltype_cout_divers.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }
          else
          {
            vm.showAlert("Ajout type_cout_divers','Un formulaire d'ajout est déjà ouvert!!!");
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(type_cout_divers,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (type_cout_divers,suppression); 
            } 
            else
            {
                insert_in_base(type_cout_divers,suppression);
            }
        }

        //fonction de bouton d'annulation type_cout_divers
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description       = currentItem.description ;
          }else
          {
            vm.alltype_cout_divers = vm.alltype_cout_divers.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };

        //fonction selection item 
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            

            if (item.$selected = false) 
            {
              currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
            }
       
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltype_cout_divers) return;
             vm.alltype_cout_divers.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item type_cout_divers
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltype_cout_divers.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;        
            item.description       = vm.selectedItem.description;
        };

        //fonction bouton suppression item type_cout_divers
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet entype_cout_diversistrement ?')
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

        //function teste s'il existe une modification item type_cout_divers
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.alltype_cout_divers.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if(cis[0].description!=currentItem.description)                    
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

        //insertion ou mise a jours ou suppression item dans bdd type_cout_divers
        function insert_in_base(type_cout_divers,suppression)
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
                    description: type_cout_divers.description              
                });
              
                //factory
            apiFactory.add("type_cout_divers/index",datas, config).success(function (data)
            {
                
                var dist = vm.alldistrict.filter(function(obj)
                {
                    return obj.id == type_cout_divers.id_district;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = type_cout_divers.description;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltype_cout_divers = vm.alltype_cout_divers.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  type_cout_divers.description =  type_cout_divers.description;
                  type_cout_divers.id  =   String(data.response);              
                  NouvelItem=false;
            }
              type_cout_divers.$selected = false;
              type_cout_divers.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert("Error','Erreur lors de l'insertion de donnée");});

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
