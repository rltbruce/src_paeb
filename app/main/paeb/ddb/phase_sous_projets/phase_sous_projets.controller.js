(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.phase_sous_projets')
        .controller('Phase_sous_projetsController', Phase_sous_projetsController);
    /** @ngInject */
    function Phase_sous_projetsController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allphase_sous_projets = [] ;

        vm.ajoutRubrique_phase_sous_projet = ajoutRubrique_phase_sous_projet;
        var NouvelItemRubrique_phase_sous_projet=false;
        var currentItemRubrique_phase_sous_projet;
        vm.selectedItemRubrique_phase_sous_projet = {} ;
        vm.allrubrique_phase_sous_projet = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.phase_sous_projets_column = [
        {titre:"Libelle"},
        {titre:"Description"},
        {titre:"Code"},
        {titre:"Action"}
        ];
        
        //recuperation donnée phase_sous_projets
        apiFactory.getAll("phase_sous_projets/index").then(function(result)
        {
            vm.allphase_sous_projets = result.data.response; 
            console.log(vm.allphase_sous_projets);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { var numcode=1;
            
            if (vm.allphase_sous_projets.length>0)
            {
                var last_phase = Math.max.apply(Math, vm.allphase_sous_projets.map(function(o)
                { 
                  numcode=o.code.split(' ')[1];
                  return numcode;
                }));
                //console.log(numcode);
                var items = {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  libelle: '',         
                  description: '',
                  code: 'phase '+(parseInt(numcode)+1)
                };         
                vm.allphase_sous_projets.push(items);
                vm.allphase_sous_projets.forEach(function(pres)
                {
                  if(pres.$selected==true)
                  {
                    vm.selectedItem = pres;
                  }
                });

                NouvelItem = true ;
            }else
            {
              var items = {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  libelle: '',         
                  description: '',
                  code: 'phase '+numcode
                };         
                vm.allphase_sous_projets.push(items);
                vm.allphase_sous_projets.forEach(function(pres)
                {
                  if(pres.$selected==true)
                  {
                    vm.selectedItem = pres;
                  }
                });

                NouvelItem = true ;
            }
           
          }else
          {
            vm.showAlert('Ajout phase demande mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(phase_sous_projets,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (phase_sous_projets,suppression); 
            } 
            else
            {
                insert_in_base(phase_sous_projets,suppression);
            }
        }

        //fonction de bouton d'annulation phase_sous_projets
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code = currentItem.code ;
            item.libelle  = currentItem.libelle  ;
            item.description= currentItem.description ;  
          }else
          {
            vm.allphase_sous_projets = vm.allphase_sous_projets.filter(function(obj)
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
            if (item.id!=0)
            {
              vm.stepOne = true;
              vm.stepTwo = false;
            }
           // vm.allphase_sous_projets= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allphase_sous_projets) return;
             vm.allphase_sous_projets.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item phase_sous_projets
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allphase_sous_projets.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.libelle       = vm.selectedItem.libelle;
            item.description     = vm.selectedItem.description ; 
        };

        //fonction bouton suppression item phase_sous_projets
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enphase_sous_projetsistrement ?')
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

        //function teste s'il existe une modification item phase_sous_projets
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var tranc = vm.allphase_sous_projets.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(tranc[0])
                {
                   if((tranc[0].libelle!=currentItem.libelle) 
                    || (tranc[0].code!=currentItem.code)
                    || (tranc[0].description!=currentItem.description))                    
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

        //insertion ou mise a jours ou suppression item dans bdd phase_sous_projets
        function insert_in_base(phase_sous_projets,suppression)
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
                    code:   phase_sous_projets.code,
                    libelle:    phase_sous_projets.libelle,      
                    description:  phase_sous_projets.description,               
                });
                //console.log(phase_sous_projets.pays_id);
                //factory
            apiFactory.add("phase_sous_projets/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.libelle        = phase_sous_projets.libelle;
                        vm.selectedItem.code       = phase_sous_projets.code;
                        vm.selectedItem.description       = phase_sous_projets.description;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allphase_sous_projets = vm.allphase_sous_projets.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  phase_sous_projets.libelle =  phase_sous_projets.libelle;
                  phase_sous_projets.code=  phase_sous_projets.code;
                  phase_sous_projets.description =  phase_sous_projets.description;
                  phase_sous_projets.id  =   String(data.response);              
                  NouvelItem=false;
            }
              phase_sous_projets.$selected = false;
              phase_sous_projets.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/********************rubrique*****************/
        vm.ajouterRubrique_phase_sous_projet = function ()
        { 
          
          if (NouvelItemRubrique_phase_sous_projet == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              designation: '',
              element_verifier: ''
            };
        
            vm.allrubrique_phase_sous_projet.push(items);
            vm.allrubrique_phase_sous_projet.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRubrique_phase_sous_projet = mem;
              }
            });

            NouvelItemRubrique_phase_sous_projet = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rubrique_phase_sous_projet','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutRubrique_phase_sous_projet(rubrique_phase_sous_projet,suppression)
        {
            if (NouvelItemRubrique_phase_sous_projet==false)
            {
                test_existanceRubrique_phase_sous_projet (rubrique_phase_sous_projet,suppression); 
            } 
            else
            {
                insert_in_baseRubrique_phase_sous_projet(rubrique_phase_sous_projet,suppression);
            }
        }

        //fonction de bouton d'annulation rubrique_phase_sous_projet
        vm.annulerRubrique_phase_sous_projet = function(item)
        {
          if (NouvelItemRubrique_phase_sous_projet == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.designation   = currentItemRubrique_phase_sous_projet.designation ;
            item.element_verifier   = currentItemRubrique_phase_sous_projet.element_verifier ;
          }else
          {
            vm.allrubrique_phase_sous_projet = vm.allrubrique_phase_sous_projet.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRubrique_phase_sous_projet.id;
            });
          }

          vm.selectedItemRubrique_phase_sous_projet = {} ;
          NouvelItemRubrique_phase_sous_projet      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRubrique_phase_sous_projet= function (item)
        {
            vm.selectedItemRubrique_phase_sous_projet = item;
            vm.nouvelItemRubrique_phase_sous_projet   = item;
            currentItemRubrique_phase_sous_projet    = JSON.parse(JSON.stringify(vm.selectedItemRubrique_phase_sous_projet));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemRubrique_phase_sous_projet', function()
        {
             if (!vm.allrubrique_phase_sous_projet) return;
             vm.allrubrique_phase_sous_projet.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRubrique_phase_sous_projet.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRubrique_phase_sous_projet = function(item)
        {
            NouvelItemRubrique_phase_sous_projet = false ;
            vm.selectedItemRubrique_phase_sous_projet = item;
            currentItemRubrique_phase_sous_projet = angular.copy(vm.selectedItemRubrique_phase_sous_projet);
            $scope.vm.allrubrique_phase_sous_projet.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.designation   = vm.selectedItemRubrique_phase_sous_projet.designation ;
            item.element_verifier   = vm.selectedItemRubrique_phase_sous_projet.element_verifier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item rubrique_phase_sous_projet
        vm.supprimerRubrique_phase_sous_projet = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutRubrique_phase_sous_projet(vm.selectedItemRubrique_phase_sous_projet,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRubrique_phase_sous_projet (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allrubrique_phase_sous_projet.filter(function(obj)
                {
                   return obj.id == currentItemRubrique_phase_sous_projet.id;
                });
                if(mem[0])
                {
                   if((mem[0].designation   != currentItemRubrique_phase_sous_projet.designation )
                    ||(mem[0].element_verifier   != currentItemRubrique_phase_sous_projet.element_verifier ))                   
                      { 
                         insert_in_baseRubrique_phase_sous_projet(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRubrique_phase_sous_projet(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rubrique_phase_sous_projet
        function insert_in_baseRubrique_phase_sous_projet(rubrique_phase_sous_projet,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRubrique_phase_sous_projet==false)
            {
                getId = vm.selectedItemRubrique_phase_sous_projet.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    designation: rubrique_phase_sous_projet.designation,
                    element_verifier: rubrique_phase_sous_projet.element_verifier,
                    id_phase_sous_projet: vm.selectedItem.id,               
                });
                console.log(datas);
                //factory
            apiFactory.add("rubrique_phase_sous_projet/index",datas, config).success(function (data)
            { 
              if (NouvelItemRubrique_phase_sous_projet == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemRubrique_phase_sous_projet.$selected  = false;
                        vm.selectedItemRubrique_phase_sous_projet.$edit      = false;
                        vm.selectedItemRubrique_phase_sous_projet ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allrubrique_phase_sous_projet = vm.allrubrique_phase_sous_projet.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRubrique_phase_sous_projet.id;
                      });
                      
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  rubrique_phase_sous_projet.id  =   String(data.response);              
                  NouvelItemRubrique_phase_sous_projet = false; 
              }
              
              rubrique_phase_sous_projet.$selected = false;
              rubrique_phase_sous_projet.$edit = false;
              vm.selectedItemRubrique_phase_sous_projet = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*******************rubrique***************/

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