
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
        vm.styleTabfils = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

        vm.affiche_load =false;
       
        vm.stepMenu_pr=false;
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;
        vm.stepprestaion_pr=false;
        vm.stepdoc_pr=false;
        vm.stepprestation_moe = false;
        vm.stepdoc_moe=false;
        vm.tabpartenaire = false;
        vm.tabmaitrise = false;
        vm.tabentreprise = false;

        vm.stepsuiviexecution = false;
        vm.stepphase = false;

        vm.stepparticipantdpp=false;
        vm.stepparticipantodc=false;
        vm.stepparticipantemies=false;
        vm.stepparticipantgfpc=false;
        vm.stepparticipantpmc=false;
        vm.stepparticipantsep=false;

        vm.stepsoumissionnaire = false;

        vm.stepattachement=false;
        vm.stepcalendrier_paie_moe=false;
        vm.sousrubrique_calendrier=false;
        vm.calendrier_prevu=false;

        vm.session = '';

/*****************************************Debut partenaire relai****************************************/
      
       /*****************************************Debut partenaire relai****************************************/

        vm.selectedItemPassation_marches_pr = {} ;
        vm.allpassation_marches_pr = [] ;
     
        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ; 

        vm.selectedItemAvenant_partenaire = {} ;
        vm.allavenant_partenaire = [] ;

            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false;       

/********************************************Fin importer passation************************************/
        vm.affiche_load= false; 
/********************************************Fin importer passation*************************************/ 
   
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

        vm.selectedItemPassation_marches_moe = {} ;
        vm.allpassation_marches_moe = [] ;

        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;


        vm.allrubrique_calendrier_paie_moe = [];
        vm.selectedItemRubrique_calendrier_paie_moe = {};

        vm.allsousrubrique_calendrier_paie_moe = [];
        vm.selectedItemSousrubrique_calendrier_paie_moe = {};

        vm.selectedItemAvenant_moe = {} ;
        vm.allavenant_moe = [] ;

        vm.selectedItemMemoire_technique = {} ;
        vm.allmemoire_technique = [] ;

        vm.selectedItemAppel_offre = {} ;
        vm.allappel_offre = [] ;

        vm.selectedItemRapport_mensuel = {} ;
        vm.allrapport_mensuel = [] ;

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

        vm.allrubrique_attachement_batiment_mpe = [];
        vm.selectedItemRubrique_attachement_batiment_mpe = {};

        vm.selectedItemDivers_attachement_batiment_prevu = {} ;

        vm.allrubrique_attachement_latrine_mpe = [];
        vm.selectedItemRubrique_attachement_latrine_mpe = {};

        vm.selectedItemDivers_attachement_latrine_prevu = {} ;

        vm.allrubrique_attachement_mobilier_mpe = [];
        vm.selectedItemRubrique_attachement_mobilier_mpe = {};

        vm.selectedItemDivers_attachement_mobilier_prevu = {} ;

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

        vm.datenow = new Date();

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
                  }, function error(result){ alert('something went wrong')});
            }
        }
        var id_user = $cookieStore.get('id');
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;              
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("AAC")!= -1)
            {
                vm.showbuttonNeauveaudemandefeffi=true;                            
                vm.session = 'AAC';
            }
            if (utilisateur.roles.indexOf("ADMIN")!= -1)
            {
                vm.showbuttonNeauveaudemandefeffi=true;                            
                vm.session = 'ADMIN';
            }                 

         });

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Code sous projet site"
        },
        {titre:"Accés site"
        },
        {titre:"Référence convention"
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
            vm.stepMenu_pr=true;                  
            vm.stepMenu_moe=true;                  
            vm.stepMenu_mpe=true;                    
            vm.stepMenu_feffi=true;                   
            vm.stepMenu_indicateur=true;

            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig';
               
              
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              vm.stepprestaion_pr=false;
                vm.stepdoc_pr=false;
              vm.stepprestation_moe = false;
              vm.stepjusti_d_tra_moe = false;
                vm.stepdoc_moe=false;
              vm.stepsuiviexecution = false;
              vm.stepphase = false;
              vm.stepsoumissionnaire = false; 
              vm.stepattachement =false;                       

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
        vm.step_menu_mpe = function ()
        {   vm.tabentreprise = true;
            vm.affiche_load = true;
            vm.stepsoumissionnaire = false;
            vm.step_detail_contrat_mpe = false;
            vm.stepattachement = false;
            vm.stepsuiviexecution = false;
            vm.stepavenant_mpe = false;
            vm.step_importer_doc_mpe = false;
                apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches = result.data.response.filter(function(obj)
                    {
                           return obj.validation == 1;
                    });
                    vm.step_detail_contrat_mpe = true;
                    vm.affiche_load = false;
                });
           
        }

        vm.step_click_menu_pr =function ()
        {   
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
                        return obj.validation == 1;
                    });
                        vm.affiche_load = false;
                    vm.stepcontrat_pr = true;
                });        
          
            
        }

        /*******************************************debut importer passation*************************************************/

        
        $scope.uploadFile_passation_pr = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_passation_pr = files;
        }
        vm.annulerimporter_passation_pr = function()
        {
            vm.fichier_passation_pr = {};
        }
    /*******************************************fin importer passation***************************************************/

  /********************************************Debut passation de marcher*********************************************/
            
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
        }];
       

        //fonction selection item region
        vm.selectionPassation_marches_pr= function (item)
        {
            vm.selectedItemPassation_marches_pr = item;
              vm.validation_passation_pr = item.validation;
            
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

        
  /*****************************************fin contrat de marcher**************************************************/

   /*******************************************debut importer contrat*************************************************/

        
        $scope.uploadFile_contrat_pr = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_contrat_pr = files;
        }
        
    /*******************************************fin importer passation***************************************************/


  /*********************************************debut contrat pr**********************************************/
        vm.step_click_contrat_pr =function ()
        {  
            vm.affiche_load = true;
            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false;
            apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(resultc)
            {
                 vm.allcontrat_partenaire_relai = resultc.data.response;
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
        }];

        

        //fonction selection item contrat
        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;
            vm.stepavenant_pr = true;
            vm.stepprestaion_pr = true;
            vm.stepdoc_pr = true;
            vm.stepprestaion_pr=true;
            vm.stepdoc_pr=true
            vm.validation_contrat_pr = item.validation;
             
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

