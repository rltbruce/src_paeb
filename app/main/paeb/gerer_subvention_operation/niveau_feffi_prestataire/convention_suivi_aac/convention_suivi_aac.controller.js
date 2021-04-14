
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.convention_suivi_aac')               
        .controller('Convention_suivi_aacController', Convention_suivi_aacController);
    /** @ngInject */
    function Convention_suivi_aacController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel,$stateParams)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.styleTabfils = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

        vm.affiche_load =false;
       
        vm.stepMenu_pr=false;
        vm.session = '';
        vm.ciscos = [];


/*****************************************Debut partenaire relai****************************************/
  
        //vm.selectedItemContrat_partenaire_relai = {} ;
        //vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutPassation_marches_pr = ajoutPassation_marches_pr ;
        var NouvelItemPassation_marches_pr=false;
        var currentItemPassation_marches_pr;
        vm.selectedItemPassation_marches_pr = {} ;
        vm.allpassation_marches_pr = [] ;
        vm.permissionboutonenvaliderpassation_pr = false;
        vm.showbuttonValidationpassation_pr = false; 
      
        vm.ajoutContrat_partenaire_relai = ajoutContrat_partenaire_relai ;
        var NouvelItemContrat_partenaire_relai=false;
        var currentItemContrat_partenaire_relai;
        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ; 
        vm.showbuttonNouvcontrat_pr=true;
        vm.permissionboutonvalidercontrat_pr = false;
        vm.showbuttonValidationcontrat_pr = false;

        vm.ajoutAvenant_partenaire = ajoutAvenant_partenaire ;
        var NouvelItemAvenant_partenaire=false;
        var currentItemAvenant_partenaire;
        vm.selectedItemAvenant_partenaire = {} ;
        vm.allavenant_partenaire = [] ;

        vm.showbuttonValidation_avenant_partenaire = false;
        vm.permissionboutonvalideravenant_partenaire = false;        


        

/*********************************************Fin partenaire relai*************************************/



