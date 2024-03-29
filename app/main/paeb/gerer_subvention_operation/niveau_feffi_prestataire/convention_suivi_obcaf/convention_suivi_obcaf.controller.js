
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_feffi_prestataire.convention_suivi_obcaf')
        .directive('customOnChange', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          if((files[0].size/1024/1024)>20)
            {
                ngModel.$setViewValue(null);
                var confirm = $mdDialog.confirm()
                    .title('Cet action n\'est pas autorisé')
                    .textContent('La taille doit être inferieur à 20MB')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    ngModel.$setViewValue(null);
                    element.val(null);
                    scope.document_moe_scan.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.document_moe_scan.fichier = files[0].name;
            } 
        });
        }
      };
    })
        .directive('customOnChangempe', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangempe);
            element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          if((files[0].size/1024/1024)>20)
            {
                ngModel.$setViewValue(null);
                var confirm = $mdDialog.confirm()
                    .title('Cet action n\'est pas autorisé')
                    .textContent('La taille doit être inferieur à 20MB')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    ngModel.$setViewValue(null);
                    element.val(null);
                    scope.document_prestataire_scan.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.document_prestataire_scan.fichier = files[0].name;
            } 
        });
        }
      };
    })
        .directive('customOnChangepr', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangepr);
            element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          if((files[0].size/1024/1024)>6)
            {
                ngModel.$setViewValue(null);
                var confirm = $mdDialog.confirm()
                    .title('Cet action n\'est pas autorisé')
                    .textContent('La taille doit être inferieur à 20MB')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    ngModel.$setViewValue(null);
                    element.val(null);
                    scope.document_pr_scan.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.document_pr_scan.fichier = files[0].name;
            } 
        });
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
    function Convention_suivi_obcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel,$stateParams)
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

        vm.ajoutPassation_marches_pr = ajoutPassation_marches_pr ;
        var NouvelItemPassation_marches_pr=false;
        var currentItemPassation_marches_pr;
        vm.selectedItemPassation_marches_pr = {} ;
        vm.allpassation_marches_pr = [] ;
        vm.showbuttonNouvPassation_pr=true;
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

        vm.showbuttonNouvavenant_partenaire=true;

        vm.showbuttonValidation_avenant_partenaire = false;
        vm.permissionboutonvalideravenant_partenaire = false; 

            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false;       

/********************************************Fin importer passation************************************/
        vm.affiche_load= false; 
        vm.showbuttonimporter_passation_pr=true;
        vm.showformimporter_passation_pr = false;
/********************************************Fin importer passation*************************************/ 

/********************************************Fin importer contrat**************************************/
        vm.showbuttonimporter_contrat_pr=true;
        vm.showformimporter_contrat_pr = false;