/*********************************************fin avenant partenaire***********************************************/
vm.click_step_avenant_pr = function()
{   
    vm.affiche_load = true;
    apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
    {
        vm.allavenant_partenaire = result.data.response.filter(function(obj)
        {
            return obj.validation == 1;
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
        }];
        
        //fonction selection item region
        vm.selectionAvenant_partenaire= function (item)
        {
            vm.selectedItemAvenant_partenaire = item;
            //vm.nouvelItemAvenant_partenaire   = item;
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

  /**********************************************Avenant partenaire***************************************************/


/**********************************************Debut Dossier partenaire relais***************************************************/
    

        vm.step_importer_doc_pr = function()
        {   
            vm.affiche_load = true;
             apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocumentvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
             {
                vm.alldocument_pr_scan = result.data.response; 
                vm.affiche_load = false;                                       
            });
        }
    //vm.myFile = [];
     $scope.uploadFile_doc_pr = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemDocument_pr_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_pr_scan.fichier);
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

        vm.download_document_pr_scan = function(item)
        {
            window.open(apiUrlFile+item.fichier);
        }
       
    /******************************************debut dossier partenaire relai***********************************************/
    /*******************************************debut importer passation moe*************************************************/
        
        $scope.uploadFile_module_dpp = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_dpp = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

        vm.step_prestation_pr = function()
        {
            vm.affiche_load = true;
            vm.step_onglet_odc = false;
            vm.step_onglet_emies = false;
            vm.step_onglet_gfpc = false;
            vm.step_onglet_pmc = false;
            vm.step_onglet_sep = false;
            vm.stepparticipantdpp = false;
            vm.stepparticipantodc = false;
            vm.stepparticipantemies = false;
            vm.stepparticipantgfpc = false;
            vm.stepparticipantpmc = false;
            vm.stepparticipantsep = false;
            apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_dpp = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                }); 
                vm.affiche_load = false;
                vm.step_onglet_odc = true;
                vm.step_onglet_emies = true;
                vm.step_onglet_gfpc = true;
                vm.step_onglet_pmc = true;
                vm.step_onglet_sep = true;
            });
        }
        vm.step_module_dpp = function()
        {   
            vm.stepparticipantdpp = false;
           apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_dpp = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
            }); 
        }
        vm.step_module_odc = function()
        {   
            vm.stepparticipantodc = false;
            apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                 vm.allmodule_odc = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
            });
        }

        vm.step_module_emies = function()
        {
            vm.stepparticipantemies = false;
            apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleinvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_emies = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                }); 
            });
        }

        vm.step_module_gfpc = function()
        {   ;
            vm.stepparticipantgfpc = false;
            apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_gfpc = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
            });
        }

        vm.step_module_pmc = function()
        {   
            vm.stepparticipantpmc = false;
             apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_pmc = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
            });
        }

        vm.step_module_sep = function()
        {   
            vm.stepparticipantsep = false;
            apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_sep = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
            });
        }

