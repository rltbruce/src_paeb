
(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_feffi_prestataire_etat.convention_suivi_bcaf_etat')
        .directive('customOnChange', function() {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChange);
          element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          ngModel.$setViewValue(files);
        })
        }
      };
    })
    .service('fileUpload', ['$http', function ($http) {
      this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        var rep='test';
        fd.append('file', file);
        $http.post(uploadUrl, fd,{
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        }).success(function(){
           console.log('tafa');
        }).error(function(){
           console.log('Rivotra');
        });
      }
    }])        
        .controller('Convention_suivi_bcaf_etatController', Convention_suivi_bcaf_etatController);
    /** @ngInject */
    function Convention_suivi_bcaf_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
       
        vm.stepMenu_pr=false;
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;
        vm.stepprestaion_pr=false;
        vm.stepimporte_pr = false;
        vm.stepprestation_moe = false;

        vm.stepsuiviexecution = false;
        vm.stepphase = false;
        vm.step_importer_doc_mpe = false;

        vm.stepjusti_d_tra_moe = false;

        vm.stepjusti_trans_reliqua = false;

        vm.stepparticipantdpp=false;
        vm.stepparticipantodc=false;
        vm.stepparticipantemies=false;
        vm.stepparticipantgfpc=false;
        vm.stepparticipantpmc=false;
        vm.stepparticipantsep=false;

        vm.stepsoumissionnaire = false;
        vm.stepattachement = false;

        vm.session = '';

/*******************************Debut initialisation suivi financement feffi******************************/
        

        var NouvelItemDocument_feffi_scan=false;
        
        vm.selectedItemDocument_feffi_scan = {} ;
        vm.alldocument_feffi_scan = [] ;

        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];

        vm.nbr_demande_feffi_creer=0;

        vm.selectedItemAvenant_convention = {} ;
        vm.allavenant_convention = [] ;

        vm.showbuttonValidation_avenant_convention = false;
        vm.permissionboutonvalideravenant_convention = false;    

/*******************************Fin initialisation suivi financement feffi******************************/

/*****************************************Debut partenaire relai****************************************/
  
        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ; 

        vm.selectedItemDocument_pr_scan = {} ;
        vm.alldocument_pr_scan = [] ;

        vm.selectedItemModule_dpp = {} ;
        vm.allmodule_dpp = [] ;

        vm.selectedItemParticipant_dpp = {} ;
        vm.allparticipant_dpp = [] ;

        vm.selectedItemModule_odc = {} ;
        vm.allmodule_odc = [] ;

        vm.selectedItemParticipant_odc = {} ;
        vm.allparticipant_odc = [] ;

        vm.selectedItemModule_emies = {} ;
        vm.allmodule_emies = [] ;
 
        vm.selectedItemParticipant_emies = {} ;
        vm.allparticipant_emies = [] ;

        vm.selectedItemModule_gfpc = {} ;
        vm.allmodule_gfpc = [] ;

        vm.selectedItemParticipant_gfpc = {} ;
        vm.allparticipant_gfpc = [] ;

        vm.selectedItemModule_pmc = {} ;
        vm.allmodule_pmc = [] ;

        vm.selectedItemParticipant_pmc = {} ;
        vm.allparticipant_pmc = [] ;

        vm.selectedItemModule_sep = {} ;
        vm.allmodule_sep = [] ;

        vm.selectedItemParticipant_sep = {} ;
        vm.allparticipant_sep = [] ;

/*********************************************Fin partenaire relai*************************************/

/*******************************************Debut maitrise d'oeuvre*************************************/
        vm.step_importer_doc_moe = false;
        vm.selectedItemPassation_marches_moe = {} ;
        vm.allpassation_marches_moe = [] ;

        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

        vm.selectedItemAvenant_moe = {} ;
        vm.allavenant_moe = [] ;

        vm.selectedItemMemoire_technique = {} ;
        vm.allmemoire_technique = [] ;

        vm.selectedItemAppel_offre = {} ;
        vm.allappel_offre = [] ;

        vm.selectedItemRapport_mensuel = {} ;
        vm.allrapport_mensuel = [] ;
        vm.insererrapport = false;

        vm.selectedItemManuel_gestion = {} ;
        vm.allmanuel_gestion = [] ;

        vm.selectedItemPolice_assurance = {} ;
        vm.allpolice_assurance = [] ;

/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.selectedItemPassation_marches = {} ;
        vm.allpassation_marches = [] ;

        vm.selectedItemMpe_soumissionaire = {} ;
        vm.allmpe_soumissionaire = [] ;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.selectedItemAvenant_mpe = {} ;
        vm.allavenant_mpe = [] ;

        vm.selectedItemDocument_prestataire_scan = {} ;
        vm.alldocument_prestataire_scan = [] ;

        vm.selectedItemDocument_moe_scan = {} ;
        vm.alldocument_moe_scan = [] ;

        vm.selectedItemDelai_travaux = {} ;
        vm.alldelai_travaux = [] ;

        vm.selectedItemPhase_sous_projet = {} ;
        vm.allphase_sous_projet = [] ;

        vm.selectedItemReception_mpe = {} ;
        vm.allreception_mpe = [] ;

        vm.selectedItemAvancement_batiment = {} ;
        vm.allavancement_batiment = [] ;

        vm.selectedItemAvancement_latrine = {} ;
        vm.allavancement_latrine = [] ;

        vm.selectedItemAvancement_mobilier = {} ;
        vm.allavancement_mobilier = [] ;
       
