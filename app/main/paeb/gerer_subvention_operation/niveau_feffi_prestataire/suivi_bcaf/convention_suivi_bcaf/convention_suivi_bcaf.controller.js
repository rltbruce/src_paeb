
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.suivi_bcaf.convention_suivi_bcaf')
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
        .controller('Convention_suivi_bcafController', Convention_suivi_bcafController);
    /** @ngInject */
    function Convention_suivi_bcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.styleTabfils = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        vm.affiche_load =false;
       
        vm.stepMenu_pr=false;
        vm.stepdoc_pr=false;
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepdoc_moe=false;
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;
        vm.stepprestaion_pr=false;
        vm.stepprestation_moe = false;

        vm.stepsuiviexecution = false;
        vm.stepphase = false;

        vm.stepjusti_d_tra_moe = false;

        vm.stepjusti_trans_reliqua = false;

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
        vm.ciscos = [];

/*******************************Debut initialisation suivi financement feffi******************************/
        
        vm.ajoutDocument_feffi_scan = ajoutDocument_feffi_scan;
        var NouvelItemDocument_feffi_scan=false;
        var currentItemDocument_feffi_scan;
        vm.selectedItemDocument_feffi_scan = {} ;
        vm.alldocument_feffi_scan = [] ;
      vm.showbuttonValidation_document_feffi_scan  = false;
        vm.permissionboutonvaliderdocument_feffi_scan  = false;

        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];

        vm.nbr_demande_feffi_creer=0;

        vm.showbuttonValidation = false;
        vm.ajoutAvenant_convention = ajoutAvenant_convention ;
        var NouvelItemAvenant_convention=false;
        var currentItemAvenant_convention;
        vm.selectedItemAvenant_convention = {} ;
        vm.allavenant_convention = [] ;

        vm.showbuttonValidation_avenant_convention = false;
        vm.permissionboutonvalideravenant_convention = false;    

/*******************************Fin initialisation suivi financement feffi******************************/

/*****************************************Debut partenaire relai****************************************/
  
        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ; 

        vm.ajoutDocument_pr_scan = ajoutDocument_pr_scan;
        var NouvelItemDocument_pr_scan=false;
        var currentItemDocument_pr_scan;
        vm.selectedItemDocument_pr_scan = {} ;
        vm.alldocument_pr_scan = [] ;

        vm.showbuttonValidation_document_pr_scan  = false;
        vm.permissionboutonvaliderdocument_pr_scan  = false;
        
        vm.ajoutModule_dpp = ajoutModule_dpp;
        var NouvelItemModule_dpp=false;
        var currentItemModule_dpp;
        vm.selectedItemModule_dpp = {} ;
        vm.allmodule_dpp = [] ;

        vm.permissionboutonvaliderformdpp = false;
        vm.showbuttonValidationformdpp = false;

        vm.ajoutParticipant_dpp = ajoutParticipant_dpp ;
        var NouvelItemParticipant_dpp=false;
        var currentItemParticipant_dpp;
        vm.selectedItemParticipant_dpp = {} ;
        vm.allparticipant_dpp = [] ;

        vm.ajoutModule_odc = ajoutModule_odc;
        var NouvelItemModule_odc=false;
        var currentItemModule_odc;
        vm.selectedItemModule_odc = {} ;
        vm.allmodule_odc = [] ;

        vm.permissionboutonvaliderformodc = false;

        vm.ajoutParticipant_odc = ajoutParticipant_odc ;
        var NouvelItemParticipant_odc=false;
        var currentItemParticipant_odc;
        vm.selectedItemParticipant_odc = {} ;
        vm.allparticipant_odc = [] ;

        vm.ajoutModule_emies = ajoutModule_emies;
        var NouvelItemModule_emies=false;
        var currentItemModule_emies;
        vm.selectedItemModule_emies = {} ;
        vm.allmodule_emies = [] ;

        vm.permissionboutonvaliderformemies = false;
        vm.showbuttonValidationformemies = false;
     
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

        vm.permissionboutonvaliderformgfpc = false;
        vm.showbuttonValidationformgfpc = false;

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

        vm.permissionboutonvaliderformpmc = false;
        vm.showbuttonValidationformpmc = false;

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

        vm.permissionboutonvaliderformsep = false;
        vm.showbuttonValidationformsep = false;

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

        vm.permissionboutonenvaliderpassation_moe = false;
        vm.showbuttonValidationpassation_moe = false;

        vm.ajoutContrat_moe = ajoutContrat_moe ;
        var NouvelItemContrat_moe=false;
        var currentItemContrat_moe;
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

        vm.allrubrique_calendrier_paie_moe = [];
        vm.selectedItemRubrique_calendrier_paie_moe = {};

        vm.allsousrubrique_calendrier_paie_moe = [];
        vm.selectedItemSousrubrique_calendrier_paie_moe = {};

        vm.permissionboutonvalidercontrat_moe = false;
        vm.showbuttonValidationcontrat_moe = false;

        vm.ajoutAvenant_moe = ajoutAvenant_moe ;
        var NouvelItemAvenant_moe=false;
        var currentItemAvenant_moe;
        vm.selectedItemAvenant_moe = {} ;
        vm.allavenant_moe = [] ;

        vm.showbuttonValidation_avenant_moe = false;
        vm.permissionboutonvalideravenant_moe = false;

        vm.ajoutMemoire_technique = ajoutMemoire_technique;
        var NouvelItemMemoire_technique=false;
        var currentItemMemoire_technique;
        vm.selectedItemMemoire_technique = {} ;
        vm.allmemoire_technique = [] ;

        vm.permissionboutonvaliderMemoire_technique = false;
        vm.showbuttonValidationMemoire_technique = false;

        vm.ajoutAppel_offre = ajoutAppel_offre;
        var NouvelItemAppel_offre=false;
        var currentItemAppel_offre;
        vm.selectedItemAppel_offre = {} ;
        vm.allappel_offre = [] ;

        vm.permissionboutonvaliderAppel_offre = false;
        vm.showbuttonValidationAppel_offre = false;

        vm.ajoutRapport_mensuel = ajoutRapport_mensuel;
        var NouvelItemRapport_mensuel=false;
        var currentItemRapport_mensuel;
        vm.selectedItemRapport_mensuel = {} ;
        vm.allrapport_mensuel = [] ;
        vm.insererrapport = false;
        vm.permissionboutonvaliderRapport_mensuel = false;
        vm.showbuttonValidationRapport_mensuel = false;

        vm.ajoutManuel_gestion = ajoutManuel_gestion;
        var NouvelItemManuel_gestion=false;
        vm.selectedItemManuel_gestion = {} ;
        var currentItemManuel_gestion;
        vm.allmanuel_gestion = [] ;

        vm.permissionboutonvaliderManuel_gestion = false;
        vm.showbuttonValidationManuel_gestion = false;

        vm.ajoutPolice_assurance = ajoutPolice_assurance;
        var NouvelItemPolice_assurance=false;
        vm.selectedItemPolice_assurance = {} ;
        var currentItemPolice_assurance;
        vm.allpolice_assurance = [] ;

        vm.permissionboutonvaliderPolice_assurance = false;
        vm.showbuttonValidationPolice_assurance = false;

/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.ajoutPassation_marches = ajoutPassation_marches ;
        var NouvelItemPassation_marches=false;
        var currentItemPassation_marches;
        vm.selectedItemPassation_marches = {} ;
        vm.allpassation_marches = [] ;

        vm.permissionboutonenvaliderpassation = false;
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

        vm.permissionboutonvalidercontrat_prestataire = false;
        vm.showbuttonValidationcontrat_prestataire = false;

        vm.allrubrique_attachement_batiment_mpe = [];
        vm.showbuttonNouvContrat_prestataire=true;
        vm.selectedItemRubrique_attachement_batiment_mpe = {};

        vm.ajoutDivers_attachement_batiment_prevu = ajoutDivers_attachement_batiment_prevu ;
        var NouvelItemDivers_attachement_batiment_prevu=false;
        var currentItemDivers_attachement_batiment_prevu;
        vm.selectedItemDivers_attachement_batiment_prevu = {} ;

        vm.allrubrique_attachement_latrine_mpe = [];
        vm.selectedItemRubrique_attachement_latrine_mpe = {};

        vm.ajoutDivers_attachement_latrine_prevu = ajoutDivers_attachement_latrine_prevu ;
        var NouvelItemDivers_attachement_latrine_prevu=false;
        var currentItemDivers_attachement_latrine_prevu;
        vm.selectedItemDivers_attachement_latrine_prevu = {} ;

        vm.allrubrique_attachement_mobilier_mpe = [];
        vm.selectedItemRubrique_attachement_mobilier_mpe = {};

        vm.ajoutDivers_attachement_mobilier_prevu = ajoutDivers_attachement_mobilier_prevu ;
        var NouvelItemDivers_attachement_mobilier_prevu=false;
        var currentItemDivers_attachement_mobilier_prevu;
        vm.selectedItemDivers_attachement_mobilier_prevu = {} ;

        vm.ajoutAvenant_mpe = ajoutAvenant_mpe ;
        var NouvelItemAvenant_mpe=false;
        var currentItemAvenant_mpe;
        vm.selectedItemAvenant_mpe = {};
        vm.allavenant_mpe = [] ;

        vm.showbuttonValidation_avenant_mpe = false;
        vm.permissionboutonvalideravenant_mpe = false;

        vm.ajoutDocument_prestataire_scan = ajoutDocument_prestataire_scan;
        var NouvelItemDocument_prestataire_scan=false;
        var currentItemDocument_prestataire_scan;
        vm.selectedItemDocument_prestataire_scan = {} ;
        vm.alldocument_prestataire_scan = [] ;

        vm.showbuttonValidation_document_prestataire_scan  = false;
        vm.permissionboutonvaliderdocument_prestataire_scan  = false;

        vm.ajoutDocument_moe_scan = ajoutDocument_moe_scan;
        var NouvelItemDocument_moe_scan=false;
        var currentItemDocument_moe_scan;
        vm.selectedItemDocument_moe_scan = {} ;
        vm.alldocument_moe_scan = [] ;

        vm.showbuttonValidation_document_moe_scan  = false;
        vm.permissionboutonvaliderdocument_moe_scan  = false;

       /* vm.ajoutDivers_attachement_batiment_prevu = ajoutDivers_attachement_batiment_prevu;
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
        vm.alldivers_attachement_mobilier_prevu = [] ;*/

        vm.ajoutDelai_travaux = ajoutDelai_travaux ;
        var NouvelItemDelai_travaux=false;
        var currentItemDelai_travaux;
        vm.selectedItemDelai_travaux = {} ;
        vm.alldelai_travaux = [] ;

        vm.permissionboutonvaliderdelai_travaux = false;
        vm.showbuttonValidationdelai_travaux = false;


        vm.ajoutPhase_sous_projet = ajoutPhase_sous_projet ;
        var NouvelItemPhase_sous_projet=false;
        var currentItemPhase_sous_projet;
        vm.selectedItemPhase_sous_projet = {} ;
        vm.allphase_sous_projet = [] ;

        vm.permissionboutonvaliderphase_sous_projet = false;
        vm.showbuttonValidationphase_sous_projet = false;

        vm.ajoutReception_mpe = ajoutReception_mpe ;
        var NouvelItemReception_mpe=false;
        var currentItemReception_mpe;
        vm.selectedItemReception_mpe = {} ;
        vm.allreception_mpe = [] ;

        vm.permissionboutonvaliderreception_mpe = false;
        vm.showbuttonValidationreception_mpe = false;


      /*  vm.ajoutAvancement_batiment = ajoutAvancement_batiment ;
        var NouvelItemAvancement_batiment=false;
        var currentItemAvancement_batiment;
        vm.selectedItemAvancement_batiment = {} ;
        vm.allavancement_batiment = [] ;

        vm.permissionboutonvalideravancement_batiment = false;
        vm.showbuttonValidationavancement_batiment = false;


        vm.ajoutAvancement_latrine = ajoutAvancement_latrine ;
        var NouvelItemAvancement_latrine=false;
        var currentItemAvancement_latrine;
        vm.selectedItemAvancement_latrine = {} ;
        vm.allavancement_latrine = [] ;

        vm.permissionboutonvalideravancement_latrine = false;
        vm.showbuttonValidationavancement_latrine = false;


        vm.ajoutAvancement_mobilier = ajoutAvancement_mobilier ;
        var NouvelItemAvancement_mobilier=false;
        var currentItemAvancement_mobilier;
        vm.selectedItemAvancement_mobilier = {} ;
        vm.allavancement_mobilier = [] ;

        vm.permissionboutonvalideravancement_mobilier = false;
        vm.showbuttonValidationavancement_mobilier = false;*/

       
/********************************************Fin entreprise********************************************/

/********************************************Debut indicateur********************************************/        

        vm.ajoutIndicateur = ajoutIndicateur ;
        var NouvelItemIndicateur=false;
        var currentItemIndicateur;
        vm.selectedItemIndicateur = {} ;
        vm.allindicateur = [] ;

        vm.permissionboutonvaliderindicateur = false;
        vm.showbuttonValidationindicateur = false;

        vm.affiche_load= false;