/*******************************************debut formation dpp**************************************************/
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
            apiFactory.getAPIgeneraliserREST("participant_dpp/index",'id_module_dpp',vm.selectedItemModule_dpp.id).then(function(result)
              {
                  vm.allparticipant_dpp = result.data.response; 
                  console.log( vm.allparticipant_dpp);
              });
              vm.validation_formationdpp =item.validation;
              vm.stepparticipantdpp=true; 
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
 /*******************************************debut importer passation moe*************************************************/

        
        $scope.uploadFile_participant_dpp = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_dpp = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
            vm.stepparticipantdpp=true;
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
 /*******************************************debut importer passation moe*************************************************/

        $scope.uploadFile_module_odc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_odc = files;
        }
       
    /*******************************************fin importer passation moe***************************************************/

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
            apiFactory.getAPIgeneraliserREST("participant_odc/index",'id_module_odc',vm.selectedItemModule_odc.id).then(function(result)
            {
                vm.allparticipant_odc = result.data.response;
            });
            vm.validation_formationodc =item.validation;
            vm.stepparticipantodc=true; 
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
 /*******************************************debut importer passation moe*************************************************/

  
        
        $scope.uploadFile_participant_odc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_odc = files;
        }
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
   /*******************************************debut importer passation moe*************************************************/
        
        $scope.uploadFile_module_emies = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_emies = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
            apiFactory.getAPIgeneraliserREST("participant_emies/index",'id_module_emies',vm.selectedItemModule_emies.id).then(function(result)
              {
                  vm.allparticipant_emies = result.data.response; 
              });
              vm.validation_formationemies =item.validation;
              vm.stepparticipantemies=true; 
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
 /*******************************************debut importer passation moe*************************************************/
        
        $scope.uploadFile_participant_emies = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_emies = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
 /*******************************************debut importer passation moe*************************************************/

        
        $scope.uploadFile_module_gfpc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_gfpc = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
            apiFactory.getAPIgeneraliserREST("participant_gfpc/index",'id_module_gfpc',vm.selectedItemModule_gfpc.id).then(function(result)
              {
                  vm.allparticipant_gfpc = result.data.response; 
                  console.log( vm.allparticipant_gfpc);
              });
              vm.validation_formationgfpc =item.validation; 
              vm.stepparticipantgfpc=true; 
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
 /*******************************************debut importer passation moe*************************************************/
        $scope.uploadFile_participant_gfpc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_gfpc = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
 /*******************************************debut importer passation moe*************************************************/
        
        $scope.uploadFile_module_pmc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_pmc = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
            apiFactory.getAPIgeneraliserREST("participant_pmc/index",'id_module_pmc',vm.selectedItemModule_pmc.id).then(function(result)
              {
                  vm.allparticipant_pmc = result.data.response; 
                  console.log( vm.allparticipant_pmc);
              });
              vm.validation_formationpmc =item.validation;
              vm.stepparticipantpmc=true;
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
 /*******************************************debut importer passation moe*************************************************/

       
        
        $scope.uploadFile_participant_pmc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_pmc = files;
        }
       
    /*******************************************fin importer passation moe***************************************************/

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
 /*******************************************debut importer passation moe*************************************************/

        
        $scope.uploadFile_module_sep = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_sep = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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
            apiFactory.getAPIgeneraliserREST("participant_sep/index",'id_module_sep',vm.selectedItemModule_sep.id).then(function(result)
              {
                  vm.allparticipant_sep = result.data.response; 
                  console.log( vm.allparticipant_sep);
              });
              vm.validation_formationsep =item.validation;
              vm.stepparticipantsep=true;
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
 /*******************************************debut importer passation moe*************************************************/
        
        $scope.uploadFile_participant_sep = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_sep = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

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

    /*******************************************debut importer passation moe*************************************************/

        $scope.uploadFile_passation_moe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_passation_moe = files;
        }
       
    /*******************************************fin importer passation moe***************************************************/

        vm.step_menu_moe = function ()
        {   
            vm.tabmaitrise = true;          
            vm.stepprestation_moe = false;
            vm.stepdoc_moe=false;
            vm.step_contrat_moe_onglet = false;
            vm.stepcalendrier_paie_moe = false;
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                vm.allpassation_marches_moe = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                }); 
                vm.step_contrat_moe_onglet = true;
                vm.affiche_load = false;
                                
            });
            
        }
      /**************************************fin passation marchés***************************************************/
       vm.click_passation_marches_moe = function ()
        { 
            vm.affiche_load = true;
            vm.showbuttonNouvPassation_moe=true;
            apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                vm.allpassation_marches_moe = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                }); 
                vm.affiche_load = false;                                
            });
            
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
              vm.validation_passation_moe = item.validation;
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

       /*******************************************debut importer contrat moe*************************************************/


        vm.step_contrat_moe = function ()
        {                         
            vm.stepprestation_moe = false;
            vm.stepdoc_moe=false;
            vm.stepcalendrier_paie_moe=false;
            vm.sousrubrique_calendrier=false;
            vm.calendrier_prevu=false;
            vm.affiche_load = true;                
            apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                vm.allcontrat_moe = result.data.response;
                vm.affiche_load = false;
                               
            });
        }
        
    /*******************************************fin importer passation moe***************************************************/

      /**************************************fin contrat moe***************************************************/
        
      //col table
        vm.contrat_moe_column = [
        {titre:"Bureau d'etude"
        },
        {titre:"Intitulé"
        },
        {titre:"Référence contrat"
        },
        {titre:"Montant contrat TTC"
        },
        {titre:"Date Notification intention"
        },
        {titre:"Date Notification attribution"
        },
        {titre:"Date signature"
        },
        {titre:"Date OS"
        }];
        

        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;

            vm.stepprestation_moe = true;
            vm.stepdoc_moe=true;
            vm.validation_contrat_moe = item.validation;            
            vm.stepcalendrier_paie_moe=true;
            vm.sousrubrique_calendrier=false;
            vm.calendrier_prevu=false;
             
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

        
        /**********************************fin contrat_prestataire****************************************/

        vm.step_calendrier_paie_moe = function()
        {

            vm.sousrubrique_calendrier= false;
            vm.calendrier_prevu= false;
            vm.affiche_load = true;
             apiFactory.getAPIgeneraliserREST("divers_rubrique_calendrier_paie_moe/index","menu","getrubriquewithmontant_prevubycontrat","id_contrat_bureau_etude",vm.selectedItemContrat_moe.id).then(function(result)
            {   
                vm.allrubrique_calendrier_paie_moe= result.data.response;
                vm.affiche_load = false;
            });
        }
        /************************************************Debut rubrique attachement batiment_mpe***************************************************/
       /************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.rubrique_calendrier_paie_moe_column = [
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        }];

        vm.click_rubrique_calendrier_paie_moe = function()
        {
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_rubrique_calendrier_paie_moe/index","menu","getrubriquewithmontant_prevubycontrat","id_contrat_bureau_etude",vm.selectedItemContrat_moe.id).then(function(result)
            {   
                vm.allrubrique_calendrier_paie_moe= result.data.response;                
                vm.sousrubrique_calendrier= false;
                vm.calendrier_prevu= false;
            vm.affiche_load = false;
            });
        }
 //fonction selection item rubrique attachement batiment mpe
        vm.selectionRubrique_calendrier_paie_moe= function (item)
        {
            vm.selectedItemRubrique_calendrier_paie_moe = item;
            vm.sousrubrique_calendrier= true;
            vm.calendrier_prevu= false;
            //vm.stepattachement_batiment_detail = true;
            
        };

        $scope.$watch('vm.selectedItemRubrique_calendrier_paie_moe', function()
        {
             if (!vm.allrubrique_calendrier_paie_moe) return;
             vm.allrubrique_calendrier_paie_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRubrique_calendrier_paie_moe.$selected = true;
        });

        vm.Total_prevu_rubrique_moe = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
            
            
            var nbr=parseFloat(total_prevu);
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

/************************************************fin rubrique attachement batiment_mpe***************************************************/