/********************************************Fin entreprise********************************************/

/********************************************Debut indicateur********************************************/        

        vm.selectedItemIndicateur = {} ;
        vm.allindicateur = [] ;

        vm.affiche_load= false;

/********************************************Fin indicateur********************************************/  

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
       
        vm.datenow = new Date();       

       /* vm.allannee =[{annee:"2017"},{annee:"2018"},{annee:"2019"}];
        var last_date = Math.max.apply(Math, vm.allannee.map(function(o){return o.annee;}));
          if (parseInt(last_date)<parseInt(vm.datenow.getFullYear()))
          { i=parseInt(last_date)+1;
            for (i; i < Things.length; i++) {
              Things[i]
            }
            vm.allannee.push({annee: String(vm.datenow.getFullYear())});
            console.log(vm.allannee);
          }*/
        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        }, function error(response){ alert('something went wrong')});

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
            vm.filtre.id_ecole = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.ecoles = result.data.response;
                console.log(vm.ecoles);
              }, function error(result){ alert('something went wrong')});
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
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              switch (vm.roles[0])
                {
                 case 'BCAF':
                            vm.usercisco = result.data.response.cisco; 

                            vm.session = 'BCAF';
                      
                      break;

                  case 'ADMIN':
                            vm.usercisco = result.data.response.cisco; 
                            vm.session = 'ADMIN';                  
                      break;
                  default:
                      break;
              
                }                  

         });

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Site"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        },
        {titre:"Utilisateur"
        }]; 

        vm.importerfiltre =function(filtre)
        {   
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load = true ;
            var repertoire = 'bdd_construction';

            apiFactory.getAPIgeneraliserREST("excel_bdd_construction/index",'menu','getdonneeexporter',
                'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region,'id_cisco',
                filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',
                filtre.id_convention_entete,"repertoire",repertoire).then(function(result)
            {
                vm.status    = result.data.status; 
                console.log(result.data.response);

                if(vm.status)
                {
                    vm.nom_file = result.data.nom_file;            
                    window.location = apiUrlexcel+"bdd_construction/"+vm.nom_file ;
                    vm.affiche_load =false; 

                }else{
                    vm.message=result.data.message;
                    vm.Alert('Export en excel',vm.message);
                    vm.affiche_load =false; 
                }
                console.log(result.data.data);
            });
        }       

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                console.log(vm.allconvention_entete);
            });
                console.log(filtre);
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
           
            /*donnee_menu_pr(item,vm.session).then(function (result) 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_pr=true;
                console.log(result);  
            });
            donnee_menu_moe(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_moe=true;
                console.log(vm.stepMenu_moe);  
            });
            donnee_menu_mpe(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_mpe=true;
                console.log(vm.stepMenu_mpe);  
            });*/

            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });
            donnee_menu_indicateur(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_indicateur=true;
                console.log(vm.stepMenu_indicateur);  
            });
                          
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });
               
              
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              vm.stepprestaion_pr=false;
              vm.stepimporte_pr = false;
              vm.stepprestation_moe = false;
              vm.stepjusti_d_tra_moe = false;
              vm.stepsuiviexecution = false;
              vm.stepphase = false;
              vm.stepsoumissionnaire = false;
              vm.nbr_decaiss_feffi = item.nbr_decaiss_feffi;
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
        vm.step_menu_pr = function()
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_partenaire_relai = result.data.response;
                        console.log(vm.allcontrat_partenaire_relai);
                        return resolve('ok');
                }); 
                vm.styleTabfils = "acc_sous_menu";
                vm.stepimporte_pr = false;
                vm.stepprestaion_pr = false;            
            });
        }
        vm.step_menu_moe = function()
        {
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches_moe = result.data.response;
                    apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                    {
                        vm.allcontrat_moe = result.data.response;
                        return resolve('ok'); 
                    });
                                
                });
                vm.styleTabfils = "acc_sous_menu";
                vm.stepprestation_moe = false;
                vm.step_importer_doc_moe = false;
            });
        }
        vm.step_menu_mpe = function()
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches = result.data.response;
                    console.log(vm.allpassation_marches);
                    apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                    {
                         vm.allcontrat_prestataire = result.data.response;
                        return resolve('ok');
                    });
                }); 
                vm.styleTabfils = "acc_sous_menu";            
            });
        }

      /*  function donnee_menu_pr(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                {
                        vm.allcontrat_partenaire_relai = result.data.response;
                        console.log(vm.allcontrat_partenaire_relai);
                        return resolve('ok');
                });            
            });
        }*/

       /* function donnee_menu_moe(item,session)
        {   vm.showbuttonNouvcontrat_moe=true;
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allpassation_marches_moe = result.data.response;
                    apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                    {
                        vm.allcontrat_moe = result.data.response;
                                    return resolve('ok'); 
                    });
                                
                });
            });
        }*/
        function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                
                apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu','getavenantvalideByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allavenant_convention = result.data.response; 
                    apiFactory.getAPIgeneraliserREST("dossier_feffi/index",'menu','getdocumentvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                    {
                        vm.alldocument_feffi_scan = result.data.response; 
                        return resolve('ok');                                       
                    });                                  
                });          
                vm.nbr_demande_feffi_creer = item.nbr_demande_feffi_creer;            
            });
        
        }
       /* function donnee_menu_mpe(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allpassation_marches = result.data.response;
                    console.log(vm.allpassation_marches);
                    apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                    {
                         vm.allcontrat_prestataire = result.data.response;
                        return resolve('ok');
                    });
                });             
            });
        }*/

        function donnee_menu_indicateur(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurvalideByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allindicateur = result.data.response;
                    return resolve('ok');
                });             
            });
        }
        

   /**********************************************Debut Dossier entreprise***************************************************/
    
        //fonction selection item justificatif batiment
        vm.selectionDocument_feffi_scan= function (item)
        {
            vm.selectedItemDocument_feffi_scan = item;
            vm.validation_document_feffi_scan = item.validation;
            
        };
        $scope.$watch('vm.selectedItemDocument_feffi_scan', function()
        {
             if (!vm.alldocument_feffi_scan) return;
             vm.alldocument_feffi_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_feffi_scan.$selected = true;
        });        

        vm.download_document_feffi_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier entreprise***********************************************/

    /*********************************************fin avenant convention***********************************************/

