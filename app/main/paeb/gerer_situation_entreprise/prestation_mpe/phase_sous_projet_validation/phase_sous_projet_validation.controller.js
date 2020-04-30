(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.prestation_mpe.phase_sous_projet_validation')       
        .controller('Phase_sous_projet_validationController', Phase_sous_projet_validationController);
    /** @ngInject */
    function Phase_sous_projet_validationController($mdDialog, $scope, apiFactory, $state, $cookieStore)
    {
		    var vm = this;
     /*   vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutPrestation_mpe_validation = ajoutPrestation_mpe_validation ;
        var NouvelItemPrestation_mpe_validation=false;
        var currentItemPrestation_mpe_validation;
        vm.selectedItemPrestation_mpe_validation = {} ;
        vm.allprestation_mpe_validation = [] ;*/

        vm.ajoutPhase_sous_projet = ajoutPhase_sous_projet ;
        var NouvelItemPhase_sous_projet=false;
        var currentItemPhase_sous_projet;
        vm.selectedItemPhase_sous_projet = {} ;
        vm.allphase_sous_projet = [] ;

        vm.ajoutRubrique_construction = ajoutRubrique_construction ;
        var NouvelItemRubrique_construction=false;
        var currentItemRubrique_construction;
        vm.selectedItemRubrique_construction = {} ;
        vm.allrubrique_construction = [] ;
        vm.showboutonValider = false;
        vm.permissionboutonValider= false;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

       // vm.showbuttonNouvPassation=true;
        //vm.showThParcourir = false;
        vm.date_now  = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

           /* apiFactory.getAll("phase_sous_projets/index").then(function(result)
            {
                vm.allphase_sous_projet_ddb = result.data.response;
            });*/

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

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontrat_prestataireBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allcontrat_prestataire = result.data.response; 
                console.log(vm.allcontrat_prestataire);
            });

            apiFactory.getAPIgeneraliserREST("phase_sous_projet_construction/index",'menu','getphaseinvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allphase_sous_projet = result.data.response;
            });
          }
        });