/************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.sousrubrique_calendrier_paie_moe_column = [
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        }];

        vm.click_sousrubrique_calendrier_paie_moe = function()
        {
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_sousrubrique_calendrier_paie_moe/index","menu","getsousrubriquewithmontant_prevubycontrat","id_contrat_bureau_etude",vm.selectedItemContrat_moe.id,"id_rubrique",vm.selectedItemRubrique_calendrier_paie_moe.id).then(function(result)
            {   
                vm.allsousrubrique_calendrier_paie_moe= result.data.response;
            vm.affiche_load = false;
                //vm.stepattachement_batiment_detail = false;

                console.log(vm.allsousrubrique_calendrier_paie_moe);
            });
        }
 //fonction selection item rubrique attachement batiment mpe
        vm.selectionSousrubrique_calendrier_paie_moe= function (item)
        {
            vm.selectedItemSousrubrique_calendrier_paie_moe = item;
            vm.calendrier_prevu= true;
            //vm.stepattachement_batiment_detail = true;
            
        };

        $scope.$watch('vm.selectedItemSousrubrique_calendrier_paie_moe', function()
        {
             if (!vm.allsousrubrique_calendrier_paie_moe) return;
             vm.allsousrubrique_calendrier_paie_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemSousrubrique_calendrier_paie_moe.$selected = true;
        });

        vm.Total_prevu_sousrubrique_moe = function()
        {
            var total_prevu = 0;
            if (vm.allsousrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allsousrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allsousrubrique_calendrier_paie_moe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
            
            
            var nbr=parseFloat(total_prevu);
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

/************************************************fin rubrique attachement batiment_mpe***************************************************/