//col table
        vm.avenant_convention_column = [
        {titre:"Réference avenant"
        },
        {titre:"Description"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        }];
        //Masque de saisi ajout
       
       
        //fonction selection item region
        vm.selectionAvenant_convention= function (item)
        {
            vm.selectedItemAvenant_convention = item;
            //vm.nouvelItemAvenant_convention   = item;
            if (item.id!=0)
            {
                vm.validation_avenant_convention = item.validation;
            }
             
            
        };
        $scope.$watch('vm.selectedItemAvenant_convention', function()
        {
             if (!vm.allavenant_convention) return;
             vm.allavenant_convention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_convention.$selected = true;
        });

  /**********************************************Avenant convention***************************************************/

  
  /*********************************************debut contrat pr**********************************************/ 
      vm.stepcontrat_pr = function()
      {
        vm.stepprestaion_pr=false;
        vm.stepimporte_pr = false;
        vm.styleTabfils = "acc_sous_menu";
      } 
//col table
        vm.contrat_partenaire_relai_column = [
        {titre:"Partenaire relai"
        },
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        }];

               //fonction selection item contrat
        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;

           if(item.id!=0)
           {            
              if (item.$selected==false || item.$selected==undefined)
              {
                  vm.showbuttonValidationcontrat_pr = true;
                  
                    apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_dpp = result.data.response;                          
                          console.log(vm.allmodule_dpp);
                      });
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);
                      });
                      apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_sep = result.data.response;                          
                          console.log(vm.allmodule_sep);
                      });

                    
              }
              vm.validation_contrat_pr = item.validation;
              vm.stepprestaion_pr=true;
              vm.stepimporte_pr = true;
              /*apiFactory.getAPIgeneraliserREST("situation_participant_odc/index",'id_classification_site',vm.selectedItemConvention_entete.site.id_classification_site).then(function(result)
              {
                  vm.allsituation_participant_odc = result.data.response;
              });*/
              
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

       
/*****************************************fin contrat_partenaire_relai********************************************/

/**********************************************Debut Dossier entreprise***************************************************/
    vm.step_importer_doc_pr = function()
    {
        apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocumentvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
        {
            vm.alldocument_pr_scan = result.data.response;                                        
        });
        vm.styleTabfils = "acc_sous_menu";
    }
        //fonction selection item justificatif batiment
        vm.selectionDocument_pr_scan= function (item)
        {
            vm.selectedItemDocument_pr_scan = item;
            vm.validation_document_pr_scan = item.validation;
            
        };
        $scope.$watch('vm.selectedItemDocument_pr_scan', function()
        {
             if (!vm.alldocument_pr_scan) return;
             vm.alldocument_pr_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_pr_scan.$selected = true;
        });

    /******************************************debut dossier entreprise***********************************************/


/*******************************************debut formation dpp**************************************************/
        vm.step_prestation_pr = function()
        {
            vm.styleTabfils = "acc_menu";
        }
//col table
        vm.module_dpp_column = [
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_dpp"
        },
        {titre:"Nombre de participant_dpp"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];
       
        //fonction selection item region
        vm.selectionModule_dpp= function (item)
        {
            vm.selectedItemModule_dpp = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_dpp/index",'id_module_dpp',vm.selectedItemModule_dpp.id).then(function(result)
              {
                  vm.allparticipant_dpp = result.data.response; 
                  console.log( vm.allparticipant_dpp);
              });
              vm.validation_formationdpp =item.validation;
              vm.stepparticipantdpp=true;              
            }
        };
        $scope.$watch('vm.selectedItemModule_dpp', function()
        {
             if (!vm.allmodule_dpp) return;
             vm.allmodule_dpp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_dpp.$selected = true;
        });
        
/*********************************************fin formation dpp**************************************************/

/**********************************debut participant_dpp****************************************/
//col table
        vm.participant_dpp_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

       
        //fonction selection item region
        vm.selectionParticipant_dpp= function (item)
        {
            vm.selectedItemParticipant_dpp = item;
            if(item.$selected==false)
            {
              vm.stepparticipantdpp=true;
            } 
        };
        $scope.$watch('vm.selectedItemParticipant_dpp', function()
        {
             if (!vm.allparticipant_dpp) return;
             vm.allparticipant_dpp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_dpp.$selected = true;
        });

        
