(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.prestation_mpe')       
        .controller('Prestation_mpeController', Prestation_mpeController);
    /** @ngInject */
    function Prestation_mpeController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutPrestation_mpe = ajoutPrestation_mpe ;
        var NouvelItemPrestation_mpe=false;
        var currentItemPrestation_mpe;
        vm.selectedItemPrestation_mpe = {} ;
        vm.allprestation_mpe = [] ;

        vm.ajoutPhase_sous_projet = ajoutPhase_sous_projet ;
        var NouvelItemPhase_sous_projet=false;
        var currentItemPhase_sous_projet;
        vm.selectedItemPhase_sous_projet = {} ;
        vm.allphase_sous_projet = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.alldesignation_infrastructure = [];
        vm.allelement_a_verifier = [];
        vm.allinfrastructure = [];

       // vm.showbuttonNouvPassation=true;
        //vm.showThParcourir = false;
        vm.date_now  = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

        //col table
        vm.contrat_prestataire_column = [
        {titre:"Numero contrat"
        },
        {titre:"Description"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];
 
/**********************************fin contrat prestataire****************************************/       
        //recuperation donnée convention
        apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemContrat_prestataire.id!=0)
            {
              apiFactory.getFils("prestation_mpe/index",vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.allprestation_mpe = result.data.response;

                  if (vm.allprestation_mpe.length!=0)
                  {
                    vm.showbuttonNouvPassation=false;
                  }
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemContrat_prestataire', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allcontrat_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_prestataire.$selected = true;
        });        

/**********************************fin contrat prestataire****************************************/

/**********************************debut Presation_mpe****************************************/
//col table
        vm.prestation_mpe_column = [
        {titre:"Date prévisionnelle debut travaux"
        },
        {titre:"Date réelle début travaux"
        },
        {titre:"Délai d'exécution"
        },
        {titre:"Date d’expiration de la police d’assurance MPE"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterPrestation_mpe = function ()
        { 
          if (NouvelItemPrestation_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              date_reel_debu_trav: '',
              date_pre_debu_trav: '',
              delai_execution: '',
              date_expiration_assurance_mpe: ''
            };         
            vm.allprestation_mpe.push(items);
            vm.allprestation_mpe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPrestation_mpe = mem;
              }
            });

            NouvelItemPrestation_mpe = true ;
          }else
          {
            vm.showAlert('Ajout prestation mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPrestation_mpe(prestation_mpe,suppression)
        {
            if (NouvelItemPrestation_mpe==false)
            {
                test_existancePrestation_mpe (prestation_mpe,suppression); 
            } 
            else
            {
                insert_in_basePrestation_mpe(prestation_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation Presation_mpe
        vm.annulerPrestation_mpe = function(item)
        {
          if (NouvelItemPrestation_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.date_reel_debu_trav   = currentItemPrestation_mpe.date_reel_debu_trav ;
            item.date_pre_debu_trav   = currentItemPrestation_mpe.date_pre_debu_trav ;
            item.delai_execution   = currentItemPrestation_mpe.delai_execution ;
            item.date_expiration_assurance_mpe  = currentItemPrestation_mpe.date_expiration_assurance_mpe;
            
          }else
          {
            vm.allprestation_mpe = vm.allprestation_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPrestation_mpe.id;
            });
          }

          vm.selectedItemPrestation_mpe = {} ;
          NouvelItemPrestation_mpe      = false;
          
        };

        //fonction selection item Prestation_mpe
        vm.selectionPrestation_mpe= function (item)
        {
            vm.selectedItemPrestation_mpe = item;
            vm.nouvelItemPrestation_mpe   = item;
            currentItemPrestation_mpe    = JSON.parse(JSON.stringify(vm.selectedItemPrestation_mpe));
            
           if(item.id!=0)
           {
            apiFactory.getFils("phase_sous_projet/index",item.id).then(function(result)
            {
                vm.allphase_sous_projet = result.data.response;
                console.log(vm.allphase_sous_projet);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemPrestation_mpe', function()
        {
             if (!vm.allprestation_mpe) return;
             vm.allprestation_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPrestation_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPrestation_mpe = function(item)
        {
            NouvelItemPrestation_mpe = false ;
            vm.selectedItemPrestation_mpe = item;
            currentItemPrestation_mpe = angular.copy(vm.selectedItemPrestation_mpe);
            $scope.vm.allprestation_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.date_reel_debu_trav   = new Date(vm.selectedItemPrestation_mpe.date_reel_debu_trav );
            item.date_pre_debu_trav   = new Date(vm.selectedItemPrestation_mpe.date_pre_debu_trav);
            item.delai_execution   = vm.selectedItemPrestation_mpe.delai_execution;
            item.date_expiration_assurance_mpe   = new Date(vm.selectedItemPrestation_mpe.date_expiration_assurance_mpe);
           
        };

        //fonction bouton suppression item Presation_mpe
        vm.supprimerPrestation_mpe = function()
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
                vm.ajoutPrestation_mpe(vm.selectedItemPrestation_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePrestation_mpe(item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allprestation_mpe.filter(function(obj)
                {
                   return obj.id == currentItemPrestation_mpe.id;
                });
                if(pass[0])
                {
                   if((pass[0].date_reel_debu_trav   != currentItemPrestation_mpe.date_reel_debu_trav )
                    || (pass[0].date_pre_debu_trav   != currentItemPrestation_mpe.date_pre_debu_trav )
                    || (pass[0].delai_execution   != currentItemPrestation_mpe.delai_execution )
                    || (pass[0].date_expiration_assurance_mpe   != currentItemPrestation_mpe.date_expiration_assurance_mpe ) )                   
                      { 
                         insert_in_basePrestation_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePrestation_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Presation_mpe
        function insert_in_basePrestation_mpe(prestation_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPrestation_mpe==false)
            {
                getId = vm.selectedItemPrestation_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_reel_debu_trav:convertionDate(new Date( prestation_mpe.date_reel_debu_trav)),
                    date_pre_debu_trav: convertionDate(new Date(prestation_mpe.date_pre_debu_trav)),
                    delai_execution:prestation_mpe.delai_execution,
                    date_expiration_assurance_mpe: convertionDate(new Date(prestation_mpe.date_expiration_assurance_mpe)),
                    id_contrat_prestataire : vm.selectedItemContrat_prestataire.id                                  
                });
                console.log(datas);
                //factory
            apiFactory.add("prestation_mpe/index",datas, config).success(function (data)
            {

                if (NouvelItemPrestation_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPrestation_mpe.date_reel_debu_trav   = prestation_mpe.date_reel_debu_trav ;
                        vm.selectedItemPrestation_mpe.date_pre_debu_trav   = prestation_mpe.date_pre_debu_trav ;
                        vm.selectedItemPrestation_mpe.delai_execution   = prestation_mpe.delai_execution ;
                        vm.selectedItemPrestation_mpe.date_expiration_assurance_mpe   = prestation_mpe.date_expiration_assurance_mpe ;
                        
                        vm.selectedItemPrestation_mpe.$selected  = false;
                        vm.selectedItemPrestation_mpe.$edit      = false;
                        vm.selectedItemPrestation_mpe ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allprestation_mpe = vm.allprestation_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPrestation_mpe.id;
                      });
                    }
                    
                }
                else
                {
                  prestation_mpe.date_reel_debu_trav   = prestation_mpe.date_reel_debu_trav ;
                  prestation_mpe.date_pre_debu_trav   = prestation_mpe.date_pre_debu_trav ;
                  prestation_mpe.delai_execution   = prestation_mpe.delai_execution ;
                  prestation_mpe.date_expiration_assurance_mpe   = prestation_mpe.date_expiration_assurance_mpe ;                

                  prestation_mpe.id  =   String(data.response);              
                  NouvelItemPrestation_mpe=false;
            }
              prestation_mpe.$selected = false;
              prestation_mpe.$edit = false;
              vm.selectedItemPrestation_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin Presation_mpe****************************************/

/**********************************debut phase_sous_projet****************************************/
//col table
        vm.phase_sous_projet_column = [
        {titre:"Infrastructure"
        },
        {titre:"Designation infrastructure"
        },
        {titre:"element à verifier"
        },
        {titre:"Date verification"
        },
        {titre:"Conformite"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];

        apiFactory.getAll("infrastructure/index").then(function(result)
        {
            vm.allinfrastructure = result.data.response;
        });

       /* apiFactory.getAll("designation_infrastructure/index").then(function(result)
        {
            vm.alldesignation_infrastructure = result.data.response;
        });

        apiFactory.getAll("element_a_verifier/index").then(function(result)
        {
            vm.allelement_a_verifier = result.data.response;
        });*/
        //Masque de saisi ajout
        vm.ajouterPhase_sous_projet = function ()
        { 
          if (NouvelItemPhase_sous_projet == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_infrastructure: '',
              id_designation_infrastructure: '',
              delai_execution: '',
              date_verification: '',
              conformite: '',
              observation: ''
            };         
            vm.allphase_sous_projet.push(items);
            vm.allphase_sous_projet.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPhase_sous_projet = mem;
              }
            });

            NouvelItemPhase_sous_projet = true ;
          }else
          {
            vm.showAlert('Ajout phase sous projet','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPhase_sous_projet(phase_sous_projet,suppression)
        {
            if (NouvelItemPhase_sous_projet==false)
            {
                test_existancePhase_sous_projet (phase_sous_projet,suppression); 
            } 
            else
            {
                insert_in_basePhase_sous_projet(phase_sous_projet,suppression);
            }
        }

        //fonction de bouton d'annulation phase_sous_projet
        vm.annulerPhase_sous_projet = function(item)
        {
          if (NouvelItemPhase_sous_projet == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_infrastructure   = currentItemPhase_sous_projet.id_infrastructure ;
            item.id_designation_infrastructure   = currentItemPhase_sous_projet.id_designation_infrastructure ;
            item.id_element_a_verifier   = currentItemPhase_sous_projet.id_element_a_verifier ;
            item.date_verification  = currentItemPhase_sous_projet.date_verification;
            item.conformite  = currentItemPhase_sous_projet.conformite;
            item.observation  = currentItemPhase_sous_projet.observation;
          }else
          {
            vm.allphase_sous_projet = vm.allphase_sous_projet.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPhase_sous_projet.id;
            });
          }

          vm.selectedItemPhase_sous_projet = {} ;
          NouvelItemPhase_sous_projet      = false;
          
        };

        //fonction selection item Prestation_mpe
        vm.selectionPhase_sous_projet= function (item)
        {
            vm.selectedItemPhase_sous_projet = item;
            vm.nouvelItemPhase_sous_projet   = item;
            currentItemPhase_sous_projet    = JSON.parse(JSON.stringify(vm.selectedItemPhase_sous_projet));
            console.log('er');
           if(item.id!=0)
           {
           /* apiFactory.getAPIgeneraliserREST("justificatif_attachement/index",'id_demande_pay_pre',vm.selectedItemPrestation_mpe.id).then(function(result)
            {
                vm.alljustificatif_attachement = result.data.response;
                console.log(vm.alljustificatif_attachement);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_facture/index",'id_demande_pay_pre',vm.selectedItemPrestation_mpe.id).then(function(result)
            {
                vm.alljustificatif_facture = result.data.response;
                console.log(vm.alljustificatif_facture);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_autre_pre/index",'id_demande_pay_pre',vm.selectedItemPrestation_mpe.id).then(function(result)
            {
                vm.alljustificatif_autre = result.data.response;
                console.log(vm.alljustificatif_autre);
            });*/

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemPhase_sous_projet', function()
        {
             if (!vm.allphase_sous_projet) return;
             vm.allphase_sous_projet.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPhase_sous_projet.$selected = true;console.log('ev');
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPhase_sous_projet = function(item)
        {console.log(item);
            NouvelItemPhase_sous_projet = false ;
            vm.selectedItemPhase_sous_projet = item;
            currentItemPhase_sous_projet = angular.copy(vm.selectedItemPhase_sous_projet);
            $scope.vm.allphase_sous_projet.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_infrastructure   = vm.selectedItemPhase_sous_projet.infrastructure.id ;
            item.date_verification   = new Date(vm.selectedItemPhase_sous_projet.date_verification);
            item.conformite   = vm.selectedItemPhase_sous_projet.conformite ;
            item.observation  = vm.selectedItemPhase_sous_projet.observation;

            apiFactory.getAPIgeneraliserREST("designation_infrastructure/index",'id_infrastructure',item.infrastructure.id).then(function(result)
            {
                  vm.alldesignation_infrastructure = result.data.response;
                  item.id_designation_infrastructure   = vm.selectedItemPhase_sous_projet.designation_infrastructure.id ;
            });
            apiFactory.getAPIgeneraliserREST("element_a_verifier/index",'id_designation_infrastructure',item.designation_infrastructure.id).then(function(result)
          {
                vm.allelement_a_verifier = result.data.response;
                item.id_element_a_verifier   = vm.selectedItemPhase_sous_projet.element_a_verifier.id;
                console.log(result.data.response);
          });
        };

        //fonction bouton suppression item phase_sous_projet
        vm.supprimerPhase_sous_projet = function()
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
                vm.ajoutPhase_sous_projet(vm.selectedItemPhase_sous_projet,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePhase_sous_projet(item,suppression)
        {          
            if (suppression!=1)
            {
               var pha = vm.allphase_sous_projet.filter(function(obj)
                {
                   return obj.id == currentItemPhase_sous_projet.id;
                });
                if(pha[0])
                {
                   if((pha[0].id_infrastructure   != currentItemPhase_sous_projet.id_infrastructure )
                    || (pha[0].id_designation_infrastructure   != currentItemPhase_sous_projet.id_designation_infrastructure )
                    || (pha[0].id_element_a_verifier   != currentItemPhase_sous_projet.id_element_a_verifier )
                    || (pha[0].date_verification   != currentItemPhase_sous_projet.date_verification )
                    || (pha[0].conformite   != currentItemPhase_sous_projet.conformite )
                    || (pha[0].observation   != currentItemPhase_sous_projet.observation ) )                   
                      { 
                         insert_in_basePhase_sous_projet(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePhase_sous_projet(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd phase_sous_projet
        function insert_in_basePhase_sous_projet(phase_sous_projet,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPhase_sous_projet==false)
            {
                getId = vm.selectedItemPhase_sous_projet.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_infrastructure: phase_sous_projet.id_infrastructure,
                    id_designation_infrastructure:phase_sous_projet.id_designation_infrastructure,
                    id_element_a_verifier: phase_sous_projet.id_element_a_verifier,
                    date_verification: convertionDate(new Date(phase_sous_projet.date_verification)),
                    conformite: phase_sous_projet.conformite,
                    observation: phase_sous_projet.observation,
                    id_prestation_mpe: vm.selectedItemPrestation_mpe.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("phase_sous_projet/index",datas, config).success(function (data)
            {   var inf = vm.allinfrastructure.filter(function(obj)
                {
                   return obj.id == phase_sous_projet.id_infrastructure;
                });

                var desinf = vm.alldesignation_infrastructure.filter(function(obj)
                {
                   return obj.id == phase_sous_projet.id_designation_infrastructure;
                });

                var ele = vm.allelement_a_verifier.filter(function(obj)
                {
                   return obj.id == phase_sous_projet.id_element_a_verifier;
                });

                if (NouvelItemPhase_sous_projet == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPhase_sous_projet.infrastructure   = inf[0] ;
                        vm.selectedItemPhase_sous_projet.designation_infrastructure   = desinf[0] ;
                        vm.selectedItemPhase_sous_projet.element_a_verifier   = ele[0];
                        vm.selectedItemPhase_sous_projet.date_verification   = phase_sous_projet.date_verification ;
                        vm.selectedItemPhase_sous_projet.conformite   = phase_sous_projet.conformite ;
                        vm.selectedItemPhase_sous_projet.observation  = phase_sous_projet.observation ;
                        
                        vm.selectedItemPhase_sous_projet.$selected  = false;
                        vm.selectedItemPhase_sous_projet.$edit      = false;
                        vm.selectedItemPhase_sous_projet ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allphase_sous_projet = vm.allphase_sous_projet.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPhase_sous_projet.id;
                      });
                    }
                    
                }
                else
                {
                  phase_sous_projet.infrastructure   = inf[0] ;
                  phase_sous_projet.designation_infrastructure   = desinf[0];
                  phase_sous_projet.element_a_verifier   = ele[0] ;
                  phase_sous_projet.date_verification   = phase_sous_projet.date_verification ;
                  phase_sous_projet.conformite   = phase_sous_projet.conformite ;
                  phase_sous_projet.observation  = phase_sous_projet.observation ;

                  phase_sous_projet.id  =   String(data.response);              
                  NouvelItemPhase_sous_projet=false;
            }
              phase_sous_projet.$selected = false;
              phase_sous_projet.$edit = false;
              vm.selectedItemPrestation_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.changeinfrastructure = function(item)
        {
          apiFactory.getAPIgeneraliserREST("designation_infrastructure/index",'id_infrastructure',item.id_infrastructure).then(function(result)
          {
                vm.alldesignation_infrastructure = result.data.response;
          });
        }

        vm.changedesignation_infrastructure = function(item)
        {
          apiFactory.getAPIgeneraliserREST("element_a_verifier/index",'id_designation_infrastructure',item.id_designation_infrastructure).then(function(result)
          {
                vm.allelement_a_verifier = result.data.response;
          });
        }
/**********************************fin phase_sous_projet****************************************/
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

        function convertionDate(daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

      vm.affichageDate = function (daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= jour+"/"+mois+"/"+annee;
                return date_final
            }      
        }
        

    }
})();