/************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.calendrier_paie_moe_prevucolumn = [
        {titre:"Libelle"
        },
        {titre:"Pourcentage"
        },
        {titre:"Montant prévu"
        }];

        vm.click_calendrier_paie_moe_prevu = function()
        {
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_calendrier_paie_moe_prevu/index","menu","getcalendrier_paie_moe_prevuwithdetailbycontrat","id_contrat_bureau_etude",vm.selectedItemContrat_moe.id,"id_sousrubrique",vm.selectedItemSousrubrique_calendrier_paie_moe.id).then(function(result)
            {   
                vm.allcalendrier_paie_moe_prevu= result.data.response;
            vm.affiche_load = false;
            });
        }

/************************************************fin rubrique attachement batiment_mpe***************************************************/


        vm.step_importerdocument_moe = function()
        {
            
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocumentvalideBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.alldocument_moe_scan = result.data.response;                 
                vm.affiche_load = false;                       
            });
        }
       /**********************************************Debut Dossier MOE***************************************************/
    //vm.myFile = [];
     $scope.uploadFile_doc_moe = function(event)
       {
          var files = event.target.files;
          vm.myFile = files;
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
            window.open(apiUrlFile+item.fichier);
        }


    /******************************************debut dossier MOE***********************************************/


        vm.step_avenant_moe = function()
        {
            
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allavenant_moe = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
                vm.affiche_load = false;
            });
        }
    /*********************************************fin avenant moe***********************************************/