/*******************************************fin participant*****************************************************/

/*******************************************debut formation odc**************************************************/
//col table
        vm.module_odc_column = [
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_odc"
        },
        {titre:"Nombre de participant_odc"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];
 
        
        //fonction selection item region
        vm.selectionModule_odc= function (item)
        {
            vm.selectedItemModule_odc = item;
            vm.nouvelItemModule_odc   = item;
            vm.showbuttonNouvRapport =true;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_odc/index",'id_module_odc',vm.selectedItemModule_odc.id).then(function(result)
              {
                  vm.allparticipant_odc = result.data.response; 
                  console.log( vm.allparticipant_odc);
              });
              vm.validation_formationodc =item.validation;
              vm.stepparticipantodc=true;             
            }
        };
        $scope.$watch('vm.selectedItemModule_odc', function()
        {
             if (!vm.allmodule_odc) return;
             vm.allmodule_odc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_odc.$selected = true;
        });

        
/*********************************************fin formation odc**************************************************/

/******************************************debut participant_odc****************************************/
//col table
        vm.participant_odc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

       
        //fonction selection item region
        vm.selectionParticipant_odc= function (item)
        {
            vm.selectedItemParticipant_odc = item;
        };
        $scope.$watch('vm.selectedItemParticipant_odc', function()
        {
             if (!vm.allparticipant_odc) return;
             vm.allparticipant_odc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_odc.$selected = true;
        });

        
  /**********************************Fin participant odc****************************************/

/*******************************************debut formation emies**************************************************/
//col table
        vm.module_emies_column = [
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_emies"
        },
        {titre:"Nombre de participant_emies"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];
        
        //fonction selection item region
        vm.selectionModule_emies= function (item)
        {
            vm.selectedItemModule_emies = item;
            vm.nouvelItemModule_emies   = item;
            vm.showbuttonNouvRapport =true;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_emies/index",'id_module_emies',vm.selectedItemModule_emies.id).then(function(result)
              {
                  vm.allparticipant_emies = result.data.response; 
                  console.log( vm.allparticipant_emies);
              });
              vm.validation_formationemies =item.validation;
              vm.stepparticipantemies=true;              
            }
              vm.showbuttonValidationformemies = true;
        };
        $scope.$watch('vm.selectedItemModule_emies', function()
        {
             if (!vm.allmodule_emies) return;
             vm.allmodule_emies.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_emies.$selected = true;
        });

        
/*********************************************fin formation emies**************************************************/

/******************************************debut participant_emies*************************************************/
//col table
        vm.participant_emies_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

        
        //fonction selection item region
        vm.selectionParticipant_emies= function (item)
        {
            vm.selectedItemParticipant_emies = item;
        };
        $scope.$watch('vm.selectedItemParticipant_emies', function()
        {
             if (!vm.allparticipant_emies) return;
             vm.allparticipant_emies.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_emies.$selected = true;
        });

        
/******************************************fin participant emies****************************************************/

/*******************************************debut formation gfpc**************************************************/
//col table
        vm.module_gfpc_column = [
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_gfpc"
        },
        {titre:"Nombre de participant_gfpc"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];

        
        //fonction selection item region
        vm.selectionModule_gfpc= function (item)
        {
            vm.selectedItemModule_gfpc = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_gfpc/index",'id_module_gfpc',vm.selectedItemModule_gfpc.id).then(function(result)
              {
                  vm.allparticipant_gfpc = result.data.response; 
                  console.log( vm.allparticipant_gfpc);
              });
              vm.validation_formationgfpc =item.validation; 
              vm.stepparticipantgfpc=true;             
            }
              vm.showbuttonValidationformgfpc = true;
        };
        $scope.$watch('vm.selectedItemModule_gfpc', function()
        {
             if (!vm.allmodule_gfpc) return;
             vm.allmodule_gfpc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_gfpc.$selected = true;
        });

       
/*********************************************fin formation gfpc**************************************************/

/*****************************************debut participant_gfpc********************************************/
//col table
        vm.participant_gfpc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

        
        //fonction selection item region
        vm.selectionParticipant_gfpc= function (item)
        {
            vm.selectedItemParticipant_gfpc = item; 
        };
        $scope.$watch('vm.selectedItemParticipant_gfpc', function()
        {
             if (!vm.allparticipant_gfpc) return;
             vm.allparticipant_gfpc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_gfpc.$selected = true;
        });        

/*******************************************Fin participant gfpc***********************************************/

/*******************************************debut formation pmc**************************************************/
//col table
        vm.module_pmc_column = [
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_pmc"
        },
        {titre:"Nombre de participant_pmc"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];


        //fonction selection item region
        vm.selectionModule_pmc= function (item)
        {
            vm.selectedItemModule_pmc = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_pmc/index",'id_module_pmc',vm.selectedItemModule_pmc.id).then(function(result)
              {
                  vm.allparticipant_pmc = result.data.response; 
                  console.log( vm.allparticipant_pmc);
              });
              vm.validation_formationpmc =item.validation;
              vm.stepparticipantpmc=true;              
            }
        };
        $scope.$watch('vm.selectedItemModule_pmc', function()
        {
             if (!vm.allmodule_pmc) return;
             vm.allmodule_pmc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_pmc.$selected = true;
        });
        
/*********************************************fin formation pmc**************************************************/

