
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf.convention_suivi_obcaf')
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
        .controller('Convention_suivi_obcafController', Convention_suivi_obcafController);
    /** @ngInject */
    function Convention_suivi_obcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.styleTabfils = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
       
        vm.stepMenu_pr=false;
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepMenu_feffi=false;
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

        vm.session = '';

/*******************************Debut initialisation suivi financement feffi******************************/
        

        vm.ajoutDocument_feffi_scan = ajoutDocument_feffi_scan;
        var NouvelItemDocument_feffi_scan=false;
        var currentItemDocument_feffi_scan;
        vm.selectedItemDocument_feffi_scan = {} ;
        vm.alldocument_feffi_scan = [] ;

        vm.showbuttonNouvdocument_feffi_scan =true;

        vm.showbuttonValidation_document_feffi_scan  = false;
        vm.permissionboutonvaliderdocument_feffi_scan  = false;

        vm.showbuttonNeauveaudemande = false;

        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];
        
       vm.ajoutAvenant_convention = ajoutAvenant_convention ;
        var NouvelItemAvenant_convention=false;
        var currentItemAvenant_convention;
        vm.selectedItemAvenant_convention = {} ;
        vm.allavenant_convention = [] ;

        vm.showbuttonNouvavenant_convention=true;      

/*******************************Fin initialisation suivi financement feffi******************************/

/*****************************************Debut partenaire relai****************************************/
      
        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;

        vm.ajoutDocument_pr_scan = ajoutDocument_pr_scan;
        var NouvelItemDocument_pr_scan=false;
        var currentItemDocument_pr_scan;
        vm.selectedItemDocument_pr_scan = {} ;
        vm.alldocument_pr_scan = [] ;

        vm.showbuttonNouvdocument_pr_scan =true;

        vm.ajoutModule_dpp = ajoutModule_dpp ;
        var NouvelItemModule_dpp=false;
        var currentItemModule_dpp;
        vm.selectedItemModule_dpp = {} ;
        vm.allmodule_dpp = [] ;

        vm.showbuttonNouvformdpp=true;

        vm.ajoutParticipant_dpp = ajoutParticipant_dpp ;
        var NouvelItemParticipant_dpp=false;
        var currentItemParticipant_dpp;
        vm.selectedItemParticipant_dpp = {} ;
        vm.allparticipant_dpp = [] ;

        vm.ajoutModule_odc = ajoutModule_odc ;
        var NouvelItemModule_odc=false;
        var currentItemModule_odc;
        vm.selectedItemModule_odc = {} ;
        vm.allmodule_odc = [] ;

        vm.showbuttonNouvformodc=true;

        vm.ajoutParticipant_odc = ajoutParticipant_odc ;
        var NouvelItemParticipant_odc=false;
        var currentItemParticipant_odc;
        vm.selectedItemParticipant_odc = {} ;
        vm.allparticipant_odc = [] ;

        vm.ajoutModule_emies = ajoutModule_emies ;
        var NouvelItemModule_emies=false;
        var currentItemModule_emies;
        vm.selectedItemModule_emies = {} ;
        vm.allmodule_emies = [] ;

        vm.showbuttonNouvformemies=true;

        vm.ajoutParticipant_emies = ajoutParticipant_emies ;
        var NouvelItemParticipant_emies=false;
        var currentItemParticipant_emies;
        vm.selectedItemParticipant_emies = {} ;
        vm.allparticipant_emies = [] ;

        vm.ajoutModule_gfpc = ajoutModule_gfpc ;
        var NouvelItemModule_gfpc=false;
        var currentItemModule_gfpc;
        vm.selectedItemModule_gfpc = {} ;
        vm.allmodule_gfpc = [] ;

        vm.showbuttonNouvformgfpc=true;

       vm.ajoutParticipant_gfpc = ajoutParticipant_gfpc ;
        var NouvelItemParticipant_gfpc=false;
        var currentItemParticipant_gfpc;
        vm.selectedItemParticipant_gfpc = {} ;
        vm.allparticipant_gfpc = [] ;

        vm.ajoutModule_pmc = ajoutModule_pmc ;
        var NouvelItemModule_pmc=false;
        var currentItemModule_pmc;
        vm.selectedItemModule_pmc = {} ;
        vm.allmodule_pmc = [] ;

        vm.showbuttonNouvformpmc=true;

        vm.ajoutParticipant_pmc = ajoutParticipant_pmc ;
        var NouvelItemParticipant_pmc=false;
        var currentItemParticipant_pmc;
        vm.selectedItemParticipant_pmc = {} ;
        vm.allparticipant_pmc = [] ;

        vm.ajoutModule_sep = ajoutModule_sep ;
        var NouvelItemModule_sep=false;
        var currentItemModule_sep;
        vm.selectedItemModule_sep = {} ;
        vm.allmodule_sep = [] ;

        vm.showbuttonNouvformsep=true;

        vm.ajoutParticipant_sep = ajoutParticipant_sep ;
        var NouvelItemParticipant_sep=false;
        var currentItemParticipant_sep;
        vm.selectedItemParticipant_sep = {} ;
        vm.allparticipant_sep = [] ;

/*********************************************Fin partenaire relai*************************************/

/*******************************************Debut maitrise d'oeuvre*************************************/
        
        vm.ajoutPassation_marches_moe = ajoutPassation_marches_moe ;
        var NouvelItemPassation_marches_moe=false;
        var currentItemPassation_marches_moe;
        vm.selectedItemPassation_marches_moe = {} ;
        vm.allpassation_marches_moe = [] ;

        vm.showbuttonNouvPassation_moe=true;

        vm.ajoutContrat_moe = ajoutContrat_moe ;
        var NouvelItemContrat_moe=false;
        var currentItemContrat_moe;
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

        vm.showbuttonNouvcontrat_moe=true;

        vm.ajoutAvenant_moe = ajoutAvenant_moe ;
        var NouvelItemAvenant_moe=false;
        var currentItemAvenant_moe;
        vm.selectedItemAvenant_moe = {} ;
        vm.allavenant_moe = [] ;

        vm.showbuttonNouvavenant_moe=true;

        vm.ajoutMemoire_technique = ajoutMemoire_technique;
        var NouvelItemMemoire_technique=false;
        var currentItemMemoire_technique;
        vm.selectedItemMemoire_technique = {} ;
        vm.allmemoire_technique = [] ;

        vm.showbuttonNouvMemoire_technique=true;

        vm.ajoutAppel_offre = ajoutAppel_offre;
        var NouvelItemAppel_offre=false;
        var currentItemAppel_offre;
        vm.selectedItemAppel_offre = {} ;
        vm.allappel_offre = [] ;

        vm.showbuttonNouvAppel_offre=true;

        vm.ajoutRapport_mensuel = ajoutRapport_mensuel;
        var NouvelItemRapport_mensuel=false;
        var currentItemRapport_mensuel;
        vm.selectedItemRapport_mensuel = {} ;
        vm.allrapport_mensuel = [] ;
        vm.insererrapport = true;
        vm.showbuttonNouvRapport_mensuel=true;

        vm.ajoutManuel_gestion = ajoutManuel_gestion;
        var NouvelItemManuel_gestion=false;
        vm.selectedItemManuel_gestion = {} ;
        var currentItemManuel_gestion;
        vm.allmanuel_gestion = [] ;

        vm.showbuttonNouvManuel_gestion=true;

        vm.ajoutPolice_assurance = ajoutPolice_assurance;
        var NouvelItemPolice_assurance=false;
        vm.selectedItemPolice_assurance = {} ;
        var currentItemPolice_assurance;
        vm.allpolice_assurance = [] ;

        vm.showbuttonNouvPolice_assurance=true;
        
/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.ajoutPassation_marches = ajoutPassation_marches ;
        var NouvelItemPassation_marches=false;
        var currentItemPassation_marches;
        vm.selectedItemPassation_marches = {} ;
        vm.allpassation_marches = [] ;

        vm.showbuttonNouvPassation=true;
        vm.showbuttonValidationpassation = false;

        vm.ajoutMpe_soumissionaire = ajoutMpe_soumissionaire ;
        var NouvelItemMpe_soumissionaire=false;
        var currentItemMpe_soumissionaire;
        vm.selectedItemMpe_soumissionaire = {} ;
        vm.allmpe_soumissionaire = [] ;

        vm.ajoutContrat_prestataire = ajoutContrat_prestataire ;
        var NouvelItemContrat_prestataire=false;
        var currentItemContrat_prestataire;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.showbuttonNouvContrat_prestataire=true;

        vm.ajoutAvenant_mpe = ajoutAvenant_mpe ;
        var NouvelItemAvenant_mpe=false;
        var currentItemAvenant_mpe;
        vm.selectedItemAvenant_mpe = {} ;
        vm.allavenant_mpe = [] ;

        vm.showbuttonNouvavenant_mpe=true;

        vm.ajoutDocument_prestataire_scan = ajoutDocument_prestataire_scan;
        var NouvelItemDocument_prestataire_scan=false;
        var currentItemDocument_prestataire_scan;
        vm.selectedItemDocument_prestataire_scan = {} ;
        vm.alldocument_prestataire_scan = [] ;

        vm.showbuttonNouvdocument_prestataire_scan =true;

        vm.ajoutDocument_moe_scan = ajoutDocument_moe_scan;
        var NouvelItemDocument_moe_scan=false;
        var currentItemDocument_moe_scan;
        vm.selectedItemDocument_moe_scan = {} ;
        vm.alldocument_moe_scan = [] ;

        vm.ajoutDivers_attachement_batiment_prevu = ajoutDivers_attachement_batiment_prevu;
        var NouvelItemDivers_attachement_batiment_prevu=false;
        var currentItemDivers_attachement_batiment_prevu;
        vm.selectedItemDivers_attachement_batiment_prevu = {} ;
        vm.alldivers_attachement_batiment_prevu = [] ;

        vm.ajoutDivers_attachement_latrine_prevu = ajoutDivers_attachement_latrine_prevu;
        var NouvelItemDivers_attachement_latrine_prevu=false;
        var currentItemDivers_attachement_latrine_prevu;
        vm.selectedItemDivers_attachement_latrine_prevu = {} ;
        vm.alldivers_attachement_latrine_prevu = [] ;

        vm.ajoutDivers_attachement_mobilier_prevu = ajoutDivers_attachement_mobilier_prevu;
        var NouvelItemDivers_attachement_mobilier_prevu=false;
        var currentItemDivers_attachement_mobilier_prevu;
        vm.selectedItemDivers_attachement_mobilier_prevu = {} ;
        vm.alldivers_attachement_mobilier_prevu = [] ;

        vm.showbuttonNouvdocument_moe_scan =true;

        vm.showbuttonValidation_document_moe_scan  = false;
        vm.permissionboutonvaliderdocument_moe_scan  = false;

        vm.ajoutDelai_travaux = ajoutDelai_travaux ;
        var NouvelItemDelai_travaux=false;
        var currentItemDelai_travaux;
        vm.selectedItemDelai_travaux = {} ;
        vm.alldelai_travaux = [] ;

        vm.showbuttonNouvDelai_travaux=true;

        vm.ajoutPhase_sous_projet = ajoutPhase_sous_projet ;
        var NouvelItemPhase_sous_projet=false;
        var currentItemPhase_sous_projet;
        vm.selectedItemPhase_sous_projet = {} ;
        vm.allphase_sous_projet = [] ;

        vm.showbuttonNouvPhase_sous_projet=true;

        vm.ajoutReception_mpe = ajoutReception_mpe ;
        var NouvelItemReception_mpe=false;
        var currentItemReception_mpe;
        vm.selectedItemReception_mpe = {} ;
        vm.allreception_mpe = [] ;

        vm.showbuttonNouvReception_mpe=true;

        vm.ajoutAvancement_batiment = ajoutAvancement_batiment ;
        var NouvelItemAvancement_batiment=false;
        var currentItemAvancement_batiment;
        vm.selectedItemAvancement_batiment = {} ;
        vm.allavancement_batiment = [] ;

        vm.showbuttonNouvAvancement_batiment=true;

        vm.ajoutAvancement_latrine = ajoutAvancement_latrine ;
        var NouvelItemAvancement_latrine=false;
        var currentItemAvancement_latrine;
        vm.selectedItemAvancement_latrine = {} ;
        vm.allavancement_latrine = [] ;

        vm.showbuttonNouvAvancement_latrine=true;

        vm.ajoutAvancement_mobilier = ajoutAvancement_mobilier ;
        var NouvelItemAvancement_mobilier=false;
        var currentItemAvancement_mobilier;
        vm.selectedItemAvancement_mobilier = {} ;
        vm.allavancement_mobilier = [] ;

        vm.showbuttonNouvAvancement_mobilier=true;
        
/********************************************Fin entreprise********************************************/

/********************************************Debut indicateur********************************************/        

        vm.ajoutIndicateur = ajoutIndicateur ;
        var NouvelItemIndicateur=false;
        var currentItemIndicateur;
        vm.selectedItemIndicateur = {} ;
        vm.allindicateur = [] ;

        vm.showbuttonNouvIndicateur = true;

        vm.affiche_load= false;

/********************************************Fin indicateur********************************************/ 

/********************************************Debut importer********************************************/ 
        vm.showbuttonimporter_avenant_conv=true;
        vm.showformimporter_avenant_conv = false;
/********************************************Fin importer********************************************/ 

/********************************************Debut importer passation mpe******************************/        
        vm.showbuttonimporter_passation_mpe=true;
        vm.showformimporter_passation_mpe = false;
/********************************************Fin importer passation mpe******************************/ 

/********************************************Debut importer contrat mpe********************************/
        vm.showbuttonimporter_contrat_mpe=true;
        vm.showformimporter_contrat_mpe = false;
/********************************************Fin importer contrat mpe********************************/ 

/********************************************Debut importer passation mpe******************************/        
        vm.showbuttonimporter_passation_moe=true;
        vm.showformimporter_passation_moe = false;
/********************************************Fin importer passation moe******************************/ 

/********************************************Debut importer contrat moe********************************/
        vm.showbuttonimporter_contrat_moe=true;
        vm.showformimporter_contrat_moe = false;
/********************************************Fin importer contrat moe********************************/

/********************************************Debut importer module dpp******************************/        
        vm.showbuttonimporter_module_dpp=true;
        vm.showformimporter_module_dpp = false;
/********************************************Fin importer module dpp******************************/ 

/********************************************Debut importer module odc******************************/        
        vm.showbuttonimporter_module_odc=true;
        vm.showformimporter_module_odc = false;
/********************************************Fin importer module odc******************************/  

/********************************************Debut importer module pmc******************************/        
        vm.showbuttonimporter_module_pmc=true;
        vm.showformimporter_module_pmc = false;
/********************************************Fin importer module pmc******************************/  

/********************************************Debut importer module gfpc******************************/        
        vm.showbuttonimporter_module_gfpc=true;
        vm.showformimporter_module_gfpc = false;
/********************************************Fin importer module gfpc******************************/  

/********************************************Debut importer module sep******************************/        
        vm.showbuttonimporter_module_sep=true;
        vm.showformimporter_module_sep = false;
/********************************************Fin importer module sep******************************/  

/********************************************Debut importer module emis******************************/        
        vm.showbuttonimporter_module_emies=true;
        vm.showformimporter_module_emies = false;
/********************************************Fin importer module emis******************************/



/********************************************Debut importer module dpp******************************/        
        vm.showbuttonimporter_participant_dpp=true;
        vm.showformimporter_participant_dpp = false;
/********************************************Fin importer participant dpp******************************/ 

/********************************************Debut importer participant odc******************************/        
        vm.showbuttonimporter_participant_odc=true;
        vm.showformimporter_participant_odc = false;
/********************************************Fin importer participant odc******************************/  

/********************************************Debut importer participant pmc******************************/        
        vm.showbuttonimporter_participant_pmc=true;
        vm.showformimporter_participant_pmc = false;
/********************************************Fin importer participant pmc******************************/  

/********************************************Debut importer participant gfpc******************************/        
        vm.showbuttonimporter_participant_gfpc=true;
        vm.showformimporter_participant_gfpc = false;
/********************************************Fin importer participant gfpc******************************/  

/********************************************Debut importer participant sep******************************/        
        vm.showbuttonimporter_participant_sep=true;
        vm.showformimporter_participant_sep = false;
/********************************************Fin importer participant sep******************************/  

/********************************************Debut importer participant emis******************************/        
        vm.showbuttonimporter_participant_emies=true;
        vm.showformimporter_participant_emies = false;
/********************************************Fin importer participant emis******************************/

/********************************************Debut importer mpe_soumissionaire******************************/        
        vm.showbuttonimporter_mpe_soumissionaire=true;
        vm.showformimporter_mpe_soumissionaire = false;
/********************************************Fin importer mpe_soumissionaire******************************/ 

/********************************************Debut importer memoire technique******************************/        
        vm.showbuttonimporter_memoire_technique=true;
        vm.showformimporter_memoire_technique = false;
/********************************************Fin importer memoire technique******************************/ 

/********************************************Debut importer appel offre******************************/        
        vm.showbuttonimporter_appel_offre=true;
        vm.showformimporter_appel_offre = false;
/********************************************Fin importer appel offre******************************/  

/********************************************Debut importer manuel gestion******************************/        
        vm.showbuttonimporter_manuel_gestion=true;
        vm.showformimporter_manuel_gestion = false;
/********************************************Fin importer manuel gestion******************************/

/********************************************Debut importer rapport mensuel******************************/        
        vm.showbuttonimporter_rapport_mensuel=true;
        vm.showformimporter_rapport_mensuel = false;
/********************************************Fin importer rapport mensuel******************************/ 

/********************************************Debut importer rapport mensuel******************************/        
        vm.showbuttonimporter_police_assurance=true;
        vm.showformimporter_police_assurance = false;
/********************************************Fin importer rapport mensuel******************************/     

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        vm.datenow = new Date();

        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allmoe= result.data.response;
            console.log(vm.allmoe);
        });
        apiFactory.getAll("situation_participant_sep/index").then(function(result)
        {
            vm.allsituation_participant_sep = result.data.response; 
                  console.log( vm.allsituation_participant_sep);
        });
        apiFactory.getAll("situation_participant_gfpc/index").then(function(result)
        {
            vm.allsituation_participant_gfpc = result.data.response; 
                  console.log( vm.allsituation_participant_gfpc);
        }); 
        apiFactory.getAll("situation_participant_emies/index").then(function(result)
        {
            vm.allsituation_participant_emies = result.data.response; 
                  console.log( vm.allsituation_participant_emies);
        }); 
        apiFactory.getAll("situation_participant_dpp/index").then(function(result)
        {
            vm.allsituation_participant_dpp = result.data.response; 
                  console.log( vm.allsituation_participant_dpp);
        }); 
        apiFactory.getAll("situation_participant_pmc/index").then(function(result)
        {
            vm.allsituation_participant_pmc = result.data.response; 
                  console.log( vm.allsituation_participant_pmc);
        });
        //recuperation donnée partenaire_relai
        apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai= result.data.response;
        });
        apiFactory.getAll("prestataire/index").then(function(result)
        {
            vm.allprestataire= result.data.response;
        });
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
                  case 'ACC': 
                            //vm.usercisco = result.data.response.cisco;
                            vm.showbuttonNeauveaudemandefeffi=true;                            
                            vm.session = 'ACC';

                      break;

                  case 'ADMIN':                            
                            vm.showbuttonNeauveaudemandefeffi=true;
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
        {titre:"Code projet Site"
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
            
            switch (vm.session)
                {
                  case 'ACC': 
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydateutilisateur','id_utilisateur',id_user,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                console.log(vm.allconvention_entete);
                            });

                      break;

                  case 'ADMIN':                            
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                console.log(vm.allconvention_entete);
                            });                 
                      break;
                  default:
                      break;
              
                } 
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

             apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',item.id).then(function(result)
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
              });             
             /* apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });*/
               
              
              
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
        vm.step_menu_pr =function ()
        {   vm.tabpartenaire = true;
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_partenaire_relai = result.data.response;
                        console.log(vm.allcontrat_partenaire_relai);
                        return resolve('ok');
                });  
                vm.styleTabfils = "acc_sous_menu";         
            });
            
        }
        vm.step_menu_moe = function ()
        {   vm.tabmaitrise = true;
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    /*vm.allpassation_marches_moe = result.data.response.filter(function(obj)
                    {
                           return obj.validation == 0;
                    });*/
                    vm.allpassation_marches_moe = result.data.response;
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvPassation_moe=false;
                    }
                    
                        return resolve('ok');
                                
                });
                 vm.styleTabfils = "acc_sous_menu";              
            });
            
        }

        vm.step_contrat_moe = function ()
        {   vm.showbuttonNouvcontrat_moe=true;
            return new Promise(function (resolve, reject) 
            {
                
                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_moe = result.data.response;

                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvcontrat_moe=false;
                    }
                    return resolve('ok');
                });
                vm.styleTabfils = "acc_sous_menu";
                               
            });
        }
        vm.step_avenant_feffi= function ()
        {
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu','getavenantinvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allavenant_convention = result.data.response;
                     vm.showbuttonNouvavenant_convention=true;
                     return resolve('ok');                                    
                });             
            });
        
        }
        vm.step_importerdocument_feffi= function ()
        {
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("dossier_feffi/index",'menu','getdocumentinvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.alldocument_feffi_scan = result.data.response;
                return resolve('ok');                                         
                });          
            });
        
        }
        vm.step_menu_mpe = function ()
        {   vm.tabentreprise = true;
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches = result.data.response.filter(function(obj)
                    {
                           return obj.validation == 0;
                    });
                    if (result.data.response.length!=0)
                    {
                       vm.showbuttonNouvPassation=false;
                    }
                    console.log(vm.allpassation_marches);
                    return resolve('ok');
                });
                 vm.styleTabfils = "acc_sous_menu";
            });
           
        }

       vm.step_contrat_mpe = function ()
        {
            return new Promise(function (resolve, reject)
            {
                 apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvContrat_prestataire=false;
                    }
                    return resolve('ok');
                });
               vm.styleTabfils = "acc_sous_menu";        
            });
            
        }

        vm.step_menu_indicateur= function ()
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allindicateur = result.data.response.filter(function(obj)
                      {
                          return obj.validation == 0;
                        });
                    if (result.data.response.length!=0)
                    {
                      vm.showbuttonNouvIndicateur=false;
                    }
                    return resolve('ok');
                });             
            });
        }

  /**********************************************Debut Dossier feffi***************************************************/
    //vm.myFile = [];
     $scope.uploadFile_doc_feffi = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_feffi_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_feffi_scan.fichier);
        } 

        //fonction ajout dans bdd
        function ajoutDocument_feffi_scan(document_feffi_scan,suppression)
        {
            if (NouvelItemDocument_feffi_scan==false)
            {
                test_existanceDocument_feffi_scan (document_feffi_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_feffi_scan(document_feffi_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_feffi_scan
        vm.annulerDocument_feffi_scan = function(item)
        {
          if (NouvelItemDocument_feffi_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_feffi_scan.fichier ;
            item.date_elaboration   = currentItemDocument_feffi_scan.date_elaboration ;
            item.observation   = currentItemDocument_feffi_scan.observation ;
          }else
          {
            /*vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
            {
                return obj.id != vm.selectedItemDocument_feffi_scan.id;
            });*/

            item.fichier   = '';
            item.date_elaboration   = '' ;
            item.observation   = '' ;
            item.$edit = false;
            item.$selected = false;

            item.id_document_feffi_scan = null;
          }

          vm.selectedItemDocument_feffi_scan = {} ;
          NouvelItemDocument_feffi_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_feffi_scan= function (item)
        {
            vm.selectedItemDocument_feffi_scan = item;
            vm.nouvelItemDocument_feffi_scan   = item;
            vm.validation_document_feffi_scan = item.validation;
            currentItemDocument_feffi_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_feffi_scan));
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_feffi_scan = function(item)
        {
            
            vm.selectedItemDocument_feffi_scan = item;
            currentItemDocument_feffi_scan = angular.copy(vm.selectedItemDocument_feffi_scan);
            $scope.vm.alldocument_feffi_scan.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_document_feffi_scan==null)
            {   
                NouvelItemDocument_feffi_scan=true;
                console.log('atonull');
                item.fichier   = vm.selectedItemDocument_feffi_scan.fichier ;
                item.date_elaboration   = vm.datenow ;
                item.observation   = vm.selectedItemDocument_feffi_scan.observation ;
                item.id_document_feffi_scan   = '0' ;
                item.id_convention_entete   = vm.selectedItemConvention_entete.id ;

            }
            else
            {NouvelItemDocument_feffi_scan = false ;
                console.log('tsnull');
                item.fichier   = vm.selectedItemDocument_feffi_scan.fichier ;
                item.date_elaboration   = new Date(vm.selectedItemDocument_feffi_scan.date_elaboration) ;
                item.observation   = vm.selectedItemDocument_feffi_scan.observation ;
            }
            vm.showbuttonValidation_document_feffi_scan = false;
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_feffi_scan
        vm.supprimerDocument_feffi_scan = function()
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
                vm.ajoutDocument_feffi_scan(vm.selectedItemDocument_feffi_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_feffi_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_feffi_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_feffi_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_feffi_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_feffi_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_feffi_scan.observation ))                   
                      { 
                         insert_in_baseDocument_feffi_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_feffi_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_feffi_scan
        function insert_in_baseDocument_feffi_scan(document_feffi_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_feffi_scan==false)
            {
                getId = vm.selectedItemDocument_feffi_scan.id_document_feffi_scan; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_feffi_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                    observation: document_feffi_scan.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    id_document_feffi: document_feffi_scan.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
            {

              if (NouvelItemDocument_feffi_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         //;
                    
                          var repertoire = 'document_feffi_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_feffi_scan.id_document_feffi_scan;
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0]
                            var name_file = vm.selectedItemConvention_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    document_feffi_scan.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_feffi_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                                      observation: document_feffi_scan.observation,
                                                      id_convention_entete: document_feffi_scan.id_convention_entete,
                                                      id_document_feffi: document_feffi_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_feffi_scan.$selected = false;
                                          document_feffi_scan.$edit = false;
                                          vm.selectedItemDocument_feffi_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_feffi_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_feffi_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                        observation: document_feffi_scan.observation,
                                        id_convention_entete: document_feffi_scan.id_convention_entete,
                                        id_document_feffi: document_feffi_scan.id,
                                        validation:0               
                                    });
                                  console.log(document_feffi_scan);
                                  apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_feffi_scan.$selected = false;
                                      document_feffi_scan.$edit = false;
                                      vm.selectedItemDocument_feffi_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        //vm.selectedItemDocument_feffi_scan.document_feffi = doc[0];
                        vm.selectedItemDocument_feffi_scan.contrat_feffi = vm.selectedItemContrat_feffi ;
                        vm.selectedItemDocument_feffi_scan.$selected  = false;
                        vm.selectedItemDocument_feffi_scan.$edit      = false;
                        vm.selectedItemDocument_feffi_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                     /* vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_feffi_scan.id;
                      });*/
                      vm.selectedItemDocument_feffi_scan.existance = true;
                      var chemin= vm.selectedItemDocument_feffi_scan.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {                         
                          vm.selectedItemDocument_feffi_scan.fichier = '';
                          vm.selectedItemDocument_feffi_scan.date_elaboration = '';
                          vm.selectedItemDocument_feffi_scan.observation = '';
                          vm.selectedItemDocument_feffi_scan.existance = false;

                          vm.selectedItemDocument_pr_scan.id_document_feffi_scan = null;
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });;
                    }
              }
              else
              {
                  document_feffi_scan.id_document_feffi_scan  =   String(data.response);              
                  NouvelItemDocument_feffi_scan = false;

                    
                    
                    var repertoire = 'document_feffi_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = vm.selectedItemConvention_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              document_feffi_scan.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_feffi_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                                observation: document_feffi_scan.observation,
                                                id_convention_entete: document_feffi_scan.id_convention_entete,
                                                id_document_feffi: document_feffi_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                {   document_feffi_scan.validation = 0;
                                    document_feffi_scan.$selected = false;
                                    document_feffi_scan.$edit = false;
                                    vm.selectedItemDocument_feffi_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_feffi_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_feffi_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                  observation: document_feffi_scan.observation,
                                  id_convention_entete: document_feffi_scan.id_convention_entete,
                                  id_document_feffi: document_feffi_scan.id,
                                  validation:0               
                              });

                            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                            {   
                                vm.validation_document_feffi_scan = 0;
                                document_feffi_scan.validation = 0;
                                document_feffi_scan.existance =true;  
                                document_feffi_scan.$selected = false;
                                document_feffi_scan.$edit = false;
                                vm.selectedItemDocument_feffi_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              //document_feffi_scan.document_feffi = doc[0];
              document_feffi_scan.convention_entete = vm.selectedItemConvention_entete ;
              document_feffi_scan.$selected = false;
              document_feffi_scan.$edit = false;
              //vm.selectedItemDocument_feffi_scan = {};
             
              vm.showbuttonValidation_document_feffi_scan = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
       
    /******************************************debut dossier feffi***********************************************/ 

    /*******************************************debut importer avenant*************************************************/

        vm.affichageformimporter_avenant_conv = function()
        {
          vm.showbuttonimporter_avenant_conv =false;
          vm.showformimporter_avenant_conv =true;
        }
        
        $scope.uploadFile_avenant_conv = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_avenant_conv = files;
        }
        vm.annulerimporter_avenant_conv = function()
        {
            vm.fichier_avenant_conv = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_avenant_conv=true;
            vm.showformimporter_avenant_conv=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_avenant_conv = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_avenant_conv[0];
          var repertoire = 'importer_avenant_conv/';
          var uploadUrl = apiUrl + "importer_avenant_conv/importerdonnee_avenant_conv";
          var name = vm.myFile_avenant_conv[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_avenant_conv=data["nom_fichier"];
              vm.repertoire_avenant_conv=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée réfusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_avenant_conv/"+data.nomFile;
                    vm.allavenant_convention = data.avenant_conv_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer avenant***************************************************/

    /*********************************************fin avenant convention***********************************************/

//col table
        vm.avenant_convention_column = [
        {titre:"Référence avenant"
        },
        {titre:"Description"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvenant_convention = function ()
        { 
          if (NouvelItemAvenant_convention == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              ref_avenant: '',         
              description: '',
              montant: 0,
              date_signature:'',
            };         
            vm.allavenant_convention.push(items);
            vm.allavenant_convention.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_convention = mem;
              }
            });

            NouvelItemAvenant_convention = true ;
          }else
          {
            vm.showAlert('Ajout avenant_convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_convention(avenant_convention,suppression)
        {
            if (NouvelItemAvenant_convention==false)
            {
                test_existanceAvenant_convention (avenant_convention,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_convention(avenant_convention,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_convention
        vm.annulerAvenant_convention = function(item)
        {
          if (NouvelItemAvenant_convention == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.ref_avenant   = currentItemAvenant_convention.ref_avenant ;
            item.description   = currentItemAvenant_convention.description ;
            item.montant   = currentItemAvenant_convention.montant ;
            item.date_signature = currentItemAvenant_convention.date_signature ;
          }else
          {
            vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_convention.id;
            });
          }
        
            vm.showbuttonNouvavenant_convention=true;

          vm.selectedItemAvenant_convention = {} ;
          NouvelItemAvenant_convention      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_convention= function (item)
        {
            vm.selectedItemAvenant_convention = item;
            //vm.nouvelItemAvenant_convention   = item;
            if (item.id!=0)
            {
                currentItemAvenant_convention    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_convention));
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

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_convention = function(item)
        {
            NouvelItemAvenant_convention = false ;
            vm.selectedItemAvenant_convention = item;
            currentItemAvenant_convention = angular.copy(vm.selectedItemAvenant_convention);
            $scope.vm.allavenant_convention.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.ref_avenant   = vm.selectedItemAvenant_convention.ref_avenant ;
            item.description   = vm.selectedItemAvenant_convention.description ;
            item.montant   = vm.selectedItemAvenant_convention.montant ;
            item.date_signature = new Date(vm.selectedItemAvenant_convention.date_signature) ;
        };

        //fonction bouton suppression item Avenant_convention
        vm.supprimerAvenant_convention = function()
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
                vm.ajoutAvenant_convention(vm.selectedItemAvenant_convention,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_convention (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_convention.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_convention.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_convention.description )
                    || (pass[0].montant  != currentItemAvenant_convention.montant)
                    || (pass[0].date_signature != currentItemAvenant_convention.date_signature )
                    || (pass[0].ref_avenant != currentItemAvenant_convention.ref_avenant ))                   
                      { 
                         insert_in_baseAvenant_convention(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_convention(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_convention(avenant_convention,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_convention==false)
            {
                getId = vm.selectedItemAvenant_convention.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    ref_avenant: avenant_convention.ref_avenant,
                    description: avenant_convention.description,
                    montant: avenant_convention.montant,
                    date_signature:convertionDate(new Date(avenant_convention.date_signature)),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_convention/index",datas, config).success(function (data)
            {   
                var conve= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == vm.selectedItemConvention_entete.id;
                });

                if (NouvelItemAvenant_convention == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvenant_convention.convention = conve[0];
                        
                        vm.selectedItemAvenant_convention.$selected  = false;
                        vm.selectedItemAvenant_convention.$edit      = false;
                        vm.selectedItemAvenant_convention ={};
                    }
                    else 
                    {    
                      vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_convention.id;
                      });
                    
                    }
                }
                else
                {
                  avenant_convention.convention = conve[0];
                  avenant_convention.validation =0
                  avenant_convention.id  =   String(data.response);              
                  NouvelItemAvenant_convention=false;
                }
              vm.validation_avenant_convention = 0
              avenant_convention.$selected = false;
              avenant_convention.$edit = false;
              vm.selectedItemAvenant_convention = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /**********************************************Avenant convention***************************************************/  

  
  /*********************************************debut contrat pr**********************************************/

  vm.stepmenu_contrat_pr= function()
  {
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

       /* vm.showtabpartenaire = function()
        {
            vm.tabpartenaire = true;
        }*/
       
        //fonction selection item contrat
        vm.selectionContrat_partenaire_relai= function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;

           if(item.id!=0)
           {
              vm.validation_contrat_pr = item.validation;
              vm.stepprestaion_pr=true;

            vm.stepdoc_pr=true;
              apiFactory.getAPIgeneraliserREST("situation_participant_odc/index",'id_classification_site',vm.selectedItemConvention_entete.site.id_classification_site).then(function(result)
              {
                  vm.allsituation_participant_odc = result.data.response;
              });
              
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

        vm.step_importer_doc_pr = function()
        {
             apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocumentinvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
             {
                vm.alldocument_pr_scan = result.data.response;                                        
            });
             vm.styleTabfils = "acc_sous_menu";
        }

        vm.step_prestation_pr = function()
        {

            apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_dpp = result.data.response;                          
                console.log(vm.allmodule_dpp);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformdpp=false;
                }
            });
            vm.styleTabfils = "acc_menu";
        }
        vm.step_module_dpp = function()
        {
           apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_dpp = result.data.response;                          
                console.log(vm.allmodule_dpp);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformdpp=false;
                }
            }); 
        }
        vm.step_module_odc = function()
        {
            apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                 vm.allmodule_odc = result.data.response;                          
                console.log(vm.allmodule_odc);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformodc=false;
                }
            });
        }

        vm.step_module_emies = function()
        {
            
            apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_emies = result.data.response;                          
                console.log(vm.allmodule_emies);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformemies=false;
                }
            });
        }

        vm.step_module_gfpc = function()
        {
            apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_gfpc = result.data.response;                          
                console.log(vm.allmodule_gfpc);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformgfpc=false;
                }
            });
        }

        vm.step_module_pmc = function()
        {
             apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_pmc = result.data.response;                          
                console.log(vm.allmodule_pmc);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformpmc=false;
                }
            });
        }

        vm.step_module_sep = function()
        {
            apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_sep = result.data.response;                          
                console.log(vm.allmodule_sep);
                if (result.data.response.length!=0)
                {
                    vm.showbuttonNouvformsep=false;
                }
            });
        }

        
