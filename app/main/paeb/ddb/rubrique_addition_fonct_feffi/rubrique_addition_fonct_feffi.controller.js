(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.rubrique_addition_fonct_feffi')
        .controller('Rubrique_addition_fonct_feffiController', Rubrique_addition_fonct_feffiController);
    /** @ngInject */
    function Rubrique_addition_fonct_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allrubrique_addition_fonct_feffi = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.rubrique_addition_fonct_feffi_column = [{titre:"Libelle"},{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée rubrique_addition_fonct_feffi
        apiFactory.getAll("rubrique_addition_fonct_feffi/index").then(function(result)
        {
            vm.allrubrique_addition_fonct_feffi = result.data.response; 
            //console.log(vm.allrubrique_addition_fonct_feffi);
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
              libelle: '',
              description: ''
            };         
            vm.allrubrique_addition_fonct_feffi.unshift(items);
            vm.allrubrique_addition_fonct_feffi.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout rubrique_addition_fonct_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(rubrique_addition_fonct_feffi,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (rubrique_addition_fonct_feffi,suppression); 
            } 
            else
            {
                insert_in_base(rubrique_addition_fonct_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation rubrique_addition_fonct_feffi
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.libelle      = currentItem.libelle ;
            item.description       = currentItem.description ; 
          }else
          {
            vm.allrubrique_addition_fonct_feffi = vm.allrubrique_addition_fonct_feffi.filter(function(obj)
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
           // vm.allrubrique_addition_fonct_feffi= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allrubrique_addition_fonct_feffi) return;
             vm.allrubrique_addition_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item rubrique_addition_fonct_feffi
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allrubrique_addition_fonct_feffi.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.libelle      = vm.selectedItem.libelle ;
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item rubrique_addition_fonct_feffi
        vm.supprimer = function()
        {
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

        //function teste s'il existe une modification item rubrique_addition_fonct_feffi
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allrubrique_addition_fonct_feffi.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].libelle!=currentItem.libelle))                    
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

        //insertion ou mise a jours ou suppression item dans bdd rubrique_addition_fonct_feffi
        function insert_in_base(rubrique_addition_fonct_feffi,suppression)
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
                    libelle:      rubrique_addition_fonct_feffi.libelle,
                    description: rubrique_addition_fonct_feffi.description              
                });
                console.log(datas);
                //factory
            apiFactory.add("rubrique_addition_fonct_feffi/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = rubrique_addition_fonct_feffi.description;
                       vm.selectedItem.libelle       = rubrique_addition_fonct_feffi.libelle;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allrubrique_addition_fonct_feffi = vm.allrubrique_addition_fonct_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  rubrique_addition_fonct_feffi.description =  rubrique_addition_fonct_feffi.description;
                  rubrique_addition_fonct_feffi.libelle=  rubrique_addition_fonct_feffi.libelle;
                  rubrique_addition_fonct_feffi.id  =   String(data.response);              
                  NouvelItem=false;
            }
              rubrique_addition_fonct_feffi.$selected = false;
              rubrique_addition_fonct_feffi.$edit = false;
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