/**********************************debut participant_pmc****************************************/
//col table
        vm.participant_pmc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

       
        //fonction selection item region
        vm.selectionParticipant_pmc= function (item)
        {
            vm.selectedItemParticipant_pmc = item;
        };
        $scope.$watch('vm.selectedItemParticipant_pmc', function()
        {
             if (!vm.allparticipant_pmc) return;
             vm.allparticipant_pmc.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_pmc.$selected = true;
        });        

/********************************************fin participant pmc**************************************************/

/*******************************************debut formation sep**************************************************/
//col table
        vm.module_sep_column = [
        {titre:"Date debut previsionnelle formation"
        },
        {titre:"Date fin previsionnelle formation"
        },
        {titre:"Date prévisionnelle restitution"
        },
        {titre:"Date début réelle formation"
        },
        {titre:"Date fin réelle de la formation"
        },
        {titre:"Date réelle de restitution"
        },
        {titre:"Nombre prévisionnel participant_sep"
        },
        {titre:"Nombre de participant_sep"
        },
        {titre:"Nombre prévisionnel de femme"
        },
        {titre:"Nombre réel de femme"
        },
        {titre:"Lieu de formation"
        },
        {titre:"Observation"
        }];

                //fonction selection item region
        vm.selectionModule_sep= function (item)
        {
            vm.selectedItemModule_sep = item;
            if (item.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("participant_sep/index",'id_module_sep',vm.selectedItemModule_sep.id).then(function(result)
              {
                  vm.allparticipant_sep = result.data.response; 
                  console.log( vm.allparticipant_sep);
              });
              vm.validation_formationsep =item.validation;
              vm.stepparticipantsep=true;              
            }
        };
        $scope.$watch('vm.selectedItemModule_sep', function()
        {
             if (!vm.allmodule_sep) return;
             vm.allmodule_sep.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemModule_sep.$selected = true;
        });

/*********************************************fin formation sep**************************************************/

/**********************************debut participant_sep****************************************/
//col table
        vm.participant_sep_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"}]; 

       
        //fonction selection item region
        vm.selectionParticipant_sep= function (item)
        {
            vm.selectedItemParticipant_sep = item;
        };
        $scope.$watch('vm.selectedItemParticipant_sep', function()
        {
             if (!vm.allparticipant_sep) return;
             vm.allparticipant_sep.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemParticipant_sep.$selected = true;
        });

        
  /******************************************fin participant sep*********************************************************/

  /******************************************debut maitrise d'oeuvre*****************************************************/
        vm.step_prestation_moe = function()
        {            
            vm.styleTabfils = "acc_menu";
        }
      /**************************************fin passation marchés***************************************************/
        vm.steppassation_marches_moe = function()
        {            
            vm.styleTabfils = "acc_sous_menu";
        }
        //col table
        vm.passation_marches_moe_column = [
        {titre:"Date shortlist"
        },
        {titre:"Date Appel manifestation"
        },
        {titre:"Date lancement DP"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre plis reçu"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Statut"
        },
        {titre:"Observation"
        }];
    
       
        //fonction selection item region
        vm.selectionPassation_marches_moe= function (item)
        {
            vm.selectedItemPassation_marches_moe = item;
            if (item.id!=0)
            {
              vm.validation_passation_moe = item.validation;
            }
            
        };
        $scope.$watch('vm.selectedItemPassation_marches_moe', function()
        {
             if (!vm.allpassation_marches_moe) return;
             vm.allpassation_marches_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPassation_marches_moe.$selected = true;
        });

        vm.affichageStatut= function(statut)
        { var stat= '';
          switch (statut)
            {
              case '1':
                 stat = 'BE';
 
                  break;
              
              case '2':
                   stat = 'CI';
                  break;

              default:
          
            }
         return stat;   
        }
      /**************************************fin passation marchés***************************************************/

      /**************************************fin contrat moe***************************************************/
        vm.step_contrat_moe = function (item,session)
        {   
            vm.styleTabfils = "acc_sous_menu";
        }
      //col table
        vm.contrat_moe_column = [
        {titre:"Bureau d'etude"
        },
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        }];
     
        
        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;

           if(item.id!=0)
           {
              if (item.$selected==false || item.$selected==undefined)
              {                  
                  apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoirevalideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmemoire_technique = result.data.response;                           
                      }); 
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelvalideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allappel_offre = result.data.response;                            
                      });
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportvalideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allrapport_mensuel = result.data.response;                            
                      });

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelvalideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmanuel_gestion = result.data.response;                            
                      });
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpolicevalideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                    {
                          vm.allpolice_assurance = result.data.response;                                                   
                    });
                     
                     apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.allavenant_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocumentvalideBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                        vm.alldocument_moe_scan = result.data.response;                                        
                    });
                }
            vm.validation_contrat_moe = item.validation;
            vm.stepprestation_moe = true;            
            vm.step_importer_doc_moe = true;
            //console.log(item);
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_moe', function()
        {
             if (!vm.allcontrat_moe) return;
             vm.allcontrat_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_moe.$selected = true;
        });
        
      /*****************************************fin contrat moe******************************************************/

       /**********************************************Debut Dossier entreprise***************************************************/
        
         vm.step_importerdocument_moe = function()
            {
            
            vm.styleTabfils = "acc_sous_menu";
            }
        //fonction selection item justificatif batiment
        vm.selectionDocument_moe_scan= function (item)
        {
            vm.selectedItemDocument_moe_scan = item;
            vm.validation_document_moe_scan = item.validation;
            
        };
        $scope.$watch('vm.selectedItemDocument_moe_scan', function()
        {
             if (!vm.alldocument_moe_scan) return;
             vm.alldocument_moe_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_moe_scan.$selected = true;
        });

        vm.download_document_moe_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier entreprise***********************************************/

    /*********************************************fin avenant moe***********************************************/
        vm.step_avenant_moe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