/**********************************debut phase_sous_projet****************************************/
//col table
        vm.phase_sous_projet_column = [
        {titre:" Contrat"
        },
        {titre:" Phase"
        },
        {titre:"Libelle"
        },
        {titre:"Description"
        },
        {titre:"Action"
        }];

        apiFactory.getAll("phase_sous_projets/index").then(function(result)
        {
            vm.allphase_sous_projet_ddb = result.data.response;
            vm.allcurrentphase_sous_projet = result.data.response;
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
              id_contrat_prestataire: '',         
              id_phase_sous_projet: '',
              libelle: '',
              description: ''
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
        vm.change_contrat = function(item)
        {

            apiFactory.getAPIgeneraliserREST("phase_sous_projet_construction/index",'menu','getphaseBycontrat','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
            {
                vm.phase_sous_projets = result.data.response;
                if(vm.phase_sous_projets.length>0)
                {
                  var max_id = Math.max.apply(Math, vm.phase_sous_projets.map(function(o){ return o.id;}));
                  var dernier_phase_sous_projet = vm.phase_sous_projets.filter(function(obj)
                  { return obj.id == max_id});
                  var max_phase = Math.max.apply(Math, dernier_phase_sous_projet.map(function(o){ return o.phase_sous_projet.code.split(' ')[1];}));
                  console.log(max_phase);
                  if (dernier_phase_sous_projet[0].validation == 1)
                  {
                    vm.allcurrentphase_sous_projet = vm.allphase_sous_projet_ddb.filter(function(obj)
                    { return obj.code == 'phase '+(parseInt(max_phase)+1);});
                  }else
                  {
                    vm.showAlert('Impossible d\'ajouter la phase','Dernier phase en-cours!!!');
                    vm.allcurrentphase_sous_projet = [];
                  }
                  
                }
                else
                {console.log('2');
                  vm.allcurrentphase_sous_projet = vm.allphase_sous_projet_ddb.filter(function(obj)
                  { return obj.code == 'phase 1'});
                }
            });

        }

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
            item.id_contrat_prestataire   = currentItemPhase_sous_projet.id_contrat_prestataire ;
            item.id_phase_sous_projet   = currentItemPhase_sous_projet.id_phase_sous_projet ;
            item.libelle  = currentItemPhase_sous_projet.libelle;
            item.description  = currentItemPhase_sous_projet.description;
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

        //fonction selection item Prestation_mpe_validation
        vm.selectionPhase_sous_projet= function (item)
        {
            vm.selectedItemPhase_sous_projet = item;
            vm.nouvelItemPhase_sous_projet   = item;
            currentItemPhase_sous_projet    = JSON.parse(JSON.stringify(vm.selectedItemPhase_sous_projet));
            console.log(item.id);
           if(item.id!=0)
           {
              apiFactory.getAPIgeneraliserREST("rubrique_construction/index",'menu','getrubriqueByphase_construction','id_phase_construction',item.id).then(function(result)
              {
                  vm.allrubrique_construction = result.data.response; 
                  console.log(vm.allrubrique_construction);
              });
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.showboutonValider = true;

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
        {
            NouvelItemPhase_sous_projet = false ;
            vm.selectedItemPhase_sous_projet = item;
            currentItemPhase_sous_projet = angular.copy(vm.selectedItemPhase_sous_projet);
            $scope.vm.allphase_sous_projet.forEach(function(mem) {
              mem.$edit = false;
            });
            vm.allcurrentphase_sous_projet = vm.allphase_sous_projet_ddb.filter(function(obj)
            { return obj.id == item.phase_sous_projet.id;});

            item.$edit = true;
            item.$selected = true;
            item.id_contrat_prestataire   = vm.selectedItemPhase_sous_projet.contrat_prestataire.id ;
            item.id_phase_sous_projet   = vm.selectedItemPhase_sous_projet.phase_sous_projet.id ;
            item.libelle   = vm.selectedItemPhase_sous_projet.phase_sous_projet.libelle ;
            item.description  = vm.selectedItemPhase_sous_projet.phase_sous_projet.description;
vm.showboutonValider = false;

           /* apiFactory.getAPIgeneraliserREST("designation_infrastructure/index",'id_phase_sous_projet',item.infrastructure.id).then(function(result)
            {
                  vm.alldesignation_infrastructure = result.data.response;
                  item.id_designation_infrastructure   = vm.selectedItemPhase_sous_projet.designation_infrastructure.id ;
            });
            apiFactory.getAPIgeneraliserREST("element_a_verifier/index",'id_designation_infrastructure',item.designation_infrastructure.id).then(function(result)
          {
                vm.allelement_a_verifier = result.data.response;
                item.id_element_a_verifier   = vm.selectedItemPhase_sous_projet.element_a_verifier.id;
                console.log(result.data.response);
          });*/
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
                   if((pha[0].id_phase_sous_projet   != currentItemPhase_sous_projet.id_phase_sous_projet ) )                   
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
                    id_contrat_prestataire: phase_sous_projet.id_contrat_prestataire,
                    id_phase_sous_projet: phase_sous_projet.id_phase_sous_projet,
                    validation: 0,               
                });
                console.log(datas);
                //factory
            apiFactory.add("phase_sous_projet_construction/index",datas, config).success(function (data)
            {  
                var phase = vm.allphase_sous_projet_ddb.filter(function(obj)
                {
                    return obj.id== phase_sous_projet.id_phase_sous_projet;
                });

                var contra = vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == phase_sous_projet.id_contrat_prestataire;
                });
                if (NouvelItemPhase_sous_projet == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemPhase_sous_projet.contrat_prestataire  = contra[0];
                        vm.selectedItemPhase_sous_projet.phase_sous_projet  = phase[0];
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
                  phase_sous_projet.contrat_prestataire  = contra[0];
                  phase_sous_projet.phase_sous_projet  = phase[0];
                  phase_sous_projet.id  =   String(data.response);              
                  NouvelItemPhase_sous_projet=false;
                }
              phase_sous_projet.$selected = false;
              phase_sous_projet.$edit = false;
              vm.selectedItemPhase_sous_projet= {};
            vm.showboutonValider = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changephase_sous_projet = function(item)
        {
          var sous_pro = vm.allphase_sous_projet_ddb.filter(function(obj)
              { return obj.id == item.id_phase_sous_projet});
          item.libelle = sous_pro[0].libelle;
          item.description = sous_pro[0].description;
        }

        vm.validationSousprojet = function()
      {
        validationSousprojet(vm.selectedItemPhase_sous_projet,0,1);
      }

      function validationSousprojet(phase_sous_projet,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        phase_sous_projet.id,
                    id_contrat_prestataire: phase_sous_projet.contrat_prestataire.id,
                    id_phase_sous_projet: phase_sous_projet.phase_sous_projet.id,
                    validation: validation,               
                });
                console.log(datas);
                //factory
            apiFactory.add("phase_sous_projet_construction/index",datas, config).success(function (data)
            {  
                vm.allphase_sous_projet = vm.allphase_sous_projet.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPhase_sous_projet.id;
                      });
              phase_sous_projet.$selected = false;
              phase_sous_projet.$edit = false;
              vm.selectedItemPhase_sous_projet= {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin phase_sous_projet****************************************/

/**********************************debut phase_sous_projet****************************************/
//col table
        vm.rubrique_construction_column = [       
        {titre:"Designation"
        },
        {titre:"Element à verifier"
        },
        {titre:"Date verification"
        },
        {titre:"Conformite"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];

        apiFactory.getAll("rubrique_phase_sous_projet/index").then(function(result)
        {
            vm.allrubrique_phase_sous_projet = result.data.response;
        });

        //Masque de saisi ajout
        vm.ajouterRubrique_construction = function ()
        { 
          if (NouvelItemRubrique_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              designation: '',         
              element_verifier: '',
              date_verification: '',
              conformite: '',
              observation: ''
            };         
            vm.allrubrique_construction.push(items);
            vm.allrubrique_construction.forEach(function(mem)
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
        function ajoutRubrique_construction(rubrique_construction,suppression)
        {
            if (NouvelItemRubrique_construction==false)
            {
                test_existanceRubrique_construction (rubrique_construction,suppression); 
            } 
            else
            {
                insert_in_baseRubrique_construction(rubrique_construction,suppression);
            }
        }

        //fonction de bouton d'annulation rubrique_construction
        vm.annulerRubrique_construction = function(item)
        {
          if (NouvelItemRubrique_construction == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.designation   = currentItemRubrique_construction.designation ;
            item.element_verifier   = currentItemRubrique_construction.element_verifier ;
            item.date_verification  = currentItemRubrique_construction.date_verification;
            item.conformite  = currentItemRubrique_construction.conformite;
            item.observation  = currentItemRubrique_construction.observation;
          }else
          {
            vm.allrubrique_construction = vm.allrubrique_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRubrique_construction.id;
            });
          }

          vm.selectedItemRubrique_construction = {} ;
          NouvelItemRubrique_construction      = false;
          
        };

        //fonction selection item Prestation_mpe_validation
        vm.selectionRubrique_construction= function (item)
        {
            vm.selectedItemRubrique_construction = item;
            vm.nouvelItemRubrique_construction   = item;
            currentItemRubrique_construction    = JSON.parse(JSON.stringify(vm.selectedItemRubrique_construction));
            console.log('er');
           if(item.id!=0)
           {

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemRubrique_construction', function()
        {
             if (!vm.allrubrique_construction) return;
             vm.allrubrique_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRubrique_construction.$selected = true;console.log('ev');
        });

        //fonction masque de saisie modification item feffi
        vm.modifierRubrique_construction = function(item)
        {console.log(item);
            NouvelItemRubrique_construction = false ;
            vm.selectedItemRubrique_construction = item;
            currentItemRubrique_construction = angular.copy(vm.selectedItemRubrique_construction);
            $scope.vm.allrubrique_construction.forEach(function(mem) {
              mem.$edit = false;
            });
            var date = new Date(vm.selectedItemRubrique_construction.date_verification);

            if (currentItemRubrique_construction.date_verification==null)
            {
                date =null;
            }
            if (currentItemRubrique_construction.id_rubr_construction==null)
            {   
                NouvelItemRubrique_construction = true ;
            }

            item.$edit = true;
            item.$selected = true;
            item.designation   = vm.selectedItemRubrique_construction.designation ;
            item.element_verifier   = vm.selectedItemRubrique_construction.element_verifier ;
            item.date_verification   = date;
            item.conformite   = vm.selectedItemRubrique_construction.conformite ;
            item.observation  = vm.selectedItemRubrique_construction.observation;
            console.log(currentItemRubrique_construction.date_verification);
            console.log(new Date(vm.selectedItemRubrique_construction.date_verification));
           
        };

        //fonction bouton suppression item rubrique_construction
        vm.supprimerRubrique_construction = function()
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
                vm.ajoutrubrique_construction(vm.selectedItemRubrique_construction,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRubrique_construction(item,suppression)
        {          
            if (suppression!=1)
            {
               var pha = vm.allrubrique_construction.filter(function(obj)
                {
                   return obj.id == currentItemRubrique_construction.id;
                });
                if(pha[0])
                {
                   if((pha[0].date_verification   != currentItemRubrique_construction.date_verification )
                    || (pha[0].conformite   != currentItemRubrique_construction.conformite )
                    || (pha[0].observation   != currentItemRubrique_construction.observation ) )                   
                      { 
                         insert_in_baseRubrique_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRubrique_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rubrique_construction
        function insert_in_baseRubrique_construction(rubrique_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            console.log(vm.selectedItemRubrique_construction.id_rubr_contruction);
            var getId = 0;
            if (NouvelItemRubrique_construction == false)
            {
                getId = vm.selectedItemRubrique_construction.id_rubr_construction; 
                console.log(getId);
            }
            var conformite = 1;
            if (rubrique_construction.conformite == false)
            {
                conformite = 0;
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_rubrique_phase: vm.selectedItemRubrique_construction.id_rubr_phase,
                    date_verification: convertionDate(new Date(rubrique_construction.date_verification)),
                    conformite: conformite,
                    observation: rubrique_construction.observation,
                    id_phase_construction: vm.selectedItemPhase_sous_projet.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("rubrique_construction/index",datas, config).success(function (data)
            {   

                var rub = vm.allrubrique_phase_sous_projet.filter(function(obj)
                {
                   return obj.id == rubrique_construction.id_rubrique_phase;
                });

                /*var ele = vm.allelement_a_verifier.filter(function(obj)
                {
                   return obj.id == rubrique_construction.id_element_a_verifier;
                });*/

                if (NouvelItemRubrique_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemRubrique_construction.rubrique_phase_sous_projet   = rub[0] ;                        
                        vm.selectedItemRubrique_construction.$selected  = false;
                        vm.selectedItemRubrique_construction.$edit      = false;
                        vm.selectedItemRubrique_construction ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allrubrique_construction = vm.allrubrique_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRubrique_construction.id;
                      });
                    }
                    
                }
                else
                {
                  rubrique_construction.designation_infrastructure   = rub[0];
                  rubrique_construction.id_rubr_construction  =   String(data.response);              
                  NouvelItemRubrique_construction=false;
            }
              rubrique_construction.$selected = false;
              rubrique_construction.$edit = false;
              vm.selectedItemPrestation_mpe_validation = {};
            
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

        vm.convertinCkexbox=function(item)
        { var checbox= false;  
          if(item=='1')
            {
                checbox=true;                
            }
          return checbox;     
        }
        

    }
})();