/********************************************Debut entreprise******************************************/

       

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        
        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
       /*,
        columnDefs: [
            { width: 200, targets: 0 },{ width: 200, targets: 4 }
        ],
        fixedColumns: true*/
        vm.datenow = new Date();       

       
        //recuperation donnée partenaire_relai
        apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai= result.data.response;
        });

        vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                    console.log(vm.ciscos);
                }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.ciscos = [];
            }
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
                console.log(vm.communes);
              }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.communes = [];
            }
          
        }
        
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index","menu","getzapBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.filtre_change_zap = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.ecoles = result.data.response;
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }
        vm.filtre_change_ecole = function(item)
        { 
            vm.filtre.id_convention_entete_entete = null;
            if (item.id_ecole != '*')
            {
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
                  {
                    vm.convention_cisco_feffi_entetes = result.data.response;
                    console.log(vm.convention_cisco_feffi_entetes );
                  }, function error(result){ alert('something went wrong')});
            }
        }
        var id_user = $cookieStore.get('id');
        vm.filtre = {
                id_cisco: null,
                id_region: null
              }
        apiFactory.getAll("region/index").then(function success(response)
        {
            vm.regions = response.data.response;
        });

        var racourci = $stateParams.rac; 
        if (racourci!=null && racourci!=undefined && racourci!='')
        { vm.affiche_load=true;
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByracourci","id_convention_entete",racourci).then(function(result)
          {
            vm.allconvention_entete= result.data.response;
            console.log(vm.allconvention_entete);
            vm.affiche_load=false;
            var item = vm.allconvention_entete[0];
            item.$selected=true;
            vm.selectedItemConvention_entete = item;
            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig';

            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepMenu_pr=true;                  
            vm.stepMenu_moe=true;                  
            vm.stepMenu_mpe=true;                    
            vm.stepMenu_feffi=true;                   
            vm.stepMenu_indicateur=true;
            apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              vm.stepprestaion_pr=false;
              vm.stepdoc_pr=false;
              vm.stepdoc_moe=false;
              vm.stepprestation_moe = false;
              vm.stepjusti_d_tra_moe = false;
              vm.stepsuiviexecution = false;
              vm.stepphase = false;
              vm.stepsoumissionnaire = false;
              vm.stepattachement =false;
          });
        }
        /* apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("BCAF")!= -1)
            {
                            vm.usercisco = result.data.response.cisco;
                            vm.ciscos.push(vm.usercisco);                           
                            vm.filtre.id_cisco=result.data.response.cisco.id;
                            console.log(vm.ciscos);
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionBycisco",'id_cisco',vm.usercisco.id).then(function(result)
                            {
                                vm.regions = result.data.response;
                                vm.filtre.id_region=result.data.response[0].id;
                                console.log(vm.regions);
                            }, function error(result){ alert('something went wrong')}); 

                            vm.session = 'BCAF';
                      
                }else
                {
                    vm.permissionboutonValidercreer = true;

                            apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            }, function error(response){ alert('something went wrong')});
                            vm.session = 'ADMIN'; 
                }                 

         });*/

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
        {titre:"Région"
        },
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Code projet Site"
        },
        {titre:"Accés site"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Utilisateur"
        }]; 
       

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
            });

           /* switch (vm.session)
                {*/
                  /*case 'BCAF': console.log(vm.usercisco.id);
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByfiltrecisco','id_cisco_user',vm.usercisco.id,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });

                      break;*/
                  /*case 'AAC': 
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByfiltrecisco','id_cisco_user',vm.usercisco.id,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });

                      break;

                  case 'ADMIN':                            
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });                 
                      break;
                  default:
                      break;
              
                }  */
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepMenu_pr=true;                  
            vm.stepMenu_moe=true;                  
            vm.stepMenu_mpe=true;                    
            vm.stepMenu_feffi=true;                   
            vm.stepMenu_indicateur=true;

            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig';
                          
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });
               
            /*  apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.latrine_constructions= result.data.response;
              });
             apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.mobilier_constructions= result.data.response;
              });
             apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.batiment_constructions= result.data.response;
              });*/
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              vm.stepprestaion_pr=false;
              vm.stepdoc_pr=false;
              vm.stepdoc_moe=false;
              vm.stepprestation_moe = false;
              vm.stepjusti_d_tra_moe = false;
              vm.stepsuiviexecution = false;
              vm.stepphase = false;
              vm.stepsoumissionnaire = false;
              vm.nbr_decaiss_feffi = item.nbr_decaiss_feffi;
              vm.stepattachement =false;
              //console.log(vm.nbr_demande_feffi);
                         

        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
        });



        /********************************************Debut passation de marcher*********************************************/

       vm.step_menu_pr =function (item,session)
        {
                /*apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_partenaire_relai = result.data.response;
                        console.log(vm.allcontrat_partenaire_relai);
                });*/
            vm.tabpartenaire = true; 
            vm.affiche_load = true;
            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false; 
            vm.stepcontrat_pr = false;
            vm.showbuttonNouvPassation_pr=true;
                apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches_pr = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });
                        vm.affiche_load = false;
                        console.log(vm.allpassation_marches_pr);
                    vm.stepcontrat_pr = true;
                });
        }
        vm.step_passation_pr =function (item,session)
        {
                /*apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_partenaire_relai = result.data.response;
                        console.log(vm.allcontrat_partenaire_relai);
                });*/ 
            vm.affiche_load = true;
            vm.showbuttonNouvPassation_pr=true;
                apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches_pr = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });
                        vm.affiche_load = false;
                });
        } 

        //col table
        vm.passation_marches_pr_column = [
        {titre:"Date Appel manifestation"
        },
        {titre:"Date lancement DP"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre plis reçu"
        },
        {titre:"Date signature contrat"
        },       
        {titre:"Date OS"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterPassation_marches_pr = function ()
        { 
          if (NouvelItemPassation_marches_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_manifestation: '',         
              date_lancement_dp: '',
              date_remise: '',
              nbr_offre_recu: '',              
              date_signature_contrat: '',              
              date_os: '',
              id_partenaire_relai: ''
            };         
            vm.allpassation_marches_pr.push(items);
            vm.allpassation_marches_pr.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPassation_marches_pr = mem;
              }
            });

            NouvelItemPassation_marches_pr = true ;
          }else
          {
            vm.showAlert('Ajout passation_marches_pr','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPassation_marches_pr(passation_marches_pr,suppression)
        {
            if (NouvelItemPassation_marches_pr==false)
            {                
                apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationvalideById','id_passation_pr',passation_marches_pr.id).then(function(result)
                { 
                  var passation_pr_valide = result.data.response;
                  if (passation_pr_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé. Les données sont déjà validées!')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.allpassation_marches_pr = vm.allpassation_marches_pr.filter(function(obj)
                      {
                          return obj.id !== passation_marches_pr.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existancePassation_marches_pr (passation_marches_pr,suppression);                    
                  }
                }); 
            } 
            else
            {
                insert_in_basePassation_marches_pr(passation_marches_pr,suppression);
            }
        }

        //fonction de bouton d'annulation passation_marches_pr
        vm.annulerPassation_marches_pr = function(item)
        {
          if (NouvelItemPassation_marches_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.date_os   = currentItemPassation_marches_pr.date_os ;
            item.date_remise   = currentItemPassation_marches_pr.date_remise ;
            item.nbr_offre_recu = currentItemPassation_marches_pr.nbr_offre_recu;
            item.date_lancement_dp = currentItemPassation_marches_pr.date_lancement_dp ;
            item.date_manifestation   = currentItemPassation_marches_pr.date_manifestation ;
            item.date_signature_contrat = currentItemPassation_marches_pr.date_signature_contrat ;            
          }else
          {
            vm.allpassation_marches_pr = vm.allpassation_marches_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPassation_marches_pr.id;
            });
          }

          vm.selectedItemPassation_marches_pr = {} ;
          NouvelItemPassation_marches_pr      = false;
          
        };
        //fonction selection item region
        vm.selectionPassation_marches_pr= function (item)
        {
            vm.selectedItemPassation_marches_pr = item;
            if (item.$edit ==false || item.$edit == undefined)
            {
              currentItemPassation_marches_pr    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches_pr));
              vm.showbuttonValidationpassation_pr = true;
              vm.validation_passation_pr = item.validation;
            }else{
              vm.showbuttonValidationpassation_pr = false;
            }
        };
        $scope.$watch('vm.selectedItemPassation_marches_pr', function()
        {
             if (!vm.allpassation_marches_pr) return;
             vm.allpassation_marches_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPassation_marches_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPassation_marches_pr = function(item)
        {
            NouvelItemPassation_marches_pr = false ;
            vm.selectedItemPassation_marches_pr = item;
            currentItemPassation_marches_pr = angular.copy(vm.selectedItemPassation_marches_pr);
            $scope.vm.allpassation_marches_pr.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.date_os   = vm.injectDateinInput(vm.selectedItemPassation_marches_pr.date_os)  ;
            item.date_remise   = vm.injectDateinInput(vm.selectedItemPassation_marches_pr.date_remise) ;
            item.nbr_offre_recu = parseInt(vm.selectedItemPassation_marches_pr.nbr_offre_recu);
            item.date_lancement_dp = vm.injectDateinInput(vm.selectedItemPassation_marches_pr.date_lancement_dp) ;
            item.date_manifestation   = vm.injectDateinInput(vm.selectedItemPassation_marches_pr.date_manifestation) ;
            item.date_signature_contrat   = vm.injectDateinInput(vm.selectedItemPassation_marches_pr.date_signature_contrat);
             vm.showbuttonValidationpassation_pr = false;
            
        };

        //fonction bouton suppression item passation_marches_pr
        vm.supprimerPassation_marches_pr = function()
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
                vm.ajoutPassation_marches_pr(vm.selectedItemPassation_marches_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePassation_marches_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpassation_marches_pr.filter(function(obj)
                {
                   return obj.id == currentItemPassation_marches_pr.id;
                });
                if(pass[0])
                {
                   if((pass[0].date_os   != currentItemPassation_marches_pr.date_os )
                    || (pass[0].date_remise   != currentItemPassation_marches_pr.date_remise )
                    || (pass[0].nbr_offre_recu != currentItemPassation_marches_pr.nbr_offre_recu)
                    || (pass[0].date_lancement_dp != currentItemPassation_marches_pr.date_lancement_dp )
                    || (pass[0].date_manifestation   != currentItemPassation_marches_pr.date_manifestation)
                    || (pass[0].date_signature_contrat   != currentItemPassation_marches_pr.date_signature_contrat)
                    )                   
                      { 
                         insert_in_basePassation_marches_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePassation_marches_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePassation_marches_pr(passation_marches_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPassation_marches_pr==false)
            {
                getId = vm.selectedItemPassation_marches_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement_dp: convertionDate(passation_marches_pr.date_lancement_dp),
                    date_os: convertionDate(passation_marches_pr.date_os),
                    date_remise: convertionDate(passation_marches_pr.date_remise),
                    nbr_offre_recu: passation_marches_pr.nbr_offre_recu,                    
                    id_partenaire_relai: passation_marches_pr.id_partenaire_relai,
                    date_manifestation: convertionDate(passation_marches_pr.date_manifestation),
                    date_signature_contrat: convertionDate(passation_marches_pr.date_signature_contrat),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0              
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_pr/index",datas, config).success(function (data)
            { 

                if (NouvelItemPassation_marches_pr == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        //vm.selectedItemPassation_marches_pr.convention_entete = vm.selectedItemConvention_entete;
                        //vm.selectedItemPassation_marches_pr.partenaire_relai = partenaire_relai[0];
                        vm.selectedItemPassation_marches_pr.$selected  = false;
                        vm.selectedItemPassation_marches_pr.$edit      = false;
                        vm.selectedItemPassation_marches_pr ={};
                        vm.showbuttonNouvPassation_pr= false;
                    }
                    else 
                    {    
                      vm.allpassation_marches_pr = vm.allpassation_marches_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPassation_marches_pr.id;
                      });
                      vm.showbuttonNouvPassation_pr= true;
                    }
                    
                }
                else
                {
                  passation_marches_pr.validation=0;
                  //passation_marches_pr.partenaire_relai = partenaire_relai[0];
                  //passation_marches_pr.convention_entete = vm.selectedItemConvention_entete;
                  passation_marches_pr.id  =   String(data.response);              
                  NouvelItemPassation_marches_pr=false;
                  vm.showbuttonNouvPassation_pr= false;
            }

              passation_marches_pr.$selected = false;
              passation_marches_pr.$edit = false;
              vm.selectedItemPassation_marches_pr = {};
              vm.showbuttonValidationpassation_pr = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validation_passation_marche_pr=function()
        {
          validationPassation_marches_pr(vm.selectedItemPassation_marches_pr,0);
        }
        function validationPassation_marches_pr(passation_marches_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        passation_marches_pr.id,
                    date_lancement_dp: convertionDate(passation_marches_pr.date_lancement_dp),
                    date_os: convertionDate(passation_marches_pr.date_os),
                    date_remise: convertionDate(passation_marches_pr.date_remise),
                    nbr_offre_recu: passation_marches_pr.nbr_offre_recu,                    
                    //id_partenaire_relai: passation_marches_pr.id_partenaire_relai,
                    date_manifestation: convertionDate(passation_marches_pr.date_manifestation),
                    date_signature_contrat: convertionDate(passation_marches_pr.date_signature_contrat),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_pr/index",datas, config).success(function (data)
            {   
                /*vm.selectedItemPassation_marches_pr.validation = 1;
                vm.validation_passation_pr = 1;    
                passation_marches_pr.$selected = false;*/
                vm.showbuttonValidationpassation_pr = false;
                vm.allpassation_marches_pr = vm.allpassation_marches_pr.filter(function(obj)
                {
                    return obj.id !== passation_marches_pr.id;
                });
                vm.selectedItemPassation_marches_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
  /*****************************************fin passation de marcher**************************************************/


  /*********************************************debut contrat pr**********************************************/
        vm.step_click_contrat_pr =function ()
        {  
            vm.affiche_load = true;
            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false;
            vm.showbuttonNouvcontrat_pr = false;
            vm.showbuttonimporter_contrat_pr = false
            apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(resultc)
            {
                vm.allcontrat_partenaire_relai = resultc.data.response;
                vm.showbuttonimporter_contrat_pr = true;
                vm.affiche_load = false;
            });
            
        } 

        //col table
        vm.contrat_partenaire_relai_column = [
        {titre:"Partenaire relai"
        },
        {titre:"Intitulé"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];

        //Masque de saisi ajout
        vm.ajouterContrat_partenaire_relai = function ()
        { 
          if (NouvelItemContrat_partenaire_relai == false)
          {
            var items = {}; 

                apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getdate_contratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    if (result.data.response.length!=0)
                    {                       
                        var passation = result.data.response;
                        if (passation[0].date_signature_contrat!=null)
                        {                            
                            
                            items = {
                              $edit: true,
                              $selected: true,
                              id: '0',         
                              intitule: '',
                              ref_contrat: '',
                              montant_contrat: 0,
                              date_signature : new Date(passation[0].date_signature_contrat),
                              id_partenaire_relai:''
                            };         
                            vm.allcontrat_partenaire_relai.push(items);
                            vm.allcontrat_partenaire_relai.forEach(function(mem)
                            {
                              if(mem.$selected==true)
                              {
                                vm.selectedItemContrat_partenaire_relai = mem;
                              }
                            });

                            NouvelItemContrat_partenaire_relai = true ;
                        }
                        else
                        {
                            vm.showAlert('Ajout contrat MPE','La date de contrat est vide dans la passation des marchés!!!');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout contrat MPE','La passation des marchés est vide!!!');
                    }                    
                                
                });

          }else
          {
            vm.showAlert('Ajout contrat_partenaire_relai','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutContrat_partenaire_relai(contrat_partenaire_relai,suppression)
        {
            if (NouvelItemContrat_partenaire_relai==false)
            {
                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideById','id_contrat_partenaire',contrat_partenaire_relai.id).then(function(result)
                { 
                  var contrat_pr_valide = result.data.response;
                  if (contrat_pr_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé. Les données sont déjà validées!')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                     
                      vm.allcontrat_partenaire_relai = contrat_pr_valide;
                        vm.showbuttonValidationcontrat_pr = false;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceContrat_partenaire_relai (contrat_partenaire_relai,suppression);                  
                  }
                }); 
            } 
            else
            {
                insert_in_baseContrat_partenaire_relai(contrat_partenaire_relai,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_partenaire_relai
        vm.annulerContrat_partenaire_relai = function(item)
        {
          if (NouvelItemContrat_partenaire_relai == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemContrat_partenaire_relai.intitule ;
            item.ref_contrat   = currentItemContrat_partenaire_relai.ref_contrat ;
            item.montant_contrat   = currentItemContrat_partenaire_relai.montant_contrat ;            
            item.date_signature = currentItemContrat_partenaire_relai.date_signature ;            
            item.id_partenaire_relai = currentItemContrat_partenaire_relai.id_partenaire_relai ;
          }else
          {
            vm.allcontrat_partenaire_relai = vm.allcontrat_partenaire_relai.filter(function(obj)
            {
                return obj.id !== vm.selectedItemContrat_partenaire_relai.id;
            });
          }
          vm.showbuttonNouvContrat_partenaire_relai = 1;
          vm.selectedItemContrat_partenaire_relai = {} ;
          NouvelItemContrat_partenaire_relai      = false;
          
        };

        //fonction selection item contrat
        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;
           // vm.nouvelItemContrat_partenaire_relai   = item;
            if (item.$selected==false || item.$selected==undefined)
            {
                currentItemContrat_partenaire_relai    = JSON.parse(JSON.stringify(vm.selectedItemContrat_partenaire_relai));
            }
            vm.stepavenant_pr = true;
            vm.stepprestaion_pr = true;
            vm.stepdoc_pr = true; 
           if(item.id!=0)
           {            
              if (item.$edit==false || item.$edit==undefined)
              {
                  
                
                  vm.validation_contrat_pr = item.validation;
                  vm.stepprestaion_pr=true;

                    vm.stepdoc_pr=true;
                  apiFactory.getAPIgeneraliserREST("situation_participant_odc/index",'id_classification_site',vm.selectedItemConvention_entete.site.id_classification_site).then(function(result)
                  {
                      vm.allsituation_participant_odc = result.data.response;
                  }); 
                  vm.showbuttonValidationcontrat_pr = true; 
              }
              else
              {
                vm.showbuttonValidationcontrat_pr = false;
              }  
              vm.validation_contrat_pr = item.validation;
              
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_partenaire_relai', function()
        {
             if (!vm.allcontrat_partenaire_relai) return;
             vm.allcontrat_partenaire_relai.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_partenaire_relai.$selected = true;
        });


        //fonction masque de saisie modification item feffi
        vm.modifierContrat_partenaire_relai = function(item)
        {
            NouvelItemContrat_partenaire_relai = false ;
            vm.selectedItemContrat_partenaire_relai = item;
            currentItemContrat_partenaire_relai = angular.copy(vm.selectedItemContrat_partenaire_relai);
            $scope.vm.allcontrat_partenaire_relai.forEach(function(mem) {
              mem.$edit = false;
            });
            vm.showbuttonNouvContrat_partenaire_relai = 0;
            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemContrat_partenaire_relai.intitule ;
            item.ref_contrat   = vm.selectedItemContrat_partenaire_relai.ref_contrat ;
            item.montant_contrat   = parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat);           
            item.date_signature = new Date(vm.selectedItemContrat_partenaire_relai.date_signature) ;           
            item.id_partenaire_relai = vm.selectedItemContrat_partenaire_relai.partenaire_relai.id ;
            vm.showbuttonValidationcontrat_pr = false;
        };

        //fonction bouton suppression item Contrat_partenaire_relai
        vm.supprimerContrat_partenaire_relai = function()
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
                vm.ajoutContrat_partenaire_relai(vm.selectedItemContrat_partenaire_relai,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Contrat_partenaire_relai
        function test_existanceContrat_partenaire_relai (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                   return obj.id == currentItemContrat_partenaire_relai.id;
                });
                if(pass[0])
                {
                   if((pass[0].intitule   != currentItemContrat_partenaire_relai.intitule )
                    || (pass[0].ref_contrat  != currentItemContrat_partenaire_relai.ref_contrat)
                    || (pass[0].montant_contrat   != currentItemContrat_partenaire_relai.montant_contrat )                    
                    || (pass[0].date_signature != currentItemContrat_partenaire_relai.date_signature )                   
                    || (pass[0].id_partenaire_relai != currentItemContrat_partenaire_relai.id_partenaire_relai ))                   
                      { 
                         insert_in_baseContrat_partenaire_relai(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseContrat_partenaire_relai(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseContrat_partenaire_relai(contrat_partenaire_relai,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemContrat_partenaire_relai==false)
            {
                getId = vm.selectedItemContrat_partenaire_relai.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: contrat_partenaire_relai.intitule,
                    ref_contrat: contrat_partenaire_relai.ref_contrat,
                    montant_contrat: contrat_partenaire_relai.montant_contrat,
                    date_signature:convertionDate(contrat_partenaire_relai.date_signature),
                    id_partenaire_relai:contrat_partenaire_relai.id_partenaire_relai,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_partenaire_relai/index",datas, config).success(function (data)
            {   
                var pres= vm.allpartenaire_relai.filter(function(obj)
                {
                    return obj.id == contrat_partenaire_relai.id_partenaire_relai;
                });

                /*var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == contrat_partenaire_relai.id_convention_entete;
                });*/

                if (NouvelItemContrat_partenaire_relai == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        //vm.selectedItemContrat_partenaire_relai.convention_entete= conv[0];
                        vm.selectedItemContrat_partenaire_relai.partenaire_relai = pres[0];
                        
                        vm.selectedItemContrat_partenaire_relai.$selected  = false;
                        vm.selectedItemContrat_partenaire_relai.$edit      = false;
                        vm.selectedItemContrat_partenaire_relai ={};
                        vm.showbuttonNouvcontrat_pr= false;
                    }
                    else 
                    {    
                      vm.allcontrat_partenaire_relai = vm.allcontrat_partenaire_relai.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemContrat_partenaire_relai.id;
                      });
                      vm.showbuttonNouvcontrat_pr= true;
                    }
                    
                }
                else
                {
                  //contrat_partenaire_relai.convention_entete= conv[0];
                  contrat_partenaire_relai.partenaire_relai = pres[0];
                  contrat_partenaire_relai.validation = 0;
                  contrat_partenaire_relai.id  =   String(data.response);              
                  NouvelItemContrat_partenaire_relai=false;
                  vm.showbuttonNouvcontrat_pr = false;
            } 
              vm.showbuttonValidation = false;
              vm.showbuttonNouvContrat_partenaire_relai = 1;
              contrat_partenaire_relai.$selected = false;
              contrat_partenaire_relai.$edit = false;
              vm.selectedItemContrat_partenaire_relai = {};
              vm.showbuttonValidationcontrat_pr = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.valider_contrat = function()
        {
          maj_in_baseContrat_partenaire_relai(vm.selectedItemContrat_partenaire_relai,0);
        }

        function maj_in_baseContrat_partenaire_relai(contrat_partenaire_relai,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        contrat_partenaire_relai.id,
                    intitule: contrat_partenaire_relai.intitule,
                    ref_contrat: contrat_partenaire_relai.ref_contrat,
                    montant_contrat: contrat_partenaire_relai.montant_contrat,
                    date_signature:convertionDate(contrat_partenaire_relai.date_signature),
                    id_partenaire_relai:contrat_partenaire_relai.partenaire_relai.id,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 1               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_partenaire_relai/index",datas, config).success(function (data)
            { 
              
              vm.selectedItemContrat_partenaire_relai.validation = 1;
              vm.selectedItemContrat_partenaire_relai = {};
              vm.showbuttonValidationcontrat_pr = false;
              vm.validation_contrat_pr =1;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*****************************************fin contrat_partenaire_relai********************************************/
/*********************************************fin avenant partenaire***********************************************/
vm.click_step_avenant_pr = function()
{   
    vm.affiche_load = true;
    apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
    {
        vm.allavenant_partenaire = result.data.response.filter(function(obj)
        {
            return obj.validation == 0;
        });
        vm.affiche_load = false; 
    });
}


//col table
        vm.avenant_partenaire_column = [
        {titre:"Description"
        },
        {titre:"Référence avenant"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvenant_partenaire = function ()
        { 
          if (NouvelItemAvenant_partenaire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',         
              ref_avenant: '',
              montant: 0,
              date_signature:'',
            };         
            vm.allavenant_partenaire.push(items);
            vm.allavenant_partenaire.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_partenaire = mem;
              }
            });

            NouvelItemAvenant_partenaire = true ;
          }else
          {
            vm.showAlert('Ajout avenant_partenaire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_partenaire(avenant_partenaire,suppression)
        {
            if (NouvelItemAvenant_partenaire==false)
            {                
                apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantvalideById','id_avenant_partenaire',avenant_partenaire.id).then(function(result)
                { 
                  var avenant_pr_valide = result.data.response;
                  if (avenant_pr_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé. Les données sont déjà validées!')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.allavenant_partenaire = vm.allavenant_partenaire.filter(function(obj)
                      {
                          return obj.id !== avenant_partenaire.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceAvenant_partenaire (avenant_partenaire,suppression);                   
                  }
                }); 
            } 
            else
            {
                insert_in_baseAvenant_partenaire(avenant_partenaire,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_partenaire
        vm.annulerAvenant_partenaire = function(item)
        {
          if (NouvelItemAvenant_partenaire == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvenant_partenaire.description ;
            item.montant   = currentItemAvenant_partenaire.montant ;
            item.ref_avenant   = currentItemAvenant_partenaire.ref_avenant ;
            item.date_signature = currentItemAvenant_partenaire.date_signature ;
          }else
          {
            vm.allavenant_partenaire = vm.allavenant_partenaire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_partenaire.id;
            });
          }
        
            vm.showbuttonNouvavenant_partenaire=true;

          vm.selectedItemAvenant_partenaire = {} ;
          NouvelItemAvenant_partenaire      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_partenaire= function (item)
        {
            vm.selectedItemAvenant_partenaire = item;
            //vm.nouvelItemAvenant_partenaire   = item;
            if (item.$selected==false || item.$selected==undefined)
            {
                currentItemAvenant_partenaire    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_partenaire));
            }
            vm.showbuttonValidation_avenant_partenaire = true;
                vm.validation_avenant_partenaire = item.validation;
             
            
        };
        $scope.$watch('vm.selectedItemAvenant_partenaire', function()
        {
             if (!vm.allavenant_partenaire) return;
             vm.allavenant_partenaire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_partenaire.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_partenaire = function(item)
        {
            NouvelItemAvenant_partenaire = false ;
            vm.selectedItemAvenant_partenaire = item;
            currentItemAvenant_partenaire = angular.copy(vm.selectedItemAvenant_partenaire);
            $scope.vm.allavenant_partenaire.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.ref_avenant   = vm.selectedItemAvenant_partenaire.ref_avenant ;
            item.description   = vm.selectedItemAvenant_partenaire.description ;
            item.montant   = parseFloat(vm.selectedItemAvenant_partenaire.montant);
            item.date_signature = vm.injectDateinInput(vm.selectedItemAvenant_partenaire.date_signature) ;            
            vm.showbuttonValidation_avenant_partenaire = false;
        };

        //fonction bouton suppression item Avenant_partenaire
        vm.supprimerAvenant_partenaire = function()
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
                vm.ajoutAvenant_partenaire(vm.selectedItemAvenant_partenaire,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_partenaire (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_partenaire.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_partenaire.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_partenaire.description )
                    || (pass[0].montant  != currentItemAvenant_partenaire.montant)
                    || (pass[0].date_signature != currentItemAvenant_partenaire.date_signature ))                   
                      { 
                         insert_in_baseAvenant_partenaire(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_partenaire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_partenaire(avenant_partenaire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_partenaire==false)
            {
                getId = vm.selectedItemAvenant_partenaire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avenant_partenaire.description,
                    montant: avenant_partenaire.montant,
                    ref_avenant: avenant_partenaire.ref_avenant,
                    date_signature:convertionDate(avenant_partenaire.date_signature),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_partenaire_relai/index",datas, config).success(function (data)
            {   
                /*var conve= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == avenant_partenaire.id_contrat_partenaire_relai;
                });*/

                if (NouvelItemAvenant_partenaire == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        //vm.selectedItemAvenant_partenaire.contrat_partenaire_relai = conve[0];
                        
                        vm.selectedItemAvenant_partenaire.$selected  = false;
                        vm.selectedItemAvenant_partenaire.$edit      = false;
                        vm.selectedItemAvenant_partenaire ={};
                    }
                    else 
                    {    
                      vm.allavenant_partenaire = vm.allavenant_partenaire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_partenaire.id;
                      });
                      vm.showbuttonNouvavenant_partenaire = true;
                    
                    }
                }
                else
                {
                  //avenant_partenaire.partenaire = conve[0];
                  avenant_partenaire.validation =0
                  avenant_partenaire.id  =   String(data.response);              
                  NouvelItemAvenant_partenaire=false;
                  vm.showbuttonNouvavenant_partenaire = false;
                }
              vm.showbuttonValidation_avenant_partenaire = false;
              vm.validation_avenant_partenaire = 0
              avenant_partenaire.$selected = false;
              avenant_partenaire.$edit = false;
              vm.selectedItemAvenant_partenaire = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerAvenant_partenaire = function()
        {
          valideravenantpartenaireinbase(vm.selectedItemAvenant_partenaire,0,1);
        }
        function valideravenantpartenaireinbase(avenant_partenaire,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avenant_partenaire.id,
                    description: avenant_partenaire.description,
                    montant: avenant_partenaire.montant,
                    ref_avenant: avenant_partenaire.ref_avenant,
                    date_signature:convertionDate(new Date(avenant_partenaire.date_signature)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_partenaire_relai/index",datas, config).success(function (data)
            {
                /*avenant_partenaire.validation = validation;
                vm.validation_avenant_partenaire = validation;
                avenant_partenaire.$selected = false;
                avenant_partenaire.$edit = false;
                vm.selectedItemAvenant_partenaire = {};*/
                vm.allavenant_partenaire = vm.allavenant_partenaire.filter(function(obj)
                {
                    return obj.id !== avenant_partenaire.id;
                });
                vm.showbuttonValidation_avenant_partenaire = false;B
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /**********************************************Avenant partenaire***************************************************/
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
            var date_final = null;  
            if(daty!='Invalid Date' && daty!='' && daty!=null)
            {
                console.log(daty);
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                date_final= annee+"-"+mois+"-"+jour;
            }
            return date_final;      
        }
        //format date affichage sur datatable
        vm.formatDate = function (daty)
        {
          if (daty) 
          {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

        }
        vm.affichage_sexe= function (sexe)
        { var affiche='';
          switch (sexe)
          {
            case '1':
                affiche= 'Masculin';
                break;
            case '2':
                affiche= 'Feminin';
                break;
            default:
          }
          return affiche;
        };

        vm.injectDateinInput = function (daty)
        { 
            var date  ='';
            if (daty!=null) 
            {
                date  = new Date(daty);
            }            

            return date;
        }

        vm.formatMillier = function (nombre) 
      {   //var nbr = nombre.toFixed(0);
        var nbr=parseFloat(nombre);
        var n = nbr.toFixed(2);
        var spl= n.split('.');
        var apre_virgule = spl[1];
        var avan_virgule = spl[0];

          if (typeof avan_virgule != 'undefined' && parseInt(avan_virgule) >= 0) {
              avan_virgule += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(avan_virgule)) {
                  avan_virgule = avan_virgule.replace(reg, '$1' + sep + '$2');
              }
              return avan_virgule+","+apre_virgule;
          } else {
              return "0,00";
          }
      }
 
    }
})();