/********************************************Fin importer contrat**************************************/ 

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

        vm.allrubrique_calendrier_paie_moe = [];
        vm.selectedItemRubrique_calendrier_paie_moe = {};

        vm.allsousrubrique_calendrier_paie_moe = [];
        vm.selectedItemSousrubrique_calendrier_paie_moe = {};

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

       /* vm.allrubrique_attachement_batiment_mpe = [];
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
        vm.selectedItemDivers_attachement_mobilier_prevu = {} ;*/

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

       /* apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allmoe= result.data.response;
            console.log(vm.allmoe);
        });*/
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
        vm.allprestataire = [];
        vm.allmoe= [];
        /*apiFactory.getAll("prestataire/index").then(function(result)
        {
            vm.allprestataire= result.data.response;
        });*/
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
         var racourci = $stateParams.rac; 
        if (racourci!=null && racourci!=undefined && racourci!='')
        { vm.affiche_load=true;
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByracourci","id_convention_entete",racourci).then(function(result)
          {
            vm.allconvention_entete= result.data.response;
            console.log(vm.allconvention_entete);
            var item = vm.allconvention_entete[0];
            item.$selected=true;
            vm.selectedItemConvention_entete = item;
            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig';
            vm.affiche_load=false;
            vm.showbuttonNouvContrat_prestataire=true;
           
            vm.stepMenu_pr=true;                  
            vm.stepMenu_moe=true;                  
            vm.stepMenu_mpe=true;                    
            vm.stepMenu_feffi=true;                   
            vm.stepMenu_indicateur=true;

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
          });
        }

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
            
            switch (vm.session)
                {
                  case 'AAC': 
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydateutilisateur','id_utilisateur',id_user,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });

                      break;

                  case 'ADMIN':                            
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
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

            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig';

            /* apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_convention_entete',item.id).then(function(result)
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
              });  */           
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


        apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai= result.data.response;
        });

        vm.step_click_menu_pr =function ()
        {   
            vm.tabpartenaire = true; 
            vm.affiche_load = true;
            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false; 
            vm.stepcontrat_pr = false;
            vm.showbuttonNouvPassation_pr=true;
            NouvelItemPassation_marches_pr = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches_pr = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });
                    if (result.data.response.length!=0)
                    {
                         vm.showbuttonNouvPassation_pr=false;
                     };
                        vm.affiche_load = false;
                        console.log(vm.allpassation_marches_pr);
                    vm.stepcontrat_pr = true;
                });
            }
            else
            {
                apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allpassation_marches_pr = result.data.response;
                    if (result.data.response.length!=0)
                    {
                         vm.showbuttonNouvPassation_pr=false;
                     };
                        vm.affiche_load = false;
                    vm.stepcontrat_pr = true;
                });
            }
                        
          
            
        }

        /*******************************************debut importer passation*************************************************/

        vm.affichageformimporter_passation_pr = function()
        {
          vm.showbuttonimporter_passation_pr =false;
          vm.showformimporter_passation_pr =true;
        }
        
        $scope.uploadFile_passation_pr = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_passation_pr = files;
        }
        vm.annulerimporter_passation_pr = function()
        {
            vm.fichier_passation_pr = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_passation_pr=true;
            vm.showformimporter_passation_pr=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_passation_pr = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_passation_pr[0];
          var repertoire = 'importer_passation_pr/';
          var uploadUrl = apiUrl + "importer_passation_pr/importerdonnee_passation_pr";
          var name = vm.myFile_passation_pr[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_passation_pr=data["nom_fichier"];
              vm.repertoire_passation_pr=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé inserer: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_passation_pr/"+data.nomFile;
                    //vm.allpassation_prention = data.passation_pr_inserer;
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
    /*******************************************fin importer passation***************************************************/

  /********************************************Debut passation de marcher*********************************************/
        vm.menu_click_passation_pr = function()
        {
          NouvelItemPassation_marches_pr = false;
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
                if (vm.session=="AAC")
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
                  test_existancePassation_marches_pr (passation_marches_pr,suppression);
                }
                 
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
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
  /*****************************************fin contrat de marcher**************************************************/

   /*******************************************debut importer contrat*************************************************/

        vm.affichageformimporter_contrat_pr = function()
        {
          vm.showbuttonimporter_contrat_pr =false;
          vm.showformimporter_contrat_pr =true;
        }
        
        $scope.uploadFile_contrat_pr = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_contrat_pr = files;
        }
        vm.annulerimporter_contrat_pr = function()
        {
            vm.fichier_contrat_pr = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_contrat_pr=true;
            vm.showformimporter_contrat_pr=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_contrat_pr = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_contrat_pr[0];
          var repertoire = 'importer_contrat_pr/';
          var uploadUrl = apiUrl + "importer_contrat_pr/importerdonnee_contrat_pr";
          var name = vm.myFile_contrat_pr[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_contrat_pr=data["nom_fichier"];
              vm.repertoire_contrat_pr=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre donnée inserer: '+data.nbr_inserer+', Nombre donnéé inserer: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_contrat_pr/"+data.nomFile;
                    //vm.allcontrat_prention = data.contrat_pr_inserer;
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
    /*******************************************fin importer passation***************************************************/


  /*********************************************debut contrat pr**********************************************/
        vm.step_click_contrat_pr =function ()
        {  
            vm.affiche_load = true;
            vm.stepavenant_pr = false;
            vm.stepprestaion_pr = false;
            vm.stepdoc_pr = false;
            vm.showbuttonNouvcontrat_pr = false;
            vm.showbuttonimporter_contrat_pr = false
            NouvelItemContrat_partenaire_relai = false;
            apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(resultc)
            {
                 vm.allcontrat_partenaire_relai = resultc.data.response;

                vm.showbuttonNouvcontrat_pr = true;

                if (resultc.data.response.length!=0)
                {
                    vm.showbuttonNouvcontrat_pr=false;
                 } 
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
                 
              if (vm.session=="AAC")
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
                test_existanceContrat_partenaire_relai (contrat_partenaire_relai,suppression); 
              }
                 
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
            if (item.$selected==false || item.$selected==undefined)
            {
                currentItemContrat_partenaire_relai    = JSON.parse(JSON.stringify(vm.selectedItemContrat_partenaire_relai));
            }
             

           if(item.id!=0)
           {            
              if (item.$selected==false || item.$selected==undefined)
              {
                  vm.validation_contrat_pr = item.validation;
                  apiFactory.getAPIgeneraliserREST("situation_participant_odc/index",'id_classification_site',vm.selectedItemConvention_entete.site.id_classification_site).then(function(result)
                  {
                      vm.allsituation_participant_odc = result.data.response;
                  }); 
              }
              vm.validation_contrat_pr = item.validation;
              vm.stepavenant_pr = true;
              vm.stepprestaion_pr = true;
              vm.stepdoc_pr = true;
              console.log(item);
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
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/*****************************************fin contrat_partenaire_relai********************************************/

/*********************************************fin avenant partenaire***********************************************/
vm.click_step_avenant_pr = function()
{   
    vm.affiche_load = true;
    NouvelItemAvenant_partenaire = false;
    if (vm.session=="AAC")
    {
      apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
      {
          vm.allavenant_partenaire = result.data.response.filter(function(obj)
          {
              return obj.validation == 0;
          });
          if (result.data.response.length!=0)
          {                            
              vm.showbuttonNouvavenant_partenaire = false;  
          }
          vm.affiche_load = false; 
      });
    }
    else
    {
      apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
      {
          vm.allavenant_partenaire = result.data.response;
          if (result.data.response.length!=0)
          {                            
              vm.showbuttonNouvavenant_partenaire = false;  
          }
          vm.affiche_load = false; 
      });
    }
    
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
              if (vm.session=="AAC")
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
                test_existanceAvenant_partenaire (avenant_partenaire,suppression);  
              }            
                
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
            if (item.id!=0)
            {
                currentItemAvenant_partenaire    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_partenaire));
                vm.showbuttonValidation_avenant_partenaire = true;
                vm.validation_avenant_partenaire = item.validation;
            }
             
            
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
            item.date_signature = new Date(vm.selectedItemAvenant_partenaire.date_signature) ;            
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

  /**********************************************Avenant partenaire***************************************************/


/**********************************************Debut Dossier partenaire relais***************************************************/
    

        vm.step_importer_doc_pr = function()
        {   
            vm.affiche_load = true;
            if (vm.session=="AAC")
            {
                apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocumentinvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.alldocument_pr_scan = result.data.response; 
                  vm.affiche_load = false;                                       
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("dossier_pr/index",'menu','getdocumentBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.alldocument_pr_scan = result.data.response; 
                  vm.affiche_load = false;                                       
              });
            }
             
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

        //fonction ajout dans bdd
        function ajoutDocument_pr_scan(document_pr_scan,suppression)
        {
            if (NouvelItemDocument_pr_scan==false)
            {   
                if (vm.session=="AAC")
                {
                    apiFactory.getAPIgeneraliserREST("document_pr_scan/index",'menu','getdocumentvalideById','id_document_pr_scan',document_pr_scan.id_document_pr_scan).then(function(result)
                  {
                    var document_pr_scan_valide = result.data.response;
                    if (document_pr_scan_valide.length !=0)
                    {
                        var confirm = $mdDialog.confirm()
                      .title('cette modification n\'est pas autorisé.')
                      .textContent('Les données sont déjà validées!')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      
                      $mdDialog.show(confirm).then(function()
                      {   
                          /*document_pr_scan.$edit = false;
                          document_pr_scan.$selected = false;
                          document_pr_scan.fichier   = currentItemDocument_pr_scan.fichier ;
                          document_pr_scan.date_elaboration   = currentItemDocument_pr_scan.date_elaboration ;
                          document_pr_scan.observation   = currentItemDocument_pr_scan.observation ;
                          vm.selectedItemDocument_pr_scan = {} ;*/

                          document_pr_scan.fichier   = null;
                          document_pr_scan.date_elaboration   = null ;
                          document_pr_scan.observation   = null ;
                          document_pr_scan.$edit = false;
                          document_pr_scan.$selected = false;

                          document_pr_scan.id_document_pr_scan = null;
                          document_pr_scan.validation   = null ;
                          document_pr_scan.existance   = false ;
                          vm.selectedItemDocument_pr_scan = {} ;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                          test_existanceDocument_pr_scan (document_pr_scan,suppression);          
                    }
                  });
                }
                else
                {
                  test_existanceDocument_pr_scan (document_pr_scan,suppression);
                }
                 
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
            if (item.$edit==false || item.$edit==undefined)
            {
                currentItemDocument_pr_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_pr_scan));                
            }
            console.log(item);
            
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
            {   apiFactory.getAPIgeneraliserREST("document_pr_scan/index",'menu','getdocumentBycontratdossier_prevu','id_document_pr',item.id,'id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                {
                    var document_pr_scan_valide = result.data.response;
                      if (document_pr_scan_valide.length !=0)
                      {
                          var confirm = $mdDialog.confirm()
                        .title('cet ajout  n\'est pas autorisé.')
                        .textContent('Ce document existe déjà!')
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('Fermer')
                        
                        $mdDialog.show(confirm).then(function()
                        {                         
                            item.$edit = false;
                            item.$selected = false;
                        }, function() {
                          //alert('rien');
                        });
                      }
                      else
                      { 
                        

                        NouvelItemDocument_pr_scan=true;
                        console.log('atonull');
                        item.fichier   = vm.selectedItemDocument_pr_scan.fichier ;
                        item.date_elaboration   = vm.datenow ;
                        item.observation   = vm.selectedItemDocument_pr_scan.observation ;
                        item.id_document_pr_scan   = '0' ;
                        item.id_contrat_partenaire_relai   = vm.selectedItemContrat_partenaire_relai.id ;
                    }
                });
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                                    //document_pr_scan.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: currentItemDocument_pr_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_pr_scan.date_elaboration),
                                                      observation: currentItemDocument_pr_scan.observation,
                                                      id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                                                      id_document_pr: currentItemDocument_pr_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_pr_scan.$selected = false;
                                          document_pr_scan.$edit = false;
                                          document_pr_scan.fichier=currentItemDocument_pr_scan.fichier;
                                          document_pr_scan.date_elaboration=currentItemDocument_pr_scan.date_elaboration;
                                          document_pr_scan.observation=currentItemDocument_pr_scan.observation;
                                          vm.selectedItemDocument_pr_scan = {};
                                      console.log('a');
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
                                       
                                      document_pr_scan.$selected = false;
                                      document_pr_scan.$edit = false;
                                      vm.selectedItemDocument_pr_scan = {};
                                      var chemin= currentItemDocument_pr_scan.fichier;
                                        var fd = new FormData();
                                            fd.append('chemin',chemin);
                                      
                                        var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                                        var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                                        headers: {'Content-Type': undefined}, chemin: chemin
                                        }).success(function(data)
                                        {
                                        });
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                               console.log('mod');
                               var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: currentItemDocument_pr_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_pr_scan.date_elaboration),
                                                      observation: currentItemDocument_pr_scan.observation,
                                                      id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                                                      id_document_pr: currentItemDocument_pr_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_pr_scan.$selected = false;
                                          document_pr_scan.$edit = false;
                                          document_pr_scan.fichier=currentItemDocument_pr_scan.fichier;
                                          document_pr_scan.date_elaboration=currentItemDocument_pr_scan.date_elaboration;
                                          document_pr_scan.observation=currentItemDocument_pr_scan.observation;
                                          vm.selectedItemDocument_pr_scan = {};
                                      console.log('erreurmod_talou');
                                      });
                            });
                          }
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
                          console.log('c');
                          vm.selectedItemDocument_pr_scan.id_document_pr_scan = null;
                      }).error(function()
                      {
                          showAlert(event,chemin);
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
                      {console.log(data);
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
                                { 
                                    document_pr_scan.$selected = false;
                                    document_pr_scan.$edit = false;
                                    document_pr_scan.validation = null;
                                    document_pr_scan.date_elaboration = null;
                                    document_pr_scan.observation = null;
                                    document_pr_scan.id_document_pr_scan = null;
                                    vm.selectedItemDocument_pr_scan = {};
                                console.log('d');
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
                                { 
                                    document_pr_scan.$selected = false;
                                    document_pr_scan.$edit = false;
                                    document_pr_scan.validation = null;
                                    document_pr_scan.fichier = null;
                                    document_pr_scan.date_elaboration = null;
                                    document_pr_scan.observation = null;
                                    document_pr_scan.id_document_pr_scan = null;
                                    vm.selectedItemDocument_pr_scan = {};
                                console.log('ajout_suppr');
                                })
                      });
                    }
              }
              //document_pr_scan.document_pr = doc[0];
              //vm.selectedItemDocument_pr_scan = {};
             
              document_pr_scan.contrat_pr = vm.selectedItemContrat_partenaire_relai ;
              document_pr_scan.$selected = false;
              document_pr_scan.$edit = false;
              vm.showbuttonValidation_document_pr_scan = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_pr_scan = function(item)
        {
            window.open(apiUrlFile+item.fichier);
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
            NouvelItemModule_dpp = false;
            if (vm.session=="AAC")
            {
                apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                {
                    vm.allmodule_dpp = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });                          
                    console.log(vm.allmodule_dpp);
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvformdpp=false;
                    }
                    vm.affiche_load = false;
                    vm.step_onglet_odc = true;
                    vm.step_onglet_emies = true;
                    vm.step_onglet_gfpc = true;
                    vm.step_onglet_pmc = true;
                    vm.step_onglet_sep = true;
                });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                {
                    vm.allmodule_dpp = result.data.response;                          
                    console.log(vm.allmodule_dpp);
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvformdpp=false;
                    }
                    vm.affiche_load = false;
                    vm.step_onglet_odc = true;
                    vm.step_onglet_emies = true;
                    vm.step_onglet_gfpc = true;
                    vm.step_onglet_pmc = true;
                    vm.step_onglet_sep = true;
                });
            }
            
        }
        vm.step_module_dpp = function()
        {   
            vm.stepparticipantdpp = false;
            NouvelItemModule_dpp = false;
            if (vm.session=="AAC")
            {
                apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                {
                    vm.allmodule_dpp = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });                           
                    console.log(vm.allmodule_dpp);
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvformdpp=false;
                    }
                });
            }
            else
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
             
        }
        vm.step_module_odc = function()
        {   
            vm.stepparticipantodc = false;            
            NouvelItemModule_odc = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmodule_odc = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });                           
                  console.log(vm.allmodule_odc);
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvformodc=false;
                  }
              });
            }
            else
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
            
        }

        vm.step_module_emies = function()
        {
            vm.stepparticipantemies = false;            
            NouvelItemModule_emies = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleinvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmodule_emies = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });                           
                  console.log(vm.allmodule_emies);
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvformemies=false;
                  }
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleinvalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmodule_emies = result.data.response;                           
                  console.log(vm.allmodule_emies);
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvformemies=false;
                  }
              });
            }
            
        }

        vm.step_module_gfpc = function()
        {   
            vm.stepparticipantgfpc = false;            
            NouvelItemModule_gfpc = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmodule_gfpc = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });                           
                  console.log(vm.allmodule_gfpc);
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvformgfpc=false;
                  }
              });
            }
            else
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
            
        }

        vm.step_module_pmc = function()
        {   
            vm.stepparticipantpmc = false;            
            NouvelItemModule_pmc = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmodule_pmc = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });                           
                  console.log(vm.allmodule_pmc);
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvformpmc=false;
                  }
              });
            }
            else
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
             
        }

        vm.step_module_sep = function()
        {   
            vm.stepparticipantsep = false;            
            NouvelItemModule_sep = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmodule_sep = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });                           
                  console.log(vm.allmodule_sep);
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvformsep=false;
                  }
              });
            }
            else
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
                if (vm.session=="AAC")
                {
                    apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodulevalideById','id_module',module_dpp.id).then(function(result)
                    { 
                      var module_dpp_valide = result.data.response;
                      if (module_dpp_valide.length !=0)
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
                          vm.allmodule_dpp = vm.allmodule_dpp.filter(function(obj)
                          {
                              return obj.id !== module_dpp.id;
                          });
                          vm.stepparticipantdpp=false;
                        }, function() {
                          //alert('rien');
                        });
                      }
                      else
                      {
                        test_existanceModule_dpp (module_dpp,suppression);                   
                      }
                    });
                }
                else
                {
                  test_existanceModule_dpp (module_dpp,suppression);
                }
                 
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
            //item.id_contrat_partenaire_relai  = vm.selectedItemModule_dpp.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_dpp.lieu_formation;
            vm.stepparticipantdpp=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_dpp = function()
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
                        //vm.selectedItemModule_dpp.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
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
                  //module_dpp.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                if (vm.session=="AAC")
                {
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodulevalideById','id_module',module_odc.id).then(function(result)
                    { 
                      var module_odc_valide = result.data.response;
                      if (module_odc_valide.length !=0)
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
                          vm.allmodule_odc = vm.allmodule_odc.filter(function(obj)
                          {
                              return obj.id !== module_odc.id;
                          });
                          vm.stepparticipantodc=false;
                        }, function() {
                          //alert('rien');
                        });
                      }
                      else
                      {
                        test_existanceModule_odc (module_odc,suppression);                   
                      }
                    });
                }
                else
                {
                  test_existanceModule_odc (module_odc,suppression); 
                }            
                 
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
            //item.id_classification_site = currentItemModule_odc.id_prestataire ;
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
            vm.NouvelItemModule_odc   = item;
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
            //item.id_contrat_partenaire_relai  = vm.selectedItemModule_odc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_odc.lieu_formation;
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_odc.contrat_partenaire_relai);
            vm.showbuttonValidationformodc =false;
            vm.stepparticipantodc=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_odc = function()
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
                   // || (pass[0].id_classification_site != currentItemModule_odc.id_classification_site )
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
                        //vm.selectedItemModule_odc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
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
                  //module_odc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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

                if (vm.session=="AAC")
                {
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodulevalideById','id_module',module_emies.id).then(function(result)
                    { 
                      var module_emies_valide = result.data.response;
                      if (module_emies_valide.length !=0)
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
                          vm.allmodule_emies = vm.allmodule_emies.filter(function(obj)
                          {
                              return obj.id !== module_emies.id;
                          });
                          vm.stepparticipantemies=false;
                        }, function() {
                          //alert('rien');
                        });
                      }
                      else
                      {
                        test_existanceModule_emies (module_emies,suppression);                   
                      }
                    });
                }
                else
                {
                  test_existanceModule_emies (module_emies,suppression);
                }
                 
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
           // item.id_contrat_partenaire_relai  = vm.selectedItemModule_emies.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_emies.lieu_formation;
            vm.stepparticipantemies=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_emies = function()
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                if (vm.session=="AAC")
                {
                    apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodulevalideById','id_module',module_gfpc.id).then(function(result)
                  { 
                    var module_gfpc_valide = result.data.response;
                    if (module_gfpc_valide.length !=0)
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
                        vm.allmodule_gfpc = vm.allmodule_gfpc.filter(function(obj)
                        {
                            return obj.id !== module_gfpc.id;
                        });
                        vm.stepparticipantgfpc=false;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceModule_gfpc (module_gfpc,suppression);                   
                    }
                  });
                }
                else
                {
                  test_existanceModule_gfpc (module_gfpc,suppression); 
                }
                
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
            //item.id_contrat_partenaire_relai  = vm.selectedItemModule_gfpc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_gfpc.lieu_formation;
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_gfpc.contrat_partenaire_relai);
            vm.showbuttonValidationformgfpc =false;
            vm.stepparticipantgfpc=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_gfpc = function()
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
                        //vm.selectedItemModule_gfpc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
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
                  //module_gfpc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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

                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodulevalideById','id_module',module_pmc.id).then(function(result)
                  { 
                    var module_pmc_valide = result.data.response;
                    if (module_pmc_valide.length !=0)
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
                        vm.allmodule_pmc = vm.allmodule_pmc.filter(function(obj)
                        {
                            return obj.id !== module_pmc.id;
                        });
                        vm.stepparticipantpmc=false;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceModule_pmc (module_pmc,suppression);                   
                    }
                  });
                }
                else
                {
                  test_existanceModule_pmc (module_pmc,suppression); 
                }
                 
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
            //item.id_contrat_partenaire_relai  = vm.selectedItemModule_pmc.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_pmc.lieu_formation;
            vm.stepparticipantpmc=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_pmc = function()
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
                        //vm.selectedItemModule_pmc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
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
                  //module_pmc.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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

                if (vm.session=="AAC")
                {
                    apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodulevalideById','id_module',module_sep.id).then(function(result)
                  { 
                    var module_sep_valide = result.data.response;
                    if (module_sep_valide.length !=0)
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
                        vm.allmodule_sep = vm.allmodule_sep.filter(function(obj)
                        {
                            return obj.id !== module_sep.id;
                        });
                        vm.stepparticipantsep=false;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceModule_sep (module_sep,suppression);                   
                    }
                  });
                }
                else
                {
                  test_existanceModule_sep (module_sep,suppression);
                }
                 
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
            //item.id_contrat_partenaire_relai  = vm.selectedItemModule_sep.contrat_partenaire_relai.id;
            item.lieu_formation  = vm.selectedItemModule_sep.lieu_formation;
            vm.stepparticipantsep=false;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerModule_sep = function()
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
                        //vm.selectedItemModule_sep.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;
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
                  //module_sep.contrat_partenaire_relai = vm.selectedItemContrat_partenaire_relai;

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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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

    /*******************************************fin importer passation moe***************************************************/



        vm.step_menu_moe = function ()
        {   
            vm.tabmaitrise = true;
            vm.showbuttonNouvPassation_moe=true;            
            vm.stepprestation_moe = false;
            vm.stepdoc_moe=false;
            vm.step_contrat_moe_onglet = false;
            vm.stepcalendrier_paie_moe = false;
            NouvelItemPassation_marches_moe = false;
            vm.affiche_load = true;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allpassation_marches_moe = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  }); 
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvPassation_moe=false;
                  }
                  vm.step_contrat_moe_onglet = true;
                  vm.affiche_load = false;
                                  
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allpassation_marches_moe = result.data.response; 
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvPassation_moe=false;
                  }
                  vm.step_contrat_moe_onglet = true;
                  vm.affiche_load = false;
                                  
              });
            }
            
            
        }
      /**************************************fin passation marchés***************************************************/
       vm.click_passation_marches_moe = function ()
        { 
            vm.affiche_load = true;
            vm.showbuttonNouvPassation_moe=true;
            NouvelItemPassation_marches_moe = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allpassation_marches_moe = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  }); 
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvPassation_moe=false;
                  }
                  vm.affiche_load = false;                                
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allpassation_marches_moe = result.data.response; 
                  if (result.data.response.length!=0)
                  {
                      vm.showbuttonNouvPassation_moe=false;
                  }
                  vm.affiche_load = false;                                
              });
            }
            
            
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
         /*vm.showtabmaitrise = function()
        {
            vm.tabmaitrise = true;
            console.log(vm.tabmaitrise);
        }*/
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
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationvalideById','id_passation_moe',passation_marches_moe.id).then(function(result)
                  {
                    var passation_marches_moe_valide = result.data.response;
                    if (passation_marches_moe_valide.length !=0)
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
                        vm.allpassation_marches_moe = vm.allpassation_marches_moe.filter(function(obj)
                        {
                            return obj.id !== passation_marches_moe.id;
                        });
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existancePassation_marches_moe (passation_marches_moe,suppression);                  
                    }
                  });
                }
                else
                {
                  test_existancePassation_marches_moe (passation_marches_moe,suppression); 
                }
                 
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
            if (item.$edit == false || item.$edit ==undefined)
            {
              currentItemPassation_marches_moe    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches_moe));
              
            }
            if (item.id!=0)
            {
              vm.validation_passation_moe = item.validation;
            }
            console.log(currentItemPassation_marches_moe);
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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


        vm.step_contrat_moe = function ()
        {   
            vm.showbuttonNouvcontrat_moe=true;                       
            vm.stepprestation_moe = false;
            vm.stepdoc_moe=false;
            vm.stepcalendrier_paie_moe=false;
            vm.sousrubrique_calendrier=false;
            vm.calendrier_prevu=false;
            vm.affiche_load = true; 
            NouvelItemContrat_moe = false;               
                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                        vm.allcontrat_moe = result.data.response;
                        console.log(vm.allcontrat_moe);
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvcontrat_moe=false;
                    }
                    vm.affiche_load = false;
                vm.styleTabfils = "acc_sous_menu";
                               
            });
        }
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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterContrat_moe = function ()
        { 
          //vm.allmoe = [];
          if (NouvelItemContrat_moe == false)
          { 
            var items = {}; 

                apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getdate_contratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
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
                              date_signature: new Date(passation[0].date_signature_contrat),
                              //notification_intention: new Date(passation[0].notification_intention),
                              //date_notification_attribution: new Date(passation[0].date_notification_attribution),
                              passation:passation[0],
                              date_os: new Date(passation[0].date_os),
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
                        }
                        else
                        {
                            vm.showAlert('Ajout contrat MOE','La date de contrat est vide dans la passation des marchés!!!');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout contrat MOE','La passation des marchés est vide!!!');
                    }                    
                                
                });
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
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideById','id_contrat_moe',contrat_moe.id).then(function(result)
                  {
                    var contrat_moe_valide = result.data.response;
                    if (contrat_moe_valide.length !=0)
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
                          vm.stepcalendrier_paie_moe=false;
                          vm.allcontrat_moe = contrat_moe_valide; 
                          vm.selectedItemContrat_moe ={};
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceContrat_moe (contrat_moe,suppression);                 
                    }
                  });
                }
                else
                {
                  test_existanceContrat_moe (contrat_moe,suppression);
                }
                  
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
          vm.allmoe = [];
        };

        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;
            
            if (item.$edit==false || item.$edit==undefined)
            {
                currentItemContrat_moe    = JSON.parse(JSON.stringify(vm.selectedItemContrat_moe));   
            }

           if(item.id!=0)
           {
            vm.stepprestation_moe = true;

            vm.stepdoc_moe=true;
            vm.validation_contrat_moe = item.validation;            
            vm.stepcalendrier_paie_moe=true;
            vm.sousrubrique_calendrier=false;
            vm.calendrier_prevu=false;
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
            //item.notification_intention = vm.injectDateinInput(vm.selectedItemContrat_moe.passation.notification_intention) ;           
            //item.date_notification_attribution = vm.injectDateinInput(vm.selectedItemContrat_moe.passation.date_notification_attribution) ;            
            //item.date_os = vm.injectDateinInput(vm.selectedItemContrat_moe.passation.date_os) ;           
            item.id_moe = vm.selectedItemContrat_moe.bureau_etude.id ;
            vm.showbuttonValidationcontrat_moe = false;
            vm.allmoe.push(vm.selectedItemContrat_moe.bureau_etude);
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
                        console.log(data);
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
              vm.stepcalendrier_paie_moe=false;
              vm.allmoe = [];
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.moeDialog = function (ev)
        {
          var moe_modif=null;
          if (NouvelItemContrat_moe==false)
          {
            moe_modif = vm.selectedItemContrat_moe.bureau_etude;
          }
          console.log(moe_modif);
          var confirm = $mdDialog.confirm({
            controller: MoeDialogController,
            templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_feffi_prestataire/convention_suivi_obcaf/moedialog.html',
            parent: angular.element(document.body),
            targetEvent: ev, 
            locals:{moeToPass: moe_modif, nouvelItem: NouvelItemContrat_moe},
            });
            $mdDialog.show(confirm).then(function(data)
            { 
              //vm.affiche_load = true;
              console.log(data);

              var doublonn = vm.allmoe.filter(function(obj)
              {
                return obj.id == data.id;
              });
              console.log(doublonn);

              if (doublonn.length == 0)
              {                
                vm.allmoe.push(data);
              }
              vm.selectedItemContrat_moe.id_moe =data.id;       
            }, function(){//alert('rien');
            });
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


        vm.step_importerdocument_moe = function()
        {
            
            vm.affiche_load = true;
            if (vm.session=="AAC")
            {              
              apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocumentinvalideBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  vm.alldocument_moe_scan = result.data.response;                 
                  vm.affiche_load = false;                       
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("dossier_moe/index",'menu','getdocumentBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  vm.alldocument_moe_scan = result.data.response;                 
                  vm.affiche_load = false;                       
              });
            }
        }
       /**********************************************Debut Dossier MOE***************************************************/
    //vm.myFile = [];
     $scope.uploadFile_doc_moe = function(event)
       {
          var files = event.target.files;
          vm.myFile = files;
        } 
   
        //fonction ajout dans bdd
        function ajoutDocument_moe_scan(document_moe_scan,suppression)
        {
            if (NouvelItemDocument_moe_scan==false)
            {          
                if (vm.session=="AAC")
                {
                    apiFactory.getAPIgeneraliserREST("document_moe_scan/index",'menu','getdocumentvalideById','id_document_moe_scan',document_moe_scan.id_document_moe_scan).then(function(result)
                  {
                    var document_moe_scan_valide = result.data.response;
                    if (document_moe_scan_valide.length !=0)
                    {
                        var confirm = $mdDialog.confirm()
                      .title('cette modification n\'est pas autorisé.')
                      .textContent('Les données sont déjà validées!')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      
                      $mdDialog.show(confirm).then(function()
                      {   
                          /*document_moe_scan.$edit = false;
                          document_moe_scan.$selected = false;
                          document_moe_scan.fichier   = currentItemDocument_moe_scan.fichier ;
                          document_moe_scan.date_elaboration   = currentItemDocument_moe_scan.date_elaboration ;
                          document_moe_scan.observation   = currentItemDocument_moe_scan.observation ;
                          vm.selectedItemDocument_moe_scan = {} ;*/

                          document_moe_scan.fichier   = null;
                          document_moe_scan.date_elaboration   = null ;
                          document_moe_scan.observation   = null ;
                          document_moe_scan.$edit = false;
                          document_moe_scan.$selected = false;

                          document_moe_scan.id_document_moe_scan = null;
                          document_moe_scan.validation   = null ;
                          document_moe_scan.existance   = false ;
                          vm.selectedItemDocument_moe_scan = {} ;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceDocument_moe_scan (document_moe_scan,suppression);           
                    }
                  });
                }
                else
                {
                  test_existanceDocument_moe_scan (document_moe_scan,suppression);
                }
                 
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

                apiFactory.getAPIgeneraliserREST("document_moe_scan/index",'menu','getdocumentBycontratdossier_prevu','id_document_moe',item.id,'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                {
                  var document_moe_scan_valide = result.data.response;
                  if (document_moe_scan_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cet ajout  n\'est pas autorisé.')
                    .textContent('Ce document existe déjà!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                         
                        item.$edit = false;
                        item.$selected = false;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {                       
                    NouvelItemDocument_moe_scan=true;
                    console.log('atonull');
                    item.fichier   = vm.selectedItemDocument_moe_scan.fichier ;
                    item.date_elaboration   = vm.datenow ;
                    item.observation   = vm.selectedItemDocument_moe_scan.observation ;
                    item.id_document_moe_scan   = '0' ;
                    item.id_contrat_bureau_etude   = vm.selectedItemContrat_moe.id ;          
                  }
                }); 

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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                                                      fichier: currentItemDocument_moe_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_moe_scan.date_elaboration),
                                                      observation: currentItemDocument_moe_scan.observation,
                                                      id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                                                      id_document_moe: currentItemDocument_moe_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_moe_scan.$selected = false;
                                          document_moe_scan.$edit = false;
                                          document_moe_scan.fichier=currentItemDocument_moe_scan.fichier;
                                          document_moe_scan.date_elaboration=currentItemDocument_moe_scan.date_elaboration;
                                          document_moe_scan.observation=currentItemDocument_moe_scan.observation;
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
                                        id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                                        id_document_moe: document_moe_scan.id,
                                        validation:0               
                                    });
                                  console.log(document_moe_scan);
                                  apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_moe_scan.$selected = false;
                                      document_moe_scan.$edit = false;
                                      vm.selectedItemDocument_moe_scan = {};
                                      var chemin= currentItemDocument_moe_scan.fichier;
                                      var fd = new FormData();
                                          fd.append('chemin',chemin);
                                    
                                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                                      headers: {'Content-Type': undefined}, chemin: chemin
                                      }).success(function(data)
                                      { 
                                      });
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: currentItemDocument_moe_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_moe_scan.date_elaboration),
                                                      observation: currentItemDocument_moe_scan.observation,
                                                      id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                                                      id_document_moe: currentItemDocument_moe_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_moe_scan.$selected = false;
                                          document_moe_scan.$edit = false;
                                          document_moe_scan.fichier=currentItemDocument_moe_scan.fichier;
                                          document_moe_scan.date_elaboration=currentItemDocument_moe_scan.date_elaboration;
                                          document_moe_scan.observation=currentItemDocument_moe_scan.observation;
                                          vm.selectedItemDocument_moe_scan = {};
                                      
                                      });
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
                          showAlert(event,chemin);
                      });
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
                                                id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                                                id_document_moe: document_moe_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                { 
                                    document_moe_scan.$selected = false;
                                    document_moe_scan.$edit = false;
                                    document_moe_scan.validation = null;
                                    document_moe_scan.date_elaboration = null;
                                    document_moe_scan.observation = null;
                                    document_moe_scan.id_document_moe_scan = null;
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
                                  id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
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
                        var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_moe_scan.fichier,
                                                date_elaboration: convertionDate(document_moe_scan.date_elaboration),
                                                observation: document_moe_scan.observation,
                                                id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                                                id_document_moe: document_moe_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                { 
                                    document_moe_scan.$selected = false;
                                    document_moe_scan.$edit = false;
                                    document_moe_scan.fichier = null;
                                    document_moe_scan.validation = null;
                                    document_moe_scan.date_elaboration = null;
                                    document_moe_scan.observation = null;
                                    document_moe_scan.id_document_moe_scan = null;
                                    vm.selectedItemDocument_moe_scan = {};
                                });
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
            window.open(apiUrlFile+item.fichier);
        }


    /******************************************debut dossier MOE***********************************************/


        vm.step_avenant_moe = function()
        {            
            vm.affiche_load = true;
            NouvelItemAvenant_moe = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  vm.allavenant_moe = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });
                  vm.showbuttonNouvavenant_moe = true;
                  console.log(vm.allavenant_moe);

                  vm.affiche_load = false;
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  vm.allavenant_moe = result.data.response;
                  vm.showbuttonNouvavenant_moe = true;
                  console.log(vm.allavenant_moe);

                  vm.affiche_load = false;
              });
            }
            
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
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("avenant_be/index","menu","getavenantvalideById",'id_avenant_moe',avenant_moe.id).then(function(result)
                  {
                    var avenant_moe_valide = result.data.response;
                    if (avenant_moe_valide.length !=0)
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
                        vm.allavenant_moe = vm.allavenant_moe.filter(function(obj)
                        {
                            return obj.id !== avenant_moe.id;
                        });
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceAvenant_moe (avenant_moe,suppression);           
                    }
                  });
                }
                else
                {
                  test_existanceAvenant_moe (avenant_moe,suppression);
                }
                 
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
            }
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
            item.date_signature = vm.injectDateinInput(vm.selectedItemAvenant_moe.date_signature) ;            
            vm.showbuttonValidation_avenant_moe = false;
        };

        //fonction bouton suppression item Avenant_moe
        vm.supprimerAvenant_moe = function()
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
                       // vm.selectedItemAvenant_moe.contrat_be = conve[0];
                        
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
                  //avenant_moe.contrat_be = conve[0];
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

        vm.step_prestation_moe = function()
        {            
            vm.affiche_load = true;
            vm.step_appel = false;
            vm.step_rapport = false;
            vm.step_manuel = false;
            vm.step_police = false;
            vm.showbuttonNouvMemoire_technique = true;            
            NouvelItemMemoire_technique = false;
            if (vm.session=="AAC")
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
                    vm.step_appel = true;
                    vm.step_rapport = true;
                    vm.step_manuel = true;
                    vm.step_police = true;

                    vm.affiche_load = false;                           
                });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
                {
                    vm.allmemoire_technique = result.data.response;
                    if (result.data.response.length>0)
                    {
                        vm.showbuttonNouvMemoire_technique = false;
                    }
                    vm.step_appel = true;
                    vm.step_rapport = true;
                    vm.step_manuel = true;
                    vm.step_police = true;

                    vm.affiche_load = false;                           
                });
            }
            
        }

        vm.step_memoire_technique = function()
        {
            
            vm.affiche_load = true;
            vm.showbuttonNouvMemoire_technique = true;            
            NouvelItemMemoire_technique = false;
            if (vm.session=="AAC")
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

                  vm.affiche_load = false;                           
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
              {
                  vm.allmemoire_technique = result.data.response;
                  if (result.data.response.length>0)
                  {
                      vm.showbuttonNouvMemoire_technique = false;
                  }

                  vm.affiche_load = false;                           
              });
            }
            
        }

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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoirevalideById','id_memoire_technique',memoire_technique.id).then(function(result)
                {
                  var memoire_technique_valide = result.data.response;
                  if (memoire_technique_valide.length !=0)
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
                      vm.allmemoire_technique = vm.allmemoire_technique.filter(function(obj)
                      {
                          return obj.id !== memoire_technique.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceMemoire_technique (memoire_technique,suppression);                 
                  }
                });
              }
              else
              {
                test_existanceMemoire_technique (memoire_technique,suppression);
              }
                 
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
            item.date_livraison   = vm.injectDateinInput(vm.selectedItemMemoire_technique.date_livraison) ;
            item.date_approbation   = vm.injectDateinInput(vm.selectedItemMemoire_technique.date_approbation) ;
            item.observation   = vm.selectedItemMemoire_technique.observation ;

            //item.id_contrat_bureau_etude   = vm.selectedItemMemoire_technique.contrat_be.id ;
            vm.showbuttonValidationMemoire_technique = false;
        };

        //fonction bouton suppression item memoire_technique
        vm.supprimerMemoire_technique = function()
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
                         
                        //vm.selectedItemMemoire_technique.contrat_be = vm.selectedItemContrat_moe;
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
                  //memoire_technique.contrat_be = vm.selectedItemContrat_moe;
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

        vm.step_appel_offre = function()
        {
            
            vm.affiche_load = true;
            vm.showbuttonNouvAppel_offre = true;
            NouvelItemAppel_offre = false;
            if (vm.session=="AAC")
            {
              apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allappel_offre = result.data.response.filter(function(obj)
                {
                    return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                     vm.showbuttonNouvAppel_offre = false;
                } 

                vm.affiche_load = false;                         
            });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allappel_offre = result.data.response;
                if (result.data.response.length>0)
                {
                     vm.showbuttonNouvAppel_offre = false;
                } 

                vm.affiche_load = false;                         
            });
            }
            
        }
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelvalideById','id_appel_offre',appel_offre.id).then(function(result)
                {
                  var appel_offre_valide = result.data.response;
                  if (appel_offre_valide.length !=0)
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
                      vm.allappel_offre = vm.allappel_offre.filter(function(obj)
                      {
                          return obj.id !== appel_offre.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceAppel_offre (appel_offre,suppression);                
                  }
                }); 
              }
              else
              {
                test_existanceAppel_offre (appel_offre,suppression);
              }
                
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
            item.date_livraison   = vm.injectDateinInput(vm.selectedItemAppel_offre.date_livraison) ;
            item.date_approbation   = vm.injectDateinInput(vm.selectedItemAppel_offre.date_approbation) ;
            item.observation   = vm.selectedItemAppel_offre.observation ;
            //item.id_contrat_bureau_etude   = vm.selectedItemAppel_offre.contrat_be.id ;
             vm.showbuttonValidationAppel_offre = false;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item appel_offre
        vm.supprimerAppel_offre = function()
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
                        //vm.selectedItemAppel_offre.contrat_be = vm.selectedItemContrat_moe;
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
                  //appel_offre.contrat_be = vm.selectedItemContrat_moe; 
                  appel_offre.validation = 0;            
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


        vm.step_rapport_mensuel = function()
        {
            
            vm.affiche_load = true;
            vm.showbuttonNouvRapport_mensuel = true;
            NouvelItemRapport_mensuel = false;
            if (vm.session=="AAC")
            {
                apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  vm.allrapport_mensuel = result.data.response.filter(function(obj)
                  {
                        return obj.validation == 0;
                  });
                  if (result.data.response.length==4)
                  {
                      vm.showbuttonNouvRapport_mensuel = false;
                  }

                  vm.affiche_load = false;                           
              });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allrapport_mensuel = result.data.response;
                if (result.data.response.length==4)
                {
                    vm.showbuttonNouvRapport_mensuel = false;
                }

                vm.affiche_load = false;                           
            });
            }
            
        }
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportvalideById','id_rapport_mensuel',rapport_mensuel.id).then(function(result)
                {
                  var rapport_mensuel_valide = result.data.response;
                  if (rapport_mensuel_valide.length !=0)
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
                      vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
                      {
                          return obj.id !== rapport_mensuel.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceRapport_mensuel (rapport_mensuel,suppression);               
                  }
                });
              }
              else
              {
                test_existanceRapport_mensuel (rapport_mensuel,suppression); 
              }
                 
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
            //item.id_contrat_bureau_etude   = vm.selectedItemRapport_mensuel.contrat_be.id ;
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                        //vm.selectedItemRapport_mensuel.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemRapport_mensuel.$selected  = false;
                        vm.selectedItemRapport_mensuel.$edit      = false;
                        vm.selectedItemRapport_mensuel ={};
                    }
                    else 
                    {    
                      vm.allrapport_mensuel = vm.allrapport_mensuel.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemRapport_mensuel.id;
                      });
                      vm.showbuttonNouvRapport_mensuel = true;
                    }
              }
              else
              {   
                  //rapport_mensuel.contrat_be = vm.selectedItemContrat_moe;
                  rapport_mensuel.id  =   String(data.response);              
                  NouvelItemRapport_mensuel = false; 
                  vm.validation_rapport_mensuel = 0;
                  rapport_mensuel.validation = 0;
              }
              rapport_mensuel.$selected = false;
              rapport_mensuel.$edit = false;
                vm.showbuttonNouvRapport_mensuel = true;
              vm.selectedItemRapport_mensuel = {};
              apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
            {
                var count_rapport = result.data.response;
                if (count_rapport.length>=4)
                {
                    vm.showbuttonNouvRapport_mensuel = false;
                }

                vm.affiche_load = false;                           
            });
                  

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
      /**************************************Fin rapport mensuel***************************************************/

 /*******************************************debut importer mamoire technique*************************************************/


        vm.step_manuel_gestion = function()
        {
            
            vm.affiche_load = true;
            vm.showbuttonNouvManuel_gestion = true;
            NouvelItemManuel_gestion = false;
            if (vm.session=="AAC")
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

                vm.affiche_load = false;                          
            });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allmanuel_gestion = result.data.response;
                if (result.data.response.length>0)
                {
                     vm.showbuttonNouvManuel_gestion = false;
                }

                vm.affiche_load = false;                          
            });
            }
            
        }
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelvalideById','id_manuel_gestion',manuel_gestion.id).then(function(result)
                {
                  var manuel_gestion_valide = result.data.response;
                  if (manuel_gestion_valide.length !=0)
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
                      vm.allmanuel_gestion = vm.allmanuel_gestion.filter(function(obj)
                      {
                          return obj.id !== manuel_gestion.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceManuel_gestion (manuel_gestion,suppression);              
                  }
                });
              }
              else
              {
                test_existanceManuel_gestion (manuel_gestion,suppression); 
              }
                 
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
                if (item.$edit ==false || item.$edit==undefined)
                {
                    currentItemManuel_gestion    = JSON.parse(JSON.stringify(vm.selectedItemManuel_gestion));
                }
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
            //item.id_contrat_bureau_etude   = vm.selectedItemManuel_gestion.contrat_be.id ;
             vm.showbuttonValidationManuel_gestion = false;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item manuel_gestion
        vm.supprimerManuel_gestion = function()
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
                        
                        //vm.selectedItemManuel_gestion.contrat_be = vm.selectedItemContrat_moe;
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
                  //manuel_gestion.contrat_be = vm.selectedItemContrat_moe;
                  manuel_gestion.id  =   String(data.response);              
                  NouvelItemManuel_gestion = false;

                  vm.showbuttonNouvManuel_gestion = false;

                  manuel_gestion.validation = 0;
                  vm.validation_manuel_gestion = 0;
                    
              }
              manuel_gestion.$selected = false;
              manuel_gestion.$edit = false;
              vm.selectedItemManuel_gestion = {};

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

    /*******************************************fin importer mamoire technique***************************************************/


        vm.step_police_assurance = function()
        {
            
            vm.affiche_load = true;
            vm.showbuttonNouvPolice_assurance = true;
            NouvelItemPolice_assurance = false;
            if (vm.session=="AAC")
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

                vm.affiche_load = false;                                                   
            });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'validation',0).then(function(result)
            {
                vm.allpolice_assurance = result.data.response;
                if (result.data.response.length>0)
                {
                 vm.showbuttonNouvPolice_assurance = false;
                }

                vm.affiche_load = false;                                                   
            });
            }
            
        }
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpolicevalideById','id_police_assurance_moe',police_assurance.id).then(function(result)
                {
                  var police_assurance_valide = result.data.response;
                  if (police_assurance_valide.length !=0)
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
                      vm.allpolice_assurance = vm.allpolice_assurance.filter(function(obj)
                      {
                          return obj.id !== police_assurance.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existancePolice_assurance (police_assurance,suppression);            
                  }
                });
              }
              else
              {
                test_existancePolice_assurance (police_assurance,suppression); 
              }
                 
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
            //item.id_contrat_bureau_etude   = vm.selectedItemPolice_assurance.contrat_be.id ;
            
        };

        //fonction bouton suppression item police_assurance
        vm.supprimerPolice_assurance = function()
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
                        //vm.selectedItemPolice_assurance.contrat_be = vm.selectedItemContrat_moe;
                        vm.selectedItemPolice_assurance.$selected  = false;
                        vm.selectedItemPolice_assurance.$edit      = false;
                        vm.selectedItemPolice_assurance ={};
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
                  //police_assurance.contrat_be = vm.selectedItemContrat_moe;
                  police_assurance.id  =   String(data.response);              
                  NouvelItemPolice_assurance = false;

                  vm.showbuttonNouvPolice_assurance = false;
                  police_assurance.validation = 0;
                  vm.validation_police_assurance = 0;
                    
              }
              
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

    /*******************************************fin importer passation moe***************************************************/

