
(function ()
{
    'use strict';

    angular
        .module('app.paeb.convention_suivi')
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
        .controller('Convention_suiviController', Convention_suiviController);
    /** @ngInject */
    function Convention_suiviController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
       
        vm.stepMenu_reliquat=false;
        vm.stepMenu_pr=false;
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
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

        vm.session = '';

/*******************************Debut initialisation suivi financement feffi******************************/
        
        vm.showbuttonNeauveaudemande = false;

        //initialisation demande_realimentation_feffi
        vm.ajoutDemande_realimentation  = ajoutDemande_realimentation ;
        vm.NouvelItemDemande_realimentation    = false;     
        var currentItemDemande_realimentation;
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;
        vm.alldemande_realimentation_invalide  = [] ;

        vm.permissionboutonValidercreer = false;

        vm.permissionboutonValiderdpfi = false;
        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];

        vm.nbr_demande_feffi_creer=0;
        vm.nbr_demande_feffi_emidpfi=0;
        vm.nbr_demande_feffi_encourdpfi=0;
        vm.nbr_demande_feffi_emidaaf=0;
        vm.nbr_demande_feffi_encourdaaf=0;

        //initialisation piece_justificatif_feffi
        vm.ajoutPiece_justificatif_feffi  = ajoutPiece_justificatif_feffi ;
        var NouvelItemPiece_justificatif_feffi    = false;     
        var currentItemPiece_justificatif_feffi;
        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;

        //initialisation decaissement fonctionnement feffi
        vm.ajoutDecaiss_fonct_feffi = ajoutDecaiss_fonct_feffi;
        var NouvelItemDecaiss_fonct_feffi=false;
        var currentItemDecaiss_fonct_feffi;
        vm.selectedItemDecaiss_fonct_feffi = {} ;
        vm.alldecaiss_fonct_feffi = [] ;
        vm.showbuttonValidation_dec_feffi = false;

        vm.showbuttonValidation = false;
        vm.showbuttonValidationenrejedpfi = false;
        vm.showbuttonValidationencourdpfi = false;        
        vm.showbuttonValidationdpfi = false;
        
        vm.showbuttonValidationenrejedaaf = false;
        vm.showbuttonValidationencourdaaf = false;        
        vm.showbuttonValidationdaaf = false;


        var NouvelItemTransfert_daaf = false;
        var currentItemTransfert_daaf;
        vm.selectedItemTransfert_daaf = {} ;
        vm.ajoutTransfert_daaf  = ajoutTransfert_daaf ;
        vm.alltransfert_daaf=[];
        vm.showbuttonNouvtransfert_daaf= true;
        vm.showbuttonValidation_trans_daaf = false;
        vm.permissionboutonvalidertrans_daaf = false;        

        vm.nbr_decaiss_feffi=0;     

/*******************************Fin initialisation suivi financement feffi******************************/

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

        vm.ajoutModule_dpp = ajoutModule_dpp ;
        var NouvelItemModule_dpp=false;
        var currentItemModule_dpp;
        vm.selectedItemModule_dpp = {} ;
        vm.allmodule_dpp = [] ;

        vm.showbuttonNouvformdpp=true;
        vm.permissionboutonvaliderformdpp = false;
        vm.showbuttonValidationformdpp = false;

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
        vm.permissionboutonvaliderformodc = false;
        vm.showbuttonValidationformodc = false;

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

        vm.showbuttonNouvformgfpc=true;
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

        vm.showbuttonNouvformpmc=true;
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

        vm.showbuttonNouvformsep=true;
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

        vm.showbuttonNouvPassation_moe=true;
        vm.permissionboutonenvaliderpassation_moe = false;
        vm.showbuttonValidationpassation_moe = false;

        vm.ajoutContrat_moe = ajoutContrat_moe ;
        var NouvelItemContrat_moe=false;
        var currentItemContrat_moe;
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

        vm.showbuttonNouvcontrat_moe=true;
        vm.permissionboutonvalidercontrat_moe = false;
        vm.showbuttonValidationcontrat_moe = false;

        vm.ajoutMemoire_technique = ajoutMemoire_technique;
        var NouvelItemMemoire_technique=false;
        var currentItemMemoire_technique;
        vm.selectedItemMemoire_technique = {} ;
        vm.allmemoire_technique = [] ;

        vm.showbuttonNouvMemoire_technique=true;
        vm.permissionboutonvaliderMemoire_technique = false;
        vm.showbuttonValidationMemoire_technique = false;

        vm.ajoutAppel_offre = ajoutAppel_offre;
        var NouvelItemAppel_offre=false;
        var currentItemAppel_offre;
        vm.selectedItemAppel_offre = {} ;
        vm.allappel_offre = [] ;

        vm.showbuttonNouvAppel_offre=true;
        vm.permissionboutonvaliderAppel_offre = false;
        vm.showbuttonValidationAppel_offre = false;

        vm.ajoutRapport_mensuel = ajoutRapport_mensuel;
        var NouvelItemRapport_mensuel=false;
        var currentItemRapport_mensuel;
        vm.selectedItemRapport_mensuel = {} ;
        vm.allrapport_mensuel = [] ;

        vm.showbuttonNouvRapport_mensuel=true;
        vm.permissionboutonvaliderRapport_mensuel = false;
        vm.showbuttonValidationRapport_mensuel = false;

        vm.ajoutManuel_gestion = ajoutManuel_gestion;
        var NouvelItemManuel_gestion=false;
        vm.selectedItemManuel_gestion = {} ;
        var currentItemManuel_gestion;
        vm.allmanuel_gestion = [] ;

        vm.showbuttonNouvManuel_gestion=true;
        vm.permissionboutonvaliderManuel_gestion = false;
        vm.showbuttonValidationManuel_gestion = false;

        vm.ajoutPolice_assurance = ajoutPolice_assurance;
        var NouvelItemPolice_assurance=false;
        vm.selectedItemPolice_assurance = {} ;
        var currentItemPolice_assurance;
        vm.allpolice_assurance = [] ;

        vm.showbuttonNouvPolice_assurance=true;
        vm.permissionboutonvaliderPolice_assurance = false;
        vm.showbuttonValidationPolice_assurance = false;

        vm.ajoutDemande_debut_travaux_moe = ajoutDemande_debut_travaux_moe;
        vm.NouvelItemDemande_debut_travaux_moe=false;
        var currentItemDemande_debut_travaux_moe;
        vm.selectedItemDemande_debut_travaux_moe = {};
        vm.alldemande_debut_travaux_moe = [];

        vm.alldemande_debut_travaux_moe = [];

        vm.allcurenttranche_d_debut_travaux_moe = [];
        vm.alltranche_d_debut_travaux_moe = [];
        vm.dataLastedemande_debut_moe = [];

        vm.showbuttonNouvDemande_debut_travaux_moe_creer = true;
        vm.permissionboutonvaliderDemande_debut_travaux_moe_creer = false;
        vm.showbuttonValidationDemande_debut_travaux_moe_creer = false;

        vm.permissionboutonvaliderDemande_debut_travaux_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_debut_travaux_moe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_debut_travaux_moe_rejedpfi = false;
        vm.showbuttonValidationDemande_debut_travaux_moe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_debut_travaux_moe_validedpfi = false;
        vm.showbuttonValidationDemande_debut_travaux_moe_validedpfi = false;

         vm.ajoutJustificatif_debut_travaux_moe = ajoutJustificatif_debut_travaux_moe;
        var NouvelItemJustificatif_debut_travaux_moe=false;
        var currentItemJustificatif_debut_travaux_moe;
        vm.selectedItemJustificatif_debut_travaux_moe = {} ;
        vm.alljustificatif_debut_travaux_moe = [] ;

        var NouvelItemPaiement_debut_travaux_moe = false;
        var currentItemPaiement_debut_travaux_moe;
        vm.selectedItemPaiement_debut_travaux_moe = {} ;
        vm.ajoutPaiement_debut_travaux_moe  = ajoutPaiement_debut_travaux_moe ;
        vm.allpaiement_debut_travaux_moe = [] ;

        vm.showbuttonNouvPaiement_debut_travaux_moe = true;
        vm.permissionboutonvaliderPaiement_debut_travaux_moe = false;

        vm.ajoutDemande_batiment_moe = ajoutDemande_batiment_moe;
        vm.NouvelItemDemande_batiment_moe=false;
        var currentItemDemande_batiment_moe;
        vm.selectedItemDemande_batiment_moe = {};
        vm.alldemande_batiment_moe = [];

        vm.alldemande_batiment_moe = [];

        vm.allcurenttranche_demande_batiment_moe = [];
        vm.alltranche_demande_batiment_moe = [];
        vm.dataLastedemande_batiment_moe = [];

        vm.showbuttonNouvDemande_batiment_moe_creer = true;
        vm.permissionboutonvaliderDemande_batiment_moe_creer = false;
        vm.showbuttonValidationDemande_batiment_moe_creer = false;

        vm.permissionboutonvaliderDemande_batiment_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_batiment_moe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_batiment_moe_rejedpfi = false;
        vm.showbuttonValidationDemande_batiment_moe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_batiment_moe_validedpfi = false;
        vm.showbuttonValidationDemande_batiment_moe_validedpfi = false;

         vm.ajoutJustificatif_batiment_moe = ajoutJustificatif_batiment_moe;
        var NouvelItemJustificatif_batiment_moe=false;
        var currentItemJustificatif_batiment_moe;
        vm.selectedItemJustificatif_batiment_moe = {} ;
        vm.alljustificatif_batiment_moe = [] ;

        var NouvelItemPaiement_batiment_moe = false;
        var currentItemPaiement_batiment_moe;
        vm.selectedItemPaiement_batiment_moe = {} ;
        vm.ajoutPaiement_batiment_moe  = ajoutPaiement_batiment_moe ;
        vm.allpaiement_batiment_moe = [] ;

        vm.showbuttonNouvPaiement_batiment_moe = true;
        vm.permissionboutonvaliderPaiement_batiment_moe = false;

        vm.ajoutDemande_latrine_moe = ajoutDemande_latrine_moe;
        vm.NouvelItemDemande_latrine_moe=false;
        var currentItemDemande_latrine_moe;
        vm.selectedItemDemande_latrine_moe = {};
        vm.alldemande_latrine_moe = [];

        vm.alldemande_latrine_moe = [];

        vm.allcurenttranche_demande_latrine_moe = [];
        vm.alltranche_demande_latrine_moe = [];
        vm.dataLastedemande_latrine_moe = [];

        vm.showbuttonNouvDemande_latrine_moe_creer = true;
        vm.permissionboutonvaliderDemande_latrine_moe_creer = false;
        vm.showbuttonValidationDemande_latrine_moe_creer = false;

        vm.permissionboutonvaliderDemande_latrine_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_latrine_moe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_latrine_moe_rejedpfi = false;
        vm.showbuttonValidationDemande_latrine_moe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_latrine_moe_validedpfi = false;
        vm.showbuttonValidationDemande_latrine_moe_validedpfi = false;

         vm.ajoutJustificatif_latrine_moe = ajoutJustificatif_latrine_moe;
        var NouvelItemJustificatif_latrine_moe=false;
        var currentItemJustificatif_latrine_moe;
        vm.selectedItemJustificatif_latrine_moe = {} ;
        vm.alljustificatif_latrine_moe = [] ;

        var NouvelItemPaiement_latrine_moe = false;
        var currentItemPaiement_latrine_moe;
        vm.selectedItemPaiement_latrine_moe = {} ;
        vm.ajoutPaiement_latrine_moe  = ajoutPaiement_latrine_moe ;
        vm.allpaiement_latrine_moe = [] ;

        vm.showbuttonNouvPaiement_latrine_moe = true;
        vm.permissionboutonvaliderPaiement_latrine_moe = false;

        vm.ajoutDemande_fin_travaux_moe = ajoutDemande_fin_travaux_moe;
        vm.NouvelItemDemande_fin_travaux_moe=false;
        var currentItemDemande_fin_travaux_moe;
        vm.selectedItemDemande_fin_travaux_moe = {};
        vm.alldemande_fin_travaux_moe = [];

        vm.alldemande_fin_travaux_moe = [];

        vm.allcurenttranche_d_fin_travaux_moe = [];
        vm.alltranche_d_fin_travaux_moe = [];
        vm.dataLastedemande_fin_moe = [];

        vm.showbuttonNouvDemande_fin_travaux_moe_creer = true;
        vm.permissionboutonvaliderDemande_fin_travaux_moe_creer = false;
        vm.showbuttonValidationDemande_fin_travaux_moe_creer = false;

        vm.permissionboutonvaliderDemande_fin_travaux_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_fin_travaux_moe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_fin_travaux_moe_rejedpfi = false;
        vm.showbuttonValidationDemande_fin_travaux_moe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_fin_travaux_moe_validedpfi = false;
        vm.showbuttonValidationDemande_fin_travaux_moe_validedpfi = false;

         vm.ajoutJustificatif_fin_travaux_moe = ajoutJustificatif_fin_travaux_moe;
        var NouvelItemJustificatif_fin_travaux_moe=false;
        var currentItemJustificatif_fin_travaux_moe;
        vm.selectedItemJustificatif_fin_travaux_moe = {} ;
        vm.alljustificatif_fin_travaux_moe = [] ;

        var NouvelItemPaiement_fin_travaux_moe = false;
        var currentItemPaiement_fin_travaux_moe;
        vm.selectedItemPaiement_fin_travaux_moe = {} ;
        vm.ajoutPaiement_fin_travaux_moe  = ajoutPaiement_fin_travaux_moe ;
        vm.allpaiement_fin_travaux_moe = [] ;

        vm.showbuttonNouvPaiement_fin_travaux_moe = true;
        vm.permissionboutonvaliderPaiement_fin_travaux_moe = false;

/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.ajoutPassation_marches = ajoutPassation_marches ;
        var NouvelItemPassation_marches=false;
        var currentItemPassation_marches;
        vm.selectedItemPassation_marches = {} ;
        vm.allpassation_marches = [] ;

        vm.showbuttonNouvPassation=true;
        vm.permissionboutonenvaliderpassation = false;
        vm.showbuttonValidationpassation = false;

        vm.ajoutContrat_prestataire = ajoutContrat_prestataire ;
        var NouvelItemContrat_prestataire=false;
        var currentItemContrat_prestataire;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.showbuttonNouvcontrat_prestataire=true;
        vm.permissionboutonvalidercontrat_prestataire = false;
        vm.showbuttonValidationcontrat_prestataire = false;

        vm.ajoutDelai_travaux = ajoutDelai_travaux ;
        var NouvelItemDelai_travaux=false;
        var currentItemDelai_travaux;
        vm.selectedItemDelai_travaux = {} ;
        vm.alldelai_travaux = [] ;

        vm.showbuttonNouvdelai_travaux=true;
        vm.permissionboutonvaliderdelai_travaux = false;
        vm.showbuttonValidationdelai_travaux = false;


        vm.ajoutPhase_sous_projet = ajoutPhase_sous_projet ;
        var NouvelItemPhase_sous_projet=false;
        var currentItemPhase_sous_projet;
        vm.selectedItemPhase_sous_projet = {} ;
        vm.allphase_sous_projet = [] ;

        vm.showbuttonNouvPhase_sous_projet=true;
        vm.permissionboutonvaliderphase_sous_projet = false;
        vm.showbuttonValidationphase_sous_projet = false;

        vm.ajoutReception_mpe = ajoutReception_mpe ;
        var NouvelItemReception_mpe=false;
        var currentItemReception_mpe;
        vm.selectedItemReception_mpe = {} ;
        vm.allreception_mpe = [] ;

        vm.showbuttonNouvReception_mpe=true;
        vm.permissionboutonvaliderreception_mpe = false;
        vm.showbuttonValidationreception_mpe = false;

        vm.ajoutDemande_batiment_mpe = ajoutDemande_batiment_mpe;
        vm.NouvelItemDemande_batiment_mpe=false;
        var currentItemDemande_batiment_mpe;
        vm.selectedItemDemande_batiment_mpe = {};
        vm.alldemande_batiment_mpe = [];

        vm.alldemande_batiment_mpe = [];

        vm.allcurenttranche_demande_batiment_mpe = [];
        vm.alltranche_demande_batiment_mpe = [];
        vm.dataLastedemande_batiment_mpe = [];

        vm.showbuttonNouvDemande_batiment_mpe_creer = true;
        vm.permissionboutonvaliderDemande_batiment_mpe_creer = false;
        vm.showbuttonValidationDemande_batiment_mpe_creer = false;

        vm.permissionboutonvaliderDemande_batiment_mpe_encourdpfi = false;
        vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_batiment_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_batiment_mpe_validedpfi = false;
        vm.showbuttonValidationDemande_batiment_mpe_validedpfi = false;

         vm.ajoutJustificatif_batiment_mpe = ajoutJustificatif_batiment_mpe;
        var NouvelItemJustificatif_batiment_mpe=false;
        var currentItemJustificatif_batiment_mpe;
        vm.selectedItemJustificatif_batiment_mpe = {} ;
        vm.alljustificatif_batiment_mpe = [] ;

        var NouvelItemPaiement_batiment_mpe = false;
        var currentItemPaiement_batiment_mpe;
        vm.selectedItemPaiement_batiment_mpe = {} ;
        vm.ajoutPaiement_batiment_mpe  = ajoutPaiement_batiment_mpe ;
        vm.allpaiement_batiment_mpe = [] ;

        vm.showbuttonNouvPaiement_batiment_mpe = true;
        vm.permissionboutonvaliderPaiement_batiment_mpe = false;




        vm.ajoutDemande_latrine_mpe = ajoutDemande_latrine_mpe;
        vm.NouvelItemDemande_latrine_mpe=false;
        var currentItemDemande_latrine_mpe;
        vm.selectedItemDemande_latrine_mpe = {};
        vm.alldemande_latrine_mpe = [];

        vm.alldemande_latrine_mpe = [];

        vm.allcurenttranche_demande_latrine_mpe = [];
        vm.alltranche_demande_latrine_mpe = [];
        vm.dataLastedemande_latrine_mpe = [];

        vm.showbuttonNouvDemande_latrine_mpe_creer = true;
        vm.permissionboutonvaliderDemande_latrine_mpe_creer = false;
        vm.showbuttonValidationDemande_latrine_mpe_creer = false;

        vm.permissionboutonvaliderDemande_latrine_mpe_encourdpfi = false;
        vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_latrine_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_latrine_mpe_validedpfi = false;
        vm.showbuttonValidationDemande_latrine_mpe_validedpfi = false;

         vm.ajoutJustificatif_latrine_mpe = ajoutJustificatif_latrine_mpe;
        var NouvelItemJustificatif_latrine_mpe=false;
        var currentItemJustificatif_latrine_mpe;
        vm.selectedItemJustificatif_latrine_mpe = {} ;
        vm.alljustificatif_latrine_pre = [] ;

        var NouvelItemPaiement_latrine_mpe = false;
        var currentItemPaiement_latrine_mpe;
        vm.selectedItemPaiement_latrine_mpe = {} ;
        vm.ajoutPaiement_latrine_mpe  = ajoutPaiement_latrine_mpe ;
        vm.allpaiement_latrine_mpe = [] ;

        vm.showbuttonNouvPaiement_latrine_mpe = true;
        vm.permissionboutonvaliderPaiement_latrine_mpe = false;



        vm.ajoutDemande_mobilier_mpe = ajoutDemande_mobilier_mpe;
        vm.NouvelItemDemande_mobilier_mpe=false;
        var currentItemDemande_mobilier_mpe;
        vm.selectedItemDemande_mobilier_mpe = {};
        vm.alldemande_mobilier_mpe = [];

        vm.alldemande_mobilier_mpe = [];

        vm.allcurenttranche_demande_mobilier_mpe = [];
        vm.alltranche_demande_mobilier_mpe = [];
        vm.dataLastedemande_mobilier_mpe = [];

        vm.showbuttonNouvDemande_mobilier_mpe_creer = true;
        vm.permissionboutonvaliderDemande_mobilier_mpe_creer = false;
        vm.showbuttonValidationDemande_mobilier_mpe_creer = false;

        vm.permissionboutonvaliderDemande_mobilier_mpe_encourdpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = false;
        vm.permissionboutonvaliderDemande_mobilier_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = false;              
        vm.permissionboutonvaliderDemande_mobilier_mpe_validedpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = false;

         vm.ajoutJustificatif_mobilier_mpe = ajoutJustificatif_mobilier_mpe;
        var NouvelItemJustificatif_mobilier_mpe=false;
        var currentItemJustificatif_mobilier_mpe;
        vm.selectedItemJustificatif_mobilier_mpe = {} ;
        vm.alljustificatif_mobilier_pre = [] ;

        var NouvelItemPaiement_mobilier_mpe = false;
        var currentItemPaiement_mobilier_mpe;
        vm.selectedItemPaiement_mobilier_mpe = {} ;
        vm.ajoutPaiement_mobilier_mpe  = ajoutPaiement_mobilier_mpe ;
        vm.allpaiement_mobilier_mpe = [] ;

        vm.showbuttonNouvPaiement_mobilier_mpe = true;
        vm.permissionboutonvaliderPaiement_mobilier_mpe = false;
/********************************************Fin entreprise********************************************/


/********************************************Fin reliquat********************************************/
        var NouvelItemTransfert_reliquat = false;
        var currentItemTransfert_reliquat;
        vm.ajoutTransfert_reliquat       = ajoutTransfert_reliquat ;
        vm.selectedItemTransfert_reliquat = {} ;
        vm.selectedItemTransfert_reliquat.$selected=false;

        vm.showbuttonNouvTransfert_reliquat=true;
        vm.permissionboutonvalidertransfert_reliquat = false;
        vm.showbuttonValidationtransfert_reliquat = false;

        vm.ajoutJustificatif_transfert_reliquat = ajoutJustificatif_transfert_reliquat;
        var NouvelItemJustificatif_transfert_reliquat=false;
        var currentItemJustificatif_transfert_reliquat;
        vm.selectedItemJustificatif_transfert_reliquat = {} ;
        vm.alljustificatif_transfert_reliquat = [] ;
/********************************************Fin reliquat********************************************/


/********************************************Debut indicateur********************************************/        

        vm.ajoutIndicateur = ajoutIndicateur ;
        var NouvelItemIndicateur=false;
        var currentItemIndicateur;
        vm.selectedItemIndicateur = {} ;
        vm.allindicateur = [] ;

        vm.showbuttonNouvIndicateur = true;
        vm.permissionboutonvaliderindicateur = false;
        vm.showbuttonValidationindicateur = false;

/********************************************Fin indicateur********************************************/ 

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


        vm.allcurenttranche_deblocage_feffi = [];
        vm.alltranche_deblocage_feffi = [];

        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
          vm.alltranche_deblocage_feffi= result.data.response;
          vm.allcurenttranche_deblocage_feffi = result.data.response;
        });

        vm.datenow = new Date();

        //recuperation donnée tranche deblocage moe
        apiFactory.getAll("tranche_demande_latrine_moe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_moe= result.data.response;
          vm.allcurenttranche_demande_latrine_moe = result.data.response;
          console.log(vm.allcurenttranche_demande_latrine_moe);
        });

        //recuperation donnée tranche deblocage moe
        apiFactory.getAll("tranche_demande_batiment_moe/index").then(function(result)
        {
          vm.alltranche_demande_batiment_moe= result.data.response;
          vm.allcurenttranche_demande_batiment_moe = result.data.response;
          console.log(vm.allcurenttranche_demande_batiment_moe);
        });

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

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          vm.roles = result.data.response.roles;
          switch (vm.roles[0])
            {
              case 'OBCAF': 
                        var usercisco = result.data.response.cisco;
                        vm.showbuttonNeauveaudemandefeffi=true;
                        if (usercisco.id!=undefined)
                        {
                          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByciscowithcount','id_cisco',usercisco.id).then(function(result)
                          {
                              vm.allconvention_entete = result.data.response;
                          });
                        }
                        vm.session = 'OBCAF';                
                  break;

             case 'BCAF':
                        var usercisco = result.data.response.cisco; 
                        vm.permissionboutonValidercreer = true;
                        if (usercisco.id!=undefined)
                        {
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByciscowithcount','id_cisco',usercisco.id).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                            });
                        }

                        vm.permissionboutonvaliderdecais_fef = true;
                        vm.permissionboutonvaliderpassation_moe = true;
                        vm.permissionboutonvalidercontrat_moe = true;

                        vm.permissionboutonenvaliderpassation = true;

                        vm.permissionboutonvaliderreception_mpe = true;
                        
                        vm.permissionboutonvaliderMemoire_technique = true;
                        vm.permissionboutonvaliderAppel_offre = true;
                        vm.permissionboutonvaliderRapport_mensuel = true;
                        vm.permissionboutonvaliderManuel_gestion = true;
                        vm.permissionboutonvaliderPolice_assurance = true;
                        vm.permissionboutonvaliderDemande_debut_travaux_moe_creer = true;
                        vm.permissionboutonvaliderPaiement_debut_travaux_moe = true;

                        vm.permissionboutonvaliderDemande_batiment_moe_creer = true;
                        vm.permissionboutonvaliderPaiement_batiment_moe = true;

                        vm.permissionboutonvaliderDemande_latrine_moe_creer = true;
                        vm.permissionboutonvaliderPaiement_latrine_moe = true;

                        vm.permissionboutonvaliderDemande_fin_travaux_moe_creer = true;
                        vm.permissionboutonvaliderPaiement_fin_travaux_moe = true;

                        vm.permissionboutonvalidercontrat_prestataire = true;
                        vm.permissionboutonvalidertransfert_reliquat = true;
                        vm.permissionboutonvaliderdelai_travaux = true;

                        vm.permissionboutonvaliderphase_sous_projet = true;



                        vm.permissionboutonvaliderDemande_batiment_mpe_creer = true;
                        vm.permissionboutonvaliderPaiement_batiment_mpe = true;

                        vm.permissionboutonvaliderDemande_latrine_mpe_creer = true;
                        vm.permissionboutonvaliderPaiement_latrine_mpe = true;

                        vm.permissionboutonvaliderDemande_mobilier_mpe_creer = true;
                        vm.permissionboutonvaliderPaiement_mobilier_mpe = true;


                        vm.permissionboutonvaliderindicateur = true;

                        vm.session = 'BCAF';
                  
                  break;
              case 'ODAAF':
                        var usercisco = result.data.response.cisco;
              
                        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydatenowwithcount','date_signature',vm.datenow.getFullYear()).then(function(result)
                        {
                            vm.allconvention_entete = result.data.response;
                        });
                        vm.session = 'ODAAF';
                  
                  break;
              
              case 'DAAF':
                        var usercisco = result.data.response.cisco; 
                        vm.permissionboutonencourdaaf = true;
                        vm.permissionboutonenrejedaaf = true;
                        vm.permissionboutonvaliderdaaf = true;
                        vm.permissionboutonvalidertrans_daaf = true;
                        
                        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydatenowwithcount','date_signature',vm.datenow.getFullYear()).then(function(result)
                        {
                            vm.allconvention_entete = result.data.response;
                        });
                        vm.session = 'DAAF'; 
                  break;
              case 'ODPFI': 
                        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydatenowwithcount','date_signature',vm.datenow.getFullYear()).then(function(result)
                        {
                            vm.allconvention_entete = result.data.response;
                        });
                        vm.session = 'ODPFI';    
                  break;

              case 'DPFI':
                        var usercisco = result.data.response.cisco; 
                        vm.permissionboutonencourdpfi = true;
                        vm.permissionboutonenrejedpfi = true;
                        vm.permissionboutonenvaliderdpfi = true;
                        vm.permissionboutonenvaliderpassation_pr = true;
                        vm.permissionboutonvalidercontrat_pr = true;

                        vm.permissionboutonvaliderDemande_debut_travaux_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_debut_travaux_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_debut_travaux_moe_validedpfi = true;

                        vm.permissionboutonvaliderDemande_batiment_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_batiment_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_batiment_moe_validedpfi = true;

                        vm.permissionboutonvaliderPaiement_latrine_moe = true;

                        vm.permissionboutonvaliderDemande_latrine_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_latrine_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_latrine_moe_validedpfi = true;

                        vm.permissionboutonvaliderPaiement_latrine_moe = true

                        vm.permissionboutonvaliderDemande_fin_travaux_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_fin_travaux_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_fin_travaux_moe_validedpfi = true;


                        vm.permissionboutonvaliderDemande_batiment_mpe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_batiment_mpe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_batiment_mpe_validedpfi = true;

                        vm.permissionboutonvaliderDemande_latrine_mpe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_latrine_mpe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_latrine_mpe_validedpfi = true;

                        vm.permissionboutonvaliderDemande_mobilier_mpe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_mobilier_mpe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_mobilier_mpe_validedpfi = true;
                        
                        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydatenowwithcount','date_signature',vm.datenow.getFullYear()).then(function(result)
                        {
                            vm.allconvention_entete = result.data.response;
                        });
                        vm.session = 'DPFI';
                  
                  break;

              case 'UFP':
                        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydatenowwithcount','date_signature',vm.datenow.getFullYear()).then(function(result)
                        {
                            vm.allconvention_entete = result.data.response;
                        });
                        vm.session = 'UFP';
                   
                  break;

              case 'ADMIN':
                        var usercisco = result.data.response.cisco; 
                        vm.permissionboutonValidercreer = true;
                        vm.permissionboutonValiderdpfi = true; 
                        vm.permissionboutonencourdpfi = true;
                        vm.permissionboutonenrejedpfi = true;
                        vm.permissionboutonencourdaaf = true;
                        vm.permissionboutonenrejedaaf = true;
                        vm.permissionboutonvaliderdaaf = true;
                        vm.permissionboutonvalidertrans_daaf = true;
                        vm.permissionboutonvaliderdecais_fef = true;

                        vm.permissionboutonvaliderpassation_pr = true;
                        vm.permissionboutonvaliderpassation_moe = true;
                        vm.permissionboutonvaliderpassation = true;
                        vm.permissionboutonvaliderreception_mpe = true;
                        vm.permissionboutonvalidercontrat_pr = true;
                        vm.permissionboutonvalidercontrat_moe = true;
                        
                        vm.permissionboutonvaliderMemoire_technique = true;
                        vm.permissionboutonvaliderAppel_offre = true;
                        vm.permissionboutonvaliderRapport_mensuel = true;
                        vm.permissionboutonvaliderManuel_gestion = true;
                        vm.permissionboutonvaliderPolice_assurance = true;

                        vm.permissionboutonvaliderDemande_debut_travaux_moe_creer = true;
                        vm.permissionboutonvaliderDemande_debut_travaux_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_debut_travaux_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_debut_travaux_moe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_debut_travaux_moe = true;


                        vm.permissionboutonvaliderDemande_batiment_moe_creer = true;
                        vm.permissionboutonvaliderDemande_batiment_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_batiment_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_batiment_moe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_batiment_moe = true;


                        vm.permissionboutonvaliderDemande_latrine_moe_creer = true;
                        vm.permissionboutonvaliderDemande_latrine_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_latrine_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_latrine_moe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_latrine_moe = true;

                        vm.permissionboutonvaliderDemande_fin_travaux_moe_creer = true;
                        vm.permissionboutonvaliderDemande_fin_travaux_moe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_fin_travaux_moe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_fin_travaux_moe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_fin_travaux_moe = true;

                        vm.permissionboutonvalidercontrat_prestataire = true;
                        vm.permissionboutonvalidertransfert_reliquat = true;
                        vm.permissionboutonvaliderdelai_travaux = true;

                        vm.permissionboutonvaliderphase_sous_projet = true;


                        vm.permissionboutonvaliderDemande_batiment_mpe_creer = true;
                        vm.permissionboutonvaliderDemande_batiment_mpe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_batiment_mpe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_batiment_mpe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_batiment_mpe = true;

                        vm.permissionboutonvaliderDemande_latrine_mpe_creer = true;
                        vm.permissionboutonvaliderDemande_latrine_mpe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_latrine_mpe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_latrine_mpe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_latrine_mpe = true;

                        vm.permissionboutonvaliderDemande_mobilier_mpe_creer = true;
                        vm.permissionboutonvaliderDemande_mobilier_mpe_encourdpfi = true;
                        vm.permissionboutonvaliderDemande_mobilier_mpe_rejedpfi = true;              
                        vm.permissionboutonvaliderDemande_mobilier_mpe_validedpfi = true;
                        vm.permissionboutonvaliderPaiement_mobilier_mpe = true;
                        
                        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydatenowwithcount','date_signature',vm.datenow.getFullYear()).then(function(result)
                        {
                            vm.allconvention_entete = result.data.response;
                            console.log(vm.allconvention_entete);
                        });
                        vm.session = 'ADMIN';                  
                  break;
              default:
                  break;
          
            }                  

        });
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
           
            donnee_menu_pr(item,vm.session).then(function (result) 
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
            });

            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });
            donnee_menu_reliquat(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_reliquat=true;
                console.log(vm.stepMenu_reliquat);  
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
              vm.stepprestation_moe = false;
              vm.stepjusti_d_tra_moe = false;
              vm.stepsuiviexecution = false;
              vm.stepphase = false;
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
        function donnee_menu_pr(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                switch (session)
                {
                  case 'OBCAF':
                              
                              apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allcontrat_partenaire_relai = result.data.response;
                                  vm.showbuttonNouvcontrat_pr=false;
                                  return resolve(vm.allcontrat_partenaire_relai);
                              });
                            
                                               
                      break;

                 case 'BCAF':

                            apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches_pr = result.data.response;
                                vm.showbuttonNouvPassation_pr=false;
                                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_partenaire_relai = result.data.response;
                                    vm.showbuttonNouvcontrat_pr=false;
                                    return resolve('ok');
                                });
                                    
                            });
                            
                            
                            
                      break;
                  case 'ODAAF':
                                                
                      break;
                  
                  case 'DAAF': 
                               
                              apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allpassation_marches_pr = result.data.response;
                                  vm.showbuttonNouvPassation_pr=false;
                                  apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.allcontrat_partenaire_relai = result.data.response;
                                      vm.showbuttonNouvcontrat_pr=false;
                                      
                                    return resolve('ok'); 
                                  });
                                  
                              });
                               
                      break;
                  case 'ODPFI': 
                              apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allpassation_marches_pr = result.data.response.filter(function(obj)
                                  {
                                      return obj.validation == 0;
                                  });
                                  console.log(vm.allpassation_marches_pr);

                                  if (result.data.response.length!=0)
                                  {
                                      vm.showbuttonNouvPassation_pr=false;
                                  }
                                  apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.allcontrat_partenaire_relai = result.data.response.filter(function(obj)
                                      {
                                          return obj.validation == 0;
                                      });

                                      if (result.data.response.length!=0)
                                      {
                                        vm.showbuttonNouvcontrat_pr=false;
                                      }   
                                    return resolve('ok');
                                  });
                              });
                              
                      break;

                  case 'DPFI':
                            
                            apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches_pr = result.data.response;
                                vm.showbuttonNouvPassation_pr=false;
                                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_partenaire_relai = result.data.response;
                                    vm.showbuttonNouvcontrat_pr=false;
                                    return resolve('ok');
                                });
                                
                            });
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches_pr = result.data.response;
                                if (vm.allpassation_marches_pr.length!=0)
                                {
                                    vm.showbuttonNouvPassation_pr=false;
                                }
                                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_partenaire_relai = result.data.response;
                                    if (vm.allcontrat_partenaire_relai.length!=0)
                                    {
                                        vm.showbuttonNouvcontrat_pr=false;
                                    }
                                    
                                    return resolve(vm.allcontrat_partenaire_relai);
                                });
                                
                            });

                            
                            
                            
                       
                      break;

                  case 'UFP':

                          
                          apiFactory.getAPIgeneraliserREST("passation_marches_pr/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                          {
                              vm.allpassation_marches_pr = result.data.response;
                              vm.showbuttonNouvPassation_pr=false;
                              apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allcontrat_partenaire_relai = result.data.response;
                                  vm.showbuttonNouvcontrat_pr=false;
                                  return resolve('ok');
                              });
                              
                          });
                          
                          
                                            
                      break;
                  default:
                      break;
              
                }            
            });
        }
        function donnee_menu_moe(item,session)
        {   
            return new Promise(function (resolve, reject) 
            {
                switch (session)
                {
                  case 'OBCAF':
                              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allpassation_marches_moe = result.data.response.filter(function(obj)
                                  {
                                      return obj.validation == 0;
                                  });
                                  console.log(vm.allpassation_marches_moe);

                                  if (result.data.response.length!=0)
                                  {
                                      vm.showbuttonNouvPassation_moe=false;
                                  }
                                  apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.allcontrat_moe = result.data.response.filter(function(obj)
                                      {
                                          return obj.validation == 0;
                                      });

                                      if (result.data.response.length!=0)
                                      {
                                        vm.showbuttonNouvcontrat_moe=false;
                                      }
                                    return resolve('ok'); 
                                  });
                              });

                                                
                      break;

                 case 'BCAF':
                           
                            apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches_moe = result.data.response;
                                console.log(vm.allpassation_marches_moe);
                                vm.showbuttonNouvPassation_moe=false;
                                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_moe = result.data.response;
                                    vm.showbuttonNouvcontrat_moe=false;
                                    return resolve('ok'); 
                                });
                                
                            });
                            
                                              
                      break;
                  case 'ODAAF':
                                                
                      break;
                  
                  case 'DAAF': 
                              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allpassation_marches_moe = result.data.response;
                                  vm.showbuttonNouvPassation_moe=false;
                                  apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.allcontrat_moe = result.data.response;
                                      vm.showbuttonNouvcontrat_moe=false;
                                        return resolve('ok'); 
                                      
                                  }); 
                                  
                              });
                              
                              
                      break;
                  case 'ODPFI':                           
                      
                      break;

                  case 'DPFI':
                           
                            apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches_moe = result.data.response;
                                vm.showbuttonNouvPassation_moe=false;
                                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_moe = result.data.response;
                                    vm.showbuttonNouvcontrat_moe=false;
                                    return resolve('ok');
                                });
                                
                            });
                            
                                               
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches_moe = result.data.response;
                                if (vm.allpassation_marches_moe.length!=0)
                                {
                                    vm.showbuttonNouvPassation_moe=false;
                                }
                                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_moe = result.data.response;

                                    if (result.data.response.length!=0)
                                    {
                                      vm.showbuttonNouvcontrat_moe=false;
                                    }
                                    return resolve('ok');
                                });
                                
                            });
                                                    
                            
                       
                      break;

                  case 'UFP':

                          
                          apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                          {
                              vm.allpassation_marches_moe = result.data.response;
                              vm.showbuttonNouvPassation_moe=false;
                              apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allcontrat_moe = result.data.response;
                                  vm.showbuttonNouvcontrat_moe=false;
                                return resolve('ok');                 
                                  
                              });
                              
                          });
                                               
                      break;
                  default:
                      break;
              
                }
            });
        }
        function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                switch (session)
                {
                  case 'OBCAF':
                              apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',item.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                  apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.alldecaiss_fonct_feffi = result.data.response; 
                                      return resolve('ok');
                                  });
              
                              });
                              

                              vm.modif_suppre = true;
                              //vm.nbr_demande_feffi = item.nbr_demande_feffi_creer
                            
                      break;

                 case 'BCAF':

                            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeByconvention",'id_convention_cife_entete',item.id).then(function(result)
                            {
                                vm.alldemande_realimentation_invalide = result.data.response;
                                apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaissByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                      vm.alldecaiss_fonct_feffi = result.data.response;

                                    return resolve('ok');  
                                });  
                            });
                            
                            vm.nbr_demande_feffi_creer = item.nbr_demande_feffi_creer;
                            
                                              
                      break;
                  case 'ODAAF':
                              apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandevalidedaafByconvention",'id_convention_cife_entete',item.id).then(function(result)
                              {console.log(id_convention);
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                    return resolve('ok');  
                              });
                      break;
                  
                  case 'DAAF': 
                               apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeemidaafByconvention",'id_convention_cife_entete',item.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response; 
                                  apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaissvalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                        vm.alldecaiss_fonct_feffi = result.data.response;
                                        return resolve('ok'); 
                                  }); 
                              });
                              vm.nbr_demande_feffi_emidaaf = item.nbr_demande_feffi_emidaaf;
                              vm.nbr_demande_feffi_encourdaaf = item.nbr_demande_feffi_encourdaaf;
                              



                              
                      break;
                  case 'ODPFI': 
                                
                      
                      break;

                  case 'DPFI':
                            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeemidpfiByconvention",'id_convention_cife_entete',item.id).then(function(result)
                            {console.log(id_convention);
                                vm.alldemande_realimentation_invalide = result.data.response; 
                                apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaissvalideByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                      vm.alldecaiss_fonct_feffi = result.data.response;

                                    return resolve('ok'); 
                                }); 
                            });
                            vm.nbr_demande_feffi_emidpfi = item.nbr_demande_feffi_emidpfi;
                            vm.nbr_demande_feffi_encourdpfi = item.nbr_demande_feffi_encourdpfi;
                            
                            
                      break;

                  case 'ADMIN':
                            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeByconvention",'id_convention_cife_entete',item.id).then(function(result)
                            {
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                   apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaissByconvention','id_convention_entete',item.id).then(function(result)
                                    {
                                        vm.alldecaiss_fonct_feffi = result.data.response;
                                        return resolve('ok'); 
                                    });
            
                            });
                            vm.nbr_demande_feffi_creer = item.nbr_demande_feffi_creer;
                            vm.nbr_demande_feffi_emidaaf = item.nbr_demande_feffi_emidaaf;
                            vm.nbr_demande_feffi_encourdaaf = item.nbr_demande_feffi_encourdaaf;
                            vm.nbr_demande_feffi_emidpfi = item.nbr_demande_feffi_emidpfi;
                            vm.nbr_demande_feffi_encourdpfi = item.nbr_demande_feffi_encourdpfi;
                            

                           
                            
                       
                      break;

                  case 'UFP':

                          apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandevalidedaafByconvention",'id_convention_cife_entete',item.id).then(function(result)
                          {
                              vm.alldemande_realimentation_invalide = result.data.response;
                              apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaissvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                    vm.alldecaiss_fonct_feffi = result.data.response;
                                    return resolve('ok');  
                              });  
                          });                                               
                                                
                                           
                      break;
                  default:
                      break;
              
                }            
            });
        
        }
        function donnee_menu_mpe(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                switch (session)
                {
                  case 'OBCAF':
                              
                              apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allpassation_marches = result.data.response.filter(function(obj)
                                  {
                                      return obj.validation == 0;
                                  });
                                  console.log(vm.allpassation_marches);

                                  if (result.data.response.length!=0)
                                  {
                                      vm.showbuttonNouvPassation=false;
                                  }

                                  apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.allcontrat_prestataire = result.data.response.filter(function(obj)
                                      {
                                          return obj.validation == 0;
                                      });

                                      if (result.data.response.length!=0)
                                      {
                                        vm.showbuttonNouvcontrat_prestataire=false;
                                      }
                                  return resolve('ok'); 
                                  }); 
                              });                
                      break;

                 case 'BCAF':
                            
                            apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches = result.data.response;
                                vm.showbuttonNouvPassation=false;
                            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allcontrat_prestataire = result.data.response;
                                vm.showbuttonNouvcontrat_prestataire=false;
                                
                            return resolve('ok');
                            });
                                
                            });
                       
                      break;
                  case 'ODAAF':
                             
                       
                      break;
                  
                  case 'DAAF':
                              apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allpassation_marches = result.data.response;
                                  vm.showbuttonNouvPassation=false;
                              apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allcontrat_prestataire = result.data.response;
                                  vm.showbuttonNouvcontrat_prestataire=false;
                                  return resolve('ok');
                              });
                                  
                              });
                              
                      break;
                  case 'ODPFI': 
                           
                      break;

                  case 'DPFI':
                            
                            apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches = result.data.response;
                                vm.showbuttonNouvPassation=false;
                            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allcontrat_prestataire = result.data.response;
                                vm.showbuttonNouvcontrat_prestataire=false;
                                
                            return resolve('ok');
                            });
                                
                            });
                       
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allpassation_marches = result.data.response;
                                if (vm.allpassation_marches.length!=0)
                                {
                                    vm.showbuttonNouvPassation=false;
                                }
                                console.log(vm.allpassation_marches);
                                apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',item.id).then(function(result)
                                {
                                    vm.allcontrat_prestataire = result.data.response;

                                    if (result.data.response.length!=0)
                                    {
                                      vm.showbuttonNouvcontrat_prestataire=false;
                                    }
                                    return resolve('ok');
                                });
                            });

                            
                       
                      break;

                  case 'UFP':
                          apiFactory.getAPIgeneraliserREST("passation_marches/index",'menu','getpassationvalideByconvention','id_convention_entete',item.id).then(function(result)
                          {
                              vm.allpassation_marches = result.data.response;
                              vm.showbuttonNouvPassation=false;
                              apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allcontrat_prestataire = result.data.response;
                                  vm.showbuttonNouvcontrat_prestataire=false;
                                  return resolve('ok');
                              });
                              
                          });
                          
                          
                                            
                      break;
                  default:
                      break;
              
                }            
            });
        }

        function donnee_menu_reliquat(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                switch (session)
                {
                  case 'OBCAF':

                              apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.alltransfert_reliquat = result.data.response.filter(function(obj)
                                  {
                                      return obj.validation == 0;
                                  });

                                  if (result.data.response.length!=0)
                                  {
                                    vm.showbuttonNouvTransfert_reliquat=false;
                                  }
                                  return resolve('ok');
                              });
                                                
                      break;

                 case 'BCAF':
                            apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.alltransfert_reliquat = result.data.response;
                                vm.showbuttonNouvTransfert_reliquat=false;
                                
                            return resolve('ok');
                            });
                       
                      break;
                  case 'ODAAF':
                             
                       
                      break;
                  
                  case 'DAAF':
                              apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.alltransfert_reliquat = result.data.response;
                                  vm.showbuttonNouvTransfert_reliquat=false;
                                  
                              return resolve('ok');
                              });
                      break;
                  case 'ODPFI': 
                           
                      break;

                  case 'DPFI':
                            apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.alltransfert_reliquat = result.data.response;
                                vm.showbuttonNouvTransfert_reliquat=false;
                               return resolve('ok'); 
                            });
                            
                       
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.alltransfert_reliquat = result.data.response;

                                if (result.data.response.length!=0)
                                {
                                  vm.showbuttonNouvTransfert_reliquat=false;
                                }
                                return resolve('ok');
                            });
                            
                       
                      break;

                  case 'UFP':
                          apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertvalideByconvention','id_convention_entete',item.id).then(function(result)
                          {
                              vm.alltransfert_reliquat = result.data.response;
                              vm.showbuttonNouvTransfert_reliquat=false;
                             return resolve('ok'); 
                          });
                          
                                            
                      break;
                  default:
                      break;
              
                }            
            });
        }

        function donnee_menu_indicateur(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                switch (session)
                {
                  case 'OBCAF':

                              apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',item.id).then(function(result)
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
                                                
                      break;

                 case 'BCAF':
                            apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allindicateur = result.data.response;
                                vm.showbuttonNouvIndicateur=false;
                               return resolve('ok'); 
                            });
                            
                       
                      break;
                  case 'ODAAF':
                             
                       
                      break;
                  
                  case 'DAAF':
                              apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurvalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.allindicateur = result.data.response;
                                  vm.showbuttonNouvIndicateur=false;
                                 return resolve('ok'); 
                              });
                              
                      break;
                  case 'ODPFI': 
                           
                      break;

                  case 'DPFI':
                            apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allindicateur = result.data.response;
                                vm.showbuttonNouvIndicateur=false;
                               return resolve('ok'); 
                            });
                            
                       
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allindicateur = result.data.response;

                                if (result.data.response.length!=0)
                                {
                                  vm.showbuttonNouvIndicateur=false;
                                }
                                return resolve('ok');
                            });
                            
                       
                      break;

                  case 'UFP':
                          apiFactory.getAPIgeneraliserREST("indicateur/index",'menu','getindicateurvalideByconvention','id_convention_entete',item.id).then(function(result)
                          {
                              vm.allindicateur = result.data.response;
                              vm.showbuttonNouvIndicateur = false;
                              return resolve('ok');
                          });
                          
                                            
                      break;
                  default:
                      break;
              
                }            
            });
        }
        