//col table
        vm.avenant_moe_column = [
        {titre:"Description"
        },
        {titre:"Référence avenant"
        },
        {titre:"Montant TTC"
        },
        {titre:"Date signature"
        }];
       

        //fonction selection item region
        vm.selectionAvenant_moe= function (item)
        {
            vm.selectedItemAvenant_moe = item;
            vm.validation_avenant_moe = item.validation;             
            
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

        vm.step_prestation_moe = function()
        {            
            vm.affiche_load = true;
            vm.step_appel = false;
            vm.step_rapport = false;
            vm.step_manuel = false;
            vm.step_police = false;
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmemoire_technique = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
                vm.step_appel = true;
                vm.step_rapport = true;
                vm.step_manuel = true;
                vm.step_police = true;

                vm.affiche_load = false;                           
            });
        }

        vm.step_memoire_technique = function()
        {
            
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmemoire_technique = result.data.response.filter(function(obj)
                {
                       return obj.validation == 1;
                });
                vm.affiche_load = false;                           
            });
        }

 /*******************************************debut importer mamoire technique*************************************************/
        
        $scope.uploadFile_memoire_technique = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_memoire_technique = files;
        }
        
    /*******************************************fin importer mamoire technique***************************************************/

      /**************************************fin memoire technique***************************************************/
     
        //fonction selection item justificatif batiment
        vm.selectionMemoire_technique= function (item)
        {
            vm.selectedItemMemoire_technique = item;
            vm.validation_memoire_technique =item.validation;
            
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


 /*******************************************debut importer mamoire technique*************************************************/

        vm.step_appel_offre = function()
        {            
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allappel_offre = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });
                vm.affiche_load = false;                         
            });
        }
        
        $scope.uploadFile_appel_offre = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_appel_offre = files;
        }
        
    /*******************************************fin importer mamoire technique***************************************************/

      /**************************************Debut appel d'offre*****************************************************/
      
        //fonction selection item justificatif batiment
        vm.selectionAppel_offre= function (item)
        {
            vm.selectedItemAppel_offre = item;
            vm.validation_appel_offre =item.validation;
            
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

 /*******************************************debut importer rapport mensuel*************************************************/


        vm.step_rapport_mensuel = function()
        {            
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allrapport_mensuel = result.data.response.filter(function(obj)
                {
                       return obj.validation == 1;
                });

                vm.affiche_load = false;                           
            });
        }
                
        $scope.uploadFile_rapport_mensuel = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_rapport_mensuel = files;
        }
       
    /*******************************************fin importer rapport mensuel***************************************************/

      /**************************************Debut rapport mensuel***************************************************/
       
        //fonction selection item justificatif batiment
        vm.selectionRapport_mensuel= function (item)
        {
            vm.selectedItemRapport_mensuel = item;
            vm.validation_rapport_mensuel =item.validation;
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

 /*******************************************debut importer mamoire technique*************************************************/


        vm.step_manuel_gestion = function()
        {
            
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmanuel_gestion = result.data.response.filter(function(obj)
                {
                    return obj.validation == 1;
                });

                vm.affiche_load = false;                          
            });
        }
        
        $scope.uploadFile_manuel_gestion = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_manuel_gestion = files;
        }
        
    /*******************************************fin importer mamoire technique***************************************************/


      /**************************************Debut manuel gestion***************************************************/
      
        //fonction selection item justificatif batiment
        vm.selectionManuel_gestion= function (item)
        {
            vm.selectedItemManuel_gestion = item;
            vm.validation_manuel_gestion =item.validation;
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

 /*******************************************debut importer mamoire technique*************************************************/

        
        $scope.uploadFile_police_assurance = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_police_assurance = files;
        }
        
    /*******************************************fin importer mamoire technique***************************************************/


        vm.step_police_assurance = function()
        {
            
            vm.affiche_load = true;
            vm.showbuttonNouvPolice_assurance = true;
            apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allpolice_assurance = result.data.response.filter(function(obj)
                {
                       return obj.validation == 1;
                });
                vm.affiche_load = false;                                                   
            });
        }
      /**************************************Fin police d'assurance*************************************************/
     
        //fonction selection item justificatif batiment
        vm.selectionPolice_assurance= function (item)
        {
            vm.selectedItemPolice_assurance = item;
            vm.validation_police_assurance =item.validation;
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

      /*******************************************debut importer passation moe*************************************************/

        $scope.uploadFile_passation_mpe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_passation_mpe = files;
        }
       
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut passation_marches****************************************/
vm.steppassation_marches = function()
{
    vm.affiche_load = true;
    vm.stepsoumissionnaire = false;
    apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
    {
        vm.allpassation_marches = result.data.response.filter(function(obj)
        {
            return obj.validation == 1;
        });
        vm.affiche_load = false;
    });
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
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Observention"
        }];

       
        //fonction selection item region
        vm.selectionPassation_marches= function (item)
        {
            vm.selectedItemPassation_marches = item;
            vm.validation_passation = item.validation;
            vm.stepsoumissionnaire = true;
             
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

 /*******************************************debut importer passation moe*************************************************/
        vm.stepmpe_soumissionaire = function()
        {            
            apiFactory.getAPIgeneraliserREST("mpe_soumissionaire/index",'id_passation_marches',vm.selectedItemPassation_marches.id).then(function(result)
            {
                vm.allmpe_soumissionaire = result.data.response;
            });
        }

        
        $scope.uploadFile_mpe_soumissionaire = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_mpe_soumissionaire = files;
        }
       
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut sousmissionnaire****************************************/
    vm.mpe_soumissionaire_column = [
        {titre:"MPE sousmissionnaire"
        },
        {titre:"Telephone"
        },
        {titre:"Siège"
        }];        