/**********************************debut passation_marches****************************************/

vm.step_menu_mpe = function ()
{   vm.tabentreprise = true;
    vm.affiche_load = true;
    vm.stepsoumissionnaire = false;
    vm.step_detail_contrat_mpe = false;
    vm.stepattachement = false;
    vm.stepsuiviexecution = false;
    vm.stepavenant_mpe = false;
    vm.step_importer_doc_mpe = false;
    vm.showbuttonNouvPassation=true;    
    NouvelItemPassation_marches = false;
    if (vm.session=="AAC")
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
            vm.step_detail_contrat_mpe = true;
            vm.affiche_load = false;
        });
    }
    else
    {
      apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
        {
            vm.allpassation_marches = result.data.response;
            if (result.data.response.length!=0)
            {
               vm.showbuttonNouvPassation=false;
            }
            vm.step_detail_contrat_mpe = true;
            vm.affiche_load = false;
        });
    }
        
   
}
vm.steppassation_marches = function()
{
    vm.affiche_load = true;    
    NouvelItemPassation_marches = false;
    vm.stepsoumissionnaire = false;
    if (vm.session=="AAC")
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
          vm.affiche_load = false;
      });
    }
    else
    {
      apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
      {
          vm.allpassation_marches = result.data.response;
          if (result.data.response.length!=0)
          {
              vm.showbuttonNouvPassation=false;
          }
          vm.affiche_load = false;
      });
    }
    
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
              date_signature_contrat:'',
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
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu',"getpassationvalideById",'id_passation_mpe',passation_marches.id).then(function(result)
                  {
                    var passation_marches_valide = result.data.response;
                    if (passation_marches_valide.length !=0)
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
                        vm.allpassation_marches = vm.allpassation_marches.filter(function(obj)
                        {
                            return obj.id !== passation_marches.id;
                        });
                        vm.stepsoumissionnaire = false;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existancePassation_marches (passation_marches,suppression);          
                    }
                  }); 
                }
                else
                {
                  test_existancePassation_marches (passation_marches,suppression); 
                }
                
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
            item.date_notification_attribution  = currentItemPassation_marches.date_notification_attribution;
            item.date_signature_contrat  = currentItemPassation_marches.date_signature_contrat;
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
            if (item.$edit == false || item.$edit == undefined)
            {
              currentItemPassation_marches    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches));
            }
            
           if(item.id!=0)
           {

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
            item.date_os   = vm.injectDateinInput(vm.selectedItemPassation_marches.date_os );
            item.date_remise   = vm.injectDateinInput(vm.selectedItemPassation_marches.date_remise );
            item.date_ano_dpfi = vm.injectDateinInput(vm.selectedItemPassation_marches.date_ano_dpfi);
            item.nbr_offre_recu = vm.selectedItemPassation_marches.nbr_offre_recu;
            item.date_lancement = vm.injectDateinInput(vm.selectedItemPassation_marches.date_lancement) ;
            item.montant_moin_chere = parseFloat(vm.selectedItemPassation_marches.montant_moin_chere)  ;
            item.date_demande_ano_dpfi    = vm.injectDateinInput(vm.selectedItemPassation_marches.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = vm.injectDateinInput(vm.selectedItemPassation_marches.date_rapport_evaluation) ;
            item.notification_intention   = vm.injectDateinInput(vm.selectedItemPassation_marches.notification_intention);
            item.date_notification_attribution  = vm.injectDateinInput(vm.selectedItemPassation_marches.date_notification_attribution);
            item.date_signature_contrat  = vm.injectDateinInput(vm.selectedItemPassation_marches.date_signature_contrat);
            vm.showbuttonValidationpassation = false;
        };

        //fonction bouton suppression item passation_marches
        vm.supprimerPassation_marches = function()
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

                       // vm.selectedItemPassation_marches.convention_entete = vm.selectedItemConvention_entete;
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
                  //passation_marches.convention_entete = vm.selectedItemConvention_entete;
                  passation_marches.validation=0;
                  passation_marches.id  =   String(data.response);              
                  NouvelItemPassation_marches=false;
                  vm.showbuttonNouvPassation= false;
                }
              passation_marches.$selected = false;
              passation_marches.$edit = false;
              vm.selectedItemPassation_marches = {};
              vm.stepsoumissionnaire = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin passation_marches****************************************/

 /*******************************************debut importer passation moe*************************************************/
        vm.stepmpe_soumissionaire = function()
        {            
          
         /* apiFactory.getAll("prestataire/index").then(function(result)
          {
              vm.allprestataire= result.data.response;
          });*/
          NouvelItemMpe_soumissionaire = false;         
            apiFactory.getAPIgeneraliserREST("mpe_soumissionaire/index",'id_passation_marches',vm.selectedItemPassation_marches.id).then(function(result)
            {
                vm.allmpe_soumissionaire = result.data.response;
            });
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
          //vm.allprestataire=[];
          if (NouvelItemMpe_soumissionaire == false)
          {
            apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu',"getpassationvalideById",'id_passation_mpe',vm.selectedItemPassation_marches.id).then(function(result)
                {
                  var passation_marches_valide = result.data.response;
                  if (passation_marches_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('Cette action ne peut pas être réalisée. Les données sont déjà validées!')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.stepsoumissionnaire = false;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
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
                  }
                });
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
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu',"getpassationvalideById",'id_passation_mpe',vm.selectedItemPassation_marches.id).then(function(result)
                  {
                    var passation_marches_valide = result.data.response;
                    if (passation_marches_valide.length !=0)
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
                        vm.stepsoumissionnaire = false;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceMpe_soumissionaire (mpe_soumissionaire,suppression);        
                    }
                  });
                }
                else
                {
                  test_existanceMpe_soumissionaire (mpe_soumissionaire,suppression); 
                }
                 
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
          vm.allprestataire = [];
          
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
            item.id_prestataire   = vm.selectedItemMpe_soumissionaire.prestataire.id ;
            item.telephone   = vm.selectedItemMpe_soumissionaire.prestataire.telephone ;
            item.siege   = vm.selectedItemMpe_soumissionaire.prestataire.siege ;
            vm.allprestataire.push(vm.selectedItemMpe_soumissionaire.prestataire);
        };

        //fonction bouton suppression item Mpe_soumissionaire
        vm.supprimerMpe_soumissionaire = function()
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
              vm.allprestataire = [];
            
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
        vm.entrepriseDialog = function (ev)
        {
          var entreprise_modif=null;
          if (NouvelItemMpe_soumissionaire==false)
          {
            entreprise_modif = vm.selectedItemMpe_soumissionaire.prestataire;
          }
          console.log(entreprise_modif);
          var confirm = $mdDialog.confirm({
            controller: EntrepriseDialogController,
            templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_feffi_prestataire/convention_suivi_obcaf/entreprisedialog.html',
            parent: angular.element(document.body),
            targetEvent: ev, 
            locals:{entrepriseToPass: entreprise_modif, nouvelItem: NouvelItemMpe_soumissionaire},
            });
            $mdDialog.show(confirm).then(function(data)
            { 
              vm.affiche_load = true;
              console.log(data);

              var doublonn = vm.allprestataire.filter(function(obj)
              {
                return obj.id == data.id;
              });
              console.log(doublonn);

              if (doublonn.length == 0)
              {                
                vm.allprestataire.push(data);
              }
              vm.selectedItemMpe_soumissionaire.id_prestataire =data.id;
              vm.selectedItemMpe_soumissionaire.telephone =data.telephone; 
              vm.selectedItemMpe_soumissionaire.siege =data.siege;       
            }, function(){//alert('rien');
            });
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
            vm.showbuttonNouvContrat_prestataire=false;
            vm.affiche_load = true;
            vm.showbuttonimporter_contrat_mpe = false;            
            NouvelItemContrat_prestataire = false;
            
        apiFactory.getAPIgeneraliserREST("prestataire/index",'menu','prestataireBysousmissionnaire','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(resultpre)
        {
            vm.allprestataire= resultpre.data.response;
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    vm.stepattachement = false;
                    vm.stepsuiviexecution = false;
                    vm.stepavenant_mpe = false;
                    vm.step_importer_doc_mpe = false;                    
                    vm.showbuttonNouvContrat_prestataire = true;
                    vm.showbuttonimporter_contrat_mpe = true;
                    if (result.data.response.length!=0)
                    {
                        vm.showbuttonNouvContrat_prestataire=false;
                    }

                    vm.affiche_load = false;
                });
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
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterContrat_prestataire = function ()
        { 
          if (NouvelItemContrat_prestataire == false)
          {
            var items = {}; 

                apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getdate_contratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
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
                              description: '',
                              num_contrat: '',
                              cout_batiment: 0,
                              cout_latrine: 0,
                              cout_mobilier:0,
                              montant_total_ht:0,
                              montant_total_ttc:0,
                             // date_signature: vm.injectDateinInput(passation[0].date_signature_contrat) ,
                              passation: passation[0],
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

          }
          else
          {
            vm.showAlert('Ajout contrat_prestataire','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutContrat_prestataire(contrat_prestataire,suppression)
        {
            if (NouvelItemContrat_prestataire==false)
            {
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus',"getcontrat_mpevalideById",'id_contrat_mpe',contrat_prestataire.id).then(function(result)
                  {
                    var contrat_prestataire_valide = result.data.response;
                    if (contrat_prestataire_valide.length !=0)
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
                        vm.allcontrat_prestataire = contrat_prestataire_valide;
                          vm.stepattachement = false;
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceContrat_prestataire (contrat_prestataire,suppression);         
                    }
                  });
                }
                else
                {
                  test_existanceContrat_prestataire (contrat_prestataire,suppression);
                }
                 
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
            //item.date_signature = currentItemContrat_prestataire.date_signature ;
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
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemContrat_prestataire    = JSON.parse(JSON.stringify(vm.selectedItemContrat_prestataire)); 
            }
            
           if(item.id!=0)
           {
                vm.stepattachement = true;
                vm.stepsuiviexecution = true;
                vm.stepavenant_mpe = true;
                vm.step_importer_doc_mpe = true;
                vm.validation_contrat_prestataire = item.validation;
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
            //item.date_signature = new Date(vm.selectedItemContrat_prestataire.date_signature) ;
            item.montant_total_ttc = parseFloat(vm.selectedItemContrat_prestataire.montant_total_ttc);
            item.montant_total_ht = parseFloat(vm.selectedItemContrat_prestataire.montant_total_ht);
            //item.date_prev_deb_trav = new Date(vm.selectedItemContrat_prestataire.date_prev_deb_trav) ;
            //item.date_reel_deb_trav = new Date(vm.selectedItemContrat_prestataire.date_reel_deb_trav) ;
            //item.delai_execution = parseInt(vm.selectedItemContrat_prestataire.delai_execution) ;
            item.id_prestataire = vm.selectedItemContrat_prestataire.prestataire.id ;
           // vm.showbuttonValidationcontrat_prestataire = false;
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
                    //|| (pass[0].date_signature != currentItemContrat_prestataire.date_signature )
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
                    //date_signature:convertionDate(contrat_prestataire.date_signature),
                    id_prestataire:contrat_prestataire.id_prestataire,
                   // paiement_recu: 0,
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
             // vm.showbuttonValidationcontrat_prestataire = false;
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

 /*********************************************fin avenant mpe***********************************************/
        vm.step_avenant_mpe = function()
        {   vm.affiche_load = true;
          NouvelItemAvenant_mpe = false;
          
          if (vm.session=="AAC")
          {            
            apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantinvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavenant_mpe = result.data.response;
                vm.affiche_load = false;
                vm.showbuttonNouvavenant_mpe = true;
            });
          }
          else
          {
            apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavenant_mpe = result.data.response;
                vm.affiche_load = false;
                vm.showbuttonNouvavenant_mpe = true;
            });
          }
        }
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
              cout_total_ht: 0,
              cout_total_ttc: 0,
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
        vm.change_cout_avenant= function(item)
        {   console.log(item);
            item.cout_total_ht = (parseFloat(item.cout_batiment) + parseFloat(item.cout_latrine) + parseFloat(item.cout_mobilier))/1;
            item.cout_total_ttc = parseFloat(item.cout_batiment) + parseFloat(item.cout_latrine) + parseFloat(item.cout_mobilier);
        }

        //fonction ajout dans bdd
        function ajoutAvenant_mpe(avenant_mpe,suppression)
        {
            if (NouvelItemAvenant_mpe==false)
            {   
                if (vm.session=="AAC")
                {
                  apiFactory.getAPIgeneraliserREST("avenant_prestataire/index",'menu',"getavenant_mpevalideById",'id_avenant_mpe',avenant_mpe.id).then(function(result)
                  {
                    var avenant_mpe_valide = result.data.response;
                    if (avenant_mpe_valide.length !=0)
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
                          vm.allavenant_mpe = vm.allavenant_mpe.filter(function(obj)
                          {
                              return obj.id !== avenant_mpe.id;
                          });
                      }, function() {
                        //alert('rien');
                      });
                    }
                    else
                    {
                      test_existanceAvenant_mpe (avenant_mpe,suppression);       
                    }
                  });
                }
                else
                {
                  test_existanceAvenant_mpe (avenant_mpe,suppression);
                }
                 
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
            item.cout_mobilier   = currentItemAvenant_mpe.cout_mobilier ;
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
            item.cout_batiment   = parseFloat(vm.selectedItemAvenant_mpe.cout_batiment) ;
            item.cout_latrine   = parseFloat(vm.selectedItemAvenant_mpe.cout_latrine) ;
            item.cout_mobilier   = parseFloat(vm.selectedItemAvenant_mpe.cout_mobilier) ;
            item.cout_total_ht   = vm.selectedItemAvenant_mpe.cout_total_ht ;
            item.cout_total_ttc   = vm.selectedItemAvenant_mpe.cout_total_ttc ;
            item.date_signature = new Date(vm.selectedItemAvenant_mpe.date_signature) ;            
            vm.showbuttonValidation_avenant_mpe = false;
        };

        //fonction bouton suppression item Avenant_mpe
        vm.supprimerAvenant_mpe = function()
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
                        //vm.selectedItemAvenant_mpe.contrat_prestataire = conve[0];
                        
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
                 // avenant_mpe.contrat_prestataire = conve[0];
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


        vm.step_importerdocument_mpe = function()
        {   vm.affiche_load = true;
          if (vm.session=="AAC")
          {
            apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocumentinvalideBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldocument_prestataire_scan = result.data.response;
                vm.affiche_load = false;
                                        
            });
          }
          else
          {
            apiFactory.getAPIgeneraliserREST("dossier_prestataire/index",'menu','getdocumentBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldocument_prestataire_scan = result.data.response;
                vm.affiche_load = false;
                                        
            });
          }
            
        }

     $scope.uploadFile_doc_pre = function(event)
       {
          var files = event.target.files;
          vm.myFile = files;
          console.log(files);
          //vm.selectedItemDocument_prestataire_scan.fichier = vm.myFile[0].name;
        } 

        //fonction ajout dans bdd
        function ajoutDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            if (NouvelItemDocument_prestataire_scan==false)
            {   
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("document_prestataire_scan/index",'menu','getdocumentvalideById','id_document_prestataire_scan',document_prestataire_scan.id_document_prestataire_scan).then(function(result)
                {
                  var document_prestataire_scan_valide = result.data.response;
                  if (document_prestataire_scan_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent('Les données sont déjà validées!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {   
                        /*document_prestataire_scan.$edit = false;
                        document_prestataire_scan.$selected = false;
                        document_prestataire_scan.fichier   = currentItemDocument_prestataire_scan.fichier ;
                        document_prestataire_scan.date_elaboration   = currentItemDocument_prestataire_scan.date_elaboration ;
                        document_prestataire_scan.observation   = currentItemDocument_prestataire_scan.observation ;
                        vm.selectedItemDocument_prestataire_scan = {} ;*/
                        
                        document_prestataire_scan.fichier   = null;
                        document_prestataire_scan.date_elaboration   = null ;
                        document_prestataire_scan.observation   = null ;
                        document_prestataire_scan.$edit = false;
                        document_prestataire_scan.$selected = false;

                        document_prestataire_scan.id_document_prestataire_scan = null;
                        document_prestataire_scan.validation   = null ;
                        document_prestataire_scan.existance   = false ;
                        vm.selectedItemDocument_prestataire_scan = {} ;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                        test_existanceDocument_prestataire_scan (document_prestataire_scan,suppression);        
                  }
                }); 
              }
              else
              {
                test_existanceDocument_prestataire_scan (document_prestataire_scan,suppression); 
              }
                
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
                apiFactory.getAPIgeneraliserREST("document_prestataire_scan/index",'menu','getdocumentBycontratdossier_prevu','id_document_prestataire',item.id,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                {
                  var document_prestataire_scan_valide = result.data.response;
                  if (document_prestataire_scan_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cet ajout  n\'est pas autorisé.')
                    .textContent('Ce document existe déjà!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                         
                        item.$edit = false;
                        item.$selected = false;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  { 
                    NouvelItemDocument_prestataire_scan=true;
                    console.log('atonull');
                    item.fichier   = vm.selectedItemDocument_prestataire_scan.fichier ;
                    item.date_elaboration   = vm.datenow ;
                    item.observation   = vm.selectedItemDocument_prestataire_scan.observation ;
                    item.id_document_prestataire_scan   = '0' ;
                    item.id_contrat_prestataire   = vm.selectedItemContrat_prestataire.id ;         
                  }
                }); 

            }
            else
            {NouvelItemDocument_prestataire_scan = false ;
                console.log('tsnull');
                item.fichier   = vm.selectedItemDocument_prestataire_scan.fichier ;
                item.date_elaboration   = vm.injectDateinInput(vm.selectedItemDocument_prestataire_scan.date_elaboration) ;
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                                                      fichier: currentItemDocument_prestataire_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_prestataire_scan.date_elaboration),
                                                      observation: currentItemDocument_prestataire_scan.observation,
                                                      id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                                                      id_document_prestataire: currentItemDocument_prestataire_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_prestataire_scan.$selected = false;
                                          document_prestataire_scan.$edit = false;
                                          document_prestataire_scan.fichier=currentItemDocument_prestataire_scan.fichier;
                                          document_prestataire_scan.date_elaboration=currentItemDocument_prestataire_scan.date_elaboration;
                                          document_prestataire_scan.observation=currentItemDocument_prestataire_scan.observation;
                                          vm.selectedItemDocument_prestataire_scan = {};
                                      console.log('a');
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
                                      var chemin= currentItemDocument_prestataire_scan.fichier;
                                        var fd = new FormData();
                                            fd.append('chemin',chemin);
                                      
                                        var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                                        var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                                        headers: {'Content-Type': undefined}, chemin: chemin
                                        }).success(function(data)
                                        {
                                        });
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: currentItemDocument_prestataire_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_prestataire_scan.date_elaboration),
                                                      observation: currentItemDocument_prestataire_scan.observation,
                                                      id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                                                      id_document_prestataire: currentItemDocument_prestataire_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                      {
                                          document_prestataire_scan.$selected = false;
                                          document_prestataire_scan.$edit = false;
                                          document_prestataire_scan.fichier=currentItemDocument_prestataire_scan.fichier;
                                          document_prestataire_scan.date_elaboration=currentItemDocument_prestataire_scan.date_elaboration;
                                          document_prestataire_scan.observation=currentItemDocument_prestataire_scan.observation;
                                          vm.selectedItemDocument_prestataire_scan = {};
                                      
                                      });
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
                          console.log('c');
                      }).error(function()
                      {
                          showAlert(event,chemin);
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
                     console.log('1');
          console.log(vm.myFile);                   
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;
                      console.log('2'); 
                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {console.log('3'); 
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
                                {
                                    document_prestataire_scan.$selected = false;
                                    document_prestataire_scan.$edit = false;

                                    document_prestataire_scan.validation = null;
                                    document_prestataire_scan.date_elaboration = null;
                                    document_prestataire_scan.observation = null;
                                    document_prestataire_scan.id_document_prestataire_scan = null;
                                    vm.selectedItemDocument_prestataire_scan = {};
                                console.log('d');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {console.log('4'); 
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
                                {
                                    document_prestataire_scan.$selected = false;
                                    document_prestataire_scan.$edit = false;

                                    document_prestataire_scan.validation = null;
                                    document_prestataire_scan.date_elaboration = null;
                                    document_prestataire_scan.observation = null;
                                    document_prestataire_scan.id_document_prestataire_scan = null;
                                    vm.selectedItemDocument_prestataire_scan = {};
                                console.log('d');
                                });
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
            NouvelItemDelai_travaux = false;
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                 vm.alldelai_travaux = result.data.response;
                 vm.affiche_load = false;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvDelai_travaux=false;
                }
                vm.step_reception = true;
             });
        }
        vm.step_delai_execution = function()
        {   vm.affiche_load = true;
          NouvelItemDelai_travaux = false;
            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                 vm.alldelai_travaux = result.data.response;
                 vm.affiche_load = false;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvDelai_travaux=false;
                }
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

              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu',"getdelai_travauxvalideById",'id_delai_travaux',delai_travaux.id).then(function(result)
                {
                  var delai_travaux_valide = result.data.response;
                  if (delai_travaux_valide.length !=0)
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
                        vm.alldelai_travaux = delai_travaux_valide;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceDelai_travaux (delai_travaux,suppression);     
                  }
                });
              }
              else
              {
                test_existanceDelai_travaux (delai_travaux,suppression); 
              }
                 
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
             /* switch (vm.session)
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
            
              }*/
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
            item.date_prev_debu_travau   = vm.injectDateinInput(vm.selectedItemDelai_travaux.date_prev_debu_travau)  ;
            item.date_reel_debu_travau   = vm.injectDateinInput(vm.selectedItemDelai_travaux.date_reel_debu_travau) ;
            item.date_expiration_police   = vm.injectDateinInput(vm.selectedItemDelai_travaux.date_expiration_police);
            item.delai_execution = parseInt(vm.selectedItemDelai_travaux.delai_execution) ;
        };

        //fonction bouton suppression item Contrat_prestataire
        vm.supprimerDelai_travaux = function()
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
                vm.ajoutDelai_travaux(vm.selectedItemDelai_travaux,1);
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
              delai_travaux.$selected = false;
              delai_travaux.$edit = false;
              vm.selectedItemDelai_travaux = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin eelai_travaux****************************************/