/*****************Debut StepTwo demande_realimentation_feffi****************/

      vm.demande_realimentation_column = [                
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Nom banque"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Situation"},
        {titre:"Action"}];     
        

        //Masque de saisi ajout
        vm.ajouterDemande_realimentation = function ()
        { 
            var items = {
                            $edit: true,
                            $selected: true,
                            id: '0',
                            id_compte_feffi: vm.allcompte_feffi[0].id,
                            numero_compte: vm.allcompte_feffi[0].numero_compte,
                            tranche: '',
                            cumul: '',
                            anterieur: '',
                            periode: '',
                            pourcentage:'',
                            reste:'',
                            date:'',
                            validation:'0',
                          };
          if (vm.NouvelItemDemande_realimentation == false)
          {   
              apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.alldemande_realimentation = result.data.response;
                  var last_id_demande = Math.max.apply(Math, vm.alldemande_realimentation.map(function(o){return o.id;}));

                vm.dataLastedemande = vm.alldemande_realimentation.filter(function(obj){return obj.id == last_id_demande;});

                if (vm.dataLastedemande.length>0)
                {
                    if (vm.dataLastedemande[0].validation == 3 || vm.dataLastedemande[0].validation == 6)
                    {
                        if(vm.dataLastedemande[0].validation == 3)
                        {
                            var last_tranche_demande = Math.max.apply(Math, vm.dataLastedemande.map(function(o){return o.tranche.code.split(' ')[1];}));
                            
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                            vm.alldemande_realimentation_invalide.push(items);                          
                            vm.selectedItemDemande_realimentation = items;
                            vm.NouvelItemDemande_realimentation = true ;

                        }
                        else
                        {
                          vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche 1';});
                          vm.alldemande_realimentation_invalide.push(items);                          
                          vm.selectedItemDemande_realimentation = items;
                          vm.NouvelItemDemande_realimentation = true ;
                          vm.dataLastedemande = [];
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!');
                        vm.allcurenttranche_deblocage_feffi = [];
                    }
                }
                else
                {
                    vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_realimentation_invalide.push(items);                          
                    vm.selectedItemDemande_realimentation = items;
                    vm.NouvelItemDemande_realimentation = true ;
                    vm.dataLastedemande = [];
                }
              });             
              
          }else
          {
              vm.showAlert('Ajout demande_realimentation','Un formulaire d\'ajout est déjà ouvert!!!');
          }

          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_realimentation(demande_realimentation,suppression)
        {
            if (vm.NouvelItemDemande_realimentation==false)
            {
                test_existanceDemande_realimentation (demande_realimentation,suppression); 
            } 
            else
            {
                insert_in_baseDemande_realimentation(demande_realimentation,suppression);
            }
        }

        //fonction de bouton d'annulation demande_realimentation
        vm.annulerDemande_realimentation = function(item)
        {
          if (vm.NouvelItemDemande_realimentation == false)
          {console.log('1');
            item.$edit     = false;
            item.$selected = false;

            item.id_compte_feffi = currentItemDemande_realimentation.id_compte_feffi ;
            item.numero_compte = currentItemDemande_realimentation.numero_compte ;
            item.id_tranche_deblocage_feffi = currentItemDemande_realimentation.id_tranche_deblocage_feffi ;
            item.cumul = currentItemDemande_realimentation.cumul ;
            item.anterieur = currentItemDemande_realimentation.anterieur ;
            item.periode = currentItemDemande_realimentation.periode ;
            item.pourcentage = currentItemDemande_realimentation.pourcentage ;
            item.reste = currentItemDemande_realimentation.reste ;
            item.date = currentItemDemande_realimentation.date ;
            item.validation = currentItemDemande_realimentation.validation;
            item.id_convention_cife_entete = currentItemDemande_realimentation.id_convention_cife_entete ;
            vm.showbuttonValidation = false;
            //item.date_approbation = currentItemDemande_realimentation.date_approbation ;
          }else
          {
            vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_realimentation.id;
            });
          }

          vm.selectedItemDemande_realimentation = {} ;
          vm.NouvelItemDemande_realimentation      = false;
          vm.modificationdemande = false;
          
        };

        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            if (item.$selected ==false || item.$selected == undefined)
            {
                currentItemDemande_realimentation     = JSON.parse(JSON.stringify(vm.selectedItemDemande_realimentation));
               //recuperation donnée demande_realimentation_feffi
                apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',item.id).then(function(result)
                {
                    vm.allpiece_justificatif_feffi = result.data.response;
                    
                });
                if (vm.session=='ODAAF')
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferinvalideBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      if (vm.alltransfert_daaf.length >0)
                      {
                        vm.showbuttonNouvtransfert_daaf= false;
                      }
                  });
                }
                if (vm.session=='DAAF') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      vm.showbuttonNouvtransfert_daaf= false;
                      
                  });
                } 
                if (vm.session=='DPFI') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransfervalideBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      vm.showbuttonNouvtransfert_daaf= false;
                      
                  });
                }
                if (vm.session=='BCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransfervalideBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      vm.showbuttonNouvtransfert_daaf= false;
                      
                  });
                }
                /*if (vm.session=='OBCAF') 
                {
                  vm.alltransfert_daaf = [];
                }*/
                if (vm.session=='ADMIN') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      if (vm.alltransfert_daaf.length >0)
                      {
                          vm.showbuttonNouvtransfert_daaf= false;
                      }
                  });
                } 
                if (vm.session=='UFP') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransfervalideBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      vm.showbuttonNouvtransfert_daaf= false;
                      
                  });
                }                       
                  
                
                console.log(item.validation);
                vm.validation = item.validation;
                vm.steppiecefeffi=true;
                vm.steptransdaaf=true;
                vm.showbuttonValidation = true;

                vm.showbuttonValidationenrejedpfi = true;
                vm.showbuttonValidationencourdpfi = true;        
                vm.showbuttonValidationdpfi = true;
                
                vm.showbuttonValidationenrejedaaf = true;
                vm.showbuttonValidationencourdaaf = true;        
                vm.showbuttonValidationdaaf = true;
            }
            
            
            /*if (item.$edit ==true) {
              vm.showbuttonValidation = false;
            }*/
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation_invalide) return;
             vm.alldemande_realimentation_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });

        //fonction masque de saisie modification item convention_cisco_feffi_entete
        vm.modifierDemande_realimentation = function(item)
        {
            vm.NouvelItemDemande_realimentation = false ;
            vm.selectedItemDemande_realimentation = item;
            currentItemDemande_realimentation = angular.copy(vm.selectedItemDemande_realimentation);
            $scope.vm.alldemande_realimentation.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.id_compte_feffi = vm.selectedItemDemande_realimentation.compte_feffi.id ;
            item.numero_compte = vm.selectedItemDemande_realimentation.compte_feffi.numero_compte ;
            item.id_tranche_deblocage_feffi = vm.selectedItemDemande_realimentation.tranche.id ;
            item.cumul = vm.selectedItemDemande_realimentation.cumul ;
            item.anterieur = vm.selectedItemDemande_realimentation.anterieur ;
            item.periode = vm.selectedItemDemande_realimentation.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_realimentation.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_realimentation.reste ;
            item.date = new Date(vm.selectedItemDemande_realimentation.date) ;
            item.validation = vm.selectedItemDemande_realimentation.validation;
            item.id_convention_cife_entete = vm.selectedItemDemande_realimentation.convention_cife_entete.id;
            vm.modificationdemande = true;
            vm.showbuttonValidation = false;
            //item.date_approbation = vm.selectedItemDemande_realimentation.date_approbation ;  
        };

        //fonction bouton suppression item convention_cisco_feffi_entete
        vm.supprimerDemande_realimentation = function()
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
                vm.ajoutDemande_realimentation(vm.selectedItemDemande_realimentation,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_cisco_feffi_entete
        function test_existanceDemande_realimentation (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_realimentation.filter(function(obj)
                {
                   return obj.id == currentItemDemande_realimentation.id;
                });
                if(dema[0])
                {
                   if((dema[0].id_compte_feffi != currentItemDemande_realimentation.id_compte_feffi )
                    || (dema[0].id_tranche_deblocage_feffi != currentItemDemande_realimentation.id_tranche_deblocage_feffi )
                    || (dema[0].cumul != currentItemDemande_realimentation.cumul )
                    || (dema[0].anterieur != currentItemDemande_realimentation.anterieur )
                    || (dema[0].periode != currentItemDemande_realimentation.periode )
                    || (dema[0].pourcentage != currentItemDemande_realimentation.pourcentage )
                    || (dema[0].reste != currentItemDemande_realimentation.reste )
                    || (dema[0].date != currentItemDemande_realimentation.date )
                    || (dema[0].id_convention_cife_entete != currentItemDemande_realimentation.id_convention_cife_entete ))                    
                      { 
                        insert_in_baseDemande_realimentation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_realimentation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function insert_in_baseDemande_realimentation(demande_realimentation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_realimentation==false)
            {
                getId = vm.selectedItemDemande_realimentation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    id_compte_feffi: demande_realimentation.id_compte_feffi ,
                    id_tranche_deblocage_feffi: demande_realimentation.id_tranche_deblocage_feffi ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: 0 ,
                    id_convention_cife_entete: vm.selectedItemConvention_entete.id              
                });
                //console.log(demande_realimentation.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                var comp = vm.allcompte_feffi.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_compte_feffi;
                });

                var tran= vm.alltranche_deblocage_feffi.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_tranche_deblocage_feffi;
                });
                var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == vm.selectedItemConvention_entete.id;
                });

                if (vm.NouvelItemDemande_realimentation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_realimentation.compte_feffi = comp[0];
                        vm.selectedItemDemande_realimentation.tranche = tran[0] ;
                        vm.selectedItemDemande_realimentation.convention_cife_entete = conv[0] ;
                        vm.selectedItemDemande_realimentation.$selected  = false;
                        vm.selectedItemDemande_realimentation.$edit      = false;
                        vm.selectedItemDemande_realimentation ={};
                    }
                    else 
                    {    
                      vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_realimentation.id;
                      });

                  vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)-1;
                    }
                }
                else
                {
                  demande_realimentation.tranche = tran[0] ;
                  demande_realimentation.compte_feffi = comp[0];
                  demande_realimentation.convention_cife_entete = conv[0] ;

                  demande_realimentation.id  =   String(data.response); 
                  //vm.alldemande_realimentation.push(demande_realimentation);             
                  vm.NouvelItemDemande_realimentation=false;
                  vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)+1;
            }
              demande_realimentation.$selected = false;
              demande_realimentation.$edit = false;
              vm.selectedItemDemande_realimentation = {};
              vm.modificationdemande = false;
              vm.showbuttonValidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.tranchechange = function(item)
        { 
          console.log('eeeee');
          var reste = 0;
          var anterieur = 0;
          var prevu = 0;
          var cumul= 0;

          if (vm.allcurenttranche_deblocage_feffi[0].code =='tranche 1')
            {
              prevu = parseInt(vm.allconvention_entete[0].montant_divers)+((parseInt(vm.allconvention_entete[0].montant_trav_mob) * parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100);
            console.log(prevu);
            } 
            else 
            {
              prevu = (parseInt(vm.allconvention_entete[0].montant_trav_mob )* parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;
            console.log(prevu);
            }

          cumul = prevu;
 console.log( vm.alldemande_realimentation_) ;
          if (vm.alldemande_realimentation.length>0)
          {                 
              anterieur = vm.dataLastedemande[0].prevu; console.log( anterieur) ;         
              cumul = prevu + parseInt(vm.dataLastedemande[0].cumul);
          }

          reste= vm.allconvention_entete[0].montant_total - cumul;

          item.periode = vm.allcurenttranche_deblocage_feffi[0].periode;
          item.pourcentage = vm.allcurenttranche_deblocage_feffi[0].pourcentage;

          item.prevu = prevu;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          //console.log(prevu + parseInt(vm.dernierdemande[0].cumul));
          
         /* if(vm.NouvelItemDemande_realimentation==false)
          {
            

          }*/
        }
        vm.change_compte = function(item)
        {
          var comp = vm.allcompte_feffi.filter(function(obj)
          {
              return obj.id == item.id_compte_feffi;
          });
          item.numero_compte = comp[0].numero_compte;
        }

        vm.valider_demandecreer = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_creer = parseInt(vm.nbr_demande_feffi_creer)-1;
            vm.nbr_demande_feffi_emidpfi = parseInt(vm.nbr_demande_feffi_emidpfi)+1;
        }

        vm.valider_demande = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
        }
        vm.valider_demandeemidpfi = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
                  vm.nbr_demande_feffi_encourdpfi = parseInt(vm.nbr_demande_feffi_encourdpfi)+1;
            vm.nbr_demande_feffi_emidpfi = parseInt(vm.nbr_demande_feffi_emidpfi)-1;
        }
        vm.rejeter_demandedpfi = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            //vm.nbr_demande_feffi_emidpfi = parseInt(vm.nbr_demande_feffi_emidpfi)-1;
            vm.nbr_demande_feffi_encourdpfi = parseInt(vm.nbr_demande_feffi_encourdpfi)-1;
        }

        vm.valider_demandedpfi = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_emidaaf = parseInt(vm.nbr_demande_feffi_emidaaf)+1;
            vm.nbr_demande_feffi_encourdpfi = parseInt(vm.nbr_demande_feffi_encourdpfi)-1;
        }

        vm.valider_demandeemidaaf = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_emidaaf = parseInt(vm.nbr_demande_feffi_emidaaf)-1;
            vm.nbr_demande_feffi_encourdaaf = parseInt(vm.nbr_demande_feffi_encourdaaf)+1;
        }
        vm.rejeter_demandedaaf = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_encourdaaf = parseInt(vm.nbr_demande_feffi_encourdaaf)-1;
        }
        vm.valider_demande_final = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_encourdaaf = parseInt(vm.nbr_demande_feffi_encourdaaf)-1;
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function validation_in_baseDemande_realimentation(demande_realimentation,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };

            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_realimentation.id,      
                    id_compte_feffi: demande_realimentation.compte_feffi.id ,
                    id_tranche_deblocage_feffi: demande_realimentation.tranche.id ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: validation ,
                    id_convention_cife_entete: demande_realimentation.convention_cife_entete.id              
                });

                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                vm.selectedItemDemande_realimentation.validation = String(validation);
                        
                //vm.alldemande_realimentation_valide.push(vm.selectedItemDemande_realimentation);
                

                /*vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemDemande_realimentation.id;
                });*/

                vm.showbuttonValidation = false;
                vm.selectedItemDemande_realimentation.$selected  = false;
                vm.selectedItemDemande_realimentation.$edit      = false;
                vm.selectedItemDemande_realimentation ={};
                vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)-1;


                vm.showbuttonValidation =false;
                vm.showbuttonValidationenrejedpfi = false;
                vm.showbuttonValidationencourdpfi = false;        
                vm.showbuttonValidationdpfi = false;
                
                vm.showbuttonValidationenrejedaaf = false;
                vm.showbuttonValidationencourdaaf = false;      96 
                vm.showbuttonValidationdaaf = false;

            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Emise au DPFI';                  
                  break;

             case '2':
                  
                  return 'En cours de traitement DPFI'; 
                  break;
              case '3':
                  
                  return 'Rejeté par DPFI'; 
                  break;
              
              case '4':
                        return 'Emise AU DAAF'; 
                  break;
              case '5':    
                  return 'En cours de traitement DAAF'; 
                  break;

              case '6':
                  
                  return 'Rejeté par DPFI'; 
                  break;

              case '7':
                  
                  return 'Finalisée'; 
                  break;

              case '0':
                      return 'Creer';                  
                  break;
              default:
                  break;
          
            }
        }
  
  /*************************Fin StepTwo demande_realimentation_feffi***************************************/


  /*********************************Fin StepThree piece_justificatif_feffi*******************************/

        vm.piece_justificatif_feffi_column = [
        {titre:"Description"},
        {titre:"Fichier"},
        {titre:"Date"},
        {titre:"Action"}];

        $scope.uploadFile = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemPiece_justificatif_feffi.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterPiece_justificatif_feffi = function ()
        { 
          if (NouvelItemPiece_justificatif_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              description: '',
              fichier:'',
              date: ''
            };         
            vm.allpiece_justificatif_feffi.push(items);
            vm.selectedItemPiece_justificatif_feffi = items;
             

            NouvelItemPiece_justificatif_feffi = true ;
          }else
          {
            vm.showAlert('Ajout piece_justificatif_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                test_existancePiece_justificatif_feffi (piece_justificatif_feffi,suppression); 
            } 
            else
            {
                insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation piece_justificatif_feffi
        vm.annulerPiece_justificatif_feffi = function(item)
        {
          if (NouvelItemPiece_justificatif_feffi == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.description = currentItemPiece_justificatif_feffi.description ;
            item.fichier = currentItemPiece_justificatif_feffi.fichier ;
            item.date        = currentItemPiece_justificatif_feffi.date ;  
          }else
          {
            vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
            });
          }

          vm.selectedItemPiece_justificatif_feffi = {} ;
          NouvelItemPiece_justificatif_feffi      = false;
          
        };

        //fonction selection item Piece_justificatif_feffi
        vm.selectionPiece_justificatif_feffi= function (item)
        {
            vm.selectedItemPiece_justificatif_feffi = item;
            currentItemPiece_justificatif_feffi     = JSON.parse(JSON.stringify(vm.selectedItemPiece_justificatif_feffi));
           // vm.allconvention_cisco_feffi_entete= [] ; 
        };
        $scope.$watch('vm.selectedItemPiece_justificatif_feffi', function()
        {
             if (!vm.allpiece_justificatif_feffi) return;
             vm.allpiece_justificatif_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPiece_justificatif_feffi.$selected = true;
        });

        //fonction masque de saisie modification item piece_justificatif_feffi
        vm.modifierPiece_justificatif_feffi = function(item)
        {
            NouvelItemPiece_justificatif_feffi = false ;
            vm.selectedItemPiece_justificatif_feffi = item;
            currentItemPiece_justificatif_feffi = angular.copy(vm.selectedItemPiece_justificatif_feffi);
            $scope.vm.allpiece_justificatif_feffi.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.description = vm.selectedItemPiece_justificatif_feffi.description ;
            item.fichier = vm.selectedItemPiece_justificatif_feffi.fichier ;
            item.date    = new Date(vm.selectedItemPiece_justificatif_feffi.date );  
        };

        //fonction bouton suppression item Piece_justificatif_feffi
        vm.supprimerPiece_justificatif_feffi = function()
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
                vm.ajoutPiece_justificatif_feffi(vm.selectedItemPiece_justificatif_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_cisco_feffi_entete
        function test_existancePiece_justificatif_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.allpiece_justificatif_feffi.filter(function(obj)
                {
                   return obj.id == currentItemPiece_justificatif_feffi.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItemPiece_justificatif_feffi.description)
                    || (dema[0].fichier!=currentItemPiece_justificatif_feffi.fichier)
                    || (dema[0].date!=currentItemPiece_justificatif_feffi.date))                    
                      { 
                        insert_in_basePiece_justificatif_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePiece_justificatif_feffi(item,suppression);
        }

         function insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                getId = vm.selectedItemPiece_justificatif_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: piece_justificatif_feffi.description,
                    fichier: piece_justificatif_feffi.fichier,
                    date: convertionDate(new Date(piece_justificatif_feffi.date)),
                    id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
            {   

              if (NouvelItemPiece_justificatif_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'piece_justificatif_feffi/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemPiece_justificatif_feffi.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemDemande_realimentation.convention_cife_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    piece_justificatif_feffi.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: piece_justificatif_feffi.description,
                                                      fichier: piece_justificatif_feffi.fichier,
                                                      date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                                      id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                                      validation: 0 
                                        });
                                      apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          piece_justificatif_feffi.$selected = false;
                                          piece_justificatif_feffi.$edit = false;
                                          vm.selectedItemPiece_justificatif_feffi = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: piece_justificatif_feffi.description,
                                        fichier: piece_justificatif_feffi.fichier,
                                        date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                        id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                        validation: 0                
                                    });
                                  apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                  {
                                        
                                      piece_justificatif_feffi.$selected = false;
                                      piece_justificatif_feffi.$edit = false;
                                      vm.selectedItemPiece_justificatif_feffi = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemPiece_justificatif_feffi.$selected  = false;
                        vm.selectedItemPiece_justificatif_feffi.$edit      = false;
                        vm.selectedItemPiece_justificatif_feffi ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemPiece_justificatif_feffi.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          vm.showAlert(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  piece_justificatif_feffi.id  =   String(data.response);              
                  NouvelItemPiece_justificatif_feffi = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'piece_justificatif_feffi/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemDemande_realimentation.convention_cife_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              piece_justificatif_feffi.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: piece_justificatif_feffi.description,
                                                fichier: piece_justificatif_feffi.fichier,
                                                date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                                id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                                validation: 0 
                                  });
                                apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    piece_justificatif_feffi.$selected = false;
                                    piece_justificatif_feffi.$edit = false;
                                    vm.selectedItemPiece_justificatif_feffi = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                            console.log(data['nomFile']);
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: piece_justificatif_feffi.description,
                                  fichier: piece_justificatif_feffi.fichier,
                                  date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                  id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                  validation: 0                
                              });
                            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                            {
                                  
                                piece_justificatif_feffi.$selected = false;
                                piece_justificatif_feffi.$edit = false;
                                vm.selectedItemPiece_justificatif_feffi = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              piece_justificatif_feffi.$selected = false;
              piece_justificatif_feffi.$edit = false;
              vm.selectedItemPiece_justificatif_feffi = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
         vm.download_piece_justificatif = function(item)
        {//console.log(item.fichier);
            window.location = apiUrlFile+item.fichier;
        }


  /**********************************Fin StepThree piece_justificatif_feffi****************************/


  /*************************************debut StepThree transfert daaf********************************/
          //col table
            vm.transfert_daaf_column = [
            {titre:"Montant transféré"},        
            {titre:"Frais bancaire"},
            {titre:"Montant total"},
            {titre:"Date"},
            {titre:"Situation"},
            {titre:"Observation"},
            {titre:"Action"}];

            //Masque de saisi ajout
            vm.ajouterTransfert_daaf = function ()
            { 
              if (NouvelItemTransfert_daaf == false)
              {
                var items = {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  montant_transfert: parseInt(vm.selectedItemDemande_realimentation.prevu),
                  frais_bancaire:'',
                  montant_total:'',
                  date:'',
                  observation:'',
                  validation:'0'
                };         
                vm.alltransfert_daaf.push(items);
                vm.alltransfert_daaf.forEach(function(conv)
                {
                  if(conv.$selected==true)
                  {
                    vm.selectedItemTransfert_daaf = conv;
                  }
                });

                NouvelItemTransfert_daaf = true ;
              }else
              {
                vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
              }                
                          
            };

            //fonction ajout dans bdd
            function ajoutTransfert_daaf(transfert_daaf,suppression)
            {
                if (NouvelItemTransfert_daaf==false)
                {
                    test_existanceTransfert_daaf (transfert_daaf,suppression); 
                } 
                else
                {
                    insert_in_baseTransfert_daaf(transfert_daaf,suppression);
                }
            }

            //fonction de bouton d'annulation transfert_daaf
            vm.annulerTransfert_daaf = function(item)
            {
              if (NouvelItemTransfert_daaf == false)
              {
                  item.$edit = false;
                  item.$selected = false;

                  item.montant_transfert = currentItemTransfert_daaf.montant_transfert;
                  item.frais_bancaire = currentItemTransfert_daaf.frais_bancaire;
                  item.montant_total = currentItemTransfert_daaf.montant_total;
                  item.date = currentItemTransfert_daaf.date;
                  item.observation    = currentItemTransfert_daaf.observation; 
              }else
              {
                vm.alltransfert_daaf = vm.alltransfert_daaf.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemTransfert_daaf.id;
                });
              }

              vm.selectedItemTransfert_daaf = {} ;
              NouvelItemTransfert_daaf      = false;
              
            };

            //fonction selection item Transfert_daaf convention cisco/feffi
            vm.selectionTransfert_daaf = function (item)
            {
                vm.selectedItemTransfert_daaf = item;
               // vm.allconvention= [] ;
                if (item.$selected == false || item.$selected==undefined)
                {
                  vm.showbuttonValidation_trans_daaf = true;
                  currentItemTransfert_daaf     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_daaf));
                }
                vm.validation_transfert_daaf  = item.validation;          

            };
            $scope.$watch('vm.selectedItemTransfert_daaf', function()
            {
                 if (!vm.alltransfert_daaf) return;
                 vm.alltransfert_daaf.forEach(function(item)
                 {
                    item.$selected = false;
                 });
                 vm.selectedItemTransfert_daaf.$selected = true;
            });

            //fonction masque de saisie modification item convention
            vm.modifierTransfert_daaf = function(item)
            {
                NouvelItemTransfert_daaf = false ;
                vm.selectedItemTransfert_daaf = item;
                currentItemTransfert_daaf = angular.copy(vm.selectedItemTransfert_daaf);
                $scope.vm.alltransfert_daaf.forEach(function(cis) {
                  cis.$edit = false;
                });

                item.$edit = true;
                item.$selected = true;

                item.montant_transfert = parseInt(vm.selectedItemTransfert_daaf.montant_transfert) ;
                item.frais_bancaire = parseInt(vm.selectedItemTransfert_daaf.frais_bancaire) ;
                item.montant_total = parseInt(vm.selectedItemTransfert_daaf.montant_total );
                item.observation = vm.selectedItemTransfert_daaf.observation ;
                item.date = new Date(vm.selectedItemTransfert_daaf.date);
            };

            //fonction bouton suppression item Transfert_daaf convention cisco feffi
            vm.supprimerTransfert_daaf = function()
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
                    vm.ajoutTransfert_daaf(vm.selectedItemTransfert_daaf,1);
                  }, function() {
                    //alert('rien');
                  });
                  vm.stepTwo = false;
                  vm.stepThree = false;
            };

            //function teste s'il existe une modification item entente convention cisco feffi
            function test_existanceTransfert_daaf (item,suppression)
            {          
                if (suppression!=1)
                {
                   var convT = vm.alltransfert_daaf.filter(function(obj)
                    {
                       return obj.id == currentItemTransfert_daaf.id;
                    });
                    if(convT[0])
                    {
                       if((convT[0].observation!=currentItemTransfert_daaf.observation)
                        || (convT[0].date!=currentItemTransfert_daaf.date)
                        || (convT[0].montant_transfert!=currentItemTransfert_daaf.montant_transfert)
                        || (convT[0].frais_bancaire!=currentItemTransfert_daaf.frais_bancaire)
                        || (convT[0].montant_total!=currentItemTransfert_daaf.montant_total))                    
                          {
                              insert_in_baseTransfert_daaf(item,suppression);                        
                          }
                          else
                          {  
                            item.$selected = true;
                            item.$edit = false;
                          }
                    }
                } else
                      insert_in_baseTransfert_daaf(item,suppression);
            }

            //insertion ou mise a jours ou suppression item dans bdd convention
            function insert_in_baseTransfert_daaf(transfert_daaf,suppression)
            {
                //add
                var config =
                {
                    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
                };
                
                var getId = 0;
                if (NouvelItemTransfert_daaf ==false)
                {
                    getId = vm.selectedItemTransfert_daaf.id; 
                } 
                
                var datas = $.param({
                        supprimer: suppression,
                        id:        getId,      
                        montant_transfert:    transfert_daaf.montant_transfert,
                        frais_bancaire:    transfert_daaf.frais_bancaire,
                        montant_total: transfert_daaf.montant_total,
                        observation: transfert_daaf.observation,
                        date: convertionDate(new Date(transfert_daaf.date)), 
                        id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                        validation:0            
                    });
                    //console.log(datas);
                    //factory
                apiFactory.add("transfert_daaf/index",datas, config).success(function (data)
                {

                    if (NouvelItemTransfert_daaf == false)
                    {
                        // Update or delete: id exclu                 
                        if(suppression==0)
                        {
                            
                            vm.selectedItemTransfert_daaf.$selected  = false;
                            vm.selectedItemTransfert_daaf.$edit      = false;
                            vm.selectedItemTransfert_daaf ={};
                        }
                        else 
                        {    
                          vm.alltransfert_daaf = vm.alltransfert_daaf.filter(function(obj)
                          {
                              return obj.id !== vm.selectedItemTransfert_daaf.id;
                          });
                          vm.showbuttonNouvtransfert_daaf = true;
                        }
                    }
                    else
                    {
                      transfert_daaf.validation = 0;
                      transfert_daaf.id  =   String(data.response);              
                      NouvelItemTransfert_daaf = false;

                      vm.showbuttonNouvtransfert_daaf = false;
                } 
                  transfert_daaf.$selected = false;
                  transfert_daaf.$edit = false;
                  vm.selectedItemTransfert_daaf = {};
                  vm.showbuttonValidation_trans_daaf = false;
              }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


            }

            vm.valider_transfert_daaf= function()
            {
              validation_in_baseTransfert_daaf(vm.selectedItemTransfert_daaf,0);
            }
            function validation_in_baseTransfert_daaf(transfert_daaf,suppression)
            {
                //add
                var config =
                {
                    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
                };
                
                var datas = $.param({
                        supprimer: suppression,
                        id:        transfert_daaf.id,      
                        montant_transfert:    transfert_daaf.montant_transfert,
                        frais_bancaire:    transfert_daaf.frais_bancaire,
                        montant_total: transfert_daaf.montant_total,
                        observation: transfert_daaf.observation,
                        date: convertionDate(new Date(transfert_daaf.date)), 
                        id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                        validation:1            
                    });
                    console.log(datas);
                    //factory
                apiFactory.add("transfert_daaf/index",datas, config).success(function (data)
                { vm.selectedItemTransfert_daaf.validation=1;
                  vm.validation_transfert_daaf=1;
                  transfert_daaf.$selected = false;
                  transfert_daaf.$edit = false;
                  vm.selectedItemTransfert_daaf = {};
                  vm.showbuttonValidation_trans_daaf = false;
              }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


            }

            vm.changeFraibancaire = function(item)
            {
              item.montant_total = parseInt(item.montant_transfert) + parseInt(item.frais_bancaire);
            }

        vm.affichage_trans =function(situation)
        {
          var affichage = 'En attente';
          if (situation == 1)
          {
            var affichage = 'Transferé';
          }
          return affichage;
        }
  /**********************************Fin StepThree transfert daaf***********************************/

  /**********************************fin decaissement fonctionnement feffi******************************/


        //Masque de saisi ajout
        vm.ajouterDecaiss_fonct_feffi= function ()
        { 
          
          if (NouvelItemDecaiss_fonct_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant: '',
              date_decaissement: '',
              observation: '',
              observation: '0'
            };
        
            vm.alldecaiss_fonct_feffi.push(items);
            vm.alldecaiss_fonct_feffi.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDecaiss_fonct_feffi = mem;
              }
            });

            NouvelItemDecaiss_fonct_feffi = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout decaiss_fonct_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            if (NouvelItemDecaiss_fonct_feffi==false)
            {
                test_existanceDecaiss_fonct_feffi (decaiss_fonct_feffi,suppression); 
            } 
            else
            {
                insert_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation decaiss_fonct_feffi
        vm.annulerDecaiss_fonct_feffi = function(item)
        {
          if (NouvelItemDecaiss_fonct_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant   = currentItemDecaiss_fonct_feffi.montant ;
            item.date_decaissement   = currentItemDecaiss_fonct_feffi.date_decaissement ;
            item.observation   = currentItemDecaiss_fonct_feffi.observation ;
          }else
          {
            vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDecaiss_fonct_feffi.id;
            });
          }

          vm.selectedItemDecaiss_fonct_feffi = {} ;
          NouvelItemDecaiss_fonct_feffi      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDecaiss_fonct_feffi= function (item)
        {
            vm.selectedItemDecaiss_fonct_feffi = item;
            vm.nouvelItemDecaiss_fonct_feffi   = item;
            currentItemDecaiss_fonct_feffi    = JSON.parse(JSON.stringify(vm.selectedItemDecaiss_fonct_feffi));
            if(item.id!=0)
            {
              vm.showbuttonValidation_dec_feffi = true;
            }
            vm.validation_decais_fef=item.validation;
            
        };
        $scope.$watch('vm.selectedItemDecaiss_fonct_feffi', function()
        {
             if (!vm.alldecaiss_fonct_feffi) return;
             vm.alldecaiss_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDecaiss_fonct_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDecaiss_fonct_feffi = function(item)
        {
            NouvelItemDecaiss_fonct_feffi = false ;
            vm.selectedItemDecaiss_fonct_feffi = item;
            currentItemDecaiss_fonct_feffi = angular.copy(vm.selectedItemDecaiss_fonct_feffi);
            $scope.vm.alldecaiss_fonct_feffi.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.montant   = parseInt(vm.selectedItemDecaiss_fonct_feffi.montant);
            item.date_decaissement   = new Date(vm.selectedItemDecaiss_fonct_feffi.date_decaissement) ;
            item.observation   = vm.selectedItemDecaiss_fonct_feffi.observation ;
        };

        //fonction bouton suppression item decaiss_fonct_feffi
        vm.supprimerDecaiss_fonct_feffi = function()
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
                vm.ajoutDecaiss_fonct_feffi(vm.selectedItemDecaiss_fonct_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDecaiss_fonct_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldecaiss_fonct_feffi.filter(function(obj)
                {
                   return obj.id == currentItemDecaiss_fonct_feffi.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant   != currentItemDecaiss_fonct_feffi.montant )
                    ||(mem[0].date_decaissement   != currentItemDecaiss_fonct_feffi.date_decaissement )
                    ||(mem[0].observation   != currentItemDecaiss_fonct_feffi.observation ))                   
                      { 
                         insert_in_baseDecaiss_fonct_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDecaiss_fonct_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd decaiss_fonct_feffi
        function insert_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDecaiss_fonct_feffi==false)
            {
                getId = vm.selectedItemDecaiss_fonct_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant: decaiss_fonct_feffi.montant,
                    date_decaissement: convertionDate(new Date(decaiss_fonct_feffi.date_decaissement)),
                    observation: decaiss_fonct_feffi.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("decaiss_fonct_feffi/index",datas, config).success(function (data)
            {   
              var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == decaiss_fonct_feffi.id_convention_entete;
                });

              if (NouvelItemDecaiss_fonct_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemDecaiss_fonct_feffi.convention_entete = conv[0];
                        vm.selectedItemDecaiss_fonct_feffi.$selected  = false;
                        vm.selectedItemDecaiss_fonct_feffi.$edit      = false;
                        vm.selectedItemDecaiss_fonct_feffi ={};
                        vm.showbuttonValidation_dec_feffi = false;
                    }
                    else 
                    {    
                      vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDecaiss_fonct_feffi.id;
                      });
                      vm.showbuttonValidation_dec_feffi = false;

              vm.nbr_decaiss_feffi = parseInt(vm.nbr_decaiss_feffi)-1;
                    }
              }
              else
              {   
                  decaiss_fonct_feffi.convention_entete = conv[0];
                  decaiss_fonct_feffi.id  =   String(data.response);              
                  NouvelItemDecaiss_fonct_feffi = false;

              vm.nbr_decaiss_feffi = parseInt(vm.nbr_decaiss_feffi)+1;
                                        
               }
              
              decaiss_fonct_feffi.$selected = false;
              decaiss_fonct_feffi.$edit = false;
              vm.selectedItemDecaiss_fonct_feffi = {};
              vm.showbuttonValidation_dec_feffi = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerDecaiss_fonct_feffi = function()
        {
          maj_in_baseDecaiss_fonct_feffi(vm.selectedItemDecaiss_fonct_feffi,0);
        }

        //insertion ou mise a jours ou suppression item dans bdd decaiss_fonct_feffi
        function maj_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        decaiss_fonct_feffi.id,
                    montant: decaiss_fonct_feffi.montant,
                    date_decaissement: convertionDate(new Date(decaiss_fonct_feffi.date_decaissement)),
                    observation: decaiss_fonct_feffi.observation,
                    id_convention_entete: decaiss_fonct_feffi.convention_entete.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("decaiss_fonct_feffi/index",datas, config).success(function (data)
            {  
              vm.selectedItemDecaiss_fonct_feffi.validation=1;
              vm.validation_decais_fef=1;              
              vm.selectedItemDecaiss_fonct_feffi = {};
              vm.showbuttonValidation_dec_feffi = false;
              vm.nbr_decaiss_feffi = parseInt(vm.nbr_decaiss_feffi)-1;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.affichage_situa_decais =function(situation)
        {
          var affichage = 'En attente';
          if (situation == 1)
          {
            var affichage = 'Validé';
          }

          return affichage;
        }

  /**************************************fin decaissement fonctionnement feffi****************************************/

  /********************************************Debut passation de marcher*********************************************/
        //recuperation donnée partenaire_relai
        /*apiFactory.getAll("partenaire_relai/index").then(function(result)
        {
            vm.allpartenaire_relai = result.data.response;
        });*/
        
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
                test_existancePassation_marches_pr (passation_marches_pr,suppression); 
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
            //item.id_partenaire_relai = currentItemPassation_marches_pr.id_partenaire_relai ;            
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
            vm.nouvelItemPassation_marches_pr   = item;
            if (item.$selected ==false || item.$selected == undefined)
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
            item.date_os   = new Date(vm.selectedItemPassation_marches_pr.date_os)  ;
            item.date_remise   = new Date(vm.selectedItemPassation_marches_pr.date_remise) ;
            item.nbr_offre_recu = parseInt(vm.selectedItemPassation_marches_pr.nbr_offre_recu);
            item.date_lancement_dp = new Date(vm.selectedItemPassation_marches_pr.date_lancement_dp) ;
            item.date_manifestation   = new Date(vm.selectedItemPassation_marches_pr.date_manifestation) ;
            item.partenaire_relai   = vm.selectedItemPassation_marches_pr.partenaire_relai.id;
             vm.showbuttonValidationpassation_pr = false;
            
        };

        //fonction bouton suppression item passation_marches_pr
        vm.supprimerPassation_marches_pr = function()
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
                    date_lancement_dp: convertionDate(new Date(passation_marches_pr.date_lancement_dp)),
                    date_os: convertionDate(new Date(passation_marches_pr.date_os)),
                    date_remise: convertionDate(new Date(passation_marches_pr.date_remise)),
                    nbr_offre_recu: passation_marches_pr.nbr_offre_recu,                    
                    id_partenaire_relai: passation_marches_pr.id_partenaire_relai,
                    date_manifestation: convertionDate(new Date(passation_marches_pr.date_manifestation)),
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
                        vm.selectedItemPassation_marches_pr.convention_entete = vm.selectedItemConvention_entete;
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
                  passation_marches_pr.convention_entete = vm.selectedItemConvention_entete;
                  passation_marches_pr.id  =   String(data.response);              
                  NouvelItemPassation_marches_pr=false;
                  vm.showbuttonNouvPassation_pr= false;
            }

              passation_marches_pr.$selected = false;
              passation_marches_pr.$edit = false;
              vm.selectedItemPassation_marches_pr = {};
            
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
                    date_lancement_dp: convertionDate(new Date(passation_marches_pr.date_lancement_dp)),
                    date_os: convertionDate(new Date(passation_marches_pr.date_os)),
                    date_remise: convertionDate(new Date(passation_marches_pr.date_remise)),
                    nbr_offre_recu: passation_marches_pr.nbr_offre_recu,                    
                    id_partenaire_relai: passation_marches_pr.id_partenaire_relai,
                    date_manifestation: convertionDate(new Date(passation_marches_pr.date_manifestation)),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_pr/index",datas, config).success(function (data)
            { vm.selectedItemPassation_marches_pr.validation = 1;
            vm.validation_passation_pr = 1;  
              vm.showbuttonValidationpassation_pr = false;  
              passation_marches_pr.$selected = false;
              vm.selectedItemPassation_marches_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
  /*****************************************fin passation de marcher**************************************************/


  /*********************************************debut contrat pr**********************************************/

  
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
        },
        {titre:"Action"
        }];

        //Masque de saisi ajout
        vm.ajouterContrat_partenaire_relai = function ()
        { 
          if (NouvelItemContrat_partenaire_relai == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              intitule: '',
              ref_contrat: '',
              montant_contrat: 0,
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
                test_existanceContrat_partenaire_relai (contrat_partenaire_relai,suppression); 
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
            vm.nouvelItemContrat_partenaire_relai   = item;
            currentItemContrat_partenaire_relai    = JSON.parse(JSON.stringify(vm.selectedItemContrat_partenaire_relai));

           if(item.id!=0)
           {
            
              apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allavenant_partenaire_relai = result.data.response;
              });
              if (item.$selected==false || item.$selected==undefined)
              {
                  vm.showbuttonValidationcontrat_pr = true;
                  if(vm.roles.indexOf("OBCAF")!= -1)
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
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
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

                  if(vm.roles.indexOf("BCAF")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_dpp = result.data.response;                          
                          console.log(vm.allmodule_dpp);
                          vm.showbuttonNouvformdpp=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);
                          vm.showbuttonNouvformodc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);
                          vm.showbuttonNouvformgfpc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);
                          vm.showbuttonNouvformemies=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);
                          vm.showbuttonNouvformpmc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_sep = result.data.response;                          
                          console.log(vm.allmodule_sep);
                          vm.showbuttonNouvformsep=false;
                      });
                      vm.permissionboutonvaliderformdpp = true;
                  }

                  if(vm.roles.indexOf("DPFI")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai).then(function(result)
                      {
                          vm.allmodule_dpp = result.data.response;                          
                          console.log(vm.allmodule_dpp);
                          vm.showbuttonNouvformdpp=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);
                          vm.showbuttonNouvformodc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);
                          vm.showbuttonNouvformgfpc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);
                          vm.showbuttonNouvformemies=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);
                          vm.showbuttonNouvformpmc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_sep = result.data.response;                          
                          console.log(vm.allmodule_sep);
                          vm.showbuttonNouvformsep=false;
                      });
                  }

                  if(vm.roles.indexOf("DAAF")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai).then(function(result)
                      {
                          vm.allmodule_dpp = result.data.response;                          
                          console.log(vm.allmodule_dpp);
                          vm.showbuttonNouvformdpp=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);
                          vm.showbuttonNouvformodc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);
                          vm.showbuttonNouvformgfpc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);
                          vm.showbuttonNouvformemies=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);
                          vm.showbuttonNouvformpmc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_sep = result.data.response;                          
                          console.log(vm.allmodule_sep);
                          vm.showbuttonNouvformsep=false;
                      });

                  }
                  if(vm.roles.indexOf("UFP")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai).then(function(result)
                      {
                          vm.allmodule_dpp = result.data.response;                          
                          console.log(vm.allmodule_dpp);
                          vm.showbuttonNouvformdpp=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);
                          vm.showbuttonNouvformodc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);
                          vm.showbuttonNouvformgfpc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);
                          vm.showbuttonNouvformemies=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);
                          vm.showbuttonNouvformpmc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_sep = result.data.response;                          
                          console.log(vm.allmodule_sep);
                          vm.showbuttonNouvformsep=false;
                      });

                  }
                /*if(vm.roles.indexOf("ODAAF")!= -1)
                  {
                     apiFactory.getAPIgeneraliserREST("module_dpp/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai).then(function(result)
                      {
                          vm.allmodule_dpp = result.data.response;                          
                          console.log(vm.allmodule_dpp);
                          vm.showbuttonNouvformdpp=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);
                          vm.showbuttonNouvformodc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);
                          vm.showbuttonNouvformgfpc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);
                          vm.showbuttonNouvformemies=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);
                          vm.showbuttonNouvformpmc=false;
                      });
                      apiFactory.getAPIgeneraliserREST("module_sep/index",'menu','getmodulevalideBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_sep = result.data.response;                          
                          console.log(vm.allmodule_sep);
                          vm.showbuttonNouvformsep=false;
                      });
                      
                  }*/
                  if(vm.roles.indexOf("ADMIN")!= -1)
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
                      apiFactory.getAPIgeneraliserREST("module_odc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_odc = result.data.response;                          
                          console.log(vm.allmodule_odc);

                          if (result.data.response.length!=0)
                          {
                              vm.showbuttonNouvformodc=false;
                          }
                      });
                      apiFactory.getAPIgeneraliserREST("module_emies/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_emies = result.data.response;                          
                          console.log(vm.allmodule_emies);

                          if (result.data.response.length!=0)
                          {
                              vm.showbuttonNouvformemies=false;
                          }
                      });
                      apiFactory.getAPIgeneraliserREST("module_gfpc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_gfpc = result.data.response;                          
                          console.log(vm.allmodule_gfpc);

                          if (result.data.response.length!=0)
                          {
                              vm.showbuttonNouvformgfpc=false;
                          }
                      });
                      apiFactory.getAPIgeneraliserREST("module_pmc/index",'menu','getmoduleBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                      {
                          vm.allmodule_pmc = result.data.response;                          
                          console.log(vm.allmodule_pmc);

                          if (result.data.response.length!=0)
                          {
                              vm.showbuttonNouvformpmc=false;
                          }
                      });
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
              vm.validation_contrat_pr = item.validation;
              vm.stepprestaion_pr=true;
              vm.permissionboutonvaliderformdpp = true;
              vm.permissionboutonvaliderformodc = true;
              vm.permissionboutonvaliderformgfpc = true;
              vm.permissionboutonvaliderformemies = true;
              vm.permissionboutonvaliderformpmc = true;
              vm.permissionboutonvaliderformsep = true;
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
                    date_signature:convertionDate(new Date(contrat_partenaire_relai.date_signature)),
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

                var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == contrat_partenaire_relai.id_convention_entete;
                });

                if (NouvelItemContrat_partenaire_relai == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemContrat_partenaire_relai.convention_entete= conv[0];
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
                  contrat_partenaire_relai.convention_entete= conv[0];
                  contrat_partenaire_relai.partenaire_relai = pres[0];

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
                    date_signature:convertionDate(new Date(contrat_partenaire_relai.date_signature)),
                    id_partenaire_relai:contrat_partenaire_relai.partenaire_relai.id,
                    id_convention_entete: contrat_partenaire_relai.convention_entete.id,
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
            //vm.allcontrat_partenaire_relai.push(vm.selectedItemModule_dpp.contrat_partenaire_relai);
            vm.showbuttonValidationformdpp =false;
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
                    date_previ_resti: convertionDate(new Date(module_dpp.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_dpp.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_dpp.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_dpp.date_reel_resti)),
                    nbr_previ_parti: module_dpp.nbr_previ_parti,
                    nbr_previ_fem_parti: module_dpp.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_dpp.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_dpp.date_fin_previ_form)),
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
              vm.stepparticipantdpp=false;
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
                    date_previ_resti: convertionDate(new Date(module_odc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_odc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_odc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_odc.date_reel_resti)),
                    nbr_previ_parti: module_odc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_odc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_odc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_odc.date_fin_previ_form)),
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
                    date_previ_resti: convertionDate(new Date(module_emies.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_emies.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_emies.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_emies.date_reel_resti)),
                    nbr_previ_parti: module_emies.nbr_previ_parti,
                    nbr_previ_fem_parti: module_emies.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_emies.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_emies.date_fin_previ_form)),
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
                    date_previ_resti: convertionDate(new Date(module_gfpc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_gfpc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_gfpc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_gfpc.date_reel_resti)),
                    nbr_previ_parti: module_gfpc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_gfpc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_gfpc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_gfpc.date_fin_previ_form)),
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
                    date_previ_resti: convertionDate(new Date(module_pmc.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_pmc.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_pmc.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_pmc.date_reel_resti)),
                    nbr_previ_parti: module_pmc.nbr_previ_parti,
                    nbr_previ_fem_parti: module_pmc.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_pmc.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_pmc.date_fin_previ_form)),
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
                    date_previ_resti: convertionDate(new Date(module_sep.date_previ_resti)),
                    date_debut_reel_form: convertionDate(new Date(module_sep.date_debut_reel_form)),
                    date_fin_reel_form: convertionDate(new Date(module_sep.date_fin_reel_form)),
                    date_reel_resti:convertionDate(new Date(module_sep.date_reel_resti)),
                    nbr_previ_parti: module_sep.nbr_previ_parti,
                    nbr_previ_fem_parti: module_sep.nbr_previ_fem_parti,
                    date_debut_previ_form: convertionDate(new Date(module_sep.date_debut_previ_form)),
                    date_fin_previ_form: convertionDate(new Date(module_sep.date_fin_previ_form)),
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
              if (item.$selected==false || item.$selected==undefined)
              {
                  vm.showbuttonValidationcontrat_pr = true;
                  if(vm.roles.indexOf("OBCAF")!= -1)
                  {
                     apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
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
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
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
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
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

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
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
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
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
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
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
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeinvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_debut_travaux_moe_creer = true;
                      console.log(vm.alldemande_debut_travaux_moe);
                    });

                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeinvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                      vm.showbuttonNouvDemande_batiment_moe_creer = true;
                      console.log(vm.alldemande_batiment_moe);
                    });
                    apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeinvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                      vm.showbuttonNouvDemande_latrine_moe_creer = true;
                      console.log(vm.alldemande_latrine_moe);
                    });

                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeinvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_fin_travaux_moe_creer = true;
                      console.log(vm.alldemande_fin_travaux_moe);
                    }); 
                  }

                  if(vm.roles.indexOf("BCAF")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmemoire_technique = result.data.response;
                            vm.showbuttonNouvMemoire_technique = false;                            
                      }); 
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allappel_offre = result.data.response;
                            vm.showbuttonNouvAppel_offre = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allrapport_mensuel = result.data.response;
                            vm.showbuttonNouvRapport_mensuel = false;
                            
                      });

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmanuel_gestion = result.data.response;
                            vm.showbuttonNouvManuel_gestion = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                    {
                          vm.allpolice_assurance = result.data.response;                          
                          vm.showbuttonNouvPolice_assurance = false;
                                                   
                    });
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_debut_travaux_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                      vm.showbuttonNouvDemande_batiment_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                      vm.showbuttonNouvDemande_latrine_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_fin_travaux_moe_creer = false;
                    });
                  }

                  if(vm.roles.indexOf("DPFI")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoire_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmemoire_technique = result.data.response;
                            vm.showbuttonNouvMemoire_technique = false;                            
                      }); 
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappel_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allappel_offre = result.data.response;
                            vm.showbuttonNouvAppel_offre = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapport_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allrapport_mensuel = result.data.response;
                            vm.showbuttonNouvRapport_mensuel = false;
                            
                      });

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuel_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmanuel_gestion = result.data.response;
                            vm.showbuttonNouvManuel_gestion = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpolice_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                    {
                          vm.allpolice_assurance = result.data.response;                          
                          vm.showbuttonNouvPolice_assurance = false;
                                                   
                    });
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandevalidebcafBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_debut_travaux_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandevalidebcafBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                      vm.showbuttonNouvDemande_batiment_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandevalidebcafBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                      vm.showbuttonNouvDemande_latrine_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandevalidebcafBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_fin_travaux_moe_creer = false;
                    });
                  }

                  if(vm.roles.indexOf("DAAF")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoire_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmemoire_technique = result.data.response;
                            vm.showbuttonNouvMemoire_technique = false;                            
                      }); 
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappel_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allappel_offre = result.data.response;
                            vm.showbuttonNouvAppel_offre = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapport_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allrapport_mensuel = result.data.response;
                            vm.showbuttonNouvRapport_mensuel = false;
                            
                      });

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuel_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmanuel_gestion = result.data.response;
                            vm.showbuttonNouvManuel_gestion = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpolice_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                    {
                          vm.allpolice_assurance = result.data.response;                          
                          vm.showbuttonNouvPolice_assurance = false;
                                                   
                    });
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_debut_travaux_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                      vm.showbuttonNouvDemande_batiment_moe_creer = false;
                    });

                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                      vm.showbuttonNouvDemande_latrine_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_fin_travaux_moe_creer = false;
                    });

                  }
                  if(vm.roles.indexOf("UFP")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoire_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmemoire_technique = result.data.response;
                            vm.showbuttonNouvMemoire_technique = false;                            
                      }); 
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappel_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allappel_offre = result.data.response;
                            vm.showbuttonNouvAppel_offre = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapport_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allrapport_mensuel = result.data.response;
                            vm.showbuttonNouvRapport_mensuel = false;
                            
                      });

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuel_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmanuel_gestion = result.data.response;
                            vm.showbuttonNouvManuel_gestion = false;
                            
                      });
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpolice_valideBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                    {
                          vm.allpolice_assurance = result.data.response;                          
                          vm.showbuttonNouvPolice_assurance = false;
                                                   
                    });
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_debut_travaux_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                      vm.showbuttonNouvDemande_batiment_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                      vm.showbuttonNouvDemande_latrine_moe_creer = false;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandevalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_fin_travaux_moe_creer = false;
                    });

                  }
                  if(vm.roles.indexOf("ADMIN")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("memoire_technique/index",'menu','getmemoireBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmemoire_technique = result.data.response;
                            if (result.data.response.length>0)
                            {
                              vm.showbuttonNouvMemoire_technique = false;
                            }                            
                      }); 
                     apiFactory.getAPIgeneraliserREST("appel_offre/index",'menu','getappelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allappel_offre = result.data.response;
                            if (result.data.response.length>0)
                            {
                              vm.showbuttonNouvAppel_offre = false;
                            }
                            
                      });
                     apiFactory.getAPIgeneraliserREST("rapport_mensuel/index",'menu','getrapportBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allrapport_mensuel = result.data.response;
                            if (result.data.response.length==4)
                            {
                              vm.showbuttonNouvRapport_mensuel = false;
                            }
                            
                      });

                     apiFactory.getAPIgeneraliserREST("manuel_gestion/index",'menu','getmanuelBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                      {
                            vm.allmanuel_gestion = result.data.response;
                            if (result.data.response.length>0)
                            {
                              vm.showbuttonNouvManuel_gestion = false;
                            }
                            
                      });
                     apiFactory.getAPIgeneraliserREST("police_assurance/index",'menu','getpoliceBycontrat','id_contrat_bureau_etude',item.id,'validation',0).then(function(result)
                    {
                          vm.allpolice_assurance = result.data.response;
                          if (result.data.response.length>0)
                          {
                            vm.showbuttonNouvPolice_assurance = false;
                          }
                          
                    });
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_debut_travaux_moe_creer = true;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                      vm.showbuttonNouvDemande_batiment_moe_creer = true;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                      vm.showbuttonNouvDemande_latrine_moe_creer = true;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvDemande_fin_travaux_moe_creer = true;
                    });

                  }
                }


            vm.showbuttonValidationcontrat_moe = true;
            vm.validation_contrat_moe = item.validation;
            vm.stepprestation_moe = true;
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
                    date_signature:convertionDate(new Date(contrat_moe.date_signature)),
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
             // vm.selectedItemContrat_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /**************************************fin contrat moe***************************************************/

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
                    date_livraison: convertionDate(new Date(memoire_technique.date_livraison)),
                    date_approbation: convertionDate(new Date(memoire_technique.date_approbation)),
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
                    date_livraison: convertionDate(new Date(appel_offre.date_livraison)),
                    date_approbation: convertionDate(new Date(appel_offre.date_approbation)),
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
       vm.ajouterRapport_mensuel = function ()
        { 
          
          if (NouvelItemRapport_mensuel == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              //fichier: '',
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
            //item.fichier   = currentItemRapport_mensuel.fichier ;
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
            //item.fichier   = vm.selectedItemRapport_mensuel.fichier ;
            item.date_livraison   = new Date(vm.selectedItemRapport_mensuel.date_livraison) ;
            item.observation   = vm.selectedItemRapport_mensuel.observation ;
            item.id_contrat_bureau_etude   = vm.selectedItemRapport_mensuel.contrat_be.id ;
             vm.showbuttonValidationRapport_mensuel = false;
            //vm.showThParcourir = true;
        };

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
                    //||(mem[0].fichier   != currentItemRapport_mensuel.fichier )
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
                    //fichier: rapport_mensuel.fichier,
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
                    //fichier: rapport_mensuel.fichier,
                    date_livraison: convertionDate(new Date(rapport_mensuel.date_livraison)),
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
                    date_livraison: convertionDate(new Date(manuel_gestion.date_livraison)),
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
                    date_expiration: convertionDate(new Date(police_assurance.date_expiration)),
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

      /**********************************debut demande_debut_travaux_moe****************************************/
//col table
        vm.demande_debut_travaux_moe_column = [        
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage moe
        apiFactory.getAll("tranche_d_debut_travaux_moe/index").then(function(result)
        {
          vm.alltranche_d_debut_travaux_moe= result.data.response;
          vm.allcurenttranche_d_debut_travaux_moe = result.data.response;
          //console.log(vm.allcurenttranche_d_debut_travaux_moe);
        });

        vm.ajouterDemande_debut_travaux_moe = function ()
        { 
            var items = {
                          $edit: true,
                          $selected: true,
                          id: '0',         
                          id_contrat_bureau_etude: '',         
                          objet: '',
                          description: '',
                          ref_facture: '',
                          tranche: '',
                          montant: '',
                          cumul: '',
                          anterieur: '',
                          periode: '',
                          pourcentage:'',
                          reste:'',
                          date: ''
                        };
          if (vm.NouvelItemDemande_debut_travaux_moe == false)
          {                  
                  var last_id_demande_debut_moe = Math.max.apply(Math, vm.alldemande_debut_travaux_moe.map(function(o){return o.id;}));

                vm.dataLastedemande_debut_moe = vm.alldemande_debut_travaux_moe.filter(function(obj){return obj.id == last_id_demande_debut_moe;});

                if (vm.dataLastedemande_debut_moe.length>0)
                {   
                    var last_tranche_demande_debut_moe = Math.max.apply(Math, vm.dataLastedemande_debut_moe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_debut_moe[0].validation))
                    {
                      case 3:     //rejeter DPFI

                          vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_debut_moe);});
                          vm.alldemande_debut_travaux_moe.push(items);                          
                          vm.selectedItemDemande_debut_travaux_moe = items;
                          vm.NouvelItemDemande_debut_travaux_moe = true ;
                          vm.dataLastedemande_debut_moe = [];
                           
                          break;

                      case 4: //Valider dpfi
                          
                          vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_debut_moe)+1);});
                          vm.alldemande_debut_travaux_moe.push(items);                          
                          vm.selectedItemDemande_debut_travaux_moe = items;
                          vm.NouvelItemDemande_debut_travaux_moe = true ;
                          break;

                      default:

                          vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_debut_moe[0].validation);
                          vm.allcurenttranche_d_debut_travaux_moe = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_debut_travaux_moe.push(items);                          
                    vm.selectedItemDemande_debut_travaux_moe = items;
                    vm.NouvelItemDemande_debut_travaux_moe = true ;
                    vm.dataLastedemande_debut_moe = [];
                }
                        
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

       
        //fonction ajout dans bdd
        function ajoutDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression)
        {
            if (vm.NouvelItemDemande_debut_travaux_moe==false)
            {
                test_existanceDemande_debut_travaux_moe (demande_debut_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_debut_travaux_moe
        vm.annulerDemande_debut_travaux_moe = function(item)
        {
          if (vm.NouvelItemDemande_debut_travaux_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
           // item.id_contrat_bureau_etude   = currentItemDemande_debut_travaux_moe.id_contrat_bureau_etude ;
            item.objet   = currentItemDemande_debut_travaux_moe.objet ;
            item.description   = currentItemDemande_debut_travaux_moe.description ;
            item.ref_facture   = currentItemDemande_debut_travaux_moe.ref_facture ;
            item.id_tranche_d_debut_travaux_moe = currentItemDemande_debut_travaux_moe.id_tranche_d_debut_travaux_moe ;
            item.montant   = currentItemDemande_debut_travaux_moe.montant ;
            item.cumul = currentItemDemande_debut_travaux_moe.cumul ;
            item.anterieur = currentItemDemande_debut_travaux_moe.anterieur;
            item.periode = currentItemDemande_debut_travaux_moe.periode ;
            item.pourcentage = currentItemDemande_debut_travaux_moe.pourcentage ;
            item.reste = currentItemDemande_debut_travaux_moe.reste;
            item.date  = currentItemDemande_debut_travaux_moe.date;
          }else
          {
            vm.alldemande_debut_travaux_moe = vm.alldemande_debut_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_debut_travaux_moe.id;
            });
          }

          vm.selectedItemDemande_debut_travaux_moe = {} ;
          vm.NouvelItemDemande_debut_travaux_moe      = false;
          
        };

        //fonction selection item Demande_debut_travaux_moe
        vm.selectionDemande_debut_travaux_moe= function (item)
        {
            vm.selectedItemDemande_debut_travaux_moe = item;
            //vm.NouvelItemDemande_debut_travaux_moe   = item;
            currentItemDemande_debut_travaux_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_debut_travaux_moe));
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_debut_travaux_moe/index",'id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                {
                    vm.alljustificatif_debut_travaux_moe = result.data.response;
                    console.log(vm.alljustificatif_debut_travaux_moe);
                });
                if (vm.session=='OBCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'menu','getpaiementinvalideBydemande','id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_debut_travaux_moe = result.data.response;
                      if (vm.allpaiement_debut_travaux_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_debut_travaux_moe= false;
                      }
                      
                  });
                }
                if (vm.session=='BCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'menu','getpaiementBydemande','id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_debut_travaux_moe= false;
                  });
                  vm.showbuttonValidationDemande_debut_travaux_moe_creer = true;
                  vm.showbuttonValidationPaiement_debut_travaux_moe = true;
                }
                if (vm.session=='DAAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'menu','getpaiementvalideBydemande','id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_debut_travaux_moe= false;
                  });
                } 
                if (vm.session=='DPFI') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'menu','getpaiementvalideBydemande','id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_debut_travaux_moe= false;
                  });

                  vm.showbuttonValidationDemande_debut_travaux_moe_encourdpfi = true;
                  vm.showbuttonValidationDemande_debut_travaux_moe_rejedpfi = true;
                  vm.showbuttonValidationDemande_debut_travaux_moe_validedpfi = true;
                }
                /*if (vm.session=='OBCAF') 
                {
                  vm.alltransfert_daaf = [];
                }*/
                if (vm.session=='ADMIN') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'menu','getpaiementBydemande','id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_debut_travaux_moe = result.data.response;
                      if (vm.allpaiement_debut_travaux_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_debut_travaux_moe= false;
                      }
                      vm.showbuttonValidationDemande_debut_travaux_moe_creer = true;
                      vm.showbuttonValidationDemande_debut_travaux_moe_encourdpfi = true;
                      vm.showbuttonValidationDemande_debut_travaux_moe_rejedpfi = true;
                      vm.showbuttonValidationDemande_debut_travaux_moe_validedpfi = true;                      
                      vm.showbuttonValidationPaiement_debut_travaux_moe = true;
                  });
                } 
                if (vm.session=='UFP') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_debut_travaux_moe/index",'menu','getpaiementvalideBydemande','id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_debut_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_debut_travaux_moe= false;
                  });
                }
            
            vm.validation_demande_debut_travaux_moe = item.validation;
            vm.stepjusti_d_tra_moe = true;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_debut_travaux_moe', function()
        {
             if (!vm.alldemande_debut_travaux_moe) return;
             vm.alldemande_debut_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_debut_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_debut_travaux_moe = function(item)
        {
            vm.NouvelItemDemande_debut_travaux_moe = false ;
            vm.selectedItemDemande_debut_travaux_moe = item;
            currentItemDemande_debut_travaux_moe = angular.copy(vm.selectedItemDemande_debut_travaux_moe);
            $scope.vm.alldemande_debut_travaux_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_bureau_etude   = vm.selectedItemDemande_debut_travaux_moe.contrat_bureau_etude.id ;
            item.objet   = vm.selectedItemDemande_debut_travaux_moe.objet ;
            item.description   = vm.selectedItemDemande_debut_travaux_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_debut_travaux_moe.ref_facture ;
            item.id_tranche_d_debut_travaux_moe = vm.selectedItemDemande_debut_travaux_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_debut_travaux_moe.montant);
            item.cumul = vm.selectedItemDemande_debut_travaux_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_debut_travaux_moe.anterieur ;
            item.periode = vm.selectedItemDemande_debut_travaux_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_debut_travaux_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_debut_travaux_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_debut_travaux_moe.date) ;
            vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj)
            {
                return obj.id == vm.selectedItemDemande_debut_travaux_moe.tranche.id;
            });

                vm.showbuttonValidationDemande_debut_travaux_moe_creer = false;
        };

        //fonction bouton suppression item Demande_debut_travaux_moe
        vm.supprimerDemande_debut_travaux_moe = function()
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
                vm.ajoutDemande_debut_travaux_moe(vm.selectedItemDemande_debut_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_debut_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_debut_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_debut_travaux_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_debut_travaux_moe.objet )
                    || (pass[0].description   != currentItemDemande_debut_travaux_moe.description )
                    || (pass[0].id_tranche_d_debut_travaux_moe != currentItemDemande_debut_travaux_moe.id_tranche_d_debut_travaux_moe )
                    || (pass[0].montant   != currentItemDemande_debut_travaux_moe.montant )
                    || (pass[0].cumul != currentItemDemande_debut_travaux_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_debut_travaux_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_debut_travaux_moe.reste )
                    || (pass[0].date   != currentItemDemande_debut_travaux_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_debut_travaux_moe.ref_facture ))                   
                      { 
                         insert_in_baseDemande_debut_travaux_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_debut_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_debut_travaux_moe
        function insert_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_debut_travaux_moe==false)
            {
                getId = vm.selectedItemDemande_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_debut_travaux_moe.objet,
                    description:demande_debut_travaux_moe.description,
                    ref_facture:demande_debut_travaux_moe.ref_facture,
                    id_tranche_d_debut_travaux_moe: demande_debut_travaux_moe.id_tranche_d_debut_travaux_moe ,
                    montant: demande_debut_travaux_moe.montant,
                    cumul: demande_debut_travaux_moe.cumul ,
                    anterieur: demande_debut_travaux_moe.anterieur ,
                    reste: demande_debut_travaux_moe.reste ,
                    date: convertionDate(new Date(demande_debut_travaux_moe.date)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_debut_travaux_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_d_debut_travaux_moe.filter(function(obj)
                {
                    return obj.id == demande_debut_travaux_moe.id_tranche_d_debut_travaux_moe;
                });

                if (vm.NouvelItemDemande_debut_travaux_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_debut_travaux_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                        vm.selectedItemDemande_debut_travaux_moe.tranche = tran[0] ;

                        vm.selectedItemDemande_debut_travaux_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_debut_travaux_moe.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_debut_travaux_moe.$selected  = false;
                        vm.selectedItemDemande_debut_travaux_moe.$edit      = false;
                        vm.selectedItemDemande_debut_travaux_moe ={};
                        
                    }
                    else 
                    {    
                      vm.alldemande_debut_travaux_moe = vm.alldemande_debut_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_debut_travaux_moe.id;
                      });
                    }
                    
                }
                else
                {                  
                  demande_debut_travaux_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                  demande_debut_travaux_moe.tranche = tran[0] ;
                  demande_debut_travaux_moe.periode = tran[0].periode ;
                  demande_debut_travaux_moe.pourcentage = tran[0].pourcentage ;
                  demande_debut_travaux_moe.id  =   String(data.response);              
                  vm.NouvelItemDemande_debut_travaux_moe=false;
                  demande_debut_travaux_moe.validation = 0;
                vm.validation_demande_debut_travaux_moe = 0;
            }
              demande_debut_travaux_moe.$selected = false;
              demande_debut_travaux_moe.$edit = false;
              vm.selectedItemDemande_debut_travaux_moe = {};
              vm.showbuttonNouvDemande_debut_travaux_moe_creer = false;
            vm.showbuttonValidationDemande_debut_travaux_moe_creer = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_debut_moe = function(item)
        { 
          var nbr_t = [];
          var reste = 0;
          var anterieur = 0;
          console.log(vm.selectedItemContrat_moe);
            var montant = (parseInt(vm.selectedItemContrat_moe.montant_contrat) * (vm.allcurenttranche_d_debut_travaux_moe[0].pourcentage))/100;
            var cumul = montant;
          var demande_ancien = vm.alldemande_debut_travaux_moe.filter(function(obj)
              {
                          return obj.id != 0;
              });

          console.log(demande_ancien);

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_debut_moe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_debut_moe[0].cumul);
          }
          

          reste= (parseInt(vm.selectedItemContrat_moe.montant_contrat)) - cumul;

          item.periode = vm.allcurenttranche_d_debut_travaux_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_d_debut_travaux_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          console.log(item);
          console.log(vm.selectedItemContrat_moe);
         
          //var nbr_debut_travaux_total = vm.alldemande_debut_travaux_moe.length;
          
        }

        vm.validerDemande_debut_travaux_moe_creer = function()
        {
          maj_in_baseDemande_debut_travaux_moe(vm.selectedItemDemande_debut_travaux_moe,0,1);
        }
        vm.validerDemande_debut_travaux_moe_encourdpfi = function()
        {
          maj_in_baseDemande_debut_travaux_moe(vm.selectedItemDemande_debut_travaux_moe,0,2);
        }
        vm.validerDemande_debut_travaux_moe_rejedpfi = function()
        {
          maj_in_baseDemande_debut_travaux_moe(vm.selectedItemDemande_debut_travaux_moe,0,3);
        }
        vm.validerDemande_debut_travaux_moe_validedpfi = function()
        {
          maj_in_baseDemande_debut_travaux_moe(vm.selectedItemDemande_debut_travaux_moe,0,4);
        }

        function maj_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_debut_travaux_moe.id,
                    objet: demande_debut_travaux_moe.objet,
                    description:demande_debut_travaux_moe.description,
                    ref_facture:demande_debut_travaux_moe.ref_facture,
                    id_tranche_d_debut_travaux_moe: demande_debut_travaux_moe.tranche.id ,
                    montant: demande_debut_travaux_moe.montant,
                    cumul: demande_debut_travaux_moe.cumul ,
                    anterieur: demande_debut_travaux_moe.anterieur ,
                    reste: demande_debut_travaux_moe.reste ,
                    date: convertionDate(new Date(demande_debut_travaux_moe.date)),
                    id_contrat_bureau_etude: demande_debut_travaux_moe.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_debut_travaux_moe/index",datas, config).success(function (data)
            { 
              demande_debut_travaux_moe.validation = validation; 
              vm.validation_demande_debut_travaux_moe = validation;
              demande_debut_travaux_moe.$selected = false;
              demande_debut_travaux_moe.$edit = false;
              vm.selectedItemDemande_debut_travaux_moe = {};
              vm.showbuttonValidationDemande_debut_travaux_moe_creer = false;
              vm.showbuttonValidationDemande_debut_travaux_moe_encourdpfi = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/******************************************fin demande_debut_travaux_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_debut_travaux_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_debut_travaux_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_debut_travaux_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_debut_travaux_moe = function ()
        { 
          if (NouvelItemJustificatif_debut_travaux_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_debut_travaux_moe.push(items);
            vm.alljustificatif_debut_travaux_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_debut_travaux_moe = mem;
              }
            });

            NouvelItemJustificatif_debut_travaux_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_debut_travaux_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_debut_travaux_moe(justificatif_debut_travaux_moe,suppression)
        {
            if (NouvelItemJustificatif_debut_travaux_moe==false)
            {
                test_existanceJustificatif_debut_travaux_moe (justificatif_debut_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_debut_travaux_moe(justificatif_debut_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_debut_travaux_moe
        vm.annulerJustificatif_debut_travaux_moe = function(item)
        {
          if (NouvelItemJustificatif_debut_travaux_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_debut_travaux_moe.description ;
            item.fichier   = currentItemJustificatif_debut_travaux_moe.fichier ;
          }else
          {
            vm.alljustificatif_debut_travaux_moe = vm.alljustificatif_debut_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_debut_travaux_moe.id;
            });
          }

          vm.selectedItemJustificatif_debut_travaux_moe = {} ;
          NouvelItemJustificatif_debut_travaux_moe      = false;
          
        };

        //fonction selection item justificatif debut_travaux
        vm.selectionJustificatif_debut_travaux_moe= function (item)
        {
            vm.selectedItemJustificatif_debut_travaux_moe = item;
            vm.nouvelItemJustificatif_debut_travaux_moe   = item;
            currentItemJustificatif_debut_travaux_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_debut_travaux_moe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_debut_travaux_moe', function()
        {
             if (!vm.alljustificatif_debut_travaux_moe) return;
             vm.alljustificatif_debut_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_debut_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_debut_travaux_moe = function(item)
        {
            NouvelItemJustificatif_debut_travaux_moe = false ;
            vm.selectedItemJustificatif_debut_travaux_moe = item;
            currentItemJustificatif_debut_travaux_moe = angular.copy(vm.selectedItemJustificatif_debut_travaux_moe);
            $scope.vm.alljustificatif_debut_travaux_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_debut_travaux_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_debut_travaux_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_debut_travaux_moe
        vm.supprimerJustificatif_debut_travaux_moe = function()
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
                vm.ajoutJustificatif_debut_travaux_moe(vm.selectedItemJustificatif_debut_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_debut_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_debut_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_debut_travaux_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_debut_travaux_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_debut_travaux_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_debut_travaux_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_debut_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_debut_travaux_moe
        function insert_in_baseJustificatif_debut_travaux_moe(justificatif_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_debut_travaux_moe==false)
            {
                getId = vm.selectedItemJustificatif_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_debut_travaux_moe.description,
                    fichier: justificatif_debut_travaux_moe.fichier,
                    id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_debut_travaux_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_debut_travaux_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_debut_travaux_moe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_debut_travaux_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_debut_travaux_moe.description,
                                                      fichier: justificatif_debut_travaux_moe.fichier,
                                                      id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_debut_travaux_moe.$selected = false;
                                          justificatif_debut_travaux_moe.$edit = false;
                                          vm.selectedItemJustificatif_debut_travaux_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_debut_travaux_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_debut_travaux_moe.description,
                                        fichier: justificatif_debut_travaux_moe.fichier,
                                        id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_debut_travaux_moe.$selected = false;
                                      justificatif_debut_travaux_moe.$edit = false;
                                      vm.selectedItemJustificatif_debut_travaux_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_debut_travaux_moe.$selected  = false;
                        vm.selectedItemJustificatif_debut_travaux_moe.$edit      = false;
                        vm.selectedItemJustificatif_debut_travaux_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_debut_travaux_moe = vm.alljustificatif_debut_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_debut_travaux_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_debut_travaux_moe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_debut_travaux_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_debut_travaux_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_debut_travaux_moe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_debut_travaux_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_debut_travaux_moe.description,
                                                fichier: justificatif_debut_travaux_moe.fichier,
                                                id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                                                
                                  });
                                apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                                { 
                                    justificatif_debut_travaux_moe.$selected = false;
                                    justificatif_debut_travaux_moe.$edit = false;
                                    vm.selectedItemJustificatif_debut_travaux_moe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_debut_travaux_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_debut_travaux_moe.description,
                                  fichier: justificatif_debut_travaux_moe.fichier,
                                  id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                                               
                              });
                            apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_debut_travaux_moe.$selected = false;
                                justificatif_debut_travaux_moe.$edit = false;
                                vm.selectedItemJustificatif_debut_travaux_moe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_debut_travaux_moe.$selected = false;
              justificatif_debut_travaux_moe.$edit = false;
              vm.selectedItemJustificatif_debut_travaux_moe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif debut_travaux**********************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_debut_travaux_moe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_debut_travaux_moe = function ()
        { 
          if (NouvelItemPaiement_debut_travaux_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_debut_travaux_moe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_debut_travaux_moe.push(items);
            vm.allpaiement_debut_travaux_moe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_debut_travaux_moe = conv;
              }
            });

            NouvelItemPaiement_debut_travaux_moe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression)
        {
            if (NouvelItemPaiement_debut_travaux_moe==false)
            {
                test_existancePaiement_debut_travaux_moe (paiement_debut_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_debut_travaux_moe
        vm.annulerPaiement_debut_travaux_moe = function(item)
        {
          if (NouvelItemPaiement_debut_travaux_moe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_debut_travaux_moe.montant_paiement;
              item.observation    = currentItemPaiement_debut_travaux_moe.observation;
              item.date_paiement = currentItemPaiement_debut_travaux_moe.date_paiement; 
          }else
          {
            vm.allpaiement_debut_travaux_moe = vm.allpaiement_debut_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_debut_travaux_moe.id;
            });
          }

          vm.selectedItemPaiement_debut_travaux_moe = {} ;
          NouvelItemPaiement_debut_travaux_moe      = false;
          
        };

        //fonction selection item paiement_debut_travaux_moe convention cisco/feffi
        vm.selectionPaiement_debut_travaux_moe = function (item)
        {
            vm.selectedItemPaiement_debut_travaux_moe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_debut_travaux_moe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_debut_travaux_moe));
              vm.showbuttonValidationPaiement_debut_travaux_moe = true;
            }
            vm.validation_paiement_debut_travaux_moe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_debut_travaux_moe', function()
        {
             if (!vm.allpaiement_debut_travaux_moe) return;
             vm.allpaiement_debut_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_debut_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_debut_travaux_moe = function(item)
        {
            NouvelItemPaiement_debut_travaux_moe = false ;
            vm.selectedItemPaiement_debut_travaux_moe = item;
            currentItemPaiement_debut_travaux_moe = angular.copy(vm.selectedItemPaiement_debut_travaux_moe);
            $scope.vm.allpaiement_debut_travaux_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_debut_travaux_moe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_debut_travaux_moe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_debut_travaux_moe.date_paiement);
        };

        //fonction bouton suppression item paiement_debut_travaux_moe convention cisco feffi
        vm.supprimerPaiement_debut_travaux_moe = function()
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
                vm.ajoutPaiement_debut_travaux_moe(vm.selectedItemPaiement_debut_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_debut_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_debut_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_debut_travaux_moe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_debut_travaux_moe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_debut_travaux_moe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_debut_travaux_moe.montant_paiement))                    
                      {
                          insert_in_basePaiement_debut_travaux_moe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_debut_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_debut_travaux_moe ==false)
            {
                getId = vm.selectedItemPaiement_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_debut_travaux_moe.montant_paiement,
                    observation: paiement_debut_travaux_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_debut_travaux_moe.date_paiement)), 
                    id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_debut_travaux_moe/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_debut_travaux_moe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_debut_travaux_moe.$selected  = false;
                        vm.selectedItemPaiement_debut_travaux_moe.$edit      = false;
                        vm.selectedItemPaiement_debut_travaux_moe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_debut_travaux_moe = vm.allpaiement_debut_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_debut_travaux_moe.id;
                      });
                      vm.showbuttonNouvPaiement_debut_travaux_moe = true;
                    }
                }
                else
                { 
                  paiement_debut_travaux_moe.validation = 0;
                  paiement_debut_travaux_moe.id  =   String(data.response);              
                  NouvelItemPaiement_debut_travaux_moe = false;

                  vm.showbuttonNouvPaiement_debut_travaux_moe = false;
            }
              paiement_debut_travaux_moe.$selected = false;
              paiement_debut_travaux_moe.$edit = false;
              vm.selectedItemPaiement_debut_travaux_moe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_debut_travaux_moe= function()
        {
              validation_in_basepaiement_debut_travaux_moe(vm.selectedItemPaiement_debut_travaux_moe,0);
        }
        function validation_in_basepaiement_debut_travaux_moe(paiement_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_debut_travaux_moe ==false)
            {
                getId = vm.selectedItemPaiement_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_debut_travaux_moe.montant_paiement,
                    observation: paiement_debut_travaux_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_debut_travaux_moe.date_paiement)), 
                    id_demande_debut_travaux: vm.selectedItemDemande_debut_travaux_moe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_debut_travaux_moe/index",datas, config).success(function (data)
            { 
              paiement_debut_travaux_moe.validation = 1;
              vm.validation_paiement_debut_travaux_moe = 1;
              paiement_debut_travaux_moe.$selected = false;
              paiement_debut_travaux_moe.$edit = false;
              vm.selectedItemPaiement_debut_travaux_moe = {};

              vm.showbuttonValidationPaiement_debut_travaux_moe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/

/**********************************debut demande_debut_travaux_moe****************************************/
//col table
        vm.demande_batiment_moe_column = [        
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];


        vm.ajouterDemande_batiment_moe = function ()
        { 
            var items = {
                          $edit: true,
                          $selected: true,
                          id: '0',         
                          id_contrat_bureau_etude: '',         
                          objet: '',
                          description: '',
                          ref_facture: '',
                          tranche: '',
                          montant: '',
                          cumul: '',
                          anterieur: '',
                          periode: '',
                          pourcentage:'',
                          reste:'',
                          date: ''
                        };
          if (vm.NouvelItemDemande_batiment_moe == false)
          {   

              if (vm.alldemande_debut_travaux_moe.length==vm.alltranche_d_debut_travaux_moe.length)
              {               
                  var last_id_demande_batiment_moe = Math.max.apply(Math, vm.alldemande_batiment_moe.map(function(o){return o.id;}));

                vm.dataLastedemande_batiment_moe = vm.alldemande_batiment_moe.filter(function(obj){return obj.id == last_id_demande_batiment_moe;});

                if (vm.dataLastedemande_batiment_moe.length>0)
                {   
                    var last_tranche_demande_batiment_moe = Math.max.apply(Math, vm.dataLastedemande_batiment_moe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_batiment_moe[0].validation))
                    {
                      case 3:     //rejeter DPFI

                          vm.allcurenttranche_demande_batiment_moe = vm.alltranche_demande_batiment_moe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_batiment_moe);});
                          vm.alldemande_batiment_moe.push(items);                          
                          vm.selectedItemDemande_batiment_moe = items;
                          vm.NouvelItemDemande_batiment_moe = true ;
                          vm.dataLastedemande_batiment_moe = [];
                           
                          break;

                      case 4: //Valider dpfi
                          
                          vm.allcurenttranche_demande_batiment_moe = vm.alltranche_demande_batiment_moe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_batiment_moe)+1);});
                          vm.alldemande_batiment_moe.push(items);                          
                          vm.selectedItemDemande_batiment_moe = items;
                          vm.NouvelItemDemande_batiment_moe = true ;
                          break;

                      default:

                          vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_batiment_moe[0].validation);
                          vm.allcurenttranche_demande_batiment_moe = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_demande_batiment_moe = vm.alltranche_demande_batiment_moe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_batiment_moe.push(items);                          
                    vm.selectedItemDemande_batiment_moe = items;
                    vm.NouvelItemDemande_batiment_moe = true ;
                    vm.dataLastedemande_batiment_moe = [];
                }
           }
           else
              {
                vm.showAlert('Ajout demande batiment','La demande avant travaux incomplète ou en-cours de validation');
                vm.allcurenttranche_demande_batiment_moe = [];
              }             
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

       
        //fonction ajout dans bdd
        function ajoutDemande_batiment_moe(demande_batiment_moe,suppression)
        {
            if (vm.NouvelItemDemande_batiment_moe==false)
            {
                test_existanceDemande_batiment_moe (demande_batiment_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_batiment_moe(demande_batiment_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_moe
        vm.annulerDemande_batiment_moe = function(item)
        {
          if (vm.NouvelItemDemande_batiment_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
           // item.id_contrat_bureau_etude   = currentItemDemande_batiment_moe.id_contrat_bureau_etude ;
            item.objet   = currentItemDemande_batiment_moe.objet ;
            item.description   = currentItemDemande_batiment_moe.description ;
            item.ref_facture   = currentItemDemande_batiment_moe.ref_facture ;
            item.id_tranche_demande_batiment_moe = currentItemDemande_batiment_moe.id_tranche_demande_batiment_moe ;
            item.montant   = currentItemDemande_batiment_moe.montant ;
            item.cumul = currentItemDemande_batiment_moe.cumul ;
            item.anterieur = currentItemDemande_batiment_moe.anterieur;
            item.periode = currentItemDemande_batiment_moe.periode ;
            item.pourcentage = currentItemDemande_batiment_moe.pourcentage ;
            item.reste = currentItemDemande_batiment_moe.reste;
            item.date  = currentItemDemande_batiment_moe.date;
          }else
          {
            vm.alldemande_batiment_moe = vm.alldemande_batiment_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_moe.id;
            });
          }

          vm.selectedItemDemande_batiment_moe = {} ;
          vm.NouvelItemDemande_batiment_moe      = false;
          
        };

        //fonction selection item Demande_batiment_moe
        vm.selectionDemande_batiment_moe= function (item)
        {
            vm.selectedItemDemande_batiment_moe = item;
            //vm.NouvelItemDemande_batiment_moe   = item;
            currentItemDemande_batiment_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_moe));
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_batiment_moe/index",'id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                {
                    vm.alljustificatif_batiment_moe = result.data.response;
                    console.log(vm.alljustificatif_batiment_moe);
                });
                if (vm.session=='OBCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'menu','getpaiementinvalideBydemande','id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                  {
                      vm.allpaiement_batiment_moe = result.data.response;
                      if (vm.allpaiement_batiment_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_batiment_moe= false;
                      }
                      
                  });
                }
                if (vm.session=='BCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'menu','getpaiementBydemande','id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                  {
                      vm.allpaiement_batiment_moe = result.data.response;
                      vm.showbuttonNouvPaiement_batiment_moe= false;
                  });
                  vm.showbuttonValidationDemande_batiment_moe_creer = true;
                  vm.showbuttonValidationPaiement_batiment_moe = true;
                }
                if (vm.session=='DAAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'menu','getpaiementvalideBydemande','id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                  {
                      vm.allpaiement_batiment_moe = result.data.response;
                      vm.showbuttonNouvPaiement_batiment_moe= false;
                  });
                } 
                if (vm.session=='DPFI') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'menu','getpaiementvalideBydemande','id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                  {
                      vm.allpaiement_batiment_moe = result.data.response;
                      vm.showbuttonNouvPaiement_batiment_moe= false;
                  });

                  vm.showbuttonValidationDemande_batiment_moe_encourdpfi = true;
                  vm.showbuttonValidationDemande_batiment_moe_rejedpfi = true;
                  vm.showbuttonValidationDemande_batiment_moe_validedpfi = true;
                }
                /*if (vm.session=='OBCAF') 
                {
                  vm.alltransfert_daaf = [];
                }*/
                if (vm.session=='ADMIN') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'menu','getpaiementBydemande','id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                  {
                      vm.allpaiement_batiment_moe = result.data.response;
                      if (vm.allpaiement_batiment_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_batiment_moe= false;
                      }
                      vm.showbuttonValidationDemande_batiment_moe_creer = true;
                      vm.showbuttonValidationDemande_batiment_moe_encourdpfi = true;
                      vm.showbuttonValidationDemande_batiment_moe_rejedpfi = true;
                      vm.showbuttonValidationDemande_batiment_moe_validedpfi = true;                      
                      vm.showbuttonValidationPaiement_batiment_moe = true;
                  });
                } 
                if (vm.session=='UFP') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_batiment_moe/index",'menu','getpaiementvalideBydemande','id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                  {
                      vm.allpaiement_batiment_moe = result.data.response;
                      vm.showbuttonNouvPaiement_batiment_moe= false;
                  });
                }
            
            vm.validation_demande_batiment_moe = item.validation;
            vm.stepjusti_d_tra_moe = true;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_moe', function()
        {
             if (!vm.alldemande_batiment_moe) return;
             vm.alldemande_batiment_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_batiment_moe = function(item)
        {
            vm.NouvelItemDemande_batiment_moe = false ;
            vm.selectedItemDemande_batiment_moe = item;
            currentItemDemande_batiment_moe = angular.copy(vm.selectedItemDemande_batiment_moe);
            $scope.vm.alldemande_batiment_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_bureau_etude   = vm.selectedItemDemande_batiment_moe.contrat_bureau_etude.id ;
            item.objet   = vm.selectedItemDemande_batiment_moe.objet ;
            item.description   = vm.selectedItemDemande_batiment_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_batiment_moe.ref_facture ;
            item.id_tranche_demande_batiment_moe = vm.selectedItemDemande_batiment_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_batiment_moe.montant);
            item.cumul = vm.selectedItemDemande_batiment_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_batiment_moe.anterieur ;
            item.periode = vm.selectedItemDemande_batiment_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_batiment_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_batiment_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_batiment_moe.date) ;
            vm.allcurenttranche_demande_batiment_moe = vm.alltranche_demande_batiment_moe.filter(function(obj)
            {
                return obj.id == vm.selectedItemDemande_batiment_moe.tranche.id;
            });

                vm.showbuttonValidationDemande_batiment_moe_creer = false;
        };

        //fonction bouton suppression item Demande_batiment_moe
        vm.supprimerDemande_batiment_moe = function()
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
                vm.ajoutDemande_batiment_moe(vm.selectedItemDemande_batiment_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_batiment_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_batiment_moe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_batiment_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_batiment_moe.objet )
                    || (pass[0].description   != currentItemDemande_batiment_moe.description )
                    || (pass[0].id_tranche_demande_batiment_moe != currentItemDemande_batiment_moe.id_tranche_demande_batiment_moe )
                    || (pass[0].montant   != currentItemDemande_batiment_moe.montant )
                    || (pass[0].cumul != currentItemDemande_batiment_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_batiment_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_batiment_moe.reste )
                    || (pass[0].date   != currentItemDemande_batiment_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_batiment_moe.ref_facture ))                   
                      { 
                         insert_in_baseDemande_batiment_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_batiment_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_moe
        function insert_in_baseDemande_batiment_moe(demande_batiment_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_batiment_moe==false)
            {
                getId = vm.selectedItemDemande_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_batiment_moe.objet,
                    description:demande_batiment_moe.description,
                    ref_facture:demande_batiment_moe.ref_facture,
                    id_tranche_demande_batiment_moe: demande_batiment_moe.id_tranche_demande_batiment_moe ,
                    montant: demande_batiment_moe.montant,
                    cumul: demande_batiment_moe.cumul ,
                    anterieur: demande_batiment_moe.anterieur ,
                    reste: demande_batiment_moe.reste ,
                    date: convertionDate(new Date(demande_batiment_moe.date)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_batiment_moe.filter(function(obj)
                {
                    return obj.id == demande_batiment_moe.id_tranche_demande_batiment_moe;
                });

                if (vm.NouvelItemDemande_batiment_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_batiment_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                        vm.selectedItemDemande_batiment_moe.tranche = tran[0] ;

                        vm.selectedItemDemande_batiment_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_batiment_moe.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_batiment_moe.$selected  = false;
                        vm.selectedItemDemande_batiment_moe.$edit      = false;
                        vm.selectedItemDemande_batiment_moe ={};
                        
                    }
                    else 
                    {    
                      vm.alldemande_batiment_moe = vm.alldemande_batiment_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_moe.id;
                      });
                    }
                    
                }
                else
                {                  
                  demande_batiment_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                  demande_batiment_moe.tranche = tran[0] ;
                  demande_batiment_moe.periode = tran[0].periode ;
                  demande_batiment_moe.pourcentage = tran[0].pourcentage ;
                  demande_batiment_moe.id  =   String(data.response);              
                  vm.NouvelItemDemande_batiment_moe=false;
                  demande_batiment_moe.validation = 0;
                vm.validation_demande_batiment_moe = 0;
            }
              demande_batiment_moe.$selected = false;
              demande_batiment_moe.$edit = false;
              vm.selectedItemDemande_batiment_moe = {};
              vm.showbuttonNouvDemande_batiment_moe_creer = false;
            vm.showbuttonValidationDemande_batiment_moe_creer = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_batiment_moe = function(item)
        { 
          var nbr_t = [];
          var reste = 0;
          var anterieur = 0;
          console.log(vm.selectedItemContrat_moe);
            var montant = (parseInt(vm.selectedItemContrat_moe.montant_contrat) * (vm.allcurenttranche_demande_batiment_moe[0].pourcentage))/100;
            var cumul = montant;
          var demande_ancien = vm.alldemande_batiment_moe.filter(function(obj)
              {
                return obj.id != 0;
              });

          console.log(demande_ancien);

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_batiment_moe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_batiment_moe[0].cumul);
          }
          

          reste= (parseInt(vm.selectedItemContrat_moe.montant_contrat)) - cumul;

          item.periode = vm.allcurenttranche_demande_batiment_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_batiment_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          console.log(item);
          console.log(vm.selectedItemContrat_moe);
         
          //var nbr_batiment_moe_total = vm.alldemande_batiment_moe.length;
          
        }

        vm.validerDemande_batiment_moe_creer = function()
        {
          maj_in_baseDemande_batiment_moe(vm.selectedItemDemande_batiment_moe,0,1);
        }
        vm.validerDemande_batiment_moe_encourdpfi = function()
        {
          maj_in_baseDemande_batiment_moe(vm.selectedItemDemande_batiment_moe,0,2);
        }
        vm.validerDemande_batiment_moe_rejedpfi = function()
        {
          maj_in_baseDemande_batiment_moe(vm.selectedItemDemande_batiment_moe,0,3);
        }
        vm.validerDemande_batiment_moe_validedpfi = function()
        {
          maj_in_baseDemande_batiment_moe(vm.selectedItemDemande_batiment_moe,0,4);
        }

        function maj_in_baseDemande_batiment_moe(demande_batiment_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_moe.id,
                    objet: demande_batiment_moe.objet,
                    description:demande_batiment_moe.description,
                    ref_facture:demande_batiment_moe.ref_facture,
                    id_tranche_demande_batiment_moe: demande_batiment_moe.tranche.id ,
                    montant: demande_batiment_moe.montant,
                    cumul: demande_batiment_moe.cumul ,
                    anterieur: demande_batiment_moe.anterieur ,
                    reste: demande_batiment_moe.reste ,
                    date: convertionDate(new Date(demande_batiment_moe.date)),
                    id_contrat_bureau_etude: demande_batiment_moe.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_moe/index",datas, config).success(function (data)
            { 
              demande_batiment_moe.validation = validation; 
              vm.validation_demande_batiment_moe = validation;
              demande_batiment_moe.$selected = false;
              demande_batiment_moe.$edit = false;
              vm.selectedItemDemande_batiment_moe = {};
              vm.showbuttonValidationDemande_batiment_moe_creer = false;
              vm.showbuttonValidationDemande_batiment_moe_encourdpfi = false;
              vm.showbuttonValidationDemande_batiment_moe_rejedpfi = false;
              vm.showbuttonValidationDemande_batiment_moe_validedpfi = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/******************************************fin demande_batiment_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_batiment_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_batiment_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_batiment_moe = function ()
        { 
          if (NouvelItemJustificatif_batiment_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_batiment_moe.push(items);
            vm.alljustificatif_batiment_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_batiment_moe = mem;
              }
            });

            NouvelItemJustificatif_batiment_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_batiment_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_batiment_moe(justificatif_batiment_moe,suppression)
        {
            if (NouvelItemJustificatif_batiment_moe==false)
            {
                test_existanceJustificatif_batiment_moe (justificatif_batiment_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_batiment_moe(justificatif_batiment_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_batiment_moe
        vm.annulerJustificatif_batiment_moe = function(item)
        {
          if (NouvelItemJustificatif_batiment_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_batiment_moe.description ;
            item.fichier   = currentItemJustificatif_batiment_moe.fichier ;
          }else
          {
            vm.alljustificatif_batiment_moe = vm.alljustificatif_batiment_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_batiment_moe.id;
            });
          }

          vm.selectedItemJustificatif_batiment_moe = {} ;
          NouvelItemJustificatif_batiment_moe      = false;
          
        };

        //fonction selection item justificatif batiment_moe
        vm.selectionJustificatif_batiment_moe= function (item)
        {
            vm.selectedItemJustificatif_batiment_moe = item;
            vm.nouvelItemJustificatif_batiment_moe   = item;
            currentItemJustificatif_batiment_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_batiment_moe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_batiment_moe', function()
        {
             if (!vm.alljustificatif_batiment_moe) return;
             vm.alljustificatif_batiment_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_batiment_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_batiment_moe = function(item)
        {
            NouvelItemJustificatif_batiment_moe = false ;
            vm.selectedItemJustificatif_batiment_moe = item;
            currentItemJustificatif_batiment_moe = angular.copy(vm.selectedItemJustificatif_batiment_moe);
            $scope.vm.alljustificatif_batiment_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_batiment_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_batiment_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_batiment_moe
        vm.supprimerJustificatif_batiment_moe = function()
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
                vm.ajoutJustificatif_batiment_moe(vm.selectedItemJustificatif_batiment_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_batiment_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_batiment_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_batiment_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_batiment_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_batiment_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_batiment_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_batiment_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_batiment_moe
        function insert_in_baseJustificatif_batiment_moe(justificatif_batiment_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_batiment_moe==false)
            {
                getId = vm.selectedItemJustificatif_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_batiment_moe.description,
                    fichier: justificatif_batiment_moe.fichier,
                    id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_batiment_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_batiment_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_batiment_moe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_batiment_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_batiment_moe.description,
                                                      fichier: justificatif_batiment_moe.fichier,
                                                      id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_batiment_moe.$selected = false;
                                          justificatif_batiment_moe.$edit = false;
                                          vm.selectedItemJustificatif_batiment_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_batiment_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_batiment_moe.description,
                                        fichier: justificatif_batiment_moe.fichier,
                                        id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_batiment_moe.$selected = false;
                                      justificatif_batiment_moe.$edit = false;
                                      vm.selectedItemJustificatif_batiment_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_batiment_moe.$selected  = false;
                        vm.selectedItemJustificatif_batiment_moe.$edit      = false;
                        vm.selectedItemJustificatif_batiment_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_batiment_moe = vm.alljustificatif_batiment_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_batiment_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_batiment_moe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_batiment_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_batiment_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_batiment_moe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_batiment_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_batiment_moe.description,
                                                fichier: justificatif_batiment_moe.fichier,
                                                id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                                
                                  });
                                apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                                { 
                                    justificatif_batiment_moe.$selected = false;
                                    justificatif_batiment_moe.$edit = false;
                                    vm.selectedItemJustificatif_batiment_moe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_batiment_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_batiment_moe.description,
                                  fichier: justificatif_batiment_moe.fichier,
                                  id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                               
                              });
                            apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_batiment_moe.$selected = false;
                                justificatif_batiment_moe.$edit = false;
                                vm.selectedItemJustificatif_batiment_moe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_batiment_moe.$selected = false;
              justificatif_batiment_moe.$edit = false;
              vm.selectedItemJustificatif_batiment_moe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif batiment_moe**********************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_batiment_moe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_batiment_moe = function ()
        { 
          if (NouvelItemPaiement_batiment_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_batiment_moe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_batiment_moe.push(items);
            vm.allpaiement_batiment_moe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_batiment_moe = conv;
              }
            });

            NouvelItemPaiement_batiment_moe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_batiment_moe(paiement_batiment_moe,suppression)
        {
            if (NouvelItemPaiement_batiment_moe==false)
            {
                test_existancePaiement_batiment_moe (paiement_batiment_moe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_batiment_moe(paiement_batiment_moe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_batiment_moe
        vm.annulerPaiement_batiment_moe = function(item)
        {
          if (NouvelItemPaiement_batiment_moe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_batiment_moe.montant_paiement;
              item.observation    = currentItemPaiement_batiment_moe.observation;
              item.date_paiement = currentItemPaiement_batiment_moe.date_paiement; 
          }else
          {
            vm.allpaiement_batiment_moe = vm.allpaiement_batiment_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_batiment_moe.id;
            });
          }

          vm.selectedItemPaiement_batiment_moe = {} ;
          NouvelItemPaiement_batiment_moe      = false;
          
        };

        //fonction selection item paiement_batiment_moe convention cisco/feffi
        vm.selectionPaiement_batiment_moe = function (item)
        {
            vm.selectedItemPaiement_batiment_moe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_batiment_moe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_batiment_moe));
              vm.showbuttonValidationPaiement_batiment_moe = true;
            }
            vm.validation_paiement_batiment_moe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_batiment_moe', function()
        {
             if (!vm.allpaiement_batiment_moe) return;
             vm.allpaiement_batiment_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_batiment_moe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_batiment_moe = function(item)
        {
            NouvelItemPaiement_batiment_moe = false ;
            vm.selectedItemPaiement_batiment_moe = item;
            currentItemPaiement_batiment_moe = angular.copy(vm.selectedItemPaiement_batiment_moe);
            $scope.vm.allpaiement_batiment_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_batiment_moe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_batiment_moe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_batiment_moe.date_paiement);
        };

        //fonction bouton suppression item paiement_batiment_moe convention cisco feffi
        vm.supprimerPaiement_batiment_moe = function()
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
                vm.ajoutPaiement_batiment_moe(vm.selectedItemPaiement_batiment_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_batiment_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_batiment_moe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_batiment_moe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_batiment_moe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_batiment_moe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_batiment_moe.montant_paiement))                    
                      {
                          insert_in_basePaiement_batiment_moe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_batiment_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_batiment_moe(paiement_batiment_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_moe ==false)
            {
                getId = vm.selectedItemPaiement_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_batiment_moe.montant_paiement,
                    observation: paiement_batiment_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_moe.date_paiement)), 
                    id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_moe/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_batiment_moe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_batiment_moe.$selected  = false;
                        vm.selectedItemPaiement_batiment_moe.$edit      = false;
                        vm.selectedItemPaiement_batiment_moe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_batiment_moe = vm.allpaiement_batiment_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_batiment_moe.id;
                      });
                      vm.showbuttonNouvPaiement_batiment_moe = true;
                    }
                }
                else
                { 
                  paiement_batiment_moe.validation = 0;
                  paiement_batiment_moe.id  =   String(data.response);              
                  NouvelItemPaiement_batiment_moe = false;

                  vm.showbuttonNouvPaiement_batiment_moe = false;
            }
              paiement_batiment_moe.$selected = false;
              paiement_batiment_moe.$edit = false;
              vm.selectedItemPaiement_batiment_moe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_batiment_moe= function()
        {
              validation_in_basepaiement_batiment_moe(vm.selectedItemPaiement_batiment_moe,0);
        }
        function validation_in_basepaiement_batiment_moe(paiement_batiment_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_moe ==false)
            {
                getId = vm.selectedItemPaiement_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_batiment_moe.montant_paiement,
                    observation: paiement_batiment_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_moe.date_paiement)), 
                    id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_moe/index",datas, config).success(function (data)
            { 
              paiement_batiment_moe.validation = 1;
              vm.validation_paiement_batiment_moe = 1;
              paiement_batiment_moe.$selected = false;
              paiement_batiment_moe.$edit = false;
              vm.selectedItemPaiement_batiment_moe = {};

              vm.showbuttonValidationPaiement_batiment_moe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/


/**********************************debut demande_latrine_moe****************************************/
//col table
        vm.demande_latrine_moe_column = [        
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];


        vm.ajouterDemande_latrine_moe = function ()
        { 
            var items = {
                          $edit: true,
                          $selected: true,
                          id: '0',         
                          id_contrat_bureau_etude: '',         
                          objet: '',
                          description: '',
                          ref_facture: '',
                          tranche: '',
                          montant: '',
                          cumul: '',
                          anterieur: '',
                          periode: '',
                          pourcentage:'',
                          reste:'',
                          date: ''
                        };
          if (vm.NouvelItemDemande_latrine_moe == false)
          {   

              if (vm.alldemande_debut_travaux_moe.length==vm.alltranche_d_debut_travaux_moe.length)
              {               
                  var last_id_demande_latrine_moe = Math.max.apply(Math, vm.alldemande_latrine_moe.map(function(o){return o.id;}));

                vm.dataLastedemande_latrine_moe = vm.alldemande_latrine_moe.filter(function(obj){return obj.id == last_id_demande_latrine_moe;});

                if (vm.dataLastedemande_latrine_moe.length>0)
                {   
                    var last_tranche_demande_latrine_moe = Math.max.apply(Math, vm.dataLastedemande_latrine_moe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_latrine_moe[0].validation))
                    {
                      case 3:     //rejeter DPFI

                          vm.allcurenttranche_demande_latrine_moe = vm.alltranche_demande_latrine_moe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_latrine_moe);});
                          vm.alldemande_latrine_moe.push(items);                          
                          vm.selectedItemDemande_latrine_moe = items;
                          vm.NouvelItemDemande_latrine_moe = true ;
                          vm.dataLastedemande_latrine_moe = [];
                           
                          break;

                      case 4: //Valider dpfi
                          
                          vm.allcurenttranche_demande_latrine_moe = vm.alltranche_demande_latrine_moe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_latrine_moe)+1);});
                          vm.alldemande_latrine_moe.push(items);                          
                          vm.selectedItemDemande_latrine_moe = items;
                          vm.NouvelItemDemande_latrine_moe = true ;
                          break;

                      default:

                          vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_latrine_moe[0].validation);
                          vm.allcurenttranche_demande_latrine_moe = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_demande_latrine_moe = vm.alltranche_demande_latrine_moe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_latrine_moe.push(items);                          
                    vm.selectedItemDemande_latrine_moe = items;
                    vm.NouvelItemDemande_latrine_moe = true ;
                    vm.dataLastedemande_latrine_moe = [];
                }
           }
           else
              {
                vm.showAlert('Ajout demande latrine','La demande avant travaux incomplète ou en-cours de validation');
                vm.allcurenttranche_demande_latrine_moe = [];
              }             
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

       
        //fonction ajout dans bdd
        function ajoutDemande_latrine_moe(demande_latrine_moe,suppression)
        {
            if (vm.NouvelItemDemande_latrine_moe==false)
            {
                test_existanceDemande_latrine_moe (demande_latrine_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_latrine_moe(demande_latrine_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_latrine_moe
        vm.annulerDemande_latrine_moe = function(item)
        {
          if (vm.NouvelItemDemande_latrine_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
           // item.id_contrat_bureau_etude   = currentItemDemande_latrine_moe.id_contrat_bureau_etude ;
            item.objet   = currentItemDemande_latrine_moe.objet ;
            item.description   = currentItemDemande_latrine_moe.description ;
            item.ref_facture   = currentItemDemande_latrine_moe.ref_facture ;
            item.id_tranche_demande_latrine_moe = currentItemDemande_latrine_moe.id_tranche_demande_latrine_moe ;
            item.montant   = currentItemDemande_latrine_moe.montant ;
            item.cumul = currentItemDemande_latrine_moe.cumul ;
            item.anterieur = currentItemDemande_latrine_moe.anterieur;
            item.periode = currentItemDemande_latrine_moe.periode ;
            item.pourcentage = currentItemDemande_latrine_moe.pourcentage ;
            item.reste = currentItemDemande_latrine_moe.reste;
            item.date  = currentItemDemande_latrine_moe.date;
          }else
          {
            vm.alldemande_latrine_moe = vm.alldemande_latrine_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_latrine_moe.id;
            });
          }

          vm.selectedItemDemande_latrine_moe = {} ;
          vm.NouvelItemDemande_latrine_moe      = false;
          
        };

        //fonction selection item Demande_latrine_moe
        vm.selectionDemande_latrine_moe= function (item)
        {
            vm.selectedItemDemande_latrine_moe = item;
            //vm.NouvelItemDemande_latrine_moe   = item;
            currentItemDemande_latrine_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_moe));
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_latrine_moe/index",'id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                {
                    vm.alljustificatif_latrine_moe = result.data.response;
                    console.log(vm.alljustificatif_latrine_moe);
                });
                if (vm.session=='OBCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'menu','getpaiementinvalideBydemande','id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                  {
                      vm.allpaiement_latrine_moe = result.data.response;
                      if (vm.allpaiement_latrine_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_latrine_moe= false;
                      }
                      
                  });
                }
                if (vm.session=='BCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'menu','getpaiementBydemande','id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                  {
                      vm.allpaiement_latrine_moe = result.data.response;
                      vm.showbuttonNouvPaiement_latrine_moe= false;
                  });
                  vm.showbuttonValidationDemande_latrine_moe_creer = true;
                  vm.showbuttonValidationPaiement_latrine_moe = true;
                }
                if (vm.session=='DAAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'menu','getpaiementvalideBydemande','id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                  {
                      vm.allpaiement_latrine_moe = result.data.response;
                      vm.showbuttonNouvPaiement_latrine_moe= false;
                  });
                } 
                if (vm.session=='DPFI') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'menu','getpaiementvalideBydemande','id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                  {
                      vm.allpaiement_latrine_moe = result.data.response;
                      vm.showbuttonNouvPaiement_latrine_moe= false;
                  });

                  vm.showbuttonValidationDemande_latrine_moe_encourdpfi = true;
                  vm.showbuttonValidationDemande_latrine_moe_rejedpfi = true;
                  vm.showbuttonValidationDemande_latrine_moe_validedpfi = true;
                }
                /*if (vm.session=='OBCAF') 
                {
                  vm.alltransfert_daaf = [];
                }*/
                if (vm.session=='ADMIN') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'menu','getpaiementBydemande','id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                  {
                      vm.allpaiement_latrine_moe = result.data.response;
                      if (vm.allpaiement_latrine_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_latrine_moe= false;
                      }
                      vm.showbuttonValidationDemande_latrine_moe_creer = true;
                      vm.showbuttonValidationDemande_latrine_moe_encourdpfi = true;
                      vm.showbuttonValidationDemande_latrine_moe_rejedpfi = true;
                      vm.showbuttonValidationDemande_latrine_moe_validedpfi = true;                      
                      vm.showbuttonValidationPaiement_latrine_moe = true;
                  });
                } 
                if (vm.session=='UFP') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_latrine_moe/index",'menu','getpaiementvalideBydemande','id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                  {
                      vm.allpaiement_latrine_moe = result.data.response;
                      vm.showbuttonNouvPaiement_latrine_moe= false;
                  });
                }
            
            vm.validation_demande_latrine_moe = item.validation;
            vm.stepjusti_d_tra_moe = true;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_latrine_moe', function()
        {
             if (!vm.alldemande_latrine_moe) return;
             vm.alldemande_latrine_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_latrine_moe = function(item)
        {
            vm.NouvelItemDemande_latrine_moe = false ;
            vm.selectedItemDemande_latrine_moe = item;
            currentItemDemande_latrine_moe = angular.copy(vm.selectedItemDemande_latrine_moe);
            $scope.vm.alldemande_latrine_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_bureau_etude   = vm.selectedItemDemande_latrine_moe.contrat_bureau_etude.id ;
            item.objet   = vm.selectedItemDemande_latrine_moe.objet ;
            item.description   = vm.selectedItemDemande_latrine_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_latrine_moe.ref_facture ;
            item.id_tranche_demande_latrine_moe = vm.selectedItemDemande_latrine_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_latrine_moe.montant);
            item.cumul = vm.selectedItemDemande_latrine_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_latrine_moe.anterieur ;
            item.periode = vm.selectedItemDemande_latrine_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_latrine_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_latrine_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_latrine_moe.date) ;
            vm.allcurenttranche_demande_latrine_moe = vm.alltranche_demande_latrine_moe.filter(function(obj)
            {
                return obj.id == vm.selectedItemDemande_latrine_moe.tranche.id;
            });

                vm.showbuttonValidationDemande_latrine_moe_creer = false;
        };

        //fonction bouton suppression item Demande_latrine_moe
        vm.supprimerDemande_latrine_moe = function()
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
                vm.ajoutDemande_latrine_moe(vm.selectedItemDemande_latrine_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_latrine_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_latrine_moe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_latrine_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_latrine_moe.objet )
                    || (pass[0].description   != currentItemDemande_latrine_moe.description )
                    || (pass[0].id_tranche_demande_latrine_moe != currentItemDemande_latrine_moe.id_tranche_demande_latrine_moe )
                    || (pass[0].montant   != currentItemDemande_latrine_moe.montant )
                    || (pass[0].cumul != currentItemDemande_latrine_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_latrine_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_latrine_moe.reste )
                    || (pass[0].date   != currentItemDemande_latrine_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_latrine_moe.ref_facture ))                   
                      { 
                         insert_in_baseDemande_latrine_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_latrine_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_latrine_moe
        function insert_in_baseDemande_latrine_moe(demande_latrine_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_latrine_moe==false)
            {
                getId = vm.selectedItemDemande_latrine_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_latrine_moe.objet,
                    description:demande_latrine_moe.description,
                    ref_facture:demande_latrine_moe.ref_facture,
                    id_tranche_demande_latrine_moe: demande_latrine_moe.id_tranche_demande_latrine_moe ,
                    montant: demande_latrine_moe.montant,
                    cumul: demande_latrine_moe.cumul ,
                    anterieur: demande_latrine_moe.anterieur ,
                    reste: demande_latrine_moe.reste ,
                    date: convertionDate(new Date(demande_latrine_moe.date)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_latrine_moe.filter(function(obj)
                {
                    return obj.id == demande_latrine_moe.id_tranche_demande_latrine_moe;
                });

                if (vm.NouvelItemDemande_latrine_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_latrine_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                        vm.selectedItemDemande_latrine_moe.tranche = tran[0] ;

                        vm.selectedItemDemande_latrine_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_latrine_moe.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_latrine_moe.$selected  = false;
                        vm.selectedItemDemande_latrine_moe.$edit      = false;
                        vm.selectedItemDemande_latrine_moe ={};
                        
                    }
                    else 
                    {    
                      vm.alldemande_latrine_moe = vm.alldemande_latrine_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_latrine_moe.id;
                      });
                    }
                    
                }
                else
                {                  
                  demande_latrine_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                  demande_latrine_moe.tranche = tran[0] ;
                  demande_latrine_moe.periode = tran[0].periode ;
                  demande_latrine_moe.pourcentage = tran[0].pourcentage ;
                  demande_latrine_moe.id  =   String(data.response);              
                  vm.NouvelItemDemande_latrine_moe=false;
                  demande_latrine_moe.validation = 0;
                vm.validation_demande_latrine_moe = 0;
            }
              demande_latrine_moe.$selected = false;
              demande_latrine_moe.$edit = false;
              vm.selectedItemDemande_latrine_moe = {};
              vm.showbuttonNouvDemande_latrine_moe_creer = false;
            vm.showbuttonValidationDemande_latrine_moe_creer = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_latrine_moe = function(item)
        { 
          var nbr_t = [];
          var reste = 0;
          var anterieur = 0;
          console.log(vm.selectedItemContrat_moe);
            var montant = (parseInt(vm.selectedItemContrat_moe.montant_contrat) * (vm.allcurenttranche_demande_latrine_moe[0].pourcentage))/100;
            var cumul = montant;
          var demande_ancien = vm.alldemande_latrine_moe.filter(function(obj)
              {
                          return obj.id != 0;
              });

          console.log(demande_ancien);

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_latrine_moe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_latrine_moe[0].cumul);
          }
          

          reste= (parseInt(vm.selectedItemContrat_moe.montant_contrat)) - cumul;

          item.periode = vm.allcurenttranche_demande_latrine_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_latrine_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          console.log(item);
          console.log(vm.selectedItemContrat_moe);
         
          //var nbr_latrine_moe_total = vm.alldemande_latrine_moe.length;
          
        }

        vm.validerDemande_latrine_moe_creer = function()
        {
          maj_in_baseDemande_latrine_moe(vm.selectedItemDemande_latrine_moe,0,1);
        }
        vm.validerDemande_latrine_moe_encourdpfi = function()
        {
          maj_in_baseDemande_latrine_moe(vm.selectedItemDemande_latrine_moe,0,2);
        }
        vm.validerDemande_latrine_moe_rejedpfi = function()
        {
          maj_in_baseDemande_latrine_moe(vm.selectedItemDemande_latrine_moe,0,3);
        }
        vm.validerDemande_latrine_moe_validedpfi = function()
        {
          maj_in_baseDemande_latrine_moe(vm.selectedItemDemande_latrine_moe,0,4);
        }

        function maj_in_baseDemande_latrine_moe(demande_latrine_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_latrine_moe.id,
                    objet: demande_latrine_moe.objet,
                    description:demande_latrine_moe.description,
                    ref_facture:demande_latrine_moe.ref_facture,
                    id_tranche_demande_latrine_moe: demande_latrine_moe.tranche.id ,
                    montant: demande_latrine_moe.montant,
                    cumul: demande_latrine_moe.cumul ,
                    anterieur: demande_latrine_moe.anterieur ,
                    reste: demande_latrine_moe.reste ,
                    date: convertionDate(new Date(demande_latrine_moe.date)),
                    id_contrat_bureau_etude: demande_latrine_moe.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_moe/index",datas, config).success(function (data)
            { 
              demande_latrine_moe.validation = validation; 
              vm.validation_demande_latrine_moe = validation;
              demande_latrine_moe.$selected = false;
              demande_latrine_moe.$edit = false;
              vm.selectedItemDemande_latrine_moe = {};
              vm.showbuttonValidationDemande_latrine_moe_creer = false;
              vm.showbuttonValidationDemande_latrine_moe_encourdpfi = false;
              vm.showbuttonValidationDemande_latrine_moe_rejedpfi = false;
              vm.showbuttonValidationDemande_latrine_moe_validedpfi = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/******************************************fin demande_latrine_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_latrine_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_latrine_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_latrine_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_latrine_moe = function ()
        { 
          if (NouvelItemJustificatif_latrine_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_latrine_moe.push(items);
            vm.alljustificatif_latrine_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_latrine_moe = mem;
              }
            });

            NouvelItemJustificatif_latrine_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_latrine_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_latrine_moe(justificatif_latrine_moe,suppression)
        {
            if (NouvelItemJustificatif_latrine_moe==false)
            {
                test_existanceJustificatif_latrine_moe (justificatif_latrine_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_latrine_moe(justificatif_latrine_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_latrine_moe
        vm.annulerJustificatif_latrine_moe = function(item)
        {
          if (NouvelItemJustificatif_latrine_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_latrine_moe.description ;
            item.fichier   = currentItemJustificatif_latrine_moe.fichier ;
          }else
          {
            vm.alljustificatif_latrine_moe = vm.alljustificatif_latrine_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_latrine_moe.id;
            });
          }

          vm.selectedItemJustificatif_latrine_moe = {} ;
          NouvelItemJustificatif_latrine_moe      = false;
          
        };

        //fonction selection item justificatif latrine_moe
        vm.selectionJustificatif_latrine_moe= function (item)
        {
            vm.selectedItemJustificatif_latrine_moe = item;
            vm.nouvelItemJustificatif_latrine_moe   = item;
            currentItemJustificatif_latrine_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_latrine_moe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_latrine_moe', function()
        {
             if (!vm.alljustificatif_latrine_moe) return;
             vm.alljustificatif_latrine_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_latrine_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_latrine_moe = function(item)
        {
            NouvelItemJustificatif_latrine_moe = false ;
            vm.selectedItemJustificatif_latrine_moe = item;
            currentItemJustificatif_latrine_moe = angular.copy(vm.selectedItemJustificatif_latrine_moe);
            $scope.vm.alljustificatif_latrine_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_latrine_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_latrine_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_latrine_moe
        vm.supprimerJustificatif_latrine_moe = function()
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
                vm.ajoutJustificatif_latrine_moe(vm.selectedItemJustificatif_latrine_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_latrine_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_latrine_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_latrine_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_latrine_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_latrine_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_latrine_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_latrine_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_latrine_moe
        function insert_in_baseJustificatif_latrine_moe(justificatif_latrine_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_latrine_moe==false)
            {
                getId = vm.selectedItemJustificatif_latrine_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_latrine_moe.description,
                    fichier: justificatif_latrine_moe.fichier,
                    id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_latrine_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_latrine_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_latrine_moe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_latrine_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_latrine_moe.description,
                                                      fichier: justificatif_latrine_moe.fichier,
                                                      id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_latrine_moe.$selected = false;
                                          justificatif_latrine_moe.$edit = false;
                                          vm.selectedItemJustificatif_latrine_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_latrine_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_latrine_moe.description,
                                        fichier: justificatif_latrine_moe.fichier,
                                        id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_latrine_moe.$selected = false;
                                      justificatif_latrine_moe.$edit = false;
                                      vm.selectedItemJustificatif_latrine_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_latrine_moe.$selected  = false;
                        vm.selectedItemJustificatif_latrine_moe.$edit      = false;
                        vm.selectedItemJustificatif_latrine_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_latrine_moe = vm.alljustificatif_latrine_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_latrine_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_latrine_moe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_latrine_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_latrine_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_latrine_moe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_latrine_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_latrine_moe.description,
                                                fichier: justificatif_latrine_moe.fichier,
                                                id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                                
                                  });
                                apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                                { 
                                    justificatif_latrine_moe.$selected = false;
                                    justificatif_latrine_moe.$edit = false;
                                    vm.selectedItemJustificatif_latrine_moe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_latrine_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_latrine_moe.description,
                                  fichier: justificatif_latrine_moe.fichier,
                                  id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                               
                              });
                            apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_latrine_moe.$selected = false;
                                justificatif_latrine_moe.$edit = false;
                                vm.selectedItemJustificatif_latrine_moe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_latrine_moe.$selected = false;
              justificatif_latrine_moe.$edit = false;
              vm.selectedItemJustificatif_latrine_moe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif latrine_moe**********************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_latrine_moe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_latrine_moe = function ()
        { 
          if (NouvelItemPaiement_latrine_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_latrine_moe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_latrine_moe.push(items);
            vm.allpaiement_latrine_moe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_latrine_moe = conv;
              }
            });

            NouvelItemPaiement_latrine_moe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_latrine_moe(paiement_latrine_moe,suppression)
        {
            if (NouvelItemPaiement_latrine_moe==false)
            {
                test_existancePaiement_latrine_moe (paiement_latrine_moe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_latrine_moe(paiement_latrine_moe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_latrine_moe
        vm.annulerPaiement_latrine_moe = function(item)
        {
          if (NouvelItemPaiement_latrine_moe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_latrine_moe.montant_paiement;
              item.observation    = currentItemPaiement_latrine_moe.observation;
              item.date_paiement = currentItemPaiement_latrine_moe.date_paiement; 
          }else
          {
            vm.allpaiement_latrine_moe = vm.allpaiement_latrine_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_latrine_moe.id;
            });
          }

          vm.selectedItemPaiement_latrine_moe = {} ;
          NouvelItemPaiement_latrine_moe      = false;
          
        };

        //fonction selection item paiement_latrine_moe convention cisco/feffi
        vm.selectionPaiement_latrine_moe = function (item)
        {
            vm.selectedItemPaiement_latrine_moe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_latrine_moe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_latrine_moe));
              vm.showbuttonValidationPaiement_latrine_moe = true;
            }
            vm.validation_paiement_latrine_moe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_latrine_moe', function()
        {
             if (!vm.allpaiement_latrine_moe) return;
             vm.allpaiement_latrine_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_latrine_moe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_latrine_moe = function(item)
        {
            NouvelItemPaiement_latrine_moe = false ;
            vm.selectedItemPaiement_latrine_moe = item;
            currentItemPaiement_latrine_moe = angular.copy(vm.selectedItemPaiement_latrine_moe);
            $scope.vm.allpaiement_latrine_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_latrine_moe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_latrine_moe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_latrine_moe.date_paiement);
        };

        //fonction bouton suppression item paiement_latrine_moe convention cisco feffi
        vm.supprimerPaiement_latrine_moe = function()
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
                vm.ajoutPaiement_latrine_moe(vm.selectedItemPaiement_latrine_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_latrine_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_latrine_moe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_latrine_moe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_latrine_moe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_latrine_moe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_latrine_moe.montant_paiement))                    
                      {
                          insert_in_basePaiement_latrine_moe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_latrine_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_latrine_moe(paiement_latrine_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_latrine_moe ==false)
            {
                getId = vm.selectedItemPaiement_latrine_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_latrine_moe.montant_paiement,
                    observation: paiement_latrine_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_latrine_moe.date_paiement)), 
                    id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_latrine_moe/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_latrine_moe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_latrine_moe.$selected  = false;
                        vm.selectedItemPaiement_latrine_moe.$edit      = false;
                        vm.selectedItemPaiement_latrine_moe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_latrine_moe = vm.allpaiement_latrine_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_latrine_moe.id;
                      });
                      vm.showbuttonNouvPaiement_latrine_moe = true;
                    }
                }
                else
                { 
                  paiement_latrine_moe.validation = 0;
                  paiement_latrine_moe.id  =   String(data.response);              
                  NouvelItemPaiement_latrine_moe = false;

                  vm.showbuttonNouvPaiement_latrine_moe = false;
            }
              paiement_latrine_moe.$selected = false;
              paiement_latrine_moe.$edit = false;
              vm.selectedItemPaiement_latrine_moe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_latrine_moe= function()
        {
              validation_in_basepaiement_latrine_moe(vm.selectedItemPaiement_latrine_moe,0);
        }
        function validation_in_basepaiement_latrine_moe(paiement_latrine_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_latrine_moe ==false)
            {
                getId = vm.selectedItemPaiement_latrine_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_latrine_moe.montant_paiement,
                    observation: paiement_latrine_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_latrine_moe.date_paiement)), 
                    id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_latrine_moe/index",datas, config).success(function (data)
            { 
              paiement_latrine_moe.validation = 1;
              vm.validation_paiement_latrine_moe = 1;
              paiement_latrine_moe.$selected = false;
              paiement_latrine_moe.$edit = false;
              vm.selectedItemPaiement_latrine_moe = {};

              vm.showbuttonValidationPaiement_latrine_moe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/


      /**********************************debut demande_debut_travaux_moe****************************************/
//col table
        vm.demande_fin_travaux_moe_column = [        
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage moe
        apiFactory.getAll("tranche_d_fin_travaux_moe/index").then(function(result)
        {
          vm.alltranche_d_fin_travaux_moe= result.data.response;
          vm.allcurenttranche_d_fin_travaux_moe = result.data.response;
          //console.log(vm.allcurenttranche_d_fin_travaux_moe);
        });

        vm.ajouterDemande_fin_travaux_moe = function ()
        { 
            var items = {
                          $edit: true,
                          $selected: true,
                          id: '0',         
                          id_contrat_bureau_etude: '',         
                          objet: '',
                          description: '',
                          ref_facture: '',
                          tranche: '',
                          montant: '',
                          cumul: '',
                          anterieur: '',
                          periode: '',
                          pourcentage:'',
                          reste:'',
                          date: ''
                        };
          if (vm.NouvelItemDemande_fin_travaux_moe == false)
          {      

              apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index",'menu','summePourcentageCurrent','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
              {
                  var pourcentagecurrenttotal = result.data.response[0].pourcentage_total;
                  console.log(pourcentagecurrenttotal);
              
                  if (pourcentagecurrenttotal != 100)
                  {            
                      var last_id_demande_fin_moe = Math.max.apply(Math, vm.alldemande_fin_travaux_moe.map(function(o){return o.id;}));

                      vm.dataLastedemande_fin_moe = vm.alldemande_fin_travaux_moe.filter(function(obj){return obj.id == last_id_demande_fin_moe;});

                      if (vm.dataLastedemande_fin_moe.length>0)
                      {   
                          var last_tranche_demande_fin_moe = Math.max.apply(Math, vm.dataLastedemande_fin_moe.map(function(o){return o.tranche.code.split(' ')[1];}));
                          
                          switch (parseInt(vm.dataLastedemande_fin_moe[0].validation))
                          {
                            case 3:     //rejeter DPFI

                                vm.allcurenttranche_d_fin_travaux_moe = vm.alltranche_d_fin_travaux_moe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_fin_moe);});
                                vm.alldemande_fin_travaux_moe.push(items);                          
                                vm.selectedItemDemande_fin_travaux_moe = items;
                                vm.NouvelItemDemande_fin_travaux_moe = true ;
                                vm.dataLastedemande_fin_moe = [];
                                 
                                break;

                            case 4: //Valider dpfi
                                
                                vm.allcurenttranche_d_fin_travaux_moe = vm.alltranche_d_fin_travaux_moe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_fin_moe)+1);});
                                vm.alldemande_fin_travaux_moe.push(items);                          
                                vm.selectedItemDemande_fin_travaux_moe = items;
                                vm.NouvelItemDemande_fin_travaux_moe = true ;
                                break;

                            default:

                                vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_fin_moe[0].validation);
                                vm.allcurenttranche_d_fin_travaux_moe = [];
                                break;
                        
                          }
                      }
                      else
                      {
                          vm.allcurenttranche_d_fin_travaux_moe = vm.alltranche_d_fin_travaux_moe.filter(function(obj){return obj.code == 'tranche 1';});
                          vm.alldemande_fin_travaux_moe.push(items);                          
                          vm.selectedItemDemande_fin_travaux_moe = items;
                          vm.NouvelItemDemande_fin_travaux_moe = true ;
                          vm.dataLastedemande_fin_moe = [];
                      }
            }else
            {
              vm.showAlert('Ajout demande fin travaux',' Les demandes durant les travaux ne sont pas achevées !!!');
              vm.allcurenttranche_d_fin_travaux_moe = [];
            }
           });             
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

       
        //fonction ajout dans bdd
        function ajoutDemande_fin_travaux_moe(demande_fin_travaux_moe,suppression)
        {
            if (vm.NouvelItemDemande_fin_travaux_moe==false)
            {
                test_existanceDemande_fin_travaux_moe (demande_fin_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_fin_travaux_moe(demande_fin_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_fin_travaux_moe
        vm.annulerDemande_fin_travaux_moe = function(item)
        {
          if (vm.NouvelItemDemande_fin_travaux_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
           // item.id_contrat_bureau_etude   = currentItemDemande_fin_travaux_moe.id_contrat_bureau_etude ;
            item.objet   = currentItemDemande_fin_travaux_moe.objet ;
            item.description   = currentItemDemande_fin_travaux_moe.description ;
            item.ref_facture   = currentItemDemande_fin_travaux_moe.ref_facture ;
            item.id_tranche_d_fin_travaux_moe = currentItemDemande_fin_travaux_moe.id_tranche_d_fin_travaux_moe ;
            item.montant   = currentItemDemande_fin_travaux_moe.montant ;
            item.cumul = currentItemDemande_fin_travaux_moe.cumul ;
            item.anterieur = currentItemDemande_fin_travaux_moe.anterieur;
            item.periode = currentItemDemande_fin_travaux_moe.periode ;
            item.pourcentage = currentItemDemande_fin_travaux_moe.pourcentage ;
            item.reste = currentItemDemande_fin_travaux_moe.reste;
            item.date  = currentItemDemande_fin_travaux_moe.date;
          }else
          {
            vm.alldemande_fin_travaux_moe = vm.alldemande_fin_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_fin_travaux_moe.id;
            });
          }

          vm.selectedItemDemande_fin_travaux_moe = {} ;
          vm.NouvelItemDemande_fin_travaux_moe      = false;
          
        };

        //fonction selection item Demande_fin_travaux_moe
        vm.selectionDemande_fin_travaux_moe= function (item)
        {
            vm.selectedItemDemande_fin_travaux_moe = item;
            //vm.NouvelItemDemande_fin_travaux_moe   = item;
            currentItemDemande_fin_travaux_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_fin_travaux_moe));
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_fin_travaux_moe/index",'id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                {
                    vm.alljustificatif_fin_travaux_moe = result.data.response;
                    console.log(vm.alljustificatif_fin_travaux_moe);
                });
                if (vm.session=='OBCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_moe/index",'menu','getpaiementinvalideBydemande','id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_fin_travaux_moe = result.data.response;
                      if (vm.allpaiement_fin_travaux_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_fin_travaux_moe= false;
                      }
                      
                  });
                }
                if (vm.session=='BCAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_moe/index",'menu','getpaiementBydemande','id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_fin_travaux_moe= false;
                  });
                  vm.showbuttonValidationDemande_fin_travaux_moe_creer = true;
                  vm.showbuttonValidationPaiement_fin_travaux_moe = true;
                }
                if (vm.session=='DAAF') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_moe/index",'menu','getpaiementvalideBydemande','id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_fin_travaux_moe= false;
                  });
                } 
                if (vm.session=='DPFI') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_moe/index",'menu','getpaiementvalideBydemande','id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_fin_travaux_moe= false;
                  });

                  vm.showbuttonValidationDemande_fin_travaux_moe_encourdpfi = true;
                  vm.showbuttonValidationDemande_fin_travaux_moe_rejedpfi = true;
                  vm.showbuttonValidationDemande_fin_travaux_moe_validedpfi = true;
                }
                /*if (vm.session=='OBCAF') 
                {
                  vm.alltransfert_daaf = [];
                }*/
                if (vm.session=='ADMIN') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_moe/index",'menu','getpaiementBydemande','id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_fin_travaux_moe = result.data.response;
                      if (vm.allpaiement_fin_travaux_moe.length>0)
                      {
                        vm.showbuttonNouvPaiement_fin_travaux_moe= false;
                      }
                      vm.showbuttonValidationDemande_fin_travaux_moe_creer = true;
                      vm.showbuttonValidationDemande_fin_travaux_moe_encourdpfi = true;
                      vm.showbuttonValidationDemande_fin_travaux_moe_rejedpfi = true;
                      vm.showbuttonValidationDemande_fin_travaux_moe_validedpfi = true;                      
                      vm.showbuttonValidationPaiement_fin_travaux_moe = true;
                  });
                } 
                if (vm.session=='UFP') 
                {
                  apiFactory.getAPIgeneraliserREST("paiement_fin_travaux_moe/index",'menu','getpaiementvalideBydemande','id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                  {
                      vm.allpaiement_fin_travaux_moe = result.data.response;
                      vm.showbuttonNouvPaiement_fin_travaux_moe= false;
                  });
                }
            
            vm.validation_demande_fin_travaux_moe = item.validation;
            vm.stepjusti_d_tra_moe = true;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_fin_travaux_moe', function()
        {
             if (!vm.alldemande_fin_travaux_moe) return;
             vm.alldemande_fin_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_fin_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_fin_travaux_moe = function(item)
        {
            vm.NouvelItemDemande_fin_travaux_moe = false ;
            vm.selectedItemDemande_fin_travaux_moe = item;
            currentItemDemande_fin_travaux_moe = angular.copy(vm.selectedItemDemande_fin_travaux_moe);
            $scope.vm.alldemande_fin_travaux_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_bureau_etude   = vm.selectedItemDemande_fin_travaux_moe.contrat_bureau_etude.id ;
            item.objet   = vm.selectedItemDemande_fin_travaux_moe.objet ;
            item.description   = vm.selectedItemDemande_fin_travaux_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_fin_travaux_moe.ref_facture ;
            item.id_tranche_d_fin_travaux_moe = vm.selectedItemDemande_fin_travaux_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_fin_travaux_moe.montant);
            item.cumul = vm.selectedItemDemande_fin_travaux_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_fin_travaux_moe.anterieur ;
            item.periode = vm.selectedItemDemande_fin_travaux_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_fin_travaux_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_fin_travaux_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_fin_travaux_moe.date) ;
            vm.allcurenttranche_d_fin_travaux_moe = vm.alltranche_d_fin_travaux_moe.filter(function(obj)
            {
                return obj.id == vm.selectedItemDemande_fin_travaux_moe.tranche.id;
            });

                vm.showbuttonValidationDemande_fin_travaux_moe_creer = false;
        };

        //fonction bouton suppression item Demande_fin_travaux_moe
        vm.supprimerDemande_fin_travaux_moe = function()
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
                vm.ajoutDemande_fin_travaux_moe(vm.selectedItemDemande_fin_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_fin_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_fin_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_fin_travaux_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_fin_travaux_moe.objet )
                    || (pass[0].description   != currentItemDemande_fin_travaux_moe.description )
                    || (pass[0].id_tranche_d_fin_travaux_moe != currentItemDemande_fin_travaux_moe.id_tranche_d_fin_travaux_moe )
                    || (pass[0].montant   != currentItemDemande_fin_travaux_moe.montant )
                    || (pass[0].cumul != currentItemDemande_fin_travaux_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_fin_travaux_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_fin_travaux_moe.reste )
                    || (pass[0].date   != currentItemDemande_fin_travaux_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_fin_travaux_moe.ref_facture ))                   
                      { 
                         insert_in_baseDemande_fin_travaux_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_fin_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_fin_travaux_moe
        function insert_in_baseDemande_fin_travaux_moe(demande_fin_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_fin_travaux_moe==false)
            {
                getId = vm.selectedItemDemande_fin_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_fin_travaux_moe.objet,
                    description:demande_fin_travaux_moe.description,
                    ref_facture:demande_fin_travaux_moe.ref_facture,
                    id_tranche_d_fin_travaux_moe: demande_fin_travaux_moe.id_tranche_d_fin_travaux_moe ,
                    montant: demande_fin_travaux_moe.montant,
                    cumul: demande_fin_travaux_moe.cumul ,
                    anterieur: demande_fin_travaux_moe.anterieur ,
                    reste: demande_fin_travaux_moe.reste ,
                    date: convertionDate(new Date(demande_fin_travaux_moe.date)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_fin_travaux_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_d_fin_travaux_moe.filter(function(obj)
                {
                    return obj.id == demande_fin_travaux_moe.id_tranche_d_fin_travaux_moe;
                });

                if (vm.NouvelItemDemande_fin_travaux_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_fin_travaux_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                        vm.selectedItemDemande_fin_travaux_moe.tranche = tran[0] ;

                        vm.selectedItemDemande_fin_travaux_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_fin_travaux_moe.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_fin_travaux_moe.$selected  = false;
                        vm.selectedItemDemande_fin_travaux_moe.$edit      = false;
                        vm.selectedItemDemande_fin_travaux_moe ={};
                        
                    }
                    else 
                    {    
                      vm.alldemande_fin_travaux_moe = vm.alldemande_fin_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_fin_travaux_moe.id;
                      });
                    }
                    
                }
                else
                {                  
                  demande_fin_travaux_moe.contrat_bureau_etude = vm.selectedItemContrat_moe ;
                  demande_fin_travaux_moe.tranche = tran[0] ;
                  demande_fin_travaux_moe.periode = tran[0].periode ;
                  demande_fin_travaux_moe.pourcentage = tran[0].pourcentage ;
                  demande_fin_travaux_moe.id  =   String(data.response);              
                  vm.NouvelItemDemande_fin_travaux_moe=false;
                  demande_fin_travaux_moe.validation = 0;
                vm.validation_demande_fin_travaux_moe = 0;
            }
              demande_fin_travaux_moe.$selected = false;
              demande_fin_travaux_moe.$edit = false;
              vm.selectedItemDemande_fin_travaux_moe = {};
              vm.showbuttonNouvDemande_fin_travaux_moe_creer = false;
            vm.showbuttonValidationDemande_fin_travaux_moe_creer = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_fin_moe = function(item)
        { 
          var nbr_t = [];
          var reste = 0;
          var anterieur = 0;
          console.log(vm.selectedItemContrat_moe);
            var montant = (parseInt(vm.selectedItemContrat_moe.montant_contrat) * (vm.allcurenttranche_d_fin_travaux_moe[0].pourcentage))/100;
            var cumul = montant;
          var demande_ancien = vm.alldemande_fin_travaux_moe.filter(function(obj)
              {
                          return obj.id != 0;
              });

          console.log(demande_ancien);

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_fin_moe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_fin_moe[0].cumul);
          }
          

          reste= (parseInt(vm.selectedItemContrat_moe.montant_contrat)) - cumul;

          item.periode = vm.allcurenttranche_d_fin_travaux_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_d_fin_travaux_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          console.log(item);
          console.log(vm.selectedItemContrat_moe);
         
          //var nbr_fin_travaux_total = vm.alldemande_fin_travaux_moe.length;
          
        }

        vm.validerDemande_fin_travaux_moe_creer = function()
        {
          maj_in_baseDemande_fin_travaux_moe(vm.selectedItemDemande_fin_travaux_moe,0,1);
        }
        vm.validerDemande_fin_travaux_moe_encourdpfi = function()
        {
          maj_in_baseDemande_fin_travaux_moe(vm.selectedItemDemande_fin_travaux_moe,0,2);
        }
        vm.validerDemande_fin_travaux_moe_rejedpfi = function()
        {
          maj_in_baseDemande_fin_travaux_moe(vm.selectedItemDemande_fin_travaux_moe,0,3);
        }
        vm.validerDemande_fin_travaux_moe_validedpfi = function()
        {
          maj_in_baseDemande_fin_travaux_moe(vm.selectedItemDemande_fin_travaux_moe,0,4);
        }

        function maj_in_baseDemande_fin_travaux_moe(demande_fin_travaux_moe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_fin_travaux_moe.id,
                    objet: demande_fin_travaux_moe.objet,
                    description:demande_fin_travaux_moe.description,
                    ref_facture:demande_fin_travaux_moe.ref_facture,
                    id_tranche_d_fin_travaux_moe: demande_fin_travaux_moe.tranche.id ,
                    montant: demande_fin_travaux_moe.montant,
                    cumul: demande_fin_travaux_moe.cumul ,
                    anterieur: demande_fin_travaux_moe.anterieur ,
                    reste: demande_fin_travaux_moe.reste ,
                    date: convertionDate(new Date(demande_fin_travaux_moe.date)),
                    id_contrat_bureau_etude: demande_fin_travaux_moe.contrat_bureau_etude.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_fin_travaux_moe/index",datas, config).success(function (data)
            { 
              demande_fin_travaux_moe.validation = validation; 
              vm.validation_demande_fin_travaux_moe = validation;
              demande_fin_travaux_moe.$selected = false;
              demande_fin_travaux_moe.$edit = false;
              vm.selectedItemDemande_fin_travaux_moe = {};
              vm.showbuttonValidationDemande_fin_travaux_moe_creer = false;
              vm.showbuttonValidationDemande_fin_travaux_moe_encourdpfi = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/******************************************fin demande_fin_travaux_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_fin_travaux_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_fin_travaux_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_fin_travaux_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_fin_travaux_moe = function ()
        { 
          if (NouvelItemJustificatif_fin_travaux_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_fin_travaux_moe.push(items);
            vm.alljustificatif_fin_travaux_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_fin_travaux_moe = mem;
              }
            });

            NouvelItemJustificatif_fin_travaux_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_fin_travaux_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_fin_travaux_moe(justificatif_fin_travaux_moe,suppression)
        {
            if (NouvelItemJustificatif_fin_travaux_moe==false)
            {
                test_existanceJustificatif_fin_travaux_moe (justificatif_fin_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_fin_travaux_moe(justificatif_fin_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_fin_travaux_moe
        vm.annulerJustificatif_fin_travaux_moe = function(item)
        {
          if (NouvelItemJustificatif_fin_travaux_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_fin_travaux_moe.description ;
            item.fichier   = currentItemJustificatif_fin_travaux_moe.fichier ;
          }else
          {
            vm.alljustificatif_fin_travaux_moe = vm.alljustificatif_fin_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_fin_travaux_moe.id;
            });
          }

          vm.selectedItemJustificatif_fin_travaux_moe = {} ;
          NouvelItemJustificatif_fin_travaux_moe      = false;
          
        };

        //fonction selection item justificatif fin_travaux
        vm.selectionJustificatif_fin_travaux_moe= function (item)
        {
            vm.selectedItemJustificatif_fin_travaux_moe = item;
            vm.nouvelItemJustificatif_fin_travaux_moe   = item;
            currentItemJustificatif_fin_travaux_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_fin_travaux_moe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_fin_travaux_moe', function()
        {
             if (!vm.alljustificatif_fin_travaux_moe) return;
             vm.alljustificatif_fin_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_fin_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_fin_travaux_moe = function(item)
        {
            NouvelItemJustificatif_fin_travaux_moe = false ;
            vm.selectedItemJustificatif_fin_travaux_moe = item;
            currentItemJustificatif_fin_travaux_moe = angular.copy(vm.selectedItemJustificatif_fin_travaux_moe);
            $scope.vm.alljustificatif_fin_travaux_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_fin_travaux_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_fin_travaux_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_fin_travaux_moe
        vm.supprimerJustificatif_fin_travaux_moe = function()
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
                vm.ajoutJustificatif_fin_travaux_moe(vm.selectedItemJustificatif_fin_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_fin_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_fin_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_fin_travaux_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_fin_travaux_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_fin_travaux_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_fin_travaux_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_fin_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_fin_travaux_moe
        function insert_in_baseJustificatif_fin_travaux_moe(justificatif_fin_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_fin_travaux_moe==false)
            {
                getId = vm.selectedItemJustificatif_fin_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_fin_travaux_moe.description,
                    fichier: justificatif_fin_travaux_moe.fichier,
                    id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_fin_travaux_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_fin_travaux_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_fin_travaux_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_fin_travaux_moe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_fin_travaux_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_fin_travaux_moe.description,
                                                      fichier: justificatif_fin_travaux_moe.fichier,
                                                      id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_fin_travaux_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_fin_travaux_moe.$selected = false;
                                          justificatif_fin_travaux_moe.$edit = false;
                                          vm.selectedItemJustificatif_fin_travaux_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_fin_travaux_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_fin_travaux_moe.description,
                                        fichier: justificatif_fin_travaux_moe.fichier,
                                        id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_fin_travaux_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_fin_travaux_moe.$selected = false;
                                      justificatif_fin_travaux_moe.$edit = false;
                                      vm.selectedItemJustificatif_fin_travaux_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_fin_travaux_moe.$selected  = false;
                        vm.selectedItemJustificatif_fin_travaux_moe.$edit      = false;
                        vm.selectedItemJustificatif_fin_travaux_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_fin_travaux_moe = vm.alljustificatif_fin_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_fin_travaux_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_fin_travaux_moe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_fin_travaux_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_fin_travaux_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_fin_travaux_moe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_fin_travaux_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_fin_travaux_moe.description,
                                                fichier: justificatif_fin_travaux_moe.fichier,
                                                id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                                                
                                  });
                                apiFactory.add("justificatif_fin_travaux_moe/index",datas, config).success(function (data)
                                { 
                                    justificatif_fin_travaux_moe.$selected = false;
                                    justificatif_fin_travaux_moe.$edit = false;
                                    vm.selectedItemJustificatif_fin_travaux_moe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_fin_travaux_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_fin_travaux_moe.description,
                                  fichier: justificatif_fin_travaux_moe.fichier,
                                  id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                                               
                              });
                            apiFactory.add("justificatif_fin_travaux_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_fin_travaux_moe.$selected = false;
                                justificatif_fin_travaux_moe.$edit = false;
                                vm.selectedItemJustificatif_fin_travaux_moe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_fin_travaux_moe.$selected = false;
              justificatif_fin_travaux_moe.$edit = false;
              vm.selectedItemJustificatif_fin_travaux_moe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif fin_travaux**********************************************/

/**********************************fin paiement****************************************/
//col table
        vm.paiement_fin_travaux_moe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_fin_travaux_moe = function ()
        { 
          if (NouvelItemPaiement_fin_travaux_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_fin_travaux_moe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_fin_travaux_moe.push(items);
            vm.allpaiement_fin_travaux_moe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_fin_travaux_moe = conv;
              }
            });

            NouvelItemPaiement_fin_travaux_moe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_fin_travaux_moe(paiement_fin_travaux_moe,suppression)
        {
            if (NouvelItemPaiement_fin_travaux_moe==false)
            {
                test_existancePaiement_fin_travaux_moe (paiement_fin_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_fin_travaux_moe(paiement_fin_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_fin_travaux_moe
        vm.annulerPaiement_fin_travaux_moe = function(item)
        {
          if (NouvelItemPaiement_fin_travaux_moe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_fin_travaux_moe.montant_paiement;
              item.observation    = currentItemPaiement_fin_travaux_moe.observation;
              item.date_paiement = currentItemPaiement_fin_travaux_moe.date_paiement; 
          }else
          {
            vm.allpaiement_fin_travaux_moe = vm.allpaiement_fin_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_fin_travaux_moe.id;
            });
          }

          vm.selectedItemPaiement_fin_travaux_moe = {} ;
          NouvelItemPaiement_fin_travaux_moe      = false;
          
        };

        //fonction selection item paiement_fin_travaux_moe convention cisco/feffi
        vm.selectionPaiement_fin_travaux_moe = function (item)
        {
            vm.selectedItemPaiement_fin_travaux_moe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_fin_travaux_moe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_fin_travaux_moe));
              vm.showbuttonValidationPaiement_fin_travaux_moe = true;
            }
            vm.validation_paiement_fin_travaux_moe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_fin_travaux_moe', function()
        {
             if (!vm.allpaiement_fin_travaux_moe) return;
             vm.allpaiement_fin_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_fin_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_fin_travaux_moe = function(item)
        {
            NouvelItemPaiement_fin_travaux_moe = false ;
            vm.selectedItemPaiement_fin_travaux_moe = item;
            currentItemPaiement_fin_travaux_moe = angular.copy(vm.selectedItemPaiement_fin_travaux_moe);
            $scope.vm.allpaiement_fin_travaux_moe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_fin_travaux_moe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_fin_travaux_moe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_fin_travaux_moe.date_paiement);
        };

        //fonction bouton suppression item paiement_fin_travaux_moe convention cisco feffi
        vm.supprimerPaiement_fin_travaux_moe = function()
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
                vm.ajoutPaiement_fin_travaux_moe(vm.selectedItemPaiement_fin_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_fin_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_fin_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_fin_travaux_moe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_fin_travaux_moe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_fin_travaux_moe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_fin_travaux_moe.montant_paiement))                    
                      {
                          insert_in_basePaiement_fin_travaux_moe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_fin_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_fin_travaux_moe(paiement_fin_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_fin_travaux_moe ==false)
            {
                getId = vm.selectedItemPaiement_fin_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_fin_travaux_moe.montant_paiement,
                    observation: paiement_fin_travaux_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_fin_travaux_moe.date_paiement)), 
                    id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_fin_travaux_moe/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_fin_travaux_moe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_fin_travaux_moe.$selected  = false;
                        vm.selectedItemPaiement_fin_travaux_moe.$edit      = false;
                        vm.selectedItemPaiement_fin_travaux_moe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_fin_travaux_moe = vm.allpaiement_fin_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_fin_travaux_moe.id;
                      });
                      vm.showbuttonNouvPaiement_fin_travaux_moe = true;
                    }
                }
                else
                { 
                  paiement_fin_travaux_moe.validation = 0;
                  paiement_fin_travaux_moe.id  =   String(data.response);              
                  NouvelItemPaiement_fin_travaux_moe = false;

                  vm.showbuttonNouvPaiement_fin_travaux_moe = false;
            }
              paiement_fin_travaux_moe.$selected = false;
              paiement_fin_travaux_moe.$edit = false;
              vm.selectedItemPaiement_fin_travaux_moe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_fin_travaux_moe= function()
        {
              validation_in_basepaiement_fin_travaux_moe(vm.selectedItemPaiement_fin_travaux_moe,0);
        }
        function validation_in_basepaiement_fin_travaux_moe(paiement_fin_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_fin_travaux_moe ==false)
            {
                getId = vm.selectedItemPaiement_fin_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_fin_travaux_moe.montant_paiement,
                    observation: paiement_fin_travaux_moe.observation,
                    date_paiement: convertionDate(new Date(paiement_fin_travaux_moe.date_paiement)), 
                    id_demande_fin_travaux: vm.selectedItemDemande_fin_travaux_moe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_fin_travaux_moe/index",datas, config).success(function (data)
            { 
              paiement_fin_travaux_moe.validation = 1;
              vm.validation_paiement_fin_travaux_moe = 1;
              paiement_fin_travaux_moe.$selected = false;
              paiement_fin_travaux_moe.$edit = false;
              vm.selectedItemPaiement_fin_travaux_moe = {};

              vm.showbuttonValidationPaiement_fin_travaux_moe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/

/**********************************debut passation_marches****************************************/
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
            console.log(vm.selectedItemPassation_marches);
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
        /*{titre:"Date prévisionnelle"
        },
        {titre:"Date réel"
        },
        {titre:"Délai éxecution"
        },*/
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
              //date_prev_deb_trav:'',
              //date_reel_deb_trav:'',
             // delai_execution:0,
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
            //item.date_prev_deb_trav = currentItemContrat_prestataire.date_prev_deb_trav ;            
            //item.date_reel_deb_trav = currentItemContrat_prestataire.date_reel_deb_trav ;            
            //item.delai_execution = currentItemContrat_prestataire.delai_execution ;
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
            vm.showbuttonValidationcontrat_prestataire = true;
            vm.validation_contrat_prestataire = item.validation;
              switch (vm.session)
              {
                case 'OBCAF':
                            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',item.id).then(function(result)
                            {
                                vm.alldelai_travaux = result.data.response.filter(function(obj)
                                {
                                    return obj.validation == 0;
                                });

                                if (result.data.response.length!=0)
                                {
                                  vm.showbuttonNouvdelai_travaux=false;
                                }
                            });

                            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',item.id).then(function(result)
                            {
                                vm.allreception_mpe = result.data.response.filter(function(obj)
                                {
                                    return obj.validation == 0;
                                });

                                if (result.data.response.length!=0)
                                {
                                  vm.showbuttonNouvReception_mpe=false;
                                }
                            });
                            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeinvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.alldemande_batiment_mpe = result.data.response;
                              vm.showbuttonNouvDemande_batiment_mpe_creer = true;
                            });

                            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeinvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.alldemande_latrine_mpe = result.data.response;
                              vm.showbuttonNouvDemande_latrine_mpe_creer = true;
                            });

                            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeinvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.alldemande_mobilier_mpe = result.data.response;
                              vm.showbuttonNouvDemande_mobilier_mpe_creer = true;
                            });                                                      
                    break;

               case 'BCAF':
                          apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.alldelai_travaux = result.data.response;
                              vm.showbuttonNouvdelai_travaux=false;
                              
                          });
                          apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.allreception_mpe = result.data.response;
                              vm.showbuttonNouvReception_mpe=false;
                              
                          });
                          apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.alldemande_batiment_mpe = result.data.response;
                              vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                            });
                          apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.alldemande_latrine_mpe = result.data.response;
                              vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                            });

                          apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.alldemande_mobilier_mpe = result.data.response;
                              vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                            });
                     
                    break;
                case 'ODAAF':
                     
                    break;
                
                case 'DAAF': 
                            apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                            {
                                vm.alldelai_travaux = result.data.response;
                                vm.showbuttonNouvdelai_travaux=false;
                                
                            });
                            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpevalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                            {
                                vm.allreception_mpe = result.data.response;
                                vm.showbuttonNouvReception_mpe=false;
                                
                            });
                            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandevalideBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_batiment_mpe = result.data.response;
                              vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                            });
                            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandevalideBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_latrine_mpe = result.data.response;
                              vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                            });

                            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandevalideBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_mobilier_mpe = result.data.response;
                              vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                            });
                    break;
                case 'ODPFI':    
                    
                    break;

                case 'DPFI':
                          apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.alldelai_travaux = result.data.response;
                              vm.showbuttonNouvdelai_travaux=false;
                              
                          });
                          apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpevalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                            {
                                vm.allreception_mpe = result.data.response;
                                vm.showbuttonNouvReception_mpe=false;
                                
                            });
                          apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_batiment_mpe = result.data.response;
                              vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                            });
                           apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_latrine_mpe = result.data.response;
                              vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                            });
                            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_mobilier_mpe = result.data.response;
                              vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                            });

                     
                    break;

                case 'ADMIN':
                          apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.alldelai_travaux = result.data.response;

                              if (result.data.response.length!=0)
                              {
                                vm.showbuttonNouvdelai_travaux=false;
                              }
                          });
                          apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpeBycontrat','id_contrat_prestataire',item.id).then(function(result)
                          {
                              vm.allreception_mpe = result.data.response;

                              if (result.data.response.length!=0)
                              {
                                vm.showbuttonNouvReception_mpe=false;
                              }
                          });
                          apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                        {
                          vm.alldemande_batiment_mpe = result.data.response;
                          vm.showbuttonNouvDemande_batiment_mpe_creer = true;
                        });
                          apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                        {
                          vm.alldemande_latrine_mpe = result.data.response;
                          vm.showbuttonNouvDemande_latrine_mpe_creer = true;
                        });
                          apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                        {
                          vm.alldemande_mobilier_mpe = result.data.response;
                          vm.showbuttonNouvDemande_mobilier_mpe_creer = true;
                        });
                    
                     
                    break;

                case 'UFP':                      
                        apiFactory.getAPIgeneraliserREST("delai_travaux/index",'menu','getdelai_travauxvalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                        {
                            vm.alldelai_travaux = result.data.response;
                            vm.showbuttonNouvdelai_travaux=false;
                            
                        });
                        apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreception_mpevalideBycontrat','id_contrat_prestataire',item.id).then(function(result)
                        {
                                vm.allreception_mpe = result.data.response;
                                vm.showbuttonNouvReception_mpe=false;
                                
                        });
                         apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandevalideBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                        {
                          vm.alldemande_batiment_mpe = result.data.response;
                          vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                        });
                         apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandevalideBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                        {
                          vm.alldemande_latrine_mpe = result.data.response;
                          vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                        });
                         apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandevalideBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                        {
                          vm.alldemande_mobilier_mpe = result.data.response;
                          vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                        });
                                          
                    break;
                default:
                    break;
            
              }
              
           }
           vm.stepsuiviexecution = true;  
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
                    //|| (pass[0].date_prev_deb_trav != currentItemContrat_prestataire.date_prev_deb_trav )
                    //|| (pass[0].date_reel_deb_trav != currentItemContrat_prestataire.date_reel_deb_trav )
                    //|| (pass[0].delai_execution != currentItemContrat_prestataire.delai_execution )
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
                    //date_prev_deb_trav:convertionDate(new Date(contrat_prestataire.date_prev_deb_trav)),
                    //date_reel_deb_trav:convertionDate(new Date(contrat_prestataire.date_reel_deb_trav)),
                    //delai_execution:contrat_prestataire.delai_execution,
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
          maj_in_baseContrat_prestataire(vm.selectedItemContrat_prestataire,0);
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
                    date_signature:convertionDate(new Date(contrat_prestataire.date_signature)),
                    //date_prev_deb_trav:convertionDate(new Date(contrat_prestataire.date_prev_deb_trav)),
                    //date_reel_deb_trav:convertionDate(new Date(contrat_prestataire.date_reel_deb_trav)),
                    //delai_execution:contrat_prestataire.delai_execution,
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
/**********************************fin contrat_prestataire****************************************/