/*****************************************fin contrat_partenaire_relai********************************************/

/**********************************************Debut Dossier partenaire relais***************************************************/
    //vm.myFile = [];
     $scope.uploadFile_doc_pr = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_pr_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_pr_scan.fichier);
        } 

        //fonction ajout dans bdd
        function ajoutDocument_pr_scan(document_pr_scan,suppression)
        {
            if (NouvelItemDocument_pr_scan==false)
            {
                test_existanceDocument_pr_scan (document_pr_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_pr_scan(document_pr_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_pr_scan
        vm.annulerDocument_pr_scan = function(item)
        {
          if (NouvelItemDocument_pr_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_pr_scan.fichier ;
            item.date_elaboration   = currentItemDocument_pr_scan.date_elaboration ;
            item.observation   = currentItemDocument_pr_scan.observation ;
          }else
          {
            item.fichier   = '';
            item.date_elaboration   = '' ;
            item.observation   = '' ;
            item.$edit = false;
            item.$selected = false;

            item.id_document_pr_scan = null;
          }

          vm.selectedItemDocument_pr_scan = {} ;
          NouvelItemDocument_pr_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_pr_scan= function (item)
        {
            vm.selectedItemDocument_pr_scan = item;
            vm.nouvelItemDocument_pr_scan   = item;
            if (item.id_document_pr_scan!=0)
            {
                vm.showbuttonValidation_document_pr_scan = true;
            }
            vm.validation_document_pr_scan = item.validation;
            currentItemDocument_pr_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_pr_scan));
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_pr_scan = function(item)
        {
            
            vm.selectedItemDocument_pr_scan = item;
            currentItemDocument_pr_scan = angular.copy(vm.selectedItemDocument_pr_scan);
            $scope.vm.alldocument_pr_scan.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_document_pr_scan==null)
            {   
                NouvelItemDocument_pr_scan=true;
                console.log('atonull');
                item.fichier   = vm.selectedItemDocument_pr_scan.fichier ;
                item.date_elaboration   = vm.datenow ;
                item.observation   = vm.selectedItemDocument_pr_scan.observation ;
                item.id_document_pr_scan   = '0' ;
                item.id_contrat_partenaire_relai   = vm.selectedItemContrat_partenaire_relai.id ;

            }
            else
            {NouvelItemDocument_pr_scan = false ;
                console.log('tsnull');
                item.fichier   = vm.selectedItemDocument_pr_scan.fichier ;
                item.date_elaboration   = new Date(vm.selectedItemDocument_pr_scan.date_elaboration) ;
                item.observation   = vm.selectedItemDocument_pr_scan.observation ;
            }
            vm.showbuttonValidation_document_pr_scan = false;
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_pr_scan
        vm.supprimerDocument_pr_scan = function()
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
                vm.ajoutDocument_pr_scan(vm.selectedItemDocument_pr_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_pr_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_pr_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_pr_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_pr_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_pr_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_pr_scan.observation ))                   
                      { 
                         insert_in_baseDocument_pr_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_pr_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_pr_scan
        function insert_in_baseDocument_pr_scan(document_pr_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_pr_scan==false)
            {
                getId = vm.selectedItemDocument_pr_scan.id_document_pr_scan; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_pr_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                    observation: document_pr_scan.observation,
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    id_document_pr: document_pr_scan.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
            {

              if (NouvelItemDocument_pr_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         //;
                    
                          var repertoire = 'document_pr_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_pr_scan.id_document_pr_scan;
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0]
                            var name_file = vm.selectedItemContrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    document_pr_scan.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_pr_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                                      observation: document_pr_scan.observation,
                                                      id_contrat_partenaire_relai: document_pr_scan.id_contrat_partenaire_relai,
                                                      id_document_pr: document_pr_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_pr_scan.$selected = false;
                                          document_pr_scan.$edit = false;
                                          vm.selectedItemDocument_pr_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_pr_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_pr_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                        observation: document_pr_scan.observation,
                                        id_contrat_partenaire_relai: document_pr_scan.id_contrat_partenaire_relai,
                                        id_document_pr: document_pr_scan.id,
                                        validation:0               
                                    });
                                  console.log(document_pr_scan);
                                  apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_pr_scan.$selected = false;
                                      document_pr_scan.$edit = false;
                                      vm.selectedItemDocument_pr_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        //vm.selectedItemDocument_pr_scan.document_pr = doc[0];
                        vm.selectedItemDocument_pr_scan.contrat_pr = vm.selectedItemContrat_pr ;
                        vm.selectedItemDocument_pr_scan.$selected  = false;
                        vm.selectedItemDocument_pr_scan.$edit      = false;
                        vm.selectedItemDocument_pr_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                     /* vm.alldocument_pr_scan = vm.alldocument_pr_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_pr_scan.id;
                      });*/
                      vm.selectedItemDocument_pr_scan.existance = true;
                      var chemin= vm.selectedItemDocument_pr_scan.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {                         
                          vm.selectedItemDocument_pr_scan.fichier = '';
                          vm.selectedItemDocument_pr_scan.date_elaboration = '';
                          vm.selectedItemDocument_pr_scan.observation = '';
                          vm.selectedItemDocument_pr_scan.existance = false;

                          vm.selectedItemDocument_pr_scan.id_document_pr_scan = null;
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });;
                    }
              }
              else
              {
                  document_pr_scan.id_document_pr_scan  =   String(data.response);              
                  NouvelItemDocument_pr_scan = false;

                    
                    
                    var repertoire = 'document_pr_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = vm.selectedItemContrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              document_pr_scan.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_pr_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                                observation: document_pr_scan.observation,
                                                id_contrat_partenaire_relai: document_pr_scan.id_contrat_partenaire_relai,
                                                id_document_pr: document_pr_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                {   document_pr_scan.validation = 0;
                                    document_pr_scan.$selected = false;
                                    document_pr_scan.$edit = false;
                                    vm.selectedItemDocument_pr_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_pr_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_pr_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                  observation: document_pr_scan.observation,
                                  id_contrat_partenaire_relai: document_pr_scan.id_contrat_partenaire_relai,
                                  id_document_pr: document_pr_scan.id,
                                  validation:0               
                              });

                            apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                            {   
                                vm.validation_document_pr_scan = 0;
                                document_pr_scan.validation = 0;
                                document_pr_scan.existance =true;  
                                document_pr_scan.$selected = false;
                                document_pr_scan.$edit = false;
                                vm.selectedItemDocument_pr_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              //document_pr_scan.document_pr = doc[0];
              document_pr_scan.contrat_pr = vm.selectedItemContrat_pr ;
              document_pr_scan.$selected = false;
              document_pr_scan.$edit = false;
              //vm.selectedItemDocument_pr_scan = {};
             
              vm.showbuttonValidation_document_pr_scan = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
       
    /******************************************debut dossier partenaire relai***********************************************/
    /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_module_dpp = function()
        {
          vm.showbuttonimporter_module_dpp =false;
          vm.showformimporter_module_dpp =true;
        }
        
        $scope.uploadFile_module_dpp = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_dpp = files;
        }
        vm.annulerimporter_module_dpp = function()
        {
            vm.fichier_module_dpp = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_module_dpp=true;
            vm.showformimporter_module_dpp=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_module_dpp = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_module_dpp[0];
          var repertoire = 'importer_module_dpp/';
          var uploadUrl = apiUrl + "importer_module_dpp/importerdonnee_module_dpp";
          var name = vm.myFile_module_dpp[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_module_dpp=data["nom_fichier"];
              vm.repertoire_module_dpp=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée réfusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_module_dpp/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/


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
        },
        {titre:"Action"
        }];


               
        //Masque de saisi ajout
        vm.ajouterModule_dpp = function ()
        { 
          if (NouvelItemModule_dpp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              observation:''
            };         
            vm.allmodule_dpp.push(items);
            vm.allmodule_dpp.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_dpp = mem;
              }
            });

            NouvelItemModule_dpp = true ;
          }else
          {
            vm.showAlert('Ajout module_dpp','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_dpp(module_dpp,suppression)
        {
            if (NouvelItemModule_dpp==false)
            {
                test_existanceModule_dpp (module_dpp,suppression); 
            } 
            else
            {
                insert_in_baseModule_dpp(module_dpp,suppression);
            }
        }

        //fonction de bouton d'annulation module_dpp
        vm.annulerModule_dpp = function(item)
        {
          if (NouvelItemModule_dpp == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_dpp.observation ;
            item.date_debut_reel_form   = currentItemModule_dpp.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_dpp.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_dpp.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_dpp.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_dpp.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_dpp.date_fin_previ_form ;
            item.id_classification_site = currentItemModule_dpp.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_dpp.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_dpp.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_dpp.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_dpp.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_dpp = vm.allmodule_dpp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_dpp.id;
            });
          }
          vm.showbuttonValidation = false;
          vm.selectedItemModule_dpp = {} ;
          NouvelItemModule_dpp      = false;
          vm.stepparticipantdpp=false;
          
        };

        //fonction selection item region
        vm.selectionModule_dpp= function (item)
        {
            vm.selectedItemModule_dpp = item;
            vm.nouvelItemModule_dpp   = item;
            vm.showbuttonNouvRapport =true;
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
            if (item.$selected==false || item.$selected == undefined)
              {
                
                currentItemModule_dpp    = JSON.parse(JSON.stringify(vm.selectedItemModule_dpp));
              }
              vm.showbuttonValidationformdpp = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierModule_dpp = function(item)
        {
            NouvelItemModule_dpp = false ;
            vm.selectedItemModule_dpp = item;
            currentItemModule_dpp = angular.copy(vm.selectedItemModule_dpp);
            $scope.vm.allmodule_dpp.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_dpp.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_dpp.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_dpp.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_dpp.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_dpp.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_dpp.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_dpp.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_dpp.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_dpp.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_dpp.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_dpp.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_dpp.lieu_formation;
            vm.stepparticipantdpp=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_dpp = function()
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
                vm.ajoutModule_dpp(vm.selectedItemModule_dpp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_dpp (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_dpp.filter(function(obj)
                {
                   return obj.id == currentItemModule_dpp.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_dpp.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_dpp.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_dpp.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_dpp.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_dpp.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_dpp.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_dpp.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_dpp.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_dpp.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_dpp.date_fin_previ_form) )                   
                      { 
                         insert_in_baseModule_dpp(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_dpp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_dpp(module_dpp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_dpp==false)
            {
                getId = vm.selectedItemModule_dpp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_dpp.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_dpp.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_dpp.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_dpp.date_reel_resti)),
                    nbr_previ_parti: module_dpp.nbr_previ_parti,
                    nbr_previ_fem_parti: module_dpp.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_dpp.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_dpp.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_dpp.lieu_formation,
                    observation:module_dpp.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_dpp/index",datas, config).success(function (data)
            {
                if (NouvelItemModule_dpp == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_dpp.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
                        vm.selectedItemModule_dpp.$selected  = false;
                        vm.selectedItemModule_dpp.$edit      = false;
                        vm.selectedItemModule_dpp ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_dpp = vm.allmodule_dpp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_dpp.id;
                      });
                      
                      vm.showbuttonNouvformdpp= true;
                    }
                    
                }
                else
                {
                  module_dpp.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

                  module_dpp.id  =   String(data.response);              
                  NouvelItemModule_dpp=false;
                  vm.showbuttonNouvformdpp= false;
            }
            module_dpp.validation=0;
              module_dpp.$selected = false;
              module_dpp.$edit = false;
              vm.selectedItemModule_dpp = {};
              vm.stepparticipantdpp=false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation dpp**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_participant_dpp = function()
        {
          vm.showbuttonimporter_participant_dpp =false;
          vm.showformimporter_participant_dpp =true;
        }
        
        $scope.uploadFile_participant_dpp = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_dpp = files;
        }
        vm.annulerimporter_participant_dpp = function()
        {
            vm.fichier_participant_dpp = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_participant_dpp=true;
            vm.showformimporter_participant_dpp=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_participant_dpp = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_participant_dpp[0];
          var repertoire = 'importer_participant_dpp/';
          var uploadUrl = apiUrl + "importer_participant_dpp/importerdonnee_participant_dpp";
          var name = vm.myFile_participant_dpp[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_participant_dpp=data["nom_fichier"];
              vm.repertoire_participant_dpp=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_participant_dpp/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut participant_dpp****************************************/
//col table
        vm.participant_dpp_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_dpp = function ()
        { 
          if (NouvelItemParticipant_dpp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_dpp:''
            };         
            vm.allparticipant_dpp.push(items);
            vm.allparticipant_dpp.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_dpp = mem;
              }
            });

            NouvelItemParticipant_dpp = true ;
          }else
          {
            vm.showAlert('Ajout participant_dpp','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_dpp(participant_dpp,suppression)
        {
            if (NouvelItemParticipant_dpp==false)
            {
                test_existanceParticipant_dpp (participant_dpp,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_dpp(participant_dpp,suppression);
            }
        }

        //fonction de bouton d'annulation participant_dpp
        vm.annulerParticipant_dpp = function(item)
        {
          if (NouvelItemParticipant_dpp == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_dpp.nom ;
            item.prenom   = currentItemParticipant_dpp.prenom ;
            item.sexe      = currentItemParticipant_dpp.sexe;
            item.id_situation_participant_dpp   = currentItemParticipant_dpp.id_situation_participant_dpp ; 
          }else
          {
            vm.allparticipant_dpp = vm.allparticipant_dpp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_dpp.id;
            });
          }

          vm.selectedItemParticipant_dpp = {} ;
          NouvelItemParticipant_dpp      = false;
          vm.stepparticipantdpp=false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_dpp= function (item)
        {
            vm.selectedItemParticipant_dpp = item;
            vm.nouvelItemParticipant_dpp   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_dpp    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_dpp));
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

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_dpp = function(item)
        {
            NouvelItemParticipant_dpp = false ;
            vm.selectedItemParticipant_dpp = item;
            currentItemParticipant_dpp = angular.copy(vm.selectedItemParticipant_dpp);
            $scope.vm.allparticipant_dpp.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_dpp.nom ;
            item.prenom = vm.selectedItemParticipant_dpp.prenom;
            item.sexe  = vm.selectedItemParticipant_dpp.sexe;
            item.id_situation_participant_dpp = vm.selectedItemParticipant_dpp.situation_participant_dpp.id; 
           // vm.stepparticipantdpp=false;
        };

        //fonction bouton suppression item participant_dpp
        vm.supprimerParticipant_dpp = function()
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
                vm.ajoutParticipant_dpp(vm.selectedItemParticipant_dpp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_dpp (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_dpp.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_dpp.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_dpp.nom) 
                    || (mem[0].prenom!=currentItemParticipant_dpp.prenom)
                    || (mem[0].sexe!=currentItemParticipant_dpp.sexe)
                    || (mem[0].age!=currentItemParticipant_dpp.age)
                    || (mem[0].id_situation_participant_dpp!=currentItemParticipant_dpp.id_situation_participant_dpp))                    
                      { 
                         insert_in_baseParticipant_dpp(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_dpp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_dpp(participant_dpp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_dpp==false)
            {
                getId = vm.selectedItemParticipant_dpp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_dpp.nom,
                    prenom: participant_dpp.prenom,
                    sexe: participant_dpp.sexe,
                    id_situation_participant_dpp: participant_dpp.id_situation_participant_dpp,
                    id_module_dpp: vm.selectedItemModule_dpp.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_dpp/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_dpp.filter(function(obj)
                {
                    return obj.id == participant_dpp.id_situation_participant_dpp;
                });

                if (NouvelItemParticipant_dpp == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_dpp.situation_participant_dpp= situ[0];
                        

                        if(currentItemParticipant_dpp.sexe == 1 && currentItemParticipant_dpp.sexe !=vm.selectedItemParticipant_dpp.sexe)
                        {
                          vm.selectedItemModule_dpp.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_dpp.sexe == 2 && currentItemParticipant_dpp.sexe !=vm.selectedItemParticipant_dpp.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_dpp.$selected  = false;
                        vm.selectedItemParticipant_dpp.$edit      = false;
                        vm.selectedItemParticipant_dpp ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_dpp = vm.allparticipant_dpp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_dpp.id;
                      });
                      
                      vm.selectedItemModule_dpp.nbr_parti = parseInt(vm.selectedItemModule_dpp.nbr_parti)-1;
                      
                      if(parseInt(participant_dpp.sexe) == 2)
                      {
                        vm.selectedItemModule_dpp.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_dpp.situation_participant_dpp = situ[0];
                  participant_dpp.id  =   String(data.response);              
                  NouvelItemParticipant_dpp=false;

                  vm.selectedItemModule_dpp.nbr_parti = parseInt(vm.selectedItemModule_dpp.nbr_parti)+1;
                  if(parseInt(participant_dpp.sexe) == 2)
                  {
                    vm.selectedItemModule_dpp.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_dpp.nbr_reel_fem_parti)+1;
                  }
            }
              //vm.stepparticipantdpp=false;
              participant_dpp.$selected = false;
              participant_dpp.$edit = false;
              vm.selectedItemParticipant_dpp = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/*******************************************fin participant*****************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_module_odc = function()
        {
          vm.showbuttonimporter_module_odc =false;
          vm.showformimporter_module_odc =true;
        }
        
        $scope.uploadFile_module_odc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_odc = files;
        }
        vm.annulerimporter_module_odc = function()
        {
            vm.fichier_module_odc = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_module_odc=true;
            vm.showformimporter_module_odc=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_module_odc = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_module_odc[0];
          var repertoire = 'importer_module_odc/';
          var uploadUrl = apiUrl + "importer_module_odc/importerdonnee_module_odc";
          var name = vm.myFile_module_odc[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_module_odc=data["nom_fichier"];
              vm.repertoire_module_odc=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_module_odc/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
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
        },
        {titre:"Action"
        }];
                
        //Masque de saisi ajout
        vm.ajouterModule_odc = function ()
        { 
          if (NouvelItemModule_odc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              observation:''
            };         
            vm.allmodule_odc.push(items);
            vm.allmodule_odc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_odc = mem;
              }
            });

            NouvelItemModule_odc = true ;
          }else
          {
            vm.showAlert('Ajout module_odc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_odc(module_odc,suppression)
        {
            if (NouvelItemModule_odc==false)
            {
                test_existanceModule_odc (module_odc,suppression); 
            } 
            else
            {
                insert_in_baseModule_odc(module_odc,suppression);
            }
        }

        //fonction de bouton d'annulation module_odc
        vm.annulerModule_odc = function(item)
        {
          if (NouvelItemModule_odc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_odc.observation ;
            item.date_debut_reel_form   = currentItemModule_odc.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_odc.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_odc.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_odc.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_odc.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_odc.date_fin_previ_form ;
            item.id_classification_site = currentItemModule_odc.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_odc.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_odc.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_odc.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_odc.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_odc = vm.allmodule_odc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_odc.id;
            });
          }
          vm.selectedItemModule_odc = {} ;
          NouvelItemModule_odc      = false;
          vm.stepparticipantodc=false;
          
        };

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
            if (item.$selected==false || item.$selected == undefined)
              {
                
                currentItemModule_odc    = JSON.parse(JSON.stringify(vm.selectedItemModule_odc));
              }
              vm.showbuttonValidationformodc = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierModule_odc = function(item)
        {
            NouvelItemModule_odc = false ;
            vm.selectedItemModule_odc = item;
            currentItemModule_odc = angular.copy(vm.selectedItemModule_odc);
            $scope.vm.allmodule_odc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_odc.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_odc.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_odc.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_odc.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_odc.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_odc.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_odc.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_odc.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_odc.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_odc.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_odc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_odc.lieu_formation;
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_odc.contrat_partenaire_relai);
            vm.showbuttonValidationformodc =false;
            vm.stepparticipantodc=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_odc = function()
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
                vm.ajoutModule_odc(vm.selectedItemModule_odc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_odc (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_odc.filter(function(obj)
                {
                   return obj.id == currentItemModule_odc.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_odc.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_odc.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_odc.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_odc.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_odc.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_odc.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_odc.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_odc.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_odc.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_odc.date_fin_previ_form) )                   
                      { 
                         insert_in_baseModule_odc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_odc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_odc(module_odc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_odc==false)
            {
                getId = vm.selectedItemModule_odc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_odc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_odc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_odc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_odc.date_reel_resti)),
                    nbr_previ_parti: module_odc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_odc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_odc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_odc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_odc.lieu_formation,
                    observation:module_odc.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_odc/index",datas, config).success(function (data)
            {
                if (NouvelItemModule_odc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_odc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
                        vm.selectedItemModule_odc.$selected  = false;
                        vm.selectedItemModule_odc.$edit      = false;
                        vm.selectedItemModule_odc ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_odc = vm.allmodule_odc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_odc.id;
                      });
                      vm.showbuttonNouvformodc= true;
                    }
                    
                }
                else
                {
                  module_odc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

                  module_odc.id  =   String(data.response);              
                  NouvelItemModule_odc=false;
                  vm.showbuttonNouvformodc= false;
            }
            vm.stepparticipantodc=false;
            module_odc.validation=0;
              module_odc.$selected = false;
              module_odc.$edit = false;
              vm.selectedItemModule_odc = {};
             // vm.showbuttonValidationformodc = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

     
/*********************************************fin formation odc**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_participant_odc = function()
        {
          vm.showbuttonimporter_participant_odc =false;
          vm.showformimporter_participant_odc =true;
        }
        
        $scope.uploadFile_participant_odc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_odc = files;
        }
        vm.annulerimporter_participant_odc = function()
        {
            vm.fichier_participant_odc = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_participant_odc=true;
            vm.showformimporter_participant_odc=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_participant_odc = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_participant_odc[0];
          var repertoire = 'importer_participant_odc/';
          var uploadUrl = apiUrl + "importer_participant_odc/importerdonnee_participant_odc";
          var name = vm.myFile_participant_odc[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_participant_odc=data["nom_fichier"];
              vm.repertoire_participant_odc=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_participant_odc/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/******************************************debut participant_odc****************************************/
//col table
        vm.participant_odc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_odc = function ()
        { 
          if (NouvelItemParticipant_odc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_odc:''
            };         
            vm.allparticipant_odc.push(items);
            vm.allparticipant_odc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_odc = mem;
              }
            });

            NouvelItemParticipant_odc = true ;
          }else
          {
            vm.showAlert('Ajout participant_odc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_odc(participant_odc,suppression)
        {
            if (NouvelItemParticipant_odc==false)
            {
                test_existanceParticipant_odc (participant_odc,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_odc(participant_odc,suppression);
            }
        }

        //fonction de bouton d'annulation participant_odc
        vm.annulerParticipant_odc = function(item)
        {
          if (NouvelItemParticipant_odc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_odc.nom ;
            item.prenom   = currentItemParticipant_odc.prenom ;
            item.sexe      = currentItemParticipant_odc.sexe;
            item.id_situation_participant_odc   = currentItemParticipant_odc.id_situation_participant_odc ; 
          }else
          {
            vm.allparticipant_odc = vm.allparticipant_odc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_odc.id;
            });
          }

          vm.selectedItemParticipant_odc = {} ;
          NouvelItemParticipant_odc      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_odc= function (item)
        {
            vm.selectedItemParticipant_odc = item;
            vm.nouvelItemParticipant_odc   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_odc    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_odc));
            } 
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

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_odc = function(item)
        {
            NouvelItemParticipant_odc = false ;
            vm.selectedItemParticipant_odc = item;
            currentItemParticipant_odc = angular.copy(vm.selectedItemParticipant_odc);
            $scope.vm.allparticipant_odc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_odc.nom ;
            item.prenom = vm.selectedItemParticipant_odc.prenom;
            item.sexe  = vm.selectedItemParticipant_odc.sexe;
            item.id_situation_participant_odc = vm.selectedItemParticipant_odc.situation_participant_odc.id; 
        };

        //fonction bouton suppression item participant_odc
        vm.supprimerParticipant_odc = function()
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
                vm.ajoutParticipant_odc(vm.selectedItemParticipant_odc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_odc (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_odc.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_odc.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_odc.nom) 
                    || (mem[0].prenom!=currentItemParticipant_odc.prenom)
                    || (mem[0].sexe!=currentItemParticipant_odc.sexe)
                    || (mem[0].age!=currentItemParticipant_odc.age)
                    || (mem[0].id_situation_participant_odc!=currentItemParticipant_odc.id_situation_participant_odc))                    
                      { 
                         insert_in_baseParticipant_odc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_odc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_odc(participant_odc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_odc==false)
            {
                getId = vm.selectedItemParticipant_odc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_odc.nom,
                    prenom: participant_odc.prenom,
                    sexe: participant_odc.sexe,
                    id_situation_participant_odc: participant_odc.id_situation_participant_odc,
                    id_module_odc: vm.selectedItemModule_odc.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_odc/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_odc.filter(function(obj)
                {
                    return obj.id == participant_odc.id_situation_participant_odc;
                });

                if (NouvelItemParticipant_odc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_odc.situation_participant_odc= situ[0];
                        

                        if(currentItemParticipant_odc.sexe == 1 && currentItemParticipant_odc.sexe !=vm.selectedItemParticipant_odc.sexe)
                        {
                          vm.selectedItemModule_odc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_odc.sexe == 2 && currentItemParticipant_odc.sexe !=vm.selectedItemParticipant_odc.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_odc.$selected  = false;
                        vm.selectedItemParticipant_odc.$edit      = false;
                        vm.selectedItemParticipant_odc ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_odc = vm.allparticipant_odc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_odc.id;
                      });
                      
                      vm.selectedItemModule_odc.nbr_parti = parseInt(vm.selectedItemModule_odc.nbr_parti)-1;
                      
                      if(parseInt(participant_odc.sexe) == 2)
                      {
                        vm.selectedItemModule_odc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_odc.situation_participant_odc = situ[0];
                  participant_odc.id  =   String(data.response);              
                  NouvelItemParticipant_odc=false;

                  vm.selectedItemModule_odc.nbr_parti = parseInt(vm.selectedItemModule_odc.nbr_parti)+1;
                  if(parseInt(participant_odc.sexe) == 2)
                  {
                    vm.selectedItemModule_odc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_odc.nbr_reel_fem_parti)+1;
                  }
            }
              participant_odc.$selected = false;
              participant_odc.$edit = false;
              vm.selectedItemParticipant_odc = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /**********************************Fin participant odc****************************************/
   /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_module_emies = function()
        {
          vm.showbuttonimporter_module_emies =false;
          vm.showformimporter_module_emies =true;
        }
        
        $scope.uploadFile_module_emies = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_emies = files;
        }
        vm.annulerimporter_module_emies = function()
        {
            vm.fichier_module_emies = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_module_emies=true;
            vm.showformimporter_module_emies=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_module_emies = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_module_emies[0];
          var repertoire = 'importer_module_emies/';
          var uploadUrl = apiUrl + "importer_module_emies/importerdonnee_module_emies";
          var name = vm.myFile_module_emies[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_module_emies=data["nom_fichier"];
              vm.repertoire_module_emies=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_module_emies/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
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
        },
        {titre:"Action"
        }];


               
        //Masque de saisi ajout
        vm.ajouterModule_emies = function ()
        { 
          if (NouvelItemModule_emies == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              observation:''
            };         
            vm.allmodule_emies.push(items);
            vm.allmodule_emies.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_emies = mem;
              }
            });

            NouvelItemModule_emies = true ;
          }else
          {
            vm.showAlert('Ajout module_emies','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_emies(module_emies,suppression)
        {
            if (NouvelItemModule_emies==false)
            {
                test_existanceModule_emies (module_emies,suppression); 
            } 
            else
            {
                insert_in_baseModule_emies(module_emies,suppression);
            }
        }

        //fonction de bouton d'annulation module_emies
        vm.annulerModule_emies = function(item)
        {
          if (NouvelItemModule_emies == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_emies.observation ;
            item.date_debut_reel_form   = currentItemModule_emies.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_emies.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_emies.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_emies.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_emies.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_emies.date_fin_previ_form ;
            item.id_classification_site = currentItemModule_emies.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_emies.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_emies.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_emies.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_emies.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_emies = vm.allmodule_emies.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_emies.id;
            });
          }
          vm.stepparticipantemies=false;
          vm.showbuttonValidation = false;
          vm.selectedItemModule_emies = {} ;
          NouvelItemModule_emies      = false;
          
        };

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
            if (item.$selected==false || item.$selected == undefined)
              {
                
                currentItemModule_emies    = JSON.parse(JSON.stringify(vm.selectedItemModule_emies));
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

        //fonction masque de saisie modification item feffi
        vm.modifierModule_emies = function(item)
        {
            NouvelItemModule_emies = false ;
            vm.selectedItemModule_emies = item;
            currentItemModule_emies = angular.copy(vm.selectedItemModule_emies);
            $scope.vm.allmodule_emies.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_emies.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_emies.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_emies.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_emies.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_emies.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_emies.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_emies.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_emies.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_emies.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_emies.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_emies.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_emies.lieu_formation;
            vm.stepparticipantemies=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_emies = function()
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
                vm.ajoutModule_emies(vm.selectedItemModule_emies,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_emies (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_emies.filter(function(obj)
                {
                   return obj.id == currentItemModule_emies.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_emies.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_emies.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_emies.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_emies.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_emies.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_emies.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_emies.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_emies.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_emies.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_emies.date_fin_previ_form) )                   
                      { 
                         insert_in_baseModule_emies(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_emies(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_emies(module_emies,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_emies==false)
            {
                getId = vm.selectedItemModule_emies.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_emies.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_emies.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_emies.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_emies.date_reel_resti)),
                    nbr_previ_parti: module_emies.nbr_previ_parti,
                    nbr_previ_fem_parti: module_emies.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_emies.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_emies.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_emies.lieu_formation,
                    observation:module_emies.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_emies/index",datas, config).success(function (data)
            {
                if (NouvelItemModule_emies == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_emies.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
                        vm.selectedItemModule_emies.$selected  = false;
                        vm.selectedItemModule_emies.$edit      = false;
                        vm.selectedItemModule_emies ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_emies = vm.allmodule_emies.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_emies.id;
                      });
                      vm.showbuttonNouvformemies= true;
                    }
                    
                }
                else
                {
                  module_emies.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

                  module_emies.id  =   String(data.response);              
                  NouvelItemModule_emies=false;
                  vm.showbuttonNouvformemies= false;
            }
            vm.stepparticipantemies=false;
            module_emies.validation=0;
              module_emies.$selected = false;
              module_emies.$edit = false;
              vm.selectedItemModule_emies = {};
              vm.showbuttonValidationformemies = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

    
/*********************************************fin formation emies**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_participant_emies = function()
        {
          vm.showbuttonimporter_participant_emies =false;
          vm.showformimporter_participant_emies =true;
        }
        
        $scope.uploadFile_participant_emies = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_emies = files;
        }
        vm.annulerimporter_participant_emies = function()
        {
            vm.fichier_participant_emies = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_participant_emies=true;
            vm.showformimporter_participant_emies=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_participant_emies = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_participant_emies[0];
          var repertoire = 'importer_participant_emies/';
          var uploadUrl = apiUrl + "importer_participant_emies/importerdonnee_participant_emies";
          var name = vm.myFile_participant_emies[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_participant_emies=data["nom_fichier"];
              vm.repertoire_participant_emies=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_participant_emies/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/******************************************debut participant_emies*************************************************/
//col table
        vm.participant_emies_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_emies = function ()
        { 
          if (NouvelItemParticipant_emies == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_emies:''
            };         
            vm.allparticipant_emies.push(items);
            vm.allparticipant_emies.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_emies = mem;
              }
            });

            NouvelItemParticipant_emies = true ;
          }else
          {
            vm.showAlert('Ajout participant_emies','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_emies(participant_emies,suppression)
        {
            if (NouvelItemParticipant_emies==false)
            {
                test_existanceParticipant_emies (participant_emies,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_emies(participant_emies,suppression);
            }
        }

        //fonction de bouton d'annulation participant_emies
        vm.annulerParticipant_emies = function(item)
        {
          if (NouvelItemParticipant_emies == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_emies.nom ;
            item.prenom   = currentItemParticipant_emies.prenom ;
            item.sexe      = currentItemParticipant_emies.sexe;
            item.id_situation_participant_emies   = currentItemParticipant_emies.id_situation_participant_emies ; 
          }else
          {
            vm.allparticipant_emies = vm.allparticipant_emies.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_emies.id;
            });
          }

          vm.selectedItemParticipant_emies = {} ;
          NouvelItemParticipant_emies      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_emies= function (item)
        {
            vm.selectedItemParticipant_emies = item;
            vm.nouvelItemParticipant_emies   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_emies    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_emies));
            } 
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

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_emies = function(item)
        {
            NouvelItemParticipant_emies = false ;
            vm.selectedItemParticipant_emies = item;
            currentItemParticipant_emies = angular.copy(vm.selectedItemParticipant_emies);
            $scope.vm.allparticipant_emies.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_emies.nom ;
            item.prenom = vm.selectedItemParticipant_emies.prenom;
            item.sexe  = vm.selectedItemParticipant_emies.sexe;
            item.id_situation_participant_emies = vm.selectedItemParticipant_emies.situation_participant_emies.id; 
        };

        //fonction bouton suppression item participant_emies
        vm.supprimerParticipant_emies = function()
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
                vm.ajoutParticipant_emies(vm.selectedItemParticipant_emies,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_emies (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_emies.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_emies.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_emies.nom) 
                    || (mem[0].prenom!=currentItemParticipant_emies.prenom)
                    || (mem[0].sexe!=currentItemParticipant_emies.sexe)
                    || (mem[0].age!=currentItemParticipant_emies.age)
                    || (mem[0].id_situation_participant_emies!=currentItemParticipant_emies.id_situation_participant_emies))                    
                      { 
                         insert_in_baseParticipant_emies(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_emies(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_emies(participant_emies,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_emies==false)
            {
                getId = vm.selectedItemParticipant_emies.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_emies.nom,
                    prenom: participant_emies.prenom,
                    sexe: participant_emies.sexe,
                    id_situation_participant_emies: participant_emies.id_situation_participant_emies,
                    id_module_emies: vm.selectedItemModule_emies.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_emies/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_emies.filter(function(obj)
                {
                    return obj.id == participant_emies.id_situation_participant_emies;
                });

                if (NouvelItemParticipant_emies == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_emies.situation_participant_emies= situ[0];
                        

                        if(currentItemParticipant_emies.sexe == 1 && currentItemParticipant_emies.sexe !=vm.selectedItemParticipant_emies.sexe)
                        {
                          vm.selectedItemModule_emies.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_emies.sexe == 2 && currentItemParticipant_emies.sexe !=vm.selectedItemParticipant_emies.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_emies.$selected  = false;
                        vm.selectedItemParticipant_emies.$edit      = false;
                        vm.selectedItemParticipant_emies ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_emies = vm.allparticipant_emies.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_emies.id;
                      });
                      
                      vm.selectedItemModule_emies.nbr_parti = parseInt(vm.selectedItemModule_emies.nbr_parti)-1;
                      
                      if(parseInt(participant_emies.sexe) == 2)
                      {
                        vm.selectedItemModule_emies.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_emies.situation_participant_emies = situ[0];
                  participant_emies.id  =   String(data.response);              
                  NouvelItemParticipant_emies=false;

                  vm.selectedItemModule_emies.nbr_parti = parseInt(vm.selectedItemModule_emies.nbr_parti)+1;
                  if(parseInt(participant_emies.sexe) == 2)
                  {
                    vm.selectedItemModule_emies.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_emies.nbr_reel_fem_parti)+1;
                  }
            }
              participant_emies.$selected = false;
              participant_emies.$edit = false;
              vm.selectedItemParticipant_emies = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/******************************************fin participant emies****************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_module_gfpc = function()
        {
          vm.showbuttonimporter_module_gfpc =false;
          vm.showformimporter_module_gfpc =true;
        }
        
        $scope.uploadFile_module_gfpc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_gfpc = files;
        }
        vm.annulerimporter_module_gfpc = function()
        {
            vm.fichier_module_gfpc = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_module_gfpc=true;
            vm.showformimporter_module_gfpc=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_module_gfpc = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_module_gfpc[0];
          var repertoire = 'importer_module_gfpc/';
          var uploadUrl = apiUrl + "importer_module_gfpc/importerdonnee_module_gfpc";
          var name = vm.myFile_module_gfpc[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_module_gfpc=data["nom_fichier"];
              vm.repertoire_module_gfpc=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_module_gfpc/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
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
        },
        {titre:"Action"
        }];



        //Masque de saisi ajout
        vm.ajouterModule_gfpc = function ()
        { 
          if (NouvelItemModule_gfpc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              observation:''
            };         
            vm.allmodule_gfpc.push(items);
            vm.allmodule_gfpc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_gfpc = mem;
              }
            });

            NouvelItemModule_gfpc = true ;
          }else
          {
            vm.showAlert('Ajout module_gfpc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_gfpc(module_gfpc,suppression)
        {
            if (NouvelItemModule_gfpc==false)
            {
                test_existanceModule_gfpc (module_gfpc,suppression); 
            } 
            else
            {
                insert_in_baseModule_gfpc(module_gfpc,suppression);
            }
        }

        //fonction de bouton d'annulation module_gfpc
        vm.annulerModule_gfpc = function(item)
        {
          if (NouvelItemModule_gfpc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_gfpc.observation ;
            item.date_debut_reel_form   = currentItemModule_gfpc.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_gfpc.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_gfpc.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_gfpc.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_gfpc.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_gfpc.date_fin_previ_form ;
            item.id_classification_site = currentItemModule_gfpc.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_gfpc.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_gfpc.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_gfpc.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_gfpc.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_gfpc = vm.allmodule_gfpc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_gfpc.id;
            });
          }
          vm.stepparticipantgfpc=false;
          vm.selectedItemModule_gfpc = {} ;
          NouvelItemModule_gfpc      = false;
          
        };

        //fonction selection item region
        vm.selectionModule_gfpc= function (item)
        {
            vm.selectedItemModule_gfpc = item;
            vm.nouvelItemModule_gfpc   = item;
            vm.showbuttonNouvRapport =true;
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
            if (item.$selected==false || item.$selected == undefined)
              {
                
                currentItemModule_gfpc    = JSON.parse(JSON.stringify(vm.selectedItemModule_gfpc));
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

        //fonction masque de saisie modification item feffi
        vm.modifierModule_gfpc = function(item)
        {
            NouvelItemModule_gfpc = false ;
            vm.selectedItemModule_gfpc = item;
            currentItemModule_gfpc = angular.copy(vm.selectedItemModule_gfpc);
            $scope.vm.allmodule_gfpc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_gfpc.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_gfpc.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_gfpc.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_gfpc.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_gfpc.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_gfpc.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_gfpc.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_gfpc.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_gfpc.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_gfpc.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_gfpc.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_gfpc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_gfpc.lieu_formation;
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_gfpc.contrat_partenaire_relai);
            vm.showbuttonValidationformgfpc =false;
            vm.stepparticipantgfpc=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_gfpc = function()
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
                vm.ajoutModule_gfpc(vm.selectedItemModule_gfpc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_gfpc (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_gfpc.filter(function(obj)
                {
                   return obj.id == currentItemModule_gfpc.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_gfpc.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_gfpc.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_gfpc.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_gfpc.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_gfpc.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_gfpc.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_gfpc.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_gfpc.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_gfpc.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_gfpc.date_fin_previ_form) )                   
                      { 
                         insert_in_baseModule_gfpc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_gfpc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_gfpc(module_gfpc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_gfpc==false)
            {
                getId = vm.selectedItemModule_gfpc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_gfpc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_gfpc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_gfpc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_gfpc.date_reel_resti)),
                    nbr_previ_parti: module_gfpc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_gfpc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_gfpc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_gfpc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_gfpc.lieu_formation,
                    observation:module_gfpc.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_gfpc/index",datas, config).success(function (data)
            {
                if (NouvelItemModule_gfpc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_gfpc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
                        vm.selectedItemModule_gfpc.$selected  = false;
                        vm.selectedItemModule_gfpc.$edit      = false;
                        vm.selectedItemModule_gfpc ={};
                        //vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allmodule_gfpc = vm.allmodule_gfpc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_gfpc.id;
                      });
                      vm.showbuttonNouvformgfpc= true;
                    }
                    
                }
                else
                {
                  module_gfpc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

                  module_gfpc.id  =   String(data.response);              
                  NouvelItemModule_gfpc=false;
                  vm.showbuttonNouvformgfpc= false;
            }
            vm.stepparticipantgfpc=false;
            module_gfpc.validation=0;
              module_gfpc.$selected = false;
              module_gfpc.$edit = false;
              vm.selectedItemModule_gfpc = {};
              vm.showbuttonValidationformgfpc = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/*********************************************fin formation gfpc**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_participant_gfpc = function()
        {
          vm.showbuttonimporter_participant_gfpc =false;
          vm.showformimporter_participant_gfpc =true;
        }
        
        $scope.uploadFile_participant_gfpc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_gfpc = files;
        }
        vm.annulerimporter_participant_gfpc = function()
        {
            vm.fichier_participant_gfpc = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_participant_gfpc=true;
            vm.showformimporter_participant_gfpc=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_participant_gfpc = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_participant_gfpc[0];
          var repertoire = 'importer_participant_gfpc/';
          var uploadUrl = apiUrl + "importer_participant_gfpc/importerdonnee_participant_gfpc";
          var name = vm.myFile_participant_gfpc[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_participant_gfpc=data["nom_fichier"];
              vm.repertoire_participant_gfpc=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_participant_gfpc/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/*****************************************debut participant_gfpc********************************************/
//col table
        vm.participant_gfpc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_gfpc = function ()
        { 
          if (NouvelItemParticipant_gfpc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_gfpc:''
            };         
            vm.allparticipant_gfpc.push(items);
            vm.allparticipant_gfpc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_gfpc = mem;
              }
            });

            NouvelItemParticipant_gfpc = true ;
          }else
          {
            vm.showAlert('Ajout participant_gfpc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_gfpc(participant_gfpc,suppression)
        {
            if (NouvelItemParticipant_gfpc==false)
            {
                test_existanceParticipant_gfpc (participant_gfpc,suppression); 
            } 
            else
            {console.log('ze');
                insert_in_baseParticipant_gfpc(participant_gfpc,suppression);
            }
        }

        //fonction de bouton d'annulation participant_gfpc
        vm.annulerParticipant_gfpc = function(item)
        {
          if (NouvelItemParticipant_gfpc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_gfpc.nom ;
            item.prenom   = currentItemParticipant_gfpc.prenom ;
            item.sexe      = currentItemParticipant_gfpc.sexe;
            item.id_situation_participant_gfpc   = currentItemParticipant_gfpc.id_situation_participant_gfpc ; 
          }else
          {
            vm.allparticipant_gfpc = vm.allparticipant_gfpc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_gfpc.id;
            });
          }

          vm.selectedItemParticipant_gfpc = {} ;
          NouvelItemParticipant_gfpc      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_gfpc= function (item)
        {
            vm.selectedItemParticipant_gfpc = item;
            vm.nouvelItemParticipant_gfpc   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_gfpc    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_gfpc));
            } 
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

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_gfpc = function(item)
        {
            NouvelItemParticipant_gfpc = false ;
            vm.selectedItemParticipant_gfpc = item;
            currentItemParticipant_gfpc = angular.copy(vm.selectedItemParticipant_gfpc);
            $scope.vm.allparticipant_gfpc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_gfpc.nom ;
            item.prenom = vm.selectedItemParticipant_gfpc.prenom;
            item.sexe  = vm.selectedItemParticipant_gfpc.sexe;
            item.id_situation_participant_gfpc = vm.selectedItemParticipant_gfpc.situation_participant_gfpc.id; 
        };

        //fonction bouton suppression item participant_gfpc
        vm.supprimerParticipant_gfpc = function()
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
                vm.ajoutParticipant_gfpc(vm.selectedItemParticipant_gfpc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_gfpc (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_gfpc.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_gfpc.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_gfpc.nom) 
                    || (mem[0].prenom!=currentItemParticipant_gfpc.prenom)
                    || (mem[0].sexe!=currentItemParticipant_gfpc.sexe)
                    || (mem[0].age!=currentItemParticipant_gfpc.age)
                    || (mem[0].id_situation_participant_gfpc!=currentItemParticipant_gfpc.id_situation_participant_gfpc))                    
                      { 
                         insert_in_baseParticipant_gfpc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_gfpc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_gfpc(participant_gfpc,suppression)
        {console.log('rrr');
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_gfpc==false)
            {
                getId = vm.selectedItemParticipant_gfpc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_gfpc.nom,
                    prenom: participant_gfpc.prenom,
                    sexe: participant_gfpc.sexe,
                    id_situation_participant_gfpc: participant_gfpc.id_situation_participant_gfpc,
                    id_module_gfpc: vm.selectedItemModule_gfpc.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_gfpc/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_gfpc.filter(function(obj)
                {
                    return obj.id == participant_gfpc.id_situation_participant_gfpc;
                });

                if (NouvelItemParticipant_gfpc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_gfpc.situation_participant_gfpc= situ[0];
                        

                        if(currentItemParticipant_gfpc.sexe == 1 && currentItemParticipant_gfpc.sexe !=vm.selectedItemParticipant_gfpc.sexe)
                        {
                          vm.selectedItemModule_gfpc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_gfpc.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_gfpc.sexe == 2 && currentItemParticipant_gfpc.sexe !=vm.selectedItemParticipant_gfpc.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_gfpc.$selected  = false;
                        vm.selectedItemParticipant_gfpc.$edit      = false;
                        vm.selectedItemParticipant_gfpc ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_gfpc = vm.allparticipant_gfpc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_gfpc.id;
                      });
                      
                      vm.selectedItemModule_gfpc.nbr_parti = parseInt(vm.selectedItemModule_gfpc.nbr_parti)-1;
                      
                      if(parseInt(participant_gfpc.sexe) == 2)
                      {
                        vm.selectedItemModule_gfpc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_gfpc.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_gfpc.situation_participant_gfpc = situ[0];
                  participant_gfpc.id  =   String(data.response);              
                  NouvelItemParticipant_gfpc=false;

                  vm.selectedItemModule_gfpc.nbr_parti = parseInt(vm.selectedItemModule_gfpc.nbr_parti)+1;
                  if(parseInt(participant_gfpc.sexe) == 2)
                  {
                    vm.selectedItemModule_gfpc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_gfpc.nbr_reel_fem_parti)+1;
                  }
            }
              participant_gfpc.$selected = false;
              participant_gfpc.$edit = false;
              vm.selectedItemParticipant_gfpc = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/*******************************************Fin participant gfpc***********************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_module_pmc = function()
        {
          vm.showbuttonimporter_module_pmc =false;
          vm.showformimporter_module_pmc =true;
        }
        
        $scope.uploadFile_module_pmc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_pmc = files;
        }
        vm.annulerimporter_module_pmc = function()
        {
            vm.fichier_module_pmc = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_module_pmc=true;
            vm.showformimporter_module_pmc=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_module_pmc = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_module_pmc[0];
          var repertoire = 'importer_module_pmc/';
          var uploadUrl = apiUrl + "importer_module_pmc/importerdonnee_module_pmc";
          var name = vm.myFile_module_pmc[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_module_pmc=data["nom_fichier"];
              vm.repertoire_module_pmc=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_module_pmc/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
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
        },
        {titre:"Action"
        }];


                
        //Masque de saisi ajout
        vm.ajouterModule_pmc = function ()
        { 
          if (NouvelItemModule_pmc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              observation:''
            };         
            vm.allmodule_pmc.push(items);
            vm.allmodule_pmc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_pmc = mem;
              }
            });

            NouvelItemModule_pmc = true ;
          }else
          {
            vm.showAlert('Ajout module_pmc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_pmc(module_pmc,suppression)
        {
            if (NouvelItemModule_pmc==false)
            {
                test_existanceModule_pmc (module_pmc,suppression); 
            } 
            else
            {
                insert_in_baseModule_pmc(module_pmc,suppression);
            }
        }

        //fonction de bouton d'annulation module_pmc
        vm.annulerModule_pmc = function(item)
        {
          if (NouvelItemModule_pmc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_pmc.observation ;
            item.date_debut_reel_form   = currentItemModule_pmc.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_pmc.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_pmc.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_pmc.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_pmc.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_pmc.date_fin_previ_form ;
            item.id_classification_site = currentItemModule_pmc.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_pmc.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_pmc.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_pmc.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_pmc.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_pmc = vm.allmodule_pmc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_pmc.id;
            });
          }
          vm.stepparticipantpmc=false;
          vm.showbuttonValidation = false;
          vm.selectedItemModule_pmc = {} ;
          NouvelItemModule_pmc      = false;
          
        };

        //fonction selection item region
        vm.selectionModule_pmc= function (item)
        {
            vm.selectedItemModule_pmc = item;
            vm.nouvelItemModule_pmc   = item;
            vm.showbuttonNouvRapport =true;
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
            if (item.$selected==false || item.$selected == undefined)
              {
                
                currentItemModule_pmc    = JSON.parse(JSON.stringify(vm.selectedItemModule_pmc));
              }
              vm.showbuttonValidationformpmc = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierModule_pmc = function(item)
        {
            NouvelItemModule_pmc = false ;
            vm.selectedItemModule_pmc = item;
            currentItemModule_pmc = angular.copy(vm.selectedItemModule_pmc);
            $scope.vm.allmodule_pmc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_pmc.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_pmc.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_pmc.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_pmc.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_pmc.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_pmc.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_pmc.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_pmc.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_pmc.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_pmc.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_pmc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_pmc.lieu_formation;
            vm.stepparticipantpmc=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_pmc = function()
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
                vm.ajoutModule_pmc(vm.selectedItemModule_pmc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_pmc (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_pmc.filter(function(obj)
                {
                   return obj.id == currentItemModule_pmc.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_pmc.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_pmc.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_pmc.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_pmc.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_pmc.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_pmc.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_pmc.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_pmc.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_pmc.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_pmc.date_fin_previ_form) )                   
                      { 
                         insert_in_baseModule_pmc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_pmc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_pmc(module_pmc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_pmc==false)
            {
                getId = vm.selectedItemModule_pmc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_pmc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_pmc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_pmc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_pmc.date_reel_resti)),
                    nbr_previ_parti: module_pmc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_pmc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_pmc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_pmc.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_pmc.lieu_formation,
                    observation:module_pmc.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_pmc/index",datas, config).success(function (data)
            {

                if (NouvelItemModule_pmc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_pmc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
                        vm.selectedItemModule_pmc.$selected  = false;
                        vm.selectedItemModule_pmc.$edit      = false;
                        vm.selectedItemModule_pmc ={};
                        vm.showbuttonNouvformpmc= false;
                    }
                    else 
                    {    
                      vm.allmodule_pmc = vm.allmodule_pmc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_pmc.id;
                      });
                      vm.showbuttonNouvformpmc= true;
                    }
                    
                }
                else
                {
                  module_pmc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

                  module_pmc.id  =   String(data.response);              
                  NouvelItemModule_pmc=false;
                  vm.showbuttonNouvformpmc= false;
            }
            vm.stepparticipantpmc=false;
            module_pmc.validation=0;
              module_pmc.$selected = false;
              module_pmc.$edit = false;
              vm.selectedItemModule_pmc = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation pmc**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_participant_pmc = function()
        {
          vm.showbuttonimporter_participant_pmc =false;
          vm.showformimporter_participant_pmc =true;
        }
        
        $scope.uploadFile_participant_pmc = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_pmc = files;
        }
        vm.annulerimporter_participant_pmc = function()
        {
            vm.fichier_participant_pmc = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_participant_pmc=true;
            vm.showformimporter_participant_pmc=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_participant_pmc = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_participant_pmc[0];
          var repertoire = 'importer_participant_pmc/';
          var uploadUrl = apiUrl + "importer_participant_pmc/importerdonnee_participant_pmc";
          var name = vm.myFile_participant_pmc[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_participant_pmc=data["nom_fichier"];
              vm.repertoire_participant_pmc=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_participant_pmc/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut participant_pmc****************************************/
//col table
        vm.participant_pmc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_pmc = function ()
        { 
          if (NouvelItemParticipant_pmc == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_pmc:''
            };         
            vm.allparticipant_pmc.push(items);
            vm.allparticipant_pmc.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_pmc = mem;
              }
            });

            NouvelItemParticipant_pmc = true ;
          }else
          {
            vm.showAlert('Ajout participant_pmc','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_pmc(participant_pmc,suppression)
        {
            if (NouvelItemParticipant_pmc==false)
            {
                test_existanceParticipant_pmc (participant_pmc,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_pmc(participant_pmc,suppression);
            }
        }

        //fonction de bouton d'annulation participant_pmc
        vm.annulerParticipant_pmc = function(item)
        {
          if (NouvelItemParticipant_pmc == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_pmc.nom ;
            item.prenom   = currentItemParticipant_pmc.prenom ;
            item.sexe      = currentItemParticipant_pmc.sexe;
            item.id_situation_participant_pmc   = currentItemParticipant_pmc.id_situation_participant_pmc ; 
          }else
          {
            vm.allparticipant_pmc = vm.allparticipant_pmc.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_pmc.id;
            });
          }

          vm.selectedItemParticipant_pmc = {} ;
          NouvelItemParticipant_pmc      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_pmc= function (item)
        {
            vm.selectedItemParticipant_pmc = item;
            vm.nouvelItemParticipant_pmc   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_pmc    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_pmc));
            } 
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

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_pmc = function(item)
        {
            NouvelItemParticipant_pmc = false ;
            vm.selectedItemParticipant_pmc = item;
            currentItemParticipant_pmc = angular.copy(vm.selectedItemParticipant_pmc);
            $scope.vm.allparticipant_pmc.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_pmc.nom ;
            item.prenom = vm.selectedItemParticipant_pmc.prenom;
            item.sexe  = vm.selectedItemParticipant_pmc.sexe;
            item.id_situation_participant_pmc = vm.selectedItemParticipant_pmc.situation_participant_pmc.id; 
        };

        //fonction bouton suppression item participant_pmc
        vm.supprimerParticipant_pmc = function()
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
                vm.ajoutParticipant_pmc(vm.selectedItemParticipant_pmc,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_pmc (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_pmc.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_pmc.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_pmc.nom) 
                    || (mem[0].prenom!=currentItemParticipant_pmc.prenom)
                    || (mem[0].sexe!=currentItemParticipant_pmc.sexe)
                    || (mem[0].age!=currentItemParticipant_pmc.age)
                    || (mem[0].id_situation_participant_pmc!=currentItemParticipant_pmc.id_situation_participant_pmc))                    
                      { 
                         insert_in_baseParticipant_pmc(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_pmc(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_pmc(participant_pmc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_pmc==false)
            {
                getId = vm.selectedItemParticipant_pmc.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_pmc.nom,
                    prenom: participant_pmc.prenom,
                    sexe: participant_pmc.sexe,
                    id_situation_participant_pmc: participant_pmc.id_situation_participant_pmc,
                    id_module_pmc: vm.selectedItemModule_pmc.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_pmc/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_pmc.filter(function(obj)
                {
                    return obj.id == participant_pmc.id_situation_participant_pmc;
                });

                if (NouvelItemParticipant_pmc == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_pmc.situation_participant_pmc= situ[0];
                        

                        if(currentItemParticipant_pmc.sexe == 1 && currentItemParticipant_pmc.sexe !=vm.selectedItemParticipant_pmc.sexe)
                        {
                          vm.selectedItemModule_pmc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_pmc.sexe == 2 && currentItemParticipant_pmc.sexe !=vm.selectedItemParticipant_pmc.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_pmc.$selected  = false;
                        vm.selectedItemParticipant_pmc.$edit      = false;
                        vm.selectedItemParticipant_pmc ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_pmc = vm.allparticipant_pmc.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_pmc.id;
                      });
                      
                      vm.selectedItemModule_pmc.nbr_parti = parseInt(vm.selectedItemModule_pmc.nbr_parti)-1;
                      
                      if(parseInt(participant_pmc.sexe) == 2)
                      {
                        vm.selectedItemModule_pmc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_pmc.situation_participant_pmc = situ[0];
                  participant_pmc.id  =   String(data.response);              
                  NouvelItemParticipant_pmc=false;

                  vm.selectedItemModule_pmc.nbr_parti = parseInt(vm.selectedItemModule_pmc.nbr_parti)+1;
                  if(parseInt(participant_pmc.sexe) == 2)
                  {
                    vm.selectedItemModule_pmc.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_pmc.nbr_reel_fem_parti)+1;
                  }
            }
              participant_pmc.$selected = false;
              participant_pmc.$edit = false;
              vm.selectedItemParticipant_pmc = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/********************************************fin participant pmc**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_module_sep = function()
        {
          vm.showbuttonimporter_module_sep =false;
          vm.showformimporter_module_sep =true;
        }
        
        $scope.uploadFile_module_sep = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_module_sep = files;
        }
        vm.annulerimporter_module_sep = function()
        {
            vm.fichier_module_sep = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_module_sep=true;
            vm.showformimporter_module_sep=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_module_sep = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_module_sep[0];
          var repertoire = 'importer_module_sep/';
          var uploadUrl = apiUrl + "importer_module_sep/importerdonnee_module_sep";
          var name = vm.myFile_module_sep[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_module_sep=data["nom_fichier"];
              vm.repertoire_module_sep=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_module_sep/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
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
        },
        {titre:"Action"
        }];


                
        //Masque de saisi ajout
        vm.ajouterModule_sep = function ()
        { 
          if (NouvelItemModule_sep == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_debut_previ_form: '',
              date_fin_previ_form: '',         
              date_previ_resti: '',
              date_debut_reel_form: '',
              date_fin_reel_form: '',
              date_reel_resti:'',
              nbr_previ_parti: '',
              nbr_parti: 0,
              nbr_previ_fem_parti: '',
              nbr_reel_fem_parti:0,
              lieu_formation:'',
              date_os: '',
              observation:''
            };         
            vm.allmodule_sep.push(items);
            vm.allmodule_sep.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemModule_sep = mem;
              }
            });

            NouvelItemModule_sep = true ;
          }else
          {
            vm.showAlert('Ajout module_sep','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutModule_sep(module_sep,suppression)
        {
            if (NouvelItemModule_sep==false)
            {
                test_existanceModule_sep (module_sep,suppression); 
            } 
            else
            {
                insert_in_baseModule_sep(module_sep,suppression);
            }
        }

        //fonction de bouton d'annulation module_sep
        vm.annulerModule_sep = function(item)
        {
          if (NouvelItemModule_sep == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemModule_sep.observation ;
            item.date_debut_reel_form   = currentItemModule_sep.date_debut_reel_form ;
            item.nbr_parti = currentItemModule_sep.nbr_parti ;
            item.date_fin_reel_form = currentItemModule_sep.date_fin_reel_form;
            item.date_previ_resti = currentItemModule_sep.date_previ_resti ;
            item.date_debut_previ_form   = currentItemModule_sep.date_debut_previ_form ;
            item.date_fin_previ_form   = currentItemModule_sep.date_fin_previ_form ;
            item.id_classification_site = currentItemModule_sep.id_prestataire ;
            item.nbr_previ_parti    = currentItemModule_sep.nbr_previ_parti ;
            item.date_reel_resti  = currentItemModule_sep.date_reel_resti ;
            item.nbr_previ_fem_parti   = currentItemModule_sep.nbr_previ_fem_parti;
            item.nbr_reel_fem_parti  = currentItemModule_sep.nbr_reel_fem_parti ;
          }else
          {
            vm.allmodule_sep = vm.allmodule_sep.filter(function(obj)
            {
                return obj.id !== vm.selectedItemModule_sep.id;
            });
          }
          vm.stepparticipantsep=false;
          vm.selectedItemModule_sep = {} ;
          NouvelItemModule_sep      = false;
          
        };

        //fonction selection item region
        vm.selectionModule_sep= function (item)
        {
            vm.selectedItemModule_sep = item;
            vm.nouvelItemModule_sep   = item;
            vm.showbuttonNouvRapport =true;
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
            if (item.$selected==false || item.$selected == undefined)
              {
                
                currentItemModule_sep    = JSON.parse(JSON.stringify(vm.selectedItemModule_sep));
              }
              vm.showbuttonValidationformsep = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierModule_sep = function(item)
        {
            NouvelItemModule_sep = false ;
            vm.selectedItemModule_sep = item;
            currentItemModule_sep = angular.copy(vm.selectedItemModule_sep);
            $scope.vm.allmodule_sep.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemModule_sep.observation ;
            item.date_debut_reel_form   = new Date(vm.selectedItemModule_sep.date_debut_reel_form) ;
            item.nbr_parti = parseInt(vm.selectedItemModule_sep.nbr_parti);
            item.date_fin_reel_form = new Date(vm.selectedItemModule_sep.date_fin_reel_form);
            item.date_previ_resti = new Date(vm.selectedItemModule_sep.date_previ_resti) ;
            item.nbr_previ_parti    = parseInt(vm.selectedItemModule_sep.nbr_previ_parti );
            item.date_reel_resti  = new Date(vm.selectedItemModule_sep.date_reel_resti) ;
            item.nbr_previ_fem_parti   = parseInt(vm.selectedItemModule_sep.nbr_previ_fem_parti);
            item.nbr_reel_fem_parti  = parseInt(vm.selectedItemModule_sep.nbr_reel_fem_parti );
            item.date_debut_previ_form   = new Date(vm.selectedItemModule_sep.date_debut_previ_form );
            item.date_fin_previ_form   = new Date(vm.selectedItemModule_sep.date_fin_previ_form) ;
            item.id_contrat_partenaire_relai  = vm.selectedItemModule_sep.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_sep.lieu_formation;
            vm.stepparticipantsep=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_sep = function()
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
                vm.ajoutModule_sep(vm.selectedItemModule_sep,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceModule_sep (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmodule_sep.filter(function(obj)
                {
                   return obj.id == currentItemModule_sep.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemModule_sep.observation )
                    || (pass[0].date_debut_reel_form   != currentItemModule_sep.date_debut_reel_form )
                    || (pass[0].date_fin_reel_form != currentItemModule_sep.date_fin_reel_form)
                    || (pass[0].date_previ_resti != currentItemModule_sep.date_previ_resti )
                    || (pass[0].id_classification_site != currentItemModule_sep.id_classification_site )
                    || (pass[0].nbr_previ_parti    != currentItemModule_sep.nbr_previ_parti )
                    || (pass[0].date_reel_resti  != currentItemModule_sep.date_reel_resti )
                    || (pass[0].nbr_previ_fem_parti   != currentItemModule_sep.nbr_previ_fem_parti)
                    || (pass[0].date_debut_previ_form  != currentItemModule_sep.date_debut_previ_form )
                    || (pass[0].date_fin_previ_form   != currentItemModule_sep.date_fin_previ_form) )                   
                      { 
                         insert_in_baseModule_sep(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseModule_sep(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseModule_sep(module_sep,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemModule_sep==false)
            {
                getId = vm.selectedItemModule_sep.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_previ_resti: convertionDate(new Date(module_sep.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_sep.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_sep.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_sep.date_reel_resti)),
                    nbr_previ_parti: module_sep.nbr_previ_parti,
                    nbr_previ_fem_parti: module_sep.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_sep.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_sep.date_fin_previ_form)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    lieu_formation: module_sep.lieu_formation,
                    observation:module_sep.observation,
                    validation : 0              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_sep/index",datas, config).success(function (data)
            {   
                var contrat_part= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == module_sep.id_contrat_partenaire_relai;
                });


                if (NouvelItemModule_sep == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemModule_sep.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
                        vm.selectedItemModule_sep.$selected  = false;
                        vm.selectedItemModule_sep.$edit      = false;
                        vm.selectedItemModule_sep ={};
                        vm.showbuttonNouvformsep= false;
                    }
                    else 
                    {    
                      vm.allmodule_sep = vm.allmodule_sep.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemModule_sep.id;
                      });
                      vm.showbuttonNouvformsep= true;
                    }
                    
                }
                else
                {
                  module_sep.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

                  module_sep.id  =   String(data.response);              
                  NouvelItemModule_sep=false;
                  vm.showbuttonNouvformsep= false;
            } 
              vm.stepparticipantsep=false;
              module_sep.validation=0;
              module_sep.$selected = false;
              module_sep.$edit = false;
              vm.selectedItemModule_sep = {};
              vm.showbuttonValidationformsep = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/*********************************************fin formation sep**************************************************/
 /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_participant_sep = function()
        {
          vm.showbuttonimporter_participant_sep =false;
          vm.showformimporter_participant_sep =true;
        }
        
        $scope.uploadFile_participant_sep = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_participant_sep = files;
        }
        vm.annulerimporter_participant_sep = function()
        {
            vm.fichier_participant_sep = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_participant_sep=true;
            vm.showformimporter_participant_sep=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_participant_sep = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_participant_sep[0];
          var repertoire = 'importer_participant_sep/';
          var uploadUrl = apiUrl + "importer_participant_sep/importerdonnee_participant_sep";
          var name = vm.myFile_participant_sep[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_participant_sep=data["nom_fichier"];
              vm.repertoire_participant_sep=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_participant_sep/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut participant_sep****************************************/
//col table
        vm.participant_sep_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

        //Masque de saisi ajout
        vm.ajouterParticipant_sep = function ()
        { 
          if (NouvelItemParticipant_sep == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nom: '',
              prenom: '',
              sexe: '',
              id_situation_participant_sep:''
            };         
            vm.allparticipant_sep.push(items);
            vm.allparticipant_sep.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemParticipant_sep = mem;
              }
            });

            NouvelItemParticipant_sep = true ;
          }else
          {
            vm.showAlert('Ajout participant_sep','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutParticipant_sep(participant_sep,suppression)
        {
            if (NouvelItemParticipant_sep==false)
            {
                test_existanceParticipant_sep (participant_sep,suppression); 
            } 
            else
            {
                insert_in_baseParticipant_sep(participant_sep,suppression);
            }
        }

        //fonction de bouton d'annulation participant_sep
        vm.annulerParticipant_sep = function(item)
        {
          if (NouvelItemParticipant_sep == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nom      = currentItemParticipant_sep.nom ;
            item.prenom   = currentItemParticipant_sep.prenom ;
            item.sexe      = currentItemParticipant_sep.sexe;
            item.id_situation_participant_sep   = currentItemParticipant_sep.id_situation_participant_sep ; 
          }else
          {
            vm.allparticipant_sep = vm.allparticipant_sep.filter(function(obj)
            {
                return obj.id !== vm.selectedItemParticipant_sep.id;
            });
          }

          vm.selectedItemParticipant_sep = {} ;
          NouvelItemParticipant_sep      = false;
          
        };

        //fonction selection item region
        vm.selectionParticipant_sep= function (item)
        {
            vm.selectedItemParticipant_sep = item;
            vm.nouvelItemParticipant_sep   = item;
            if(item.$selected==false)
            {
              currentItemParticipant_sep    = JSON.parse(JSON.stringify(vm.selectedItemParticipant_sep));
            } 
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

        //fonction masque de saisie modification item feffi
        vm.modifierParticipant_sep = function(item)
        {
            NouvelItemParticipant_sep = false ;
            vm.selectedItemParticipant_sep = item;
            currentItemParticipant_sep = angular.copy(vm.selectedItemParticipant_sep);
            $scope.vm.allparticipant_sep.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.nom      = vm.selectedItemParticipant_sep.nom ;
            item.prenom = vm.selectedItemParticipant_sep.prenom;
            item.sexe  = vm.selectedItemParticipant_sep.sexe;
            item.id_situation_participant_sep = vm.selectedItemParticipant_sep.situation_participant_sep.id; 
        };

        //fonction bouton suppression item participant_sep
        vm.supprimerParticipant_sep = function()
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
                vm.ajoutParticipant_sep(vm.selectedItemParticipant_sep,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceParticipant_sep (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allparticipant_sep.filter(function(obj)
                {
                   return obj.id == currentItemParticipant_sep.id;
                });
                if(mem[0])
                {
                   if((mem[0].nom!=currentItemParticipant_sep.nom) 
                    || (mem[0].prenom!=currentItemParticipant_sep.prenom)
                    || (mem[0].sexe!=currentItemParticipant_sep.sexe)
                    || (mem[0].age!=currentItemParticipant_sep.age)
                    || (mem[0].id_situation_participant_sep!=currentItemParticipant_sep.id_situation_participant_sep))                    
                      { 
                         insert_in_baseParticipant_sep(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseParticipant_sep(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseParticipant_sep(participant_sep,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemParticipant_sep==false)
            {
                getId = vm.selectedItemParticipant_sep.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nom:      participant_sep.nom,
                    prenom: participant_sep.prenom,
                    sexe: participant_sep.sexe,
                    id_situation_participant_sep: participant_sep.id_situation_participant_sep,
                    id_module_sep: vm.selectedItemModule_sep.id                
                });
                //console.log(feffi.pays_id);
                //factory
            apiFactory.add("participant_sep/index",datas, config).success(function (data)
            {   

                var situ= vm.allsituation_participant_sep.filter(function(obj)
                {
                    return obj.id == participant_sep.id_situation_participant_sep;
                });

                if (NouvelItemParticipant_sep == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItemParticipant_sep.situation_participant_sep= situ[0];
                        

                        if(currentItemParticipant_sep.sexe == 1 && currentItemParticipant_sep.sexe !=vm.selectedItemParticipant_sep.sexe)
                        {
                          vm.selectedItemModule_sep.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_sep.nbr_reel_fem_parti)+1;                          
                        }

                        if(currentItemParticipant_sep.sexe == 2 && currentItemParticipant_sep.sexe !=vm.selectedItemParticipant_sep.sexe)
                        {
                          vm.selectedItem.nbr_reel_fem_parti = parseInt(vm.selectedItem.nbr_reel_fem_parti)-1;                          
                        }
                        vm.selectedItemParticipant_sep.$selected  = false;
                        vm.selectedItemParticipant_sep.$edit      = false;
                        vm.selectedItemParticipant_sep ={};
                        
                    }
                    else 
                    {    
                      vm.allparticipant_sep = vm.allparticipant_sep.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemParticipant_sep.id;
                      });
                      
                      vm.selectedItemModule_sep.nbr_parti = parseInt(vm.selectedItemModule_sep.nbr_parti)-1;
                      
                      if(parseInt(participant_sep.sexe) == 2)
                      {
                        vm.selectedItemModule_sep.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_sep.nbr_reel_fem_parti)-1;
                      }
                    }
                }
                else
                {
                  participant_sep.situation_participant_sep = situ[0];
                  participant_sep.id  =   String(data.response);              
                  NouvelItemParticipant_sep=false;

                  vm.selectedItemModule_sep.nbr_parti = parseInt(vm.selectedItemModule_sep.nbr_parti)+1;
                  if(parseInt(participant_sep.sexe) == 2)
                  {
                    vm.selectedItemModule_sep.nbr_reel_fem_parti = parseInt(vm.selectedItemModule_sep.nbr_reel_fem_parti)+1;
                  }
            }
              participant_sep.$selected = false;
              participant_sep.$edit = false;
              vm.selectedItemParticipant_sep = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /******************************************fin participant sep*********************************************************/

  /******************************************debut maitrise d'oeuvre*****************************************************/

    /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_passation_moe = function()
        {
          vm.showbuttonimporter_passation_moe =false;
          vm.showformimporter_passation_moe =true;
        }
        
        $scope.uploadFile_passation_moe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_passation_moe = files;
        }
        vm.annulerimporter_passation_moe = function()
        {
            vm.fichier_passation_moe = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_passation_moe=true;
            vm.showformimporter_passation_moe=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_passation_moe = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_passation_moe[0];
          var repertoire = 'importer_passation_moe/';
          var uploadUrl = apiUrl + "importer_passation_moe/importerdonnee_passation_moe";
          var name = vm.myFile_passation_moe[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_passation_moe=data["nom_fichier"];
              vm.repertoire_passation_moe=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_passation_moe/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

      /**************************************fin passation marchés***************************************************/
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
        },
        {titre:"Action"
        }];
         /*vm.showtabmaitrise = function()
        {
            vm.tabmaitrise = true;
            console.log(vm.tabmaitrise);
        }*/
        vm.clickpassation_marches_moe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
        //Masque de saisi ajout
        vm.ajouterPassation_marches_moe = function ()
        { 
          if (NouvelItemPassation_marches_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_shortlist: '',
              date_manifestation: '',         
              date_lancement_dp: '',
              date_remise: '',
              nbr_offre_recu: '',
              date_rapport_evaluation:'',
              date_demande_ano_dpfi: '',
              date_ano_dpfi: '',
              notification_intention: '',
              date_notification_attribution:'',
              date_signature_contrat:'',
              date_os: '',
              id_bureau_etude: '',
              statut: '',
              observation:''
            };         
            vm.allpassation_marches_moe.push(items);
            vm.allpassation_marches_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPassation_marches_moe = mem;
              }
            });

            NouvelItemPassation_marches_moe = true ;
          }else
          {
            vm.showAlert('Ajout passation_marches_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPassation_marches_moe(passation_marches_moe,suppression)
        {
            if (NouvelItemPassation_marches_moe==false)
            {
                test_existancePassation_marches_moe (passation_marches_moe,suppression); 
            } 
            else
            {
                insert_in_basePassation_marches_moe(passation_marches_moe,suppression);
            }
        }

        //fonction de bouton d'annulation passation_marches_moe
        vm.annulerPassation_marches_moe = function(item)
        {
          if (NouvelItemPassation_marches_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemPassation_marches_moe.observation ;
            item.date_os   = currentItemPassation_marches_moe.date_os ;
            item.date_remise   = currentItemPassation_marches_moe.date_remise ;
            item.date_ano_dpfi = currentItemPassation_marches_moe.date_ano_dpfi ;
            item.nbr_offre_recu = currentItemPassation_marches_moe.nbr_offre_recu;
            item.date_lancement_dp = currentItemPassation_marches_moe.date_lancement_dp ;
            item.date_shortlist   = currentItemPassation_marches_moe.date_shortlist ;
            item.date_manifestation   = currentItemPassation_marches_moe.date_manifestation ;
            item.statut  = currentItemPassation_marches_moe.statut;
            item.id_bureau_etude = currentItemPassation_marches_moe.id_prestataire ;
            item.date_signature_contrat   = currentItemPassation_marches_moe.date_signature_contrat ;
            item.date_demande_ano_dpfi    = currentItemPassation_marches_moe.date_demande_ano_dpfi ;
            item.date_rapport_evaluation  = currentItemPassation_marches_moe.date_rapport_evaluation ;
            item.notification_intention   = currentItemPassation_marches_moe.notification_intention;
            item.date_notification_attribution  = currentItemPassation_marches_moe.date_notification_attribution ;
          }else
          {
            vm.allpassation_marches_moe = vm.allpassation_marches_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPassation_marches_moe.id;
            });
          }

          vm.selectedItemPassation_marches_moe = {} ;
          NouvelItemPassation_marches_moe      = false;
          
        };

        //fonction selection item region
        vm.selectionPassation_marches_moe= function (item)
        {
            vm.selectedItemPassation_marches_moe = item;
            vm.nouvelItemPassation_marches_moe   = item;
            if (item.$selected == false || item.$selected !=undefined)
            {
              currentItemPassation_marches_moe    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches_moe));
              
            }
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

        //fonction masque de saisie modification item feffi
        vm.modifierPassation_marches_moe = function(item)
        {
            NouvelItemPassation_marches_moe = false ;
            vm.selectedItemPassation_marches_moe = item;
            currentItemPassation_marches_moe = angular.copy(vm.selectedItemPassation_marches_moe);
            $scope.vm.allpassation_marches_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemPassation_marches_moe.observation ;
            item.date_os   = new Date(vm.selectedItemPassation_marches_moe.date_os)  ;
            item.date_remise   = new Date(vm.selectedItemPassation_marches_moe.date_remise) ;
            item.date_ano_dpfi = new Date(vm.selectedItemPassation_marches_moe.date_ano_dpfi);
            item.nbr_offre_recu = parseInt(vm.selectedItemPassation_marches_moe.nbr_offre_recu);
            item.date_lancement_dp = new Date(vm.selectedItemPassation_marches_moe.date_lancement_dp) ;
            item.date_signature_contrat   = new Date(vm.selectedItemPassation_marches_moe.date_signature_contrat) ;
            item.date_demande_ano_dpfi    = new Date(vm.selectedItemPassation_marches_moe.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = new Date(vm.selectedItemPassation_marches_moe.date_rapport_evaluation) ;
            item.notification_intention   = new Date(vm.selectedItemPassation_marches_moe.notification_intention);
            item.date_notification_attribution  = new Date(vm.selectedItemPassation_marches_moe.date_notification_attribution) ;
            item.date_shortlist   = new Date(vm.selectedItemPassation_marches_moe.date_shortlist );
            item.date_manifestation   = new Date(vm.selectedItemPassation_marches_moe.date_manifestation) ;
            item.statut  = vm.selectedItemPassation_marches_moe.statut;
            vm.showbuttonValidationpassation_moe = false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerPassation_marches_moe = function()
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
                vm.ajoutPassation_marches_moe(vm.selectedItemPassation_marches_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePassation_marches_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpassation_marches_moe.filter(function(obj)
                {
                   return obj.id == currentItemPassation_marches_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemPassation_marches_moe.observation )
                    || (pass[0].date_os   != currentItemPassation_marches_moe.date_os )
                    || (pass[0].date_remise   != currentItemPassation_marches_moe.date_remise )
                    || (pass[0].date_ano_dpfi != currentItemPassation_marches_moe.date_ano_dpfi )
                    || (pass[0].nbr_offre_recu != currentItemPassation_marches_moe.nbr_offre_recu)
                    || (pass[0].date_lancement_dp != currentItemPassation_marches_moe.date_lancement_dp )
                    || (pass[0].id_bureau_etude != currentItemPassation_marches_moe.id_bureau_etude ) 
                    || (pass[0].date_signature_contrat   != currentItemPassation_marches_moe.date_signature_contrat )
                    || (pass[0].date_demande_ano_dpfi    != currentItemPassation_marches_moe.date_demande_ano_dpfi )
                    || (pass[0].date_rapport_evaluation  != currentItemPassation_marches_moe.date_rapport_evaluation )
                    || (pass[0].notification_intention   != currentItemPassation_marches_moe.notification_intention)
                    || (pass[0].date_notification_attribution  != currentItemPassation_marches_moe.date_notification_attribution )
                    || (pass[0].date_shortlist  != currentItemPassation_marches_moe.date_shortlist )
                    || (pass[0].date_manifestation   != currentItemPassation_marches_moe.date_manifestation)
                    || (pass[0].statut  != currentItemPassation_marches_moe.statut ) )                   
                      { 
                         insert_in_basePassation_marches_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePassation_marches_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePassation_marches_moe(passation_marches_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPassation_marches_moe==false)
            {
                getId = vm.selectedItemPassation_marches_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement_dp: convertionDate(new Date(passation_marches_moe.date_lancement_dp)),
                    date_os: convertionDate(new Date(passation_marches_moe.date_os)),
                    date_remise: convertionDate(new Date(passation_marches_moe.date_remise)),
                    nbr_offre_recu: passation_marches_moe.nbr_offre_recu,
                    date_rapport_evaluation:convertionDate(new Date(passation_marches_moe.date_rapport_evaluation)),
                    date_demande_ano_dpfi: convertionDate(new Date(passation_marches_moe.date_demande_ano_dpfi)),
                    date_ano_dpfi: convertionDate(new Date(passation_marches_moe.date_ano_dpfi)),
                    notification_intention: convertionDate(new Date(passation_marches_moe.notification_intention)),
                    date_notification_attribution: convertionDate(new Date(passation_marches_moe.date_notification_attribution)),
                    date_signature_contrat: convertionDate(new Date(passation_marches_moe.date_signature_contrat)),
                    id_bureau_etude: passation_marches_moe.id_bureau_etude,
                    date_shortlist: convertionDate(new Date(passation_marches_moe.date_shortlist)),
                    date_manifestation: convertionDate(new Date(passation_marches_moe.date_manifestation)),
                    statut: passation_marches_moe.statut,
                    observation:passation_marches_moe.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0              
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_be/index",datas, config).success(function (data)
            {   
                /*var be= vm.allbe.filter(function(obj)
                {
                    return obj.id == passation_marches_moe.id_bureau_etude;
                });*/

                if (NouvelItemPassation_marches_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPassation_marches_moe.convention_entete = vm.selectedItemConvention_entete;
                        vm.selectedItemPassation_marches_moe.$selected  = false;
                        vm.selectedItemPassation_marches_moe.$edit      = false;
                        vm.selectedItemPassation_marches_moe ={};
                       vm.showbuttonNouvPassation_moe=false;
                    }
                    else 
                    {    
                      vm.allpassation_marches_moe = vm.allpassation_marches_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPassation_marches_moe.id;
                      });
                      vm.showbuttonNouvPassation_moe=true;
                    }
                    
                }
                else
                {
                  passation_marches_moe.convention_entete = vm.selectedItemConvention_entete;

                  passation_marches_moe.id  =   String(data.response);              
                  NouvelItemPassation_marches_moe=false;
                  vm.showbuttonNouvPassation_moe=false;
            } 
              passation_marches_moe.validation = 0;
              passation_marches_moe.$selected = false;
              passation_marches_moe.$edit = false;
              vm.selectedItemPassation_marches_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

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

        vm.affichageformimporter_contrat_moe = function()
        {
          vm.showbuttonimporter_contrat_moe =false;
          vm.showformimporter_contrat_moe =true;
        }
        
        $scope.uploadFile_contrat_moe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_contrat_moe = files;
        }
        vm.annulerimporter_contrat_moe = function()
        {
            vm.fichier_contrat_moe = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_contrat_moe=true;
            vm.showformimporter_contrat_moe=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_contrat_moe = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_contrat_moe[0];
          var repertoire = 'importer_contrat_moe/';
          var uploadUrl = apiUrl + "importer_contrat_moe/importerdonnee_contrat_moe";
          var name = vm.myFile_contrat_moe[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_contrat_moe=data["nom_fichier"];
              vm.repertoire_contrat_moe=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_contrat_moe/"+data.nomFile;
                    //vm.allcontrat_moeention = data.contrat_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

      /**************************************fin contrat moe***************************************************/
        
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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterContrat_moe = function ()
        { 
          if (NouvelItemContrat_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              ref_contrat: '',
              montant_contrat: 0,
              id_moe:''
            };         
            vm.allcontrat_moe.push(items);
            vm.allcontrat_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemContrat_moe = mem;
              }
            });

            NouvelItemContrat_moe = true ;
          }else
          {
            vm.showAlert('Ajout contrat_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutContrat_moe(contrat_moe,suppression)
        {
            if (NouvelItemContrat_moe==false)
            {
                test_existanceContrat_moe (contrat_moe,suppression); 
            } 
            else
            {
                insert_in_baseContrat_moe(contrat_moe,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_moe
        vm.annulerContrat_moe = function(item)
        {
          if (NouvelItemContrat_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemContrat_moe.intitule ;
            item.ref_contrat   = currentItemContrat_moe.ref_contrat ;
            item.montant_contrat   = currentItemContrat_moe.montant_contrat ;            
            item.date_signature = currentItemContrat_moe.date_signature ;            
            item.id_moe = currentItemContrat_moe.id_moe ;
          }else
          {
            vm.allcontrat_moe = vm.allcontrat_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemContrat_moe.id;
            });
          }

          vm.selectedItemContrat_moe = {} ;
          NouvelItemContrat_moe      = false;
          
        };

        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;
            vm.nouvelItemContrat_moe   = item;
            currentItemContrat_moe    = JSON.parse(JSON.stringify(vm.selectedItemContrat_moe));

           if(item.id!=0)
           {
            vm.stepprestation_moe = true;

            vm.stepdoc_moe=true;
            vm.validation_contrat_moe = item.validation;
            console.log(item);
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

         vm.step_prestation_moe = function()
        {
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmemoire_technique = result.data.response.filter(function(obj)
                {
                       return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvMemoire_technique = false;
                }                           
            });
            vm.styleTabfils = "acc_menu";
        }

        vm.step_memoire_technique = function()
        {
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmemoire_technique = result.data.response.filter(function(obj)
                {
                       return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvMemoire_technique = false;
                }                           
            });
        }

        vm.step_appel_offre = function()
        {
            apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allappel_offre = result.data.response.filter(function(obj)
                {
                    return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                     vm.showbuttonNouvAppel_offre = false;
                }                          
            });
        }

        vm.step_rapport_mensuel = function()
        {
            apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allrapport_mensuel = result.data.response.filter(function(obj)
                {
                       return obj.validation == 0;
                });
                if (result.data.response.length==4)
                {
                    vm.showbuttonNouvRapport_mensuel = false;
                }                           
            });
        }

        vm.step_manuel_gestion = function()
        {
            apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmanuel_gestion = result.data.response.filter(function(obj)
                {
                    return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                     vm.showbuttonNouvManuel_gestion = false;
                }                          
            });
        }

        vm.step_police_assurance = function()
        {
             apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allpolice_assurance = result.data.response.filter(function(obj)
                {
                       return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                 vm.showbuttonNouvPolice_assurance = false;
                }                                                   
            });
        }

        vm.step_avenant_moe = function()
        {
            apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantinvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                 vm.allavenant_moe = result.data.response;
                 vm.showbuttonNouvavenant_moe = true;
                 console.log(vm.allavenant_moe);
            });
            vm.styleTabfils = "acc_sous_menu";
        }

        vm.step_importerdocument_moe = function()
        {
            apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocumentinvalideBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.alldocument_moe_scan = result.data.response;
                                        
            });
            vm.styleTabfils = "acc_sous_menu";
        }


        //fonction masque de saisie modification item feffi
        vm.modifierContrat_moe = function(item)
        {
            NouvelItemContrat_moe = false ;
            vm.selectedItemContrat_moe = item;
            currentItemContrat_moe = angular.copy(vm.selectedItemContrat_moe);
            $scope.vm.allcontrat_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemContrat_moe.intitule ;
            item.ref_contrat   = vm.selectedItemContrat_moe.ref_contrat ;
            item.montant_contrat   = parseInt(vm.selectedItemContrat_moe.montant_contrat);           
            item.date_signature = new Date(vm.selectedItemContrat_moe.date_signature) ;           
            item.id_moe = vm.selectedItemContrat_moe.moe.id ;
            vm.showbuttonValidationcontrat_moe = false;
        };

        //fonction bouton suppression item Contrat_moe
        vm.supprimerContrat_moe = function()
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
                vm.ajoutContrat_moe(vm.selectedItemContrat_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Contrat_moe
        function test_existanceContrat_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allcontrat_moe.filter(function(obj)
                {
                   return obj.id == currentItemContrat_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].intitule   != currentItemContrat_moe.intitule )
                    || (pass[0].ref_contrat  != currentItemContrat_moe.ref_contrat)
                    || (pass[0].montant_contrat   != currentItemContrat_moe.montant_contrat )                    
                    || (pass[0].date_signature != currentItemContrat_moe.date_signature )                   
                    || (pass[0].id_moe != currentItemContrat_moe.id_moe ))                   
                      { 
                         insert_in_baseContrat_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseContrat_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseContrat_moe(contrat_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemContrat_moe==false)
            {
                getId = vm.selectedItemContrat_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: contrat_moe.intitule,
                    ref_contrat: contrat_moe.ref_contrat,
                    montant_contrat: contrat_moe.montant_contrat,
                    date_signature:convertionDate(new Date(contrat_moe.date_signature)),
                    id_bureau_etude:contrat_moe.id_moe,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_be/index",datas, config).success(function (data)
            {   
                var pres= vm.allmoe.filter(function(obj)
                {
                    return obj.id == contrat_moe.id_moe;
                });

                if (NouvelItemContrat_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemContrat_moe.bureau_etude = pres[0];
                        vm.selectedItemContrat_moe.validation = 0;
                        vm.selectedItemContrat_moe.$selected  = false;
                        vm.selectedItemContrat_moe.$edit      = false;
                        vm.selectedItemContrat_moe ={};
                        vm.showbuttonNouvcontrat_moe= false;
                    }
                    else 
                    {    
                      vm.allcontrat_moe = vm.allcontrat_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemContrat_moe.id;
                      });
                      vm.showbuttonNouvcontrat_moe= true;
                    }
                    
                }
                else
                {
                  contrat_moe.bureau_etude = pres[0];
                  contrat_moe.validation = 0;
                  contrat_moe.id  =   String(data.response);              
                  NouvelItemContrat_moe=false;
                  vm.showbuttonNouvcontrat_moe= false;
                }
              contrat_moe.$selected = false;
              contrat_moe.$edit = false;
              vm.selectedItemContrat_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /*****************************************fin contrat moe******************************************************/

       /**********************************************Debut Dossier MOE***************************************************/
    //vm.myFile = [];
     $scope.uploadFile_doc_moe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_moe_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_moe_scan.fichier);
        } 

        //fonction ajout dans bdd
        function ajoutDocument_moe_scan(document_moe_scan,suppression)
        {
            if (NouvelItemDocument_moe_scan==false)
            {
                test_existanceDocument_moe_scan (document_moe_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_moe_scan(document_moe_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_moe_scan
        vm.annulerDocument_moe_scan = function(item)
        {
          if (NouvelItemDocument_moe_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_moe_scan.fichier ;
            item.date_elaboration   = currentItemDocument_moe_scan.date_elaboration ;
            item.observation   = currentItemDocument_moe_scan.observation ;
          }else
          {
            /*vm.alldocument_moe_scan = vm.alldocument_moe_scan.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDocument_moe_scan.id;
            });*/
            item.fichier   = '';
            item.date_elaboration   = null ;
            item.observation   = '' ;
            item.$edit = false;
            item.$selected = false;
            item.id_document_moe_scan = null;
          }

          vm.selectedItemDocument_moe_scan = {} ;
          NouvelItemDocument_moe_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_moe_scan= function (item)
        {
            vm.selectedItemDocument_moe_scan = item;
            vm.nouvelItemDocument_moe_scan   = item;
            if (item.id_document_moe_scan!=0)
            {
                vm.showbuttonValidation_document_moe_scan = true;
            }
            vm.validation_document_moe_scan = item.validation;
            currentItemDocument_moe_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_moe_scan));
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_moe_scan = function(item)
        {
            
            vm.selectedItemDocument_moe_scan = item;
            currentItemDocument_moe_scan = angular.copy(vm.selectedItemDocument_moe_scan);
            $scope.vm.alldocument_moe_scan.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_document_moe_scan==null)
            {   
                NouvelItemDocument_moe_scan=true;
                console.log('atonull');
                item.fichier   = vm.selectedItemDocument_moe_scan.fichier ;
                item.date_elaboration   = vm.datenow ;
                item.observation   = vm.selectedItemDocument_moe_scan.observation ;
                item.id_document_moe_scan   = '0' ;
                item.id_contrat_bureau_etude   = vm.selectedItemContrat_moe.id ;

            }
            else
            {NouvelItemDocument_moe_scan = false ;
                console.log('tsnull');
                item.fichier   = vm.selectedItemDocument_moe_scan.fichier ;
                item.date_elaboration   = new Date(vm.selectedItemDocument_moe_scan.date_elaboration) ;
                item.observation   = vm.selectedItemDocument_moe_scan.observation ;
            }
            vm.showbuttonValidation_document_moe_scan = false;
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_moe_scan
        vm.supprimerDocument_moe_scan = function()
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
                vm.ajoutDocument_moe_scan(vm.selectedItemDocument_moe_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_moe_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_moe_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_moe_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_moe_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_moe_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_moe_scan.observation ))                   
                      { 
                         insert_in_baseDocument_moe_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_moe_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_moe_scan
        function insert_in_baseDocument_moe_scan(document_moe_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_moe_scan==false)
            {
                getId = vm.selectedItemDocument_moe_scan.id_document_moe_scan; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_moe_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                    observation: document_moe_scan.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    id_document_moe: document_moe_scan.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
            {

              if (NouvelItemDocument_moe_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         //;
                    
                          var repertoire = 'document_moe_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_moe_scan.id_document_moe_scan;
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0]
                            var name_file = vm.selectedItemContrat_moe.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    document_moe_scan.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_moe_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                                      observation: document_moe_scan.observation,
                                                      id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                                      id_document_moe: document_moe_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_moe_scan.$selected = false;
                                          document_moe_scan.$edit = false;
                                          vm.selectedItemDocument_moe_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_moe_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_moe_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                        observation: document_moe_scan.observation,
                                        id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                        id_document_moe: document_moe_scan.id,
                                        validation:0               
                                    });
                                  console.log(document_moe_scan);
                                  apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_moe_scan.$selected = false;
                                      document_moe_scan.$edit = false;
                                      vm.selectedItemDocument_moe_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        //vm.selectedItemDocument_moe_scan.document_moe = doc[0];
                        vm.selectedItemDocument_moe_scan.contrat_moe = vm.selectedItemContrat_moe ;
                        vm.selectedItemDocument_moe_scan.$selected  = false;
                        vm.selectedItemDocument_moe_scan.$edit      = false;
                        vm.selectedItemDocument_moe_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                     /* vm.alldocument_moe_scan = vm.alldocument_moe_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_moe_scan.id;
                      });*/
                      vm.selectedItemDocument_moe_scan.existance = true;
                      var chemin= vm.selectedItemDocument_moe_scan.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {                         
                          vm.selectedItemDocument_moe_scan.fichier = '';
                          vm.selectedItemDocument_moe_scan.date_elaboration = '';
                          vm.selectedItemDocument_moe_scan.observation = '';
                          vm.selectedItemDocument_moe_scan.existance = false;

                          vm.selectedItemDocument_pr_scan.id_document_moe_scan = null;
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });;
                    }
              }
              else
              {
                  document_moe_scan.id_document_moe_scan  =   String(data.response);              
                  NouvelItemDocument_moe_scan = false;

                    
                    
                    var repertoire = 'document_moe_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = vm.selectedItemContrat_moe.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              document_moe_scan.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_moe_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                                observation: document_moe_scan.observation,
                                                id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                                id_document_moe: document_moe_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                {   document_moe_scan.validation = 0;
                                    document_moe_scan.$selected = false;
                                    document_moe_scan.$edit = false;
                                    vm.selectedItemDocument_moe_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_moe_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_moe_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                  observation: document_moe_scan.observation,
                                  id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                  id_document_moe: document_moe_scan.id,
                                  validation:0               
                              });

                            apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                            {   
                                vm.validation_document_moe_scan = 0;
                                document_moe_scan.validation = 0;
                                document_moe_scan.existance =true;  
                                document_moe_scan.$selected = false;
                                document_moe_scan.$edit = false;
                                vm.selectedItemDocument_moe_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              //document_moe_scan.document_moe = doc[0];
              document_moe_scan.contrat_moe = vm.selectedItemContrat_moe ;
              document_moe_scan.$selected = false;
              document_moe_scan.$edit = false;
              //vm.selectedItemDocument_moe_scan = {};
             
              vm.showbuttonValidation_document_moe_scan = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
        vm.download_document_moe_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier MOE***********************************************/

    /*********************************************fin avenant moe***********************************************/

//col table
        vm.avenant_moe_column = [
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
        vm.ajouterAvenant_moe = function ()
        { 
          if (NouvelItemAvenant_moe == false)
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
            vm.allavenant_moe.push(items);
            vm.allavenant_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_moe = mem;
              }
            });

            NouvelItemAvenant_moe = true ;
          }else
          {
            vm.showAlert('Ajout avenant_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_moe(avenant_moe,suppression)
        {
            if (NouvelItemAvenant_moe==false)
            {
                test_existanceAvenant_moe (avenant_moe,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_moe(avenant_moe,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_moe
        vm.annulerAvenant_moe = function(item)
        {
          if (NouvelItemAvenant_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvenant_moe.description ;
            item.montant   = currentItemAvenant_moe.montant ;
            item.ref_avenant   = currentItemAvenant_moe.ref_avenant ;
            item.date_signature = currentItemAvenant_moe.date_signature ;
          }else
          {
            vm.allavenant_moe = vm.allavenant_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_moe.id;
            });
          }
        
            vm.showbuttonNouvavenant_moe=true;

          vm.selectedItemAvenant_moe = {} ;
          NouvelItemAvenant_moe      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_moe= function (item)
        {
            vm.selectedItemAvenant_moe = item;
            //vm.nouvelItemAvenant_moe   = item;
            if (item.id!=0)
            {
                currentItemAvenant_moe    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_moe));
                vm.showbuttonValidation_avenant_moe = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_moe = function(item)
        {
            NouvelItemAvenant_moe = false ;
            vm.selectedItemAvenant_moe = item;
            currentItemAvenant_moe = angular.copy(vm.selectedItemAvenant_moe);
            $scope.vm.allavenant_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.ref_avenant   = vm.selectedItemAvenant_moe.ref_avenant ;
            item.description   = vm.selectedItemAvenant_moe.description ;
            item.montant   = vm.selectedItemAvenant_moe.montant ;
            item.date_signature = new Date(vm.selectedItemAvenant_moe.date_signature) ;            
            vm.showbuttonValidation_avenant_moe = false;
        };

        //fonction bouton suppression item Avenant_moe
        vm.supprimerAvenant_moe = function()
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
                vm.ajoutAvenant_moe(vm.selectedItemAvenant_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_moe.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_moe.description )
                    || (pass[0].montant  != currentItemAvenant_moe.montant)
                    || (pass[0].date_signature != currentItemAvenant_moe.date_signature ))                   
                      { 
                         insert_in_baseAvenant_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_moe(avenant_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_moe==false)
            {
                getId = vm.selectedItemAvenant_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avenant_moe.description,
                    montant: avenant_moe.montant,
                    ref_avenant: avenant_moe.ref_avenant,
                    date_signature:convertionDate(new Date(avenant_moe.date_signature)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_be/index",datas, config).success(function (data)
            {   
                var conve= vm.allcontrat_moe.filter(function(obj)
                {
                    return obj.id == avenant_moe.id_contrat_bureau_etude;
                });

                if (NouvelItemAvenant_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvenant_moe.contrat_be = conve[0];
                        
                        vm.selectedItemAvenant_moe.$selected  = false;
                        vm.selectedItemAvenant_moe.$edit      = false;
                        vm.selectedItemAvenant_moe ={};
                    }
                    else 
                    {    
                      vm.allavenant_moe = vm.allavenant_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_moe.id;
                      });
                    
                    }
                }
                else
                {
                  avenant_moe.contrat_be = conve[0];
                  avenant_moe.validation =0
                  avenant_moe.id  =   String(data.response);              
                  NouvelItemAvenant_moe=false;
                }
              avenant_moe.$selected = false;
              avenant_moe.$edit = false;
              vm.selectedItemAvenant_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /**********************************************Avenant moe***************************************************/


 /*******************************************debut importer mamoire technique*************************************************/

        vm.affichageformimporter_memoire_technique = function()
        {
          vm.showbuttonimporter_memoire_technique =false;
          vm.showformimporter_memoire_technique =true;
        }
        
        $scope.uploadFile_memoire_technique = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_memoire_technique = files;
        }
        vm.annulerimporter_memoire_technique = function()
        {
            vm.fichier_memoire_technique = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_memoire_technique=true;
            vm.showformimporter_memoire_technique=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_memoire_technique = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_memoire_technique[0];
          var repertoire = 'importer_memoire_technique/';
          var uploadUrl = apiUrl + "importer_memoire_technique/importerdonnee_memoire_technique";
          var name = vm.myFile_memoire_technique[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_memoire_technique=data["nom_fichier"];
              vm.repertoire_memoire_technique=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_memoire_technique/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer mamoire technique***************************************************/

      /**************************************fin memoire technique***************************************************/
      vm.ajouterMemoire_technique = function ()
        { 
          
          if (NouvelItemMemoire_technique == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
             // fichier: '',
              date_livraison: '',
              date_approbation: '',
              observation: '',
              id_contrat_bureau_etude: ''
            };
        
            vm.allmemoire_technique.push(items);
            vm.allmemoire_technique.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemMemoire_technique = mem;
              }
            });

            NouvelItemMemoire_technique = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout memoire_technique','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMemoire_technique(memoire_technique,suppression)
        {
            if (NouvelItemMemoire_technique==false)
            {
                test_existanceMemoire_technique (memoire_technique,suppression); 
            } 
            else
            {
                insert_in_baseMemoire_technique(memoire_technique,suppression);
            }
        }

        //fonction de bouton d'annulation memoire_technique
        vm.annulerMemoire_technique = function(item)
        {
          if (NouvelItemMemoire_technique == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemMemoire_technique.description ;
            //item.fichier   = currentItemMemoire_technique.fichier ;
            item.date_livraison   = currentItemMemoire_technique.date_livraison ;
            item.date_approbation   = currentItemMemoire_technique.date_approbation ;
            item.observation   = currentItemMemoire_technique.observation ;
          }else
          {
            vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMemoire_technique.id;
            });
          }

          vm.selectedItemMemoire_technique = {} ;
          NouvelItemMemoire_technique      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionMemoire_technique= function (item)
        {
            vm.selectedItemMemoire_technique = item;
            vm.nouvelItemMemoire_technique   = item;
            if (item.id!=0)
            {
              currentItemMemoire_technique    = JSON.parse(JSON.stringify(vm.selectedItemMemoire_technique));
              vm.showbuttonValidationMemoire_technique = true;
              vm.validation_memoire_technique =item.validation;
            }
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierMemoire_technique = function(item)
        {
            NouvelItemMemoire_technique = false ;
            vm.selectedItemMemoire_technique = item;
            currentItemMemoire_technique = angular.copy(vm.selectedItemMemoire_technique);
            $scope.vm.allmemoire_technique.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemMemoire_technique.description ;
            //item.fichier   = vm.selectedItemMemoire_technique.fichier ;
            item.date_livraison   = new Date(vm.selectedItemMemoire_technique.date_livraison) ;
            item.date_approbation   = new Date(vm.selectedItemMemoire_technique.date_approbation) ;
            item.observation   = vm.selectedItemMemoire_technique.observation ;

            item.id_contrat_bureau_etude   = vm.selectedItemMemoire_technique.contrat_be.id ;
            vm.showbuttonValidationMemoire_technique = false;
        };

        //fonction bouton suppression item memoire_technique
        vm.supprimerMemoire_technique = function()
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
                vm.ajoutMemoire_technique(vm.selectedItemMemoire_technique,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceMemoire_technique (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allmemoire_technique.filter(function(obj)
                {
                   return obj.id == currentItemMemoire_technique.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemMemoire_technique.description )
                    //||(mem[0].fichier   != currentItemMemoire_technique.fichier )
                    ||(mem[0].date_livraison   != currentItemMemoire_technique.date_livraison )
                    ||(mem[0].date_approbation   != currentItemMemoire_technique.date_approbation )
                    ||(mem[0].observation   != currentItemMemoire_technique.observation ))                   
                      { 
                         insert_in_baseMemoire_technique(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMemoire_technique(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd memoire_technique

        function insert_in_baseMemoire_technique(memoire_technique,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMemoire_technique==false)
            {
                getId = vm.selectedItemMemoire_technique.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: memoire_technique.description,
                    //fichier: memoire_technique.fichier,
                    date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                    date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
                    observation: memoire_technique.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("memoire_technique/index",datas, config).success(function (data)
            { 

              if (NouvelItemMemoire_technique == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                        vm.selectedItemMemoire_technique.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemMemoire_technique.$selected  = false;
                        vm.selectedItemMemoire_technique.$edit      = false;
                        vm.selectedItemMemoire_technique ={};
                        vm.showbuttonValidationMemoire_technique = false;
                    }
                    else 
                    {    
                      vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMemoire_technique.id;
                      });
                      vm.showbuttonNouvMemoire_technique = true;                     
                      vm.showbuttonValidationMemoire_technique = false;
                    }
              }
              else
              {   
                  memoire_technique.contrat_be = vm.selectedItemContrat_moe;
                  memoire_technique.id  =   String(data.response);              
                  NouvelItemMemoire_technique = false;
                  vm.showbuttonNouvMemoire_technique = false;
                  memoire_technique.validation = 0;
                  vm.validation_memoire_technique = 0;               
                    
              }
              memoire_technique.$selected = false;
              memoire_technique.$edit = false;
              vm.selectedItemMemoire_technique = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /**************************************fin memoire technique***************************************************/


 /*******************************************debut importer mamoire technique*************************************************/

        vm.affichageformimporter_appel_offre = function()
        {
          vm.showbuttonimporter_appel_offre =false;
          vm.showformimporter_appel_offre =true;
        }
        
        $scope.uploadFile_appel_offre = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_appel_offre = files;
        }
        vm.annulerimporter_appel_offre = function()
        {
            vm.fichier_appel_offre = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_appel_offre=true;
            vm.showformimporter_appel_offre=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_appel_offre = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_appel_offre[0];
          var repertoire = 'importer_appel_offre/';
          var uploadUrl = apiUrl + "importer_appel_offre/importerdonnee_appel_offre";
          var name = vm.myFile_appel_offre[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_appel_offre=data["nom_fichier"];
              vm.repertoire_appel_offre=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_appel_offre/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer mamoire technique***************************************************/

      /**************************************Debut appel d'offre*****************************************************/
       vm.ajouterAppel_offre = function ()
        { 
          
          if (NouvelItemAppel_offre == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              //fichier: '',
              date_livraison: '',
              date_approbation: '',
              observation: ''
            };
        
            vm.allappel_offre.push(items);
            vm.allappel_offre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAppel_offre = mem;
              }
            });

            NouvelItemAppel_offre = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout appel_offre','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAppel_offre(appel_offre,suppression)
        {
            if (NouvelItemAppel_offre==false)
            {
                test_existanceAppel_offre (appel_offre,suppression); 
            } 
            else
            {
                insert_in_baseAppel_offre(appel_offre,suppression);
            }
        }

        //fonction de bouton d'annulation appel_offre
        vm.annulerAppel_offre = function(item)
        {
          if (NouvelItemAppel_offre == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAppel_offre.description ;
            //item.fichier   = currentItemAppel_offre.fichier ;
            item.date_livraison   = currentItemAppel_offre.date_livraison ;
            item.date_approbation   = currentItemAppel_offre.date_approbation ;
            item.observation   = currentItemAppel_offre.observation ;
          }else
          {
            vm.allappel_offre = vm.allappel_offre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAppel_offre.id;
            });
          }

          vm.selectedItemAppel_offre = {} ;
          NouvelItemAppel_offre      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionAppel_offre= function (item)
        {
            vm.selectedItemAppel_offre = item;
            vm.nouvelItemAppel_offre   = item;
            if (item.id !=0)
            {
              currentItemAppel_offre    = JSON.parse(JSON.stringify(vm.selectedItemAppel_offre));
              vm.showbuttonValidationAppel_offre = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierAppel_offre = function(item)
        {
            NouvelItemAppel_offre = false ;
            vm.selectedItemAppel_offre = item;
            currentItemAppel_offre = angular.copy(vm.selectedItemAppel_offre);
            $scope.vm.allappel_offre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemAppel_offre.description ;
            //item.fichier   = vm.selectedItemAppel_offre.fichier ;
            item.date_livraison   = new Date(vm.selectedItemAppel_offre.date_livraison) ;
            item.date_approbation   = new Date(vm.selectedItemAppel_offre.date_approbation) ;
            item.observation   = vm.selectedItemAppel_offre.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemAppel_offre.contrat_be.id ;
             vm.showbuttonValidationAppel_offre = false;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item appel_offre
        vm.supprimerAppel_offre = function()
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
                vm.ajoutAppel_offre(vm.selectedItemAppel_offre,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAppel_offre (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allappel_offre.filter(function(obj)
                {
                   return obj.id == currentItemAppel_offre.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemAppel_offre.description )
                    //||(mem[0].fichier   != currentItemAppel_offre.fichier )
                    ||(mem[0].date_livraison   != currentItemAppel_offre.date_livraison )
                    ||(mem[0].date_approbation   != currentItemAppel_offre.date_approbation )
                    ||(mem[0].observation   != currentItemAppel_offre.observation ))                   
                      { 
                         insert_in_baseAppel_offre(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAppel_offre(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd appel_offre
        function insert_in_baseAppel_offre(appel_offre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAppel_offre==false)
            {
                getId = vm.selectedItemAppel_offre.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: appel_offre.description,
                    //fichier: appel_offre.fichier,
                    date_livraison: convertionDate(new Date(appel_offre.date_livraison)),
                    date_approbation: convertionDate(new Date(appel_offre.date_approbation)),
                    observation: appel_offre.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("appel_offre/index",datas, config).success(function (data)
            { 

              if (NouvelItemAppel_offre == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAppel_offre.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemAppel_offre.$selected  = false;
                        vm.selectedItemAppel_offre.$edit      = false;
                        vm.selectedItemAppel_offre ={};
                        vm.showbuttonValidationAppel_offre = false;
                    }
                    else 
                    {    
                      vm.allappel_offre = vm.allappel_offre.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAppel_offre.id;
                      });
                      vm.showbuttonNouvAppel_offre = true;
                      vm.showbuttonValidationAppel_offre = false;
                    }
              }
              else
              {
                  appel_offre.id  =   String(data.response); 
                  appel_offre.contrat_be = vm.selectedItemContrat_moe;             
                  NouvelItemAppel_offre = false;
                  vm.validation_appel_offre = 0;
                  vm.showbuttonNouvAppel_offre = false;
              }                   
              appel_offre.$selected = false;
              appel_offre.$edit = false;
              vm.selectedItemAppel_offre = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
      /**************************************Fin appel d'offre*******************************************************/

 /*******************************************debut importer rapport mensuel*************************************************/

        vm.affichageformimporter_rapport_mensuel = function()
        {
          vm.showbuttonimporter_rapport_mensuel =false;
          vm.showformimporter_rapport_mensuel =true;
        }
        
        $scope.uploadFile_rapport_mensuel = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_rapport_mensuel = files;
        }
        vm.annulerimporter_rapport_mensuel = function()
        {
            vm.fichier_rapport_mensuel = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_rapport_mensuel=true;
            vm.showformimporter_rapport_mensuel=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_rapport_mensuel = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_rapport_mensuel[0];
          var repertoire = 'importer_rapport_mensuel/';
          var uploadUrl = apiUrl + "importer_rapport_mensuel/importerdonnee_rapport_mensuel";
          var name = vm.myFile_rapport_mensuel[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_rapport_mensuel=data["nom_fichier"];
              vm.repertoire_rapport_mensuel=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_rapport_mensuel/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer rapport mensuel***************************************************/

      /**************************************Debut rapport mensuel***************************************************/
       vm.ajouterRapport_mensuel = function ()
        { 
          
          if (NouvelItemRapport_mensuel == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              numero: '',
              date_livraison: '',
              observation: '',
              id_contrat_bureau_etude: ''
            };
        
            vm.allrapport_mensuel.push(items);
            vm.allrapport_mensuel.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemRapport_mensuel = mem;
              }
            });

            NouvelItemRapport_mensuel = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout rapport_mensuel','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };        

        //fonction ajout dans bdd
        function ajoutRapport_mensuel(rapport_mensuel,suppression)
        {
            if (NouvelItemRapport_mensuel==false)
            {
                test_existanceRapport_mensuel (rapport_mensuel,suppression); 
            } 
            else
            {
                insert_in_baseRapport_mensuel(rapport_mensuel,suppression);
            }
        }

        //fonction de bouton d'annulation rapport_mensuel
        vm.annulerRapport_mensuel = function(item)
        {
          if (NouvelItemRapport_mensuel == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemRapport_mensuel.description ;
            item.numero   = currentItemRapport_mensuel.numero ;
            item.date_livraison   = currentItemRapport_mensuel.date_livraison ;
            item.observation   = currentItemRapport_mensuel.observation ;
          }else
          {
            vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
            {
                return obj.id !== vm.selectedItemRapport_mensuel.id;
            });
          }

          vm.selectedItemRapport_mensuel = {} ;
          NouvelItemRapport_mensuel      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionRapport_mensuel= function (item)
        {
            vm.selectedItemRapport_mensuel = item;
            vm.nouvelItemRapport_mensuel   = item;
            if (item.id !=0)
            { 
                if (item.$edit ==false || item.$edit==undefined)
                {  
                    currentItemRapport_mensuel    = JSON.parse(JSON.stringify(vm.selectedItemRapport_mensuel));                    
                }
              vm.showbuttonValidationRapport_mensuel = true;
              vm.validation_rapport_mensuel =item.validation;
            }
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

        //fonction masque de saisie modification item feffi
        vm.modifierRapport_mensuel = function(item)
        {
            NouvelItemRapport_mensuel = false ;
            vm.selectedItemRapport_mensuel = item;
            currentItemRapport_mensuel = angular.copy(vm.selectedItemRapport_mensuel);
            $scope.vm.allrapport_mensuel.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemRapport_mensuel.description ;
            item.numero   = vm.selectedItemRapport_mensuel.numero ;
            item.date_livraison   = new Date(vm.selectedItemRapport_mensuel.date_livraison) ;
            item.observation   = vm.selectedItemRapport_mensuel.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemRapport_mensuel.contrat_be.id ;
             vm.showbuttonValidationRapport_mensuel = false;
            //vm.showThParcourir = true;
        };
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
        vm.change_numero=function(item)
        {   
            vm.insererrapport = true;
            var numero_existe = false;
            apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.rapport_mensuels = result.data.response;
                var rest = vm.rapport_mensuels.filter(function(obj)
                {
                    return obj.id != item.id;
                });

                if(rest.length>0)
                {
                    rest.forEach(function(jus)
                    {
                      if(jus.numero == item.numero)                   
                        { 
                            numero_existe = true;
                        }
                    });
                    if (numero_existe==true)
                    {
                        vm.insererrapport = false;
                        vm.showAlert('Ajout réfusé','Le rapport '+item.numero+' existe déjà');
                    }
                }                            
            }); 
            
        }

        //fonction bouton suppression item rapport_mensuel
        vm.supprimerRapport_mensuel = function()
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
                vm.ajoutRapport_mensuel(vm.selectedItemRapport_mensuel,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceRapport_mensuel (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allrapport_mensuel.filter(function(obj)
                {
                   return obj.id == currentItemRapport_mensuel.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemRapport_mensuel.description )
                    ||(mem[0].numero   != currentItemRapport_mensuel.numero )
                    ||(mem[0].date_livraison   != currentItemRapport_mensuel.date_livraison )
                    ||(mem[0].observation   != currentItemRapport_mensuel.observation ))                   
                      { 
                         insert_in_baseRapport_mensuel(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseRapport_mensuel(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd rapport_mensuel
        function insert_in_baseRapport_mensuel(rapport_mensuel,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemRapport_mensuel==false)
            {
                getId = vm.selectedItemRapport_mensuel.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: rapport_mensuel.description,
                    numero: rapport_mensuel.numero,
                    date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
                    observation: rapport_mensuel.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
            {  
              if (NouvelItemRapport_mensuel == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                         
                        vm.selectedItemRapport_mensuel.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemRapport_mensuel.$selected  = false;
                        vm.selectedItemRapport_mensuel.$edit      = false;
                        vm.selectedItemRapport_mensuel ={};
                        vm.showbuttonValidationRapport_mensuel = false;
                    }
                    else 
                    {    
                      vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_mensuel.id;
                      });
                      vm.showbuttonNouvRapport_mensuel = true;
                      vm.showbuttonValidationRapport_mensuel_ = false;
                    }
              }
              else
              {   
                  rapport_mensuel.contrat_be = vm.selectedItemContrat_moe;
                  rapport_mensuel.id  =   String(data.response);              
                  NouvelItemRapport_mensuel = false;
                  vm.showbuttonNouvRapport_mensuel = false;
                  vm.showbuttonValidationRapport_mensuel = false; 
                  vm.validation_rapport_mensuel = 0;
                  rapport_mensuel.validation = 0;
              }
              rapport_mensuel.$selected = false;
              rapport_mensuel.$edit = false;
              vm.selectedItemRapport_mensuel = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
      /**************************************Fin rapport mensuel***************************************************/

 /*******************************************debut importer mamoire technique*************************************************/

        vm.affichageformimporter_manuel_gestion = function()
        {
          vm.showbuttonimporter_manuel_gestion =false;
          vm.showformimporter_manuel_gestion =true;
        }
        
        $scope.uploadFile_manuel_gestion = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_manuel_gestion = files;
        }
        vm.annulerimporter_manuel_gestion = function()
        {
            vm.fichier_manuel_gestion = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_manuel_gestion=true;
            vm.showformimporter_manuel_gestion=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_manuel_gestion = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_manuel_gestion[0];
          var repertoire = 'importer_manuel_gestion/';
          var uploadUrl = apiUrl + "importer_manuel_gestion/importerdonnee_manuel_gestion";
          var name = vm.myFile_manuel_gestion[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_manuel_gestion=data["nom_fichier"];
              vm.repertoire_manuel_gestion=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_manuel_gestion/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer mamoire technique***************************************************/


      /**************************************Debut manuel gestion***************************************************/
      vm.ajouterManuel_gestion = function ()
        { 
          
          if (NouvelItemManuel_gestion == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
             // fichier: '',
              date_livraison: '',
              observation: ''
            };
        
            vm.allmanuel_gestion.push(items);
            vm.allmanuel_gestion.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemManuel_gestion = mem;
              }
            });

            NouvelItemManuel_gestion = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout manuel_gestion','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutManuel_gestion(manuel_gestion,suppression)
        {
            if (NouvelItemManuel_gestion==false)
            {
                test_existanceManuel_gestion (manuel_gestion,suppression); 
            } 
            else
            {
                insert_in_baseManuel_gestion(manuel_gestion,suppression);
            }
        }

        //fonction de bouton d'annulation manuel_gestion
        vm.annulerManuel_gestion = function(item)
        {
          if (NouvelItemManuel_gestion == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemManuel_gestion.description ;
            //item.fichier   = currentItemManuel_gestion.fichier ;
            item.date_livraison   = currentItemManuel_gestion.date_livraison ;
            item.observation   = currentItemManuel_gestion.observation ;
          }else
          {
            vm.allmanuel_gestion = vm.allmanuel_gestion.filter(function(obj)
            {
                return obj.id !== vm.selectedItemManuel_gestion.id;
            });
          }

          vm.selectedItemManuel_gestion = {} ;
          NouvelItemManuel_gestion      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionManuel_gestion= function (item)
        {
            vm.selectedItemManuel_gestion = item;
            vm.nouvelItemManuel_gestion   = item;
            if (item.id !=0)
            {
                currentItemManuel_gestion    = JSON.parse(JSON.stringify(vm.selectedItemManuel_gestion));
                vm.showbuttonValidationManuel_gestion = true;
                vm.validation_manuel_gestion =item.validation;
            }
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

        //fonction masque de saisie modification item feffi
        vm.modifierManuel_gestion = function(item)
        {
            NouvelItemManuel_gestion = false ;
            vm.selectedItemManuel_gestion = item;
            currentItemManuel_gestion = angular.copy(vm.selectedItemManuel_gestion);
            $scope.vm.allmanuel_gestion.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemManuel_gestion.description ;
            //item.fichier   = vm.selectedItemManuel_gestion.fichier ;
            item.date_livraison   = new Date(vm.selectedItemManuel_gestion.date_livraison) ;
            item.observation   = vm.selectedItemManuel_gestion.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemManuel_gestion.contrat_be.id ;
             vm.showbuttonValidationManuel_gestion = false;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item manuel_gestion
        vm.supprimerManuel_gestion = function()
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
                vm.ajoutManuel_gestion(vm.selectedItemManuel_gestion,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceManuel_gestion (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allmanuel_gestion.filter(function(obj)
                {
                   return obj.id == currentItemManuel_gestion.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemManuel_gestion.description )
                    //||(mem[0].fichier   != currentItemManuel_gestion.fichier )
                    ||(mem[0].date_livraison   != currentItemManuel_gestion.date_livraison )
                    ||(mem[0].observation   != currentItemManuel_gestion.observation ))                   
                      { 
                         insert_in_baseManuel_gestion(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseManuel_gestion(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd manuel_gestion
        function insert_in_baseManuel_gestion(manuel_gestion,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemManuel_gestion==false)
            {
                getId = vm.selectedItemManuel_gestion.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: manuel_gestion.description,
                    //fichier: manuel_gestion.fichier,
                    date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
                    observation: manuel_gestion.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
            { 
              if (NouvelItemManuel_gestion == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        
                        vm.selectedItemManuel_gestion.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemManuel_gestion.$selected  = false;
                        vm.selectedItemManuel_gestion.$edit      = false;
                        vm.selectedItemManuel_gestion ={};
                        vm.showbuttonValidationManuel_gestion = false;
                    }
                    else 
                    {    
                      vm.allmanuel_gestion = vm.allmanuel_gestion.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemManuel_gestion.id;
                      });
                      vm.showbuttonNouvManuel_gestion = true;
                    
                      vm.showbuttonValidationManuel_gestion = false;
                    }
              }
              else
              {   
                  manuel_gestion.contrat_be = vm.selectedItemContrat_moe;
                  manuel_gestion.id  =   String(data.response);              
                  NouvelItemManuel_gestion = false;

                  vm.showbuttonNouvManuel_gestion = false;

                  manuel_gestion.validation = 0;
                  vm.validation_manuel_gestion = 0;
                    
              }
              manuel_gestion.$selected = false;
              manuel_gestion.$edit = false;
              vm.selectedItemManuel_gestion = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
      /**************************************Fin manuel gestion***************************************************/

 /*******************************************debut importer mamoire technique*************************************************/

        vm.affichageformimporter_police_assurance = function()
        {
          vm.showbuttonimporter_police_assurance =false;
          vm.showformimporter_police_assurance =true;
        }
        
        $scope.uploadFile_police_assurance = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_police_assurance = files;
        }
        vm.annulerimporter_police_assurance = function()
        {
            vm.fichier_police_assurance = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_police_assurance=true;
            vm.showformimporter_police_assurance=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_police_assurance = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_police_assurance[0];
          var repertoire = 'importer_police_assurance/';
          var uploadUrl = apiUrl + "importer_police_assurance/importerdonnee_police_assurance";
          var name = vm.myFile_police_assurance[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_police_assurance=data["nom_fichier"];
              vm.repertoire_police_assurance=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_police_assurance/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer mamoire technique***************************************************/

      /**************************************Fin police d'assurance*************************************************/
      vm.ajouterPolice_assurance = function ()
        { 
          
          if (NouvelItemPolice_assurance == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              //fichier: '',
              date_expiration: '',
              observation: ''
            };
        
            vm.allpolice_assurance.push(items);
            vm.allpolice_assurance.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPolice_assurance = mem;
              }
            });

            NouvelItemPolice_assurance = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout police_assurance','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPolice_assurance(police_assurance,suppression)
        {
            if (NouvelItemPolice_assurance==false)
            {
                test_existancePolice_assurance (police_assurance,suppression); 
            } 
            else
            {
                insert_in_basePolice_assurance(police_assurance,suppression);
            }
        }

        //fonction de bouton d'annulation police_assurance
        vm.annulerPolice_assurance = function(item)
        {
          if (NouvelItemPolice_assurance == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemPolice_assurance.description ;
            //item.fichier   = currentItemPolice_assurance.fichier ;
            item.date_expiration   = currentItemPolice_assurance.date_expiration ;
            item.observation   = currentItemPolice_assurance.observation ;
          }else
          {
            vm.allpolice_assurance = vm.allpolice_assurance.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPolice_assurance.id;
            });
          }

          vm.selectedItemPolice_assurance = {} ;
          NouvelItemPolice_assurance      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionPolice_assurance= function (item)
        {
            vm.selectedItemPolice_assurance = item;
            vm.nouvelItemPolice_assurance   = item;
            if (item.id !=0)
            {
                currentItemPolice_assurance    = JSON.parse(JSON.stringify(vm.selectedItemPolice_assurance));
                vm.showbuttonValidationPolice_assurance = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierPolice_assurance = function(item)
        {
            NouvelItemPolice_assurance = false ;
            vm.selectedItemPolice_assurance = item;
            currentItemPolice_assurance = angular.copy(vm.selectedItemPolice_assurance);
            $scope.vm.allpolice_assurance.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemPolice_assurance.description ;
            //item.fichier   = vm.selectedItemPolice_assurance.fichier ;
            item.date_expiration   = new Date(vm.selectedItemPolice_assurance.date_expiration) ;
            item.observation   = vm.selectedItemPolice_assurance.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemPolice_assurance.contrat_be.id ;
            
        };

        //fonction bouton suppression item police_assurance
        vm.supprimerPolice_assurance = function()
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
                vm.ajoutPolice_assurance(vm.selectedItemPolice_assurance,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePolice_assurance (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allpolice_assurance.filter(function(obj)
                {
                   return obj.id == currentItemPolice_assurance.id;
                });
                if(mem[0])
                {
                   if((mem[0].description   != currentItemPolice_assurance.description )
                    //||(mem[0].fichier   != currentItemPolice_assurance.fichier )
                    ||(mem[0].date_expiration   != currentItemPolice_assurance.date_expiration )
                    ||(mem[0].observation   != currentItemPolice_assurance.observation ))                   
                      { 
                         insert_in_basePolice_assurance(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePolice_assurance(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd police_assurance
        function insert_in_basePolice_assurance(police_assurance,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPolice_assurance==false)
            {
                getId = vm.selectedItemPolice_assurance.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: police_assurance.description,
                    //fichier: police_assurance.fichier,
                    date_expiration: convertionDate(new Date(police_assurance.date_expiration)),
                    observation: police_assurance.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("police_assurance/index",datas, config).success(function (data)
            { 
              if (NouvelItemPolice_assurance == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                         
                        vm.selectedItemPolice_assurance.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemPolice_assurance.$selected  = false;
                        vm.selectedItemPolice_assurance.$edit      = false;
                        vm.selectedItemPolice_assurance ={};
                        vm.showbuttonValidationPolice_assurance = false;
                    }
                    else 
                    {    
                      vm.allpolice_assurance = vm.allpolice_assurance.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPolice_assurance.id;
                      });
                      vm.showbuttonNouvPolice_assurance = true;
                      vm.showbuttonValidationPolice_assurance = false;
                    }
              }
              else
              {   
                  police_assurance.contrat_be = vm.selectedItemContrat_moe;
                  police_assurance.id  =   String(data.response);              
                  NouvelItemPolice_assurance = false;

                  vm.showbuttonNouvPolice_assurance = false;
                  police_assurance.validation = 0;
                  vm.validation_police_assurance = 0;
                    
              }
              vm.showbuttonValidationPolice_assurance = false;
              
              police_assurance.$selected = false;
              police_assurance.$edit = false;
              vm.selectedItemPolice_assurance = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
      /**************************************Debut police d'assurance***********************************************/

      /*******************************************debut importer passation moe*************************************************/

        vm.affichageformimporter_passation_mpe = function()
        {
          vm.showbuttonimporter_passation_mpe =false;
          vm.showformimporter_passation_mpe =true;
        }
        
        $scope.uploadFile_passation_mpe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_passation_mpe = files;
        }
        vm.annulerimporter_passation_mpe = function()
        {
            vm.fichier_passation_mpe = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_passation_mpe=true;
            vm.showformimporter_passation_mpe=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_passation_mpe = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_passation_mpe[0];
          var repertoire = 'importer_passation_mpe/';
          var uploadUrl = apiUrl + "importer_passation_mpe/importerdonnee_passation_mpe";
          var name = vm.myFile_passation_mpe[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_passation_mpe=data["nom_fichier"];
              vm.repertoire_passation_mpe=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_passation_mpe/"+data.nomFile;
                    //vm.allpassation_mpeention = data.passation_mpe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut passation_marches****************************************/
vm.steppassation_marches = function()
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
        },
        {titre:"Action"
        }];

       /* vm.showtabentreprise = function()
        {
            vm.tabentreprise = true;
            console.log(vm.tabentreprise);
        }*/
        //Masque de saisi ajout
        vm.ajouterPassation_marches = function ()
        { 
          if (NouvelItemPassation_marches == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              date_lancement: '',
              date_remise: '',
              nbr_offre_recu: 0,
              montant_moin_chere:'',
              date_rapport_evaluation:'',
              date_demande_ano_dpfi: '',
              date_ano_dpfi: '',
              notification_intention: '',
              date_notification_attribution:'',
              observation:''
            };         
            vm.allpassation_marches.push(items);          
                         
            vm.allpassation_marches.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPassation_marches = items;
              }
            });
            NouvelItemPassation_marches = true ;
          }else
          {
            vm.showAlert('Ajout passation_marches','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPassation_marches(passation_marches,suppression)
        {
            if (NouvelItemPassation_marches==false)
            {
                test_existancePassation_marches (passation_marches,suppression); 
            } 
            else
            {
                insert_in_basePassation_marches(passation_marches,suppression);
            }
        }

        //fonction de bouton d'annulation passation_marches
        vm.annulerPassation_marches = function(item)
        {
          if (NouvelItemPassation_marches == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemPassation_marches.observation ;
            item.date_os   = currentItemPassation_marches.date_os ;
            item.date_remise   = currentItemPassation_marches.date_remise ;
            item.date_ano_dpfi = currentItemPassation_marches.date_ano_dpfi ;
            item.nbr_offre_recu = currentItemPassation_marches.nbr_offre_recu;
            item.date_lancement = currentItemPassation_marches.date_lancement ; 
            item.montant_moin_chere = currentItemPassation_marches.montant_moin_chere ;
            item.date_demande_ano_dpfi    = currentItemPassation_marches.date_demande_ano_dpfi ;
            item.date_rapport_evaluation  = currentItemPassation_marches.date_rapport_evaluation ;
            item.notification_intention   = currentItemPassation_marches.notification_intention;
            item.date_notification_attribution  = currentItemPassation_marches.date_notification_attribution ;
          }else
          {
            vm.allpassation_marches = vm.allpassation_marches.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPassation_marches.id;
            });
          }

          vm.selectedItemPassation_marches = {} ;
          NouvelItemPassation_marches      = false;
          
        };

        //fonction selection item region
        vm.selectionPassation_marches= function (item)
        {
            vm.selectedItemPassation_marches = item;
            vm.nouvelItemPassation_marches   = item;
            if (item.$selected == false || item.$selected == undefined)
            {
              currentItemPassation_marches    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches));
            }
            
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("mpe_soumissionaire/index",'id_passation_marches',vm.selectedItemPassation_marches.id).then(function(result)
            {
                vm.allmpe_soumissionaire = result.data.response;
            });

            vm.showbuttonValidationpassation = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierPassation_marches = function(item)
        {
            NouvelItemPassation_marches = false ;
            vm.selectedItemPassation_marches = item;
            currentItemPassation_marches = angular.copy(vm.selectedItemPassation_marches);
            $scope.vm.allpassation_marches.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemPassation_marches.observation ;
            item.date_os   = new Date(vm.selectedItemPassation_marches.date_os );
            item.date_remise   = new Date(vm.selectedItemPassation_marches.date_remise );
            item.date_ano_dpfi = new Date(vm.selectedItemPassation_marches.date_ano_dpfi);
            item.nbr_offre_recu = vm.selectedItemPassation_marches.nbr_offre_recu;
            item.date_lancement = new Date(vm.selectedItemPassation_marches.date_lancement) ;
            item.montant_moin_chere = vm.selectedItemPassation_marches.montant_moin_chere ;
            item.date_demande_ano_dpfi    = new Date(vm.selectedItemPassation_marches.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = new Date(vm.selectedItemPassation_marches.date_rapport_evaluation) ;
            item.notification_intention   = new Date(vm.selectedItemPassation_marches.notification_intention);
            item.date_notification_attribution  = new Date(vm.selectedItemPassation_marches.date_notification_attribution) ;
            vm.showbuttonValidationpassation = false;
        };

        //fonction bouton suppression item passation_marches
        vm.supprimerPassation_marches = function()
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
                vm.ajoutPassation_marches(vm.selectedItemPassation_marches,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePassation_marches (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpassation_marches.filter(function(obj)
                {
                   return obj.id == currentItemPassation_marches.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemPassation_marches.observation )
                    || (pass[0].date_os   != currentItemPassation_marches.date_os )
                    || (pass[0].date_remise   != currentItemPassation_marches.date_remise )
                    || (pass[0].date_ano_dpfi != currentItemPassation_marches.date_ano_dpfi )
                    || (pass[0].nbr_offre_recu != currentItemPassation_marches.nbr_offre_recu)
                    || (pass[0].date_lancement != currentItemPassation_marches.date_lancement ) 
                    || (pass[0].montant_moin_chere != currentItemPassation_marches.montant_moin_chere )
                    || (pass[0].date_demande_ano_dpfi    != currentItemPassation_marches.date_demande_ano_dpfi )
                    || (pass[0].date_rapport_evaluation  != currentItemPassation_marches.date_rapport_evaluation )
                    || (pass[0].notification_intention   != currentItemPassation_marches.notification_intention)
                    || (pass[0].date_notification_attribution  != currentItemPassation_marches.date_notification_attribution ) )                   
                      { 
                         insert_in_basePassation_marches(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePassation_marches(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePassation_marches(passation_marches,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPassation_marches==false)
            {
                getId = vm.selectedItemPassation_marches.id; 
            } 
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement: convertionDate(new Date(passation_marches.date_lancement)),
                    date_os: convertionDate(new Date(passation_marches.date_os)),
                    date_remise: convertionDate(new Date(passation_marches.date_remise)),
                    montant_moin_chere:passation_marches.montant_moin_chere,
                    date_rapport_evaluation:convertionDate(new Date(passation_marches.date_rapport_evaluation)),
                    date_demande_ano_dpfi: convertionDate(new Date(passation_marches.date_demande_ano_dpfi)),
                    date_ano_dpfi: convertionDate(new Date(passation_marches.date_ano_dpfi)),
                    notification_intention: convertionDate(new Date(passation_marches.notification_intention)),
                    date_notification_attribution: convertionDate(new Date(passation_marches.date_notification_attribution)),                    
                    observation:passation_marches.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0,               
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches/index",datas, config).success(function (data)
            { 
                if (NouvelItemPassation_marches == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   

                        vm.selectedItemPassation_marches.convention_entete = vm.selectedItemConvention_entete;
                        vm.selectedItemPassation_marches.$selected  = false;
                        vm.selectedItemPassation_marches.$edit      = false;
                        vm.selectedItemPassation_marches ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allpassation_marches = vm.allpassation_marches.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPassation_marches.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                { 

                  passation_marches.convention_entete = vm.selectedItemConvention_entete;
                  passation_marches.validation=0;
                  passation_marches.id  =   String(data.response);              
                  NouvelItemPassation_marches=false;
                  vm.showbuttonNouvPassation= false;
            }
              passation_marches.$selected = false;
              passation_marches.$edit = false;
              vm.selectedItemPassation_marches = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches****************************************/

 /*******************************************debut importer passation moe*************************************************/
        vm.stepmpe_soumissionaire = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
        vm.affichageformimporter_mpe_soumissionaire = function()
        {
          vm.showbuttonimporter_mpe_soumissionaire =false;
          vm.showformimporter_mpe_soumissionaire =true;
        }
        
        $scope.uploadFile_mpe_soumissionaire = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_mpe_soumissionaire = files;
        }
        vm.annulerimporter_mpe_soumissionaire = function()
        {
            vm.fichier_mpe_soumissionaire = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_mpe_soumissionaire=true;
            vm.showformimporter_mpe_soumissionaire=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_mpe_soumissionaire = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_mpe_soumissionaire[0];
          var repertoire = 'importer_mpe_soumissionaire/';
          var uploadUrl = apiUrl + "importer_mpe_soumissionaire/importerdonnee_mpe_soumissionaire";
          var name = vm.myFile_mpe_soumissionaire[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_mpe_soumissionaire=data["nom_fichier"];
              vm.repertoire_mpe_soumissionaire=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée refusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_mpe_soumissionaire/"+data.nomFile;
                    //vm.allpassation_moeention = data.passation_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut sousmissionnaire****************************************/
    vm.mpe_soumissionaire_column = [
        {titre:"MPE sousmissionnaire"
        },
        {titre:"Telephone"
        },
        {titre:"Siège"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterMpe_soumissionaire = function ()
        { 
          if (NouvelItemMpe_soumissionaire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_prestataire: '',
              telephone: '',
              siege: ''
            };         
            vm.allmpe_soumissionaire.push(items);
            vm.allmpe_soumissionaire.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemMpe_soumissionaire = mem;
              }
            });

            NouvelItemMpe_soumissionaire = true ;
          }else
          {
            vm.showAlert('Ajout mpe_soumissionaire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMpe_soumissionaire(mpe_soumissionaire,suppression)
        {
            if (NouvelItemMpe_soumissionaire==false)
            {
                test_existanceMpe_soumissionaire (mpe_soumissionaire,suppression); 
            } 
            else
            {
                insert_in_baseMpe_soumissionaire(mpe_soumissionaire,suppression);
            }
        }

        //fonction de bouton d'annulation mpe_soumissionaire
        vm.annulerMpe_soumissionaire = function(item)
        {
          if (NouvelItemMpe_soumissionaire == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_prestataire   = currentItemMpe_soumissionaire.id_prestataire ;
            item.telephone   = currentItemMpe_soumissionaire.telephone ;
            item.siege   = currentItemMpe_soumissionaire.siege ;
          }else
          {
            vm.allmpe_soumissionaire = vm.allmpe_soumissionaire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMpe_soumissionaire.id;
            });
          }

          vm.selectedItemMpe_soumissionaire = {} ;
          NouvelItemMpe_soumissionaire      = false;
          
        };

        //fonction selection item region
        vm.selectionMpe_soumissionaire= function (item)
        {
            vm.selectedItemMpe_soumissionaire = item;
            currentItemMpe_soumissionaire    = JSON.parse(JSON.stringify(vm.selectedItemMpe_soumissionaire)); 
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

        //fonction masque de saisie modification item feffi
        vm.modifierMpe_soumissionaire = function(item)
        {
            NouvelItemMpe_soumissionaire = false ;
            vm.selectedItemMpe_soumissionaire = item;
            currentItemMpe_soumissionaire = angular.copy(vm.selectedItemMpe_soumissionaire);
            $scope.vm.allmpe_soumissionaire.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_prestataire   = vm.selectedItemMpe_soumissionaire.id_prestataire ;
            item.telephone   = vm.selectedItemMpe_soumissionaire.telephone ;
            item.siege   = vm.selectedItemMpe_soumissionaire.siege ;
        };

        //fonction bouton suppression item Mpe_soumissionaire
        vm.supprimerMpe_soumissionaire = function()
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
                vm.ajoutMpe_soumissionaire(vm.selectedItemMpe_soumissionaire,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceMpe_soumissionaire (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allmpe_soumissionaire.filter(function(obj)
                {
                   return obj.id == currentItemMpe_soumissionaire.id;
                });
                if(pass[0])
                {
                   if((pass[0].id_prestataire   != currentItemMpe_soumissionaire.id_prestataire ))                   
                      { 
                         insert_in_baseMpe_soumissionaire(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMpe_soumissionaire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseMpe_soumissionaire(mpe_soumissionaire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMpe_soumissionaire==false)
            {
                getId = vm.selectedItemMpe_soumissionaire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_prestataire: mpe_soumissionaire.id_prestataire,
                    id_passation_marches: vm.selectedItemPassation_marches.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("mpe_soumissionaire/index",datas, config).success(function (data)
            {   var nb_offre = 0;
                var press= vm.allprestataire.filter(function(obj)
                {
                    return obj.id == mpe_soumissionaire.id_prestataire;
                });

                if (NouvelItemMpe_soumissionaire == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemMpe_soumissionaire.prestataire = press[0];
                        
                        vm.selectedItemMpe_soumissionaire.$selected  = false;
                        vm.selectedItemMpe_soumissionaire.$edit      = false;
                        vm.selectedItemMpe_soumissionaire ={};
                    }
                    else 
                    {    
                      vm.allmpe_soumissionaire = vm.allmpe_soumissionaire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMpe_soumissionaire.id;
                      });
                      nb_offre= parseInt(vm.selectedItemPassation_marches.nbr_offre_recu) - 1;
                      //miseajourPassation_marches(vm.selectedItemPassation_marches,0,nb_offre);
                    }
                }
                else
                {
                  mpe_soumissionaire.prestataire = press[0]; ; 

                  mpe_soumissionaire.id  =   String(data.response);              
                  NouvelItemMpe_soumissionaire=false;

                  nb_offre= parseInt(vm.selectedItemPassation_marches.nbr_offre_recu) + 1;
                  //miseajourPassation_marches(vm.selectedItemPassation_marches,0,nb_offre);
            }
             vm.selectedItemPassation_marches.nbr_offre_recu = nb_offre
              mpe_soumissionaire.$selected = false;
              mpe_soumissionaire.$edit = false;
              vm.selectedItemMpe_soumissionaire = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changePrestataire = function(item)
        {
          var pre = vm.allprestataire.filter(function(obj)
          {
              return obj.id == item.id_prestataire;
          });
         // console.log(pre[0]);
          item.telephone=pre[0].telephone;
          item.siege=pre[0].siege;
        }
/**********************************fin sousmissionnaire****************************************/
/*******************************************debut importer contrat moe*************************************************/

        vm.affichageformimporter_contrat_mpe = function()
        {
          vm.showbuttonimporter_contrat_mpe =false;
          vm.showformimporter_contrat_mpe =true;
        }
        
        $scope.uploadFile_contrat_mpe = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_contrat_mpe = files;
        }
        vm.annulerimporter_contrat_mpe = function()
        {
            vm.fichier_contrat_mpe = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_contrat_mpe=true;
            vm.showformimporter_contrat_mpe=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_contrat_mpe = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_contrat_mpe[0];
          var repertoire = 'importer_contrat_mpe/';
          var uploadUrl = apiUrl + "importer_contrat_mpe/importerdonnee_contrat_mpe";
          var name = vm.myFile_contrat_mpe[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_contrat_mpe=data["nom_fichier"];
              vm.repertoire_contrat_mpe=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnée réfuser: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_contrat_mpe/"+data.nomFile;
                    //vm.allcontrat_moeention = data.contrat_moe_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer passation moe***************************************************/

/**********************************debut contrat prestataire****************************************/
        
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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterContrat_prestataire = function ()
        { 
          if (NouvelItemContrat_prestataire == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              num_contrat: '',
              cout_batiment: 0,
              cout_latrine: 0,
              cout_mobilier:0,
              date_signature:'',
              id_prestataire:''
            };         
            vm.allcontrat_prestataire.push(items);
            vm.allcontrat_prestataire.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemContrat_prestataire = mem;
              }
            });

            NouvelItemContrat_prestataire = true ;
          }else
          {
            vm.showAlert('Ajout contrat_prestataire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutContrat_prestataire(contrat_prestataire,suppression)
        {
            if (NouvelItemContrat_prestataire==false)
            {
                test_existanceContrat_prestataire (contrat_prestataire,suppression); 
            } 
            else
            {
                insert_in_baseContrat_prestataire(contrat_prestataire,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerContrat_prestataire = function(item)
        {
          if (NouvelItemContrat_prestataire == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemContrat_prestataire.description ;
            item.num_contrat   = currentItemContrat_prestataire.num_contrat ;
            item.cout_batiment   = currentItemContrat_prestataire.cout_batiment ;
            item.cout_latrine = currentItemContrat_prestataire.cout_latrine ;
            item.cout_mobilier = currentItemContrat_prestataire.cout_mobilier;
            item.date_signature = currentItemContrat_prestataire.date_signature ;
            item.id_prestataire = currentItemContrat_prestataire.id_prestataire ;
          }else
          {
            vm.allcontrat_prestataire = vm.allcontrat_prestataire.filter(function(obj)
            {
                return obj.id !== vm.selectedItemContrat_prestataire.id;
            });
          }

          vm.selectedItemContrat_prestataire = {} ;
          NouvelItemContrat_prestataire      = false;
          
        };

        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;
            vm.nouvelItemContrat_prestataire   = item;
            currentItemContrat_prestataire    = JSON.parse(JSON.stringify(vm.selectedItemContrat_prestataire));
            

           if(item.id!=0)
           {

                apiFactory.getAPIgeneraliserREST("attachement_batiment/index",'id_contrat_prestataire',item.id).then(function(result)
                {
                    vm.allattachement_batiment = result.data.response;
                });
                apiFactory.getAPIgeneraliserREST("attachement_latrine/index",'id_contrat_prestataire',item.id).then(function(result)
                {
                    vm.allattachement_latrine = result.data.response;
                });

                apiFactory.getAPIgeneraliserREST("attachement_mobilier/index",'id_contrat_prestataire',item.id).then(function(result)
                {
                    vm.allattachement_mobilier = result.data.response;
                });
                vm.stepattachement = true;
                vm.showbuttonValidationcontrat_prestataire = true;
                vm.validation_contrat_prestataire = item.validation;                            
              
           }
           vm.stepsuiviexecution = true;
           vm.stepavenant_mpe = true;  
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

        vm.step_attachement_prevu = function()
        {

            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index",'menu','getdivers_attachement_batiment_prevu','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_type_batiment',vm.batiment_constructions[0].type_batiment.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_prevu = result.data.response;       
            });
            vm.styleTabfils = "acc_menu";
        }
        vm.step_attachement_batiment_prevu = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index",'menu','getdivers_attachement_batiment_prevu','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_type_batiment',vm.batiment_constructions[0].type_batiment.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_prevu = result.data.response;       
            });
        }
        vm.step_attachement_latrine_prevu = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine/index",'menu','getdivers_attachement_latrine_prevu','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_type_latrine',vm.latrine_constructions[0].type_latrine.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_prevu = result.data.response;        
            });
        }
        vm.step_attachement_mobilier_prevu = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier/index",'menu','getdivers_attachement_mobilier_prevu','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_type_mobilier',vm.mobilier_constructions[0].type_mobilier.id).then(function(result)
            {
                 vm.alldivers_attachement_mobilier_prevu = result.data.response;        
            });
        }

        vm.step_suivitravaux = function()
        {
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                 vm.alldelai_travaux = result.data.response;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvDelai_travaux=false;
                }
             });
            vm.styleTabfils = "acc_menu";
        }
        vm.step_delai_execution = function()
        {
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                 vm.alldelai_travaux = result.data.response;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvDelai_travaux=false;
                }
             });
        }
        vm.step_reception_mpe = function()
        {
             apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allreception_mpe = result.data.response;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvReception_mpe=false;
                }
            });
        }
        vm.step_avancement_batiment = function()
        {
            apiFactory.getAPIgeneraliserREST("avancement_batiment/index",'menu','getavancementBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavancement_batiment = result.data.response;
                vm.showbuttonNouvAvancement_batiment=true;
                                
            });
        }
        vm.step_avancement_latrine = function()
        {
            
            apiFactory.getAPIgeneraliserREST("avancement_latrine/index",'menu','getavancementBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavancement_latrine = result.data.response;
                vm.showbuttonNouvAvancement_latrine=true;
                                
            });
        }
        vm.step_avancement_mobilier= function()
        {
            apiFactory.getAPIgeneraliserREST("avancement_mobilier/index",'menu','getavancementBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavancement_mobilier = result.data.response;
                vm.showbuttonNouvAvancement_mobilier=true;
                                
            });
        }
        vm.step_avenant_mpe = function()
        {
           apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantinvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavenant_mpe = result.data.response;
                vm.showbuttonNouvavenant_mpe = true;
            });
           vm.styleTabfils = "acc_sous_menu";
        }
        vm.step_importerdocument_mpe = function()
        {
            apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocumentinvalideBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldocument_prestataire_scan = result.data.response;
                                        
            });
            vm.styleTabfils = "acc_sous_menu";
        }

        //fonction masque de saisie modification item feffi
        vm.modifierContrat_prestataire = function(item)
        {
            NouvelItemContrat_prestataire = false ;
            vm.selectedItemContrat_prestataire = item;
            currentItemContrat_prestataire = angular.copy(vm.selectedItemContrat_prestataire);
            $scope.vm.allcontrat_prestataire.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemContrat_prestataire.description ;
            item.num_contrat   = vm.selectedItemContrat_prestataire.num_contrat ;
            item.cout_batiment   = parseInt(vm.selectedItemContrat_prestataire.cout_batiment);
            item.cout_latrine = parseInt(vm.selectedItemContrat_prestataire.cout_latrine);
            item.cout_mobilier = parseInt(vm.selectedItemContrat_prestataire.cout_mobilier);
            item.date_signature = new Date(vm.selectedItemContrat_prestataire.date_signature) ;
            //item.date_prev_deb_trav = new Date(vm.selectedItemContrat_prestataire.date_prev_deb_trav) ;
            //item.date_reel_deb_trav = new Date(vm.selectedItemContrat_prestataire.date_reel_deb_trav) ;
            //item.delai_execution = parseInt(vm.selectedItemContrat_prestataire.delai_execution) ;
            item.id_prestataire = vm.selectedItemContrat_prestataire.prestataire.id ;
            vm.showbuttonValidationcontrat_prestataire = false;
        };

        //fonction bouton suppression item Contrat_prestataire
        vm.supprimerContrat_prestataire = function()
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
                vm.ajoutContrat_prestataire(vm.selectedItemContrat_prestataire,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Contrat_prestataire
        function test_existanceContrat_prestataire (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allcontrat_prestataire.filter(function(obj)
                {
                   return obj.id == currentItemContrat_prestataire.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemContrat_prestataire.description )
                    || (pass[0].num_contrat  != currentItemContrat_prestataire.num_contrat)
                    || (pass[0].cout_batiment   != currentItemContrat_prestataire.cout_batiment )
                    || (pass[0].cout_latrine != currentItemContrat_prestataire.cout_latrine )
                    || (pass[0].cout_mobilier != currentItemContrat_prestataire.cout_mobilier)
                    || (pass[0].date_signature != currentItemContrat_prestataire.date_signature )
                    || (pass[0].id_prestataire != currentItemContrat_prestataire.id_prestataire ))                   
                      { 
                         insert_in_baseContrat_prestataire(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseContrat_prestataire(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseContrat_prestataire(contrat_prestataire,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemContrat_prestataire==false)
            {
                getId = vm.selectedItemContrat_prestataire.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: contrat_prestataire.description,
                    num_contrat: contrat_prestataire.num_contrat,
                    cout_batiment: contrat_prestataire.cout_batiment,
                    cout_latrine: contrat_prestataire.cout_latrine,
                    cout_mobilier:contrat_prestataire.cout_mobilier,
                    date_signature:convertionDate(new Date(contrat_prestataire.date_signature)),
                    id_prestataire:contrat_prestataire.id_prestataire,
                    paiement_recu: 0,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_prestataire/index",datas, config).success(function (data)
            {   
                var pres= vm.allprestataire.filter(function(obj)
                {
                    return obj.id == contrat_prestataire.id_prestataire;
                });

                if (NouvelItemContrat_prestataire == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemContrat_prestataire.prestataire = pres[0];
                        
                        vm.selectedItemContrat_prestataire.$selected  = false;
                        vm.selectedItemContrat_prestataire.$edit      = false;
                        vm.selectedItemContrat_prestataire ={};
                        vm.showbuttonNouvContrat_prestataire= false;
                    }
                    else 
                    {    
                      vm.allcontrat_prestataire = vm.allcontrat_prestataire.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemContrat_prestataire.id;
                      });
                      vm.showbuttonNouvContrat_prestataire= true;
                    }
                    
                }
                else
                {
                  contrat_prestataire.prestataire = pres[0];
                  contrat_prestataire.validation = 0;
                  contrat_prestataire.id  =   String(data.response);              
                  NouvelItemContrat_prestataire=false;
                  vm.showbuttonNouvContrat_prestataire= false;
            } 
              vm.validation_contrat_prestataire = 0;    
              vm.showbuttonValidationcontrat_prestataire = false;
              contrat_prestataire.$selected = false;
              contrat_prestataire.$edit = false;
              vm.selectedItemContrat_prestataire = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
/**********************************fin contrat_prestataire****************************************/

 /*********************************************fin avenant mpe***********************************************/

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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvenant_mpe = function ()
        { 
          if (NouvelItemAvenant_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',         
              ref_avenant: '',
              cout_batiment: 0,
              cout_latrine: 0,
              cout_mobilier: 0,
              date_signature:'',
            };         
            vm.allavenant_mpe.push(items);
            vm.allavenant_mpe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvenant_mpe = mem;
              }
            });

            NouvelItemAvenant_mpe = true ;
          }else
          {
            vm.showAlert('Ajout avenant_mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvenant_mpe(avenant_mpe,suppression)
        {
            if (NouvelItemAvenant_mpe==false)
            {
                test_existanceAvenant_mpe (avenant_mpe,suppression); 
            } 
            else
            {
                insert_in_baseAvenant_mpe(avenant_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_mpe
        vm.annulerAvenant_mpe = function(item)
        {
          if (NouvelItemAvenant_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemAvenant_mpe.description ;
            item.cout_batiment   = currentItemAvenant_mpe.cout_batiment ;
            item.cout_latrine   = currentItemAvenant_mpe.cout_latrine ;
            item.cout_mobilier   = currentItemAvenant_mpe.cout_mobilier ;
            item.ref_avenant   = currentItemAvenant_mpe.ref_avenant ;
            item.date_signature = currentItemAvenant_mpe.date_signature ;
          }else
          {
            vm.allavenant_mpe = vm.allavenant_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_mpe.id;
            });
          }
        
            vm.showbuttonNouvavenant_mpe=true;

          vm.selectedItemAvenant_mpe = {} ;
          NouvelItemAvenant_mpe      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_mpe= function (item)
        {
            vm.selectedItemAvenant_mpe = item;
            //vm.nouvelItemAvenant_mpe   = item;
            if (item.id!=0)
            {
                currentItemAvenant_mpe    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_mpe));
                vm.showbuttonValidation_avenant_mpe = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_mpe = function(item)
        {
            NouvelItemAvenant_mpe = false ;
            vm.selectedItemAvenant_mpe = item;
            currentItemAvenant_mpe = angular.copy(vm.selectedItemAvenant_mpe);
            $scope.vm.allavenant_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.ref_avenant   = vm.selectedItemAvenant_mpe.ref_avenant ;
            item.description   = vm.selectedItemAvenant_mpe.description ;
            item.cout_batiment   = vm.selectedItemAvenant_mpe.cout_batiment ;
            item.cout_latrine   = vm.selectedItemAvenant_mpe.cout_latrine ;
            item.cout_mobilier   = vm.selectedItemAvenant_mpe.cout_mobilier ;
            item.date_signature = new Date(vm.selectedItemAvenant_mpe.date_signature) ;            
            vm.showbuttonValidation_avenant_mpe = false;
        };

        //fonction bouton suppression item Avenant_mpe
        vm.supprimerAvenant_mpe = function()
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
                vm.ajoutAvenant_mpe(vm.selectedItemAvenant_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_mpe.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_mpe.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_mpe.description )
                    || (pass[0].cout_batiment  != currentItemAvenant_mpe.cout_batiment)
                    || (pass[0].cout_latrine  != currentItemAvenant_mpe.cout_latrine)
                    || (pass[0].cout_mobilier  != currentItemAvenant_mpe.cout_mobilier)
                    || (pass[0].ref_avenant  != currentItemAvenant_mpe.ref_avenant)
                    || (pass[0].date_signature != currentItemAvenant_mpe.date_signature ))                   
                      { 
                         insert_in_baseAvenant_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_mpe(avenant_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_mpe==false)
            {
                getId = vm.selectedItemAvenant_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avenant_mpe.description,
                    cout_batiment: avenant_mpe.cout_batiment,
                    cout_latrine: avenant_mpe.cout_latrine,
                    cout_mobilier: avenant_mpe.cout_mobilier,
                    ref_avenant: avenant_mpe.ref_avenant,
                    date_signature:convertionDate(new Date(avenant_mpe.date_signature)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_prestataire/index",datas, config).success(function (data)
            {   
                var conve= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == avenant_mpe.id_contrat_prestataire;
                });

                if (NouvelItemAvenant_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvenant_mpe.contrat_prestataire = conve[0];
                        
                        vm.selectedItemAvenant_mpe.$selected  = false;
                        vm.selectedItemAvenant_mpe.$edit      = false;
                        vm.selectedItemAvenant_mpe ={};
                    }
                    else 
                    {    
                      vm.allavenant_mpe = vm.allavenant_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_mpe.id;
                      });
                    
                    }
                }
                else
                {
                  avenant_mpe.contrat_prestataire = conve[0];
                  avenant_mpe.validation =0
                  avenant_mpe.id  =   String(data.response);              
                  NouvelItemAvenant_mpe=false;
                }
              vm.showbuttonValidation_avenant_mpe = false;
              vm.validation_avenant_mpe = 0
              avenant_mpe.$selected = false;
              avenant_mpe.$edit = false;
              vm.selectedItemAvenant_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
    /**********************************************Fin Avenant mpe***************************************************/
    
    /**********************************************Debut Dossier entreprise***************************************************/
    vm.myFile = [];
     $scope.uploadFile_doc_pre = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_prestataire_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_prestataire_scan.fichier);
        } 

        //fonction ajout dans bdd
        function ajoutDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            if (NouvelItemDocument_prestataire_scan==false)
            {
                test_existanceDocument_prestataire_scan (document_prestataire_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_prestataire_scan(document_prestataire_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_prestataire_scan
        vm.annulerDocument_prestataire_scan = function(item)
        {
          if (NouvelItemDocument_prestataire_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_prestataire_scan.fichier ;
            item.date_elaboration   = currentItemDocument_prestataire_scan.date_elaboration ;
            item.observation   = currentItemDocument_prestataire_scan.observation ;
          }else
          {
            /*vm.alldocument_prestataire_scan = vm.alldocument_prestataire_scan.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDocument_prestataire_scan.id;
            });*/
            item.fichier   = '';
            item.date_elaboration   = '' ;
            item.observation   = '' ;
            item.$edit = false;
            item.$selected = false;

            item.id_document_prestataire_scan = null;
          }

          vm.selectedItemDocument_prestataire_scan = {} ;
          NouvelItemDocument_prestataire_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_prestataire_scan= function (item)
        {
            vm.selectedItemDocument_prestataire_scan = item;
            vm.nouvelItemDocument_prestataire_scan   = item;
            if (item.id_document_prestataire_scan!=0)
            {
                vm.showbuttonValidation_document_prestataire_scan = true;
            }
            vm.validation_document_prestataire_scan = item.validation;
            currentItemDocument_prestataire_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_prestataire_scan));
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_prestataire_scan = function(item)
        {
            
            vm.selectedItemDocument_prestataire_scan = item;
            currentItemDocument_prestataire_scan = angular.copy(vm.selectedItemDocument_prestataire_scan);
            $scope.vm.alldocument_prestataire_scan.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_document_prestataire_scan==null)
            {   
                NouvelItemDocument_prestataire_scan=true;
                console.log('atonull');
                item.fichier   = vm.selectedItemDocument_prestataire_scan.fichier ;
                item.date_elaboration   = vm.datenow ;
                item.observation   = vm.selectedItemDocument_prestataire_scan.observation ;
                item.id_document_prestataire_scan   = '0' ;
                item.id_contrat_prestataire   = vm.selectedItemContrat_prestataire.id ;

            }
            else
            {NouvelItemDocument_prestataire_scan = false ;
                console.log('tsnull');
                item.fichier   = vm.selectedItemDocument_prestataire_scan.fichier ;
                item.date_elaboration   = new Date(vm.selectedItemDocument_prestataire_scan.date_elaboration) ;
                item.observation   = vm.selectedItemDocument_prestataire_scan.observation ;
            }
            vm.showbuttonValidation_document_prestataire_scan = false;
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_prestataire_scan
        vm.supprimerDocument_prestataire_scan = function()
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
                vm.ajoutDocument_prestataire_scan(vm.selectedItemDocument_prestataire_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_prestataire_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_prestataire_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_prestataire_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_prestataire_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_prestataire_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_prestataire_scan.observation ))                   
                      { 
                         insert_in_baseDocument_prestataire_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_prestataire_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_prestataire_scan
        function insert_in_baseDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_prestataire_scan==false)
            {
                getId = vm.selectedItemDocument_prestataire_scan.id_document_prestataire_scan; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_prestataire_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                    observation: document_prestataire_scan.observation,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    id_document_prestataire: document_prestataire_scan.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
            {

              if (NouvelItemDocument_prestataire_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         //;
                    
                          var repertoire = 'document_prestataire_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_prestataire_scan.id_document_prestataire_scan;
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0]
                            var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    document_prestataire_scan.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_prestataire_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                                      observation: document_prestataire_scan.observation,
                                                      id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                                      id_document_prestataire: document_prestataire_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_prestataire_scan.$selected = false;
                                          document_prestataire_scan.$edit = false;
                                          vm.selectedItemDocument_prestataire_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_prestataire_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_prestataire_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                        observation: document_prestataire_scan.observation,
                                        id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                        id_document_prestataire: document_prestataire_scan.id,
                                        validation:0               
                                    });
                                  apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_prestataire_scan.$selected = false;
                                      document_prestataire_scan.$edit = false;
                                      vm.selectedItemDocument_prestataire_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        //vm.selectedItemDocument_prestataire_scan.document_prestataire = doc[0];
                        vm.selectedItemDocument_prestataire_scan.contrat_prestataire = vm.selectedItemContrat_prestataire ;
                        vm.selectedItemDocument_prestataire_scan.$selected  = false;
                        vm.selectedItemDocument_prestataire_scan.$edit      = false;
                        vm.selectedItemDocument_prestataire_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                     /* vm.alldocument_prestataire_scan = vm.alldocument_prestataire_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_prestataire_scan.id;
                      });*/
                      vm.selectedItemDocument_prestataire_scan.existance = true;
                      var chemin= vm.selectedItemDocument_prestataire_scan.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {                         
                          vm.selectedItemDocument_prestataire_scan.fichier = '';
                          vm.selectedItemDocument_prestataire_scan.date_elaboration = '';
                          vm.selectedItemDocument_prestataire_scan.observation = '';
                          vm.selectedItemDocument_prestataire_scan.existance = false;

                          vm.selectedItemDocument_pr_scan.id_document_prestataire_scan = null;
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });;
                    }
              }
              else
              {
                  document_prestataire_scan.id_document_prestataire_scan  =   String(data.response);              
                  NouvelItemDocument_prestataire_scan = false;

                    
                    
                    var repertoire = 'document_prestataire_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              document_prestataire_scan.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_prestataire_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                                observation: document_prestataire_scan.observation,
                                                id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                                id_document_prestataire: document_prestataire_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                {   document_prestataire_scan.validation = 0;
                                    document_prestataire_scan.$selected = false;
                                    document_prestataire_scan.$edit = false;
                                    vm.selectedItemDocument_prestataire_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_prestataire_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_prestataire_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                  observation: document_prestataire_scan.observation,
                                  id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                  id_document_prestataire: document_prestataire_scan.id,
                                  validation:0               
                              });

                            apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                            {   
                                vm.validation_document_prestataire_scan = 0;
                                document_prestataire_scan.validation = 0;
                                document_prestataire_scan.existance =true;  
                                document_prestataire_scan.$selected = false;
                                document_prestataire_scan.$edit = false;
                                vm.selectedItemDocument_prestataire_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              //document_prestataire_scan.document_prestataire = doc[0];
              document_prestataire_scan.contrat_prestataire = vm.selectedItemContrat_prestataire ;
              document_prestataire_scan.$selected = false;
              document_prestataire_scan.$edit = false;
              //vm.selectedItemDocument_prestataire_scan = {};
             
              vm.showbuttonValidation_document_prestataire_scan = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_pr_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }

        vm.download_document_prestataire_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier entreprise***********************************************/
    /**********************************************Debut Dossier entreprise***************************************************/
    
        //fonction ajout dans bdd
        function ajoutDivers_attachement_batiment_prevu(divers_attachement_batiment_prevu,suppression)
        {
            if (NouvelItemDivers_attachement_batiment_prevu==false)
            {
                test_existanceDivers_attachement_batiment_prevu (divers_attachement_batiment_prevu,suppression); 
            } 
            else
            {
                insert_in_baseDivers_attachement_batiment_prevu(divers_attachement_batiment_prevu,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_batiment_prevu
        vm.annulerDivers_attachement_batiment_prevu = function(item)
        {
          if (NouvelItemDivers_attachement_batiment_prevu == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant_prevu   = currentItemDivers_attachement_batiment_prevu.montant_prevu ;
          }else
          {
            item.$edit = false;
            item.$selected = false;
            item.montant_prevu   = '';
          }

          vm.selectedItemDivers_attachement_batiment_prevu = {} ;
          NouvelItemDivers_attachement_batiment_prevu      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDivers_attachement_batiment_prevu= function (item)
        {
            vm.selectedItemDivers_attachement_batiment_prevu = item;
            vm.nouvelItemDivers_attachement_batiment_prevu   = item;
            currentItemDivers_attachement_batiment_prevu    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_batiment_prevu));
            
        };
        $scope.$watch('vm.selectedItemDivers_attachement_batiment_prevu', function()
        {
             if (!vm.alldivers_attachement_batiment_prevu) return;
             vm.alldivers_attachement_batiment_prevu.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDivers_attachement_batiment_prevu.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDivers_attachement_batiment_prevu = function(item)
        {
            
            vm.selectedItemDivers_attachement_batiment_prevu = item;
            currentItemDivers_attachement_batiment_prevu = angular.copy(vm.selectedItemDivers_attachement_batiment_prevu);
            $scope.vm.alldivers_attachement_batiment_prevu.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_divers_attachement_batiment_prevu==null)
            {   
                NouvelItemDivers_attachement_batiment_prevu=true;
                item.montant_prevu   = vm.selectedItemDivers_attachement_batiment_prevu.montant_prevu ;
                item.id_divers_attachement_batiment_prevu   = '0' ;
                item.id_contrat_prestataire   = vm.selectedItemContrat_prestataire.id ;
            }
            else
            {   
                NouvelItemDivers_attachement_batiment_prevu = false ;                
                item.montant_prevu   = vm.selectedItemDivers_attachement_batiment_prevu.montant_prevu ;
            }
        };

        //fonction bouton suppression item divers_attachement_batiment_prevu
        vm.supprimerDivers_attachement_batiment_prevu = function()
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
                vm.ajoutDivers_attachement_batiment_prevu(vm.selectedItemDivers_attachement_batiment_prevu,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDivers_attachement_batiment_prevu (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldivers_attachement_batiment_prevu.filter(function(obj)
                {
                   return obj.id == currentItemDivers_attachement_batiment_prevu.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_prevu != currentItemDivers_attachement_batiment_prevu.montant_prevu ))                   
                      { 
                         insert_in_baseDivers_attachement_batiment_prevu(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDivers_attachement_batiment_prevu(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_batiment_prevu
        function insert_in_baseDivers_attachement_batiment_prevu(divers_attachement_batiment_prevu,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDivers_attachement_batiment_prevu==false)
            {
                getId = vm.selectedItemDivers_attachement_batiment_prevu.id_divers_attachement_batiment_prevu; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_prevu: divers_attachement_batiment_prevu.montant_prevu,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    id_divers_attachement_batiment: divers_attachement_batiment_prevu.id            
                });
                console.log(datas);
                //factory
            apiFactory.add("divers_attachement_batiment_prevu/index",datas, config).success(function (data)
            {

              if (NouvelItemDivers_attachement_batiment_prevu == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDivers_attachement_batiment_prevu.$selected  = false;
                        vm.selectedItemDivers_attachement_batiment_prevu.$edit      = false;
                        vm.selectedItemDivers_attachement_batiment_prevu ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        vm.selectedItemDivers_attachement_batiment_prevu.montant_prevu = '';
                        vm.selectedItemDivers_attachement_batiment_prevu.id_divers_attachement_batiment_prevu = null;                       
                    }
              }
              else
              {
                  divers_attachement_batiment_prevu.id_divers_attachement_batiment_prevu  =   String(data.response);              
                  NouvelItemDivers_attachement_batiment_prevu = false;                    
              }

              divers_attachement_batiment_prevu.$selected = false;
              divers_attachement_batiment_prevu.$edit = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************debut dossier entreprise***********************************************/

       /**********************************************Debut Dossier entreprise***************************************************/
    
        //fonction ajout dans bdd
        function ajoutDivers_attachement_latrine_prevu(divers_attachement_latrine_prevu,suppression)
        {
            if (NouvelItemDivers_attachement_latrine_prevu==false)
            {
                test_existanceDivers_attachement_latrine_prevu (divers_attachement_latrine_prevu,suppression); 
            } 
            else
            {
                insert_in_baseDivers_attachement_latrine_prevu(divers_attachement_latrine_prevu,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_latrine_prevu
        vm.annulerDivers_attachement_latrine_prevu = function(item)
        {
          if (NouvelItemDivers_attachement_latrine_prevu == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant_prevu   = currentItemDivers_attachement_latrine_prevu.montant_prevu ;
          }else
          {
            item.$edit = false;
            item.$selected = false;
            item.montant_prevu   = '';
          }

          vm.selectedItemDivers_attachement_latrine_prevu = {} ;
          NouvelItemDivers_attachement_latrine_prevu      = false;
          
        };

        //fonction selection item justificatif latrine
        vm.selectionDivers_attachement_latrine_prevu= function (item)
        {
            vm.selectedItemDivers_attachement_latrine_prevu = item;
            vm.nouvelItemDivers_attachement_latrine_prevu   = item;
            currentItemDivers_attachement_latrine_prevu    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_latrine_prevu));
            
        };
        $scope.$watch('vm.selectedItemDivers_attachement_latrine_prevu', function()
        {
             if (!vm.alldivers_attachement_latrine_prevu) return;
             vm.alldivers_attachement_latrine_prevu.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDivers_attachement_latrine_prevu.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDivers_attachement_latrine_prevu = function(item)
        {
            
            vm.selectedItemDivers_attachement_latrine_prevu = item;
            currentItemDivers_attachement_latrine_prevu = angular.copy(vm.selectedItemDivers_attachement_latrine_prevu);
            $scope.vm.alldivers_attachement_latrine_prevu.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_divers_attachement_latrine_prevu==null)
            {   
                NouvelItemDivers_attachement_latrine_prevu=true;
                item.montant_prevu   = vm.selectedItemDivers_attachement_latrine_prevu.montant_prevu ;
                item.id_divers_attachement_latrine_prevu   = '0' ;
                item.id_contrat_prestataire   = vm.selectedItemContrat_prestataire.id ;
            }
            else
            {   
                NouvelItemDivers_attachement_latrine_prevu = false ;                
                item.montant_prevu   = vm.selectedItemDivers_attachement_latrine_prevu.montant_prevu ;
            }
        };

        //fonction bouton suppression item divers_attachement_latrine_prevu
        vm.supprimerDivers_attachement_latrine_prevu = function()
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
                vm.ajoutDivers_attachement_latrine_prevu(vm.selectedItemDivers_attachement_latrine_prevu,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDivers_attachement_latrine_prevu (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldivers_attachement_latrine_prevu.filter(function(obj)
                {
                   return obj.id == currentItemDivers_attachement_latrine_prevu.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_prevu != currentItemDivers_attachement_latrine_prevu.montant_prevu ))                   
                      { 
                         insert_in_baseDivers_attachement_latrine_prevu(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDivers_attachement_latrine_prevu(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_latrine_prevu
        function insert_in_baseDivers_attachement_latrine_prevu(divers_attachement_latrine_prevu,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDivers_attachement_latrine_prevu==false)
            {
                getId = vm.selectedItemDivers_attachement_latrine_prevu.id_divers_attachement_latrine_prevu; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_prevu: divers_attachement_latrine_prevu.montant_prevu,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    id_divers_attachement_latrine: divers_attachement_latrine_prevu.id            
                });
                console.log(datas);
                //factory
            apiFactory.add("divers_attachement_latrine_prevu/index",datas, config).success(function (data)
            {

              if (NouvelItemDivers_attachement_latrine_prevu == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDivers_attachement_latrine_prevu.$selected  = false;
                        vm.selectedItemDivers_attachement_latrine_prevu.$edit      = false;
                        vm.selectedItemDivers_attachement_latrine_prevu ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        vm.selectedItemDivers_attachement_latrine_prevu.montant_prevu = '';
                        vm.selectedItemDivers_attachement_latrine_prevu.id_divers_attachement_latrine_prevu = null;                      
                    }
              }
              else
              {
                  divers_attachement_latrine_prevu.id_divers_attachement_latrine_prevu  =   String(data.response);              
                  NouvelItemDivers_attachement_latrine_prevu = false;                    
              }

              divers_attachement_latrine_prevu.$selected = false;
              divers_attachement_latrine_prevu.$edit = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************debut dossier entreprise***********************************************/

       /**********************************************Debut Dossier entreprise***************************************************/
    
        //fonction ajout dans bdd
        function ajoutDivers_attachement_mobilier_prevu(divers_attachement_mobilier_prevu,suppression)
        {
            if (NouvelItemDivers_attachement_mobilier_prevu==false)
            {
                test_existanceDivers_attachement_mobilier_prevu (divers_attachement_mobilier_prevu,suppression); 
            } 
            else
            {
                insert_in_baseDivers_attachement_mobilier_prevu(divers_attachement_mobilier_prevu,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_mobilier_prevu
        vm.annulerDivers_attachement_mobilier_prevu = function(item)
        {
          if (NouvelItemDivers_attachement_mobilier_prevu == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant_prevu   = currentItemDivers_attachement_mobilier_prevu.montant_prevu ;
          }else
          {
            item.$edit = false;
            item.$selected = false;
            item.montant_prevu   = '';
          }

          vm.selectedItemDivers_attachement_mobilier_prevu = {} ;
          NouvelItemDivers_attachement_mobilier_prevu      = false;
          
        };

        //fonction selection item justificatif mobilier
        vm.selectionDivers_attachement_mobilier_prevu= function (item)
        {
            vm.selectedItemDivers_attachement_mobilier_prevu = item;
            vm.nouvelItemDivers_attachement_mobilier_prevu   = item;
            currentItemDivers_attachement_mobilier_prevu    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_mobilier_prevu));
            
        };
        $scope.$watch('vm.selectedItemDivers_attachement_mobilier_prevu', function()
        {
             if (!vm.alldivers_attachement_mobilier_prevu) return;
             vm.alldivers_attachement_mobilier_prevu.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDivers_attachement_mobilier_prevu.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDivers_attachement_mobilier_prevu = function(item)
        {
            
            vm.selectedItemDivers_attachement_mobilier_prevu = item;
            currentItemDivers_attachement_mobilier_prevu = angular.copy(vm.selectedItemDivers_attachement_mobilier_prevu);
            $scope.vm.alldivers_attachement_mobilier_prevu.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_divers_attachement_mobilier_prevu==null)
            {   
                NouvelItemDivers_attachement_mobilier_prevu=true;
                item.montant_prevu   = vm.selectedItemDivers_attachement_mobilier_prevu.montant_prevu ;
                item.id_divers_attachement_mobilier_prevu   = '0' ;
                item.id_contrat_prestataire   = vm.selectedItemContrat_prestataire.id ;
            }
            else
            {   
                NouvelItemDivers_attachement_mobilier_prevu = false ;                
                item.montant_prevu   = vm.selectedItemDivers_attachement_mobilier_prevu.montant_prevu ;
            }
        };

        //fonction bouton suppression item divers_attachement_mobilier_prevu
        vm.supprimerDivers_attachement_mobilier_prevu = function()
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
                vm.ajoutDivers_attachement_mobilier_prevu(vm.selectedItemDivers_attachement_mobilier_prevu,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDivers_attachement_mobilier_prevu (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldivers_attachement_mobilier_prevu.filter(function(obj)
                {
                   return obj.id == currentItemDivers_attachement_mobilier_prevu.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_prevu != currentItemDivers_attachement_mobilier_prevu.montant_prevu ))                   
                      { 
                         insert_in_baseDivers_attachement_mobilier_prevu(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDivers_attachement_mobilier_prevu(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_mobilier_prevu
        function insert_in_baseDivers_attachement_mobilier_prevu(divers_attachement_mobilier_prevu,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDivers_attachement_mobilier_prevu==false)
            {
                getId = vm.selectedItemDivers_attachement_mobilier_prevu.id_divers_attachement_mobilier_prevu; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_prevu: divers_attachement_mobilier_prevu.montant_prevu,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    id_divers_attachement_mobilier: divers_attachement_mobilier_prevu.id            
                });
                console.log(datas);
                //factory
            apiFactory.add("divers_attachement_mobilier_prevu/index",datas, config).success(function (data)
            {

              if (NouvelItemDivers_attachement_mobilier_prevu == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDivers_attachement_mobilier_prevu.$selected  = false;
                        vm.selectedItemDivers_attachement_mobilier_prevu.$edit      = false;
                        vm.selectedItemDivers_attachement_mobilier_prevu ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        vm.selectedItemDivers_attachement_mobilier_prevu.montant_prevu = ''; 
                        vm.selectedItemDivers_attachement_mobilier_prevu.id_divers_attachement_mobilier = null;                      
                    }
              }
              else
              {
                  divers_attachement_mobilier_prevu.id_divers_attachement_mobilier_prevu  =   String(data.response);              
                  NouvelItemDivers_attachement_mobilier_prevu = false;                    
              }

              divers_attachement_mobilier_prevu.$selected = false;
              divers_attachement_mobilier_prevu.$edit = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************debut dossier entreprise***********************************************/

    /******************************************debut delai travaux***********************************************/

    //col table
        vm.delai_travaux_column = [
        {titre:"Date prevu debut travaux"
        },
        {titre:"Date réel debut travaux"
        },
        {titre:"Date d'expiration police d'assurance"
        },
        {titre:"Delai d'éxecution"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterDelai_travaux = function ()
        { 
          if (NouvelItemDelai_travaux == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              date_prev_debu_travau: '',
              date_expiration_police: '',
              date_reel_debu_travau: '',
              delai_execution: 0
            };         
            vm.alldelai_travaux.push(items);
            vm.alldelai_travaux.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDelai_travaux = mem;
              }
            });

            NouvelItemDelai_travaux = true ;
          }else
          {
            vm.showAlert('Ajout delai_travaux','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDelai_travaux(delai_travaux,suppression)
        {
            if (NouvelItemDelai_travaux==false)
            {
                test_existanceDelai_travaux (delai_travaux,suppression); 
            } 
            else
            {
                insert_in_baseDelai_travaux(delai_travaux,suppression);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerDelai_travaux = function(item)
        {
          if (NouvelItemDelai_travaux == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.date_prev_debu_travau   = currentItemDelai_travaux.date_prev_debu_travau ;
            item.date_reel_debu_travau   = currentItemDelai_travaux.date_reel_debu_travau ;
            item.date_expiration_police   = currentItemDelai_travaux.date_expiration_police ;
            //item.delai_execution = currentItemDelai_travaux.delai_execution ;
          }else
          {
            vm.alldelai_travaux = vm.alldelai_travaux.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDelai_travaux.id;
            });
          }

          vm.selectedItemDelai_travaux = {} ;
          NouvelItemDelai_travaux      = false;
          
        };

        //fonction selection item contrat
        vm.selectionDelai_travaux= function (item)
        {
            vm.selectedItemDelai_travaux = item;
            //vm.nouvelItemDelai_travaux   = item;
            currentItemDelai_travaux    = JSON.parse(JSON.stringify(vm.selectedItemDelai_travaux));
           if(item.id!=0)
           {  
              switch (vm.session)
              {
                case 'OBCAF':
                            apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                            {
                                vm.allphase_sous_projet = result.data.response.filter(function(obj)
                                {
                                    return obj.validation == 0;
                                });
                                  vm.showbuttonNouvPhase_sous_projet=true;
                               
                            });                  
                    break;
               
                case 'ADMIN':
                            apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                            {
                                vm.allphase_sous_projet = result.data.response.filter(function(obj)
                                {
                                    return obj.validation == 0;
                                });
                                  vm.showbuttonNouvPhase_sous_projet=true;
                               
                            });
                    
                     
                    break;
                default:
                    break;
            
              }
              vm.validation_delai_travaux = item.validation;
              vm.stepphase = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierDelai_travaux = function(item)
        {
            NouvelItemDelai_travaux = false ;
            vm.selectedItemDelai_travaux = item;
            currentItemDelai_travaux = angular.copy(vm.selectedItemDelai_travaux);
            $scope.vm.alldelai_travaux.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.date_prev_debu_travau   = new Date(vm.selectedItemDelai_travaux.date_prev_debu_travau)  ;
            item.date_reel_debu_travau   = new Date(vm.selectedItemDelai_travaux.date_reel_debu_travau) ;
            item.date_expiration_police   = new Date(vm.selectedItemDelai_travaux.date_expiration_police);
            item.delai_execution = parseInt(vm.selectedItemDelai_travaux.delai_execution) ;
        };

        //fonction bouton suppression item Contrat_prestataire
        vm.supprimerContrat_prestataire = function()
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
                vm.ajoutContrat_prestataire(vm.selectedItemDelai_travaux,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Contrat_prestataire
        function test_existanceDelai_travaux (item,suppression)
        {          
            if (suppression!=1)
            {
               var delai = vm.alldelai_travaux.filter(function(obj)
                {
                   return obj.id == currentItemDelai_travaux.id;
                });
                if(delai[0])
                {
                   if((delai[0].date_prev_debu_travau   != currentItemDelai_travaux.date_prev_debu_travau )
                    || (delai[0].date_reel_debu_travau  != currentItemDelai_travaux.date_reel_debu_travau)
                    || (delai[0].date_expiration_police   != currentItemDelai_travaux.date_expiration_police )
                    || (delai[0].delai_execution != currentItemDelai_travaux.delai_execution ))                   
                      { 
                         insert_in_baseDelai_travaux(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDelai_travaux(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseDelai_travaux(delai_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDelai_travaux==false)
            {
                getId = vm.selectedItemDelai_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_prev_debu_travau: convertionDate(new Date(delai_travaux.date_prev_debu_travau)),
                    date_reel_debu_travau: convertionDate(new Date(delai_travaux.date_reel_debu_travau)),
                    date_expiration_police: convertionDate(new Date(delai_travaux.date_expiration_police)),
                    delai_execution: delai_travaux.delai_execution,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("delai_travaux/index",datas, config).success(function (data)
            {
                if (NouvelItemDelai_travaux == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemDelai_travaux.$selected  = false;
                        vm.selectedItemDelai_travaux.$edit      = false;
                        vm.selectedItemDelai_travaux ={};
                        vm.showbuttonNouvDelai_travaux= false;
                    }
                    else 
                    {    
                      vm.alldelai_travaux = vm.alldelai_travaux.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDelai_travaux.id;
                      });
                      vm.showbuttonNouvDelai_travaux= true;
                    }
                    
                }
                else
                {
                  delai_travaux.validation = 0;
                  delai_travaux.id  =   String(data.response);              
                  NouvelItemDelai_travaux=false;
                  vm.showbuttonNouvDelai_travaux= false;
            } 
              delai_travaux.$selected = false;
              delai_travaux.$edit = false;
              vm.selectedItemDelai_travaux = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin eelai_travaux****************************************/
/**********************************debut passation_marches****************************************/
   apiFactory.getAll("etape_sousprojet/index").then(function(result)
        {
            vm.alletape_sousprojet= result.data.response;
            vm.allcurentetape_sousprojet= result.data.response;
        });
        vm.alletape_sousprojet=[];     
        //col table
        vm.phase_sous_projet_column = [
        {titre:"Phase sous projet"
        },
        {titre:"Description"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        vm.ajouterPhase_sous_projet = function ()
        { 
            var items = {
                            $edit: true,
                            $selected: true,
                            id: '0',         
                            id_etape_sousprojet: '',
                            description: '',
                            date_travaux: ''
                          };
          if (NouvelItemPhase_sous_projet == false)
          {                
                  var last_id_etape_phase = Math.max.apply(Math, vm.allphase_sous_projet.map(function(o){return o.id;}));

                vm.dataLasteetape_phase = vm.allphase_sous_projet.filter(function(obj){return obj.id == last_id_etape_phase;});

                if (vm.dataLasteetape_phase.length>0)
                {
                    if (vm.dataLasteetape_phase[0].validation == 1)
                    {  
                      var last_etape = Math.max.apply(Math, vm.dataLasteetape_phase.map(function(o){return o.etape_sousprojet.code.split(' ')[1];}));
                        
                      vm.allcurentetape_sousprojet = vm.alletape_sousprojet.filter(function(obj){return obj.code == 'etape '+(parseInt(last_etape)+1);});
                      console.log(vm.allcurentetape_sousprojet);
                      vm.allphase_sous_projet.push(items);                          
                      vm.selectedItemPhase_sous_projet = items;
                      NouvelItemPhase_sous_projet = true ;

                    }
                    else
                    {
                        vm.showAlert('Ajout réfuser','La dernière étape est en cours de traitement!!!');
                        vm.allcurentetape_sousprojet = [];
                    }
                }
                else
                {
                    vm.allcurentetape_sousprojet = vm.alletape_sousprojet.filter(function(obj){return obj.code == 'etape 1';});
                    vm.allphase_sous_projet.push(items);                          
                    vm.selectedItemPhase_sous_projet = items;
                    NouvelItemPhase_sous_projet = true ;
                    vm.dataLasteetape_phase = [];
                }                       
              
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
            item.id_etape_sousprojet   = currentItemPhase_sous_projet.id_etape_sousprojet ;
            item.date_travaux   = currentItemPhase_sous_projet.date_travaux ;
            item.description   = currentItemPhase_sous_projet.description ;
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

        //fonction selection item region
        vm.selectionPhase_sous_projet= function (item)
        {
            vm.selectedItemPhase_sous_projet = item;
            //nouvelItemPhase_sous_projet   = item;
            if (item.$selected == false || item.$selected == undefined)
            {
              currentItemPhase_sous_projet    = JSON.parse(JSON.stringify(vm.selectedItemPhase_sous_projet));
            }
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierPhase_sous_projet = function(item)
        {
            NouvelItemPhase_sous_projet = false ;
            vm.selectedItemPhase_sous_projet = item;
            currentItemPhase_sous_projet = angular.copy(vm.selectedItemPhase_sous_projet);
            $scope.vm.allphase_sous_projet.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_etape_sousprojet   = vm.selectedItemPhase_sous_projet.etape_sousprojet.id ;
            item.date_travaux   =new Date (vm.selectedItemPhase_sous_projet.date_travaux) ;
            vm.showbuttonValidationphase_sous_projet = false;
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
        function test_existancePhase_sous_projet (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allphase_sous_projet.filter(function(obj)
                {
                   return obj.id == currentItemPhase_sous_projet.id;
                });
                if(pass[0])
                {
                   if((pass[0].id_etape_sousprojet   != currentItemPhase_sous_projet.id_etape_sousprojet)
                      ||(pass[0].date_travaux   != currentItemPhase_sous_projet.date_travaux) )                   
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

        //insertion ou mise a jours ou suppression item dans bdd feffi
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
            console.log(vm.selectedItemPhase_sous_projet);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,                    
                    id_etape_sousprojet:phase_sous_projet.id_etape_sousprojet,                    
                    date_travaux: convertionDate(new Date(phase_sous_projet.date_travaux)),
                    id_delai_travaux: vm.selectedItemDelai_travaux.id,
                    validation:0,               
                });
                console.log(datas);
                //factory
            apiFactory.add("phase_sous_projet/index",datas, config).success(function (data)
            { 
                var etape = vm.alletape_sousprojet.filter(function(obj)
                {
                   return obj.id == phase_sous_projet.id_etape_sousprojet;
                });
                if (NouvelItemPhase_sous_projet == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   

                        vm.selectedItemPhase_sous_projet.etape_sousprojet = etape[0];
                        vm.selectedItemPhase_sous_projet.$selected  = false;
                        vm.selectedItemPhase_sous_projet.$edit      = false;
                        vm.selectedItemPhase_sous_projet ={};
                        //vm.showbuttonNouvPhase_sous_projet= false;
                    }
                    else 
                    {    
                      vm.allphase_sous_projet = vm.allphase_sous_projet.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPhase_sous_projet.id;
                      });
                     // vm.showbuttonNouvPhase_sous_projet= true;
                    }
                    
                }
                else
                { 
                  phase_sous_projet.etape_sousprojet = etape[0];
                  phase_sous_projet.validation=0;
                  phase_sous_projet.id  =   String(data.response);              
                  NouvelItemPhase_sous_projet=false;
                  //vm.showbuttonNouvPhase_sous_projet= false;
            }
              phase_sous_projet.$selected = false;
              phase_sous_projet.$edit = false;
              vm.selectedItemPhase_sous_projet = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.change_etape = function(item)
        { 
          var eta = vm.alletape_sousprojet.filter(function(obj)
          {
              return obj.id == item.id_etape_sousprojet;
          });
          item.etape_sousprojet = eta[0];
        }
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
        },
        {titre:"Action"
        }];        //Masque de saisi ajout
        vm.ajouterReception_mpe = function ()
        { 
          if (NouvelItemReception_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',         
              date_previ_recep_tech: '',
              date_reel_tech: '',
              date_leve_recep_tech: '',
              date_previ_recep_prov:'',
              date_reel_recep_prov:'',
              date_previ_leve: '',
              date_reel_lev_ava_rd:'',
              date_previ_recep_defi: '',
              date_reel_recep_defi: '',
              observation:''
            };         
            vm.allreception_mpe.push(items);
           
            vm.selectedItemReception_mpe = items;             

            NouvelItemReception_mpe = true ;
          }else
          {
            vm.showAlert('Ajout reception_mpes','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutReception_mpe(reception_mpe,suppression)
        {
            if (NouvelItemReception_mpe==false)
            {
                test_existanceReception_mpe (reception_mpe,suppression); 
            } 
            else
            {
                insert_in_baseReception_mpe(reception_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation reception_mpe
        vm.annulerReception_mpe = function(item)
        {
          if (NouvelItemReception_mpe == false)
          {
            item.$edit      = false;
            item.$selected = false;

            item.id_contrat_prestataire   = currentItemReception_mpe.id_contrat_prestataire ;
            item.observation              = currentItemReception_mpe.observation ;
            item.date_previ_recep_tech    = currentItemReception_mpe.date_previ_recep_tech ;
            item.date_reel_tech           = currentItemReception_mpe.date_reel_tech ;
            item.date_leve_recep_tech     = currentItemReception_mpe.date_leve_recep_tech ;
            item.date_previ_recep_prov    = currentItemReception_mpe.date_previ_recep_prov;
            item.date_reel_recep_prov     = currentItemReception_mpe.date_reel_recep_prov ; 
            item.date_previ_leve          = currentItemReception_mpe.date_previ_leve ; 
            item.date_reel_lev_ava_rd     = currentItemReception_mpe.date_reel_lev_ava_rd ;
            item.date_previ_recep_defi    = currentItemReception_mpe.date_previ_recep_defi ;
            item.date_reel_recep_defi     = currentItemReception_mpe.date_reel_recep_defi ;
          }
            else
            {
              vm.allreception_mpe = vm.allreception_mpe.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemReception_mpe.id;
              });
            }

          vm.selectedItemReception_mpe = {} ;
          NouvelItemReception_mpe      = false;
          vm.showbuttonEnregi = true;
          
        };

        //fonction selection item region
        vm.selectionReception_mpe= function (item)
        {
            vm.selectedItemReception_mpe = item;

            if (item.id!=0) 
            {
              currentItemReception_mpe    = JSON.parse(JSON.stringify(vm.selectedItemReception_mpe));  
              vm.showboutonValider = true;
              vm.showbuttonValidationreception_mpe = true;
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

        //fonction masque de saisie modification item feffi
        vm.modifierReception_mpe = function(item)
        {
            NouvelItemReception_mpe = false ;
            vm.selectedItemReception_mpe = item;

            currentItemReception_mpe = angular.copy(vm.selectedItemReception_mpe);
            $scope.vm.allreception_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.observation              = vm.selectedItemReception_mpe.observation ;
            //item.id_contrat_prestataire              = vm.selectedItemReception_mpe.contrat_prestataire.id ;
            item.date_previ_recep_tech    = new Date( vm.selectedItemReception_mpe.date_previ_recep_tech );
            item.date_reel_tech           = new Date( vm.selectedItemReception_mpe.date_reel_tech );
            item.date_leve_recep_tech     = new Date( vm.selectedItemReception_mpe.date_leve_recep_tech );
            item.date_previ_recep_prov    = new Date( vm.selectedItemReception_mpe.date_previ_recep_prov);
            item.date_reel_recep_prov     = new Date( vm.selectedItemReception_mpe.date_reel_recep_prov ); 
            item.date_previ_leve          = new Date( vm.selectedItemReception_mpe.date_previ_leve ); 
            item.date_reel_lev_ava_rd     = new Date( vm.selectedItemReception_mpe.date_reel_lev_ava_rd );
            item.date_previ_recep_defi    = new Date( vm.selectedItemReception_mpe.date_previ_recep_defi );
            item.date_reel_recep_defi     = new Date( vm.selectedItemReception_mpe.date_reel_recep_defi );
            item.$edit=true;
            vm.showbuttonValidationreception_mpe = false;
        };

        //fonction bouton suppression item reception_mpe
        vm.supprimerReception_mpe = function()
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
                vm.ajoutReception_mpe(vm.selectedItemReception_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceReception_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allreception_mpe.filter(function(obj)
                {
                   return obj.id == currentItemReception_mpe.id;
                });
                if(pass[0])
                {
                   if((item.observation               != currentItemReception_mpe.observation )
                    || (item.date_previ_recep_tech    != currentItemReception_mpe.date_previ_recep_tech )
                    || (item.date_reel_tech           != currentItemReception_mpe.date_reel_tech )
                    || (item.date_leve_recep_tech     != currentItemReception_mpe.date_leve_recep_tech )
                    || (item.date_previ_recep_prov    != currentItemReception_mpe.date_previ_recep_prov)
                    || (item.date_reel_recep_prov     != currentItemReception_mpe.date_reel_recep_prov ) 
                    || (item.date_previ_leve          != currentItemReception_mpe.date_previ_leve )
                    || (item.date_reel_lev_ava_rd     != currentItemReception_mpe.date_reel_lev_ava_rd )
                    || (item.date_previ_recep_defi    != currentItemReception_mpe.date_previ_recep_defi )
                    || (item.date_reel_recep_defi     != currentItemReception_mpe.date_reel_recep_defi ))                   
                      { 
                         insert_in_baseReception_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseReception_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseReception_mpe(reception_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemReception_mpe==false)
            {
                getId = vm.selectedItemReception_mpe.id; 
            } 
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    observation              : reception_mpe.observation,
                    date_previ_recep_tech    : convertionDate(new Date(reception_mpe.date_previ_recep_tech )),
                    date_reel_tech           : convertionDate(new Date(reception_mpe.date_reel_tech )),
                    date_leve_recep_tech     : convertionDate(new Date(reception_mpe.date_leve_recep_tech )),
                    date_previ_recep_prov    : convertionDate(new Date(reception_mpe.date_previ_recep_prov)),
                    date_reel_recep_prov     : convertionDate(new Date(reception_mpe.date_reel_recep_prov )), 
                    date_previ_leve          : convertionDate(new Date(reception_mpe.date_previ_leve )), 
                    date_reel_lev_ava_rd     : convertionDate(new Date(reception_mpe.date_reel_lev_ava_rd )),
                    date_previ_recep_defi    : convertionDate(new Date(reception_mpe.date_previ_recep_defi )),
                    date_reel_recep_defi     : convertionDate(new Date(reception_mpe.date_reel_recep_defi )),
                    id_contrat_prestataire    :vm.selectedItemContrat_prestataire.id,
                    validation    :0
                      
                });
                console.log(datas);
                //factory
            apiFactory.add("reception_mpe/index",datas, config).success(function (data)
            {   
                var contrat= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == reception_mpe.id_contrat_prestataire;
                });

                if (NouvelItemReception_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                       
                        //vm.selectedItemReception_mpe.contrat_prestataire = contrat[0];
                        vm.selectedItemReception_mpe.$selected  = false;
                        vm.selectedItemReception_mpe.$edit      = false;
                        vm.selectedItemReception_mpe ={};
                        vm.showbuttonNouvReception_mpe= false;
                        
                    }
                    else 
                    {    
                      vm.allreception_mpe = vm.allreception_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemReception_mpe.id;
                      });
                      vm.showbuttonNouvReception_mpe = true;
                      
                    }
                    
                }
                else
                {
                  //reception_mpe.contrat_prestataire = contrat[0];
                  reception_mpe.validation=0;
                  reception_mpe.id  =   String(data.response);              
                  NouvelItemReception_mpe=false;
                  vm.showbuttonNouvReception_mpe= false;
                  
            }
              
              reception_mpe.$selected = false;
              reception_mpe.$edit = false;
              vm.selectedItemReception_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/************************************************fin reception***************************************************/

/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_batiment_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Avancement"
        },
        {titre:"Date"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvancement_batiment = function ()
        { 
          if (NouvelItemAvancement_batiment == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              description: '',
              observation: '',
              date: '',
              id_attachement_batiment:'',
              ponderation_batiment:'',
              validation: '0',
              attachement_batiment:{ponderation_batiment:0}
            };         
            vm.allavancement_batiment.push(items);
            vm.allavancement_batiment.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_batiment = mem;
              }
            });
            
            NouvelItemAvancement_batiment= true ;
            //console.log(vm.allavancement_batiment);
            if (vm.allavancement_batiment.length>1)
            {
              var max_ponderation_batiment = Math.max.apply(Math, vm.allavancement_batiment.map(function(o)
            { 
                  return o.attachement_batiment.ponderation_batiment;
            }));
            vm.allcurrentattachement_batiment = vm.allattachement_batiment.filter(function(obj)
            {
                return obj.ponderation_batiment > max_ponderation_batiment;
            });
            console.log(max_ponderation_batiment);
            console.log(vm.allcurrentattachement_batiment);

            }else
            {
              vm.allcurrentattachement_batiment = vm.allattachement_batiment;
            }
            

          }else
          {
            vm.showAlert('Ajout avancement_batiment','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_batiment(avancement_batiment,suppression)
        {
            if (NouvelItemAvancement_batiment==false)
            {
                test_existanceAvancement_batiment(avancement_batiment,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_batiment(avancement_batiment,suppression);
                //console.log(avancement_batiment);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerAvancement_batiment= function(item)
        {
          if (NouvelItemAvancement_batiment == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvancement_batiment.intitule ;
            item.description   = currentItemAvancement_batiment.description ;
            item.observation   = currentItemAvancement_batiment.observation ;
            item.date = currentItemAvancement_batiment.date ;
            item.id_attachement_batiment = currentItemAvancement_batiment.id_attachement_batiment;
            item.ponderation_batiment = currentItemAvancement_batiment.ponderation_batiment ;
           
          }else
          {
            vm.allavancement_batiment = vm.allavancement_batiment.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_batiment.id;
            });
          }

          vm.selectedItemAvancement_batiment = {} ;
          NouvelItemAvancement_batiment      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_batiment= function (item)
        {
            vm.selectedItemAvancement_batiment = item;
            vm.nouvelItemAvancement_batiment   = item;
            currentItemAvancement_batiment    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_batiment));
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_batiment_doc/index",'id_avancement_batiment',vm.selectedItemAvancement_batiment.id).then(function(result)
            {
                vm.allavancement_batiment_doc = result.data.response;
                console.log(vm.allavancement_batiment_doc);
            });
            
              vm.showbuttonValidationavancement_batiment = true;          

           }
              vm.validation_avancement_batiment = item.validation; 
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

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_batiment = function(item)
        {
            NouvelItemAvancement_batiment = false ;
            vm.selectedItemAvancement_batiment = item;
            currentItemAvancement_batiment = angular.copy(vm.selectedItemAvancement_batiment);
            $scope.vm.allavancement_batiment.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvancement_batiment.intitule ;
            item.description   = vm.selectedItemAvancement_batiment.description ;
            item.observation   = vm.selectedItemAvancement_batiment.observation;
            item.date = new Date(vm.selectedItemAvancement_batiment.date);
            item.id_attachement_batiment = vm.selectedItemAvancement_batiment.attachement_batiment.id;
            item.ponderation_batiment = parseInt(vm.selectedItemAvancement_batiment.attachement_batiment.ponderation_batiment);

            var allattachement_batiment_autre = vm.allattachement_batiment.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_batiment.attachement_batiment.id;
            });

            var allavancement_batiment_autre = vm.allavancement_batiment.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_batiment.id;
            });
            
              var max_ponderation_batiment = Math.max.apply(Math, allavancement_batiment_autre.map(function(o)
              { 
                return o.attachement_batiment.ponderation_batiment;
              }));
            vm.allcurrentattachement_batiment = allattachement_batiment_autre.filter(function(obj)
            {
                return obj.ponderation_batiment > max_ponderation_batiment;
            });
            vm.allcurrentattachement_batiment.push(vm.selectedItemAvancement_batiment.attachement_batiment);
           
        };

        //fonction bouton suppression item avancement_batiment
        vm.supprimerAvancement_batiment = function()
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
                vm.ajoutAvancement_batiment(vm.selectedItemAvancement_batiment,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Avancement_batimente
        function test_existanceAvancement_batiment (item,suppression)
        {          
            if (suppression!=1)
            {
               var avanc = vm.allavancement_batiment.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_batiment.id;
                });
                if(avanc[0])
                {
                   if((avanc[0].intitule   != currentItemAvancement_batiment.intitule )
                    || (avanc[0].description  != currentItemAvancement_batiment.description)
                    || (avanc[0].observation   != currentItemAvancement_batiment.observation )
                    || (avanc[0].date != currentItemAvancement_batiment.date )
                    || (avanc[0].id_attachement_batiment != currentItemAvancement_batiment.id_attachement_batiment))                   
                      { 
                         insert_in_baseAvancement_batiment(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_batiment(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvancement_batiment(avancement_batiment,suppression)
        {    console.log(avancement_batiment);
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_batiment==false)
            {
                getId = vm.selectedItemAvancement_batiment.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avancement_batiment.intitule,
                    description: avancement_batiment.description,
                    description: avancement_batiment.description,
                    validation: 0,
                    date: convertionDate(new Date(avancement_batiment.date)),
                    id_attachement_batiment:avancement_batiment.id_attachement_batiment,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_batiment/index",datas, config).success(function (data)
            {   
                var attac= vm.allattachement_batiment.filter(function(obj)
                {
                    return obj.id == avancement_batiment.id_attachement_batiment;
                });
                

                if (NouvelItemAvancement_batiment == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemAvancement_batiment.attachement_batiment = attac[0];
                        
                        vm.selectedItemAvancement_batiment.$selected  = false;
                        vm.selectedItemAvancement_batiment.$edit      = false;
                        vm.selectedItemAvancement_batiment ={};
                        //vm.showbuttonNouvAvancement_batiment= false;
                     
                    }
                    else 
                    {    
                      vm.allavancement_batiment = vm.allavancement_batiment.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvancement_batiment.id;
                      });
                      //vm.showbuttonNouvAvancement_batiment= true;

                    }
                    
                }
                else
                {
                  avancement_batiment.attachement_batiment = attac[0];
                  avancement_batiment.validation = 0;
                  avancement_batiment.id  =   String(data.response);              
                  NouvelItemAvancement_batiment=false;
                  //vm.showbuttonNouvAvancement_batiment= false;
            }
              avancement_batiment.$selected = false;
              avancement_batiment.$edit = false;
              vm.selectedItemAvancement_batiment = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin avancement batiment************************************************/

/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_latrine_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Avancement"
        },
        //{titre:"Ponderation"
        //},
        {titre:"Date"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvancement_latrine = function ()
        { 
          if (NouvelItemAvancement_latrine == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              description: '',
              observation: '',
              date: '',
              id_attachement_latrine:'',
              ponderation_latrine:'',
              validation: '0',
              attachement_latrine:{ponderation_latrine:0}
            };         
            vm.allavancement_latrine.push(items);
            vm.allavancement_latrine.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_latrine = mem;
              }
            });
            
            NouvelItemAvancement_latrine= true ;
            //console.log(vm.allavancement_latrine);
            if (vm.allavancement_latrine.length>1)
            {
              var max_ponderation_latrine = Math.max.apply(Math, vm.allavancement_latrine.map(function(o)
            { 
                  return o.attachement_latrine.ponderation_latrine;
            }));
            vm.allcurrentattachement_latrine = vm.allattachement_latrine.filter(function(obj)
            {
                return obj.ponderation_latrine > max_ponderation_latrine;
            });
            console.log(max_ponderation_latrine);
            console.log(vm.allcurrentattachement_latrine);

            }else
            {
              vm.allcurrentattachement_latrine = vm.allattachement_latrine;
            }
            

          }else
          {
            vm.showAlert('Ajout avancement_latrine','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_latrine(avancement_latrine,suppression)
        {
            if (NouvelItemAvancement_latrine==false)
            {
                test_existanceAvancement_latrine(avancement_latrine,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_latrine(avancement_latrine,suppression);
                //console.log(avancement_latrine);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerAvancement_latrine= function(item)
        {
          if (NouvelItemAvancement_latrine == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvancement_latrine.intitule ;
            item.description   = currentItemAvancement_latrine.description ;
            item.observation   = currentItemAvancement_latrine.observation ;
            item.date = currentItemAvancement_latrine.date ;
            item.id_attachement_latrine = currentItemAvancement_latrine.id_attachement_latrine;
            item.ponderation_latrine = currentItemAvancement_latrine.ponderation_latrine ;
           
          }else
          {
            vm.allavancement_latrine = vm.allavancement_latrine.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_latrine.id;
            });
          }

          vm.selectedItemAvancement_latrine = {} ;
          NouvelItemAvancement_latrine      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_latrine= function (item)
        {
            vm.selectedItemAvancement_latrine = item;
            vm.nouvelItemAvancement_latrine   = item;
            currentItemAvancement_latrine    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_latrine));
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_latrine_doc/index",'id_avancement_latrine',vm.selectedItemAvancement_latrine.id).then(function(result)
            {
                vm.allavancement_latrine_doc = result.data.response;
                console.log(vm.allavancement_latrine_doc);
            });
            
              vm.showbuttonValidationavancement_latrine = true;          

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

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_latrine = function(item)
        {
            NouvelItemAvancement_latrine = false ;
            vm.selectedItemAvancement_latrine = item;
            currentItemAvancement_latrine = angular.copy(vm.selectedItemAvancement_latrine);
            $scope.vm.allavancement_latrine.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvancement_latrine.intitule ;
            item.description   = vm.selectedItemAvancement_latrine.description ;
            item.observation   = vm.selectedItemAvancement_latrine.observation;
            item.date = new Date(vm.selectedItemAvancement_latrine.date);
            item.id_attachement_latrine = vm.selectedItemAvancement_latrine.attachement_latrine.id;
            item.ponderation_latrine = parseInt(vm.selectedItemAvancement_latrine.attachement_latrine.ponderation_latrine);

            var allattachement_latrine_autre = vm.allattachement_latrine.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_latrine.attachement_latrine.id;
            });

            var allavancement_latrine_autre = vm.allavancement_latrine.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_latrine.id;
            });

            //if (vm.allavancement_latrine.length>1)
           // {
              var max_ponderation_latrine = Math.max.apply(Math, allavancement_latrine_autre.map(function(o)
              { 
                return o.attachement_latrine.ponderation_latrine;
              }));
            vm.allcurrentattachement_latrine = allattachement_latrine_autre.filter(function(obj)
            {
                return obj.ponderation_latrine > max_ponderation_latrine;
            });
            vm.allcurrentattachement_latrine.push(vm.selectedItemAvancement_latrine.attachement_latrine);

            vm.showbuttonValidationavancement_latrine = false;

           /* }else
            {
              vm.allcurrentattachement_latrine = vm.allattachement_latrine;
            }*/
           
        };

        //fonction bouton suppression item avancement_latrine
        vm.supprimerAvancement_latrine = function()
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
                vm.ajoutAvancement_latrine(vm.selectedItemAvancement_latrine,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Avancement_latrinee
        function test_existanceAvancement_latrine (item,suppression)
        {          
            if (suppression!=1)
            {
               var avanc = vm.allavancement_latrine.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_latrine.id;
                });
                if(avanc[0])
                {
                   if((avanc[0].intitule   != currentItemAvancement_latrine.intitule )
                    || (avanc[0].description  != currentItemAvancement_latrine.description)
                    || (avanc[0].observation   != currentItemAvancement_latrine.observation )
                    || (avanc[0].date != currentItemAvancement_latrine.date )
                    || (avanc[0].id_attachement_latrine != currentItemAvancement_latrine.id_attachement_latrine))                   
                      { 
                         insert_in_baseAvancement_latrine(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_latrine(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvancement_latrine(avancement_latrine,suppression)
        {    console.log(avancement_latrine);
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_latrine==false)
            {
                getId = vm.selectedItemAvancement_latrine.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avancement_latrine.intitule,
                    description: avancement_latrine.description,
                    description: avancement_latrine.description,
                    validation: 0,
                    date: convertionDate(new Date(avancement_latrine.date)),
                    id_attachement_latrine:avancement_latrine.id_attachement_latrine,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_latrine/index",datas, config).success(function (data)
            {   
                var attac= vm.allattachement_latrine.filter(function(obj)
                {
                    return obj.id == avancement_latrine.id_attachement_latrine;
                });
                

                if (NouvelItemAvancement_latrine == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemAvancement_latrine.attachement_latrine = attac[0];
                        
                        vm.selectedItemAvancement_latrine.$selected  = false;
                        vm.selectedItemAvancement_latrine.$edit      = false;
                        vm.selectedItemAvancement_latrine ={};
                       // vm.showbuttonNouvAvancement_latrine= false;
                     
                    }
                    else 
                    {    
                      vm.allavancement_latrine = vm.allavancement_latrine.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvancement_latrine.id;
                      });
                      //vm.showbuttonNouvAvancement_latrine= true;

                    }
                    
                }
                else
                {
                  avancement_latrine.attachement_latrine = attac[0];
                  avancement_latrine.validation = 0;
                  avancement_latrine.id  =   String(data.response);              
                  NouvelItemAvancement_latrine=false;
                  //vm.showbuttonNouvAvancement_latrine= false;
            }
              avancement_latrine.$selected = false;
              avancement_latrine.$edit = false;
              vm.selectedItemAvancement_latrine = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changeAttachement_latrine= function(item)
        {
          var atta = vm.allattachement_latrine.filter(function(obj)
          {
              return obj.id == item.id_attachement_latrine;
          });
          item.ponderation_latrine=parseInt(atta[0].ponderation_latrine);
        }
        
/*********************************************fin avancement batiment************************************************/
/**********************************debut avancement batiment****************************************/
//col table
        vm.avancement_mobilier_column = [
        {titre:"Intitule"
        },
        {titre:"Description"
        },
        {titre:"Avancement"
        },
        {titre:"Date"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterAvancement_mobilier = function ()
        { 
          if (NouvelItemAvancement_mobilier == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              description: '',
              observation: '',
              date: '',
              id_attachement_mobilier:'',
              ponderation_mobilier:'',
              validation: '0',
              attachement_mobilier:{ponderation_mobilier:0}
            };         
            vm.allavancement_mobilier.push(items);
            vm.allavancement_mobilier.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAvancement_mobilier = mem;
              }
            });
            
            NouvelItemAvancement_mobilier= true ;
            //console.log(vm.allavancement_mobilier);
            if (vm.allavancement_mobilier.length>1)
            {
              var max_ponderation_mobilier = Math.max.apply(Math, vm.allavancement_mobilier.map(function(o)
            { 
                  return o.attachement_mobilier.ponderation_mobilier;
            }));
            vm.allcurrentattachement_mobilier = vm.allattachement_mobilier.filter(function(obj)
            {
                return obj.ponderation_mobilier > max_ponderation_mobilier;
            });
            console.log(max_ponderation_mobilier);
            console.log(vm.allcurrentattachement_mobilier);

            }else
            {
              vm.allcurrentattachement_mobilier = vm.allattachement_mobilier;
            }
            

          }else
          {
            vm.showAlert('Ajout avancement_mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAvancement_mobilier(avancement_mobilier,suppression)
        {
            if (NouvelItemAvancement_mobilier==false)
            {
                test_existanceAvancement_mobilier(avancement_mobilier,suppression); 
            } 
            else
            {
                insert_in_baseAvancement_mobilier(avancement_mobilier,suppression);
                //console.log(avancement_mobilier);
            }
        }

        //fonction de bouton d'annulation contrat_prestataire
        vm.annulerAvancement_mobilier= function(item)
        {
          if (NouvelItemAvancement_mobilier == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.intitule   = currentItemAvancement_mobilier.intitule ;
            item.description   = currentItemAvancement_mobilier.description ;
            item.observation   = currentItemAvancement_mobilier.observation ;
            item.date = currentItemAvancement_mobilier.date ;
            item.id_attachement_mobilier = currentItemAvancement_mobilier.id_attachement_mobilier;
            item.ponderation_mobilier = currentItemAvancement_mobilier.ponderation_mobilier ;
           
          }else
          {
            vm.allavancement_mobilier = vm.allavancement_mobilier.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvancement_mobilier.id;
            });
          }

          vm.selectedItemAvancement_mobilier = {} ;
          NouvelItemAvancement_mobilier      = false;
          
        };

        //fonction selection item region
        vm.selectionAvancement_mobilier= function (item)
        {
            vm.selectedItemAvancement_mobilier = item;
            vm.nouvelItemAvancement_mobilier   = item;
            currentItemAvancement_mobilier    = JSON.parse(JSON.stringify(vm.selectedItemAvancement_mobilier));
           if(item.id!=0)
           {

            apiFactory.getAPIgeneraliserREST("avancement_mobilier_doc/index",'id_avancement_mobilier',vm.selectedItemAvancement_mobilier.id).then(function(result)
            {
                vm.allavancement_mobilier_doc = result.data.response;
                console.log(vm.allavancement_mobilier_doc);
            });
            
              vm.showbuttonValidationavancement_mobilier = true;          

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

        //fonction masque de saisie modification item feffi
        vm.modifierAvancement_mobilier = function(item)
        {
            NouvelItemAvancement_mobilier = false ;
            vm.selectedItemAvancement_mobilier = item;
            currentItemAvancement_mobilier = angular.copy(vm.selectedItemAvancement_mobilier);
            $scope.vm.allavancement_mobilier.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.intitule   = vm.selectedItemAvancement_mobilier.intitule ;
            item.description   = vm.selectedItemAvancement_mobilier.description ;
            item.observation   = vm.selectedItemAvancement_mobilier.observation;
            item.date = new Date(vm.selectedItemAvancement_mobilier.date);
            item.id_attachement_mobilier = vm.selectedItemAvancement_mobilier.attachement_mobilier.id;
            item.ponderation_mobilier = parseInt(vm.selectedItemAvancement_mobilier.attachement_mobilier.ponderation_mobilier);

            var allattachement_mobilier_autre = vm.allattachement_mobilier.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_mobilier.attachement_mobilier.id;
            });

            var allavancement_mobilier_autre = vm.allavancement_mobilier.filter(function(obj)
            {
                return obj.id != vm.selectedItemAvancement_mobilier.id;
            });

            //if (vm.allavancement_mobilier.length>1)
           // {
              var max_ponderation_mobilier = Math.max.apply(Math, allavancement_mobilier_autre.map(function(o)
              { 
                return o.attachement_mobilier.ponderation_mobilier;
              }));
            vm.allcurrentattachement_mobilier = allattachement_mobilier_autre.filter(function(obj)
            {
                return obj.ponderation_mobilier > max_ponderation_mobilier;
            });
            vm.allcurrentattachement_mobilier.push(vm.selectedItemAvancement_mobilier.attachement_mobilier);

            vm.showbuttonValidationavancement_mobilier = false;

           /* }else
            {
              vm.allcurrentattachement_mobilier = vm.allattachement_mobilier;
            }*/
           
        };

        //fonction bouton suppression item avancement_mobilier
        vm.supprimerAvancement_mobilier = function()
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
                vm.ajoutAvancement_mobilier(vm.selectedItemAvancement_mobilier,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item Avancement_mobiliere
        function test_existanceAvancement_mobilier (item,suppression)
        {          
            if (suppression!=1)
            {
               var avanc = vm.allavancement_mobilier.filter(function(obj)
                {
                   return obj.id == currentItemAvancement_mobilier.id;
                });
                if(avanc[0])
                {
                   if((avanc[0].intitule   != currentItemAvancement_mobilier.intitule )
                    || (avanc[0].description  != currentItemAvancement_mobilier.description)
                    || (avanc[0].observation   != currentItemAvancement_mobilier.observation )
                    || (avanc[0].date != currentItemAvancement_mobilier.date )
                    || (avanc[0].id_attachement_mobilier != currentItemAvancement_mobilier.id_attachement_mobilier))                   
                      { 
                         insert_in_baseAvancement_mobilier(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvancement_mobilier(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvancement_mobilier(avancement_mobilier,suppression)
        {    console.log(avancement_mobilier);
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvancement_mobilier==false)
            {
                getId = vm.selectedItemAvancement_mobilier.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    intitule: avancement_mobilier.intitule,
                    description: avancement_mobilier.description,
                    description: avancement_mobilier.description,
                    validation: 0,
                    date: convertionDate(new Date(avancement_mobilier.date)),
                    id_attachement_mobilier:avancement_mobilier.id_attachement_mobilier,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_mobilier/index",datas, config).success(function (data)
            {   
                var attac= vm.allattachement_mobilier.filter(function(obj)
                {
                    return obj.id == avancement_mobilier.id_attachement_mobilier;
                });
                

                if (NouvelItemAvancement_mobilier == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemAvancement_mobilier.attachement_mobilier = attac[0];
                        
                        vm.selectedItemAvancement_mobilier.$selected  = false;
                        vm.selectedItemAvancement_mobilier.$edit      = false;
                        vm.selectedItemAvancement_mobilier ={};
                        //vm.showbuttonNouvAvancement_mobilier= false;
                     
                    }
                    else 
                    {    
                      vm.allavancement_mobilier = vm.allavancement_mobilier.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvancement_mobilier.id;
                      });
                      //vm.showbuttonNouvAvancement_mobilier= true;

                    }
                    
                }
                else
                {
                  avancement_mobilier.attachement_mobilier = attac[0];
                  avancement_mobilier.validation = 0;
                  avancement_mobilier.id  =   String(data.response);              
                  NouvelItemAvancement_mobilier=false;
                  //vm.showbuttonNouvAvancement_mobilier= false;
            }
              avancement_mobilier.$selected = false;
              avancement_mobilier.$edit = false;
              vm.selectedItemAvancement_mobilier = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changeAttachement_mobilier= function(item)
        {
          var atta = vm.allattachement_mobilier.filter(function(obj)
          {
              return obj.id == item.id_attachement_mobilier;
          });
          item.ponderation_mobilier=parseInt(atta[0].ponderation_mobilier);
        }
        
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
        },
        {titre:"Action"
        }];
    vm.ajouterIndicateur = function ()
        { 
          if (NouvelItemIndicateur == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              nbr_salle_const: '',
              nbr_beneficiaire:'',
              nbr_ecole:'',
              nbr_box:'',
              nbr_point_eau:'',
              nbr_banc:'',
              nbr_table_maitre:'',
              nbr_chaise:'',
              observation:''


            };         
            vm.allindicateur.push(items);
            vm.allindicateur.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemIndicateur = cis;
              }
            });

            NouvelItemIndicateur = true ;
          }else
          {
            vm.showAlert('Ajout indicateur','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutIndicateur(indicateur,suppression)
        {
            if (NouvelItemIndicateur==false)
            {
                test_existanceIndicateur (indicateur,suppression); 
            } 
            else
            {
                insert_in_baseIndicateur(indicateur,suppression);
            }
        }

        //fonction de bouton d'annulation indicateur
        vm.annulerIndicateur = function(item)
        {
          if (NouvelItemIndicateur == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.nbr_salle_const    = currentItemIndicateur.nbr_salle_const ;
            item.nbr_beneficiaire   = currentItemIndicateur.nbr_beneficiaire ;
            item.nbr_ecole       = currentItemIndicateur.nbr_ecole ;
            item.nbr_box        = currentItemIndicateur.nbr_box ;
            item.nbr_point_eau  = currentItemIndicateur.nbr_point_eau ;
            item.nbr_banc       = currentItemIndicateur.nbr_banc ;
            item.nbr_table_maitre = currentItemIndicateur.nbr_table_maitre ;
            item.nbr_chaise       = currentItemIndicateur.nbr_chaise ;
            item.observation      = currentItemIndicateur.observation ; 
          }else
          {
            vm.allindicateur = vm.allindicateur.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItemIndicateur = {} ;
          NouvelItemIndicateur      = false;
          
        };

        //fonction selection item region
        vm.selectionIndicateur= function (item)
        {
            vm.selectedItemIndicateur = item;
            //vm.nouvelItem   = item;
            console.log(item);
            if (parseInt(item.id)!=0)
            {console.log('ok');
                currentItemIndicateur     = JSON.parse(JSON.stringify(vm.selectedItemIndicateur));
                vm.showbuttonValidationindicateur = true;
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

        //fonction masque de saisie modification item indicateur
        vm.modifierIndicateur = function(item)
        {
            NouvelItemIndicateur = false ;
            vm.selectedItemIndicateur = item;
            currentItemIndicateur = angular.copy(vm.selectedItemIndicateur);
            $scope.vm.allindicateur.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;  
            item.nbr_salle_const    = parseInt(vm.selectedItemIndicateur.nbr_salle_const) ;
            item.nbr_beneficiaire   = parseInt(vm.selectedItemIndicateur.nbr_beneficiaire) ;
            item.nbr_ecole       =parseInt( vm.selectedItemIndicateur.nbr_ecole) ;
            item.nbr_box        = parseInt(vm.selectedItemIndicateur.nbr_box );
            item.nbr_point_eau  = parseInt(vm.selectedItemIndicateur.nbr_point_eau) ;
            item.nbr_banc       = parseInt(vm.selectedItemIndicateur.nbr_banc) ;
            item.nbr_table_maitre = parseInt(vm.selectedItemIndicateur.nbr_table_maitre) ;
            item.nbr_chaise       = parseInt(vm.selectedItemIndicateur.nbr_chaise) ;
            item.observation      = vm.selectedItemIndicateur.observation ;
        };

        //fonction bouton suppression item indicateur
        vm.supprimerIndicateur = function()
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
                vm.ajout(vm.selectedItemIndicateur,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item indicateur
        function test_existanceIndicateur (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allindicateur.filter(function(obj)
                {
                   return obj.id == currentItemIndicateur.id;
                });
                if(cis[0])
                {
                   if((cis[0].nbr_beneficiaire!=currentItemIndicateur.nbr_beneficiaire) 
                    || (cis[0].nbr_salle_const!=currentItemIndicateur.nbr_salle_const) 
                    || (cis[0].nbr_ecole!=currentItemIndicateur.nbr_ecole) 
                    || (cis[0].nbr_box!=currentItemIndicateur.nbr_box) 
                    || (cis[0].nbr_point_eau!=currentItemIndicateur.nbr_point_eau) 
                    || (cis[0].nbr_banc!=currentItemIndicateur.nbr_banc) 
                    || (cis[0].nbr_table_maitre!=currentItemIndicateur.nbr_table_maitre) 
                    || (cis[0].nbr_chaise!=currentItemIndicateur.nbr_chaise) 
                    || (cis[0].observation!=currentItemIndicateur.observation))                    
                      { 
                         insert_in_baseIndicateur(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseIndicateur(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd indicateur
        function insert_in_baseIndicateur(indicateur,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemIndicateur==false)
            {
                getId = vm.selectedItemIndicateur.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    nbr_salle_const:      indicateur.nbr_salle_const,
                    nbr_beneficiaire: indicateur.nbr_beneficiaire,
                    nbr_ecole: indicateur.nbr_ecole ,
                    nbr_box: indicateur.nbr_box ,
                    nbr_point_eau: indicateur.nbr_point_eau ,
                    nbr_banc: indicateur.nbr_banc ,
                    nbr_table_maitre: indicateur.nbr_table_maitre ,
                    nbr_chaise: indicateur.nbr_chaise ,
                    observation: indicateur.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("indicateur/index",datas, config).success(function (data)
            {
                if (NouvelItemIndicateur == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemIndicateur.$selected  = false;
                        vm.selectedItemIndicateur.$edit      = false;
                        vm.selectedItemIndicateur ={};
                    }
                    else 
                    {    
                      vm.allindicateur = vm.allindicateur.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemIndicateur.id;
                      });
                    }
                }
                else
                {   
                  indicateur.validation = 0;
                  indicateur.id  =   String(data.response);              
                  NouvelItemIndicateur=false;
                  vm.showbuttonNouvIndicateur= false;
            }   
                vm.validation_indicateur = 0;
                indicateur.$selected = false;
                indicateur.$edit = false;
                vm.selectedItemIndicateur = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        
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