/**********************************debut passation_marches****************************************/
    vm.click_phase_sous = function()
    {  
      NouvelItemPhase_sous_projet = false;  
      if (vm.session=="AAC")
      {
        apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',vm.selectedItemDelai_travaux.id).then(function(result)
        {
            vm.allphase_sous_projet = result.data.response.filter(function(obj)
            {
                return obj.validation == 0;
            });
            vm.showbuttonNouvPhase_sous_projet=true;
        });
      }
      else
      {
        apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',vm.selectedItemDelai_travaux.id).then(function(result)
        {
            vm.allphase_sous_projet = result.data.response;
            vm.showbuttonNouvPhase_sous_projet=true;
        });
      }      
        

    }
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu',"getphase_sous_projetvalideById",'id_phase_sous_projet',phase_sous_projet.id).then(function(result)
                {
                  var phase_sous_projet_valide = result.data.response;
                  if (phase_sous_projet_valide.length !=0)
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
                        vm.allphase_sous_projet = vm.allphase_sous_projet.filter(function(obj)
                        {
                            return obj.id !== phase_sous_projet.id;
                        });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existancePhase_sous_projet (phase_sous_projet,suppression);   
                  }
                });
              }
              else
              {
                test_existancePhase_sous_projet (phase_sous_projet,suppression);
              }
                
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
                    date_travaux: convertionDate(phase_sous_projet.date_travaux),
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

        vm.step_reception_mpe = function()
        {   vm.affiche_load = true;
          
          NouvelItemReception_mpe = false;
          if (vm.session=="AAC")
          {
            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allreception_mpe = result.data.response.filter(function(obj)
              {
                  return obj.validation == 0;
              });
                vm.affiche_load = false;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvReception_mpe=false;
                }
            });
          }
          else
          {
            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allreception_mpe = result.data.response;
                vm.affiche_load = false;

                if (result.data.response.length!=0)
                {
                  vm.showbuttonNouvReception_mpe=false;
                }
            });
          }
            
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu',"getreception_mpevalideById",'id_reception_mpe',reception_mpe.id).then(function(result)
                {
                  var reception_mpe_valide = result.data.response;
                  if (reception_mpe_valide.length !=0)
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
                        vm.allreception_mpe = vm.allreception_mpe.filter(function(obj)
                        {
                            return obj.id !== reception_mpe.id;
                        });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceReception_mpe (reception_mpe,suppression);  
                  }
                }); 
              }
              else
              {
                test_existanceReception_mpe (reception_mpe,suppression);
              }
                
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
              
              reception_mpe.$selected = false;
              reception_mpe.$edit = false;
              vm.selectedItemReception_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/************************************************fin reception***************************************************/


    /*********************************************Debut indicateur************************************************/

        vm.step_menu_indicateur= function ()
        {vm.showbuttonNouvIndicateur=true;
            vm.affiche_load = true;
            NouvelItemIndicateur = false;
            if (vm.session=="AAC")
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
                    vm.affiche_load = false;
                });
            }
            else
            {
              apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allindicateur = result.data.response;
                    if (result.data.response.length!=0)
                    {
                      vm.showbuttonNouvIndicateur=false;
                    }
                    vm.affiche_load = false;
                });
            }
                 
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
              if (vm.session=="AAC")
              {
                apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurvalideById','id_indicateur',indicateur.id).then(function(result)
                {
                  var indicateur_valide = result.data.response;
                  if (indicateur_valide.length !=0)
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
                      vm.allindicateur = vm.allindicateur.filter(function(obj)
                      {
                          return obj.id !== indicateur.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceIndicateur (indicateur,suppression);                
                  }
                });
              }
              else
              {
                test_existanceIndicateur (indicateur,suppression);
              }
  
                
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
                return obj.id !== vm.selectedItemIndicateur.id;
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
                      vm.showbuttonNouvIndicateur=true;
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
    /*****************Debut EntrepriseDialogue Controlleur  ****************/    
    function EntrepriseDialogController($mdDialog, $scope, apiFactory, entrepriseToPass, nouvelItem)
    { 
        var dg=$scope;
        dg.affiche_load = false;
        dg.affichebuttonAjouter = false;
        dg.selectedItemEntrepriseDialog = {};
        dg.allentrepriseDialog = [];
        var entreprise_a_anvoyer= [];

        dg.entreprisedialog_column = [
          {titre:"Nom"},
          {titre:"Nif"},
          {titre:"Stat"},
          {titre:"Siege"},
          {titre:"telephone"}];
       

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        console.log(nouvelItem);
        console.log(entrepriseToPass);
        if (nouvelItem==false)
        {
          dg.allentrepriseDialog.push(entrepriseToPass);
        }
        dg.recherche = function(mpe)
        {           
          dg.affiche_load = true;
          apiFactory.getAPIgeneraliserREST("prestataire/index",'menu','getprestatairebylike','mpe_like',mpe.nom).then(function(result)
          {
            dg.allentrepriseDialog = result.data.response;
            dg.affiche_load = false;
            console.log(dg.allentrepriseDialog);
          });
        }
        

        dg.cancel = function()
        {
          $mdDialog.cancel();
          dg.affichebuttonAjouter = false;
        };

        dg.dialognouveauajout = function(conven)
        {  
            $mdDialog.hide(dg.selectedItemEntrepriseDialog);
            dg.affichebuttonAjouter = false;
            dg.allentrepriseDialog = [];
        }

        

        //fonction selection item entreprise
        dg.selectionEntrepriseDialog = function (item)
        {
            dg.selectedItemEntrepriseDialog  = item;
            dg.affichebuttonAjouter = true;               
        };
        
       $scope.$watch('selectedItemEntrepriseDialog', function()
        {
            if (!dg.allentrepriseDialog) return;
              dg.allentrepriseDialog.forEach(function(iteme)
              {
                  iteme.$selected = false;
              });
            dg.selectedItemEntrepriseDialog.$selected = true;
        });

    }