//col table
        vm.avenant_moe_column = [
        {titre:"Description"
        },
        {titre:"Référence avenant"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        }];
 
        
        //fonction selection item region
        vm.selectionAvenant_moe= function (item)
        {
            vm.selectedItemAvenant_moe = item;
            //vm.nouvelItemAvenant_moe   = item;
            if (item.id!=0)
            {
                vm.validation_avenant_moe = item.validation;
            }
             
            
        };
        $scope.$watch('vm.selectedItemAvenant_moe', function()
        {
             if (!vm.allavenant_moe) return;
             vm.allavenant_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_moe.$selected = true;
        });

  /**********************************************Avenant moe***************************************************/

      /**************************************fin memoire technique***************************************************/
     
        //fonction selection item justificatif batiment
        vm.selectionMemoire_technique= function (item)
        {
            vm.selectedItemMemoire_technique = item;            
        };
        $scope.$watch('vm.selectedItemMemoire_technique', function()
        {
             if (!vm.allmemoire_technique) return;
             vm.allmemoire_technique.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMemoire_technique.$selected = true;
        });
        
      /**************************************fin memoire technique***************************************************/

      /**************************************Debut appel d'offre*****************************************************/       
       
        //fonction selection item justificatif batiment
        vm.selectionAppel_offre= function (item)
        {
            vm.selectedItemAppel_offre = item;
            vm.nouvelItemAppel_offre   = item;
            if (item.id !=0)
            {
              vm.validation_appel_offre =item.validation;
            }
            
        };
        $scope.$watch('vm.selectedItemAppel_offre', function()
        {
             if (!vm.allappel_offre) return;
             vm.allappel_offre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAppel_offre.$selected = true;
        });
       
      /**************************************Fin appel d'offre*******************************************************/


      /**************************************Debut rapport mensuel***************************************************/
       
        
        //fonction selection item justificatif batiment
        vm.selectionRapport_mensuel= function (item)
        {
            vm.selectedItemRapport_mensuel = item;
        };
        $scope.$watch('vm.selectedItemRapport_mensuel', function()
        {
             if (!vm.allrapport_mensuel) return;
             vm.allrapport_mensuel.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRapport_mensuel.$selected = true;
        });
        
         vm.affichage_numero = function(numero)
        {   var affichage ='';
            switch (parseInt(numero))
              {
                case 1:
                     return affichage='Rapport 1';                                                          
                    break;
               
                case 2:
                     return affichage='Rapport 2';                                                           
                    break;
                
                case 3:
                     return affichage='Rapport 3';                                                           
                    break;
                
                case 4:
                     return affichage='Rapport 4';                                                           
                    break;
                default:
                    break;
            
              }
              return affichage;
        }
       
      /**************************************Fin rapport mensuel***************************************************/

      /**************************************Debut manuel gestion***************************************************/
        
        //fonction selection item justificatif batiment
        vm.selectionManuel_gestion= function (item)
        {
            vm.selectedItemManuel_gestion = item;
        };
        $scope.$watch('vm.selectedItemManuel_gestion', function()
        {
             if (!vm.allmanuel_gestion) return;
             vm.allmanuel_gestion.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemManuel_gestion.$selected = true;
        });

        
      /**************************************Fin manuel gestion***************************************************/

      /**************************************Fin police d'assurance*************************************************/
        
        //fonction selection item justificatif batiment
        vm.selectionPolice_assurance= function (item)
        {
            vm.selectedItemPolice_assurance = item;
            if (item.id !=0)
            {
              vm.validation_police_assurance =item.validation;
            }
        };
        $scope.$watch('vm.selectedItemPolice_assurance', function()
        {
             if (!vm.allpolice_assurance) return;
             vm.allpolice_assurance.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPolice_assurance.$selected = true;
        });

        
      /**************************************Debut police d'assurance***********************************************/
           
   
/**********************************debut passation_marches****************************************/
        vm.click_passation_marches_mpe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
//col table
        vm.passation_marches_column = [
        {titre:"Date lancement"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre offre reçu"
        },
        {titre:"montant moins chere"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date OS"
        },
        {titre:"Observention"
        }];
        //Masque de saisi ajout
 
       
        //fonction selection item region
        vm.selectionPassation_marches= function (item)
        {
            vm.selectedItemPassation_marches = item;
            
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("mpe_soumissionaire/index",'id_passation_marches',vm.selectedItemPassation_marches.id).then(function(result)
            {
                vm.allmpe_soumissionaire = result.data.response;
            });

            vm.validation_passation = item.validation;
            vm.stepsoumissionnaire = true;
           }
             
        };
        $scope.$watch('vm.selectedItemPassation_marches', function()
        {
             if (!vm.allpassation_marches) return;
             vm.allpassation_marches.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPassation_marches.$selected = true;
        });

        
/**********************************fin passation_marches****************************************/

