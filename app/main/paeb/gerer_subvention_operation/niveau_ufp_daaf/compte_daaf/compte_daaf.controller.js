(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.compte_daaf')
        .controller('Compte_daafController', Compte_daafController);
    /** @ngInject */
    function Compte_daafController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allcompte_daaf = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.compte_daaf_column = [
        {titre:"Intitule"
        },
        {titre:"Agence"
        },
        {titre:"Compte"
        },
        {titre:"Action"}];
        
        //recuperation donnée compte_daaf
        apiFactory.getAll("compte_daaf/index").then(function(result)
        {
            vm.allcompte_daaf = result.data.response;
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
              intitule: '',
              agence: '',
              compte: ''
          };         
            vm.allcompte_daaf.push(items);
            vm.allcompte_daaf.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout compte_daaf','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(compte_daaf,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (compte_daaf,suppression); 
            } 
            else
            {
                insert_in_base(compte_daaf,suppression);
            }
        }

        //fonction de bouton d'annulation compte_daaf
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule      = currentItem.intitule ;
            item.agence = currentItem.agence ;
            item.compte = currentItem.compte ; 
          }else
          {
            vm.allcompte_daaf = vm.allcompte_daaf.filter(function(obj)
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
           // vm.allcompte_daaf= [] ;
           //console.log(item); 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allcompte_daaf) return;
             vm.allcompte_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item compte_daaf
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allcompte_daaf.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.intitule      = vm.selectedItem.intitule ;
            item.agence = vm.selectedItem.agence;
            item.compte = vm.selectedItem.compte; 
        };

        //fonction bouton suppression item compte_daaf
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet encompte_daafistrement ?')
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

        //function teste s'il existe une modification item compte_daaf
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allcompte_daaf.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].agence!=currentItem.agence) 
                    || (cis[0].intitule!=currentItem.intitule)
                    || (cis[0].compte!=currentItem.compte))                    
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

        //insertion ou mise a jours ou suppression item dans bdd compte_daaf
        function insert_in_base(compte_daaf,suppression)
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
                    intitule:      compte_daaf.intitule,
                    compte:      compte_daaf.compte,
                    agence: compte_daaf.agence,                
                });
                console.log(datas);
                //factory
            apiFactory.add("compte_daaf/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allcompte_daaf = vm.allcompte_daaf.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  compte_daaf.id        =   String(data.response);              
                  NouvelItem = false;
            }
              compte_daaf.$selected = false;
              compte_daaf.$edit = false;
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

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