/**********************************fin sousmissionnaire****************************************/
/*******************************************debut importer contrat moe*************************************************/


        $scope.uploadFile_contrat_mpe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_contrat_mpe = files;
        }
        
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut contrat prestataire****************************************/


           /* vm.stepsoumissionnaire = false;
            vm.step_detail_contrat_mpe = false;
            vm.stepattachement = false;
            vm.stepsuiviexecution = false;
            vm.stepavenant_mpe = false;
            vm.step_importer_doc_mpe = false;*/

       vm.step_contrat_mpe = function ()
        { 
            vm.showbuttonNouvContrat_prestataire=true;
            vm.affiche_load = true;
            vm.showbuttonNouvContrat_prestataire = false;
            vm.showbuttonimporter_contrat_mpe = false;
                 apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    vm.stepattachement = false;
                    vm.stepsuiviexecution = false;
                    vm.stepavenant_mpe = false;
                    vm.step_importer_doc_mpe = false;
                    vm.affiche_load = false;
                });
        }
        
//col table
        vm.contrat_prestataire_column = [
        {titre:"Nom entreprise"
        },
        {titre:"Intitulé"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment TTC"
        },
        {titre:"Cout latrine TTC"
        },
        {titre:"Cout mobilier TTC"
        },
        {titre:"Montant total HT"
        },
        {titre:"Montant total TTC"
        },
        {titre:"Date Notification intention"
        },
        {titre:"Date Notification attribution"
        },
        {titre:"Date signature"
        },
        {titre:"Date OS"
        }];
        
        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;
            vm.stepattachement = true;
            vm.stepsuiviexecution = true;
            vm.stepavenant_mpe = true;
            vm.step_importer_doc_mpe = true;
            vm.validation_contrat_prestataire = item.validation;  
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
        vm.step_avenant_mpe = function()
        {   vm.affiche_load = true;
           apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavenant_mpe = result.data.response;
                vm.affiche_load = false;
            });
        }

                
/**********************************fin contrat_prestataire****************************************/
        
/******************************************debut avancement physique***********************************************/
    vm.click_tab_pv_consta_recap_travaux = function()
    {   
        vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getrecapBymax_travauxcontrat",
        'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
        {
            vm.pv_consta_recap_travaux = result.data.response;
            console.log(vm.pv_consta_recap_travaux);
            vm.affiche_load =false;
        });
    }
        
/******************************************fin avancement physique***********************************************/

 /*********************************************fin avenant mpe***********************************************/

