(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.agence_acc')
        .controller('Agence_accController', Agence_accController);
    /** @ngInject */
    function Agence_accController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allagence_acc = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false         
        };

        //col table
        vm.agence_acc_column = [
        {titre:"Nom"
        },
        {titre:"Téléphone"
        },
        {titre:"Siège"
        },
        {titre:"Action"}];
        
        //recuperation donnée agence_acc
        apiFactory.getAll("agence_acc/index").then(function(result)
        {
            vm.allagence_acc = result.data.response;
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
              nom: '',
              telephone: '',         
              siege: ''
            };         
            vm.allagence_acc.push(items);
            vm.allagence_acc.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout agence_acc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(agence_acc,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (agence_acc,suppression); 
            } 
            else
            {
                insert_in_base(agence_acc,suppression);
            }
        }

        //fonction de bouton d'annulation agence_acc
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItem.nom ;
            item.telephone = currentItem.telephone ;
            item.siege    = currentItem.siege ;
          }else
          {
            vm.allagence_acc = vm.allagence_acc.filter(function(obj)
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
           // vm.allagence_acc= [] ;
           //console.log(item); 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allagence_acc) return;
             vm.allagence_acc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item agence_acc
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allagence_acc.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItem.nom ;
            item.telephone = parseInt(vm.selectedItem.telephone) ;
            item.siege      = vm.selectedItem.siege ;
        };

        //fonction bouton suppression item agence_acc
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enagence_accistrement ?')
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

        //function teste s'il existe une modification item agence_acc
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allagence_acc.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].telephone!=currentItem.telephone) 
                    || (cis[0].nom!=currentItem.nom)
                    || (cis[0].siege!=currentItem.siege))                    
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

        //insertion ou mise a jours ou suppression item dans bdd agence_acc
        function insert_in_base(agence_acc,suppression)
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
                    telephone:      agence_acc.telephone,      
                    nom:      agence_acc.nom,     
                    siege:    agence_acc.siege                 
                });
                console.log(datas);
                //factory
            apiFactory.add("agence_acc/index",datas, config).success(function (data)
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
                      vm.allagence_acc = vm.allagence_acc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  agence_acc.id        =   String(data.response);              
                  NouvelItem = false;
            }
              agence_acc.$selected = false;
              agence_acc.$edit = false;
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