/********************************************Fin indicateur********************************************/  

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
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
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
                            vm.permissionboutonValidercreer = true;
                                                       
                            vm.permissionboutonvalideravenant_convention = true;
                            vm.permissionboutonvaliderpassation_moe = true;
                            vm.permissionboutonvalidercontrat_moe = true;
                            //vm.showbuttonValidation_avenant_moe = true;

                            vm.permissionboutonvalideravenant_moe = true;

                            vm.permissionboutonvalideravenant_mpe = true;

                            vm.permissionboutonvaliderdocument_prestataire_scan = true;
                            vm.permissionboutonvaliderdocument_moe_scan = true;
                            vm.permissionboutonvaliderdocument_pr_scan = true;
                            vm.permissionboutonvaliderdocument_feffi_scan = true;

                            vm.permissionboutonvaliderpassation = true;

                            vm.permissionboutonvaliderreception_mpe = true;
                            
                            vm.permissionboutonvaliderMemoire_technique = true;
                            vm.permissionboutonvaliderAppel_offre = true;
                            vm.permissionboutonvaliderRapport_mensuel = true;
                            vm.permissionboutonvaliderManuel_gestion = true;
                            vm.permissionboutonvaliderPolice_assurance = true;
                           /* vm.permissionboutonvalideravancement_batiment = true;
                            vm.permissionboutonvalideravancement_latrine = true;
                            vm.permissionboutonvalideravancement_mobilier = true;*/

                            vm.permissionboutonvalidercontrat_prestataire = true;
                            vm.permissionboutonvalidertransfert_reliquat = true;
                            vm.permissionboutonvaliderdelai_travaux = true;

                            vm.permissionboutonvaliderphase_sous_projet = true;

                            vm.permissionboutonvaliderindicateur = true;


                            vm.session = 'BCAF';
                      
                }else
                {
                    vm.permissionboutonValidercreer = true;

                            apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            }, function error(response){ alert('something went wrong')});

                            vm.permissionboutonvalideravenant_convention = true;
                            vm.permissionboutonvaliderpassation_moe = true;
                            vm.permissionboutonvalidercontrat_moe = true;
                            //vm.showbuttonValidation_avenant_moe = true;

                            vm.permissionboutonvalideravenant_moe = true;

                            vm.permissionboutonvalideravenant_mpe = true;

                            vm.permissionboutonvaliderdocument_prestataire_scan = true;
                            vm.permissionboutonvaliderdocument_moe_scan = true;
                            vm.permissionboutonvaliderdocument_pr_scan = true;
                            vm.permissionboutonvaliderdocument_feffi_scan = true;

                            vm.permissionboutonvaliderpassation = true;

                            vm.permissionboutonvaliderreception_mpe = true;
                            
                            vm.permissionboutonvaliderMemoire_technique = true;
                            vm.permissionboutonvaliderAppel_offre = true;
                            vm.permissionboutonvaliderRapport_mensuel = true;
                            vm.permissionboutonvaliderManuel_gestion = true;
                            vm.permissionboutonvaliderPolice_assurance = true;
                           /* vm.permissionboutonvalideravancement_batiment = true;
                            vm.permissionboutonvalideravancement_latrine = true;
                            vm.permissionboutonvalideravancement_mobilier = true;*/

                            vm.permissionboutonvalidercontrat_prestataire = true;
                            vm.permissionboutonvalidertransfert_reliquat = true;
                            vm.permissionboutonvaliderdelai_travaux = true;

                            vm.permissionboutonvaliderphase_sous_projet = true;

                            vm.permissionboutonvaliderindicateur = true;
                            vm.session = 'ADMIN'; 
                }                 

         });

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
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
            vm.affiche_load =true;

            switch (vm.session)
                {
                  case 'BCAF': console.log(vm.usercisco.id);
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
       vm.step_menu_pr =function (item,session)
        {
                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_partenaire_relai = result.data.response;
                        console.log(vm.allcontrat_partenaire_relai);
                });
                vm.styleTabfils = "acc_sous_menu";
        }
       vm.step_menu_moe = function (item,session)
        {            
            vm.stepprestation_moe = false;
            vm.stepdoc_moe=false;
            vm.step_contrat_moe_onglet = false;
            vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches_moe = result.data.response;                 
                    vm.step_contrat_moe_onglet = true;
                    vm.affiche_load = false;               
                }); 
                vm.styleTabfils = "acc_sous_menu";
        }

        vm.step_contrat_moe = function (item,session)
        {
            vm.stepprestation_moe = false;
            vm.stepdoc_moe=false;
            
            vm.showbuttonValidationcontrat_moe = false;  
            vm.stepcalendrier_paie_moe=false;
            vm.sousrubrique_calendrier=false;
            vm.calendrier_prevu=false; 
            vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_moe = result.data.response;
                    vm.affiche_load = false; 
                });
                vm.styleTabfils = "acc_sous_menu";
        }
       vm.step_avenant_feffi= function (item,session)
        {
                    vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu','getavenantByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allavenant_convention = result.data.response; 
                    vm.affiche_load = false;                                  
                });
                            
                //vm.nbr_demande_feffi_creer = item.nbr_demande_feffi_creer; 
        
        }
       vm.step_importerdocument_feffi= function (item,session)
        {
                    vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("dossier_feffi/index",'menu','getdocumentByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.alldocument_feffi_scan = result.data.response;
                    vm.affiche_load = false;                                       
                });
                            
               // vm.nbr_demande_feffi_creer = item.nbr_demande_feffi_creer; 
        
        }
       vm.step_menu_mpe = function (item,session)
        {
                    vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches = result.data.response;
                    console.log(vm.allpassation_marches);
                    vm.affiche_load = false;
                });
                vm.styleTabfils = "acc_sous_menu"; 
        }
       vm.step_contrat_mpe = function (item,session)
        {  
                    vm.affiche_load = true;
                     vm.stepattachement = false;
                     vm.showbuttonValidationcontrat_prestataire = false;
                 apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    vm.affiche_load = false;
                });
                 vm.styleTabfils = "acc_sous_menu"; 
        }

       vm.step_menu_indicateur= function (item,session)
        {
                    vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allindicateur = result.data.response;
                    vm.affiche_load = false;
                }); 
        }
        

   /**********************************************Debut Dossier entreprise***************************************************/
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
            if (item.id_document_feffi_scan!=0)
            {
                vm.showbuttonValidation_document_feffi_scan = true;
            }
            vm.validation_document_feffi_scan = item.validation;

            if(item.$edit==false || item.$edit==undefined)
            {               
                currentItemDocument_feffi_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_feffi_scan)); 
            }
            
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
                    date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
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
                                                      date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
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
                                        date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
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
                                                date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
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
                                  date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
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
        vm.validerDocument_feffi_scan = function()
        {
          maj_in_baseDocument_feffi_scan(vm.selectedItemDocument_feffi_scan,0);
        }

        vm.selectionDocument_feffi_scan_valide= function (item)
        {
            vm.selectedItemDocument_feffi_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_feffi_scan_valide', function()
        {
             if (!vm.alldocument_feffi_scan_valide) return;
             vm.alldocument_feffi_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_feffi_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_feffi_scan
        function maj_in_baseDocument_feffi_scan(document_feffi_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_feffi_scan.id_document_feffi_scan,
                    fichier: document_feffi_scan.fichier,
                    date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                    observation: document_feffi_scan.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    id_document_feffi: document_feffi_scan.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
            {   

              vm.validation_document_feffi_scan = 1;
              document_feffi_scan.validation=1;
              //vm.alldocument_feffi_scan_valide.push(document_feffi_scan);
              vm.selectedItemDocument_feffi_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
       
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
                vm.showbuttonValidation_avenant_convention = true;
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
            item.montant   = parseFloat(vm.selectedItemAvenant_convention.montant) ;
            item.date_signature = new Date( vm.selectedItemAvenant_convention.date_signature );            
            vm.showbuttonValidation_avenant_convention = false;
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
                    date_signature:convertionDate(avenant_convention.date_signature),
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
              vm.showbuttonValidation_avenant_convention = false;
              vm.validation_avenant_convention = 0
              avenant_convention.$selected = false;
              avenant_convention.$edit = false;
              vm.selectedItemAvenant_convention = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerAvenant_convention = function()
        {
          valideravenantinbase(vm.selectedItemAvenant_convention,0,1);
        }
        function valideravenantinbase(avenant_convention,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avenant_convention.id,
                    ref_avenant: avenant_convention.ref_avenant,
                    description: avenant_convention.description,
                    montant: avenant_convention.montant,
                    date_signature:convertionDate(avenant_convention.date_signature),
                    date_signature:convertionDate(avenant_convention.date_signature),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_convention/index",datas, config).success(function (data)
            {
                avenant_convention.validation = validation;
                vm.validation_avenant_convention = validation;
                avenant_convention.$selected = false;
                avenant_convention.$edit = false;
                vm.selectedItemAvenant_convention = {};
                vm.showbuttonValidation_avenant_convention = false;
            
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

           if(item.id!=0)
           {            
              if (item.$selected==false || item.$selected==undefined)
              {
                  vm.showbuttonValidationcontrat_pr = true;
              }
              vm.validation_contrat_pr = item.validation;
              vm.stepprestaion_pr=true;
              vm.stepdoc_pr=true;
              vm.permissionboutonvaliderformdpp = true;
              vm.permissionboutonvaliderformodc = true;
              vm.permissionboutonvaliderformgfpc = true;
              vm.permissionboutonvaliderformemies = true;
              vm.permissionboutonvaliderformpmc = true;
              vm.permissionboutonvaliderformsep = true;

              vm.stepattachement = true;
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
             apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocumentBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.alldocument_pr_scan = result.data.response;                                        
            });
        }

        vm.step_prestation_pr = function()
        {

            apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_dpp = result.data.response;                          
                console.log(vm.allmodule_dpp);
            });
            vm.styleTabfils = "acc_menu";
        }
        vm.step_module_dpp = function()
        {
           apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_dpp = result.data.response;                          
                console.log(vm.allmodule_dpp);
            }); 
        }
        vm.step_module_odc = function()
        {
            apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                 vm.allmodule_odc = result.data.response;                          
                console.log(vm.allmodule_odc);
            });
        }

        vm.step_module_emies = function()
        {
            
            apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_emies = result.data.response;                          
                console.log(vm.allmodule_emies);
            });
        }

        vm.step_module_gfpc = function()
        {
            apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_gfpc = result.data.response;                          
                console.log(vm.allmodule_gfpc);
            });
        }

        vm.step_module_pmc = function()
        {
             apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_pmc = result.data.response;                          
                console.log(vm.allmodule_pmc);
            });
        }

        vm.step_module_sep = function()
        {
            apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
            {
                vm.allmodule_sep = result.data.response;                          
                console.log(vm.allmodule_sep);
            });
        }

       
/*****************************************fin contrat_partenaire_relai********************************************/