/**********************************debut sousmissionnaire****************************************/
        vm.click_mpe_soumissionaire = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
    vm.mpe_soumissionaire_column = [
        {titre:"MPE sousmissionnaire"
        },
        {titre:"Telephone"
        },
        {titre:"Siège"
        }];

        
        //fonction selection item region
        vm.selectionMpe_soumissionaire= function (item)
        {
            vm.selectedItemMpe_soumissionaire = item;
        };
        $scope.$watch('vm.selectedItemMpe_soumissionaire', function()
        {
             if (!vm.allmpe_soumissionaire) return;
             vm.allmpe_soumissionaire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMpe_soumissionaire.$selected = true;
        });
/**********************************fin sousmissionnaire****************************************/

/**********************************debut contrat prestataire****************************************/
        vm.click_contrat_mpe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
//col table
        vm.contrat_prestataire_column = [
        {titre:"Prestataire"
        },
        {titre:"Description"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        }];
        //Masque de saisi ajout
       
        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;            

           if(item.id!=0)
           {
            vm.validation_contrat_prestataire = item.validation;
              apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.alldelai_travaux = result.data.response;                              
                          });
                          apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpevalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.allreception_mpe = result.data.response;                              
                          });

                          apiFactory.getAPIgeneraliserREST("avancement_batiment/index",'menu','getavancementvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.allavancement_batiment = result.data.response;                              
                          });

                          apiFactory.getAPIgeneraliserREST("avancement_latrine/index",'menu','getavancementvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.allavancement_latrine = result.data.response;                              
                          });

                          apiFactory.getAPIgeneraliserREST("avancement_mobilier/index",'menu','getavancementvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.allavancement_mobilier = result.data.response;                              
                          });
                          
                            apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.allavenant_mpe = result.data.response;
                            });

                            apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocumentvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                           {
                                vm.alldocument_prestataire_scan = result.data.response;                                        
                           }); 
              
           }
           vm.stepsuiviexecution = true;
           vm.stepavenant_mpe = true;
           vm.stepattachement = true; 
           vm.step_importer_doc_mpe = true; 
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
        
/**********************************fin contrat_prestataire****************************************/

 /*********************************************fin avenant mpe***********************************************/
        vm.click_avenant_mpe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
//col table
        vm.avenant_mpe_column = [
        {titre:"Description"
        },
        {titre:"Référence avenant"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        }];
 
        
        //fonction selection item region
        vm.selectionAvenant_mpe= function (item)
        {
            vm.selectedItemAvenant_mpe = item;
            //vm.nouvelItemAvenant_mpe   = item;
            if (item.id!=0)
            {
                vm.validation_avenant_mpe = item.validation;
            }
             
            
        };
        $scope.$watch('vm.selectedItemAvenant_mpe', function()
        {
             if (!vm.allavenant_mpe) return;
             vm.allavenant_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_mpe.$selected = true;
        });

        
    /**********************************************Fin Avenant mpe***************************************************/
    
    /**********************************************Debut Dossier entreprise***************************************************/
         vm.click_importer_doc_mpe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }   
            //fonction selection item justificatif batiment
        vm.selectionDocument_prestataire_scan= function (item)
        {
            vm.selectedItemDocument_prestataire_scan = item;
            vm.validation_document_prestataire_scan = item.validation;
            
        };
        $scope.$watch('vm.selectedItemDocument_prestataire_scan', function()
        {
             if (!vm.alldocument_prestataire_scan) return;
             vm.alldocument_prestataire_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_prestataire_scan.$selected = true;
        });
        
        vm.download_document_prestataire_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier entreprise***********************************************/

    /******************************************debut delai travaux***********************************************/
        vm.clicksuivi_travaux = function()
        {
            vm.styleTabfils = "acc_menu";
        }
    //col table
        vm.delai_travaux_column = [
        {titre:"Date prevu debut travaux"
        },
        {titre:"Date réel debut travaux"
        },
        {titre:"Date d'expiration police d'assurance"
        },
        {titre:"Delai d'éxecution"
        }];
         
        //fonction selection item contrat
        vm.selectionDelai_travaux= function (item)
        {
            vm.selectedItemDelai_travaux = item;
           if(item.id!=0)
           {  
              apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                {
                    vm.allphase_sous_projet = result.data.response;
                                //vm.stepphase = true;
                }); 
              vm.stepphase =true;
              vm.validation_delai_travaux = item.validation;
           }
             
        };
        $scope.$watch('vm.selectedItemDelai_travaux', function()
        {
             if (!vm.alldelai_travaux) return;
             vm.alldelai_travaux.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDelai_travaux.$selected = true;
        });
        
/**********************************fin eelai_travaux****************************************/
/**********************************debut passation_marches****************************************/
   
        //col table
        vm.phase_sous_projet_column = [
        {titre:"Phase sous projet"
        },
        {titre:"Description"
        },
        {titre:"Date"
        }];

        
        //fonction selection item region
        vm.selectionPhase_sous_projet= function (item)
        {
            vm.selectedItemPhase_sous_projet = item;
            
           if(item.id!=0)
           {
            vm.validation_phase_sous_projet = item.validation;
           }
             
        };
        $scope.$watch('vm.selectedItemPhase_sous_projet', function()
        {
             if (!vm.allphase_sous_projet) return;
             vm.allphase_sous_projet.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPhase_sous_projet.$selected = true;
        });
        