/**********************************debut contrat prestataire****************************************/

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

               case 'BCAF':
                          apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                          {
                              vm.allphase_sous_projet = result.data.response;
                              vm.showbuttonNouvPhase_sous_projet=false;
                                
                          });
                     
                    break;
                case 'ODAAF':
                     
                    break;
                
                case 'DAAF': 
                            apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetvalideBydelai','id_delai_travaux',item.id).then(function(result)
                          {
                              vm.allphase_sous_projet = result.data.response;
                              vm.showbuttonNouvPhase_sous_projet=false;
                                
                          });
                    break;
                case 'ODPFI':    
                    
                    break;

                case 'DPFI':
                           apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetvalideBydelai','id_delai_travaux',item.id).then(function(result)
                          {
                              vm.allphase_sous_projet = result.data.response;
                              vm.showbuttonNouvPhase_sous_projet=false;
                                
                          });
                     
                    break;

                case 'ADMIN':
                         apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetBydelai','id_delai_travaux',item.id).then(function(result)
                            {
                                vm.allphase_sous_projet = result.data.response;

                                vm.showbuttonNouvPhase_sous_projet=true;
                                console.log(result.data.response);
                                vm.stepphase = true;
                            }); 
                    
                     
                    break;

                case 'UFP':                      
                        apiFactory.getAPIgeneraliserREST("phase_sous_projet/index",'menu','getphasesousprojetvalideBydelai','id_delai_travaux',item.id).then(function(result)
                          {
                              vm.allphase_sous_projet = result.data.response;
                              vm.showbuttonNouvPhase_sous_projet=false;
                                
                          });
                                          
                    break;
                default:
                    break;
            
              }
              
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
              vm.validation_delai_travaux = 0;    
              vm.showbuttonValidationdelai_travaux = false;
              delai_travaux.$selected = false;
              delai_travaux.$edit = false;
              vm.selectedItemDelai_travaux = {};
            
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
        //Masque de saisi ajout
       /* vm.ajouterPhase_sous_projet = function ()
        { 
          if (NouvelItemPhase_sous_projet == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_etape_sousprojet: '',
              description: ''
            };       
            vm.allphase_sous_projet.push(items);             
            vm.allphase_sous_projet.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPhase_sous_projet = items;
              }
            });
            NouvelItemPhase_sous_projet = true ;
          }else
          {
            vm.showAlert('Ajout phase_sous_projet','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };*/

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
            console.log(vm.selectedItemReception_mpe);
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
                    date_previ_recep_tech    : convertionDate(new Date(reception_mpe.date_previ_recep_tech )),
                    date_reel_tech           : convertionDate(new Date(reception_mpe.date_reel_tech )),
                    date_leve_recep_tech     : convertionDate(new Date(reception_mpe.date_leve_recep_tech )),
                    date_previ_recep_prov    : convertionDate(new Date(reception_mpe.date_previ_recep_prov)),
                    date_reel_recep_prov     : convertionDate(new Date(reception_mpe.date_reel_recep_prov )), 
                    date_previ_leve          : convertionDate(new Date(reception_mpe.date_previ_leve )), 
                    date_reel_lev_ava_rd     : convertionDate(new Date(reception_mpe.date_reel_lev_ava_rd )),
                    date_previ_recep_defi    : convertionDate(new Date(reception_mpe.date_previ_recep_defi )),
                    date_reel_recep_defi     : convertionDate(new Date(reception_mpe.date_reel_recep_defi )),
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