/**********************************************Debut Dossier entreprise***************************************************/
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
                    date_elaboration: convertionDate(document_pr_scan.date_elaboration),
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
                                                      date_elaboration: convertionDate(document_pr_scan.date_elaboration),
                                                      observation: document_pr_scan.observation,
                                                      id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
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
                                        date_elaboration: convertionDate(document_pr_scan.date_elaboration),
                                        observation: document_pr_scan.observation,
                                        id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
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
                                                date_elaboration: convertionDate(document_pr_scan.date_elaboration),
                                                observation: document_pr_scan.observation,
                                                id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
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
                                  date_elaboration: convertionDate(document_pr_scan.date_elaboration),
                                  observation: document_pr_scan.observation,
                                  id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
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
        vm.validerDocument_pr_scan = function()
        {
          maj_in_baseDocument_pr_scan(vm.selectedItemDocument_pr_scan,0);
        }

        vm.selectionDocument_pr_scan_valide= function (item)
        {
            vm.selectedItemDocument_pr_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_pr_scan_valide', function()
        {
             if (!vm.alldocument_pr_scan_valide) return;
             vm.alldocument_pr_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_pr_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_pr_scan
        function maj_in_baseDocument_pr_scan(document_pr_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_pr_scan.id_document_pr_scan,
                    fichier: document_pr_scan.fichier,
                    date_elaboration: convertionDate(document_pr_scan.date_elaboration),
                    observation: document_pr_scan.observation,
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    id_document_pr: document_pr_scan.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
            {   

              vm.validation_document_pr_scan = 1;
              document_pr_scan.validation=1;
              //vm.alldocument_pr_scan_valide.push(document_pr_scan);
              vm.selectedItemDocument_pr_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_pr_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier entreprise***********************************************/


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
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_dpp.contrat_partenaire_relai);
            vm.showbuttonValidationformdpp =false;
            vm.stepparticipantdpp=false;
        };

        //fonction bouton suppression item module dpp
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
                    date_previ_resti: convertionDate(module_dpp.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_dpp.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_dpp.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_dpp.date_reel_resti),
                    nbr_previ_parti: module_dpp.nbr_previ_parti,
                    nbr_previ_fem_parti: module_dpp.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_dpp.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_dpp.date_fin_previ_form),
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
              vm.showbuttonValidationformdpp = false;
              vm.stepparticipantdpp=false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_dpp = function()
        {
          valide_insert_in_baseModule_dpp(vm.selectedItemModule_dpp,0);
        }

        function valide_insert_in_baseModule_dpp(module_dpp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };   
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        module_dpp.id,
                    date_previ_resti: convertionDate(module_dpp.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_dpp.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_dpp.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_dpp.date_reel_resti),
                    nbr_previ_parti: module_dpp.nbr_previ_parti,
                    nbr_previ_fem_parti: module_dpp.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_dpp.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_dpp.date_fin_previ_form),
                    id_contrat_partenaire_relai: module_dpp.contrat_partenaire_relai.id,
                    lieu_formation: module_dpp.lieu_formation,
                    observation:module_dpp.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_dpp/index",datas, config).success(function (data)
            {   
                vm.selectedItemModule_dpp.validation = 1;
                vm.showbuttonValidationformdpp = false;
                vm.stepparticipantdpp=false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation dpp**************************************************/

/**********************************debut participant_dpp****************************************/
//col table
        vm.participant_dpp_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

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
            vm.stepparticipantdpp=false;
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
          vm.showbuttonValidation = false;
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
                    date_previ_resti: convertionDate(module_odc.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_odc.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_odc.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_odc.date_reel_resti),
                    nbr_previ_parti: module_odc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_odc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_odc.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_odc.date_fin_previ_form),
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
              vm.showbuttonValidationformodc = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_odc = function()
        {
          valide_insert_in_baseModule_odc(vm.selectedItemModule_odc,0);
        }

        function valide_insert_in_baseModule_odc(module_odc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };   
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        module_odc.id,
                    date_previ_resti: convertionDate(module_odc.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_odc.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_odc.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_odc.date_reel_resti),
                    nbr_previ_parti: module_odc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_odc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_odc.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_odc.date_fin_previ_form),
                    id_contrat_partenaire_relai: module_odc.contrat_partenaire_relai.id,
                    lieu_formation: module_odc.lieu_formation,
                    observation:module_odc.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_odc/index",datas, config).success(function (data)
            {   
                vm.selectedItemModule_odc.validation = 1;
                vm.showbuttonValidationformodc = false;
                vm.stepparticipantodc=false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation odc**************************************************/

/******************************************debut participant_odc****************************************/
//col table
        vm.participant_odc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

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
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_emies.contrat_partenaire_relai);
            vm.showbuttonValidationformemies =false;
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
                    date_previ_resti: convertionDate(module_emies.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_emies.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_emies.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_emies.date_reel_resti),
                    nbr_previ_parti: module_emies.nbr_previ_parti,
                    nbr_previ_fem_parti: module_emies.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_emies.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_emies.date_fin_previ_form),
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

        vm.validerModule_emies = function()
        {
          valide_insert_in_baseModule_emies(vm.selectedItemModule_emies,0);
        }

        function valide_insert_in_baseModule_emies(module_emies,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };   
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        module_emies.id,
                    date_previ_resti: convertionDate(module_emies.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_emies.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_emies.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_emies.date_reel_resti),
                    nbr_previ_parti: module_emies.nbr_previ_parti,
                    nbr_previ_fem_parti: module_emies.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_emies.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_emies.date_fin_previ_form),
                    id_contrat_partenaire_relai: module_emies.contrat_partenaire_relai.id,
                    lieu_formation: module_emies.lieu_formation,
                    observation:module_emies.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_emies/index",datas, config).success(function (data)
            {   
                vm.selectedItemModule_emies.validation = 1;
                vm.showbuttonValidationformemies = false;
                vm.stepparticipantemies=false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation emies**************************************************/

/******************************************debut participant_emies*************************************************/
//col table
        vm.participant_emies_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

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
          vm.showbuttonValidation = false;
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
                    date_previ_resti: convertionDate(module_gfpc.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_gfpc.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_gfpc.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_gfpc.date_reel_resti),
                    nbr_previ_parti: module_gfpc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_gfpc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_gfpc.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_gfpc.date_fin_previ_form),
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

        vm.validerModule_gfpc = function()
        {
          valide_insert_in_baseModule_gfpc(vm.selectedItemModule_gfpc,0);
        }

        function valide_insert_in_baseModule_gfpc(module_gfpc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };   
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        module_gfpc.id,
                    date_previ_resti: convertionDate(module_gfpc.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_gfpc.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_gfpc.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_gfpc.date_reel_resti),
                    nbr_previ_parti: module_gfpc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_gfpc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_gfpc.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_gfpc.date_fin_previ_form),
                    id_contrat_partenaire_relai: module_gfpc.contrat_partenaire_relai.id,
                    lieu_formation: module_gfpc.lieu_formation,
                    observation:module_gfpc.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_gfpc/index",datas, config).success(function (data)
            {   
                vm.selectedItemModule_gfpc.validation = 1;
                vm.showbuttonValidationformgfpc = false;
                vm.stepparticipantgfpc=false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation gfpc**************************************************/

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
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_pmc.contrat_partenaire_relai);
            vm.showbuttonValidationformpmc =false;
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
                    date_previ_resti: convertionDate(module_pmc.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_pmc.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_pmc.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_pmc.date_reel_resti),
                    nbr_previ_parti: module_pmc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_pmc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_pmc.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_pmc.date_fin_previ_form),
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
              vm.showbuttonValidationformpmc = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerModule_pmc = function()
        {
          valide_insert_in_baseModule_pmc(vm.selectedItemModule_pmc,0);
        }

        function valide_insert_in_baseModule_pmc(module_pmc,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };   
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        module_pmc.id,
                    date_previ_resti: convertionDate(module_pmc.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_pmc.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_pmc.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_pmc.date_reel_resti),
                    nbr_previ_parti: module_pmc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_pmc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_pmc.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_pmc.date_fin_previ_form),
                    id_contrat_partenaire_relai: module_pmc.contrat_partenaire_relai.id,
                    lieu_formation: module_pmc.lieu_formation,
                    observation:module_pmc.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_pmc/index",datas, config).success(function (data)
            {   
                vm.selectedItemModule_pmc.validation = 1;
                vm.showbuttonValidationformpmc = false;
                vm.stepparticipantpmc=false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation pmc**************************************************/

/**********************************debut participant_pmc****************************************/
//col table
        vm.participant_pmc_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

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
          vm.showbuttonValidation = false;
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
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_sep.contrat_partenaire_relai);
            vm.showbuttonValidationformsep =false;
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
                    date_previ_resti: convertionDate(module_sep.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_sep.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_sep.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_sep.date_reel_resti),
                    nbr_previ_parti: module_sep.nbr_previ_parti,
                    nbr_previ_fem_parti: module_sep.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_sep.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_sep.date_fin_previ_form),
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

        vm.validerModule_sep = function()
        {
          valide_insert_in_baseModule_sep(vm.selectedItemModule_sep,0);
        }

        function valide_insert_in_baseModule_sep(module_sep,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };   
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        module_sep.id,
                    date_previ_resti: convertionDate(module_sep.date_previ_resti),
                    date_debut_reel_form: convertionDate(module_sep.date_debut_reel_form),
                    date_fin_reel_form: convertionDate(module_sep.date_fin_reel_form),
                    date_reel_resti:convertionDate(module_sep.date_reel_resti),
                    nbr_previ_parti: module_sep.nbr_previ_parti,
                    nbr_previ_fem_parti: module_sep.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(module_sep.date_debut_previ_form),
                    date_fin_previ_form: convertionDate(module_sep.date_fin_previ_form),
                    id_contrat_partenaire_relai: module_sep.contrat_partenaire_relai.id,
                    lieu_formation: module_sep.lieu_formation,
                    observation:module_sep.observation,
                    validation : 1              
                });
                console.log(datas);
                //factory
            apiFactory.add("module_sep/index",datas, config).success(function (data)
            {   
                vm.selectedItemModule_sep.validation = 1;
                vm.showbuttonValidationformsep = false;
                vm.stepparticipantsep=false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*********************************************fin formation sep**************************************************/

/**********************************debut participant_sep****************************************/
//col table
        vm.participant_sep_column = [
        {titre:"Nom"},
        {titre:"Prenom"},
        {titre:"Sexe"},
        {titre:"Occupation"},
        {titre:"Action"}]; 

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

      /**************************************fin passation marchés***************************************************/
       
       vm.clickpassation_marches_moe = function()
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
        },
        {titre:"Action"
        }];
    
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
              vm.showbuttonValidationpassation_moe = true;
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
            item.date_os   = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_os)  ;
            item.date_remise   = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_remise) ;
            item.date_ano_dpfi = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_ano_dpfi);
            item.nbr_offre_recu = parseInt(vm.selectedItemPassation_marches_moe.nbr_offre_recu);
            item.date_lancement_dp = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_lancement_dp) ;
            item.date_signature_contrat   = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_signature_contrat) ;
            item.date_demande_ano_dpfi    = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_rapport_evaluation) ;
            item.notification_intention   = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.notification_intention);
            item.date_notification_attribution  = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_notification_attribution) ;
            item.date_shortlist   = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_shortlist );
            item.date_manifestation   = vm.injectDateinInput(vm.selectedItemPassation_marches_moe.date_manifestation) ;
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
                    date_lancement_dp: convertionDate(passation_marches_moe.date_lancement_dp),
                    date_os: convertionDate(passation_marches_moe.date_os),
                    date_remise: convertionDate(passation_marches_moe.date_remise),
                    nbr_offre_recu: passation_marches_moe.nbr_offre_recu,
                    date_rapport_evaluation:convertionDate(passation_marches_moe.date_rapport_evaluation),
                    date_demande_ano_dpfi: convertionDate(passation_marches_moe.date_demande_ano_dpfi),
                    date_ano_dpfi: convertionDate(passation_marches_moe.date_ano_dpfi),
                    notification_intention: convertionDate(passation_marches_moe.notification_intention),
                    date_notification_attribution: convertionDate(passation_marches_moe.date_notification_attribution),
                    date_signature_contrat: convertionDate(passation_marches_moe.date_signature_contrat),
                    id_bureau_etude: passation_marches_moe.id_bureau_etude,
                    date_shortlist: convertionDate(passation_marches_moe.date_shortlist),
                    date_manifestation: convertionDate(passation_marches_moe.date_manifestation),
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
              vm.showbuttonValidationpassation_moe = false;
              vm.validation_passation_moe = 0;
              passation_marches_moe.validation = 0;
              passation_marches_moe.$selected = false;
              passation_marches_moe.$edit = false;
              vm.selectedItemPassation_marches_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validation_passation_marche_moe = function()
        {
          valide_insert_passation_marche(vm.selectedItemPassation_marches_moe,0);
        }

        function valide_insert_passation_marche(passation_marches_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        passation_marches_moe.id,
                    date_lancement_dp: convertionDate(passation_marches_moe.date_lancement_dp),
                    date_os: convertionDate(passation_marches_moe.date_os),
                    date_remise: convertionDate(passation_marches_moe.date_remise),
                    nbr_offre_recu: passation_marches_moe.nbr_offre_recu,
                    date_rapport_evaluation:convertionDate(passation_marches_moe.date_rapport_evaluation),
                    date_demande_ano_dpfi: convertionDate(passation_marches_moe.date_demande_ano_dpfi),
                    date_ano_dpfi: convertionDate(passation_marches_moe.date_ano_dpfi),
                    notification_intention: convertionDate(passation_marches_moe.notification_intention),
                    date_notification_attribution: convertionDate(passation_marches_moe.date_notification_attribution),
                    date_signature_contrat: convertionDate(passation_marches_moe.date_signature_contrat),
                    id_bureau_etude: passation_marches_moe.id_bureau_etude,
                    date_shortlist: convertionDate(passation_marches_moe.date_shortlist),
                    date_manifestation: convertionDate(passation_marches_moe.date_manifestation),
                    statut: passation_marches_moe.statut,
                    observation:passation_marches_moe.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:1              
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_be/index",datas, config).success(function (data)
            { vm.showbuttonValidationpassation_moe = false;  
              vm.validation_passation_moe = 1;
              passation_marches_moe.validation = 1;  
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

      /**************************************fin contrat moe***************************************************/
        
      //col table
        vm.contrat_moe_column = [
        {titre:"Bureau d'etude"
        },
        {titre:"Intitulé"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date Notification intention"
        },
        {titre:"Date Notification attribution"
        },
        {titre:"Date signature"
        },
        {titre:"Date OS"
        },
        {titre:"Action"
        }];
     
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
            if (item.$selected==false || item.$selected==undefined)
            {
                  vm.showbuttonValidationcontrat_pr = true; 
                currentItemContrat_moe    = JSON.parse(JSON.stringify(vm.selectedItemContrat_moe));   
            }

           if(item.id!=0)
           {
                
            vm.stepdoc_moe=true;
            vm.showbuttonValidationcontrat_moe = true;
            vm.validation_contrat_moe = item.validation;
            vm.stepprestation_moe = true;
            vm.stepcalendrier_paie_moe = true;
            vm.sousrubrique_calendrier= false;
            vm.calendrier_prevu= false;
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
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmemoire_technique = result.data.response; 
                vm.affiche_load = false;                          
            });
            vm.styleTabfils = "acc_menu";
        }

        vm.step_memoire_technique = function()
        {vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmemoire_technique = result.data.response;
                vm.affiche_load = false;                           
            });
        }

        vm.step_appel_offre = function()
        {vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allappel_offre = result.data.response;
                vm.affiche_load = false;                            
            });
        }

        vm.step_rapport_mensuel = function()
        {vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allrapport_mensuel = result.data.response;
                vm.affiche_load = false;                            
            });
        }

        vm.step_manuel_gestion = function()
        {vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmanuel_gestion = result.data.response;
                vm.affiche_load = false;                            
            });
        }

        vm.step_police_assurance = function()
        {vm.affiche_load = true;
             apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                    vm.allpolice_assurance = result.data.response;
                    vm.affiche_load = false;                                                   
            });
        }

        vm.step_avenant_moe = function()
        {vm.affiche_load = true;
             apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allavenant_moe = result.data.response;
                vm.affiche_load = false;
            });
             vm.styleTabfils = "acc_sous_menu";
        }

        vm.step_importerdocument_moe = function()
        {vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocumentBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
             {
                 vm.alldocument_moe_scan = result.data.response;
                 vm.affiche_load = false;                                        
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
            item.montant_contrat   = parseFloat(vm.selectedItemContrat_moe.montant_contrat);           
            item.date_signature = new Date(vm.selectedItemContrat_moe.date_signature) ;           
            item.id_moe = vm.selectedItemContrat_moe.bureau_etude.id ;
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
                    date_signature:convertionDate(contrat_moe.date_signature),
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
            vm.validation_contrat_moe = 0;    
            vm.showbuttonValidationcontrat_moe = false;
              contrat_moe.$selected = false;
              contrat_moe.$edit = false;
              vm.selectedItemContrat_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.valider_contrat_moe = function()
        {
          maj_in_baseContrat_moe(vm.selectedItemContrat_moe,0);
        }
        function maj_in_baseContrat_moe(contrat_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        contrat_moe.id,
                    intitule: contrat_moe.intitule,
                    ref_contrat: contrat_moe.ref_contrat,
                    montant_contrat: contrat_moe.montant_contrat,
                    date_signature:convertionDate(contrat_moe.date_signature),
                    id_bureau_etude:contrat_moe.bureau_etude.id,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 1               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_be/index",datas, config).success(function (data)
            {
              vm.selectedItemContrat_moe.validation=1;
              vm.validation_contrat_moe = 1;
              vm.showbuttonValidationcontrat_moe = false;
              contrat_moe.$selected = false;
              contrat_moe.$edit = false;
             vm.selectedItemContrat_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
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
                //vm.stepattachement_batiment_detail = false;
                //vm.stepattachement_latrine_detail = false;
                //vm.stepattachement_mobilier_detail = false;

                //vm.steprubriquetachement_latrine = true;
                //vm.steprubriquetachement_mobilier = true;

                console.log(vm.allrubrique_calendrier_paie_moe);
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

                console.log(vm.allrubrique_calendrier_paie_moe);
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
                //vm.stepattachement_batiment_detail = false;

                console.log(vm.allcalendrier_paie_moe_prevu);
            });
        }

/************************************************fin rubrique attachement batiment_mpe***************************************************/

       /**********************************************Debut Dossier entreprise***************************************************/
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
            if (item.id_document_moe_scan!=0)
            {
                vm.showbuttonValidation_document_moe_scan = true;
            }
            vm.validation_document_moe_scan = item.validation;
            
            if (item.$edit==false || item.$edit==undefined)
            {
                currentItemDocument_moe_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_moe_scan));
            }
            
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
                    date_elaboration: convertionDate(document_moe_scan.date_elaboration),
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
                                                      date_elaboration: convertionDate(document_moe_scan.date_elaboration),
                                                      observation: document_moe_scan.observation,
                                                      id_contrat_bureau_etude: vm.selectedItemContrat_moe.id ,
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
                                        date_elaboration: convertionDate(document_moe_scan.date_elaboration),
                                        observation: document_moe_scan.observation,
                                        id_contrat_bureau_etude: vm.selectedItemContrat_moe.id ,
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
                          vm.selectedItemDocument_moe_scan.id_document_moe_scan = null;
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
                                                date_elaboration: convertionDate(document_moe_scan.date_elaboration),
                                                observation: document_moe_scan.observation,
                                                id_contrat_bureau_etude: vm.selectedItemContrat_moe.id ,
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
                                  date_elaboration: convertionDate(document_moe_scan.date_elaboration),
                                  observation: document_moe_scan.observation,
                                  id_contrat_bureau_etude: vm.selectedItemContrat_moe.id ,
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
        vm.validerDocument_moe_scan = function()
        {
          maj_in_baseDocument_moe_scan(vm.selectedItemDocument_moe_scan,0);
        }

        vm.selectionDocument_moe_scan_valide= function (item)
        {
            vm.selectedItemDocument_moe_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_moe_scan_valide', function()
        {
             if (!vm.alldocument_moe_scan_valide) return;
             vm.alldocument_moe_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_moe_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_moe_scan
        function maj_in_baseDocument_moe_scan(document_moe_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_moe_scan.id_document_moe_scan,
                    fichier: document_moe_scan.fichier,
                    date_elaboration: convertionDate(document_moe_scan.date_elaboration),
                    observation: document_moe_scan.observation,
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    id_document_moe: document_moe_scan.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
            {   

              vm.validation_document_moe_scan = 1;
              document_moe_scan.validation=1;
              //vm.alldocument_moe_scan_valide.push(document_moe_scan);
              vm.selectedItemDocument_moe_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_moe_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }


    /******************************************debut dossier entreprise***********************************************/

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

            if (item.$edit==false || item.$edit==undefined) 
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
            item.montant   = parseFloat(vm.selectedItemAvenant_moe.montant);
            item.date_signature = new Date( vm.selectedItemAvenant_moe.date_signature);            
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
                    date_signature:convertionDate(avenant_moe.date_signature),
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
              vm.showbuttonValidation_avenant_moe = false;
              vm.validation_avenant_moe = 0
              avenant_moe.$selected = false;
              avenant_moe.$edit = false;
              vm.selectedItemAvenant_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerAvenant_moe = function()
        {
          valideravenantmoeinbase(vm.selectedItemAvenant_moe,0,1);
        }
        function valideravenantmoeinbase(avenant_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avenant_moe.id,
                    description: avenant_moe.description,
                    montant: avenant_moe.montant,
                    ref_avenant: avenant_moe.ref_avenant,
                    date_signature:convertionDate(avenant_moe.date_signature),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_be/index",datas, config).success(function (data)
            {
                avenant_moe.validation = validation;
                vm.validation_avenant_moe = validation;
                avenant_moe.$selected = false;
                avenant_moe.$edit = false;
                vm.selectedItemAvenant_moe = {};
                vm.showbuttonValidation_avenant_moe = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /**********************************************Avenant moe***************************************************/

      /**************************************fin memoire technique***************************************************/
     
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
                    date_livraison: convertionDate(memoire_technique.date_livraison),
                    date_approbation: convertionDate(memoire_technique.date_approbation),
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
              vm.showbuttonValidationMemoire_technique = false;
              //memoire_technique.contrat_be = vm.selectedItemContrat_moe;
              memoire_technique.$selected = false;
              memoire_technique.$edit = false;
              vm.selectedItemMemoire_technique = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerMemoire_technique = function()
        {
          maj_in_baseMemoire_technique(vm.selectedItemMemoire_technique,0);
        }

        $scope.$watch('vm.selectedItemMemoire_technique_valide', function()
        {
             if (!vm.allmemoire_technique_valide) return;
             vm.allmemoire_technique_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMemoire_technique_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd memoire_technique
        function maj_in_baseMemoire_technique(memoire_technique,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        memoire_technique.id,
                    description: memoire_technique.description,
                    //fichier: memoire_technique.fichier,
                    date_livraison: convertionDate(memoire_technique.date_livraison),
                    date_approbation: convertionDate(memoire_technique.date_approbation),
                    observation: memoire_technique.observation,
                    id_contrat_bureau_etude: memoire_technique.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("memoire_technique/index",datas, config).success(function (data)
            {               
              vm.validation_memoire_technique = 1
              vm.selectedItemMemoire_technique.validation= 1;
              vm.selectedItemMemoire_technique = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /**************************************fin memoire technique***************************************************/

      /**************************************Debut appel d'offre*****************************************************/
       
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
                    date_livraison: convertionDate(appel_offre.date_livraison),
                    date_approbation: convertionDate(appel_offre.date_approbation),
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
                  appel_offre.validation = 0;              
                  NouvelItemAppel_offre = false;
                  vm.validation_appel_offre = 0;
                  vm.showbuttonNouvAppel_offre = false;
              }
              vm.showbuttonValidationAppel_offre = false;                    
              appel_offre.$selected = false;
              appel_offre.$edit = false;
              vm.selectedItemAppel_offre = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerAppel_offre = function()
        {
          maj_in_baseAppel_offre(vm.selectedItemAppel_offre,0);
        }

                //insertion ou mise a jours ou suppression item dans bdd appel_offre
        function maj_in_baseAppel_offre(appel_offre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        appel_offre.id,
                    description: appel_offre.description,
                    //fichier: appel_offre.fichier,
                    date_livraison: convertionDate(appel_offre.date_livraison),
                    date_approbation: convertionDate(appel_offre.date_approbation),
                    observation: appel_offre.observation,
                    id_contrat_bureau_etude: appel_offre.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("appel_offre/index",datas, config).success(function (data)
            {   

              vm.validation_appel_offre = 1
              vm.selectedItemAppel_offre.validation= 1;
              vm.selectedItemAppel_offre = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /**************************************Fin appel d'offre*******************************************************/


      /**************************************Debut rapport mensuel***************************************************/
       
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
              currentItemRapport_mensuel    = JSON.parse(JSON.stringify(vm.selectedItemRapport_mensuel));
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
             vm.insererrapport = true;
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
                    date_livraison: convertionDate(rapport_mensuel.date_livraison),
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
              vm.showbuttonValidationRapport_mensuel = false;
              rapport_mensuel.$selected = false;
              rapport_mensuel.$edit = false;
              vm.selectedItemRapport_mensuel = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerRapport_mensuel = function()
        {
          maj_in_baseRapport_mensuel(vm.selectedItemRapport_mensuel,0);
        }

                //insertion ou mise a jours ou suppression item dans bdd rapport_mensuel
        function maj_in_baseRapport_mensuel(rapport_mensuel,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        rapport_mensuel.id,
                    description: rapport_mensuel.description,
                    numero: rapport_mensuel.numero,
                    date_livraison: convertionDate(rapport_mensuel.date_livraison),
                    observation: rapport_mensuel.observation,
                    id_contrat_bureau_etude: rapport_mensuel.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("rapport_mensuel/index",datas, config).success(function (data)
            {   

              vm.validation_rapport_mensuel = 1
              vm.selectedItemRapport_mensuel.validation= 1;
              vm.selectedItemRapport_mensuel = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /**************************************Fin rapport mensuel***************************************************/

      /**************************************Debut manuel gestion***************************************************/
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
                    date_livraison: convertionDate(manuel_gestion.date_livraison),
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
              vm.showbuttonValidationManuel_gestion = false;
              
              manuel_gestion.$selected = false;
              manuel_gestion.$edit = false;
              vm.selectedItemManuel_gestion = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerManuel_gestion = function()
        {
          maj_in_baseManuel_gestion(vm.selectedItemManuel_gestion,0);
        }
                //insertion ou mise a jours ou suppression item dans bdd manuel_gestion
        function maj_in_baseManuel_gestion(manuel_gestion,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        manuel_gestion.id,
                    description: manuel_gestion.description,
                    //fichier: manuel_gestion.fichier,
                    date_livraison: convertionDate(manuel_gestion.date_livraison),
                    observation: manuel_gestion.observation,
                    id_contrat_bureau_etude: manuel_gestion.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("manuel_gestion/index",datas, config).success(function (data)
            {   

              vm.validation_manuel_gestion = 1
              vm.selectedItemManuel_gestion.validation= 1;
              vm.selectedItemManuel_gestion = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

      /**************************************Fin manuel gestion***************************************************/

      /**************************************Fin police d'assurance*************************************************/
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
             vm.showbuttonValidationPolice_assurance = false;
            
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
                    date_expiration: convertionDate(police_assurance.date_expiration),
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
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerPolice_assurance = function()
        {
          maj_in_basePolice_assurance(vm.selectedItemPolice_assurance,0);
        }

        //insertion ou mise a jours ou suppression item dans bdd police_assurance
        function maj_in_basePolice_assurance(police_assurance,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        police_assurance.id,
                    description: police_assurance.description,
                    date_expiration: convertionDate(police_assurance.date_expiration),
                   observation: police_assurance.observation,
                    id_contrat_bureau_etude: police_assurance.contrat_be.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("police_assurance/index",datas, config).success(function (data)
            { 
              vm.validation_police_assurance = 1
              vm.selectedItemPolice_assurance.validation= 1;
              vm.selectedItemPolice_assurance = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /**************************************Debut police d'assurance***********************************************/

   
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
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Observention"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
 
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
            item.date_signature_contrat  = currentItemPassation_marches.date_signature_contrat ;
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
            if (item.$edit == false || item.$edit == undefined)
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
            item.date_os   = vm.injectDateinInput (vm.selectedItemPassation_marches.date_os );
            item.date_remise   = vm.injectDateinInput (vm.selectedItemPassation_marches.date_remise );
            item.date_ano_dpfi = vm.injectDateinInput (vm.selectedItemPassation_marches.date_ano_dpfi);
            item.nbr_offre_recu = vm.selectedItemPassation_marches.nbr_offre_recu;
            item.date_lancement = vm.injectDateinInput (vm.selectedItemPassation_marches.date_lancement) ;
            item.montant_moin_chere = parseFloat(vm.selectedItemPassation_marches.montant_moin_chere)  ;
            item.date_demande_ano_dpfi    = vm.injectDateinInput (vm.selectedItemPassation_marches.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = vm.injectDateinInput (vm.selectedItemPassation_marches.date_rapport_evaluation) ;
            item.notification_intention   = vm.injectDateinInput (vm.selectedItemPassation_marches.notification_intention);
            item.date_notification_attribution  = vm.injectDateinInput (vm.selectedItemPassation_marches.date_notification_attribution) ;
            item.date_signature_contrat  = vm.injectDateinInput (vm.selectedItemPassation_marches.date_signature_contrat) ;
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
                    || (pass[0].date_notification_attribution  != currentItemPassation_marches.date_notification_attribution )
                    || (pass[0].date_signature_contrat  != currentItemPassation_marches.date_signature_contrat ) )                   
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
            console.log(vm.selectedItemPassation_marches);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement: convertionDate(passation_marches.date_lancement),
                    date_os: convertionDate(passation_marches.date_os),
                    date_remise: convertionDate(passation_marches.date_remise),
                    montant_moin_chere:passation_marches.montant_moin_chere,
                    date_rapport_evaluation:convertionDate(passation_marches.date_rapport_evaluation),
                    date_demande_ano_dpfi: convertionDate(passation_marches.date_demande_ano_dpfi),
                    date_ano_dpfi: convertionDate(passation_marches.date_ano_dpfi),
                    notification_intention: convertionDate(passation_marches.notification_intention),
                    date_notification_attribution: convertionDate(passation_marches.date_notification_attribution), 
                    date_signature_contrat: convertionDate(passation_marches.date_signature_contrat),                    
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
              vm.showbuttonValidationpassation = false;
              passation_marches.$selected = false;
              passation_marches.$edit = false;
              vm.selectedItemPassation_marches = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validation_passation_marche_mpe=function()
        {
          validationPassation_marches_mpe(vm.selectedItemPassation_marches,0);
        }

        function validationPassation_marches_mpe(passation_marches,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        passation_marches.id,
                    date_lancement: convertionDate(passation_marches.date_lancement),
                    date_os: convertionDate(passation_marches.date_os),
                    date_remise: convertionDate(passation_marches.date_remise),
                    montant_moin_chere:passation_marches.montant_moin_chere,
                    date_rapport_evaluation:convertionDate(passation_marches.date_rapport_evaluation),
                    date_demande_ano_dpfi: convertionDate(passation_marches.date_demande_ano_dpfi),
                    date_ano_dpfi: convertionDate(passation_marches.date_ano_dpfi),
                    notification_intention: convertionDate(passation_marches.notification_intention),
                    date_notification_attribution: convertionDate(passation_marches.date_notification_attribution),
                    date_signature_contrat: convertionDate(passation_marches.date_signature_contrat),                    
                    observation:passation_marches.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:1,               
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches/index",datas, config).success(function (data)
            { 
              vm.selectedItemPassation_marches.validation = 1;
              vm.validation_passation = 1;  
              vm.showbuttonValidationpassation = false;
              passation_marches.$selected = false;
              passation_marches.$edit = false;
              vm.selectedItemPassation_marches = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches****************************************/

/**********************************debut sousmissionnaire****************************************/
        vm.stepmpe_soumissionaire = function()
        {
            vm.styleTabfils = "acc_sous_menu";
        }
    vm.mpe_soumissionaire_column = [
        {titre:"MPE sousmissionnaire"
        },
        {titre:"Telephone"
        },
        {titre:"Siège"
        },
        {titre:"Action"
        }];

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

/**********************************debut contrat prestataire****************************************/
        
//col table
        vm.contrat_prestataire_column = [
        {titre:"Nom entreprise"
        },
        {titre:"Intitulé"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
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
            item.montant_total_ttc = currentItemContrat_prestataire.montant_total_ttc ;
            item.montant_total_ht = currentItemContrat_prestataire.montant_total_ht;
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
            //vm.nouvelItemContrat_prestataire   = item;
            

           if(item.$edit==false || item.$edit==undefined)
           {
                currentItemContrat_prestataire    = JSON.parse(JSON.stringify(vm.selectedItemContrat_prestataire)); 
           } 
            vm.validation_contrat_prestataire = item.validation; 
            vm.stepattachement = true;
            vm.showbuttonValidationcontrat_prestataire = true;
            vm.stepsuiviexecution = true;
            vm.stepavenant_mpe = true;
            vm.stepattachement=true;  
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

        vm.step_suivitravaux = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldelai_travaux = result.data.response; 
                vm.affiche_load = false;                             
            });
            vm.styleTabfils = "acc_menu";
        }
        vm.step_delai_execution = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldelai_travaux = result.data.response;
                vm.affiche_load = false;                              
            });
        }
        vm.step_reception_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allreception_mpe = result.data.response; 
                vm.affiche_load = false;                             
            });
        }

        vm.step_avenant_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavenant_mpe = result.data.response;
                vm.affiche_load = false;
            });
            vm.styleTabfils = "acc_sous_menu";
        }
        vm.step_importerdocument_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocumentBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldocument_prestataire_scan = result.data.response; 
                vm.affiche_load = false;                                       
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
            item.cout_batiment   = parseFloat(vm.selectedItemContrat_prestataire.cout_batiment);
            item.cout_latrine = parseFloat(vm.selectedItemContrat_prestataire.cout_latrine);
            item.cout_mobilier = parseFloat(vm.selectedItemContrat_prestataire.cout_mobilier);
            item.date_signature = new Date(vm.selectedItemContrat_prestataire.date_signature) ;
            item.id_prestataire = vm.selectedItemContrat_prestataire.prestataire.id ;
            item.montant_total_ttc = parseFloat(vm.selectedItemContrat_prestataire.montant_total_ttc);
            item.montant_total_ht = parseFloat(vm.selectedItemContrat_prestataire.montant_total_ht);
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
                    date_signature:convertionDate(contrat_prestataire.date_signature),
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
        vm.valider_contrat_prestataire = function()
        {   
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_prevu/index",'menu','getmontant_total_prevubycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                var montant_total_prevu = result.data.response;
                var difference_contrat_atta = parseFloat(vm.selectedItemContrat_prestataire.montant_total_ht)-parseFloat(montant_total_prevu[0].montant_total_prevu);
                
                if (difference_contrat_atta<0)
                {
                    var diff = difference_contrat_atta * (-1);
                    if (diff >0.9999999)
                    {
                        var confirm = $mdDialog.confirm()
                                    .title('Montant attachement et contrat differant')
                                    .textContent('batiment:'+parseFloat(montant_total_prevu[0].montant_bat_prevu)+'latrine:'+parseFloat(montant_total_prevu[0].montant_lat_prevu)+'mobilier:'+parseFloat(montant_total_prevu[0].montant_mob_prevu)+'Total:'+parseFloat(montant_total_prevu[0].montant_total_prevu))
                                    .ariaLabel('Lucky day')
                                    .clickOutsideToClose(true)
                                    .parent(angular.element(document.body))
                                    .ok('ok')
                              $mdDialog.show(confirm).then(function() {
                              }, function() {
                                //alert('rien');
                              });
                    }
                    else
                    {
                        maj_in_baseContrat_prestataire(vm.selectedItemContrat_prestataire,0);
                    }
                }
                else
                {
                    if (difference_contrat_atta >0.9999999)
                    {
                        var confirm = $mdDialog.confirm()
                                    .title('Montant attachement et contrat differant')
                                    .textContent('batiment:'+parseFloat(montant_total_prevu[0].montant_bat_prevu)+'latrine:'+parseFloat(montant_total_prevu[0].montant_lat_prevu)+'mobilier:'+parseFloat(montant_total_prevu[0].montant_mob_prevu)+'Total:'+parseFloat(montant_total_prevu[0].montant_total_prevu))
                                    .ariaLabel('Lucky day')
                                    .clickOutsideToClose(true)
                                    .parent(angular.element(document.body))
                                    .ok('ok')
                              $mdDialog.show(confirm).then(function() {
                              }, function() {
                                //alert('rien');
                              });
                    }
                    else
                    {
                        maj_in_baseContrat_prestataire(vm.selectedItemContrat_prestataire,0);
                    }
                }
                
            });
          
        }
        function maj_in_baseContrat_prestataire(contrat_prestataire,suppression)
        {//add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };

            var datas = $.param({
                    supprimer: suppression,
                    id:        contrat_prestataire.id,
                    description: contrat_prestataire.description,
                    num_contrat: contrat_prestataire.num_contrat,
                    cout_batiment: contrat_prestataire.cout_batiment,
                    cout_latrine: contrat_prestataire.cout_latrine,
                    cout_mobilier:contrat_prestataire.cout_mobilier,
                    date_signature:convertionDate(contrat_prestataire.date_signature),
                    id_prestataire:contrat_prestataire.prestataire.id,
                    paiement_recu: 0,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 1               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_prestataire/index",datas, config).success(function (data)
            {                   
              vm.selectedItemContrat_prestataire.validation = 1;
              vm.validation_contrat_prestataire = 1;    
              vm.showbuttonValidationcontrat_prestataire = false;
              contrat_prestataire.$selected = false;
              contrat_prestataire.$edit = false;
              vm.selectedItemContrat_prestataire = {};
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
         vm.change_montant_mpe= function(item)
        {
            item.montant_total_ttc = parseFloat(item.cout_batiment) + parseFloat(item.cout_latrine) + parseFloat(item.cout_mobilier);
            item.montant_total_ht = (parseFloat(item.cout_batiment) + parseFloat(item.cout_latrine) + parseFloat(item.cout_mobilier))/1;
        }
/**********************************fin contrat_prestataire****************************************/

        vm.step_attachement_prevu = function()
        {

            /*apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index",'menu','getdivers_attachement_batiment_prevu','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_type_batiment',vm.batiment_constructions[0].type_batiment.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_prevu = result.data.response;       
            });*/

                vm.steprubriquetachement_latrine = false;
                vm.steprubriquetachement_mobilier = false;
                vm.affiche_load = true;
             apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index","menu","getrubrique_attachement_withmontant_prevu","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {   
                vm.allrubrique_attachement_batiment_mpe= result.data.response;
                vm.stepattachement_batiment_detail = false;
                vm.stepattachement_latrine_detail = false;
                vm.stepattachement_mobilier_detail = false;

                vm.steprubriquetachement_latrine = true;
                vm.steprubriquetachement_mobilier = true;
                vm.affiche_load = false;

                console.log(vm.allrubrique_attachement_batiment_mpe);
            });
            vm.styleTabfils = "acc_menu";
        }
/************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.rubrique_attachement_batiment_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        }];

        vm.click_rubrique_attachement_batiment_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index","menu","getrubrique_attachement_withmontant_prevu","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {   
                vm.allrubrique_attachement_batiment_mpe= result.data.response;
                vm.stepattachement_batiment_detail = false;
                vm.affiche_load = false;

                console.log(vm.allrubrique_attachement_batiment_mpe);
            });
        }
 //fonction selection item rubrique attachement batiment mpe
        vm.selectionRubrique_attachement_batiment_mpe= function (item)
        {
            vm.selectedItemRubrique_attachement_batiment_mpe = item;
            vm.stepattachement_batiment_detail = true;
            
        };

        $scope.$watch('vm.selectedItemRubrique_attachement_batiment_mpe', function()
        {
             if (!vm.allrubrique_attachement_batiment_mpe) return;
             vm.allrubrique_attachement_batiment_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRubrique_attachement_batiment_mpe.$selected = true;
        });

        vm.Total_prevu = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
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

/**********************************************debut attachement batiment travauxe***************************************************/
        vm.click_tab_attachement_batiment_prevu = function()
        {
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_prevu/index","menu","getattachement_batiment_prevuwithdetailbyrubrique",
                    "id_attachement_batiment",vm.selectedItemRubrique_attachement_batiment_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_prevu = result.data.response;
                vm.affiche_load = false;
                console.log(vm.alldivers_attachement_batiment_prevu);
            });
           /* apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_prevu/index","menu","getdivers_attachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_prevu= result.data.response;
            console.log(vm.alldivers_attachement_batiment_prevu);
            });*/
        }


        vm.attachement_batiment_prevu_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Unite"
        },
        {titre:"Quantite prévu"
        },
        {titre:"Prix unitaire"
        },
        {titre:"Montant prévu"
        },
        {titre:"Action"
        }];
        vm.ajouterDivers_attachement_batiment_prevu = function ()
        {
          var items = {
                $edit: true,
                $selected: true,
                id: 0,
                unite:'',
                quantite_prevu  : 0,
                prix_unitaire  : 0,
                montant_prevu  : 0 , 
                id_attachement_batiment_detail : 0
            };

        if (NouvelItemDivers_attachement_batiment_prevu == false)
          {                      
            vm.alldivers_attachement_batiment_prevu.push(items);
            vm.alldivers_attachement_batiment_prevu.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemDivers_attachement_batiment_prevu = cis;
              }
            });
            NouvelItemDivers_attachement_batiment_prevu = true;
            if (vm.alldivers_attachement_batiment_prevu.length>1)
                {console.log(vm.alldivers_attachement_batiment_prevu);
                   // vm.alldivers_attachement_batiment_prevu = vm.alldivers_attachement_batiment_prevus;
                   vm.alldivers_attachement_batiment_prevu.forEach(function(cis)
                    {   if (cis.id!=0) 
                        {
                           vm.alldivers_attachement_batiment_prevu = vm.alldivers_attachement_batiment_prevu.filter(function(obj)
                            {   
                               return obj.id != cis.attachement_batiment_prevu.id;
                            }); 
                        }
                         
                    }); 
                }
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

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

            item.unite   = currentItemDivers_attachement_batiment_prevu.unite ;
            item.quantite_prevu = currentItemDivers_attachement_batiment_prevu.quantite_prevu ;
            item.prix_unitaire     = currentItemDivers_attachement_batiment_prevu.prix_unitaire ;                
            item.montant_prevu      = currentItemDivers_attachement_batiment_prevu.montant_prevu ;
            //item.id_attachement_batiment_detail   = currentItemDivers_attachement_batiment_prevu.id_attachement_batiment_detail ;
          }else
          {
            item.unite   = '' ;
            item.quantite_prevu = '' ;
            item.prix_unitaire     = '' ;                
            item.montant_prevu      = '' ;                
            //item.id      = 0 ;
          }

          vm.selectedItemDivers_attachement_batiment_prevu = {} ;
          NouvelItemDivers_attachement_batiment_prevu      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDivers_attachement_batiment_prevu= function (item)
        {
            vm.selectedItemDivers_attachement_batiment_prevu = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemDivers_attachement_batiment_prevu    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_batiment_prevu));             
            }
            
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
            if (item.id==0)
            {   
                NouvelItemDivers_attachement_batiment_prevu = true ;

                item.quantite_prevu   = parseFloat(vm.selectedItemDivers_attachement_batiment_prevu.quantite_prevu) ;
                item.prix_unitaire = parseFloat(vm.selectedItemDivers_attachement_batiment_prevu.prix_unitaire) ;
                item.unite     = vm.selectedItemDivers_attachement_batiment_prevu.unite;

                item.montant_prevu      = parseFloat(vm.selectedItemDivers_attachement_batiment_prevu.montant_prevu) ;
                //item.id_attachement_batiment_detail = vm.selectedItemDivers_attachement_batiment_prevu.id_attachement_batiment_detail;
            }
            else
            {   
                NouvelItemDivers_attachement_batiment_prevu = false ;

                item.quantite_prevu   = parseFloat(vm.selectedItemDivers_attachement_batiment_prevu.quantite_prevu) ;
                item.prix_unitaire = parseFloat(vm.selectedItemDivers_attachement_batiment_prevu.prix_unitaire) ;
                item.unite     = vm.selectedItemDivers_attachement_batiment_prevu.unite;

                item.montant_prevu      = parseFloat(vm.selectedItemDivers_attachement_batiment_prevu.montant_prevu) ;
               

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
                   if((mem[0].quantite_prevu != currentItemDivers_attachement_batiment_prevu.quantite_prevu )
                    ||(mem[0].unite != currentItemDivers_attachement_batiment_prevu.unite )
                    ||(mem[0].montant_prevu != currentItemDivers_attachement_batiment_prevu.montant_prevu )
                    ||(mem[0].prix_unitaire != currentItemDivers_attachement_batiment_prevu.prix_unitaire ))                   
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
                getId = vm.selectedItemDivers_attachement_batiment_prevu.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    quantite_prevu: divers_attachement_batiment_prevu.quantite_prevu,
                    prix_unitaire: divers_attachement_batiment_prevu.prix_unitaire,
                    unite: divers_attachement_batiment_prevu.unite,
                    montant_prevu: divers_attachement_batiment_prevu.montant_prevu,                    
                    id_attachement_batiment_detail: divers_attachement_batiment_prevu.id_attachement_batiment_detail,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id           
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
                        //vm.selectedItemDivers_attachement_batiment_prevu.attachement_batiment_prevu  = bat_prevu[0];
                        vm.selectedItemDivers_attachement_batiment_prevu.$selected  = false;
                        vm.selectedItemDivers_attachement_batiment_prevu.$edit      = false;
                        vm.selectedItemDivers_attachement_batiment_prevu ={};
                        vm.showbuttonValidation = false;
                        var cout_batiment =parseFloat(vm.selectedItemContrat_prestataire.cout_batiment) + parseFloat(divers_attachement_batiment_prevu.montant_prevu)-parseFloat(currentItemDivers_attachement_batiment_prevu.montant_prevu);                        
                        maj_insertion_contrat_in_base(cout_batiment);
                    }
                    else 
                    {                                                
                        /*vm.alldivers_attachement_batiment_prevu = vm.alldivers_attachement_batiment_prevu.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDivers_attachement_batiment_prevu.id;
                      });*/ 

                        var cout_batiment =parseFloat(vm.selectedItemContrat_prestataire.cout_batiment) - parseFloat(currentItemDivers_attachement_batiment_prevu.montant_prevu);                        
                        maj_insertion_contrat_in_base(cout_batiment); 
                        vm.selectedItemDivers_attachement_batiment_prevu.unite   = '' ;
                        vm.selectedItemDivers_attachement_batiment_prevu.quantite_prevu = '' ;
                        vm.selectedItemDivers_attachement_batiment_prevu.prix_unitaire     = '' ;                
                        vm.selectedItemDivers_attachement_batiment_prevu.montant_prevu      = '' ;                
                        vm.selectedItemDivers_attachement_batiment_prevu.id      = 0 ;                    
                    }
              }
              else
              {
                  divers_attachement_batiment_prevu.id  =   String(data.response);              
                  NouvelItemDivers_attachement_batiment_prevu = false;
                  var cout_batiment =parseFloat(vm.selectedItemContrat_prestataire.cout_batiment) + parseFloat(divers_attachement_batiment_prevu.montant_prevu);
                  
                  maj_insertion_contrat_in_base(cout_batiment);

              }

              divers_attachement_batiment_prevu.$selected = false;
              divers_attachement_batiment_prevu.$edit = false;
              vm.selectedItemDivers_attachement_batiment_prevu ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.change_quantite_prix= function(item) 
        {
            
            item.montant_prevu=parseFloat(item.quantite_prevu)*parseFloat(item.prix_unitaire);                    
          
        }
        //insertion ou mise a jours ou suppression item dans bdd feffi
        function maj_insertion_contrat_in_base(cout_batiment)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemContrat_prestataire.id,
                    description: vm.selectedItemContrat_prestataire.description,
                    num_contrat: vm.selectedItemContrat_prestataire.num_contrat,
                    cout_batiment: cout_batiment,
                    cout_latrine: vm.selectedItemContrat_prestataire.cout_latrine,
                    cout_mobilier:vm.selectedItemContrat_prestataire.cout_mobilier,
                    date_signature:vm.selectedItemContrat_prestataire.date_signature,
                    id_prestataire:vm.selectedItemContrat_prestataire.prestataire.id,
                    paiement_recu: 0,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_prestataire/index",datas, config).success(function (data)
            {   
                vm.selectedItemContrat_prestataire.cout_batiment = cout_batiment;
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        //insertion ou mise a jours ou suppression item dans bdd feffi
        function maj_insertion_contrat_in_base_latrine(cout_latrine)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemContrat_prestataire.id,
                    description: vm.selectedItemContrat_prestataire.description,
                    num_contrat: vm.selectedItemContrat_prestataire.num_contrat,
                    cout_batiment: vm.selectedItemContrat_prestataire.cout_batiment,
                    cout_latrine: cout_latrine,
                    cout_mobilier:vm.selectedItemContrat_prestataire.cout_mobilier,
                    date_signature:vm.selectedItemContrat_prestataire.date_signature,
                    id_prestataire:vm.selectedItemContrat_prestataire.prestataire.id,
                    paiement_recu: 0,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_prestataire/index",datas, config).success(function (data)
            {   
                vm.selectedItemContrat_prestataire.cout_latrine = cout_latrine;
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function maj_insertion_contrat_in_base_mobilier(cout_mobilier)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemContrat_prestataire.id,
                    description: vm.selectedItemContrat_prestataire.description,
                    num_contrat: vm.selectedItemContrat_prestataire.num_contrat,
                    cout_batiment: vm.selectedItemContrat_prestataire.cout_batiment,
                    cout_latrine: vm.selectedItemContrat_prestataire.cout_latrine,
                    cout_mobilier: cout_mobilier,
                    date_signature:vm.selectedItemContrat_prestataire.date_signature,
                    id_prestataire:vm.selectedItemContrat_prestataire.prestataire.id,
                    paiement_recu: 0,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation : 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("contrat_prestataire/index",datas, config).success(function (data)
            {   
                vm.selectedItemContrat_prestataire.cout_mobilier = cout_mobilier;
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

    /******************************************fin attachement batiment travaux***********************************************/
 

 /************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.rubrique_attachement_latrine_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        }];

        vm.click_rubrique_attachement_latrine_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine/index","menu","getrubrique_attachement_withmontant_prevu","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {   
                vm.allrubrique_attachement_latrine_mpe= result.data.response;
                vm.stepattachement_latrine_detail = false;
                vm.affiche_load = false;
                console.log(vm.allrubrique_attachement_latrine_mpe);
            });
        }
 //fonction selection item rubrique attachement latrine mpe
        vm.selectionRubrique_attachement_latrine_mpe= function (item)
        {
            vm.selectedItemRubrique_attachement_latrine_mpe = item;
            vm.stepattachement_latrine_detail = true;
            
        };

        $scope.$watch('vm.selectedItemRubrique_attachement_latrine_mpe', function()
        {
             if (!vm.allrubrique_attachement_latrine_mpe) return;
             vm.allrubrique_attachement_latrine_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRubrique_attachement_latrine_mpe.$selected = true;
        });

        vm.Total_prevu_latrine = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
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

/************************************************fin rubrique attachement latrine_mpe***************************************************/

/**********************************************debut attachement latrine travauxe***************************************************/
        vm.click_tab_attachement_latrine_prevu = function()
        {
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_prevu/index","menu","getattachement_latrine_prevuwithdetailbyrubrique",
                    "id_attachement_latrine",vm.selectedItemRubrique_attachement_latrine_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_prevu = result.data.response;
                vm.affiche_load = false;
                console.log(vm.alldivers_attachement_latrine_prevu);
            });
           /* apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_prevu/index","menu","getdivers_attachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_prevu= result.data.response;
            console.log(vm.alldivers_attachement_latrine_prevu);
            });*/
        }


        vm.attachement_latrine_prevu_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Unite"
        },
        {titre:"Quantite prévu"
        },
        {titre:"Prix unitaire"
        },
        {titre:"Montant prévu"
        },
        {titre:"Action"
        }];
        vm.ajouterDivers_attachement_latrine_prevu = function ()
        {
          var items = {
                $edit: true,
                $selected: true,
                id: 0,
                unite:'',
                quantite_prevu  : 0,
                prix_unitaire  : 0,
                montant_prevu  : 0 , 
                id_attachement_latrine_detail : 0
            };

        if (NouvelItemDivers_attachement_latrine_prevu == false)
          {                      
            vm.alldivers_attachement_latrine_prevu.push(items);
            vm.alldivers_attachement_latrine_prevu.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemDivers_attachement_latrine_prevu = cis;
              }
            });
            NouvelItemDivers_attachement_latrine_prevu = true;
            if (vm.alldivers_attachement_latrine_prevu.length>1)
                {console.log(vm.alldivers_attachement_latrine_prevu);
                   // vm.alldivers_attachement_latrine_prevu = vm.alldivers_attachement_latrine_prevus;
                   vm.alldivers_attachement_latrine_prevu.forEach(function(cis)
                    {   if (cis.id!=0) 
                        {
                           vm.alldivers_attachement_latrine_prevu = vm.alldivers_attachement_latrine_prevu.filter(function(obj)
                            {   
                               return obj.id != cis.attachement_latrine_prevu.id;
                            }); 
                        }
                         
                    }); 
                }
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

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

            item.unite   = currentItemDivers_attachement_latrine_prevu.unite ;
            item.quantite_prevu = currentItemDivers_attachement_latrine_prevu.quantite_prevu ;
            item.prix_unitaire     = currentItemDivers_attachement_latrine_prevu.prix_unitaire ;                
            item.montant_prevu      = currentItemDivers_attachement_latrine_prevu.montant_prevu ;
            //item.id_attachement_latrine_detail   = currentItemDivers_attachement_latrine_prevu.id_attachement_latrine_detail ;
          }else
          {
            item.unite   = '' ;
            item.quantite_prevu = '' ;
            item.prix_unitaire     = '' ;                
            item.montant_prevu      = '' ;                
            //item.id      = 0 ;
          }

          vm.selectedItemDivers_attachement_latrine_prevu = {} ;
          NouvelItemDivers_attachement_latrine_prevu      = false;
          
        };

        //fonction selection item justificatif latrine
        vm.selectionDivers_attachement_latrine_prevu= function (item)
        {
            vm.selectedItemDivers_attachement_latrine_prevu = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemDivers_attachement_latrine_prevu    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_latrine_prevu));             
            }
            
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
            if (item.id==0)
            {   
                NouvelItemDivers_attachement_latrine_prevu = true ;

                item.quantite_prevu   = parseFloat(vm.selectedItemDivers_attachement_latrine_prevu.quantite_prevu) ;
                item.prix_unitaire = parseFloat(vm.selectedItemDivers_attachement_latrine_prevu.prix_unitaire) ;
                item.unite     = vm.selectedItemDivers_attachement_latrine_prevu.unite;

                item.montant_prevu      = parseFloat(vm.selectedItemDivers_attachement_latrine_prevu.montant_prevu) ;
                //item.id_attachement_latrine_detail = vm.selectedItemDivers_attachement_latrine_prevu.id_attachement_latrine_detail;
            }
            else
            {   
                NouvelItemDivers_attachement_latrine_prevu = false ;

                item.quantite_prevu   = parseFloat(vm.selectedItemDivers_attachement_latrine_prevu.quantite_prevu) ;
                item.prix_unitaire = parseFloat(vm.selectedItemDivers_attachement_latrine_prevu.prix_unitaire) ;
                item.unite     = vm.selectedItemDivers_attachement_latrine_prevu.unite;

                item.montant_prevu      = parseFloat(vm.selectedItemDivers_attachement_latrine_prevu.montant_prevu) ;
               

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
                   if((mem[0].quantite_prevu != currentItemDivers_attachement_latrine_prevu.quantite_prevu )
                    ||(mem[0].unite != currentItemDivers_attachement_latrine_prevu.unite )
                    ||(mem[0].montant_prevu != currentItemDivers_attachement_latrine_prevu.montant_prevu )
                    ||(mem[0].prix_unitaire != currentItemDivers_attachement_latrine_prevu.prix_unitaire ))                   
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
                getId = vm.selectedItemDivers_attachement_latrine_prevu.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    quantite_prevu: divers_attachement_latrine_prevu.quantite_prevu,
                    prix_unitaire: divers_attachement_latrine_prevu.prix_unitaire,
                    unite: divers_attachement_latrine_prevu.unite,
                    montant_prevu: divers_attachement_latrine_prevu.montant_prevu,                    
                    id_attachement_latrine_detail: divers_attachement_latrine_prevu.id_attachement_latrine_detail,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id           
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
                        //vm.selectedItemDivers_attachement_latrine_prevu.attachement_latrine_prevu  = bat_prevu[0];
                        
                        var cout_latrine =parseFloat(vm.selectedItemContrat_prestataire.cout_latrine) + parseFloat(divers_attachement_latrine_prevu.montant_prevu)-parseFloat(currentItemDivers_attachement_latrine_prevu.montant_prevu);                        
                        maj_insertion_contrat_in_base_latrine(cout_latrine);
                        vm.selectedItemDivers_attachement_latrine_prevu.$selected  = false;
                        vm.selectedItemDivers_attachement_latrine_prevu.$edit      = false;
                        vm.selectedItemDivers_attachement_latrine_prevu ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        /*vm.alldivers_attachement_latrine_prevu = vm.alldivers_attachement_latrine_prevu.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDivers_attachement_latrine_prevu.id;
                      });*/ 

                        var cout_latrine =parseFloat(vm.selectedItemContrat_prestataire.cout_latrine) - parseFloat(currentItemDivers_attachement_latrine_prevu.montant_prevu);                       
                        maj_insertion_contrat_in_base_latrine(cout_latrine);
                        vm.selectedItemDivers_attachement_latrine_prevu.unite   = '' ;
                        vm.selectedItemDivers_attachement_latrine_prevu.quantite_prevu = '' ;
                        vm.selectedItemDivers_attachement_latrine_prevu.prix_unitaire     = '' ;                
                        vm.selectedItemDivers_attachement_latrine_prevu.montant_prevu      = '' ;                
                        vm.selectedItemDivers_attachement_latrine_prevu.id      = 0 ;                    
                    }
              }
              else
              {
                  divers_attachement_latrine_prevu.id  =   String(data.response);              
                  NouvelItemDivers_attachement_latrine_prevu = false;
                  var cout_latrine =parseFloat(vm.selectedItemContrat_prestataire.cout_latrine) + parseFloat(divers_attachement_latrine_prevu.montant_prevu);
                  maj_insertion_contrat_in_base_latrine(cout_latrine);

              }

              divers_attachement_latrine_prevu.$selected = false;
              divers_attachement_latrine_prevu.$edit = false;
              vm.selectedItemDivers_attachement_latrine_prevu ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.change_quantite_prix_latrine= function(item) 
        {
            
            item.montant_prevu=parseFloat(item.quantite_prevu)*parseFloat(item.prix_unitaire);                    
          
        }

    /******************************************fin attachement latrine travaux***********************************************/
 


 /************************************************Debut rubrique attachement mobilier_mpe***************************************************/
       
        vm.rubrique_attachement_mobilier_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        }];

        vm.click_rubrique_attachement_mobilier_mpe = function()
        {   vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier/index","menu","getrubrique_attachement_withmontant_prevu","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {   
                vm.allrubrique_attachement_mobilier_mpe= result.data.response;
                vm.stepattachement_mobilier_detail = false;
                vm.affiche_load = false;
                console.log(vm.allrubrique_attachement_mobilier_mpe);
            });
        }
 //fonction selection item rubrique attachement mobilier mpe
        vm.selectionRubrique_attachement_mobilier_mpe= function (item)
        {
            vm.selectedItemRubrique_attachement_mobilier_mpe = item;
            vm.stepattachement_mobilier_detail = true;
            
        };

        $scope.$watch('vm.selectedItemRubrique_attachement_mobilier_mpe', function()
        {
             if (!vm.allrubrique_attachement_mobilier_mpe) return;
             vm.allrubrique_attachement_mobilier_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemRubrique_attachement_mobilier_mpe.$selected = true;
        });

        vm.Total_prevu_mobilier = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
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