/**********************************fin phase_sous_projet****************************************/


/*************************************************debut reception************************************************/
    vm.reception_mpe_column = [        
        {titre:"Date prévisionnelle réception technique"
        },
        {titre:"Date réelle de réception technique"
        },
        {titre:"Date levée des réserves de la réception technique"
        },
        {titre:"Date prévisionnelle réception provisoire"
        },
        {titre:"Date réelle réception provisoire"
        },
        {titre:"Date prévisionnelle de levée des réserves avant RD"
        },
        {titre:"Date réelle de levée des réserves avant RD"
        },
        {titre:"Date prévisionnelle réception définitive"
        },
        {titre:"Date réelle réception définitive"
        },
        {titre:"Observation"
        }];        //Masque de saisi ajout

        
        //fonction selection item region
        vm.selectionReception_mpe= function (item)
        {
            vm.selectedItemReception_mpe = item;

            if (item.id!=0) 
            {
              vm.validation_reception_mpe = item.validation;
            }
            
             
        };
        $scope.$watch('vm.selectedItemReception_mpe', function()
        {
             if (!vm.allreception_mpe) return;
             vm.allreception_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemReception_mpe.$selected = true;
        });

        
/************************************************fin reception***************************************************/

/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_batiment_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Attachement"
        },
        //{titre:"Ponderation"
        //},
        {titre:"Date"
        },
        {titre:"Observation"
        }];
            
        //fonction selection item region
        vm.selectionAvancement_batiment= function (item)
        {
            vm.selectedItemAvancement_batiment = item;
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_batiment_doc/index",'id_avancement_batiment',vm.selectedItemAvancement_batiment.id).then(function(result)
            {
                vm.allavancement_batiment_doc = result.data.response;
                console.log(vm.allavancement_batiment_doc);
            });       

           }
              vm.validation_avancement_batiment = item.validation; 
             console.log(vm.validation_avancement_batiment); 
             console.log(item.validation);
        };
        $scope.$watch('vm.selectedItemAvancement_batiment', function()
        {
             if (!vm.allavancement_batiment) return;
             vm.allavancement_batiment.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_batiment.$selected = true;
        });

       
/*********************************************fin avancement batiment************************************************/

/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_latrine_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Attachement"
        },
        //{titre:"Ponderation"
        //},
        {titre:"Date"
        },
        {titre:"Observation"
        }];
        
        //fonction selection item region
        vm.selectionAvancement_latrine= function (item)
        {
            vm.selectedItemAvancement_latrine = item;
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_latrine_doc/index",'id_avancement_latrine',vm.selectedItemAvancement_latrine.id).then(function(result)
            {
                vm.allavancement_latrine_doc = result.data.response;
                console.log(vm.allavancement_latrine_doc);
            });       

           }
              vm.validation_avancement_latrine = item.validation; 
             console.log(vm.validation_avancement_latrine); 
             console.log(item.validation);
        };
        $scope.$watch('vm.selectedItemAvancement_latrine', function()
        {
             if (!vm.allavancement_latrine) return;
             vm.allavancement_latrine.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_latrine.$selected = true;
        });

        
/*********************************************fin avancement batiment************************************************/
/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_mobilier_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Attachement"
        },
        //{titre:"Ponderation"
        //},
        {titre:"Date"
        },
        {titre:"Observation"
        }];
           
        //fonction selection item region
        vm.selectionAvancement_mobilier= function (item)
        {
            vm.selectedItemAvancement_mobilier = item;
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_mobilier_doc/index",'id_avancement_mobilier',vm.selectedItemAvancement_mobilier.id).then(function(result)
            {
                vm.allavancement_mobilier_doc = result.data.response;
                console.log(vm.allavancement_mobilier_doc);
            });         

           }
              vm.validation_avancement_mobilier = item.validation; 
             console.log(vm.validation_avancement_mobilier); 
             console.log(item.validation);
        };
        $scope.$watch('vm.selectedItemAvancement_mobilier', function()
        {
             if (!vm.allavancement_mobilier) return;
             vm.allavancement_mobilier.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvancement_mobilier.$selected = true;
        });
        
/*********************************************fin avancement mobilier************************************************/

    /*********************************************Debut indicateur************************************************/

    vm.indicateur_column = [
        {titre:"Nombre salle"
        },
        {titre:"Nombre bénéficiaire"
        },
        {titre:"Nombre école"
        },
        {titre:"Nombre box"
        },
        {titre:"Nombre point d'eau"
        },
        {titre:"Nombre banc"
        },
        {titre:"Nombre table maitre"
        },
        {titre:"Nombre chaise"
        },
        {titre:"Observation"
        }];
   
        
        //fonction selection item region
        vm.selectionIndicateur= function (item)
        {
            vm.selectedItemIndicateur = item;
            //vm.nouvelItem   = item;
            console.log(item);
            if (parseInt(item.id)!=0)
            {
                vm.validation_indicateur = item.validation;  
            }
            
           // vm.allindicateur= [] ; 
        };
        $scope.$watch('vm.selectedItemIndicateur', function()
        {
             if (!vm.allindicateur) return;
             vm.allindicateur.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemIndicateur.$selected = true;
        });
        
    /*********************************************Fin indicateur************************************************/



  /******************************************fin maitrise d'oeuvre*******************************************************/
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
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
 
    }
})();
