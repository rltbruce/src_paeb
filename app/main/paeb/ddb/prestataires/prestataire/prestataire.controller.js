(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.prestataires.prestataire')
        .controller('PrestataireController', PrestataireController);
    /** @ngInject */
    function PrestataireController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allprestataire = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.prestataire_column = [{titre:"Nom"},{titre:"Nif"},{titre:"Stat"},{titre:"Siege"},{titre:"telephone"},{titre:"Action"}];
        
        //recuperation donnée prestataire
        apiFactory.getAll("prestataire/index").then(function(result)
        {
            vm.allprestataire = result.data.response; 
            //console.log(vm.allprestataire);
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
              nif: '',
              stat: '',         
              siege: '',
              telephone: ''
            };         
            vm.allprestataire.push(items);
            vm.allprestataire.forEach(function(pres)
            {
              if(pres.$selected==true)
              {
                vm.selectedItem = pres;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout prestataire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(prestataire,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (prestataire,suppression); 
            } 
            else
            {
                insert_in_base(prestataire,suppression);
            }
        }

        //fonction de bouton d'annulation prestataire
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.telephone = currentItem.telephone ;
            item.nom  = currentItem.nom  ;
            item.nif  = currentItem.nif ; 
            item.stat = currentItem.stat ; 
            item.siege= currentItem.siege ;  
          }else
          {
            vm.allprestataire = vm.allprestataire.filter(function(obj)
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
           // vm.allprestataire= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allprestataire) return;
             vm.allprestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item prestataire
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allprestataire.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.telephone      = vm.selectedItem.telephone ;
            item.nom       = vm.selectedItem.nom;
            item.nif       = vm.selectedItem.nif ;
            item.stat      = vm.selectedItem.stat ;
            item.siege     = vm.selectedItem.siege ; 
        };

        //fonction bouton suppression item prestataire
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enprestataireistrement ?')
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

        //function teste s'il existe une modification item prestataire
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allprestataire.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].nom!=currentItem.nom) 
                    || (cis[0].telephone!=currentItem.telephone)
                    || (cis[0].nif!=currentItem.nif)
                    || (cis[0].stat!=currentItem.stat)
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

        //insertion ou mise a jours ou suppression item dans bdd prestataire
        function insert_in_base(prestataire,suppression)
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
                    id:     getId,      
                    telephone:   prestataire.telephone,
                    nom:    prestataire.nom,      
                    nif:    prestataire.nif,      
                    stat:   prestataire.stat,      
                    siege:  prestataire.siege,               
                });
                //console.log(prestataire.pays_id);
                //factory
            apiFactory.add("prestataire/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.nom        = prestataire.nom;
                        vm.selectedItem.telephone       = prestataire.telephone;
                        vm.selectedItem.nif       = prestataire.nif;
                        vm.selectedItem.stat       = prestataire.stat;
                        vm.selectedItem.siege       = prestataire.siege;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allprestataire = vm.allprestataire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  prestataire.nom =  prestataire.nom;
                  prestataire.telephone=  prestataire.telephone;
                  prestataire.nif =  prestataire.nif;
                  prestataire.stat=  prestataire.stat;
                  prestataire.siege =  prestataire.siege;
                  prestataire.id  =   String(data.response);              
                  NouvelItem=false;
            }
              prestataire.$selected = false;
              prestataire.$edit = false;
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