/************************************************fin rubrique attachement mobilier_mpe***************************************************/

/**********************************************debut attachement mobilier travauxe***************************************************/
        vm.click_tab_attachement_mobilier_prevu = function()
        {
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_prevu/index","menu","getattachement_mobilier_prevuwithdetailbyrubrique",
                    "id_attachement_mobilier",vm.selectedItemRubrique_attachement_mobilier_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_prevu = result.data.response;
                vm.affiche_load = false;
                console.log(vm.alldivers_attachement_mobilier_prevu);
            });
           /* apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_prevu/index","menu","getdivers_attachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_prevu= result.data.response;
            console.log(vm.alldivers_attachement_mobilier_prevu);
            });*/
        }


        vm.attachement_mobilier_prevu_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Unite"
        },
        {titre:"Quantite prévu"
        },
        {titre:"Prix unitaire"
        },
        {titre:"Montant prévu"
        },
        {titre:"Action"
        }];
        vm.ajouterDivers_attachement_mobilier_prevu = function ()
        {
          var items = {
                $edit: true,
                $selected: true,
                id: 0,
                unite:'',
                quantite_prevu  : 0,
                prix_unitaire  : 0,
                montant_prevu  : 0 , 
                id_attachement_mobilier_detail : 0
            };

        if (NouvelItemDivers_attachement_mobilier_prevu == false)
          {                      
            vm.alldivers_attachement_mobilier_prevu.push(items);
            vm.alldivers_attachement_mobilier_prevu.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemDivers_attachement_mobilier_prevu = cis;
              }
            });
            NouvelItemDivers_attachement_mobilier_prevu = true;
            if (vm.alldivers_attachement_mobilier_prevu.length>1)
                {console.log(vm.alldivers_attachement_mobilier_prevu);
                   // vm.alldivers_attachement_mobilier_prevu = vm.alldivers_attachement_mobilier_prevus;
                   vm.alldivers_attachement_mobilier_prevu.forEach(function(cis)
                    {   if (cis.id!=0) 
                        {
                           vm.alldivers_attachement_mobilier_prevu = vm.alldivers_attachement_mobilier_prevu.filter(function(obj)
                            {   
                               return obj.id != cis.attachement_mobilier_prevu.id;
                            }); 
                        }
                         
                    }); 
                }
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

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

            item.unite   = currentItemDivers_attachement_mobilier_prevu.unite ;
            item.quantite_prevu = currentItemDivers_attachement_mobilier_prevu.quantite_prevu ;
            item.prix_unitaire     = currentItemDivers_attachement_mobilier_prevu.prix_unitaire ;                
            item.montant_prevu      = currentItemDivers_attachement_mobilier_prevu.montant_prevu ;
            //item.id_attachement_mobilier_detail   = currentItemDivers_attachement_mobilier_prevu.id_attachement_mobilier_detail ;
          }else
          {
            item.unite   = '' ;
            item.quantite_prevu = '' ;
            item.prix_unitaire     = '' ;                
            item.montant_prevu      = '' ;                
            //item.id      = 0 ;
          }

          vm.selectedItemDivers_attachement_mobilier_prevu = {} ;
          NouvelItemDivers_attachement_mobilier_prevu      = false;
          
        };

        //fonction selection item justificatif mobilier
        vm.selectionDivers_attachement_mobilier_prevu= function (item)
        {
            vm.selectedItemDivers_attachement_mobilier_prevu = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemDivers_attachement_mobilier_prevu    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_mobilier_prevu));             
            }
            
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
            if (item.id==0)
            {   
                NouvelItemDivers_attachement_mobilier_prevu = true ;

                item.quantite_prevu   = parseFloat(vm.selectedItemDivers_attachement_mobilier_prevu.quantite_prevu) ;
                item.prix_unitaire = parseFloat(vm.selectedItemDivers_attachement_mobilier_prevu.prix_unitaire) ;
                item.unite     = vm.selectedItemDivers_attachement_mobilier_prevu.unite;

                item.montant_prevu      = parseFloat(vm.selectedItemDivers_attachement_mobilier_prevu.montant_prevu) ;
                //item.id_attachement_mobilier_detail = vm.selectedItemDivers_attachement_mobilier_prevu.id_attachement_mobilier_detail;
            }
            else
            {   
                NouvelItemDivers_attachement_mobilier_prevu = false ;

                item.quantite_prevu   = parseFloat(vm.selectedItemDivers_attachement_mobilier_prevu.quantite_prevu) ;
                item.prix_unitaire = parseFloat(vm.selectedItemDivers_attachement_mobilier_prevu.prix_unitaire) ;
                item.unite     = vm.selectedItemDivers_attachement_mobilier_prevu.unite;

                item.montant_prevu      = parseFloat(vm.selectedItemDivers_attachement_mobilier_prevu.montant_prevu) ;
               

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
                   if((mem[0].quantite_prevu != currentItemDivers_attachement_mobilier_prevu.quantite_prevu )
                    ||(mem[0].unite != currentItemDivers_attachement_mobilier_prevu.unite )
                    ||(mem[0].montant_prevu != currentItemDivers_attachement_mobilier_prevu.montant_prevu )
                    ||(mem[0].prix_unitaire != currentItemDivers_attachement_mobilier_prevu.prix_unitaire ))                   
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
                getId = vm.selectedItemDivers_attachement_mobilier_prevu.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    quantite_prevu: divers_attachement_mobilier_prevu.quantite_prevu,
                    prix_unitaire: divers_attachement_mobilier_prevu.prix_unitaire,
                    unite: divers_attachement_mobilier_prevu.unite,
                    montant_prevu: divers_attachement_mobilier_prevu.montant_prevu,                    
                    id_attachement_mobilier_detail: divers_attachement_mobilier_prevu.id_attachement_mobilier_detail,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id           
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
                        //vm.selectedItemDivers_attachement_mobilier_prevu.attachement_mobilier_prevu  = bat_prevu[0];
                        
                        var cout_mobilier =parseFloat(vm.selectedItemContrat_prestataire.cout_mobilier) + parseFloat(divers_attachement_mobilier_prevu.montant_prevu)-parseFloat(currentItemDivers_attachement_mobilier_prevu.montant_prevu);                        
                        maj_insertion_contrat_in_base_mobilier(cout_mobilier);vm.selectedItemDivers_attachement_mobilier_prevu.$selected  = false;
                        vm.selectedItemDivers_attachement_mobilier_prevu.$edit      = false;
                        vm.selectedItemDivers_attachement_mobilier_prevu ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        /*vm.alldivers_attachement_mobilier_prevu = vm.alldivers_attachement_mobilier_prevu.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDivers_attachement_mobilier_prevu.id;
                      });*/ 
                        var cout_mobilier =parseFloat(vm.selectedItemContrat_prestataire.cout_mobilier) - parseFloat(currentItemDivers_attachement_mobilier_prevu.montant_prevu);
                        //console.log(cout_mobilier);
                        maj_insertion_contrat_in_base_mobilier(cout_mobilier);
                        vm.selectedItemDivers_attachement_mobilier_prevu.unite   = '' ;
                        vm.selectedItemDivers_attachement_mobilier_prevu.quantite_prevu = '' ;
                        vm.selectedItemDivers_attachement_mobilier_prevu.prix_unitaire     = '' ;                
                        vm.selectedItemDivers_attachement_mobilier_prevu.montant_prevu      = '' ;                
                        vm.selectedItemDivers_attachement_mobilier_prevu.id      = 0 ;                    
                    }
              }
              else
              {
                  divers_attachement_mobilier_prevu.id  =   String(data.response);              
                  NouvelItemDivers_attachement_mobilier_prevu = false;
                  var cout_mobilier =parseFloat(vm.selectedItemContrat_prestataire.cout_mobilier) + parseFloat(divers_attachement_mobilier_prevu.montant_prevu);
                  //vm.selectedItemContrat_prestataire.cout_batiment = cout_batiment;                  
                  maj_insertion_contrat_in_base_mobilier(cout_mobilier);

              }

              divers_attachement_mobilier_prevu.$selected = false;
              divers_attachement_mobilier_prevu.$edit = false;
              vm.selectedItemDivers_attachement_mobilier_prevu ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.change_quantite_prix_mobilier= function(item) 
        {
            
            item.montant_prevu=parseFloat(item.quantite_prevu)*parseFloat(item.prix_unitaire);                    
          
        }

    /******************************************fin attachement mobilier travaux***********************************************/


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
        },
        {titre:"Action"
        }];


        vm.change_cout_avenant= function(item)
        {
            item.cout_total_ht = (parseFloat(item.cout_batiment) + parseFloat(item.cout_latrine) + parseFloat(item.cout_mobilier))/1;
            item.cout_total_ttc = parseFloat(item.cout_batiment) + parseFloat(item.cout_latrine) + parseFloat(item.cout_mobilier);
        }
 
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
            item.cout_total_ht   = currentItemAvenant_mpe.cout_total_ht ;
            item.cout_total_ttc   = currentItemAvenant_mpe.cout_total_ttc ;
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
            if (item.$edit == false || item.$edit==undefined)
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
            item.cout_batiment   = parseFloat(vm.selectedItemAvenant_mpe.cout_batiment);
            item.cout_latrine   = parseFloat(vm.selectedItemAvenant_mpe.cout_latrine) ;
            item.cout_mobilier   = parseFloat(vm.selectedItemAvenant_mpe.cout_mobilier) ;
            item.cout_total_ht   = vm.selectedItemAvenant_mpe.cout_total_ht ;
            item.cout_total_ttc   = vm.selectedItemAvenant_mpe.cout_total_ttc ;
            item.date_signature = new Date(vm.selectedItemAvenant_mpe.date_signature)  ;            
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
                    date_signature:convertionDate(avenant_mpe.date_signature),
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
        vm.validerAvenant_mpe = function()
        {
          valideravenantmpeinbase(vm.selectedItemAvenant_mpe,0,1);
        }
        function valideravenantmpeinbase(avenant_mpe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avenant_mpe.id,
                    description: avenant_mpe.description,
                    cout_batiment: avenant_mpe.cout_batiment,
                    cout_latrine: avenant_mpe.cout_latrine,
                    cout_mobilier: avenant_mpe.cout_mobilier,
                    ref_avenant: avenant_mpe.ref_avenant,
                    date_signature:convertionDate(avenant_mpe.date_signature),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_prestataire/index",datas, config).success(function (data)
            {
                avenant_mpe.validation = validation;
                vm.validation_avenant_mpe = validation;
                avenant_mpe.$selected = false;
                avenant_mpe.$edit = false;
                vm.selectedItemAvenant_mpe = {};
                vm.showbuttonValidation_avenant_mpe = false;
            
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
            if (item.$edit==false || item.$edit==undefined)
            {
                currentItemDocument_prestataire_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_prestataire_scan));
            }
            
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
                    date_elaboration: convertionDate(document_prestataire_scan.date_elaboration),
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
                                                      date_elaboration: convertionDate(document_prestataire_scan.date_elaboration),
                                                      observation: document_prestataire_scan.observation,
                                                      id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
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
                                        date_elaboration: convertionDate(document_prestataire_scan.date_elaboration),
                                        observation: document_prestataire_scan.observation,
                                        id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
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

                          vm.selectedItemDocument_prestataire_scan.id_document_prestataire_scan = null;
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
                                                date_elaboration: convertionDate(document_prestataire_scan.date_elaboration),
                                                observation: document_prestataire_scan.observation,
                                                id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
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
                                  date_elaboration: convertionDate(document_prestataire_scan.date_elaboration),
                                  observation: document_prestataire_scan.observation,
                                  id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
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
        vm.validerDocument_prestataire_scan = function()
        {
          maj_in_baseDocument_prestataire_scan(vm.selectedItemDocument_prestataire_scan,0);
        }

        vm.selectionDocument_prestataire_scan_valide= function (item)
        {
            vm.selectedItemDocument_prestataire_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_prestataire_scan_valide', function()
        {
             if (!vm.alldocument_prestataire_scan_valide) return;
             vm.alldocument_prestataire_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_prestataire_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_prestataire_scan
        function maj_in_baseDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_prestataire_scan.id_document_prestataire_scan,
                    fichier: document_prestataire_scan.fichier,
                    date_elaboration: convertionDate(document_prestataire_scan.date_elaboration),
                    observation: document_prestataire_scan.observation,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    id_document_prestataire: document_prestataire_scan.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
            {   

              vm.validation_document_prestataire_scan = 1;
              document_prestataire_scan.validation=1;
              //vm.alldocument_prestataire_scan_valide.push(document_prestataire_scan);
              vm.selectedItemDocument_prestataire_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_prestataire_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
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
               case 'BCAF':
                          apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                          {
                              vm.allphase_sous_projet = result.data.response;                                
                          });
                     
                    break;
               
                case 'ADMIN':
                         apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                            {
                                vm.allphase_sous_projet = result.data.response;
                                //vm.stepphase = true;
                            });                    
                     
                    break;
                default:
                    break;
            
              }
              vm.stepphase =true;
              vm.showbuttonValidationdelai_travaux = true;
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
            vm.showbuttonValidationdelai_travaux = false;
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
                    date_prev_debu_travau: convertionDate(delai_travaux.date_prev_debu_travau),
                    date_reel_debu_travau: convertionDate(delai_travaux.date_reel_debu_travau),
                    date_expiration_police: convertionDate(delai_travaux.date_expiration_police),
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
              vm.validation_delai_travaux = 0;    
              vm.showbuttonValidationdelai_travaux = false;
              delai_travaux.$selected = false;
              delai_travaux.$edit = false;
              vm.selectedItemDelai_travaux = {};
              vm.stepphase =false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.valider_delai_travaux = function()
        {
          maj_in_baseDelai_travaux(vm.selectedItemDelai_travaux,0);
        }
        function maj_in_baseDelai_travaux(delai_travaux,suppression)
        {//add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };

            var datas = $.param({
                    supprimer: suppression,
                    id:        delai_travaux.id,
                    date_prev_debu_travau: delai_travaux.date_prev_debu_travau,
                    date_reel_debu_travau: delai_travaux.date_reel_debu_travau,
                    date_expiration_police: delai_travaux.date_expiration_police,
                    delai_execution: delai_travaux.delai_execution,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation : 1               
                });
                console.log(datas);
                //factory
            apiFactory.add("delai_travaux/index",datas, config).success(function (data)
            {                   
              vm.selectedItemDelai_travaux.validation = 1;
              vm.validation_delai_travaux = 1;    
              vm.showbuttonValidationdelai_travaux = false;
              delai_travaux.$selected = false;
              delai_travaux.$edit = false;
              vm.selectedItemDelai_travaux = {};
            vm.stepphase =false;
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
            vm.showbuttonValidationphase_sous_projet = true;
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
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,                    
                    id_etape_sousprojet:phase_sous_projet.id_etape_sousprojet,                    
                    date_travaux: convertionDate(phase_sous_projet.date_travaux),
                    id_delai_travaux: vm.selectedItemDelai_travaux.id,
                    validation:0,               
                });
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

        vm.valider_phase_sous_projet = function()
        {
          validationPhase_sous_projet(vm.selectedItemPhase_sous_projet,0);
        }

        function validationPhase_sous_projet(phase_sous_projet,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        phase_sous_projet.id,
                    date_travaux:phase_sous_projet.date_travaux,
                    id_etape_sousprojet:phase_sous_projet.etape_sousprojet.id,
                    id_delai_travaux: vm.selectedItemDelai_travaux.id,
                    validation:1,               
                });
                console.log(datas);
                //factory
            apiFactory.add("phase_sous_projet/index",datas, config).success(function (data)
            { 
              vm.selectedItemPhase_sous_projet.validation = 1;
              vm.validation_phase_sous_projet = 1;  
              vm.showbuttonValidationphase_sous_projet = false;
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
            console.log(vm.selectedItemReception_mpe);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    observation              : reception_mpe.observation,
                    date_previ_recep_tech    : convertionDate(reception_mpe.date_previ_recep_tech ),
                    date_reel_tech           : convertionDate(reception_mpe.date_reel_tech ),
                    date_leve_recep_tech     : convertionDate(reception_mpe.date_leve_recep_tech ),
                    date_previ_recep_prov    : convertionDate(reception_mpe.date_previ_recep_prov),
                    date_reel_recep_prov     : convertionDate(reception_mpe.date_reel_recep_prov ), 
                    date_previ_leve          : convertionDate(reception_mpe.date_previ_leve ), 
                    date_reel_lev_ava_rd     : convertionDate(reception_mpe.date_reel_lev_ava_rd ),
                    date_previ_recep_defi    : convertionDate(reception_mpe.date_previ_recep_defi ),
                    date_reel_recep_defi     : convertionDate(reception_mpe.date_reel_recep_defi ),
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
              
              vm.showboutonValider = false;
              reception_mpe.$selected = false;
              reception_mpe.$edit = false;
              vm.selectedItemReception_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.valider_reception = function()
        {
          valider_reception_in_base(vm.selectedItemReception_mpe,0,1);
        }
        function valider_reception_in_base(reception_mpe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var datas = $.param({
                    supprimer: suppression,
                    id:        reception_mpe.id,
                    observation              : reception_mpe.observation,
                    date_previ_recep_tech    : convertionDate(reception_mpe.date_previ_recep_tech ),
                    date_reel_tech           : convertionDate(reception_mpe.date_reel_tech ),
                    date_leve_recep_tech     : convertionDate(reception_mpe.date_leve_recep_tech ),
                    date_previ_recep_prov    : convertionDate(reception_mpe.date_previ_recep_prov),
                    date_reel_recep_prov     : convertionDate(reception_mpe.date_reel_recep_prov ), 
                    date_previ_leve          : convertionDate(reception_mpe.date_previ_leve ), 
                    date_reel_lev_ava_rd     : convertionDate(reception_mpe.date_reel_lev_ava_rd ),
                    date_previ_recep_defi    : convertionDate(reception_mpe.date_previ_recep_defi ),
                    date_reel_recep_defi     : convertionDate(reception_mpe.date_reel_recep_defi ),
                    id_contrat_prestataire    :reception_mpe.id_contrat_prestataire,
                    validation    :validation
                      
                });
                console.log(datas);
                //factory
            apiFactory.add("reception_mpe/index",datas, config).success(function (data)
            {
              
              vm.selectedItemReception_mpe.validation = 1;
              vm.validation_reception_mpe = 1;  
              vm.showbuttonValidationreception_mpe = false;
              reception_mpe.$selected = false;
              reception_mpe.$edit = false;
              vm.selectedItemReception_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/************************************************fin reception***************************************************/

/**********************************debut avancement batiment****************************************/
//col table
      /*  vm.avancement_batiment_column = [
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

            //if (vm.allavancement_batiment.length>1)
           // {
              var max_ponderation_batiment = Math.max.apply(Math, allavancement_batiment_autre.map(function(o)
              { 
                return o.attachement_batiment.ponderation_batiment;
              }));
            vm.allcurrentattachement_batiment = allattachement_batiment_autre.filter(function(obj)
            {
                return obj.ponderation_batiment > max_ponderation_batiment;
            });
            vm.allcurrentattachement_batiment.push(vm.selectedItemAvancement_batiment.attachement_batiment);

            vm.showbuttonValidationavancement_batiment = false;

           
           
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

        vm.changeAttachement_batiment= function(item)
        {//console.log(vm.allattachement_batiment);
           // console.log(item);
          var atta = vm.allattachement_batiment.filter(function(obj)
          {
              return obj.id == item.id_attachement_batiment;
          });
          item.ponderation_batiment=parseInt(atta[0].ponderation_batiment);
        }
        vm.valider_avancement_batiment = function()
        {
          valider_avancement_batiment_in_base(vm.selectedItemAvancement_batiment,0,1);
        }
        function valider_avancement_batiment_in_base(avancement_batiment,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avancement_batiment.id,
                    intitule: avancement_batiment.intitule,
                    description: avancement_batiment.description,
                    observation: avancement_batiment.observation,
                    date: convertionDate(new Date(avancement_batiment.date)),
                    id_attachement_batiment:avancement_batiment.attachement_batiment.id,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_batiment/index",datas, config).success(function (data)
            {  
              vm.validation_avancement_batiment = validation; 
              avancement_batiment.validation = validation;  
              avancement_batiment.$selected = false;
              avancement_batiment.$edit = false;
              vm.selectedItemAvancement_batiment = {};
              vm.showbuttonValidationavancement_batiment = false;
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }*/
/*********************************************fin avancement batiment************************************************/

/**********************************debut avancement batiment****************************************/
//col table
     /*   vm.avancement_latrine_column = [
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
        vm.valider_avancement_latrine = function()
        {
          valider_avancement_latrine_in_base(vm.selectedItemAvancement_latrine,0,1);
        }
        function valider_avancement_latrine_in_base(avancement_latrine,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avancement_latrine.id,
                    intitule: avancement_latrine.intitule,
                    description: avancement_latrine.description,
                    observation: avancement_latrine.observation,
                    date: convertionDate(new Date(avancement_latrine.date)),
                    id_attachement_latrine:avancement_latrine.attachement_latrine.id,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_latrine/index",datas, config).success(function (data)
            {  
              vm.validation_avancement_latrine = validation; 
              avancement_latrine.validation = validation;  
              avancement_latrine.$selected = false;
              avancement_latrine.$edit = false;
              vm.selectedItemAvancement_latrine = {};
              vm.showbuttonValidationavancement_latrine = false;
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }*/
/*********************************************fin avancement batiment************************************************/
/**********************************debut avancement batiment****************************************/
//col table
    /*    vm.avancement_mobilier_column = [
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
        {//console.log(vm.allattachement_mobilier);
           // console.log(item);
        
          var atta = vm.allattachement_mobilier.filter(function(obj)
          {
              return obj.id == item.id_attachement_mobilier;
          });
          item.ponderation_mobilier=parseInt(atta[0].ponderation_mobilier);
        }
        vm.valider_avancement_mobilier = function()
        {
          valider_avancement_mobilier_in_base(vm.selectedItemAvancement_mobilier,0,1);
        }
        function valider_avancement_mobilier_in_base(avancement_mobilier,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avancement_mobilier.id,
                    intitule: avancement_mobilier.intitule,
                    description: avancement_mobilier.description,
                    observation: avancement_mobilier.observation,
                    date: convertionDate(new Date(avancement_mobilier.date)),
                    id_attachement_mobilier:avancement_mobilier.attachement_mobilier.id,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avancement_mobilier/index",datas, config).success(function (data)
            {  
              vm.validation_avancement_mobilier = validation; 
              avancement_mobilier.validation = validation;  
              avancement_mobilier.$selected = false;
              avancement_mobilier.$edit = false;
              vm.selectedItemAvancement_mobilier = {};
              vm.showbuttonValidationavancement_mobilier = false;
            
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }*/
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
                vm.ajoutIndicateur(vm.selectedItemIndicateur,1);
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

                        vm.showbuttonNouvIndicateur= true;
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
                vm.showbuttonValidationindicateur = false;
                indicateur.$selected = false;
                indicateur.$edit = false;
                vm.selectedItemIndicateur = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerindicateur= function()
        {
            maj_in_baseIndicateur(vm.selectedItemIndicateur,0);
        }
        //insertion ou mise a jours ou suppression item dans bdd indicateur
        function maj_in_baseIndicateur(indicateur,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        indicateur.id,      
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
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("indicateur/index",datas, config).success(function (data)
            {   
                vm.validation_indicateur = 1;    
              vm.showbuttonValidationindicateur = false;              
              indicateur.validation = 1
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