/************************************************debut batiment_mpe*************************************************/
        vm.demande_batiment_mpe_column = [        
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_mpe/index").then(function(result)
        {
          vm.alltranche_demande_batiment_mpe= result.data.response;
          vm.allcurenttranche_demande_batiment_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });

        //Masque de saisi ajout

        vm.ajouterDemande_batiment_mpe = function ()
        { 
          var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',        
              objet: '',
              description: '',
              ref_facture: '',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              date: ''
            };

        if (vm.NouvelItemDemande_batiment_mpe == false)
          {               
                var last_id_demande_batiment_mpe = Math.max.apply(Math, vm.alldemande_batiment_mpe.map(function(o){return o.id;}));

                vm.dataLastedemande_batiment_mpe = vm.alldemande_batiment_mpe.filter(function(obj){return obj.id == last_id_demande_batiment_mpe;});

                if (vm.dataLastedemande_batiment_mpe.length>0)
                {   
                    var last_tranche_demande_batiment_mpe = Math.max.apply(Math, vm.dataLastedemande_batiment_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_batiment_mpe[0].validation))
                    {
                      case 3:     //rejeter DPFI

                          vm.allcurenttranche_demande_batiment_mpe = vm.alltranche_demande_batiment_mpe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_batiment_mpe);});
                          vm.alldemande_batiment_mpe.push(items);                          
                          vm.selectedItemDemande_batiment_mpe = items;
                          vm.NouvelItemDemande_batiment_mpe = true ;
                          vm.dataLastedemande_batiment_moe = [];
                           
                          break;

                      case 4: //Valider dpfi
                          
                          vm.allcurenttranche_demande_batiment_mpe = vm.alltranche_demande_batiment_mpe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_batiment_mpe)+1);});
                          vm.alldemande_batiment_mpe.push(items);                          
                          vm.selectedItemDemande_batiment_mpe = items;
                          vm.NouvelItemDemande_batiment_mpe = true ;
                          break;

                      default:

                          vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_batiment_mpe[0].validation);
                          vm.allcurenttranche_demande_batiment_mpe = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_demande_batiment_mpe = vm.alltranche_demande_batiment_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_batiment_mpe.push(items);                          
                    vm.selectedItemDemande_batiment_mpe = items;
                    vm.NouvelItemDemande_batiment_mpe = true ;
                    vm.dataLastedemande_batiment_mpe = [];
                }             
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_batiment_mpe(demande_batiment_mpe,suppression)
        {
            if (vm.NouvelItemDemande_batiment_mpe==false)
            {
                test_existanceDemande_batiment_mpe (demande_batiment_mpe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_batiment_mpe(demande_batiment_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerDemande_batiment_mpe = function(item)
        {
          if (vm.NouvelItemDemande_batiment_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_batiment_mpe.id_contrat_prestataire ;
            item.objet   = currentItemDemande_batiment_mpe.objet ;
            item.description   = currentItemDemande_batiment_mpe.description ;
            item.ref_facture   = currentItemDemande_batiment_mpe.ref_facture ;
            item.id_tranche_demande_mpe = currentItemDemande_batiment_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_batiment_mpe.montant ;
            item.cumul = currentItemDemande_batiment_mpe.cumul ;
            item.anterieur = currentItemDemande_batiment_mpe.anterieur;
            item.periode = currentItemDemande_batiment_mpe.periode ;
            item.pourcentage = currentItemDemande_batiment_mpe.pourcentage ;
            item.reste = currentItemDemande_batiment_mpe.reste;
            item.date  = currentItemDemande_batiment_mpe.date;
          }else
          {
            vm.alldemande_batiment_mpe = vm.alldemande_batiment_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_mpe.id;
            });
          }

          vm.selectedItemDemande_batiment_mpe = {} ;
          vm.NouvelItemDemande_batiment_mpe      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           // vm.vm.NouvelItemDemande_batiment_mpe   = item;
            currentItemDemande_batiment_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_mpe));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_batiment_mpe.id).then(function(result)
            {
                vm.alljustificatif_batiment_pre = result.data.response;
                console.log(vm.alljustificatif_batiment_pre);
            });
            switch (vm.session)
            {
              case 'OBCAF':
                        apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'menu','getpaiementinvalideBydemande','id_demande_batiment_pre',item.id).then(function(result)
                          {
                              vm.allpaiement_batiment_mpe = result.data.response;
                              if (vm.allpaiement_batiment_mpe.length>0)
                              {
                                vm.showbuttonNouvPaiement_batiment_mpe= false;
                              }
                              
                          });
                                        
                  break;

             case 'BCAF':
                        apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'menu','getpaiementBydemande','id_demande_batiment_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_batiment_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_batiment_mpe= false;
                      });
                      vm.showbuttonValidationDemande_batiment_mpe_creer = true;
                      vm.showbuttonValidationPaiement_batiment_mpe = true;
                   
                  break;
              case 'ODAAF':
                   
                   
                  break;
              
              case 'DAAF': 
                      apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_batiment_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_batiment_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_batiment_mpe= false;
                      });   
                  break;
              case 'ODPFI': 
                          
                  
                  break;

              case 'DPFI':
                        apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_batiment_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_batiment_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_batiment_mpe= false;
                      });

                      vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = true;
                      vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = true;
                      vm.showbuttonValidationDemande_batiment_mpe_validedpfi = true;                  
                  break;

              case 'ADMIN':
                        apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'menu','getpaiementBydemande','id_demande_batiment_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_batiment_mpe = result.data.response;
                          if (vm.allpaiement_batiment_mpe.length>0)
                          {
                            vm.showbuttonNouvPaiement_batiment_mpe= false;
                          }
                          vm.showbuttonValidationDemande_batiment_mpe_creer = true;
                          vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = true;
                          vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = true;
                          vm.showbuttonValidationDemande_batiment_mpe_validedpfi = true;                      
                          vm.showbuttonValidationPaiement_batiment_mpe = true;
                      });                   
                  break;

              case 'UFP':
                      apiFactory.getAPIgeneraliserREST("paiement_batiment_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_batiment_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_batiment_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_batiment_mpe= false;
                      });                                       
                  break;
              default:
                  break;          
            }

           }
            vm.validation_demande_batiment_mpe = item.validation;
            vm.stepjusti_bat_mpe = true;   
        };
        $scope.$watch('vm.selectedItemDemande_batiment_mpe', function()
        {
             if (!vm.alldemande_batiment_mpe) return;
             vm.alldemande_batiment_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_batiment_mpe = function(item)
        {
            vm.NouvelItemDemande_batiment_mpe = false ;
            vm.selectedItemDemande_batiment_mpe = item;
            currentItemDemande_batiment_mpe = angular.copy(vm.selectedItemDemande_batiment_mpe);
            $scope.vm.alldemande_batiment_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            apiFactory.getAPIgeneraliserREST("batiment_construction/index",'menu','getbatimentByContrat_prestataire','id_contrat_prestataire',item.contrat_prestataire.id).then(function(result)
            {
                vm.allbatiment_construction = result.data.response;
                console.log(vm.allbatiment_construction);
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemDemande_batiment_mpe.contrat_prestataire.id ;
            item.objet   = vm.selectedItemDemande_batiment_mpe.objet ;
            item.description   = vm.selectedItemDemande_batiment_mpe.description ;
            item.ref_facture   = vm.selectedItemDemande_batiment_mpe.ref_facture ;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_batiment_mpe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_batiment_mpe.montant);
            item.cumul = vm.selectedItemDemande_batiment_mpe.cumul ;
            item.anterieur = vm.selectedItemDemande_batiment_mpe.anterieur ;
            item.periode = vm.selectedItemDemande_batiment_mpe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_batiment_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_batiment_mpe.reste ;
            item.date   =new Date(vm.selectedItemDemande_batiment_mpe.date) ;
            vm.showbuttonValidationDemande_batiment_mpe_creer = false;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerDemande_batiment_mpe = function()
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
                vm.ajoutDemande_batiment_mpe(vm.selectedItemDemande_batiment_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_batiment_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_batiment_mpe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_batiment_mpe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_batiment_mpe.objet )
                    || (pass[0].description   != currentItemDemande_batiment_mpe.description )
                    || (pass[0].id_tranche_demande_mpe != currentItemDemande_batiment_mpe.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_batiment_mpe.montant )
                    || (pass[0].cumul != currentItemDemande_batiment_mpe.cumul )
                    || (pass[0].anterieur != currentItemDemande_batiment_mpe.anterieur )
                    || (pass[0].reste != currentItemDemande_batiment_mpe.reste )
                    || (pass[0].date   != currentItemDemande_batiment_mpe.date )
                    || (pass[0].ref_facture   != currentItemDemande_batiment_mpe.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_batiment_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_batiment_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_mpe
        function insert_in_baseDemande_batiment_mpe(demande_batiment_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_batiment_mpe==false)
            {
                getId = vm.selectedItemDemande_batiment_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_batiment_mpe.objet,
                    description:demande_batiment_mpe.description,
                    ref_facture:demande_batiment_mpe.ref_facture,
                    id_tranche_demande_mpe: demande_batiment_mpe.id_tranche_demande_mpe ,
                    montant: demande_batiment_mpe.montant,
                    cumul: demande_batiment_mpe.cumul ,
                    anterieur: demande_batiment_mpe.anterieur ,
                    reste: demande_batiment_mpe.reste ,
                    date: convertionDate(new Date(demande_batiment_mpe.date)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_prestataire/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_batiment_mpe.filter(function(obj)
                {
                    return obj.id == demande_batiment_mpe.id_tranche_demande_mpe;
                });

                if (vm.NouvelItemDemande_batiment_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        
                        vm.selectedItemDemande_batiment_mpe.tranche = tran[0] ;
                        vm.selectedItemDemande_batiment_mpe.periode = tran[0].periode ;
                        vm.selectedItemDemande_batiment_mpe.pourcentage = tran[0].pourcentage ;
                        /*vm.selectedItemDemande_batiment_mpe.reste = demande_batiment_mpe.reste ;
                        vm.selectedItemDemande_batiment_mpe.date   = demande_batiment_mpe.date ;*/
                        
                        vm.selectedItemDemande_batiment_mpe.$selected  = false;
                        vm.selectedItemDemande_batiment_mpe.$edit      = false;
                        vm.selectedItemDemande_batiment_mpe ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_batiment_mpe = vm.alldemande_batiment_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_mpe.id;
                      });
                    }
                    
                }
                else
                {
                  demande_batiment_mpe.tranche = tran[0] ;
                  demande_batiment_mpe.periode = tran[0].periode ;
                  demande_batiment_mpe.pourcentage = tran[0].pourcentage ;

                  demande_batiment_mpe.id  =   String(data.response);              
                  vm.NouvelItemDemande_batiment_mpe=false;
            }
              vm.showboutonValider = false;

              demande_batiment_mpe.$selected = false;
              demande_batiment_mpe.$edit = false;
              vm.selectedItemDemande_batiment_mpe = {};
              vm.showbuttonNouvDemande_batiment_mpe_creer = false;
            vm.showbuttonValidationDemande_batiment_mpe_creer = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_batiment_mpe = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;

          var montant = ((vm.selectedItemContrat_prestataire.cout_batiment) * vm.allcurenttranche_demande_batiment_mpe[0].pourcentage)/100;
          var cumul = montant;

          var demande_ancien = vm.alldemande_batiment_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_batiment_mpe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_batiment_mpe[0].cumul);
          }

          reste= (vm.selectedItemContrat_prestataire.cout_batiment) - cumul;

          item.periode = vm.allcurenttranche_demande_batiment_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_batiment_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }

      vm.validerDemande_batiment_mpe_creer = function()
        {
          maj_in_baseDemande_batiment_mpe(vm.selectedItemDemande_batiment_mpe,0,1);
        }
        vm.validerDemande_batiment_mpe_encourdpfi = function()
        {
          maj_in_baseDemande_batiment_mpe(vm.selectedItemDemande_batiment_mpe,0,2);
        }
        vm.validerDemande_batiment_mpe_rejedpfi = function()
        {
          maj_in_baseDemande_batiment_mpe(vm.selectedItemDemande_batiment_mpe,0,3);
        }
        vm.validerDemande_batiment_mpe_validedpfi = function()
        {
          maj_in_baseDemande_batiment_mpe(vm.selectedItemDemande_batiment_mpe,0,4);
        }

      function maj_in_baseDemande_batiment_mpe(demande_batiment_mpe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_mpe.id,
                    objet: demande_batiment_mpe.objet,
                    description:demande_batiment_mpe.description,
                    ref_facture:demande_batiment_mpe.ref_facture,
                    id_tranche_demande_mpe: demande_batiment_mpe.tranche.id ,
                    montant: demande_batiment_mpe.montant,
                    cumul: demande_batiment_mpe.cumul ,
                    anterieur: demande_batiment_mpe.anterieur ,
                    reste: demande_batiment_mpe.reste ,
                    date: convertionDate(new Date(demande_batiment_mpe.date)),
                    id_contrat_prestataire: demande_batiment_mpe.id_contrat_prestataire,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_prestataire/index",datas, config).success(function (data)
            {                               
                demande_batiment_mpe.validation = validation; 
              vm.validation_demande_batiment_mpe = validation;
 
              demande_batiment_mpe.$selected = false;
              demande_batiment_mpe.$edit = false;
              vm.selectedItemDemande_batiment_mpe = {};

              vm.showbuttonValidationDemande_batiment_mpe_creer = false;
              vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = false;
              vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = false;
              vm.showbuttonValidationDemande_batiment_mpe_validedpfi = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/************************************************fin batiment_mpe***************************************************/
/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFilebatiment_mpe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_batiment_mpe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_batiment_mpe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_batiment_mpe = function ()
        { 
          if (NouvelItemJustificatif_batiment_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_batiment_mpe.push(items);
            vm.alljustificatif_batiment_mpe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_batiment_mpe = mem;
              }
            });

            NouvelItemJustificatif_batiment_mpe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_batiment_mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_batiment_mpe(justificatif_batiment_mpe,suppression)
        {
            if (NouvelItemJustificatif_batiment_mpe==false)
            {
                test_existanceJustificatif_batiment_mpe (justificatif_batiment_mpe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_batiment_mpe(justificatif_batiment_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_batiment_mpe
        vm.annulerJustificatif_batiment_mpe = function(item)
        {
          if (NouvelItemJustificatif_batiment_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_batiment_mpe.description ;
            item.fichier   = currentItemJustificatif_batiment_mpe.fichier ;
          }else
          {
            vm.alljustificatif_batiment_mpe = vm.alljustificatif_batiment_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_batiment_mpe.id;
            });
          }

          vm.selectedItemJustificatif_batiment_mpe = {} ;
          NouvelItemJustificatif_batiment_mpe      = false;
          
        };

        //fonction selection item justificatif batiment_mpe
        vm.selectionJustificatif_batiment_mpe= function (item)
        {
            vm.selectedItemJustificatif_batiment_mpe = item;
            vm.nouvelItemJustificatif_batiment_mpe   = item;
            currentItemJustificatif_batiment_mpe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_batiment_mpe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_batiment_mpe', function()
        {
             if (!vm.alljustificatif_batiment_mpe) return;
             vm.alljustificatif_batiment_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_batiment_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_batiment_mpe = function(item)
        {
            NouvelItemJustificatif_batiment_mpe = false ;
            vm.selectedItemJustificatif_batiment_mpe = item;
            currentItemJustificatif_batiment_mpe = angular.copy(vm.selectedItemJustificatif_batiment_mpe);
            $scope.vm.alljustificatif_batiment_mpe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_batiment_mpe.description ;
            item.fichier   = vm.selectedItemJustificatif_batiment_mpe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_batiment_mpe
        vm.supprimerJustificatif_batiment_mpe = function()
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
                vm.ajoutJustificatif_batiment_mpe(vm.selectedItemJustificatif_batiment_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_batiment_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_batiment_mpe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_batiment_mpe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_batiment_mpe.description )
                    ||(just[0].fichier   != currentItemJustificatif_batiment_mpe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_batiment_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_batiment_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_batiment_mpe
        function insert_in_baseJustificatif_batiment_mpe(justificatif_batiment_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_batiment_mpe==false)
            {
                getId = vm.selectedItemJustificatif_batiment_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_batiment_mpe.description,
                    fichier: justificatif_batiment_mpe.fichier,
                    id_demande_pay_pre: vm.selectedItemDemande_batiment_mpe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_batiment_mpe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_batiment_mpe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_batiment_mpe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_batiment_mpe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_batiment_mpe.description,
                                                      fichier: justificatif_batiment_mpe.fichier,
                                                      id_demande_pay_pre: vm.selectedItemDemande_batiment_mpe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_batiment_mpe.$selected = false;
                                          justificatif_batiment_mpe.$edit = false;
                                          vm.selectedItemJustificatif_batiment_mpe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_batiment_mpe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_batiment_mpe.description,
                                        fichier: justificatif_batiment_mpe.fichier,
                                        id_demande_pay_pre: vm.selectedItemDemande_batiment_mpe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_batiment_mpe.$selected = false;
                                      justificatif_batiment_mpe.$edit = false;
                                      vm.selectedItemJustificatif_batiment_mpe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_batiment_mpe.$selected  = false;
                        vm.selectedItemJustificatif_batiment_mpe.$edit      = false;
                        vm.selectedItemJustificatif_batiment_mpe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_batiment_mpe = vm.alljustificatif_batiment_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_batiment_mpe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_batiment_mpe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_batiment_mpe.id  =   String(data.response);              
                  NouvelItemJustificatif_batiment_mpe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_batiment_mpe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_batiment_mpe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_batiment_mpe.description,
                                                fichier: justificatif_batiment_mpe.fichier,
                                                id_demande_pay_pre: vm.selectedItemDemande_batiment_mpe.id,
                                                
                                  });
                                apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                                { 
                                    justificatif_batiment_mpe.$selected = false;
                                    justificatif_batiment_mpe.$edit = false;
                                    vm.selectedItemJustificatif_batiment_mpe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_batiment_mpe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_batiment_mpe.description,
                                  fichier: justificatif_batiment_mpe.fichier,
                                  id_demande_pay_pre: vm.selectedItemDemande_batiment_mpe.id,
                                               
                              });
                            apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_batiment_mpe.$selected = false;
                                justificatif_batiment_mpe.$edit = false;
                                vm.selectedItemJustificatif_batiment_mpe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_batiment_mpe.$selected = false;
              justificatif_batiment_mpe.$edit = false;
              vm.selectedItemJustificatif_batiment_mpe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif batiment_mpe**********************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_batiment_mpe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_batiment_mpe = function ()
        { 
          if (NouvelItemPaiement_batiment_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_batiment_mpe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_batiment_mpe.push(items);
            vm.allpaiement_batiment_mpe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_batiment_mpe = conv;
              }
            });

            NouvelItemPaiement_batiment_mpe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_batiment_mpe(paiement_batiment_mpe,suppression)
        {
            if (NouvelItemPaiement_batiment_mpe==false)
            {
                test_existancePaiement_batiment_mpe (paiement_batiment_mpe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_batiment_mpe(paiement_batiment_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_batiment_mpe
        vm.annulerPaiement_batiment_mpe = function(item)
        {
          if (NouvelItemPaiement_batiment_mpe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_batiment_mpe.montant_paiement;
              item.observation    = currentItemPaiement_batiment_mpe.observation;
              item.date_paiement = currentItemPaiement_batiment_mpe.date_paiement; 
          }else
          {
            vm.allpaiement_batiment_mpe = vm.allpaiement_batiment_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_batiment_mpe.id;
            });
          }

          vm.selectedItemPaiement_batiment_mpe = {} ;
          NouvelItemPaiement_batiment_mpe      = false;
          
        };

        //fonction selection item paiement_batiment_mpe convention cisco/feffi
        vm.selectionPaiement_batiment_mpe = function (item)
        {
            vm.selectedItemPaiement_batiment_mpe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_batiment_mpe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_batiment_mpe));
              vm.showbuttonValidationPaiement_batiment_mpe = true;
            }
            vm.validation_paiement_batiment_mpe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_batiment_mpe', function()
        {
             if (!vm.allpaiement_batiment_mpe) return;
             vm.allpaiement_batiment_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_batiment_mpe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_batiment_mpe = function(item)
        {
            NouvelItemPaiement_batiment_mpe = false ;
            vm.selectedItemPaiement_batiment_mpe = item;
            currentItemPaiement_batiment_mpe = angular.copy(vm.selectedItemPaiement_batiment_mpe);
            $scope.vm.allpaiement_batiment_mpe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_batiment_mpe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_batiment_mpe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_batiment_mpe.date_paiement);
        };

        //fonction bouton suppression item paiement_batiment_mpe convention cisco feffi
        vm.supprimerPaiement_batiment_mpe = function()
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
                vm.ajoutPaiement_batiment_mpe(vm.selectedItemPaiement_batiment_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_batiment_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_batiment_mpe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_batiment_mpe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_batiment_mpe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_batiment_mpe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_batiment_mpe.montant_paiement))                    
                      {
                          insert_in_basePaiement_batiment_mpe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_batiment_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_batiment_mpe(paiement_batiment_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_mpe ==false)
            {
                getId = vm.selectedItemPaiement_batiment_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_batiment_mpe.montant_paiement,
                    observation: paiement_batiment_mpe.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_mpe.date_paiement)), 
                    id_demande_batiment_pre: vm.selectedItemDemande_batiment_mpe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_batiment_mpe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_batiment_mpe.$selected  = false;
                        vm.selectedItemPaiement_batiment_mpe.$edit      = false;
                        vm.selectedItemPaiement_batiment_mpe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_batiment_mpe = vm.allpaiement_batiment_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_batiment_mpe.id;
                      });
                      vm.showbuttonNouvPaiement_batiment_mpe = true;
                    }
                }
                else
                { 
                  paiement_batiment_mpe.validation = 0;
                  paiement_batiment_mpe.id  =   String(data.response);              
                  NouvelItemPaiement_batiment_mpe = false;

                  vm.showbuttonNouvPaiement_batiment_mpe = false;
            }
              paiement_batiment_mpe.$selected = false;
              paiement_batiment_mpe.$edit = false;
              vm.selectedItemPaiement_batiment_mpe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_batiment_mpe= function()
        {
              validation_in_basepaiement_batiment_mpe(vm.selectedItemPaiement_batiment_mpe,0);
        }
        function validation_in_basepaiement_batiment_mpe(paiement_batiment_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_batiment_mpe ==false)
            {
                getId = vm.selectedItemPaiement_batiment_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_batiment_mpe.montant_paiement,
                    observation: paiement_batiment_mpe.observation,
                    date_paiement: convertionDate(new Date(paiement_batiment_mpe.date_paiement)), 
                    id_demande_batiment_pre: vm.selectedItemDemande_batiment_mpe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_batiment_prestataire/index",datas, config).success(function (data)
            { 
              paiement_batiment_mpe.validation = 1;
              vm.validation_paiement_batiment_mpe = 1;
              paiement_batiment_mpe.$selected = false;
              paiement_batiment_mpe.$edit = false;
              vm.selectedItemPaiement_batiment_mpe = {};

              vm.showbuttonValidationPaiement_batiment_mpe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement****************************************/


/************************************************debut latrine_mpe*************************************************/
        vm.demande_latrine_mpe_column = [
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_latrine_mpe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_mpe= result.data.response;
          vm.allcurenttranche_demande_latrine_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });

        //Masque de saisi ajout

        vm.ajouterDemande_latrine_mpe = function ()
        { 
          var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',        
              objet: '',
              description: '',
              ref_facture: '',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              date: ''
            };

        if (vm.NouvelItemDemande_latrine_mpe == false)
          {               
                var last_id_demande_latrine_mpe = Math.max.apply(Math, vm.alldemande_latrine_mpe.map(function(o){return o.id;}));

                vm.dataLastedemande_latrine_mpe = vm.alldemande_latrine_mpe.filter(function(obj){return obj.id == last_id_demande_latrine_mpe;});

                if (vm.dataLastedemande_latrine_mpe.length>0)
                {   
                    var last_tranche_demande_latrine_mpe = Math.max.apply(Math, vm.dataLastedemande_latrine_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_latrine_mpe[0].validation))
                    {
                      case 3:     //rejeter DPFI

                          vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_latrine_mpe);});
                          vm.alldemande_latrine_mpe.push(items);                          
                          vm.selectedItemDemande_latrine_mpe = items;
                          vm.NouvelItemDemande_latrine_mpe = true ;
                          vm.dataLastedemande_latrine_moe = [];
                           
                          break;

                      case 4: //Valider dpfi
                          
                          vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_latrine_mpe)+1);});
                          vm.alldemande_latrine_mpe.push(items);                          
                          vm.selectedItemDemande_latrine_mpe = items;
                          vm.NouvelItemDemande_latrine_mpe = true ;
                          break;

                      default:

                          vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_latrine_mpe[0].validation);
                          vm.allcurenttranche_demande_latrine_mpe = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_latrine_mpe.push(items);                          
                    vm.selectedItemDemande_latrine_mpe = items;
                    vm.NouvelItemDemande_latrine_mpe = true ;
                    vm.dataLastedemande_latrine_mpe = [];
                }             
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_latrine_mpe(demande_latrine_mpe,suppression)
        {
            if (vm.NouvelItemDemande_latrine_mpe==false)
            {
                test_existanceDemande_latrine_mpe (demande_latrine_mpe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_latrine_mpe(demande_latrine_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_latrine_mpe
        vm.annulerDemande_latrine_mpe = function(item)
        {
          if (vm.NouvelItemDemande_latrine_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_latrine_mpe.id_contrat_prestataire ;
            item.objet   = currentItemDemande_latrine_mpe.objet ;
            item.description   = currentItemDemande_latrine_mpe.description ;
            item.ref_facture   = currentItemDemande_latrine_mpe.ref_facture ;
            item.id_tranche_demande_mpe = currentItemDemande_latrine_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_latrine_mpe.montant ;
            item.cumul = currentItemDemande_latrine_mpe.cumul ;
            item.anterieur = currentItemDemande_latrine_mpe.anterieur;
            item.periode = currentItemDemande_latrine_mpe.periode ;
            item.pourcentage = currentItemDemande_latrine_mpe.pourcentage ;
            item.reste = currentItemDemande_latrine_mpe.reste;
            item.date  = currentItemDemande_latrine_mpe.date;
          }else
          {
            vm.alldemande_latrine_mpe = vm.alldemande_latrine_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_latrine_mpe.id;
            });
          }

          vm.selectedItemDemande_latrine_mpe = {} ;
          vm.NouvelItemDemande_latrine_mpe      = false;
          
        };

        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item;
           // vm.vm.NouvelItemDemande_latrine_mpe   = item;
            currentItemDemande_latrine_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_mpe));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_latrine_pre/index",'id_demande_demande_pre',vm.selectedItemDemande_latrine_mpe.id).then(function(result)
            {
                vm.alljustificatif_latrine_pre = result.data.response;
                console.log(vm.alljustificatif_latrine_pre);
            });
            switch (vm.session)
            {
              case 'OBCAF':
                        apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'menu','getpaiementinvalideBydemande','id_demande_latrine_pre',item.id).then(function(result)
                          {
                              vm.allpaiement_latrine_mpe = result.data.response;
                              if (vm.allpaiement_latrine_mpe.length>0)
                              {
                                vm.showbuttonNouvPaiement_latrine_mpe= false;
                              }
                              
                          });
                                        
                  break;

             case 'BCAF':
                        apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'menu','getpaiementBydemande','id_demande_latrine_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_latrine_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_latrine_mpe= false;
                      });
                      vm.showbuttonValidationDemande_latrine_mpe_creer = true;
                      vm.showbuttonValidationPaiement_latrine_mpe = true;
                   
                  break;
              case 'ODAAF':
                   
                   
                  break;
              
              case 'DAAF': 
                      apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_latrine_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_latrine_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_latrine_mpe= false;
                      });   
                  break;
              case 'ODPFI': 
                          
                  
                  break;

              case 'DPFI':
                        apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_latrine_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_latrine_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_latrine_mpe= false;
                      });

                      vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = true;
                      vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = true;
                      vm.showbuttonValidationDemande_latrine_mpe_validedpfi = true;                  
                  break;

              case 'ADMIN':
                        apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'menu','getpaiementBydemande','id_demande_latrine_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_latrine_mpe = result.data.response;
                          if (vm.allpaiement_latrine_mpe.length>0)
                          {
                            vm.showbuttonNouvPaiement_latrine_mpe= false;
                          }
                          vm.showbuttonValidationDemande_latrine_mpe_creer = true;
                          vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = true;
                          vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = true;
                          vm.showbuttonValidationDemande_latrine_mpe_validedpfi = true;                      
                          vm.showbuttonValidationPaiement_latrine_mpe = true;
                      });                   
                  break;

              case 'UFP':
                      apiFactory.getAPIgeneraliserREST("paiement_latrine_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_latrine_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_latrine_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_latrine_mpe= false;
                      });                                       
                  break;
              default:
                  break;          
            }

           }
            vm.validation_demande_latrine_mpe = item.validation;
            vm.stepjusti_bat_mpe = true;   
        };
        $scope.$watch('vm.selectedItemDemande_latrine_mpe', function()
        {
             if (!vm.alldemande_latrine_mpe) return;
             vm.alldemande_latrine_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_latrine_mpe = function(item)
        {
            vm.NouvelItemDemande_latrine_mpe = false ;
            vm.selectedItemDemande_latrine_mpe = item;
            currentItemDemande_latrine_mpe = angular.copy(vm.selectedItemDemande_latrine_mpe);
            $scope.vm.alldemande_latrine_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            apiFactory.getAPIgeneraliserREST("latrine_construction/index",'menu','getlatrineByContrat_prestataire','id_contrat_prestataire',item.contrat_prestataire.id).then(function(result)
            {
                vm.alllatrine_construction = result.data.response;
                console.log(vm.alllatrine_construction);
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemDemande_latrine_mpe.contrat_prestataire.id ;
            item.objet   = vm.selectedItemDemande_latrine_mpe.objet ;
            item.description   = vm.selectedItemDemande_latrine_mpe.description ;
            item.ref_facture   = vm.selectedItemDemande_latrine_mpe.ref_facture ;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_latrine_mpe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_latrine_mpe.montant);
            item.cumul = vm.selectedItemDemande_latrine_mpe.cumul ;
            item.anterieur = vm.selectedItemDemande_latrine_mpe.anterieur ;
            item.periode = vm.selectedItemDemande_latrine_mpe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_latrine_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_latrine_mpe.reste ;
            item.date   =new Date(vm.selectedItemDemande_latrine_mpe.date) ;
            vm.showbuttonValidationDemande_latrine_mpe_creer = false;
        };

        //fonction bouton suppression item Demande_latrine_mpe
        vm.supprimerDemande_latrine_mpe = function()
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
                vm.ajoutDemande_latrine_mpe(vm.selectedItemDemande_latrine_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_latrine_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_latrine_mpe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_latrine_mpe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_latrine_mpe.objet )
                    || (pass[0].description   != currentItemDemande_latrine_mpe.description )
                    || (pass[0].id_tranche_demande_mpe != currentItemDemande_latrine_mpe.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_latrine_mpe.montant )
                    || (pass[0].cumul != currentItemDemande_latrine_mpe.cumul )
                    || (pass[0].anterieur != currentItemDemande_latrine_mpe.anterieur )
                    || (pass[0].reste != currentItemDemande_latrine_mpe.reste )
                    || (pass[0].date   != currentItemDemande_latrine_mpe.date )
                    || (pass[0].ref_facture   != currentItemDemande_latrine_mpe.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_latrine_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_latrine_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_latrine_mpe
        function insert_in_baseDemande_latrine_mpe(demande_latrine_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_latrine_mpe==false)
            {
                getId = vm.selectedItemDemande_latrine_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_latrine_mpe.objet,
                    description:demande_latrine_mpe.description,
                    ref_facture:demande_latrine_mpe.ref_facture,
                    id_tranche_demande_mpe: demande_latrine_mpe.id_tranche_demande_mpe ,
                    montant: demande_latrine_mpe.montant,
                    cumul: demande_latrine_mpe.cumul ,
                    anterieur: demande_latrine_mpe.anterieur ,
                    reste: demande_latrine_mpe.reste ,
                    date: convertionDate(new Date(demande_latrine_mpe.date)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_prestataire/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_latrine_mpe.filter(function(obj)
                {
                    return obj.id == demande_latrine_mpe.id_tranche_demande_mpe;
                });

                if (vm.NouvelItemDemande_latrine_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        
                        vm.selectedItemDemande_latrine_mpe.tranche = tran[0] ;
                        vm.selectedItemDemande_latrine_mpe.periode = tran[0].periode ;
                        vm.selectedItemDemande_latrine_mpe.pourcentage = tran[0].pourcentage ;
                        /*vm.selectedItemDemande_latrine_mpe.reste = demande_latrine_mpe.reste ;
                        vm.selectedItemDemande_latrine_mpe.date   = demande_latrine_mpe.date ;*/
                        
                        vm.selectedItemDemande_latrine_mpe.$selected  = false;
                        vm.selectedItemDemande_latrine_mpe.$edit      = false;
                        vm.selectedItemDemande_latrine_mpe ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_latrine_mpe = vm.alldemande_latrine_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_latrine_mpe.id;
                      });
                    }
                    
                }
                else
                {
                  demande_latrine_mpe.tranche = tran[0] ;
                  demande_latrine_mpe.periode = tran[0].periode ;
                  demande_latrine_mpe.pourcentage = tran[0].pourcentage ;

                  demande_latrine_mpe.id  =   String(data.response);              
                  vm.NouvelItemDemande_latrine_mpe=false;
            }
              vm.showboutonValider = false;

              demande_latrine_mpe.$selected = false;
              demande_latrine_mpe.$edit = false;
              vm.selectedItemDemande_latrine_mpe = {};
              vm.showbuttonNouvDemande_latrine_mpe_creer = false;
            vm.showbuttonValidationDemande_latrine_mpe_creer = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_latrine_mpe = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;

          var montant = ((vm.selectedItemContrat_prestataire.cout_latrine) * vm.allcurenttranche_demande_latrine_mpe[0].pourcentage)/100;
          var cumul = montant;

          var demande_ancien = vm.alldemande_latrine_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_latrine_mpe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_latrine_mpe[0].cumul);
          }

          reste= (vm.selectedItemContrat_prestataire.cout_latrine) - cumul;

          item.periode = vm.allcurenttranche_demande_latrine_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_latrine_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }

      vm.validerDemande_latrine_mpe_creer = function()
        {
          maj_in_baseDemande_latrine_mpe(vm.selectedItemDemande_latrine_mpe,0,1);
        }
        vm.validerDemande_latrine_mpe_encourdpfi = function()
        {
          maj_in_baseDemande_latrine_mpe(vm.selectedItemDemande_latrine_mpe,0,2);
        }
        vm.validerDemande_latrine_mpe_rejedpfi = function()
        {
          maj_in_baseDemande_latrine_mpe(vm.selectedItemDemande_latrine_mpe,0,3);
        }
        vm.validerDemande_latrine_mpe_validedpfi = function()
        {
          maj_in_baseDemande_latrine_mpe(vm.selectedItemDemande_latrine_mpe,0,4);
        }

      function maj_in_baseDemande_latrine_mpe(demande_latrine_mpe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_latrine_mpe.id,
                    objet: demande_latrine_mpe.objet,
                    description:demande_latrine_mpe.description,
                    ref_facture:demande_latrine_mpe.ref_facture,
                    id_tranche_demande_mpe: demande_latrine_mpe.tranche.id ,
                    montant: demande_latrine_mpe.montant,
                    cumul: demande_latrine_mpe.cumul ,
                    anterieur: demande_latrine_mpe.anterieur ,
                    reste: demande_latrine_mpe.reste ,
                    date: convertionDate(new Date(demande_latrine_mpe.date)),
                    id_contrat_prestataire: demande_latrine_mpe.id_contrat_prestataire,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_prestataire/index",datas, config).success(function (data)
            {                                
               demande_latrine_mpe.validation = validation; 
              vm.validation_demande_latrine_mpe = validation;
 
              demande_latrine_mpe.$selected = false;
              demande_latrine_mpe.$edit = false;
              vm.selectedItemDemande_latrine_mpe = {};

              vm.showbuttonValidationDemande_latrine_mpe_creer = false;
              vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = false;
              vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = false;
              vm.showbuttonValidationDemande_latrine_mpe_validedpfi = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/************************************************fin latrine_mpe***************************************************/
/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_latrine_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFilelatrine_mpe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_latrine_mpe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_latrine_mpe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_latrine_mpe = function ()
        { 
          if (NouvelItemJustificatif_latrine_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_latrine_pre.push(items);
            vm.alljustificatif_latrine_pre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_latrine_mpe = mem;
              }
            });

            NouvelItemJustificatif_latrine_mpe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_latrine_mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_latrine_mpe(justificatif_latrine_mpe,suppression)
        {
            if (NouvelItemJustificatif_latrine_mpe==false)
            {
                test_existanceJustificatif_latrine_mpe (justificatif_latrine_mpe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_latrine_mpe(justificatif_latrine_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_latrine_mpe
        vm.annulerJustificatif_latrine_mpe = function(item)
        {
          if (NouvelItemJustificatif_latrine_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_latrine_mpe.description ;
            item.fichier   = currentItemJustificatif_latrine_mpe.fichier ;
          }else
          {
            vm.alljustificatif_latrine_pre = vm.alljustificatif_latrine_pre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_latrine_mpe.id;
            });
          }

          vm.selectedItemJustificatif_latrine_mpe = {} ;
          NouvelItemJustificatif_latrine_mpe      = false;
          
        };

        //fonction selection item justificatif latrine_mpe
        vm.selectionJustificatif_latrine_mpe= function (item)
        {
            vm.selectedItemJustificatif_latrine_mpe = item;
            vm.nouvelItemJustificatif_latrine_mpe   = item;
            currentItemJustificatif_latrine_mpe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_latrine_mpe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_latrine_mpe', function()
        {
             if (!vm.alljustificatif_latrine_pre) return;
             vm.alljustificatif_latrine_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_latrine_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_latrine_mpe = function(item)
        {
            NouvelItemJustificatif_latrine_mpe = false ;
            vm.selectedItemJustificatif_latrine_mpe = item;
            currentItemJustificatif_latrine_mpe = angular.copy(vm.selectedItemJustificatif_latrine_mpe);
            $scope.vm.alljustificatif_latrine_pre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_latrine_mpe.description ;
            item.fichier   = vm.selectedItemJustificatif_latrine_mpe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_latrine_mpe
        vm.supprimerJustificatif_latrine_mpe = function()
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
                vm.ajoutJustificatif_latrine_mpe(vm.selectedItemJustificatif_latrine_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_latrine_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_latrine_pre.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_latrine_mpe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_latrine_mpe.description )
                    ||(just[0].fichier   != currentItemJustificatif_latrine_mpe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_latrine_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_latrine_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_latrine_mpe
        function insert_in_baseJustificatif_latrine_mpe(justificatif_latrine_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_latrine_mpe==false)
            {
                getId = vm.selectedItemJustificatif_latrine_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_latrine_mpe.description,
                    fichier: justificatif_latrine_mpe.fichier,
                    id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_latrine_mpe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_latrine_mpe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_latrine_mpe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_latrine_mpe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_latrine_mpe.description,
                                                      fichier: justificatif_latrine_mpe.fichier,
                                                      id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_latrine_mpe.$selected = false;
                                          justificatif_latrine_mpe.$edit = false;
                                          vm.selectedItemJustificatif_latrine_mpe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_latrine_mpe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_latrine_mpe.description,
                                        fichier: justificatif_latrine_mpe.fichier,
                                        id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_latrine_mpe.$selected = false;
                                      justificatif_latrine_mpe.$edit = false;
                                      vm.selectedItemJustificatif_latrine_mpe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_latrine_mpe.$selected  = false;
                        vm.selectedItemJustificatif_latrine_mpe.$edit      = false;
                        vm.selectedItemJustificatif_latrine_mpe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_latrine_pre = vm.alljustificatif_latrine_pre.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_latrine_mpe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_latrine_mpe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_latrine_mpe.id  =   String(data.response);              
                  NouvelItemJustificatif_latrine_mpe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_latrine_mpe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_latrine_mpe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_latrine_mpe.description,
                                                fichier: justificatif_latrine_mpe.fichier,
                                                id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                                                
                                  });
                                apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
                                { 
                                    justificatif_latrine_mpe.$selected = false;
                                    justificatif_latrine_mpe.$edit = false;
                                    vm.selectedItemJustificatif_latrine_mpe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_latrine_mpe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_latrine_mpe.description,
                                  fichier: justificatif_latrine_mpe.fichier,
                                  id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                                               
                              });
                            apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_latrine_mpe.$selected = false;
                                justificatif_latrine_mpe.$edit = false;
                                vm.selectedItemJustificatif_latrine_mpe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_latrine_mpe.$selected = false;
              justificatif_latrine_mpe.$edit = false;
              vm.selectedItemJustificatif_latrine_mpe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif latrine_mpe**********************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_latrine_mpe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_latrine_mpe = function ()
        { 
          if (NouvelItemPaiement_latrine_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_latrine_mpe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_latrine_mpe.push(items);
            vm.allpaiement_latrine_mpe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_latrine_mpe = conv;
              }
            });

            NouvelItemPaiement_latrine_mpe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_latrine_mpe(paiement_latrine_mpe,suppression)
        {
            if (NouvelItemPaiement_latrine_mpe==false)
            {
                test_existancePaiement_latrine_mpe (paiement_latrine_mpe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_latrine_mpe(paiement_latrine_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_latrine_mpe
        vm.annulerPaiement_latrine_mpe = function(item)
        {
          if (NouvelItemPaiement_latrine_mpe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_latrine_mpe.montant_paiement;
              item.observation    = currentItemPaiement_latrine_mpe.observation;
              item.date_paiement = currentItemPaiement_latrine_mpe.date_paiement; 
          }else
          {
            vm.allpaiement_latrine_mpe = vm.allpaiement_latrine_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_latrine_mpe.id;
            });
          }

          vm.selectedItemPaiement_latrine_mpe = {} ;
          NouvelItemPaiement_latrine_mpe      = false;
          
        };

        //fonction selection item paiement_latrine_mpe convention cisco/feffi
        vm.selectionPaiement_latrine_mpe = function (item)
        {
            vm.selectedItemPaiement_latrine_mpe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_latrine_mpe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_latrine_mpe));
              vm.showbuttonValidationPaiement_latrine_mpe = true;
            }
            vm.validation_paiement_latrine_mpe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_latrine_mpe', function()
        {
             if (!vm.allpaiement_latrine_mpe) return;
             vm.allpaiement_latrine_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_latrine_mpe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_latrine_mpe = function(item)
        {
            NouvelItemPaiement_latrine_mpe = false ;
            vm.selectedItemPaiement_latrine_mpe = item;
            currentItemPaiement_latrine_mpe = angular.copy(vm.selectedItemPaiement_latrine_mpe);
            $scope.vm.allpaiement_latrine_mpe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_latrine_mpe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_latrine_mpe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_latrine_mpe.date_paiement);
        };

        //fonction bouton suppression item paiement_latrine_mpe convention cisco feffi
        vm.supprimerPaiement_latrine_mpe = function()
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
                vm.ajoutPaiement_latrine_mpe(vm.selectedItemPaiement_latrine_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_latrine_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_latrine_mpe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_latrine_mpe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_latrine_mpe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_latrine_mpe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_latrine_mpe.montant_paiement))                    
                      {
                          insert_in_basePaiement_latrine_mpe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_latrine_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_latrine_mpe(paiement_latrine_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_latrine_mpe ==false)
            {
                getId = vm.selectedItemPaiement_latrine_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_latrine_mpe.montant_paiement,
                    observation: paiement_latrine_mpe.observation,
                    date_paiement: convertionDate(new Date(paiement_latrine_mpe.date_paiement)), 
                    id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_latrine_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_latrine_mpe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_latrine_mpe.$selected  = false;
                        vm.selectedItemPaiement_latrine_mpe.$edit      = false;
                        vm.selectedItemPaiement_latrine_mpe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_latrine_mpe = vm.allpaiement_latrine_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_latrine_mpe.id;
                      });
                      vm.showbuttonNouvPaiement_latrine_mpe = true;
                    }
                }
                else
                { 
                  paiement_latrine_mpe.validation = 0;
                  paiement_latrine_mpe.id  =   String(data.response);              
                  NouvelItemPaiement_latrine_mpe = false;

                  vm.showbuttonNouvPaiement_latrine_mpe = false;
            }
              paiement_latrine_mpe.$selected = false;
              paiement_latrine_mpe.$edit = false;
              vm.selectedItemPaiement_latrine_mpe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_latrine_mpe= function()
        {
              validation_in_basepaiement_latrine_mpe(vm.selectedItemPaiement_latrine_mpe,0);
        }
        function validation_in_basepaiement_latrine_mpe(paiement_latrine_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_latrine_mpe ==false)
            {
                getId = vm.selectedItemPaiement_latrine_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_latrine_mpe.montant_paiement,
                    observation: paiement_latrine_mpe.observation,
                    date_paiement: convertionDate(new Date(paiement_latrine_mpe.date_paiement)), 
                    id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_latrine_prestataire/index",datas, config).success(function (data)
            { 
              paiement_latrine_mpe.validation = 1;
              vm.validation_paiement_latrine_mpe = 1;
              paiement_latrine_mpe.$selected = false;
              paiement_latrine_mpe.$edit = false;
              vm.selectedItemPaiement_latrine_mpe = {};

              vm.showbuttonValidationPaiement_latrine_mpe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


/**********************************fin paiement latrine****************************************/

/************************************************debut mobilier_mpe*************************************************/
        vm.demande_mobilier_mpe_column = [
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_mobilier_mpe/index").then(function(result)
        {
          vm.alltranche_demande_mobilier_mpe= result.data.response;
          vm.allcurenttranche_demande_mobilier_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });

        //Masque de saisi ajout

        vm.ajouterDemande_mobilier_mpe = function ()
        { 
          var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',        
              objet: '',
              description: '',
              ref_facture: '',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              date: ''
            };

        if (vm.NouvelItemDemande_mobilier_mpe == false)
          {               
                var last_id_demande_mobilier_mpe = Math.max.apply(Math, vm.alldemande_mobilier_mpe.map(function(o){return o.id;}));

                vm.dataLastedemande_mobilier_mpe = vm.alldemande_mobilier_mpe.filter(function(obj){return obj.id == last_id_demande_mobilier_mpe;});

                if (vm.dataLastedemande_mobilier_mpe.length>0)
                {   
                    var last_tranche_demande_mobilier_mpe = Math.max.apply(Math, vm.dataLastedemande_mobilier_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_mobilier_mpe[0].validation))
                    {
                      case 3:     //rejeter DPFI

                          vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande_mobilier_mpe);});
                          vm.alldemande_mobilier_mpe.push(items);                          
                          vm.selectedItemDemande_mobilier_mpe = items;
                          vm.NouvelItemDemande_mobilier_mpe = true ;
                          vm.dataLastedemande_mobilier_moe = [];
                           
                          break;

                      case 4: //Valider dpfi
                          
                          vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_mobilier_mpe)+1);});
                          vm.alldemande_mobilier_mpe.push(items);                          
                          vm.selectedItemDemande_mobilier_mpe = items;
                          vm.NouvelItemDemande_mobilier_mpe = true ;
                          break;

                      default:

                          vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!'+vm.dataLastedemande_mobilier_mpe[0].validation);
                          vm.allcurenttranche_demande_mobilier_mpe = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_mobilier_mpe.push(items);                          
                    vm.selectedItemDemande_mobilier_mpe = items;
                    vm.NouvelItemDemande_mobilier_mpe = true ;
                    vm.dataLastedemande_mobilier_mpe = [];
                }             
              
          }else
          {
              vm.showAlert('Ajout demande preparation','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_mobilier_mpe(demande_mobilier_mpe,suppression)
        {
            if (vm.NouvelItemDemande_mobilier_mpe==false)
            {
                test_existanceDemande_mobilier_mpe (demande_mobilier_mpe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_mobilier_mpe(demande_mobilier_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_mobilier_mpe
        vm.annulerDemande_mobilier_mpe = function(item)
        {
          if (vm.NouvelItemDemande_mobilier_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_mobilier_mpe.id_contrat_prestataire ;
            item.objet   = currentItemDemande_mobilier_mpe.objet ;
            item.description   = currentItemDemande_mobilier_mpe.description ;
            item.ref_facture   = currentItemDemande_mobilier_mpe.ref_facture ;
            item.id_tranche_demande_mpe = currentItemDemande_mobilier_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_mobilier_mpe.montant ;
            item.cumul = currentItemDemande_mobilier_mpe.cumul ;
            item.anterieur = currentItemDemande_mobilier_mpe.anterieur;
            item.periode = currentItemDemande_mobilier_mpe.periode ;
            item.pourcentage = currentItemDemande_mobilier_mpe.pourcentage ;
            item.reste = currentItemDemande_mobilier_mpe.reste;
            item.date  = currentItemDemande_mobilier_mpe.date;
          }else
          {
            vm.alldemande_mobilier_mpe = vm.alldemande_mobilier_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_mobilier_mpe.id;
            });
          }

          vm.selectedItemDemande_mobilier_mpe = {} ;
          vm.NouvelItemDemande_mobilier_mpe      = false;
          
        };

        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item;
           // vm.vm.NouvelItemDemande_mobilier_mpe   = item;
            currentItemDemande_mobilier_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_mobilier_mpe));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_mobilier_pre/index",'id_demande_demande_pre',vm.selectedItemDemande_mobilier_mpe.id).then(function(result)
            {
                vm.alljustificatif_mobilier_pre = result.data.response;
                console.log(vm.alljustificatif_mobilier_pre);
            });
            switch (vm.session)
            {
              case 'OBCAF':
                        apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'menu','getpaiementinvalideBydemande','id_demande_mobilier_pre',item.id).then(function(result)
                          {
                              vm.allpaiement_mobilier_mpe = result.data.response;
                              if (vm.allpaiement_mobilier_mpe.length>0)
                              {
                                vm.showbuttonNouvPaiement_mobilier_mpe= false;
                              }
                              
                          });
                                        
                  break;

             case 'BCAF':
                        apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'menu','getpaiementBydemande','id_demande_mobilier_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_mobilier_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_mobilier_mpe= false;
                      });
                      vm.showbuttonValidationDemande_mobilier_mpe_creer = true;
                      vm.showbuttonValidationPaiement_mobilier_mpe = true;
                   
                  break;
              case 'ODAAF':
                   
                   
                  break;
              
              case 'DAAF': 
                      apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_mobilier_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_mobilier_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_mobilier_mpe= false;
                      });   
                  break;
              case 'ODPFI': 
                          
                  
                  break;

              case 'DPFI':
                        apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_mobilier_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_mobilier_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_mobilier_mpe= false;
                      });

                      vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = true;
                      vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = true;
                      vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = true;                  
                  break;

              case 'ADMIN':
                        apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'menu','getpaiementBydemande','id_demande_mobilier_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_mobilier_mpe = result.data.response;
                          if (vm.allpaiement_mobilier_mpe.length>0)
                          {
                            vm.showbuttonNouvPaiement_mobilier_mpe= false;
                          }
                          vm.showbuttonValidationDemande_mobilier_mpe_creer = true;
                          vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = true;
                          vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = true;
                          vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = true;                      
                          vm.showbuttonValidationPaiement_mobilier_mpe = true;
                      });                   
                  break;

              case 'UFP':
                      apiFactory.getAPIgeneraliserREST("paiement_mobilier_prestataire/index",'menu','getpaiementvalideBydemande','id_demande_mobilier_pre',item.id).then(function(result)
                      {
                          vm.allpaiement_mobilier_mpe = result.data.response;
                          vm.showbuttonNouvPaiement_mobilier_mpe= false;
                      });                                       
                  break;
              default:
                  break;          
            }

           }
            vm.validation_demande_mobilier_mpe = item.validation;
            vm.stepjusti_bat_mpe = true;   
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_mpe', function()
        {
             if (!vm.alldemande_mobilier_mpe) return;
             vm.alldemande_mobilier_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_mobilier_mpe = function(item)
        {
            vm.NouvelItemDemande_mobilier_mpe = false ;
            vm.selectedItemDemande_mobilier_mpe = item;
            currentItemDemande_mobilier_mpe = angular.copy(vm.selectedItemDemande_mobilier_mpe);
            $scope.vm.alldemande_mobilier_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'menu','getmobilierByContrat_prestataire','id_contrat_prestataire',item.contrat_prestataire.id).then(function(result)
            {
                vm.allmobilier_construction = result.data.response;
                console.log(vm.allmobilier_construction);
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemDemande_mobilier_mpe.contrat_prestataire.id ;
            item.objet   = vm.selectedItemDemande_mobilier_mpe.objet ;
            item.description   = vm.selectedItemDemande_mobilier_mpe.description ;
            item.ref_facture   = vm.selectedItemDemande_mobilier_mpe.ref_facture ;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_mobilier_mpe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_mobilier_mpe.montant);
            item.cumul = vm.selectedItemDemande_mobilier_mpe.cumul ;
            item.anterieur = vm.selectedItemDemande_mobilier_mpe.anterieur ;
            item.periode = vm.selectedItemDemande_mobilier_mpe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_mobilier_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_mobilier_mpe.reste ;
            item.date   =new Date(vm.selectedItemDemande_mobilier_mpe.date) ;
            vm.showbuttonValidationDemande_mobilier_mpe_creer = false;
        };

        //fonction bouton suppression item Demande_mobilier_mpe
        vm.supprimerDemande_mobilier_mpe = function()
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
                vm.ajoutDemande_mobilier_mpe(vm.selectedItemDemande_mobilier_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_mobilier_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_mobilier_mpe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_mobilier_mpe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_mobilier_mpe.objet )
                    || (pass[0].description   != currentItemDemande_mobilier_mpe.description )
                    || (pass[0].id_tranche_demande_mpe != currentItemDemande_mobilier_mpe.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_mobilier_mpe.montant )
                    || (pass[0].cumul != currentItemDemande_mobilier_mpe.cumul )
                    || (pass[0].anterieur != currentItemDemande_mobilier_mpe.anterieur )
                    || (pass[0].reste != currentItemDemande_mobilier_mpe.reste )
                    || (pass[0].date   != currentItemDemande_mobilier_mpe.date )
                    || (pass[0].ref_facture   != currentItemDemande_mobilier_mpe.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_mobilier_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_mobilier_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_mobilier_mpe
        function insert_in_baseDemande_mobilier_mpe(demande_mobilier_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_mobilier_mpe==false)
            {
                getId = vm.selectedItemDemande_mobilier_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_mobilier_mpe.objet,
                    description:demande_mobilier_mpe.description,
                    ref_facture:demande_mobilier_mpe.ref_facture,
                    id_tranche_demande_mpe: demande_mobilier_mpe.id_tranche_demande_mpe ,
                    montant: demande_mobilier_mpe.montant,
                    cumul: demande_mobilier_mpe.cumul ,
                    anterieur: demande_mobilier_mpe.anterieur ,
                    reste: demande_mobilier_mpe.reste ,
                    date: convertionDate(new Date(demande_mobilier_mpe.date)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_prestataire/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_mobilier_mpe.filter(function(obj)
                {
                    return obj.id == demande_mobilier_mpe.id_tranche_demande_mpe;
                });

                if (vm.NouvelItemDemande_mobilier_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        
                        vm.selectedItemDemande_mobilier_mpe.tranche = tran[0] ;
                        vm.selectedItemDemande_mobilier_mpe.periode = tran[0].periode ;
                        vm.selectedItemDemande_mobilier_mpe.pourcentage = tran[0].pourcentage ;
                        /*vm.selectedItemDemande_mobilier_mpe.reste = demande_mobilier_mpe.reste ;
                        vm.selectedItemDemande_mobilier_mpe.date   = demande_mobilier_mpe.date ;*/
                        
                        vm.selectedItemDemande_mobilier_mpe.$selected  = false;
                        vm.selectedItemDemande_mobilier_mpe.$edit      = false;
                        vm.selectedItemDemande_mobilier_mpe ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_mobilier_mpe = vm.alldemande_mobilier_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_mobilier_mpe.id;
                      });
                    }
                    
                }
                else
                {
                  demande_mobilier_mpe.tranche = tran[0] ;
                  demande_mobilier_mpe.periode = tran[0].periode ;
                  demande_mobilier_mpe.pourcentage = tran[0].pourcentage ;

                  demande_mobilier_mpe.id  =   String(data.response);              
                  vm.NouvelItemDemande_mobilier_mpe=false;
            }

              demande_mobilier_mpe.$selected = false;
              demande_mobilier_mpe.$edit = false;
              vm.selectedItemDemande_mobilier_mpe = {};
            vm.showbuttonValidationDemande_mobilier_mpe_creer = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_mobilier_mpe = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;

          var montant = ((vm.selectedItemContrat_prestataire.cout_mobilier) * vm.allcurenttranche_demande_mobilier_mpe[0].pourcentage)/100;
          var cumul = montant;

          var demande_ancien = vm.alldemande_mobilier_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (demande_ancien.length>0)
          {                 
              anterieur = vm.dataLastedemande_mobilier_mpe[0].montant;           
              cumul = montant + parseInt(vm.dataLastedemande_mobilier_mpe[0].cumul);
          }

          reste= (vm.selectedItemContrat_prestataire.cout_mobilier) - cumul;

          item.periode = vm.allcurenttranche_demande_mobilier_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_mobilier_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }

      vm.validerDemande_mobilier_mpe_creer = function()
        {
          maj_in_baseDemande_mobilier_mpe(vm.selectedItemDemande_mobilier_mpe,0,1);
        }
        vm.validerDemande_mobilier_mpe_encourdpfi = function()
        {
          maj_in_baseDemande_mobilier_mpe(vm.selectedItemDemande_mobilier_mpe,0,2);
        }
        vm.validerDemande_mobilier_mpe_rejedpfi = function()
        {
          maj_in_baseDemande_mobilier_mpe(vm.selectedItemDemande_mobilier_mpe,0,3);
        }
        vm.validerDemande_mobilier_mpe_validedpfi = function()
        {
          maj_in_baseDemande_mobilier_mpe(vm.selectedItemDemande_mobilier_mpe,0,4);
        }

      function maj_in_baseDemande_mobilier_mpe(demande_mobilier_mpe,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_mobilier_mpe.id,
                    objet: demande_mobilier_mpe.objet,
                    description:demande_mobilier_mpe.description,
                    ref_facture:demande_mobilier_mpe.ref_facture,
                    id_tranche_demande_mpe: demande_mobilier_mpe.tranche.id ,
                    montant: demande_mobilier_mpe.montant,
                    cumul: demande_mobilier_mpe.cumul ,
                    anterieur: demande_mobilier_mpe.anterieur ,
                    reste: demande_mobilier_mpe.reste ,
                    date: convertionDate(new Date(demande_mobilier_mpe.date)),
                    id_contrat_prestataire: demande_mobilier_mpe.id_contrat_prestataire,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_prestataire/index",datas, config).success(function (data)
            {                 
               demande_mobilier_mpe.validation = validation; 
              vm.validation_demande_mobilier_mpe = validation;
 
              demande_mobilier_mpe.$selected = false;
              demande_mobilier_mpe.$edit = false;
              vm.selectedItemDemande_mobilier_mpe = {};

              vm.showbuttonValidationDemande_mobilier_mpe_creer = false;
              vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = false;
              vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = false;
              vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/************************************************fin mobilier_mpe***************************************************/
/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_mobilier_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFilemobilier_mpe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_mobilier_mpe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_mobilier_mpe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_mobilier_mpe = function ()
        { 
          if (NouvelItemJustificatif_mobilier_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_mobilier_pre.push(items);
            vm.alljustificatif_mobilier_pre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_mobilier_mpe = mem;
              }
            });

            NouvelItemJustificatif_mobilier_mpe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_mobilier_mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_mobilier_mpe(justificatif_mobilier_mpe,suppression)
        {
            if (NouvelItemJustificatif_mobilier_mpe==false)
            {
                test_existanceJustificatif_mobilier_mpe (justificatif_mobilier_mpe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_mobilier_mpe(justificatif_mobilier_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_mobilier_mpe
        vm.annulerJustificatif_mobilier_mpe = function(item)
        {
          if (NouvelItemJustificatif_mobilier_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_mobilier_mpe.description ;
            item.fichier   = currentItemJustificatif_mobilier_mpe.fichier ;
          }else
          {
            vm.alljustificatif_mobilier_pre = vm.alljustificatif_mobilier_pre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_mobilier_mpe.id;
            });
          }

          vm.selectedItemJustificatif_mobilier_mpe = {} ;
          NouvelItemJustificatif_mobilier_mpe      = false;
          
        };

        //fonction selection item justificatif mobilier_mpe
        vm.selectionJustificatif_mobilier_mpe= function (item)
        {
            vm.selectedItemJustificatif_mobilier_mpe = item;
            vm.nouvelItemJustificatif_mobilier_mpe   = item;
            currentItemJustificatif_mobilier_mpe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_mobilier_mpe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_mobilier_mpe', function()
        {
             if (!vm.alljustificatif_mobilier_pre) return;
             vm.alljustificatif_mobilier_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_mobilier_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_mobilier_mpe = function(item)
        {
            NouvelItemJustificatif_mobilier_mpe = false ;
            vm.selectedItemJustificatif_mobilier_mpe = item;
            currentItemJustificatif_mobilier_mpe = angular.copy(vm.selectedItemJustificatif_mobilier_mpe);
            $scope.vm.alljustificatif_mobilier_pre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_mobilier_mpe.description ;
            item.fichier   = vm.selectedItemJustificatif_mobilier_mpe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_mobilier_mpe
        vm.supprimerJustificatif_mobilier_mpe = function()
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
                vm.ajoutJustificatif_mobilier_mpe(vm.selectedItemJustificatif_mobilier_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_mobilier_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_mobilier_pre.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_mobilier_mpe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_mobilier_mpe.description )
                    ||(just[0].fichier   != currentItemJustificatif_mobilier_mpe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_mobilier_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_mobilier_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_mobilier_mpe
        function insert_in_baseJustificatif_mobilier_mpe(justificatif_mobilier_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_mobilier_mpe==false)
            {
                getId = vm.selectedItemJustificatif_mobilier_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_mobilier_mpe.description,
                    fichier: justificatif_mobilier_mpe.fichier,
                    id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_mobilier_mpe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_mobilier_mpe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_mobilier_mpe.id
                                              
                          if(file)
                          { 

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
                                    justificatif_mobilier_mpe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_mobilier_mpe.description,
                                                      fichier: justificatif_mobilier_mpe.fichier,
                                                      id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_mobilier_mpe.$selected = false;
                                          justificatif_mobilier_mpe.$edit = false;
                                          vm.selectedItemJustificatif_mobilier_mpe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_mobilier_mpe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_mobilier_mpe.description,
                                        fichier: justificatif_mobilier_mpe.fichier,
                                        id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_mobilier_mpe.$selected = false;
                                      justificatif_mobilier_mpe.$edit = false;
                                      vm.selectedItemJustificatif_mobilier_mpe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_mobilier_mpe.$selected  = false;
                        vm.selectedItemJustificatif_mobilier_mpe.$edit      = false;
                        vm.selectedItemJustificatif_mobilier_mpe ={};
                    }
                    else 
                    {    
                      vm.alljustificatif_mobilier_pre = vm.alljustificatif_mobilier_pre.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_mobilier_mpe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_mobilier_mpe.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                    }
              }
              else
              {
                  justificatif_mobilier_mpe.id  =   String(data.response);              
                  NouvelItemJustificatif_mobilier_mpe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_mobilier_mpe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_mobilier_mpe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_mobilier_mpe.description,
                                                fichier: justificatif_mobilier_mpe.fichier,
                                                id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                                                
                                  });
                                apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
                                { 
                                    justificatif_mobilier_mpe.$selected = false;
                                    justificatif_mobilier_mpe.$edit = false;
                                    vm.selectedItemJustificatif_mobilier_mpe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_mobilier_mpe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_mobilier_mpe.description,
                                  fichier: justificatif_mobilier_mpe.fichier,
                                  id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                                               
                              });
                            apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_mobilier_mpe.$selected = false;
                                justificatif_mobilier_mpe.$edit = false;
                                vm.selectedItemJustificatif_mobilier_mpe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_mobilier_mpe.$selected = false;
              justificatif_mobilier_mpe.$edit = false;
              vm.selectedItemJustificatif_mobilier_mpe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif mobilier_mpe**********************************************/

/**********************************debut paiement****************************************/
//col table
        vm.paiement_mobilier_mpe_column = [        
        {titre:"Montant"},
        //{titre:"Cumul"},
        {titre:"Date paiement"},
        //{titre:"Pourcentage paiement"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterPaiement_mobilier_mpe = function ()
        { 
          if (NouvelItemPaiement_mobilier_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_paiement: parseInt(vm.selectedItemDemande_mobilier_mpe.montant),
              observation:'',
              date_paiement:''
            };         
            vm.allpaiement_mobilier_mpe.push(items);
            vm.allpaiement_mobilier_mpe.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemPaiement_mobilier_mpe = conv;
              }
            });

            NouvelItemPaiement_mobilier_mpe = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPaiement_mobilier_mpe(paiement_mobilier_mpe,suppression)
        {
            if (NouvelItemPaiement_mobilier_mpe==false)
            {
                test_existancePaiement_mobilier_mpe (paiement_mobilier_mpe,suppression); 
            } 
            else
            {
                insert_in_basePaiement_mobilier_mpe(paiement_mobilier_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation paiement_mobilier_mpe
        vm.annulerPaiement_mobilier_mpe = function(item)
        {
          if (NouvelItemPaiement_mobilier_mpe == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_paiement = currentItemPaiement_mobilier_mpe.montant_paiement;
              item.observation    = currentItemPaiement_mobilier_mpe.observation;
              item.date_paiement = currentItemPaiement_mobilier_mpe.date_paiement; 
          }else
          {
            vm.allpaiement_mobilier_mpe = vm.allpaiement_mobilier_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPaiement_mobilier_mpe.id;
            });
          }

          vm.selectedItemPaiement_mobilier_mpe = {} ;
          NouvelItemPaiement_mobilier_mpe      = false;
          
        };

        //fonction selection item paiement_mobilier_mpe convention cisco/feffi
        vm.selectionPaiement_mobilier_mpe = function (item)
        {
            vm.selectedItemPaiement_mobilier_mpe = item;

            if (item.$selected == false || item.$selected==undefined)
            {
              currentItemPaiement_mobilier_mpe     = JSON.parse(JSON.stringify(vm.selectedItemPaiement_mobilier_mpe));
              vm.showbuttonValidationPaiement_mobilier_mpe = true;
            }
            vm.validation_paiement_mobilier_mpe = item.validation;
                        

        };
        $scope.$watch('vm.selectedItemPaiement_mobilier_mpe', function()
        {
             if (!vm.allpaiement_mobilier_mpe) return;
             vm.allpaiement_mobilier_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPaiement_mobilier_mpe.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierPaiement_mobilier_mpe = function(item)
        {
            NouvelItemPaiement_mobilier_mpe = false ;
            vm.selectedItemPaiement_mobilier_mpe = item;
            currentItemPaiement_mobilier_mpe = angular.copy(vm.selectedItemPaiement_mobilier_mpe);
            $scope.vm.allpaiement_mobilier_mpe.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_paiement = parseInt(vm.selectedItemPaiement_mobilier_mpe.montant_paiement) ;            
            item.observation = vm.selectedItemPaiement_mobilier_mpe.observation ;
            item.date_paiement = new Date(vm.selectedItemPaiement_mobilier_mpe.date_paiement);
        };

        //fonction bouton suppression item paiement_mobilier_mpe convention cisco feffi
        vm.supprimerPaiement_mobilier_mpe = function()
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
                vm.ajoutPaiement_mobilier_mpe(vm.selectedItemPaiement_mobilier_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existancePaiement_mobilier_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allpaiement_mobilier_mpe.filter(function(obj)
                {
                   return obj.id == currentItemPaiement_mobilier_mpe.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemPaiement_mobilier_mpe.observation)
                    || (convT[0].date_paiement!=currentItemPaiement_mobilier_mpe.date_paiement)
                    || (convT[0].montant_paiement!=currentItemPaiement_mobilier_mpe.montant_paiement))                    
                      {
                          insert_in_basePaiement_mobilier_mpe(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePaiement_mobilier_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_basePaiement_mobilier_mpe(paiement_mobilier_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_mobilier_mpe ==false)
            {
                getId = vm.selectedItemPaiement_mobilier_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_mobilier_mpe.montant_paiement,
                    observation: paiement_mobilier_mpe.observation,
                    date_paiement: convertionDate(new Date(paiement_mobilier_mpe.date_paiement)), 
                    id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                    validation : 0            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_mobilier_prestataire/index",datas, config).success(function (data)
            {

                if (NouvelItemPaiement_mobilier_mpe == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPaiement_mobilier_mpe.$selected  = false;
                        vm.selectedItemPaiement_mobilier_mpe.$edit      = false;
                        vm.selectedItemPaiement_mobilier_mpe ={};
                    }
                    else 
                    {    
                      vm.allpaiement_mobilier_mpe = vm.allpaiement_mobilier_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPaiement_mobilier_mpe.id;
                      });
                      vm.showbuttonNouvPaiement_mobilier_mpe = true;
                    }
                }
                else
                { 
                  paiement_mobilier_mpe.validation = 0;
                  paiement_mobilier_mpe.id  =   String(data.response);              
                  NouvelItemPaiement_mobilier_mpe = false;

                  vm.showbuttonNouvPaiement_mobilier_mpe = false;
            }
              paiement_mobilier_mpe.$selected = false;
              paiement_mobilier_mpe.$edit = false;
              vm.selectedItemPaiement_mobilier_mpe = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.valider_paiement_mobilier_mpe= function()
        {
              validation_in_basepaiement_mobilier_mpe(vm.selectedItemPaiement_mobilier_mpe,0);
        }
        function validation_in_basepaiement_mobilier_mpe(paiement_mobilier_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPaiement_mobilier_mpe ==false)
            {
                getId = vm.selectedItemPaiement_mobilier_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_paiement:    paiement_mobilier_mpe.montant_paiement,
                    observation: paiement_mobilier_mpe.observation,
                    date_paiement: convertionDate(new Date(paiement_mobilier_mpe.date_paiement)), 
                    id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                    validation : 1            
                });
                //console.log(datas);
                //factory
            apiFactory.add("paiement_mobilier_prestataire/index",datas, config).success(function (data)
            { 
              paiement_mobilier_mpe.validation = 1;
              vm.validation_paiement_mobilier_mpe = 1;
              paiement_mobilier_mpe.$selected = false;
              paiement_mobilier_mpe.$edit = false;
              vm.selectedItemPaiement_mobilier_mpe = {};

              vm.showbuttonValidationPaiement_mobilier_mpe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


        /**************************************Fin paiement mobilier mpe*********************************************/


        /**************************************Debut transfert reliquat*********************************************/
         vm.transfert_reliquat_column = [        
        {titre:"Montant"
        },
        {titre:"Objet utilisation"
        },
        {titre:"Date transfert"
        },
        {titre:"Intitulé du compte"
        },
        {titre:"RIB SAE"
        },
        {titre:"Action"
        }];


        //Masque de saisi ajout
        vm.ajouterTransfert_reliquat = function ()
        { 
          if (NouvelItemTransfert_reliquat == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant:'',
              date_transfert: '',
              objet_utilisation: '',
              intitule_compte: '',
              rib: ''
            };       
            vm.alltransfert_reliquat.push(items);
            vm.alltransfert_reliquat.forEach(function(trans)
            {
              if(trans.$selected==true)
              {
                vm.selectedItem = trans;
              }
            });

            NouvelItemTransfert_reliquat = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };
        vm.afficheobjet_utilisation = function(objet)
        { 
          var affiche = "Se procurer fourniture";
          if (objet ==0 )
          {
            affiche = "Amelioration infrastructure";
          }
          return affiche;
        }
        vm.change_montant = function(item)
        { item.objet_utilisation=1;
          if (parseInt(item.montant)<=1000000)
          {
            item.objet_utilisation=0;
          }
        }

        //fonction ajout dans bdd
        function ajoutTransfert_reliquat(transfert_reliquat,suppression)
        {
            if (NouvelItemTransfert_reliquat==false)
            {
                test_existanceTransfert_reliquat (transfert_reliquat,suppression); 
            } 
            else
            {
                insert_in_baseTransfert_reliquat(transfert_reliquat,suppression);
            }
        }

        //fonction de bouton d'annulation transfert_reliquat
        vm.annulerTransfert_reliquat = function(item)
        {
          if (NouvelItemTransfert_reliquat == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_convention_entete    = currentItem.id_convention_entete ;
              item.montant  = currentItem.montant ;
              item.objet_utilisation  = currentItem.objet_utilisation ;
              item.date_transfert       = new Date(currentItem.date_transfert);              
              item.intitule_compte = currentItem.intitule_compte ;
              item.rib = currentItem.rib;
              
          }else
          {
            vm.alltransfert_reliquat = vm.alltransfert_reliquat.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItemTransfert_reliquat = {} ;
          NouvelItemTransfert_reliquat     = false;
          vm.showbuttonSauvegarde = true;
          vm.afficherboutonValider = false;
          
        };

        //fonction selection item entete convention cisco/feffi
        vm.selectionTransfert_reliquat = function (item)
        {
            vm.selectedItemTransfert_reliquat = item;
            if(item.$selected==false)
            {
              currentItemTransfert_reliquat     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_reliquat));
            }
            
            //recuperation donnée convention
           if (vm.selectedItemTransfert_reliquat.id!=0)
            {   
                vm.showbuttonValidationtransfert_reliquat = true;
                vm.validation_transfert_reliquat = item.validation;
                if (item.$edit == true)
                {
                  vm.showbuttonValidationtransfert_reliquat = false;
                } 
                apiFactory.getAPIgeneraliserREST("justificatif_transfert_reliquat/index",'id_transfert_reliquat',item.id).then(function(result)
                {
                    vm.alljustificatif_transfert_reliquat = result.data.response; 
                    console.log(vm.alljustificatif_transfert_reliquat);
                });
              //Fin Récupération cout divers par convention
              
                vm.stepjusti_trans_reliqua = true;
            };           

        };
        $scope.$watch('vm.selectedItemTransfert_reliquat', function()
        {
             if (!vm.alltransfert_reliquat) return;
             vm.alltransfert_reliquat.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_reliquat.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierTransfert_reliquat = function(item)
        { 
            NouvelItemTransfert_reliquat = false ;
            vm.selectedItemTransfert_reliquat = item;
            currentItemTransfert_reliquat = angular.copy(vm.selectedItemTransfert_reliquat);
            $scope.vm.alltransfert_reliquat.forEach(function(cis) {
              cis.$edit = false;
            });            

            item.$edit = true;
            item.$selected = true;

            item.id_convention_entete = vm.selectedItemTransfert_reliquat.convention_entete.id ;
            item.montant  = vm.selectedItemTransfert_reliquat.montant ;
            item.objet_utilisation  = vm.selectedItemTransfert_reliquat.objet_utilisation ;
            item.date_transfert  = new Date(vm.selectedItemTransfert_reliquat.date_transfert) ;
            item.intitule_compte = vm.selectedItemTransfert_reliquat.intitule_compte ;
            item.rib = parseInt(vm.selectedItemTransfert_reliquat.rib);

            vm.showbuttonValidationcontrat_prestataire = false;
        };

        //fonction bouton suppression item entente convention cisco feffi
        vm.supprimerTransfert_reliquat = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout(vm.selectedItemTransfert_reliquat,1);
                vm.showbuttonSauvegarde = true;
                vm.afficherboutonValider = false;
              }, function() {
                //alert('rien');
              });

              vm.stepOne = false;
              vm.stepTwo = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceTransfert_reliquat (item,suppression)
        {          
            if (suppression!=1)
            {
               var trans = vm.alltransfert_reliquat.filter(function(obj)
                {
                   return obj.id == currentItemTransfert_reliquat.id;
                });
                if(trans[0])
                {
                   if((trans[0].date_transfert!=currentItemTransfert_reliquat.date_transfert)                    
                    || (trans[0].intitule_compte!=currentItemTransfert_reliquat.intitule_compte)
                    || (trans[0].montant!=currentItemTransfert_reliquat.montant))                   
                                       
                      { 
                        insert_in_baseTransfert_reliquat(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTransfert_reliquat(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseTransfert_reliquat(transfert_reliquat,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTransfert_reliquat ==false)
            {
                getId = vm.selectedItemTransfert_reliquat.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    date_transfert:    convertionDate(new Date(transfert_reliquat.date_transfert)),
                    intitule_compte:  transfert_reliquat.intitule_compte,
                    montant:   transfert_reliquat.montant,
                    objet_utilisation:   transfert_reliquat.objet_utilisation,
                    rib:    transfert_reliquat.rib,
                    validation: 0               
                });
                //console.log(convention.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("transfert_reliquat/index",datas, config).success(function (data)
            {
                
                var conv = vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == transfert_reliquat.id_convention_entete;
                });

                if (NouvelItemTransfert_reliquat == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTransfert_reliquat.convention_entete   = conv[0];
                        vm.selectedItemTransfert_reliquat.$selected  = false;
                        vm.selectedItemTransfert_reliquat.$edit      = false;
                        vm.selectedItemTransfert_reliquat ={};
                        vm.showbuttonNouvTransfert_reliquat = false;


                    }
                    else 
                    {    
                      vm.alltransfert_reliquat = vm.alltransfert_reliquat.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTransfert_reliquat.id;
                      });
                      vm.showbuttonNouvTransfert_reliquat= true;
                    }
                }
                else
                {
                  
                  transfert_reliquat.convention_entete = conv[0];
                  transfert_reliquat.id  =   String(data.response);
                  NouvelItemTransfert_reliquat = false;
                  vm.showbuttonNouvTransfert_reliquat= false;
            }
              vm.validation_transfert_reliquat = 0;    
              vm.showbuttonValidationtransfert_reliquat = false;
              transfert_reliquat.$selected = false;
              transfert_reliquat.$edit = false;
              vm.selectedItemTransfert_reliquat = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.validerTransfert_reliquat = function()
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemTransfert_reliquat.id,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    date_transfert:    vm.selectedItemTransfert_reliquat.date_transfert,
                    intitule_compte:  vm.selectedItemTransfert_reliquat.intitule_compte,
                    montant:   vm.selectedItemTransfert_reliquat.montant,
                    objet_utilisation:   vm.selectedItemTransfert_reliquat.objet_utilisation,
                    rib:    vm.selectedItemTransfert_reliquat.rib,
                    validation: 1               
                });

            //console.log(datas);
                //factory
            apiFactory.add("transfert_reliquat/index",datas, config).success(function (data)
            { 
                vm.selectedItemTransfert_reliquat.validation = 1;
                vm.validation_transfert_reliquat = 1;    
                vm.showbuttonValidationtransfert_reliquat = false;
                   
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
           
        }
    /*********************************************Fin transfert reliquat************************************************/

    /*********************************************Fin justificatif reliquat************************************************/

    vm.justificatif_transfert_reliquat_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFiletransfert_reliquat = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_transfert_reliquat.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_transfert_reliquat.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_transfert_reliquat = function ()
        { 
          if (NouvelItemJustificatif_transfert_reliquat == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_transfert_reliquat.push(items);
            vm.alljustificatif_transfert_reliquat.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_transfert_reliquat = mem;
              }
            });

            NouvelItemJustificatif_transfert_reliquat = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_transfert_reliquat','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_transfert_reliquat(justificatif_transfert_reliquat,suppression)
        {
            if (NouvelItemJustificatif_transfert_reliquat==false)
            {
                test_existanceJustificatif_transfert_reliquat (justificatif_transfert_reliquat,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_transfert_reliquat(justificatif_transfert_reliquat,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_transfert_reliquat
        vm.annulerJustificatif_transfert_reliquat = function(item)
        {
          if (NouvelItemJustificatif_transfert_reliquat == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_transfert_reliquat.description ;
            item.fichier   = currentItemJustificatif_transfert_reliquat.fichier ;
          }else
          {
            vm.alljustificatif_transfert_reliquat = vm.alljustificatif_transfert_reliquat.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_transfert_reliquat.id;
            });
          }

          vm.selectedItemJustificatif_transfert_reliquat = {} ;
          NouvelItemJustificatif_transfert_reliquat      = false;
          
        };

        //fonction selection item justificatif transfert_reliquat
        vm.selectionJustificatif_transfert_reliquat= function (item)
        {
            vm.selectedItemJustificatif_transfert_reliquat = item;
            vm.nouvelItemJustificatif_transfert_reliquat   = item;
            currentItemJustificatif_transfert_reliquat    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_transfert_reliquat)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_transfert_reliquat', function()
        {
             if (!vm.alljustificatif_transfert_reliquat) return;
             vm.alljustificatif_transfert_reliquat.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_transfert_reliquat.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_transfert_reliquat = function(item)
        {
            NouvelItemJustificatif_transfert_reliquat = false ;
            vm.selectedItemJustificatif_transfert_reliquat = item;
            currentItemJustificatif_transfert_reliquat = angular.copy(vm.selectedItemJustificatif_transfert_reliquat);
            $scope.vm.alljustificatif_transfert_reliquat.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_transfert_reliquat.description ;
            item.fichier   = vm.selectedItemJustificatif_transfert_reliquat.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_transfert_reliquat
        vm.supprimerJustificatif_transfert_reliquat = function()
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
                vm.ajoutJustificatif_transfert_reliquat(vm.selectedItemJustificatif_transfert_reliquat,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_transfert_reliquat (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_transfert_reliquat.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_transfert_reliquat.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_transfert_reliquat.description )
                    ||(just[0].fichier   != currentItemJustificatif_transfert_reliquat.fichier ))                   
                      { 
                         insert_in_baseJustificatif_transfert_reliquat(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_transfert_reliquat(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_transfert_reliquat
        function insert_in_baseJustificatif_transfert_reliquat(justificatif_transfert_reliquat,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_transfert_reliquat==false)
            {
                getId = vm.selectedItemJustificatif_transfert_reliquat.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_transfert_reliquat.description,
                    fichier: justificatif_transfert_reliquat.fichier,
                    id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_transfert_reliquat == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_transfert_reliquat/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_transfert_reliquat.id
                                              
                          if(file)
                          { 

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
                                    justificatif_transfert_reliquat.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_transfert_reliquat.description,
                                                      fichier: justificatif_transfert_reliquat.fichier,
                                                      id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_transfert_reliquat.$selected = false;
                                          justificatif_transfert_reliquat.$edit = false;
                                          vm.selectedItemJustificatif_transfert_reliquat = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_transfert_reliquat.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_transfert_reliquat.description,
                                        fichier: justificatif_transfert_reliquat.fichier,
                                        id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_transfert_reliquat.$selected = false;
                                      justificatif_transfert_reliquat.$edit = false;
                                      vm.selectedItemJustificatif_transfert_reliquat = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_transfert_reliquat.$selected  = false;
                        vm.selectedItemJustificatif_transfert_reliquat.$edit      = false;
                        vm.selectedItemJustificatif_transfert_reliquat ={};
                    }
                    else 
                    {    
                      vm.alljustificatif_transfert_reliquat = vm.alljustificatif_transfert_reliquat.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_transfert_reliquat.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_transfert_reliquat.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                    }
              }
              else
              {
                  justificatif_transfert_reliquat.id  =   String(data.response);              
                  NouvelItemJustificatif_transfert_reliquat = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_transfert_reliquat/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

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
                              justificatif_transfert_reliquat.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_transfert_reliquat.description,
                                                fichier: justificatif_transfert_reliquat.fichier,
                                                id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                                
                                  });
                                apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                                { 
                                    justificatif_transfert_reliquat.$selected = false;
                                    justificatif_transfert_reliquat.$edit = false;
                                    vm.selectedItemJustificatif_transfert_reliquat = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_transfert_reliquat.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_transfert_reliquat.description,
                                  fichier: justificatif_transfert_reliquat.fichier,
                                  id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                               
                              });
                            apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_transfert_reliquat.$selected = false;
                                justificatif_transfert_reliquat.$edit = false;
                                vm.selectedItemJustificatif_transfert_reliquat = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_transfert_reliquat.$selected = false;
              justificatif_transfert_reliquat.$edit = false;
              vm.selectedItemJustificatif_transfert_reliquat = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_transfert_reliquat = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }

    /*********************************************Fin justificatif reliquat************************************************/

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
            if (parseInt(item.id)!=0)
            {
                currentItemIndicateur     = JSON.parse(JSON.stringify(vm.selectedItemIndicateur));
                vm.showbuttonValidationcontrat_prestataire = true;
                vm.validation_contrat_prestataire = item.validation;  
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
            item.nbr_salle_const      = vm.selectedItemIndicateur.nbr_salle_const ;
            item.prev_beneficiaire       = vm.selectedItemIndicateur.prev_beneficiaire; 
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
        function test_existancIndicateur (item,suppression)
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
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("indicateur/index",datas, config).success(function (data)
            {   
                vm.validation_indicateur = 1;    
              vm.showbuttonValidationindicateur = false;

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