//col table
        vm.avenant_mpe_column = [
        {titre:"Description"
        },
        {titre:"Référence avenant"
        },
        {titre:"Cout batiment TTC"
        },
        {titre:"Cout latrine TTC"
        },
        {titre:"Cout mobilier TTC"
        },
        {titre:"Cout total HT"
        },
        {titre:"Cout total TTC"
        },
        {titre:"Date signature"
        }];
        
        //fonction selection item region
        vm.selectionAvenant_mpe= function (item)
        {
            vm.selectedItemAvenant_mpe = item;
            vm.validation_avenant_mpe = item.validation;            
            
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
  

        vm.step_importerdocument_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocumentvalideBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldocument_prestataire_scan = result.data.response;
                vm.affiche_load = false;
                                        
            });
        }

     $scope.uploadFile_doc_pre = function(event)
       {
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemDocument_prestataire_scan.fichier = vm.myFile[0].name;
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
            window.open(apiUrlFile+item.fichier);
        }


    /******************************************debut dossier entreprise***********************************************/
    

    /******************************************debut delai travaux***********************************************/



        vm.step_suivitravaux = function()
        {   
            vm.affiche_load = true;
            vm.stepphase = false;
            vm.step_reception = false;
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxvalideBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                 vm.alldelai_travaux = result.data.response;
                 vm.affiche_load = false;
                vm.step_reception = true;
             });
        }
        vm.step_delai_execution = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxvalideBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                 vm.alldelai_travaux = result.data.response;
                 vm.affiche_load = false;
             });
        }

    //col table
        vm.delai_travaux_column = [
        {titre:"Date prevu debut travaux"
        },
        {titre:"Date réel debut travaux"
        },
        {titre:"Date d'expiration police d'assurance"
        },
        {titre:"Delai d'éxecution (en jours)"
        }];
        

        //fonction selection item contrat
        vm.selectionDelai_travaux= function (item)
        {
            vm.selectedItemDelai_travaux = item;
              vm.validation_delai_travaux = item.validation;
              vm.stepphase = true;
           
             
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
    vm.click_phase_sous = function()
    {          
        apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',vm.selectedItemDelai_travaux.id).then(function(result)
        {
            vm.allphase_sous_projet = result.data.response.filter(function(obj)
            {
                return obj.validation == 1;
            });
        });

    }
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
            vm.validation_phase_sous_projet = item.validation;             
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

        vm.step_reception_mpe = function()
        {   vm.affiche_load = true;
             apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allreception_mpe = result.data.response.filter(function(obj)
              {
                  return obj.validation == 1;
              });
                vm.affiche_load = false;
            });
        }
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
            vm.validation_reception_mpe = item.validation;            
             
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
vm.click_menu_avancement_bat= function()
{
    apiFactory.getAPIgeneraliserREST("avancement_physi_batiment/index",'menu','getavancementBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
    {
        vm.allavancement_batiment = result.data.response;                              
    });
}
vm.click_menu_avancement_lat= function()
{
    apiFactory.getAPIgeneraliserREST("avancement_physi_latrine/index",'menu','getavancementBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
    {
        vm.allavancement_latrine = result.data.response;                              
    });
}
vm.click_menu_avancement_mob= function()
{
    apiFactory.getAPIgeneraliserREST("avancement_physi_mobilier/index",'menu','getavancementBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
    {
        vm.allavancement_mobilier = result.data.response;                              
    });
}
/**********************************debut avancement batiment****************************************/
//col table
vm.avancement_batiment_column = [
    {titre:"Date"
    },
    {titre:"Attachement"
    },
    {titre:"Pourcentage"
    }];
        
    //fonction selection item region
    vm.selectionAvancement_batiment= function (item)
    {
        vm.selectedItemAvancement_batiment = item;
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
    {titre:"Date"
    },
    {titre:"Attachement"
    },
    {titre:"Pourcentage"
    }];
    
    //fonction selection item region
    vm.selectionAvancement_latrine= function (item)
    {
        vm.selectedItemAvancement_latrine = item;
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
    {titre:"Date"
    },
    {titre:"Attachement"
    },
    {titre:"Pourcentage"
    }]
       
    //fonction selection item region
    vm.selectionAvancement_mobilier= function (item)
    {
        vm.selectedItemAvancement_mobilier = item;
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

        vm.step_menu_indicateur= function ()
        {
            vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allindicateur = result.data.response.filter(function(obj)
                      {
                          return obj.validation == 1;
                      });
                    vm.affiche_load = false;
                }); 
        } 
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
            vm.validation_indicateur = item.validation;            
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
        vm.injectDateinInput = function (daty)
        { 
            if (daty!=null && daty!= '') 
            {
                return new Date(daty);
            }
            else
            {
                return null;
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