/*****************Fin EntrepriseDialogue Controlleur  ****************/ 
    /*****************Debut moeDialogue Controlleur  ****************/    
    function MoeDialogController($mdDialog, $scope, apiFactory, moeToPass, nouvelItem)
    { 
        var dg=$scope;
        dg.affiche_load = false;
        dg.affichebuttonAjouter = false;
        dg.selectedItemMoeDialog = {};
        dg.allmoeDialog = [];
        var moe_a_anvoyer= [];

        dg.moedialog_column = [
          {titre:"Nom"},
          {titre:"Nif"},
          {titre:"Stat"},
          {titre:"Siege"},
          {titre:"telephone"}];
       

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        console.log(nouvelItem);
        console.log(moeToPass);
        if (nouvelItem==false)
        {
          dg.allmoeDialog.push(moeToPass);
        }
        dg.recherche = function(moe)
        {           
          dg.affiche_load = true;
          apiFactory.getAPIgeneraliserREST("bureau_etude/index",'menu','getbureau_etudebylike','moe_like',moe.nom).then(function(result)
          {
            dg.allmoeDialog = result.data.response;
            dg.affiche_load = false;
            console.log(dg.allmoeDialog);
          });
        }
        

        dg.cancel = function()
        {
          $mdDialog.cancel();
          dg.affichebuttonAjouter = false;
        };

        dg.dialogajoutmoe = function(conven)
        {  
            $mdDialog.hide(dg.selectedItemMoeDialog);
            dg.affichebuttonAjouter = false;
            dg.allmoeDialog = [];
        }

        

        //fonction selection item moe
        dg.selectionMoeDialog = function (item)
        {
            dg.selectedItemMoeDialog  = item;
            dg.affichebuttonAjouter = true;               
        };
        
       $scope.$watch('selectedItemMoeDialog', function()
        {
            if (!dg.allmoeDialog) return;
              dg.allmoeDialog.forEach(function(iteme)
              {
                  iteme.$selected = false;
              });
            dg.selectedItemMoeDialog.$selected = true;
        });

    }

/*****************Fin MoeeDialogue Controlleur  ****************/ 
})();
