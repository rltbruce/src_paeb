
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.convention_suivi_fp_obcaf')
        .directive('customOnChangepiecemoe', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangepiecemoe);
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
                    scope.justificatif_facture_moe.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.justificatif_facture_moe.fichier = files[0].name;
            } 
        });
        }
      };
    })
    .directive('customOnChangepiecempe', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangepiecempe);
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
                    scope.justificatif_pv_consta_entete_travaux_mpe.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.justificatif_pv_consta_entete_travaux_mpe.fichier = files[0].name;
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
        .controller('Convention_suivi_fp_obcafController', Convention_suivi_fp_obcafController);
    /** @ngInject */
    function Convention_suivi_fp_obcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel,$stateParams)
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
        vm.myFile = [];

        vm.styleTabfils2 = "acc_sous_menu";
       
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepsuivi_paiement_moe = false;
        vm.stepsuivi_paiement_mpe = false;

        vm.stepMenu_reliquat =false; 
        
        vm.stepfacture_mpe = false;
        vm.steppv_consta_mpe = false;
        
        vm.step_tranche_batiment_mpe = false;
        vm.step_tranche_latrine_mpe = false;
        vm.step_tranche_mobilier_mpe = false;

        vm.steppv_consta_batiment_travaux = false;
        vm.steppv_consta_latrine_travaux = false;
        vm.steppv_consta_mobilier_travaux = false;

        vm.steprubriquebatiment_mpe = false;
        vm.steprubriquelatrine_mpe = false;
        vm.steprubriquemobilier_mpe = false;

        vm.steppv_consta_recap_travaux = false;

        vm.stepjusti_trans_reliqua = false;

        vm.stepjusti_pv_consta_entete_travaux_mpe = false;

        vm.steprubriquecalendrier = false;
        vm.stepsousrubriquecalendrier = false;
        vm.stepjusti_facture_moe = false;
        vm.stepfacture_detail = false;
        
        vm.stepdecompte =false;
        vm.session = '';
        vm.ciscos = [];

/*******************************************Debut maitrise d'oeuvre*************************************/

        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;


        vm.ajoutFacture_moe_entete = ajoutFacture_moe_entete;
        var NouvelItemFacture_moe_entete=false;
        var currentItemFacture_moe_entete;
        vm.selectedItemFacture_moe_entete = {};
        vm.allfacture_moe_entete = [];

        vm.selectedItemRubrique_calendrier_paie_moe = {};
        vm.allrubrique_calendrier_paie_moe = [];

        vm.selectedItemSousrubrique_calendrier_paie_moe = {};
        vm.allsousrubrique_calendrier_paie_moe = [];

        vm.ajoutFacture_moe_detail = ajoutFacture_moe_detail;
        var NouvelItemFacture_moe_detail=false;
        var currentItemFacture_moe_detail;
        vm.selectedItemFacture_moe_detail = {} ;
        vm.allfacture_moe_detail = [] ;

         vm.ajoutJustificatif_facture_moe = ajoutJustificatif_facture_moe;
        var NouvelItemJustificatif_facture_moe=false;
        var currentItemJustificatif_facture_moe;
        vm.selectedItemJustificatif_facture_moe = {} ;
        vm.alljustificatif_facture_moe = [] ;

/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutPv_consta_entete_travaux = ajoutPv_consta_entete_travaux;
        var NouvelItemPv_consta_entete_travaux=false;
        var currentItemPv_consta_entete_travaux;
        vm.selectedItemPv_consta_entete_travaux = {};
        vm.allpv_consta_entete_travaux = [];
        vm.showbuttonNouvPv_consta_entete_travaux = true;

        vm.ajoutAvance_demarrage = ajoutAvance_demarrage;
        var NouvelItemAvance_demarrage=false;
        var currentItemAvance_demarrage;
        vm.selectedItemAvance_demarrage = {};
        vm.allavance_demarrage = [];
        vm.showbuttonNouvAvance_demarrage = true;

        vm.ajoutFacture_mpe = ajoutFacture_mpe;
        var NouvelItemFacture_mpe=false;
        var currentItemFacture_mpe;
        vm.selectedItemFacture_mpe = {};
        vm.allfacture_mpe = [];
        vm.showbuttonNouvFacture_mpe = true;
        vm.id_facture_mpe = 0 ;

        vm.ajoutPv_consta_rubrique_phase_bat_mpe = ajoutPv_consta_rubrique_phase_bat_mpe;
        var NouvelItemPv_consta_rubrique_phase_bat_mpe=false;
        var currentItemPv_consta_rubrique_phase_bat_mpe;
        vm.allpv_consta_rubrique_phase_bat_mpe=[];
        vm.selectedItemPv_consta_rubrique_phase_bat_mpe = {};


        vm.ajoutDemande_batiment_mpe = ajoutDemande_batiment_mpe;
        var NouvelItemDemande_batiment_mpe=false;
        var currentItemDemande_batiment_mpe;
        vm.selectedItemDemande_batiment_mpe = {};
        vm.alldemande_batiment_mpe = [];

        vm.allcurenttranche_demande_batiment_mpe = [];
        vm.alltranche_demande_batiment_mpe = [];
        vm.dataLastedemande_batiment_mpe = [];

        //vm.selectedItemDivers_attachement_batiment_travaux = {} ;
        vm.allpv_consta_statu_bat_travaux = [] ;

        vm.ajoutDemande_latrine_mpe = ajoutDemande_latrine_mpe;
        var NouvelItemDemande_latrine_mpe=false;
        var currentItemDemande_latrine_mpe;
        vm.selectedItemDemande_latrine_mpe = {};
        vm.alldemande_latrine_mpe = [];


        /*vm.allrubrique_attachement_latrine_mpe=[];
        vm.selectedItemRubrique_attachement_latrine_mpe = {};*/

        vm.allcurenttranche_demande_latrine_mpe = [];
        vm.alltranche_demande_latrine_mpe = [];
        vm.dataLastedemande_latrine_mpe = [];

        vm.showbuttonNouvDemande_latrine_mpe_creer = true;
        
        vm.ajoutPv_consta_rubrique_phase_lat_mpe = ajoutPv_consta_rubrique_phase_lat_mpe;
        var NouvelItemPv_consta_rubrique_phase_lat_mpe=false;
        var currentItemPv_consta_rubrique_phase_lat_mpe;
        vm.allpv_consta_rubrique_phase_lat_mpe=[];
        vm.selectedItemPv_consta_rubrique_phase_lat_mpe = {};

        vm.allpv_consta_statu_lat_travaux = [] ;

        vm.ajoutDemande_mobilier_mpe = ajoutDemande_mobilier_mpe;
        var NouvelItemDemande_mobilier_mpe=false;
        var currentItemDemande_mobilier_mpe;
        vm.selectedItemDemande_mobilier_mpe = {};
        vm.alldemande_mobilier_mpe = [];

        vm.allrubrique_attachement_mobilier_mpe=[];
        vm.selectedItemRubrique_attachement_mobilier_mpe = {};

        vm.allcurenttranche_demande_mobilier_mpe = [];
        vm.alltranche_demande_mobilier_mpe = [];
        vm.dataLastedemande_mobilier_mpe = [];

        vm.showbuttonNouvDemande_mobilier_mpe_creer = true;        

        /*vm.ajoutDivers_attachement_mobilier_travaux = ajoutDivers_attachement_mobilier_travaux;
        var NouvelItemDivers_attachement_mobilier_travaux=false;
        var currentItemDivers_attachement_mobilier_travaux;
        vm.selectedItemDivers_attachement_mobilier_travaux = {} ;
        vm.alldivers_attachement_mobilier_travaux = [] ;*/
        
        vm.ajoutPv_consta_rubrique_phase_mob_mpe = ajoutPv_consta_rubrique_phase_mob_mpe;
        var NouvelItemPv_consta_rubrique_phase_mob_mpe=false;
        var currentItemPv_consta_rubrique_phase_mob_mpe;
        vm.allpv_consta_rubrique_phase_mob_mpe=[];
        vm.selectedItemPv_consta_rubrique_phase_mob_mpe = {};

        vm.allpv_consta_statu_mob_travaux = [] ;
       //vm.pv_consta_recap_travaux={};

         vm.ajoutJustificatif_pv_consta_entete_travaux_mpe = ajoutJustificatif_pv_consta_entete_travaux_mpe;
        var NouvelItemJustificatif_pv_consta_entete_travaux_mpe=false;
        var currentItemJustificatif_pv_consta_entete_travaux_mpe;
        vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {} ;
        vm.alljustificatif_pv_consta_entete_travaux_mpe = [] ;
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
        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          order:[]          
        };
        var racourci = $stateParams.rac; //getting fooVal
    //var bar = $stateParams.bar; //getting barVal
    //console.log(bar);
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
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepMenu_moe=true;
            vm.stepMenu_mpe=true;
            vm.stepMenu_reliquat =true; 

            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig'; 
      });
    }
    console.log(racourci);
        vm.test= function()
        {
          console.log('ok');
        }
        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

        vm.allcurenttranche_deblocage_feffi = [];
        vm.alltranche_deblocage_feffi = [];

        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
          vm.alltranche_deblocage_feffi= result.data.response;
          vm.allcurenttranche_deblocage_feffi = result.data.response;
        });

        vm.datenow = new Date();
        //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_mpe/index").then(function(result)
        {
          vm.alltranche_demande_batiment_mpe= result.data.response;
          vm.allcurenttranche_demande_batiment_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });
                //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_latrine_mpe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_mpe= result.data.response;
          vm.allcurenttranche_demande_latrine_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });
                //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_mobilier_mpe/index").then(function(result)
        {
          vm.alltranche_demande_mobilier_mpe= result.data.response;
          vm.allcurenttranche_demande_mobilier_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });

        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allmoe= result.data.response;
            console.log(vm.allmoe);
        });

        apiFactory.getAll("taxe_marche_public/index").then(function(result)
        {
            vm.alltaxe_marche_public= result.data.response;
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
              vm.filtre.id_convention_entete = null;
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

            /*if (utilisateur.roles.indexOf("OBCAF")!= -1)
            { 
                            vm.usercisco = result.data.response.cisco;
                            vm.ciscos.push(vm.usercisco);
                            vm.filtre.id_cisco=result.data.response.cisco.id;
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionBycisco",'id_cisco',vm.usercisco.id).then(function(resu)
                            {
                                vm.regions = resu.data.response;
                                vm.filtre.id_region=resu.data.response[0].id;
                            }, function error(resu){ alert('something went wrong')});
                            vm.showbuttonNeauveaudemandefeffi=true;                            
                            vm.session = 'OBCAF';

            }*/
            if (utilisateur.roles.indexOf("AAC")!= -1)
            { 
                            vm.showbuttonNeauveaudemandefeffi=true;
                            
                            apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            });
                            vm.session = 'AAC';

            }
            else
            {                            
                            vm.showbuttonNeauveaudemandefeffi=true;
                            
                            apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            });
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
        {titre:"Référence Financement"
        },
        {titre:"Cout éstimé"
        },
        /*{titre:"Avancement"
        },*/
        {titre:"Utilisateur"
        }]; 
       

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
              /*switch (vm.session)
                { 
                  case 'OBCAF':
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
                                console.log(vm.allconvention_entete);
                            });                 
                      break;
                  default:
                      break;
              
                }*/
                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
              {
                  vm.allconvention_entete = result.data.response;
                  vm.affiche_load =false;
              });
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepMenu_moe=true;
            vm.stepMenu_mpe=true;
            vm.stepMenu_reliquat =true; 

            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.description;
            vm.header_feffi = item.feffi.denomination; 
            vm.header_class = 'headerbig';        
            
           //console.log(vm.step_menu_moe());                      
              /*apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });*/
               
              //vm.stepjusti_d_tra_moe = false;
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
       /* function donnee_menu_pr(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("contrat_partenaire_relai/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allcontrat_partenaire_relai = result.data.response;
                    return resolve(vm.allcontrat_partenaire_relai);
                });
            
            });
        }*/
         vm.step_menu_moe = function()
        { 
                vm.styleTabfils = "acc_sous_menu";                            
                vm.stepsuivi_paiement_moe = false;
                vm.affiche_load =true;
                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_moe = result.data.response;
                    vm.affiche_load =false;
                });
        }        
        
         vm.step_menu_mpe = function()
        {   
            vm.styleTabfils = "acc_sous_menu";
            vm.stepsuivi_paiement_mpe = false;
            vm.affiche_load =true;
                apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    vm.affiche_load =false;
                });
        }

        /*vm.step_menu_reliquat=function()
        {       
                vm.affiche_load =true;
                apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.alltransfert_reliquat = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });

                    if (result.data.response.length!=0)
                    {
                    vm.showbuttonNouvTransfert_reliquat=false;
                    }
                    vm.affiche_load =false;
                });
        }*/



  /******************************************debut maitrise d'oeuvre*****************************************************/

      
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
        }];
       
        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;

           if(item.$edit==false || item.$edit==undefined)
           {              
            vm.stepsuivi_paiement_moe = true;
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

        vm.click_step_contrat_moe = function()
        {
            vm.stepsuivi_paiement_moe = false;
             vm.styleTabfils = "acc_sous_menu"
        }
       
/*****************************************fin contrat moe******************************************************/

     
/*****************************************debut suivi paiement moe********************************************/

    /**************************************debut facture moe entete*********************************************/
      vm.click_step_suivi_paiement_moe = function()
      { 
        vm.affiche_load =true;
        NouvelItemFacture_moe_entete = false;
        apiFactory.getAPIgeneraliserREST("facture_moe_entete/index","menu","getfacture_moe_enteteinvalideBycontratstat12",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
        {
            vm.allfacture_moe_entete = result.data.response;
            vm.affiche_load =false;
        });        

        vm.steprubriquecalendrier = false;
        vm.stepsousrubriquecalendrier = false;
        vm.stepjusti_facture_moe = false;
        vm.stepfacture_detail = false;
      }
      vm.menu_click_fature_moe_entete= function ()
      {
        NouvelItemFacture_moe_entete = false;
      }

        vm.facture_moe_entete_column = [        
        {titre:"Numero"
        },
        {titre:"Date de BR"
        },
        {titre:"Statu"
        },
        {titre:"Action"
        }];
        vm.statu_facture = function(statu)
        { 
          var affich = "Facture disponible pour paiement";
          if(statu==2)
          {
              affich="Facture envoyé pour validation"
          }
          return affich;
        }

        vm.ajouterFacture_moe_entete = function ()
        { 
            if (NouvelItemFacture_moe_entete == false)
            {

                apiFactory.getAPIgeneraliserREST("facture_moe_entete/index","menu","getfacture_moe_enteteBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                {   
                    var last_id_facture_moe_entete = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                    vm.dataLastefacture_moe_entete = result.data.response.filter(function(obj){return obj.id == last_id_facture_moe_entete;});
                    //console.log(vm.dataLasteattachement_mpe);
                    if (vm.dataLastefacture_moe_entete.length>0)
                    { 

                      switch (parseInt(vm.dataLastefacture_moe_entete[0].validation))
                        {
                            case 1:     //rejeter DPFI
                                var items = {
                                              $edit: true,
                                              $selected: true,
                                              id: '0',        
                                              numero: parseInt(vm.dataLastefacture_moe_entete[0].numero),
                                              date_br: '',
                                              validation: 0,
                                              statu_fact: ''
                                            };
                                                             
                                vm.allfacture_moe_entete.push(items);
                                vm.allfacture_moe_entete.forEach(function(cis)
                                {
                                  if(cis.$selected==true)
                                  {
                                    vm.selectedItemFacture_moe_entete = cis;
                                  }
                                });
                                NouvelItemFacture_moe_entete = true;

                               
                              break;

                          case 2: //Valider dpfi

                                var items = {
                                              $edit: true,
                                              $selected: true,
                                              id: '0',        
                                              numero: parseInt(vm.dataLastefacture_moe_entete[0].numero)+1 ,
                                              date_br: '',
                                              validation: 0,
                                              statu_fact:''
                                            };
                                
                                                             
                                vm.allfacture_moe_entete.push(items);
                                vm.allfacture_moe_entete.forEach(function(cis)
                                {
                                  if(cis.$selected==true)
                                  {
                                    vm.selectedItemFacture_moe_entete = cis;
                                  }
                                });
                                NouvelItemFacture_moe_entete = true;
                              break;
                         /* case 3:     //rejeter DPFI
                                var items = {
                                              $edit: true,
                                              $selected: true,
                                              id: '0',        
                                              numero: parseInt(vm.dataLastefacture_moe_entete[0].numero),
                                              date_br: '',
                                              validation: 0
                                            };
                                                             
                                vm.allfacture_moe_entete.push(items);
                                vm.allfacture_moe_entete.forEach(function(cis)
                                {
                                  if(cis.$selected==true)
                                  {
                                    vm.selectedItemFacture_moe_entete = cis;
                                  }
                                });
                                NouvelItemFacture_moe_entete = true;

                               
                              break;

                          case 4: //Valider dpfi

                                var items = {
                                              $edit: true,
                                              $selected: true,
                                              id: '0',        
                                              numero: parseInt(vm.dataLastefacture_moe_entete[0].numero)+1 ,
                                              date_br: '',
                                              validation: 0
                                            };
                                
                                                             
                                vm.allfacture_moe_entete.push(items);
                                vm.allfacture_moe_entete.forEach(function(cis)
                                {
                                  if(cis.$selected==true)
                                  {
                                    vm.selectedItemFacture_moe_entete = cis;
                                  }
                                });
                                NouvelItemFacture_moe_entete = true;
                              break;*/

                          default:

                              vm.showAlert('Ajout réfuser','La dernière facture est en cours de traitement!!!');
                              break;
                      
                        } 
                        
                    }
                    else
                    {
                        vm.montant_attachement_prevu = result.data.response;
                        var items = {
                                        $edit: true,
                                        $selected: true,
                                        id: '0',        
                                        numero: 1,
                                        date_br: '',
                                        validation: 0,
                                        statu_fact:''
                                    };

                        vm.allfacture_moe_entete.push(items);
                        vm.allfacture_moe_entete.forEach(function(cis)
                        {
                            if(cis.$selected==true)
                            {
                                vm.selectedItemFacture_moe_entete = cis;
                            }
                        });
                        NouvelItemFacture_moe_entete = true;
                        
                    }         
                });
                
            }    
            else
            {
               vm.showAlert('Ajout facture','Un formulaire d\'ajout est déjà ouvert!!!');
            }  
          
        };

         //fonction ajout dans bdd
        function ajoutFacture_moe_entete(facture_moe_entete,suppression)
        {
            if (NouvelItemFacture_moe_entete==false)
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_entete/index",'menu',"getfacture_moevalideById",'id_facture_moe',facture_moe_entete.id).then(function(result)
                {
                  var facture_moe_entete_valide = result.data.response;
                  if (facture_moe_entete_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.allfacture_moe_entete = vm.allfacture_moe_entete.filter(function(obj)
                      {
                          return obj.id !== facture_moe_entete.id;
                      });
                      vm.steprubriquecalendrier=false;
                      vm.stepsousrubriquecalendrier=false;
                      vm.stepfacture_detail=false;
                      vm.stepjusti_facture_moe=false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                        test_existanceFacture_moe_entete (facture_moe_entete,suppression);    
                  }
                }); 
            } 
            else
            {
                insert_in_baseFacture_moe_entete(facture_moe_entete,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerFacture_moe_entete = function(item)
        {
          if (NouvelItemFacture_moe_entete == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_batiment_mpe.id_contrat_prestataire ;
            item.numero   = currentItemFacture_moe_entete.numero ;
            item.date_br   = currentItemFacture_moe_entete.date_br ;
            item.statu_fact   = currentItemFacture_moe_entete.statu_fact ;
          }else
          {
            vm.allfacture_moe_entete = vm.allfacture_moe_entete.filter(function(obj)
            {
                return obj.id !== vm.selectedItemFacture_moe_entete.id;
            });
          }

          vm.selectedItemFacture_moe_entete = {} ;
          NouvelItemFacture_moe_entete      = false;
          
        };

//fonction selection item Demande_batiment_mpe
        vm.selectionFacture_moe_entete= function (item)
        {
            vm.selectedItemFacture_moe_entete = item;
           // vm.NouvelItemFacture_moe_entete   = item;
           if (item.$edit==false || item.$edit==undefined)
           {
                currentItemFacture_moe_entete    = JSON.parse(JSON.stringify(vm.selectedItemFacture_moe_entete));
                vm.stepjusti_facture_moe = true;
                vm.steprubriquecalendrier = true;
           }
           else
           {
            vm.stepjusti_facture_moe = false;
            vm.steprubriquecalendrier = false;
           }

            vm.validation_fact_moe = item.validation
            
            vm.stepsousrubriquecalendrier = false;
            
            vm.stepfacture_detail = false;   
        };
        $scope.$watch('vm.selectedItemFacture_moe_entete', function()
        {
             if (!vm.allfacture_moe_entete) return;
             vm.allfacture_moe_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemFacture_moe_entete.$selected = true;
        });


        vm.modifierFacture_moe_entete = function(item)
        {
            NouvelItemFacture_moe_entete = false ;
            vm.selectedItemFacture_moe_entete = item;
            currentItemFacture_moe_entete = angular.copy(vm.selectedItemFacture_moe_entete);
            $scope.vm.allfacture_moe_entete.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemPv_consta_entete_travaux.contrat_prestataire.id ;
            item.numero   = vm.selectedItemFacture_moe_entete.numero ;
            item.date_br   = new Date(vm.selectedItemFacture_moe_entete.date_br) ;
            item.statu_fact   = vm.selectedItemFacture_moe_entete.statu_fact ;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerFacture_moe_entete = function()
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
                vm.ajoutFacture_moe_entete(vm.selectedItemFacture_moe_entete,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceFacture_moe_entete (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allfacture_moe_entete.filter(function(obj)
                {
                   return obj.id == currentItemFacture_moe_entete.id;
                });
                if(pass[0])
                {
                   if((pass[0].numero   != currentItemFacture_moe_entete.numero )
                    || (pass[0].date_br   != currentItemFacture_moe_entete.date_br )
                    || (pass[0].statu_fact   != currentItemFacture_moe_entete.statu_fact ))                   
                      { 
                         insert_in_baseFacture_moe_entete(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseFacture_moe_entete(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Facture_moe_entete
        function insert_in_baseFacture_moe_entete(facture_moe_entete,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemFacture_moe_entete==false)
            {
                getId = vm.selectedItemFacture_moe_entete.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    numero: facture_moe_entete.numero,
                    date_br:convertionDate(new Date(facture_moe_entete.date_br)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: 0 ,
                    statu_fact: facture_moe_entete.statu_fact              
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_moe_entete/index",datas, config).success(function (data)
            {

                if (NouvelItemFacture_moe_entete == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemFacture_moe_entete.$selected  = false;
                        vm.selectedItemFacture_moe_entete.$edit      = false;
                        vm.selectedItemFacture_moe_entete ={};
                    }
                    else 
                    {    
                      vm.allfacture_moe_entete = vm.allfacture_moe_entete.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemFacture_moe_entete.id;
                      });

                    NouvelItemFacture_moe_entete      = false;
                    }
                    
                }
                else
                {                  
                  facture_moe_entete.id  =   String(data.response);

                NouvelItemFacture_moe_entete      = false;
                }
              //vm.showboutonValider = false;

              facture_moe_entete.$selected = false;
              facture_moe_entete.$edit = false;
              vm.selectedItemFacture_moe_entete = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

    /**************************************fin facture moe entete*********************************************/

    /**************************************debut facture moe detail*********************************************/

      vm.click_step_rubrique_calendrier_paie_moe = function()
      { 
        vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("divers_rubrique_calendrier_paie_moe/index","menu","getrubrique_calendrier_moewithmontantByentetecontrat",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id,'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
        {
            vm.allrubrique_calendrier_paie_moe = result.data.response;
            vm.affiche_load =false;
            console.log(vm.allrubrique_calendrier_paie_moe);
        });

        vm.stepsousrubriquecalendrier = false;
        vm.stepfacture_detail = false;
      }

      vm.rubrique_calendrier_paie_moe_column =[
        {titre:"Libelle"
        },
        {titre:"Pourcentage"
        },
        {titre:"Cout"
        },
        {titre:"Pourcentage période"
        },
        {titre:"Pourcentage antérieure"
        },
        {titre:"Pourcentage cumulée"
        },
        {titre:"Montant période"
        },
        {titre:"Montant antérieure"
        },
        {titre:"Montant cumulée"
        }];

        //vm.allrubrique_calendrier_paie_moe = [];

        vm.selectionRubrique_calendrier_paie_moe= function (item)
        {
            vm.selectedItemRubrique_calendrier_paie_moe = item; 


        vm.stepsousrubriquecalendrier = true;
        vm.stepfacture_detail = false;  
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

        vm.Total_pource_rubrique_moe = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_prevu += parseFloat(product.pourcentage);
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

        vm.Total_pourcecumul_rubrique_moe = function()
        {
            var total_cumulc = 0;
            var total_prevuc = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_cumulc += parseFloat(product.montant_cumul);
                    total_prevuc += parseFloat(product.montant_prevu);
                }
            }
            var tot=((total_cumulc*100)/total_prevuc);

            var nbr=parseFloat(tot);
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

        vm.Total_pourceanterieur_rubrique_moe = function()
        {
            var total_prevu = 0;
            var total_anterieur = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
           var tot= ((total_anterieur*100)/total_prevu);

            var nbr=parseFloat(tot);
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

        vm.Total_pourceperiode_rubrique_moe = function()
        {
            var total_prevu = 0;
            var total_periode = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_periode += parseFloat(product.montant_periode);
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
            var tot= ((total_periode*100)/total_prevu);

            var nbr=parseFloat(tot);
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

        vm.Total_montantcumul_rubrique_moe = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_prevu += parseFloat(product.montant_cumul);
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

        vm.Total_montantanterieur_rubrique_moe = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_prevu += parseFloat(product.montant_anterieur);
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

        vm.Total_montantperiode_rubrique_moe = function()
        {
            var total_prevu = 0;
            if (vm.allrubrique_calendrier_paie_moe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_calendrier_paie_moe.length; i++){
                    var product = vm.allrubrique_calendrier_paie_moe[i];
                    total_prevu += parseFloat(product.montant_periode);
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

    /**************************************fin facture moe detail*********************************************/
/**************************************debut facture moe detail*********************************************/

      vm.click_step_sousrubrique_calendrier_paie_moe = function()
      { 
        vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("divers_sousrubrique_calendrier_paie_moe/index","menu","getsousrubrique_calendrier_moewithmontantByentetecontrat",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id,'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'id_rubrique',vm.selectedItemRubrique_calendrier_paie_moe.id).then(function(result)
        {
            vm.allsousrubrique_calendrier_paie_moe = result.data.response;
            vm.affiche_load =false;
            console.log(vm.allsousrubrique_calendrier_paie_moe);
        });

        vm.stepfacture_detail = false;
      }

      vm.sousrubrique_calendrier_paie_moe_column =[
        {titre:"Libelle"
        },
        {titre:"Pourcentage"
        },
        {titre:"Cout"
        },
        {titre:"Pourcentage période"
        },
        {titre:"Pourcentage antérieure"
        },
        {titre:"Pourcentage cumulée"
        },
        {titre:"Montant période"
        },
        {titre:"Montant antérieure"
        },
        {titre:"Montant cumulée"
        }];

        vm.selectionSousrubrique_calendrier_paie_moe= function (item)
        {
            vm.selectedItemSousrubrique_calendrier_paie_moe = item; 

            vm.stepfacture_detail = true;  
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

    /**************************************fin facture moe detail*********************************************/
    /**********************************************debut attachement batiment travauxe***************************************************/
        vm.click_step_facture_moe_detail = function()
        {   vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("facture_moe_detail/index","menu","getfacture_moe_detailwithcalendrier_detailbyentete",
                    "id_facture_moe_entete",vm.selectedItemFacture_moe_entete.id,"id_sousrubrique",vm.selectedItemSousrubrique_calendrier_paie_moe.id,
                    "id_contrat_bureau_etude",vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allfacture_moe_detail = result.data.response;
                vm.affiche_load =false;
                console.log(vm.allfacture_moe_detail);
            });
        }
        vm.change_montant_periode = function(item)
        { 
            var cumul_montant   =   0;
            var pourcentage_periode =   0;
            var pourcentage_anterieur =   0;
            var pourcentage_cumul =   0;

            pourcentage_periode     =   (parseFloat(item.montant_periode) * (parseFloat(item.pourcentage)))/parseFloat(item.montant_prevu);
            item.pourcentage_periode  =   pourcentage_periode.toFixed(3);

            cumul_montant           =   parseFloat(currentItemFacture_moe_detail.montant_cumul)-parseFloat(currentItemFacture_moe_detail.montant_periode) + parseFloat(item.montant_periode) ;
            pourcentage_cumul       =   (parseFloat(cumul_montant) * (parseFloat(item.pourcentage)))/parseFloat(item.montant_prevu);
            item.montant_cumul      =   cumul_montant;
            item.pourcentage_cumul  =   pourcentage_cumul.toFixed(3);
            apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontratbyid','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai',item.code,'id_facture_detail_moe',item.id).then(function(result)
            {   
                var montant = result.data.response;
                var monta_current = 0;
                if (montant.length!=0) 
                {   
                    if (montant[0].montant_periode) 
                    {
                        monta_current = monta_current + parseFloat(montant[0].montant_periode);
                    }
                }
                console.log()
                monta_current = monta_current + parseFloat(item.montant_periode);
                if (parseFloat(item.montant_prevu_detail)<parseFloat(monta_current))
                {
                    item.montant_periode = 0;
                    vm.showAlert('Ajout facture','Le montant que vous avez entré est supérieure au montant prévu');
                }
            });
        }
        //fonction ajout dans bdd
        function ajoutFacture_moe_detail(facture_moe_detail,suppression)
        {
            if (NouvelItemFacture_moe_detail==false)
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_entete/index",'menu',"getfacture_moevalideById",'id_facture_moe',vm.selectedItemFacture_moe_entete.id).then(function(result)
                {
                  var facture_moe_entete_valide = result.data.response;
                  if (facture_moe_entete_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.steprubriquecalendrier=false;
                      vm.stepsousrubriquecalendrier=false;
                      vm.stepfacture_detail=false;
                      vm.stepjusti_facture_moe=false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceFacture_moe_detail (facture_moe_detail,suppression);  
                  }
                }); 
            } 
            else
            {
                insert_in_baseFacture_moe_detail(facture_moe_detail,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_batiment_travaux
        vm.annulerFacture_moe_detail = function(item)
        {
          if (NouvelItemFacture_moe_detail == false)
          {
            item.$edit = false;
            item.$selected = false;

            item.montant_periode    = currentItemFacture_moe_detail.montant_periode ;
            item.pourcentage_periode = currentItemFacture_moe_detail.pourcentage_periode ;
            item.montant_cumul      = currentItemFacture_moe_detail.montant_cumul ;
            item.pourcentage_cumul  = currentItemFacture_moe_detail.pourcentage_cumul ;
            item.id_calendrier_paie_moe_prevu   = currentItemFacture_moe_detail.id_calendrier_paie_moe_prevu ;
          }else
          { 
            item.$edit = false;
            item.$selected = false;
            item.montant_periode    = 0 ;
            item.pourcentage_periode = 0;
            item.montant_cumul      = currentItemFacture_moe_detail.montant_cumul ;
            item.pourcentage_cumul  = currentItemFacture_moe_detail.pourcentage_cumul ;
          }

          vm.selectedItemFacture_moe_detail = {} ;
          NouvelItemFacture_moe_detail      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionFacture_moe_detail= function (item)
        {
            vm.selectedItemFacture_moe_detail = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemFacture_moe_detail    = JSON.parse(JSON.stringify(vm.selectedItemFacture_moe_detail));             
            }
            console.log(currentItemFacture_moe_detail);
        };
        $scope.$watch('vm.selectedItemFacture_moe_detail', function()
        {
             if (!vm.allfacture_moe_detail) return;
             vm.allfacture_moe_detail.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemFacture_moe_detail.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierFacture_moe_detail = function(item)
        {   
            if (item.code=='p1')
            {
                vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
            }
            if (item.code=='p2' || item.code=='p5')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai','p1').then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment \'Etude\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment \'Etude\'');
                    }
                });
            }

            if (item.code=='p3')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai','p2').then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Batiment \'P1\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Batiment \'P1\'');
                    }
                });
            }
            if (item.code=='p4')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai','p3').then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Batiment \'P2\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Batiment \'P2\'');
                    }
                });
            }

            if (item.code=='p6')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai','p5').then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Latrine \'P1\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Latrine \'P1\'');
                    }
                });
            }

            if (item.code=='p7')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai','p6').then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Latrine \'P2\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Latrine \'P2\'');
                    }
                });
            }

            if (item.code=='p8')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieur_p8bycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment  \'Etude\,contrôle et surveillance\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment \'Etude\, contrôle et surveillance\'');
                    }
                });
            }

            if (item.code=='p9')
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieur_p9bycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                {
                    var montant = result.data.response;
                    console.log(montant);
                    if (montant.length!=0)
                    {                        
                        if (parseFloat(montant[0].montant_periode)==parseFloat(montant[0].montant_prevu))
                        {

                            vm.selectedItemFacture_moe_detail = item;
                            currentItemFacture_moe_detail = angular.copy(vm.selectedItemFacture_moe_detail);
                            $scope.vm.allfacture_moe_detail.forEach(function(jus) {
                              jus.$edit = false;
                            });
                            item.$edit = true;
                            item.$selected = true;
                            
                            item.montant_periode   = parseFloat(item.montant_periode) ;
                            item.observation   = parseFloat(item.observation) ;
                            NouvelItemFacture_moe_detail = true ;
                            if (parseInt(item.id)>0)
                            {   
                                NouvelItemFacture_moe_detail = false ;
                            }
                        }
                        else
                        {
                            vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Latrine \'Etude\,contrôle et surveillance\,RTF\'');
                        }
                    }
                    else
                    {
                        vm.showAlert('Ajout facture refusée','Vous devriez completer le paimment Latrine \'Etude\,contrôle et surveillance\,RTF\'');
                    }
                });
            }

            
        };

        //fonction bouton suppression item divers_attachement_batiment_travaux
        vm.supprimerFacture_moe_detail = function()
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
                vm.ajoutFacture_moe_detail(vm.selectedItemFacture_moe_detail,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceFacture_moe_detail (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allfacture_moe_detail.filter(function(obj)
                {
                   return obj.id == currentItemFacture_moe_detail.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_periode != currentItemFacture_moe_detail.montant_periode )
                    || (mem[0].observation != currentItemFacture_moe_detail.observation ))                   
                    { 
                        insert_in_baseFacture_moe_detail(item,suppression);
                    }
                    else
                    {  
                        item.$selected = true;
                        item.$edit = false;
                    }
                }
            } else
                  insert_in_baseFacture_moe_detail(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_batiment_travaux
        function insert_in_baseFacture_moe_detail(facture_moe_detail,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemFacture_moe_detail==false)
            {
                getId = vm.selectedItemFacture_moe_detail.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_periode: facture_moe_detail.montant_periode,
                    observation: facture_moe_detail.observation,
                    id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                    id_calendrier_paie_moe_prevu: facture_moe_detail.id_calendrier_paie_moe_prevu            
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_moe_detail/index",datas, config).success(function (data)
            {
                
              if (NouvelItemFacture_moe_detail == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {   
                        //vm.selectedItemDivers_attachement_batiment_travaux.attachement_batiment_prevu  = bat_prevu[0];
                      if (facture_moe_detail.code=='p2')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p3')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                      if (facture_moe_detail.code=='p3')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p4')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                      if (facture_moe_detail.code=='p5')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p6')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                      if (facture_moe_detail.code=='p6')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p7')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                        vm.selectedItemFacture_moe_detail.$selected  = false;
                        vm.selectedItemFacture_moe_detail.$edit      = false;
                        vm.selectedItemFacture_moe_detail ={};
                    }
                    else 
                    {  
                        var montant_cumul = parseFloat(facture_moe_detail.montant_cumul) - parseFloat(facture_moe_detail.montant_periode);
                        var pourcentage_cumul = (montant_cumul*100)/parseFloat(facture_moe_detail.montant_prevu);
                        if (facture_moe_detail.code=='p2')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p3')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                      if (facture_moe_detail.code=='p3')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p4')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                      if (facture_moe_detail.code=='p5')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p6')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                      if (facture_moe_detail.code=='p6')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p7')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(montant_cumul) - parseFloat(currentItemFacture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                        vm.selectedItemFacture_moe_detail.montant_periode    = 0 ;
                        vm.selectedItemFacture_moe_detail.pourcentage_periode = 0 ;
                        vm.selectedItemFacture_moe_detail.montant_cumul      = montant_cumul;
                        vm.selectedItemFacture_moe_detail.pourcentage_cumul  = pourcentage_cumul;
                        vm.selectedItemFacture_moe_detail.id   = null ;                     
                    }
              }
              else
              {
                  facture_moe_detail.id  =   String(data.response); 
                  //divers_attachement_batiment_travaux.attachement_batiment_prevu  = bat_prevu[0];             
                  NouvelItemFacture_moe_detail = false; 
                  console.log(facture_moe_detail);
                  if (facture_moe_detail.code=='p2')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p3')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                  if (facture_moe_detail.code=='p3')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p4')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      } 
                  if (facture_moe_detail.code=='p5')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p6')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }
                  if (facture_moe_detail.code=='p6')
                      {

                        vm.allfacture_moe_detail.forEach(function(ite)
                        {

                            if (ite.code=='p7')
                            {   
                                var m_anterireur =parseFloat(ite.montant_anterieur) + parseFloat(facture_moe_detail.montant_cumul);
                                var m_cumul =parseFloat(ite.montant_cumul) + parseFloat(facture_moe_detail.montant_cumul);
                                ite.montant_anterieur = m_anterireur;
                                ite.montant_cumul = m_cumul; 
                                ite.pourcentage_anterieur = (m_anterireur * 100)/parseFloat(ite.montant_prevu);
                                ite.pourcentage_cumul = (m_cumul * 100)/parseFloat(ite.montant_prevu);
                            }
                        });
                      }                    
              } 
              facture_moe_detail.$selected = false;
              facture_moe_detail.$edit = false;
              vm.selectedItemFacture_moe_detail ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement batiment travaux***********************************************/

/**********************************fin justificatif attachement****************************************/
    vm.click_step_justi_facture_moe = function()
    {   
        vm.affiche_load =true;
        NouvelItemJustificatif_facture_moe = false;
        apiFactory.getAPIgeneraliserREST("justificatif_facture_moe/index",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id).then(function(result)
        {
            vm.alljustificatif_facture_moe = result.data.response;
            vm.affiche_load =false;
        });
    }
//col table
        vm.justificatif_facture_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile_justi_facture_moe = function(event)
       {
          //console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
         // vm.selectedItemJustificatif_facture_moe.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemJustificatif_facture_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_facture_moe = function ()
        { 
          if (NouvelItemJustificatif_facture_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_facture_moe.push(items);
            vm.alljustificatif_facture_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_facture_moe = mem;
              }
            });

            NouvelItemJustificatif_facture_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_facture_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_facture_moe(justificatif_facture_moe,suppression)
        {
            if (NouvelItemJustificatif_facture_moe==false)
            {
                apiFactory.getAPIgeneraliserREST("facture_moe_entete/index",'menu',"getfacture_moevalideById",'id_facture_moe',vm.selectedItemFacture_moe_entete.id).then(function(result)
                {
                  var facture_moe_entete_valide = result.data.response;
                  if (facture_moe_entete_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.steprubriquecalendrier=false;
                      vm.stepsousrubriquecalendrier=false;
                      vm.stepfacture_detail=false;
                      vm.stepjusti_facture_moe=false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceJustificatif_facture_moe (justificatif_facture_moe,suppression); 
                  }
                }); 
            } 
            else
            {
                insert_in_baseJustificatif_facture_moe(justificatif_facture_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_facture_moe
        vm.annulerJustificatif_facture_moe = function(item)
        {
          if (NouvelItemJustificatif_facture_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_facture_moe.description ;
            item.fichier   = currentItemJustificatif_facture_moe.fichier ;
          }else
          {
            vm.alljustificatif_facture_moe = vm.alljustificatif_facture_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_facture_moe.id;
            });
          }

          vm.selectedItemJustificatif_facture_moe = {} ;
          NouvelItemJustificatif_facture_moe      = false;
          
        };

        //fonction selection item justificatif facture_moe
        vm.selectionJustificatif_facture_moe= function (item)
        {
            vm.selectedItemJustificatif_facture_moe = item;
            if (item.$edit==false || item.$edit==undefined)
           {
                currentItemJustificatif_facture_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_facture_moe)); 
            }
        };
        $scope.$watch('vm.selectedItemJustificatif_facture_moe', function()
        {
             if (!vm.alljustificatif_facture_moe) return;
             vm.alljustificatif_facture_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_facture_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_facture_moe = function(item)
        {
            NouvelItemJustificatif_facture_moe = false ;
            vm.selectedItemJustificatif_facture_moe = item;
            currentItemJustificatif_facture_moe = angular.copy(vm.selectedItemJustificatif_facture_moe);
            $scope.vm.alljustificatif_facture_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_facture_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_facture_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_facture_moe
        vm.supprimerJustificatif_facture_moe = function()
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
                vm.ajoutJustificatif_facture_moe(vm.selectedItemJustificatif_facture_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_facture_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_facture_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_facture_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_facture_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_facture_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_facture_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_facture_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_facture_moe
        function insert_in_baseJustificatif_facture_moe(justificatif_facture_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_facture_moe==false)
            {
                getId = vm.selectedItemJustificatif_facture_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_facture_moe.description,
                    fichier: justificatif_facture_moe.fichier,
                    id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_facture_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                    
                          var repertoire = 'justificatif_facture_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_facture_moe.id
                                              
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
                                    justificatif_facture_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: currentItemJustificatif_facture_moe.description,
                                                      fichier: currentItemJustificatif_facture_moe.fichier,
                                                        id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_facture_moe.$selected = false;
                                          justificatif_facture_moe.$edit = false;
                                          justificatif_facture_moe.fichier=currentItemJustificatif_facture_moe.fichier;
                                          vm.selectedItemJustificatif_facture_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_facture_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_facture_moe.description,
                                        fichier: justificatif_facture_moe.fichier,                                        
                                        id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_facture_moe.$selected = false;
                                      justificatif_facture_moe.$edit = false;
                                      vm.selectedItemJustificatif_facture_moe = {};
                                      var chemin= currentItemJustificatif_facture_moe.fichier;
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
                                                      description: currentItemJustificatif_facture_moe.description,
                                                      fichier: currentItemJustificatif_facture_moe.fichier,
                                                        id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_facture_moe.$selected = false;
                                          justificatif_facture_moe.$edit = false;
                                          justificatif_facture_moe.fichier=currentItemJustificatif_facture_moe.fichier;
                                          vm.selectedItemJustificatif_facture_moe = {};
                                      
                                      });
                            });
                          }


                        vm.selectedItemJustificatif_facture_moe.$selected  = false;
                        vm.selectedItemJustificatif_facture_moe.$edit      = false;
                        vm.selectedItemJustificatif_facture_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_facture_moe = vm.alljustificatif_facture_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_facture_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_facture_moe.fichier;
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
                  justificatif_facture_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_facture_moe = false;

                  vm.showbuttonNouvManuel = false;
                    
                    
                    var repertoire = 'justificatif_facture_moe/';
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
                              justificatif_facture_moe.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                description: currentItemJustificatif_facture_moe.description,
                                                fichier: currentItemJustificatif_facture_moe.fichier,                                                
                                                id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                                                
                                  });
                                apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
                                { 
                                  vm.alljustificatif_facture_moe = vm.alljustificatif_facture_moe.filter(function(obj)
                                  {
                                      return obj.id !== getIdFile;
                                  });
                                  justificatif_facture_moe.$selected = false;
                                    justificatif_facture_moe.$edit = false;
                                    //justificatif_facture_moe.fichier=currentItemJustificatif_facture_moe.fichier;
                                    //vm.selectedItemJustificatif_facture_moe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_facture_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_facture_moe.description,
                                  fichier: justificatif_facture_moe.fichier,                                  
                                id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                                               
                              });
                            apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_facture_moe.$selected = false;
                                justificatif_facture_moe.$edit = false;
                                vm.selectedItemJustificatif_facture_moe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                                                      supprimer: 1,
                                                      id:        getIdFile,
                                                      description: currentItemJustificatif_facture_moe.description,
                                                      fichier: currentItemJustificatif_facture_moe.fichier,
                                                        id_facture_moe_entete: vm.selectedItemFacture_moe_entete.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_facture_moe/index",datas, config).success(function (data)
                                      {  
                                        vm.alljustificatif_facture_moe = vm.alljustificatif_facture_moe.filter(function(obj)
                                        {
                                            return obj.id !== getIdFile;
                                        });
                                        vm.showbuttonNouvManuel = true;
                                          justificatif_facture_moe.$selected = false;
                                          justificatif_facture_moe.$edit = false;
                                          //justificatif_facture_moe.fichier=currentItemJustificatif_facture_moe.fichier;
                                          //vm.selectedItemJustificatif_facture_moe = {};
                                      
                                      });
                      });
                    }
              }
              justificatif_facture_moe.$selected = false;
              justificatif_facture_moe.$edit = false;
              //vm.selectedItemJustificatif_facture_moe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece_facture_moe = function(item)
        {
            window.open(apiUrlFile+item.fichier);
        }
/***************************************fin justificatif facture_moe**********************************************/

/*******************************************fin suivi paiement moe************************************************/

/*******************************************debut contrat prestataire**********************************************/
   vm.step_contrat_mpe = function ()
    {
        vm.styleTabfils = "acc_sous_menu";            
    }     
//col table
        vm.contrat_prestataire_column = [
        {titre:"Prestataire"
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

            if(item.id!=0)
            {
                vm.stepsuivi_paiement_mpe = true;
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

       
        
/**********************************fin contrat_prestataire****************************************/

/************************************************debut avance demarrage*************************************************/
        vm.click_tabs_suivi_paiement = function()
        {   
            vm.steppv_consta_mpe = false;
            vm.affiche_load =true;
            NouvelItemAvance_demarrage = false;
            NouvelItemPv_consta_entete_travaux = false;
            apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavance_demarrageBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavance_demarrage = result.data.response.filter(function(obj)
                {
                    return obj.validation == 0;
                });
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvAvance_demarrage = false;
                }
                vm.steppv_consta_mpe = true;
                vm.affiche_load =false;
            });
            vm.stepfacture_mpe = false;
            vm.stepdecompte = false;
            vm.stepjusti_pv_consta_entete_travaux_mpe = false; 
        }

        vm.click_tab_avance_mpe = function()
        { 
            vm.stepfacture_mpe = false;            
            NouvelItemAvance_demarrage = false;
        }
        vm.avance_demarrage_column = [        
        {titre:"Description"
        },
        {titre:"Montant avance"
        },
        {titre:"Pourcentage rabais"
        },
        {titre:"Montant rabais"
        },
        {titre:"Taxe sur marchés public"
        },
        {titre:"Net à payer"
        },
        {titre:"Date_signature"
        },
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterAvance_demarrage = function ()
        { 
            var montant_avance = ((parseFloat(vm.selectedItemContrat_prestataire.cout_batiment) + 
            parseFloat(vm.selectedItemContrat_prestataire.cout_mobilier) + 
            parseFloat(vm.selectedItemContrat_prestataire.cout_latrine))*10)/100;            
            var taxe_marche_publ = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_avance))/100;
          var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',        
              description: '',
              date_signature: '',
              net_payer: montant_avance-taxe_marche_publ,
              montant_avance: montant_avance,
              pourcentage_rabais: 0,
              montant_rabais: 0,
              taxe_marche_public: taxe_marche_publ,
              validation: 0
            };

        if (NouvelItemAvance_demarrage == false)
          {                      
            vm.allavance_demarrage.push(items);
            vm.allavance_demarrage.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemAvance_demarrage = cis;
              }
            });
            NouvelItemAvance_demarrage = true;
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };
        vm.change_pourcentage_rabais = function(avance_demarrage)
        {
            var montant_rab = (avance_demarrage.montant_avance * avance_demarrage.pourcentage_rabais)/100;
            var taxe_marche_publ = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(avance_demarrage.montant_avance))/100;
            var montant = avance_demarrage.montant_avance - montant_rab-taxe_marche_publ;

            vm.selectedItemAvance_demarrage.montant_rabais = montant_rab;
            vm.selectedItemAvance_demarrage.net_payer = montant;
        }
        //fonction ajout dans bdd
        function ajoutAvance_demarrage(avance_demarrage,suppression)
        {
            if (NouvelItemAvance_demarrage==false)
            {
                apiFactory.getAPIgeneraliserREST("avance_demarrage/index",'menu',"getavancevalideById",'id_avance_demarrage',vm.selectedItemAvance_demarrage.id).then(function(result)
                {
                  var avance_demarrage_valide = result.data.response;
                  if (avance_demarrage_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.allavance_demarrage = vm.allavance_demarrage.filter(function(obj)
                      {
                          return obj.id !== avance_demarrage.id;
                      });

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceAvance_demarrage (avance_demarrage,suppression);  
                  }
                }); 
            } 
            else
            {
                insert_in_baseAvance_demarrage(avance_demarrage,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerAvance_demarrage = function(item)
        {
          if (NouvelItemAvance_demarrage == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_batiment_mpe.id_contrat_prestataire ;
            item.description   = currentItemAvance_demarrage.description ;
            item.date_signature   = currentItemAvance_demarrage.date_signature ;
            item.net_payer   = currentItemAvance_demarrage.net_payer ;
            item.montant_avance   = currentItemAvance_demarrage.montant_avance ;
            item.pourcentage_rabais = currentItemAvance_demarrage.pourcentage_rabais ;
            item.montant_rabais = currentItemAvance_demarrage.montant_rabais;
            item.taxe_marche_public = currentItemAvance_demarrage.taxe_marche_public;
          }
          else
          {
            vm.allavance_demarrage = vm.allavance_demarrage.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvance_demarrage.id;
            });
          }

          vm.selectedItemAvance_demarrage = {} ;
          NouvelItemAvance_demarrage      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionAvance_demarrage= function (item)
        {
            vm.selectedItemAvance_demarrage = item;
           // vm.NouvelItemAvance_demarrage   = item;
           if(item.$edit!=false || item.$edit!=undefined)
           {
            currentItemAvance_demarrage    = JSON.parse(JSON.stringify(vm.selectedItemAvance_demarrage));
           }
            vm.validation_avance_demarrage = item.validation;  
        };
        $scope.$watch('vm.selectedItemAvance_demarrage', function()
        {
             if (!vm.allavance_demarrage) return;
             vm.allavance_demarrage.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvance_demarrage.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAvance_demarrage = function(item)
        {
            NouvelItemAvance_demarrage = false ;
            vm.selectedItemAvance_demarrage = item;
            currentItemAvance_demarrage = angular.copy(vm.selectedItemAvance_demarrage);
            $scope.vm.allavance_demarrage.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemAvance_demarrage.contrat_prestataire.id ;
            item.description   = vm.selectedItemAvance_demarrage.description ;
            item.date_signature   = new Date(vm.selectedItemAvance_demarrage.date_signature) ;
            item.net_payer   = parseFloat(vm.selectedItemAvance_demarrage.net_payer);
            item.montant_avance   = parseFloat(vm.selectedItemAvance_demarrage.montant_avance) ;
            item.pourcentage_rabais = parseFloat(vm.selectedItemAvance_demarrage.pourcentage_rabais) ;
            item.montant_rabais = parseFloat(vm.selectedItemAvance_demarrage.montant_rabais) ;
            item.taxe_marche_public = parseFloat(vm.selectedItemAvance_demarrage.taxe_marche_public) ;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerAvance_demarrage = function()
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
                vm.ajoutAvance_demarrage(vm.selectedItemAvance_demarrage,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvance_demarrage (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavance_demarrage.filter(function(obj)
                {
                   return obj.id == currentItemAvance_demarrage.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvance_demarrage.description )
                    || (pass[0].date_signature   != currentItemAvance_demarrage.date_signature )
                    || (pass[0].net_payer   != currentItemAvance_demarrage.net_payer )
                    || (pass[0].pourcentage_rabais != currentItemAvance_demarrage.pourcentage_rabais )
                    || (pass[0].montant_rabais != currentItemAvance_demarrage.montant_rabais )
                    || (pass[0].montant_avance   != currentItemAvance_demarrage.montant_avance )
                    || (pass[0].taxe_marche_public   != currentItemAvance_demarrage.taxe_marche_public ) )                   
                      { 
                         insert_in_baseAvance_demarrage(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvance_demarrage(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Avance_demarrage
        function insert_in_baseAvance_demarrage(avance_demarrage,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvance_demarrage==false)
            {
                getId = vm.selectedItemAvance_demarrage.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avance_demarrage.description,
                    date_signature:convertionDate(avance_demarrage.date_signature),
                    montant_avance:avance_demarrage.montant_avance,
                    net_payer: avance_demarrage.net_payer,
                    pourcentage_rabais: avance_demarrage.pourcentage_rabais ,
                    montant_rabais: avance_demarrage.montant_rabais ,
                    taxe_marche_public: avance_demarrage.taxe_marche_public ,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avance_demarrage/index",datas, config).success(function (data)
            {

                if (NouvelItemAvance_demarrage == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAvance_demarrage.$selected  = false;
                        vm.selectedItemAvance_demarrage.$edit      = false;
                        vm.selectedItemAvance_demarrage ={};
                    }
                    else 
                    {    
                      vm.allavance_demarrage = vm.allavance_demarrage.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvance_demarrage.id;
                      });
                      vm.showbuttonNouvAvance_demarrage = true;
                    }
                    
                }
                else
                {                  
                  avance_demarrage.id  =   String(data.response);
                  vm.showbuttonNouvAvance_demarrage = false;
                }
              //vm.showboutonValider = false;

              avance_demarrage.$selected = false;
              avance_demarrage.$edit = false;
              vm.selectedItemAvance_demarrage = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/

/************************************************debut facture*************************************************/
        vm.click_tab_facture_mpe = function()
        {
            vm.styleTabfils2 = "acc_sous_menu";
            vm.affiche_load =true;

            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
            {
                   vm.facture_mpe = result.data.response;
                    if (Object.keys(result.data.response).length>0)
                    {
                        vm.validation_facture_mpe = result.data.response.validation;
                        vm.showbuttonNouvFacture_mpe = false; 
                        vm.id_facture_mpe = parseInt(result.data.response.id);
                    }else{
                        vm.validation_facture_mpe = 0;
                        vm.showbuttonNouvFacture_mpe = true;
                        vm.id_facture_mpe = 0;
                    }
                    vm.affiche_load =false;
                    console.log(Object.keys(result.data.response).length);
            });
        }
        vm.facture_mpe_column = [        
        {titre:"Numero"
        },
        {titre:"Montant travaux"
        },
        {titre:"Pourcentage rabais"
        },
        {titre:"Montant rabais"
        },
        {titre:"Montant HT"
        },
        {titre:"TVA de 20%"
        },
        {titre:"Montant TTC"
        },
        {titre:"Remboursement acompte"
        },
        {titre:"Pénalité de retard"
        },
        {titre:"Retenue de garantie"
        },
        {titre:"Remboursement plaque"
        },
        {titre:"Taxe sur les marchés publics"
        },
        {titre:"Net à payer"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterFacture_mpe = function ()
        { 
            if (NouvelItemFacture_mpe == false)
            {
                var items = {
                        $edit: true,
                        $selected: true,
                        id: '0',         
                        id_contrat_prestataire: '',        
                        numero: vm.selectedItemPv_consta_entete_travaux.numero,
                        montant_travaux: parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode) ,
                        pourcentage_rabais: 0,
                        montant_rabais: 0,
                        montant_ht: parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode),
                        montant_tva: 0,   
                        montant_ttc: parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode), 
                        remboursement_acompte: 0,   
                        penalite_retard: 0, 
                        retenue_garantie: (parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode)*5)/100, 
                        remboursement_plaque: 0,
                        taxe_marche_public : (parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode)*parseFloat(vm.alltaxe_marche_public[0].pourcentage))/100,     
                        net_payer: parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode)-(((parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode)*parseFloat(vm.alltaxe_marche_public[0].pourcentage))/100)+((parseFloat(vm.selectedItemPv_consta_entete_travaux.total_periode)*5)/100)),  
                        date_signature: '',
                        validation: 0
                    };
                            
            vm.allfacture_mpe.push(items);
            vm.allfacture_mpe.forEach(function(cis)
            {
              if(cis.$selected==true)
                {
                  vm.selectedItemFacture_mpe = cis;
                }
            });
            NouvelItemFacture_mpe = true;

          }
          else
          {
              vm.showAlert('Ajout facture','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        vm.change_pourcentage_rabais_mpe = function(facture_mpe)
        {    
            var montant_rabais = (facture_mpe.montant_travaux * facture_mpe.pourcentage_rabais)/100;
            var montant_ht =  facture_mpe.montant_travaux-montant_rabais;
            var montant_tva = 0;
            var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* (parseFloat(montant_ht)+parseFloat(montant_tva)))/100;
            vm.selectedItemFacture_mpe.montant_rabais = montant_rabais;
            vm.selectedItemFacture_mpe.montant_ht = montant_ht;
            vm.selectedItemFacture_mpe.montant_tva = montant_tva;
            vm.selectedItemFacture_mpe.taxe_marche_public = taxe_marche_public;

            vm.selectedItemFacture_mpe.montant_ttc = montant_ht + montant_tva;
            vm.selectedItemFacture_mpe.net_payer = montant_ht + montant_tva - (facture_mpe.remboursement_acompte + 
                facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque + taxe_marche_public);
        }
        vm.change_penalite_retard_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque + facture_mpe.taxe_marche_public);
        }
        vm.change_retenue_garantie_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque + facture_mpe.taxe_marche_public);
        }
        vm.change_remboursement_acompte_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = (parseFloat(facture_mpe.montant_ht) + parseFloat(facture_mpe.montant_tva)) - 
            (parseFloat(facture_mpe.remboursement_acompte )+ parseFloat(facture_mpe.retenue_garantie) + parseFloat(facture_mpe.penalite_retard) + parseFloat(facture_mpe.remboursement_plaque) + parseFloat(facture_mpe.taxe_marche_public));
            console.log(vm.selectedItemFacture_mpe);
        }

        vm.change_remboursement_plaque_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque + facture_mpe.taxe_marche_public);
        }
        //fonction ajout dans bdd
        function ajoutFacture_mpe(facture_mpe,suppression)
        {
            if (NouvelItemFacture_mpe==false)
            {
                apiFactory.getAPIgeneraliserREST("facture_mpe/index",'menu',"getfacturevalideById",'id_facture_mpe',vm.selectedItemFacture_mpe.id).then(function(result)
                {
                  var facture_mpe_valide = result.data.response;
                  if (facture_mpe_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.stepfacture_mpe = false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceFacture_mpe (facture_mpe,suppression); 
                  }
                }); 
            } 
            else
            {
                insert_in_baseFacture_mpe(facture_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerFacture_mpe = function(item)
        {
          if (NouvelItemFacture_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_batiment_mpe.id_contrat_prestataire ;
            item.numero   = currentItemFacture_mpe.numero ;
            item.montant_rabais   = currentItemFacture_mpe.montant_rabais ;
            item.pourcentage_rabais   = currentItemFacture_mpe.pourcentage_rabais ;
            item.montant_travaux   = currentItemFacture_mpe.montant_travaux ;
            item.montant_ht   = currentItemFacture_mpe.montant_ht ;
            item.montant_tva   = currentItemFacture_mpe.montant_tva ;
            item.montant_ttc = currentItemFacture_mpe.montant_ttc ;
            item.remboursement_acompte = currentItemFacture_mpe.remboursement_acompte;
            item.penalite_retard   = currentItemFacture_mpe.penalite_retard ;
            item.retenue_garantie   = currentItemFacture_mpe.retenue_garantie ;
            item.remboursement_plaque = currentItemFacture_mpe.remboursement_plaque;
            item.taxe_marche_public = currentItemFacture_mpe.taxe_marche_public;
            item.net_payer   = currentItemFacture_mpe.net_payer ;
            item.date_signature   = currentItemFacture_mpe.date_signature ;
          }
          else
          {
            vm.allfacture_mpe = vm.allfacture_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemFacture_mpe.id;
            });
          }

          vm.selectedItemFacture_mpe = {} ;
          NouvelItemFacture_mpe      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionFacture_mpe= function (item)
        {
            vm.selectedItemFacture_mpe = item;
           // vm.NouvelItemAvance_demarrage   = item;
           if(item.$edit!=false || item.$edit!=undefined)
           {
            currentItemFacture_mpe    = JSON.parse(JSON.stringify(vm.selectedItemFacture_mpe)); 
           }
            vm.validation_facture_mpe = item.validation;
            vm.stepdecompte_mpe = true;
              
        };
        $scope.$watch('vm.selectedItemFacture_mpe', function()
        {
             if (!vm.allfacture_mpe) return;
             vm.allfacture_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemFacture_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierFacture_mpe = function(item)
        {

            NouvelItemFacture_mpe = false ;
            vm.selectedItemFacture_mpe = item;
            currentItemFacture_mpe = angular.copy(item);
            $scope.vm.allfacture_mpe.forEach(function(mem) {
              mem.$edit = false;
            });
            console.log(item);
            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemAvance_demarrage.contrat_prestataire.id ;
            item.numero   = vm.selectedItemFacture_mpe.numero ;
            item.date_signature   = new Date(vm.selectedItemFacture_mpe.date_signature) ;
            item.montant_travaux   = parseFloat(vm.selectedItemFacture_mpe.montant_travaux);
            item.pourcentage_rabais = parseFloat(vm.selectedItemFacture_mpe.pourcentage_rabais) ;
            item.montant_rabais = parseFloat(vm.selectedItemFacture_mpe.montant_rabais) ;
            item.montant_ht   = parseFloat(vm.selectedItemFacture_mpe.montant_ht) ;
            item.montant_tva   = parseFloat(vm.selectedItemFacture_mpe.montant_tva);
            item.montant_ttc   = parseFloat(vm.selectedItemFacture_mpe.montant_ttc) ;
            item.remboursement_acompte = parseFloat(vm.selectedItemFacture_mpe.remboursement_acompte) ;
            item.penalite_retard = parseFloat(vm.selectedItemFacture_mpe.penalite_retard) ;
            item.retenue_garantie = parseFloat(vm.selectedItemFacture_mpe.retenue_garantie) ;
            item.remboursement_plaque = parseFloat(vm.selectedItemFacture_mpe.remboursement_plaque) ;
            item.taxe_marche_public = parseFloat(vm.selectedItemFacture_mpe.taxe_marche_public) ;
            item.net_payer = parseFloat(vm.selectedItemFacture_mpe.net_payer) ;
        };
          
        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerFacture_mpe = function(facture_mpe)
        {   vm.selectedItemFacture_mpe = facture_mpe;
            currentItemFacture_mpe = facture_mpe;
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
//console.log(facture_mpe);
                if (parseFloat(facture_mpe.montant_travaux)==0)
                {
                    vm.ajoutFacture_mpe(facture_mpe,1);
                    console.log(facture_mpe);
                }
                else
                {
                    vm.showAlert('La suppression est interrompue','vous devriez supprimer les détails de l\'attachement')
                }
              }, function() {
                //alert('rien');
              });
        };
        //function teste s'il existe une modification item feffi
        function test_existanceFacture_mpe (item,suppression)
        {          
            if (suppression!=1)
            {console.log('1');
               /*var pass = vm.allfacture_mpe.filter(function(obj)
                {
                   return obj.id == currentItemFacture_mpe.id;
                });*/
               console.log(currentItemFacture_mpe); 
               console.log(item);
                console.log('2');
                   if((currentItemFacture_mpe.numero   != item.numero )
                    || (currentItemFacture_mpe.montant_travaux   != item.montant_travaux )
                    || (currentItemFacture_mpe.pourcentage_rabais != item.pourcentage_rabais )
                    || (currentItemFacture_mpe.montant_rabais != item.montant_rabais )
                    || (currentItemFacture_mpe.montant_ht   != item.montant_ht )
                    || (currentItemFacture_mpe.montant_tva   != item.montant_tva )
                    || (currentItemFacture_mpe.montant_ttc   != item.montant_ttc ) 
                    || (currentItemFacture_mpe.remboursement_acompte   != item.remboursement_acompte )
                    || (currentItemFacture_mpe.penalite_retard != item.penalite_retard )
                    || (currentItemFacture_mpe.retenue_garantie != item.retenue_garantie )
                    || (currentItemFacture_mpe.remboursement_plaque   != item.remboursement_plaque ) 
                    || (currentItemFacture_mpe.taxe_marche_public   != item.taxe_marche_public ) 
                    || (currentItemFacture_mpe.net_payer   != item.net_payer )
                    || (currentItemFacture_mpe.date_signature   != item.date_signature ))                   
                      { 
                         insert_in_baseFacture_mpe(item,suppression);
                         console.log('3');
                      }
                      else
                      {  console.log('4');
                        item.$selected = true;
                        item.$edit = false;
                      }
                
            } else
                  insert_in_baseFacture_mpe(item,suppression);
                  console.log('5');
        }

        //insertion ou mise a jours ou suppression item dans bdd Avance_demarrage
        function insert_in_baseFacture_mpe(facture_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvance_demarrage==false)
            {
                getId = vm.selectedItemFacture_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    numero: facture_mpe.numero,
                    montant_travaux:facture_mpe.montant_travaux,
                    pourcentage_rabais: facture_mpe.pourcentage_rabais ,
                    montant_rabais: facture_mpe.montant_rabais,
                    montant_ht: facture_mpe.montant_ht,
                    montant_tva: facture_mpe.montant_tva,
                    montant_ttc:facture_mpe.montant_ttc,
                    remboursement_acompte: facture_mpe.remboursement_acompte ,
                    penalite_retard: facture_mpe.penalite_retard,
                    retenue_garantie: facture_mpe.retenue_garantie,
                    remboursement_plaque: facture_mpe.remboursement_plaque ,
                    taxe_marche_public: facture_mpe.taxe_marche_public ,
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(facture_mpe.date_signature) ,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {

                if (NouvelItemFacture_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemFacture_mpe.$selected  = false;
                        vm.selectedItemFacture_mpe.$edit      = false;
                        vm.selectedItemFacture_mpe ={};
                    }
                    else 
                    {    
                      vm.facture_mpe = {}
                      vm.showbuttonNouvFacture_mpe = true;
                      vm.id_facture_mpe = 0;
                    }
                    
                }
                else
                {                  
                  facture_mpe.id  =   String(data.response);
                  vm.id_facture_mpe = parseInt(data.response);
                  //vm.showbuttonNouvFacture_mpe = false;
                }
              //vm.showboutonValider = false;

              facture_mpe.$selected = false;
              facture_mpe.$edit = false;
              vm.selectedItemFacture_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/

/************************************************debut  pv constatation entete*************************************************/
       
        vm.click_tabs_pv_consta_entete_travaux = function()
        {   
            vm.affiche_load =true;
            NouvelItemPv_consta_entete_travaux = false;
            apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_entete_travauxBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allpv_consta_entete_travaux = result.data.response.filter(function(obj)
                {
                    return obj.validation_fact == null || obj.validation_fact == 0;
                });
                console.log(result.data.response);
               /* if (result.data.response.length>0)
                {
                    vm.showbuttonNouvPv_consta_entete_travaux = false;
                }*/
                vm.step_tranche_batiment_mpe = false;                
                vm.step_tranche_latrine_mpe = false;
                vm.step_tranche_mobilier_mpe = false;

                vm.steprubriquebatiment_mpe = false;
                vm.steprubriquelatrine_mpe = false;                
                vm.steprubriquemobilier_mpe = false;
                vm.stepdecompte =false;

                vm.steppv_consta_batiment_travaux = false;
                vm.steppv_consta_latrine_travaux = false;
                vm.steppv_consta_mobilier_travaux = false;
                vm.affiche_load =false;
                vm.id_facture_mpe = 0;
            });

            vm.stepfacture_mpe = false;            
            vm.stepjusti_pv_consta_entete_travaux_mpe = false;
        }
        vm.pv_consta_entete_travaux_column = [        
        {titre:"Numero"
        },
        {titre:"Date d\'établissement"
        },
        {titre:"Montant travaux"
        },
        {titre:"Avancement global période"
        },
        {titre:"Avancement global cumul"
        },
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterPv_consta_entete_travaux = function ()
        { 
            if (NouvelItemPv_consta_entete_travaux == false)
            {

                apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_entete_travauxBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                {   
                    var last_id_pv_consta_entete_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                    vm.dataLastepv_consta_entete_mpe = result.data.response.filter(function(obj){return obj.id == last_id_pv_consta_entete_mpe;});
                    //console.log(vm.dataLastepv_consta_entete_mpe);
                    if (vm.dataLastepv_consta_entete_mpe.length>0)
                    { 

                      switch (parseInt(vm.dataLastepv_consta_entete_mpe[0].validation_fact))
                        {
                          case 1:     //rejeter DPFI
                              {
                                var items = {
                                              $edit: true,
                                              $selected: true,
                                              id: '0',        
                                              numero: parseInt(vm.dataLastepv_consta_entete_mpe[0].numero),
                                              date_etablissement: '',
                                              montant_travaux: 0,
                                              avancement_global_periode: 0,
                                              avancement_global_cumul: parseFloat(vm.dataLastepv_consta_entete_mpe[0].avancement_global_cumul),
                                              validation_fact: null,
                                              id_fact: null
                                            };
                                                             
                                vm.allpv_consta_entete_travaux.unshift(items);
                                vm.allpv_consta_entete_travaux.forEach(function(cis)
                                {
                                  if(cis.$selected==true)
                                  {
                                    vm.selectedItemPv_consta_entete_travaux = cis;
                                  }
                                });
                                NouvelItemPv_consta_entete_travaux = true;

                               
                                break;
                              }
                          case 2: //Valider dpfi
                                {
                                  var items = {
                                                $edit: true,
                                                $selected: true,
                                                id: '0',        
                                                numero: parseInt(vm.dataLastepv_consta_entete_mpe[0].numero)+1 ,
                                                date_etablissement: '',
                                                montant_travaux:0,
                                                avancement_global_periode: 0,
                                                avancement_global_cumul:parseFloat(vm.dataLastepv_consta_entete_mpe[0].avancement_global_cumul),
                                                validation_fact: null,
                                                id_fact: null
                                              };
                                  
                                                              
                                  vm.allpv_consta_entete_travaux.unshift(items);
                                  vm.allpv_consta_entete_travaux.forEach(function(cis)
                                  {
                                    if(cis.$selected==true)
                                    {
                                      vm.selectedItemPv_consta_entete_travaux = cis;
                                    }
                                  });
                                  NouvelItemPv_consta_entete_travaux = true;
                                break;
                                }
                          default:
                                {
                                  vm.showAlert('Ajout réfuser','La dernière facture est en cours de traitement!!!');
                                  break;
                                }
                      
                        } 
                        
                    }
                    else
                    {   
                            var items = {
                                          $edit: true,
                                          $selected: true,
                                          id: '0',        
                                          numero: 1,
                                          date_etablissement: '',
                                          montant_travaux:0,
                                          avancement_global_periode: 0,
                                          avancement_global_cumul: 0,
                                          validation_fact: null,
                                          id_fact: null
                                        };

                                vm.allpv_consta_entete_travaux.unshift(items);
                                vm.allpv_consta_entete_travaux.forEach(function(cis)
                                {
                                    if(cis.$selected==true)
                                    {
                                        vm.selectedItemPv_consta_entete_travaux = cis;
                                    }
                                });
                                NouvelItemPv_consta_entete_travaux = true;
                      
                    }         
                });
                
            }    
            else
            {
               vm.showAlert('Ajout entete','Un formulaire d\'ajout est déjà ouvert!!!');
            }  
          
        };

        //fonction ajout dans bdd
        function ajoutPv_consta_entete_travaux(pv_consta_entete_travaux,suppression)
        {
            if (NouvelItemPv_consta_entete_travaux==false)
            {
                apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index",'menu',"getpv_consta_entete_travauxvalideById",'id_pv_consta_entete_travaux',pv_consta_entete_travaux.id).then(function(result)
                {
                  var pv_consta_entete_travaux_valide = result.data.response;
                  if (pv_consta_entete_travaux_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.allpv_consta_entete_travaux = vm.allpv_consta_entete_travaux.filter(function(obj)
                      {
                          return obj.id !== pv_consta_entete_travaux.id;
                      });
                      vm.step_tranche_batiment_mpe = false;                
                      vm.step_tranche_latrine_mpe = false;
                      vm.step_tranche_mobilier_mpe = false;

                      vm.steprubriquebatiment_mpe = false;
                      vm.steprubriquelatrine_mpe = false;                
                      vm.steprubriquemobilier_mpe = false;
                      vm.stepdecompte =false;
                      vm.steppv_consta_recap_travaux = false;

                      vm.steppv_consta_batiment_travaux = false;
                      vm.steppv_consta_latrine_travaux = false;
                      vm.steppv_consta_mobilier_travaux = false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existancePv_consta_entete_travaux (pv_consta_entete_travaux,suppression);   
                  }
                }); 
            } 
            else
            {
                insert_in_basePv_consta_entete_travaux(pv_consta_entete_travaux,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerPv_consta_entete_travaux = function(item)
        {
          if (NouvelItemPv_consta_entete_travaux == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_batiment_mpe.id_contrat_prestataire ;
            item.numero   = currentItemPv_consta_entete_travaux.numero ;
            item.date_etablissement   = currentItemPv_consta_entete_travaux.date_etablissement ;
            item.montant_travaux   = currentItemPv_consta_entete_travaux.montant_travaux ;
            item.avancement_global_periode   = currentItemPv_consta_entete_travaux.avancement_global_periode ;
            item.avancement_global_cumul   = currentItemPv_consta_entete_travaux.avancement_global_cumul ;
          }
          else
          {
            vm.allpv_consta_entete_travaux = vm.allpv_consta_entete_travaux.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPv_consta_entete_travaux.id;
            });
          }

          vm.selectedItemPv_consta_entete_travaux = {} ;
          NouvelItemPv_consta_entete_travaux      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionPv_consta_entete_travaux= function (item)
        {
            vm.selectedItemPv_consta_entete_travaux = item;
           // vm.NouvelItemPv_consta_entete_travaux   = item;
           if (item.$edit==false || item.$edit==undefined)
           {    
                vm.showbuttonNouvFacture_mpe = true;
                vm.steprubriquebatiment_mpe = true;
                vm.steprubriquelatrine_mpe = true;
                vm.steprubriquemobilier_mpe = true;
                vm.steppv_consta_recap_travaux = true;
                currentItemPv_consta_entete_travaux    = JSON.parse(JSON.stringify(vm.selectedItemPv_consta_entete_travaux));

                apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
                {
                   var facture_mpe = result.data.response;
                    if (Object.keys(result.data.response).length>0)
                    {
                        vm.validation_facture_mpe = facture_mpe.validation;
                        vm.showbuttonNouvFacture_mpe = false;
                        vm.id_facture_mpe = parseInt(facture_mpe.id); 
                    }
                    else
                    {
                        vm.validation_facture_mpe = 0;
                        vm.showbuttonNouvFacture_mpe = true;
                        vm.id_facture_mpe = 0;
                    }
                });

                vm.stepdecompte =true;
                vm.step_tranche_batiment_mpe = true;
                vm.step_tranche_latrine_mpe = true;
                vm.step_tranche_mobilier_mpe = true;
                vm.stepfacture_mpe = true;
                vm.stepjusti_pv_consta_entete_travaux_mpe = true;
           }
           else
           {
                vm.steprubriquebatiment_mpe = false;
                vm.steprubriquelatrine_mpe = false;
                vm.steprubriquemobilier_mpe = false;
                vm.steppv_consta_recap_travaux = false;
                vm.stepdecompte =false;
                vm.step_tranche_batiment_mpe = false;
                vm.step_tranche_latrine_mpe = false;
                vm.step_tranche_mobilier_mpe = false;
                vm.stepfacture_mpe = false;
                vm.stepjusti_pv_consta_entete_travaux_mpe = false;
           }
            vm.validation_pv_consta_entete_travaux = item.validation;   
        };
        $scope.$watch('vm.selectedItemPv_consta_entete_travaux', function()
        {
             if (!vm.allpv_consta_entete_travaux) return;
             vm.allpv_consta_entete_travaux.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPv_consta_entete_travaux.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPv_consta_entete_travaux = function(item)
        {
            NouvelItemPv_consta_entete_travaux = false ;
            vm.selectedItemPv_consta_entete_travaux = item;
            currentItemPv_consta_entete_travaux = angular.copy(vm.selectedItemPv_consta_entete_travaux);
            $scope.vm.allpv_consta_entete_travaux.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemPv_consta_entete_travaux.contrat_prestataire.id ;
            item.numero   = vm.selectedItemPv_consta_entete_travaux.numero ;
            item.date_etablissement   = new Date(vm.selectedItemPv_consta_entete_travaux.date_etablissement) ;
            item.montant_travaux   = parseFloat(vm.selectedItemPv_consta_entete_travaux.montant_travaux) ;
            item.avancement_global_periode   = parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) ;
            item.avancement_global_cumul   = parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul);
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerPv_consta_entete_travaux = function()
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
                vm.ajoutPv_consta_entete_travaux(vm.selectedItemPv_consta_entete_travaux,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePv_consta_entete_travaux (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpv_consta_entete_travaux.filter(function(obj)
                {
                   return obj.id == currentItemPv_consta_entete_travaux.id;
                });
                if(pass[0])
                {
                   if((pass[0].numero   != currentItemPv_consta_entete_travaux.numero )
                   || (pass[0].date_etablissement   != currentItemPv_consta_entete_travaux.date_etablissement )
                    || (pass[0].montant_travaux   != currentItemPv_consta_entete_travaux.montant_travaux )
                    || (pass[0].avancement_global_periode   != currentItemPv_consta_entete_travaux.avancement_global_periode )
                    || (pass[0].avancement_global_cumul   != currentItemPv_consta_entete_travaux.avancement_global_cumul ) )                   
                      { 
                         insert_in_basePv_consta_entete_travaux(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePv_consta_entete_travaux(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Attachement_travaux
        function insert_in_basePv_consta_entete_travaux(pv_consta_entete_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPv_consta_entete_travaux==false)
            {
                getId = vm.selectedItemPv_consta_entete_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    numero: pv_consta_entete_travaux.numero,
                    date_etablissement:convertionDate(pv_consta_entete_travaux.date_etablissement),
                    montant_travaux:pv_consta_entete_travaux.montant_travaux,
                    avancement_global_cumul:pv_consta_entete_travaux.avancement_global_cumul,
                    avancement_global_periode: pv_consta_entete_travaux.avancement_global_periode,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id              
                });
                //factory
            apiFactory.add("pv_consta_entete_travaux/index",datas, config).success(function (data)
            {

                if (NouvelItemPv_consta_entete_travaux == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemPv_consta_entete_travaux.$selected  = false;
                        vm.selectedItemPv_consta_entete_travaux.$edit      = false;
                        vm.selectedItemPv_consta_entete_travaux ={};
                    }
                    else 
                    {    
                      vm.allpv_consta_entete_travaux = vm.allpv_consta_entete_travaux.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPv_consta_entete_travaux.id;
                      });

                    NouvelItemPv_consta_entete_travaux      = false;
                    }
                    
                }
                else
                {                  
                  pv_consta_entete_travaux.id  =   String(data.response);

                  NouvelItemPv_consta_entete_travaux      = false;
                }
              //vm.showboutonValider = false;

              pv_consta_entete_travaux.$selected = false;
              pv_consta_entete_travaux.$edit = false;
              vm.selectedItemPv_consta_entete_travaux = {};
              vm.step_tranche_batiment_mpe = false;                
                vm.step_tranche_latrine_mpe = false;
                vm.step_tranche_mobilier_mpe = false;

                vm.steprubriquebatiment_mpe = false;
                vm.steprubriquelatrine_mpe = false;                
                vm.steprubriquemobilier_mpe = false;
                vm.stepdecompte =false;
                vm.stepfacture_mpe = false;
                vm.stepjusti_pv_consta_entete_travaux_mpe = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin pv constatation entete***************************************************/



/************************************************debut batiment_mpe*************************************************/
    vm.click_tab_tranche_batiment = function()
        {   vm.affiche_load =true;
          NouvelItemDemande_batiment_mpe = false;
            apiFactory.getAPIgeneraliserREST("demande_batiment_mpe/index","menu","getdemandeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
            {
                vm.alldemande_batiment_mpe = result.data.response;
                vm.affiche_load =false;
            });

           /* vm.steprubriquebatiment_mpe = false;
            vm.steprubriquelatrine_mpe = false;                
            vm.steprubriquemobilier_mpe = false;*/

            vm.steppv_consta_batiment_travaux = false;
            vm.steppv_consta_latrine_travaux = false;
            vm.steppv_consta_mobilier_travaux = false;
        }
        vm.demande_batiment_mpe_column = [
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Condition de paiement"
        },
        {titre:"Pourcentage"
        },
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterDemande_batiment_mpe = function ()
        { 
          

        if (NouvelItemDemande_batiment_mpe == false)
          {  
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              tranche: '',
              montant: '',
              periode: '',
              pourcentage:''
            };
            vm.alldemande_batiment_mpe.unshift(items);
            vm.alldemande_batiment_mpe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_batiment_mpe = mem;
              }
            });
            NouvelItemDemande_batiment_mpe = true ;             
              
          }else
          {
              vm.showAlert('Ajout Tranche demande batiment','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_batiment_mpe(demande_batiment_mpe,suppression)
        {
            if (NouvelItemDemande_batiment_mpe==false)
            {
                apiFactory.getAPIgeneraliserREST("demande_batiment_mpe/index","menu","getdemandevalideById",'id_demande_batiment_mpe',demande_batiment_mpe.id).then(function(result)
                {
                  var demande_batiment_valide = result.data.response;
                  if (demande_batiment_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées ou rejetée')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    { 
                      vm.step_tranche_batiment_mpe = false;                
                      vm.step_tranche_latrine_mpe = false;
                      vm.step_tranche_mobilier_mpe = false;

                      vm.steprubriquebatiment_mpe = false;
                      vm.steprubriquelatrine_mpe = false;                
                      vm.steprubriquemobilier_mpe = false;
                      vm.stepdecompte =false;

                      vm.steppv_consta_batiment_travaux = false;
                      vm.steppv_consta_latrine_travaux = false;
                      vm.steppv_consta_mobilier_travaux = false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceDemande_batiment_mpe (demande_batiment_mpe,suppression);  
                  }
                });  
            } 
            else
            {
                insert_in_baseDemande_batiment_mpe(demande_batiment_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerDemande_batiment_mpe = function(item)
        {
          if (NouvelItemDemande_batiment_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_tranche_demande_mpe = currentItemDemande_batiment_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_batiment_mpe.montant ;
            item.periode   = currentItemDemande_batiment_mpe.periode ;
            item.pourcentage = currentItemDemande_batiment_mpe.pourcentage ;
          }else
          {
            vm.alldemande_batiment_mpe = vm.alldemande_batiment_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_mpe.id;
            });
          }

          vm.selectedItemDemande_batiment_mpe = {} ;
          NouvelItemDemande_batiment_mpe     = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           // vm.NouvelItemDemande_batiment_mpe   = item;
            currentItemDemande_batiment_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_mpe));
           
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
            NouvelItemDemande_batiment_mpe = false ;
            vm.selectedItemDemande_batiment_mpe = item;
            currentItemDemande_batiment_mpe = angular.copy(vm.selectedItemDemande_batiment_mpe);
            $scope.vm.alldemande_batiment_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_batiment_mpe.tranche.id ;
            item.montant   = parseFloat(vm.selectedItemDemande_batiment_mpe.montant);
            item.periode = vm.selectedItemDemande_batiment_mpe.tranche.periode ;
            item.pourcentage = parseFloat(vm.selectedItemDemande_batiment_mpe.tranche.pourcentage) ;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerDemande_batiment_mpe = function()
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
                   if(pass[0].id_tranche_demande_mpe != currentItemDemande_batiment_mpe.id_tranche_demande_mpe)                   
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
            if (NouvelItemDemande_batiment_mpe==false)
            {
                getId = vm.selectedItemDemande_batiment_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_tranche_demande_mpe: demande_batiment_mpe.id_tranche_demande_mpe ,
                    montant: demande_batiment_mpe.montant,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_mpe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_batiment_mpe.filter(function(obj)
                {
                    return obj.id == demande_batiment_mpe.id_tranche_demande_mpe;
                });

                if (NouvelItemDemande_batiment_mpe == false)
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
                        
                    }
                    else 
                    {    
                      vm.alldemande_batiment_mpe = vm.alldemande_batiment_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_mpe.id;
                      });

                      apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_factureById",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
                      {
                        var pv_consta_entete_trav = result.data.response[0];
                        if (pv_consta_entete_trav.facture!=null ||pv_consta_entete_trav.facture!=undefined)
                        {
                              var montant_trav = parseFloat(pv_consta_entete_trav.montant_travaux) - parseFloat(demande_batiment_mpe.montant);
                              var montant_rabais = (montant_trav * pv_consta_entete_trav.facture.pourcentage_rabais)/100;
                              var montant_ht =  parseFloat(montant_trav)- parseFloat(montant_rabais);
                              //var montant_tva = (montant_ht *20)/100;
                              var montant_tva = 0;

                              var montant_ttc = montant_ht + montant_tva;
                              var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                              var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                              var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(pv_consta_entete_trav.facture.remboursement_acompte) + 
                              parseFloat(retenu_garanti) + parseFloat(pv_consta_entete_trav.facture.penalite_retard) + parseFloat(pv_consta_entete_trav.facture.remboursement_plaque)+parseFloat(taxe_marche_public));
                              var item_facture_mpe = {
                                        id: pv_consta_entete_trav.facture.id,        
                                        id_pv_consta_entete_travaux: pv_consta_entete_trav.facture.id_pv_consta_entete_travaux,        
                                        numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                        montant_travaux: montant_trav,
                                        pourcentage_rabais: pv_consta_entete_trav.facture.pourcentage_rabais,
                                        montant_rabais: montant_rabais,
                                        montant_ht: montant_ht,
                                        montant_tva: montant_tva,   
                                        montant_ttc: montant_ttc, 
                                        remboursement_acompte: pv_consta_entete_trav.facture.remboursement_acompte,   
                                        penalite_retard: pv_consta_entete_trav.facture.penalite_retard, 
                                        retenue_garantie: retenu_garanti, 
                                        remboursement_plaque: pv_consta_entete_trav.facture.remboursement_plaque,
                                        taxe_marche_public: taxe_marche_public,     
                                        net_payer: net_payer,  
                                        date_signature: pv_consta_entete_trav.facture.date_signature
                                      };
                              console.log(item_facture_mpe);
                              majatfacture_mpe(item_facture_mpe,0);
                        } 
                          //vm.selectedItemPv_consta_entete_travaux.total_cumul =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul) - parseFloat(demande_batiment_mpe.montant);
                          //vm.selectedItemPv_consta_entete_travaux.total_periode =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) - parseFloat(demande_batiment_mpe.montant); 
                          var item_pv =
                          {
                            id:        vm.selectedItemPv_consta_entete_travaux.id,
                            numero: pv_consta_entete_travaux.numero,
                            date_etablissement: pv_consta_entete_trav.date_etablissement,
                            montant_travaux: parseFloat(pv_consta_entete_trav.montant_travaux) - parseFloat(demande_batiment_mpe.montant),
                            avancement_global_cumul: pv_consta_entete_trav.avancement_global_cumul,
                            avancement_global_periode: pv_consta_entete_trav.avancement_global_periode,
                            id_contrat_prestataire: vm.selectedItemContrat_prestataire.id
                          } 
                           majpv_consta_entete_travaux(item_pv,0); 
                      });
                    }
                    
                }
                else
                {
                  demande_batiment_mpe.tranche = tran[0] ;
                  demande_batiment_mpe.periode = tran[0].periode ;
                  demande_batiment_mpe.pourcentage = tran[0].pourcentage ;
                  demande_batiment_mpe.id  =   String(data.response);
                  NouvelItemDemande_batiment_mpe= false; 
                  apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_factureById",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
                      {
                        var pv_consta_entete_trav = result.data.response[0];
                        console.log(pv_consta_entete_trav);
                        if (pv_consta_entete_trav.facture!=null ||pv_consta_entete_trav.facture!=undefined)
                        {console.log("te");
                              var montant_trav = parseFloat(pv_consta_entete_trav.montant_travaux) + parseFloat(demande_batiment_mpe.montant);
                              var montant_rabais = (montant_trav * pv_consta_entete_trav.facture.pourcentage_rabais)/100;
                              var montant_ht =  parseFloat(montant_trav)- parseFloat(montant_rabais);
                              //var montant_tva = (montant_ht *20)/100;
                              var montant_tva = 0;

                              var montant_ttc = montant_ht + montant_tva;
                              var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                              var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                              var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(pv_consta_entete_trav.facture.remboursement_acompte) + 
                              parseFloat(retenu_garanti) + parseFloat(pv_consta_entete_trav.facture.penalite_retard) + parseFloat(pv_consta_entete_trav.facture.remboursement_plaque)+parseFloat(taxe_marche_public));
                              var item_facture_mpe = {
                                        id: pv_consta_entete_trav.facture.id,        
                                        id_pv_consta_entete_travaux: pv_consta_entete_trav.facture.id_pv_consta_entete_travaux,        
                                        numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                        montant_travaux: montant_trav,
                                        pourcentage_rabais: pv_consta_entete_trav.facture.pourcentage_rabais,
                                        montant_rabais: montant_rabais,
                                        montant_ht: montant_ht,
                                        montant_tva: montant_tva,   
                                        montant_ttc: montant_ttc, 
                                        remboursement_acompte: pv_consta_entete_trav.facture.remboursement_acompte,   
                                        penalite_retard: pv_consta_entete_trav.facture.penalite_retard, 
                                        retenue_garantie: retenu_garanti, 
                                        remboursement_plaque: pv_consta_entete_trav.facture.remboursement_plaque,
                                        taxe_marche_public: taxe_marche_public,     
                                        net_payer: net_payer,  
                                        date_signature: pv_consta_entete_trav.facture.date_signature
                                      };
                              console.log(item_facture_mpe);
                              majatfacture_mpe(item_facture_mpe,0);
                        }                        
                        else
                        {     console.log("te2");

                              //montant_rabais 0 satri pourcentage 0 initial
                              //penalite retard 0 initial
                              var montant_trav = parseFloat(demande_batiment_mpe.montant);
                              var montant_ht = parseFloat(montant_trav);
                              var montant_tva = 0;

                              var montant_ttc = montant_ht + montant_tva;
                              var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                              var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                              var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - parseFloat(retenu_garanti)-parseFloat(taxe_marche_public);
                              var item_facture_mpe = {
                                        id: 0,        
                                        id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,        
                                        numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                        montant_travaux: montant_trav,
                                        pourcentage_rabais: 0,
                                        montant_rabais: 0,
                                        montant_ht: montant_ht,
                                        montant_tva: montant_tva,   
                                        montant_ttc: montant_ttc, 
                                        remboursement_acompte: 0,   
                                        penalite_retard: 0, 
                                        retenue_garantie: retenu_garanti, 
                                        remboursement_plaque: 0,
                                        taxe_marche_public: taxe_marche_public,    
                                        net_payer: net_payer,  
                                        date_signature: vm.datenow
                                      };
                              majatfacture_mpe(item_facture_mpe,0);
                        } 
                          //vm.selectedItemPv_consta_entete_travaux.total_cumul =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul) - parseFloat(demande_batiment_mpe.montant);
                          //vm.selectedItemPv_consta_entete_travaux.total_periode =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) - parseFloat(demande_batiment_mpe.montant); 
                          var item_pv =
                          {
                            id:        vm.selectedItemPv_consta_entete_travaux.id,
                            numero: pv_consta_entete_trav.numero,
                            date_etablissement: pv_consta_entete_trav.date_etablissement,
                            montant_travaux: parseFloat(pv_consta_entete_trav.montant_travaux) + parseFloat(demande_batiment_mpe.montant),
                            avancement_global_cumul: pv_consta_entete_trav.avancement_global_cumul,
                            avancement_global_periode: pv_consta_entete_trav.avancement_global_periode,
                            id_contrat_prestataire: vm.selectedItemContrat_prestataire.id
                          } 
                           majpv_consta_entete_travaux(item_pv,0); 
                      });                  
                  
            }
              //vm.showboutonValider = false;

              demande_batiment_mpe.$selected = false;
              demande_batiment_mpe.$edit = false;
              vm.selectedItemDemande_batiment_mpe = {};
              //vm.showbuttonNouvDemande_batiment_mpe_creer = false;
           // vm.steprubriquebatiment_mpe = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //insertion ou mise a jours ou suppression item dans bdd Attachement_travaux
        function majpv_consta_entete_travaux(pv_consta_entete_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
              supprimer: suppression,
              id:        pv_consta_entete_travaux.id,
              numero: pv_consta_entete_travaux.numero,
              date_etablissement:convertionDate(pv_consta_entete_travaux.date_etablissement),
              montant_travaux:pv_consta_entete_travaux.montant_travaux,
              avancement_global_cumul:pv_consta_entete_travaux.avancement_global_cumul,
              avancement_global_periode: pv_consta_entete_travaux.avancement_global_periode,
              id_contrat_prestataire: vm.selectedItemContrat_prestataire.id              
          });
                console.log(datas);
                //factory
            apiFactory.add("pv_consta_entete_travaux/index",datas, config).success(function (data)
            {   console.log('vita attachement') ;           
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        function majatfacture_mpe(facture_mpe,suppression)
        {
            //vm.allfacture_mpe=[];
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        facture_mpe.id,
                    numero: facture_mpe.numero,
                    montant_travaux:facture_mpe.montant_travaux,
                    pourcentage_rabais: facture_mpe.pourcentage_rabais ,
                    montant_rabais: facture_mpe.montant_rabais,
                    montant_ht: facture_mpe.montant_ht,
                    montant_tva: facture_mpe.montant_tva,
                    montant_ttc:facture_mpe.montant_ttc,
                    remboursement_acompte: facture_mpe.remboursement_acompte ,
                    penalite_retard: facture_mpe.penalite_retard,
                    retenue_garantie: facture_mpe.retenue_garantie,
                    remboursement_plaque: facture_mpe.remboursement_plaque ,
                    taxe_marche_public: facture_mpe.taxe_marche_public,
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(facture_mpe.date_signature) ,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {
                console.log('vita facture');                
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_batiment_mpe = function(item)
        { 
          apiFactory.getAPIgeneraliserREST("demande_batiment_mpe/index","menu","getdemandeByContratTranche",
          'id_tranche_demande_mpe',item.id_tranche_demande_mpe,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
          {
            var demande_deja_introduit = result.data.response;
            var data_tranche = vm.alltranche_demande_batiment_mpe.filter(function(obj)
                {
                    return obj.id == item.id_tranche_demande_mpe;
                });
                console.log(data_tranche);
                console.log(item);
                console.log(vm.selectedItemContrat_prestataire);
            console.log(demande_deja_introduit);
            if (demande_deja_introduit.length !=0)
            { console.log('1');
              var confirm = $mdDialog.confirm()
                    .title('Cette action ne peut pas être réaliser.')
                    .textContent('Cette tranche de paiement est déjà introduite.')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {  
                      item.id_tranche_demande_mpe = null;
                    }, function() {
                      //alert('rien');
                    });
            }
            else
            {  
              
                console.log('2');
              var tranche_current = Math.max.apply(Math, data_tranche.map(function(o){return o.code.split(' ')[1];}));
              if (parseInt(tranche_current)>1)
              { console.log('3');
                var tranche_precedent = 'tranche '+parseInt(tranche_current)-1;
                apiFactory.getAPIgeneraliserREST("demande_batiment_mpe/index","menu","getdemandeByContratTranchenumero",'tranche_numero',
                tranche_precedent,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result_tranche)
                {
                  var demande_tranche_precedent = result_tranche.data.response;
                  if (demande_tranche_precedent.length!=0)
                  {console.log('4');
                    var confirm = $mdDialog.confirm()
                    .title('Cette action ne peut pas être réaliser.')
                    .textContent('Vous devriez entrer la '+tranche_precedent)
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {  
                      item.id_tranche_demande_mpe = null;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {    console.log('5');                      
                    var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_batiment) * data_tranche[0].pourcentage)/100;
                    var montant = montant_ttc/1;

                    item.periode = data_tranche[0].periode;
                    item.pourcentage = data_tranche[0].pourcentage;
                    item.montant = montant;
                  }
                });
              }
              else
              {console.log('6');
                var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_batiment) * data_tranche[0].pourcentage)/100;
                    var montant = montant_ttc/1;

                    item.periode = data_tranche[0].periode;
                    item.pourcentage = data_tranche[0].pourcentage;
                    item.montant = montant;
              } 
            }
          });
        }
/************************************************fin batiment_mpe***************************************************/
/************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.pv_consta_rubrique_phase_bat_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Prévision"
        },
        {titre:"Période"
        },
        {titre:"Anterieur"
        },
        {titre:"Cumul"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];

        vm.click_pv_consta_rubrique_phase_bat_mpe = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_phase_bat/index","menu","getpv_consta_rubrique_phase_pourcentagebycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
            {  
                vm.allpv_consta_rubrique_phase_bat_mpe= result.data.response;
                vm.steppv_consta_batiment_travaux = false;
                vm.affiche_load =false;
                console.log(vm.allpv_consta_rubrique_phase_bat_mpe);
            });
        }
 //fonction selection item rubrique attachement batiment mpe
        vm.selectionPv_consta_rubrique_phase_bat_mpe= function (item)
        {
            vm.selectedItemPv_consta_rubrique_phase_bat_mpe = item;
            if(item.$edit==false || item.$edit==undefined)
            {               
                currentItemPv_consta_rubrique_phase_bat_mpe   = JSON.parse(JSON.stringify(vm.selectedItemPv_consta_rubrique_phase_bat_mpe)); 
            }
            /*apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_prevu/index","menu","getattachement_batimentprevubyrubrique",
            "id_attachement_batiment",vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id,"id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                    vm.allpv_consta_rubrique_phase_bat_prevus = result.data.response;
                    vm.allpv_consta_rubrique_phase_bat_prevu = result.data.response;
                    console.log(vm.allpv_consta_rubrique_phase_bat_prevu)
            });*/
            vm.steppv_consta_batiment_travaux = true;
            
        };

        $scope.$watch('vm.selectedItemPv_consta_rubrique_phase_bat_mpe', function()
        {
             if (!vm.allpv_consta_rubrique_phase_bat_mpe) return;
             vm.allpv_consta_rubrique_phase_bat_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPv_consta_rubrique_phase_bat_mpe.$selected = true;
        });

        function ajoutPv_consta_rubrique_phase_bat_mpe(pv_consta_rubrique_phase_bat_mpe,suppression)
        {
            if (NouvelItemPv_consta_rubrique_phase_bat_mpe==false)
            {                
              test_existancePv_consta_rubrique_phase_bat_mpe (pv_consta_rubrique_phase_bat_mpe,suppression); 
            } 
            else
            {
                insert_in_basePv_consta_rubrique_phase_bat_mpe(pv_consta_rubrique_phase_bat_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation document_feffi_scan
        vm.annulerPv_consta_rubrique_phase_bat_mpe = function(item)
        {
          if (NouvelItemPv_consta_rubrique_phase_bat_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemPv_consta_rubrique_phase_bat_mpe.observation ;
          }else
          {
            /*vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
            {
                return obj.id != vm.selectedItemDocument_feffi_scan.id;
            });*/
            item.observation   = '' ;
            item.$edit = false;
            item.$selected = false;

            item.id = null;
          }

          vm.selectedItemPv_consta_rubrique_phase_bat_mpe = {} ;
          NouvelItemPv_consta_rubrique_phase_bat_mpe      = false;
          
        };

        
        //fonction masque de saisie modification item feffi
        vm.modifierPv_consta_rubrique_phase_bat_mpe = function(item)
        {
            
            vm.selectedItemPv_consta_rubrique_phase_bat_mpe = item;
            currentItemPv_consta_rubrique_phase_bat_mpe = angular.copy(vm.selectedItemPv_consta_rubrique_phase_bat_mpe);
            $scope.vm.allpv_consta_rubrique_phase_bat_mpe.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id==null)
            { 
              NouvelItemPv_consta_rubrique_phase_bat_mpe=true;
              console.log('atonull');
              item.observation   = vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation ;
              item.id   = '0' ;

            }
            else
            {NouvelItemPv_consta_rubrique_phase_bat_mpe = false ;
                console.log('tsnull');
                item.observation   = vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation ;
            }          
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_feffi_scan
        vm.supprimerPv_consta_rubrique_phase_bat_mpe = function()
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
                vm.ajoutPv_consta_rubrique_phase_bat_mpe(vm.selectedItemPv_consta_rubrique_phase_bat_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePv_consta_rubrique_phase_bat_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.allpv_consta_rubrique_phase_bat_mpe.filter(function(obj)
                {
                   return obj.id == currentItemPv_consta_rubrique_phase_bat_mpe.id;
                });
                if(mem[0])
                {
                   if(mem[0].observation   != currentItemPv_consta_rubrique_phase_bat_mpe.observation)                   
                      { 
                         insert_in_basePv_consta_rubrique_phase_bat_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePv_consta_rubrique_phase_bat_mpe(item,suppression);
        }
        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePv_consta_rubrique_phase_bat_mpe(pv_consta_rubrique_phase_bat_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPv_consta_rubrique_phase_bat_mpe==false)
            {
                getId = vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    periode: pv_consta_rubrique_phase_bat_mpe.periode,
                    observation: pv_consta_rubrique_phase_bat_mpe.observation,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                    id_rubrique_phase:pv_consta_rubrique_phase_bat_mpe.id_phase               
                });
                console.log(datas);
                //factory
            apiFactory.add("pv_consta_detail_bat_travaux/index",datas, config).success(function (data)
            {  

                if (NouvelItemPv_consta_rubrique_phase_bat_mpe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        //vm.selectedItemPv_consta_rubrique_phase_bat_mpe.convention = conve[0];
                        
                        vm.selectedItemPv_consta_rubrique_phase_bat_mpe.$selected  = false;
                        vm.selectedItemPv_consta_rubrique_phase_bat_mpe.$edit      = false;
                        vm.selectedItemPv_consta_rubrique_phase_bat_mpe ={};
                    }
                    else 
                    {    
                      vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation='';
                    
                    }
                }
                else
                {
                  //avenant_convention.convention = conve[0];
                  pv_consta_rubrique_phase_bat_mpe.id  =   String(data.response);              
                  NouvelItemPv_consta_rubrique_phase_bat_mpe=false;
                }
              pv_consta_rubrique_phase_bat_mpe.$selected = false;
              pv_consta_rubrique_phase_bat_mpe.$edit = false;
              vm.selectedItemPv_consta_rubrique_phase_bat_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.Total_prevu = function(){
            var total_prevu = 0;
            if (vm.allpv_consta_rubrique_phase_bat_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allpv_consta_rubrique_phase_bat_mpe.length; i++){
                    var product = vm.allpv_consta_rubrique_phase_bat_mpe[i];
                    total_prevu += parseFloat(product.pourcentage_prevu);
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

        vm.Total_periode = function(){
            var total_periode = 0;
            if (vm.allpv_consta_rubrique_phase_bat_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allpv_consta_rubrique_phase_bat_mpe.length; i++){
                    var product = vm.allpv_consta_rubrique_phase_bat_mpe[i];
                    if (product.periode!=null) {                      
                    total_periode += parseFloat(product.periode);
                    }
                }
            }
            
            var nbr=parseFloat(total_periode);
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

        vm.Total_anterieur = function(){
            var total_anterieur = 0;
            if (vm.allpv_consta_rubrique_phase_bat_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allpv_consta_rubrique_phase_bat_mpe.length; i++){
                    var product = vm.allpv_consta_rubrique_phase_bat_mpe[i];
                    if (product.anterieur!=null) {                      
                      total_anterieur += parseFloat(product.anterieur);
                      }
                }
            }
            
            var nbr=parseFloat(total_anterieur);
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

        vm.Total_cumul = function(){
            var total_cumul = 0;
            if (vm.allpv_consta_rubrique_phase_bat_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allpv_consta_rubrique_phase_bat_mpe.length; i++){
                    var product = vm.allpv_consta_rubrique_phase_bat_mpe[i];
                    var p = 0;
                    var a = 0;
                    if (product.periode!=null) {                      
                      p= parseFloat(product.periode);
                      }
                      if (product.anterieur!=null) {                      
                        a= parseFloat(product.anterieur);
                        }
                    total_cumul += parseFloat(p)+parseFloat(a);
                }
            }
            
            var nbr=parseFloat(total_cumul);
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
        vm.click_tab_pv_consta_statu_bat_travaux = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_designation_bat/index","menu","getpv_consta_statutravauxbyphasecontrat",
            "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
            ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase).then(function(result)
            {
                vm.allpv_consta_statu_bat_travaux = result.data.response;
                console.log(vm.allpv_consta_statu_bat_travaux);
                vm.affiche_load =false;
            });
        }
        vm.changestatu = function(item)
        {
            insert_in_basePv_consta_statu_bat_travaux(item,0);
            console.log(item);
        }        
        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_batiment_travaux
        function insert_in_basePv_consta_statu_bat_travaux(pv_consta_statu_bat_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            vm.affiche_load = true;
            var getId = 0;
            var stat =0;
            if (pv_consta_statu_bat_travaux.periode==true)
            {
              stat = 1;
            }
            if (pv_consta_statu_bat_travaux.id!=null || pv_consta_statu_bat_travaux.id!=undefined)
            {
                getId = pv_consta_statu_bat_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                    id_rubrique_designation: pv_consta_statu_bat_travaux.id_designation,
                    status: stat           
                });
                console.log(datas);
                //factory
            apiFactory.add("pv_consta_statu_bat_travaux/index",datas, config).success(function (data)
            {
                
              if (pv_consta_statu_bat_travaux.id != null || pv_consta_statu_bat_travaux.id != undefined)
              {
                apiFactory.getAPIgeneraliserREST("pv_consta_statu_bat_travaux/index","menu","getcount_desination_statubyphasecontrat",
                "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
                ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase).then(function(result)
                {
                    var count_desination_statu = result.data.response;
                    console.log(count_desination_statu);
                    var getId_detail = 0;
                    if (vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id!=null || vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id!=undefined)
                    {
                        getId_detail = vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id; 
                    }
                    if (vm.allpv_consta_statu_bat_travaux.length==parseInt(count_desination_statu[0].nombre))
                    { 
                      console.log(vm.selectedItemPv_consta_rubrique_phase_bat_mpe);
                        var datas_detail = $.param({
                          supprimer: 0,
                          id:        getId_detail,
                          id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                          id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase,
                          periode: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.pourcentage_prevu,
                          observation: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation           
                        });
                        console.log(datas_detail);
                        apiFactory.add("pv_consta_detail_bat_travaux/index",datas_detail, config).success(function (data)
                        {
                          if (vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != undefined)
                          { 
                            console.log('atodet1');
                          }
                          else
                          {
                            vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id  =   String(data.response);
                            console.log('atodet2');
                          }
                        });

                        //insertion facture moe
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==1) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p2').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail==null || detail[0].id_detail==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0 ,
                                        statu_fact: 1              
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var datas_fact_moe = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                        {
                                        });
                                    });
                                }
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==2) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p3').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail==null || detail[0].id_detail==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0 ,
                                        statu_fact: 1              
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var datas_fact_moe = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                        {
                                        });
                                    });
                                }
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==3) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p4').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail==null || detail[0].id_detail==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0 ,
                                        statu_fact: 1              
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var datas_fact_moe = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                        {
                                        });
                                    });
                                }
                              }
                          });
                        }
                    } 
                    else
                    {
                        var datas_detail = $.param({
                          supprimer: 0,
                          id:        getId_detail,
                          id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                          id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase,
                          periode: 0,
                          observation: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation           
                        });
                        console.log(datas_detail);
                        apiFactory.add("pv_consta_detail_bat_travaux/index",datas_detail, config).success(function (data_detail)
                        {
                          if (vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != undefined)
                          { 
                            console.log('atodett1');
                          }
                          else
                          {
                            vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id  =   String(data_detail.response);
                            console.log('atodett2');
                          }
                        });
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==1) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p2').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail!=null && detail[0].id_detail!=undefined)
                              {
                                  var datas_fact_moe = $.param({
                                    supprimer: 1,
                                    id:        detail[0].id_detail,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });                                
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==2) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p3').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail!=null && detail[0].id_detail!=undefined)
                              {
                                  var datas_fact_moe = $.param({
                                    supprimer: 1,
                                    id:        detail[0].id_detail,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });                                
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==3) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p4').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail!=null && detail[0].id_detail!=undefined)
                              {
                                  var datas_fact_moe = $.param({
                                    supprimer: 1,
                                    id:        detail[0].id_detail,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });                                
                              }
                          });
                        }
                    }
                });
                console.log('ato');
              }
              else
              {
                pv_consta_statu_bat_travaux.id  =   String(data.response); 
                console.log(pv_consta_statu_bat_travaux)  
                console.log('ato2'); apiFactory.getAPIgeneraliserREST("pv_consta_statu_bat_travaux/index","menu","getcount_desination_statubyphasecontrat",
                "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
                ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase).then(function(result)
                {
                    var count_desination_statu = result.data.response;
                    console.log(count_desination_statu);
                    var getId_detail = 0;
                    if (vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id!=null || vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id!=undefined)
                    {
                        getId_detail = vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id; 
                    }
                    if (vm.allpv_consta_statu_bat_travaux.length==parseInt(count_desination_statu[0].nombre))
                    { 
                      console.log(vm.selectedItemPv_consta_rubrique_phase_bat_mpe);
                        var datas_detail = $.param({
                          supprimer: 0,
                          id:        getId_detail,
                          id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                          id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase,
                          periode: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.pourcentage_prevu,
                          observation: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation           
                        });
                        console.log(datas_detail);
                        apiFactory.add("pv_consta_detail_bat_travaux/index",datas_detail, config).success(function (data)
                        {
                          if (vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != undefined)
                          { 
                            console.log('atodet1');
                          }
                          else
                          {
                            vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id  =   String(data.response);
                            console.log('atodet2');
                          }
                        });
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==1) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p2').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail==null || detail[0].id_detail==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0,
                                        statu_fact: 1               
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var datas_fact_moe = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                        {
                                        });
                                    });
                                }
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==2) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p3').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail==null || detail[0].id_detail==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0 ,
                                        statu_fact: 1              
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var datas_fact_moe = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                        {
                                        });
                                    });
                                }
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==3) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p4').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail==null || detail[0].id_detail==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0,
                                        statu_fact: 1               
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var datas_fact_moe = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                        {
                                        });
                                    });
                                }
                              }
                          });
                        }
                    } 
                    else
                    {
                        var datas_detail = $.param({
                          supprimer: 0,
                          id:        getId_detail,
                          id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                          id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id_phase,
                          periode: 0,
                          observation: vm.selectedItemPv_consta_rubrique_phase_bat_mpe.observation           
                        });
                        console.log(datas_detail);
                        apiFactory.add("pv_consta_detail_bat_travaux/index",datas_detail, config).success(function (data_detail)
                        {
                          if (vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id != undefined)
                          { 
                            console.log('atodett1');
                          }
                          else
                          {
                            vm.selectedItemPv_consta_rubrique_phase_bat_mpe.id  =   String(data_detail.response);
                            console.log('atodett2');
                          }
                        });
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==1) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p2').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail!=null && detail[0].id_detail!=undefined)
                              {
                                  var datas_fact_moe = $.param({
                                    supprimer: 1,
                                    id:        detail[0].id_detail,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });                                
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==2) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p3').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail!=null && detail[0].id_detail!=undefined)
                              {
                                  var datas_fact_moe = $.param({
                                    supprimer: 1,
                                    id:        detail[0].id_detail,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });                                
                              }
                          });
                        }
                        if (parseInt(vm.selectedItemPv_consta_rubrique_phase_bat_mpe.numero)==3) 
                        {
                          apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p4').then(function(result)
                          {
                              var detail = result.data.response;
                              console.log(detail);
                              if (detail[0].id_detail!=null && detail[0].id_detail!=undefined)
                              {
                                  var datas_fact_moe = $.param({
                                    supprimer: 1,
                                    id:        detail[0].id_detail,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe, config).success(function (data)
                                  {
                                  });                                
                              }
                          });
                        }
                    }
                });                 
              }
              vm.affiche_load = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement batiment travaux***********************************************/


/************************************************debut batiment_mpe*************************************************/
vm.click_tab_tranche_latrine = function()
{   vm.affiche_load =true;
  NouvelItemDemande_latrine_mpe = false;
    apiFactory.getAPIgeneraliserREST("demande_latrine_mpe/index","menu","getdemandeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
    {
        vm.alldemande_latrine_mpe = result.data.response;
        vm.affiche_load =false;
    });

   /* vm.steprubriquelatrine_mpe = false;
    vm.steprubriquelatrine_mpe = false;                
    vm.steprubriquemobilier_mpe = false;*/

    vm.steppv_consta_latrine_travaux = false;
    vm.steppv_consta_latrine_travaux = false;
    vm.steppv_consta_mobilier_travaux = false;
}
vm.demande_latrine_mpe_column = [
{titre:"Tranche"
},
{titre:"Montant"
},
{titre:"Condition de paiement"
},
{titre:"Pourcentage"
},
{titre:"Action"
}];        

//Masque de saisi ajout

vm.ajouterDemande_latrine_mpe = function ()
{ 
  

if (NouvelItemDemande_latrine_mpe == false)
  {  
    var items = {
      $edit: true,
      $selected: true,
      id: '0',
      tranche: '',
      montant: '',
      periode: '',
      pourcentage:''
    };
    vm.alldemande_latrine_mpe.unshift(items);
    vm.alldemande_latrine_mpe.forEach(function(mem)
    {
      if(mem.$selected==true)
      {
        vm.selectedItemDemande_latrine_mpe = mem;
      }
    });
    NouvelItemDemande_latrine_mpe = true ;             
      
  }else
  {
      vm.showAlert('Ajout Tranche demande latrine','Un formulaire d\'ajout est déjà ouvert!!!');
  }          
  
};

//fonction ajout dans bdd
function ajoutDemande_latrine_mpe(demande_latrine_mpe,suppression)
{
    if (NouvelItemDemande_latrine_mpe==false)
    {
        apiFactory.getAPIgeneraliserREST("demande_latrine_mpe/index","menu","getdemandevalideById",'id_demande_latrine_mpe',demande_latrine_mpe.id).then(function(result)
        {
          var demande_latrine_valide = result.data.response;
          if (demande_latrine_valide.length !=0)
          {
              var confirm = $mdDialog.confirm()
            .title('cette modification n\'est pas autorisé.')
            .textContent(' Les données sont déjà validées ou rejetée')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('Fermer')
            
            $mdDialog.show(confirm).then(function()
            { 
              vm.step_tranche_latrine_mpe = false;                
              vm.step_tranche_latrine_mpe = false;
              vm.step_tranche_mobilier_mpe = false;

              vm.steprubriquelatrine_mpe = false;
              vm.steprubriquelatrine_mpe = false;                
              vm.steprubriquemobilier_mpe = false;
              vm.stepdecompte =false;

              vm.steppv_consta_latrine_travaux = false;
              vm.steppv_consta_latrine_travaux = false;
              vm.steppv_consta_mobilier_travaux = false;

            }, function() {
              //alert('rien');
            });
          }
          else
          {
            test_existanceDemande_latrine_mpe (demande_latrine_mpe,suppression);  
          }
        });  
    } 
    else
    {
        insert_in_baseDemande_latrine_mpe(demande_latrine_mpe,suppression);
    }
}

//fonction de bouton d'annulation demande_latrine_mpe
vm.annulerDemande_latrine_mpe = function(item)
{
  if (NouvelItemDemande_latrine_mpe == false)
  {
    item.$edit = false;
    item.$selected = false;
    item.id_tranche_demande_mpe = currentItemDemande_latrine_mpe.id_tranche_demande_mpe ;
    item.montant   = currentItemDemande_latrine_mpe.montant ;
    item.periode   = currentItemDemande_latrine_mpe.periode ;
    item.pourcentage = currentItemDemande_latrine_mpe.pourcentage ;
  }else
  {
    vm.alldemande_latrine_mpe = vm.alldemande_latrine_mpe.filter(function(obj)
    {
        return obj.id !== vm.selectedItemDemande_latrine_mpe.id;
    });
  }

  vm.selectedItemDemande_latrine_mpe = {} ;
  NouvelItemDemande_latrine_mpe     = false;
  
};

//fonction selection item Demande_latrine_mpe
vm.selectionDemande_latrine_mpe= function (item)
{
    vm.selectedItemDemande_latrine_mpe = item;
   // vm.NouvelItemDemande_latrine_mpe   = item;
    currentItemDemande_latrine_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_mpe));
   
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
    NouvelItemDemande_latrine_mpe = false ;
    vm.selectedItemDemande_latrine_mpe = item;
    currentItemDemande_latrine_mpe = angular.copy(vm.selectedItemDemande_latrine_mpe);
    $scope.vm.alldemande_latrine_mpe.forEach(function(mem) {
      mem.$edit = false;
    });

    item.$edit = true;
    item.$selected = true;
    item.id_tranche_demande_mpe = vm.selectedItemDemande_latrine_mpe.tranche.id ;
    item.montant   = parseFloat(vm.selectedItemDemande_latrine_mpe.montant);
    item.periode = vm.selectedItemDemande_latrine_mpe.tranche.periode ;
    item.pourcentage = parseFloat(vm.selectedItemDemande_latrine_mpe.tranche.pourcentage) ;
};

//fonction bouton suppression item Demande_latrine_mpe
vm.supprimerDemande_latrine_mpe = function()
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
           if(pass[0].id_tranche_demande_mpe != currentItemDemande_latrine_mpe.id_tranche_demande_mpe)                   
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
    if (NouvelItemDemande_latrine_mpe==false)
    {
        getId = vm.selectedItemDemande_latrine_mpe.id; 
    } 
    
    var datas = $.param({
            supprimer: suppression,
            id:        getId,
            id_tranche_demande_mpe: demande_latrine_mpe.id_tranche_demande_mpe ,
            montant: demande_latrine_mpe.montant,
            id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id              
        });
        console.log(datas);
        //factory
    apiFactory.add("demande_latrine_mpe/index",datas, config).success(function (data)
    {   

        var tran= vm.alltranche_demande_latrine_mpe.filter(function(obj)
        {
            return obj.id == demande_latrine_mpe.id_tranche_demande_mpe;
        });

        if (NouvelItemDemande_latrine_mpe == false)
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
                
            }
            else 
            {    
              vm.alldemande_latrine_mpe = vm.alldemande_latrine_mpe.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_latrine_mpe.id;
              });

              apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_factureById",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
              {
                var pv_consta_entete_trav = result.data.response[0];
                if (pv_consta_entete_trav.facture!=null ||pv_consta_entete_trav.facture!=undefined)
                {
                      var montant_trav = parseFloat(pv_consta_entete_trav.montant_travaux) - parseFloat(demande_latrine_mpe.montant);
                      var montant_rabais = (montant_trav * pv_consta_entete_trav.facture.pourcentage_rabais)/100;
                      var montant_ht =  parseFloat(montant_trav)- parseFloat(montant_rabais);
                      //var montant_tva = (montant_ht *20)/100;
                      var montant_tva = 0;

                      var montant_ttc = montant_ht + montant_tva;
                      var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                      var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                      var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(pv_consta_entete_trav.facture.remboursement_acompte) + 
                      parseFloat(retenu_garanti) + parseFloat(pv_consta_entete_trav.facture.penalite_retard) + parseFloat(pv_consta_entete_trav.facture.remboursement_plaque)+parseFloat(taxe_marche_public));
                      var item_facture_mpe = {
                                id: pv_consta_entete_trav.facture.id,        
                                id_pv_consta_entete_travaux: pv_consta_entete_trav.facture.id_pv_consta_entete_travaux,        
                                numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                montant_travaux: montant_trav,
                                pourcentage_rabais: pv_consta_entete_trav.facture.pourcentage_rabais,
                                montant_rabais: montant_rabais,
                                montant_ht: montant_ht,
                                montant_tva: montant_tva,   
                                montant_ttc: montant_ttc, 
                                remboursement_acompte: pv_consta_entete_trav.facture.remboursement_acompte,   
                                penalite_retard: pv_consta_entete_trav.facture.penalite_retard, 
                                retenue_garantie: retenu_garanti, 
                                remboursement_plaque: pv_consta_entete_trav.facture.remboursement_plaque,
                                taxe_marche_public: taxe_marche_public,     
                                net_payer: net_payer,  
                                date_signature: pv_consta_entete_trav.facture.date_signature
                              };
                      console.log(item_facture_mpe);
                      majatfacture_mpe(item_facture_mpe,0);
                } 
                  //vm.selectedItemPv_consta_entete_travaux.total_cumul =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul) - parseFloat(demande_latrine_mpe.montant);
                  //vm.selectedItemPv_consta_entete_travaux.total_periode =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) - parseFloat(demande_latrine_mpe.montant); 
                  var item_pv =
                  {
                    id:        vm.selectedItemPv_consta_entete_travaux.id,
                    numero: pv_consta_entete_travaux.numero,
                    date_etablissement: pv_consta_entete_trav.date_etablissement,
                    montant_travaux: parseFloat(pv_consta_entete_trav.montant_travaux) - parseFloat(demande_latrine_mpe.montant),
                    avancement_global_cumul: pv_consta_entete_trav.avancement_global_cumul,
                    avancement_global_periode: pv_consta_entete_trav.avancement_global_periode,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id
                  } 
                   majpv_consta_entete_travaux(item_pv,0); 
              });
            }
            
        }
        else
        {
          demande_latrine_mpe.tranche = tran[0] ;
          demande_latrine_mpe.periode = tran[0].periode ;
          demande_latrine_mpe.pourcentage = tran[0].pourcentage ;
          demande_latrine_mpe.id  =   String(data.response);
          NouvelItemDemande_latrine_mpe= false; 
          apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_factureById",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
              {
                var pv_consta_entete_trav = result.data.response[0];
                console.log(pv_consta_entete_trav);
                if (pv_consta_entete_trav.facture!=null ||pv_consta_entete_trav.facture!=undefined)
                {console.log("te");
                      var montant_trav = parseFloat(pv_consta_entete_trav.montant_travaux) + parseFloat(demande_latrine_mpe.montant);
                      var montant_rabais = (montant_trav * pv_consta_entete_trav.facture.pourcentage_rabais)/100;
                      var montant_ht =  parseFloat(montant_trav)- parseFloat(montant_rabais);
                      //var montant_tva = (montant_ht *20)/100;
                      var montant_tva = 0;

                      var montant_ttc = montant_ht + montant_tva;
                      var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                      var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                      var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(pv_consta_entete_trav.facture.remboursement_acompte) + 
                      parseFloat(retenu_garanti) + parseFloat(pv_consta_entete_trav.facture.penalite_retard) + parseFloat(pv_consta_entete_trav.facture.remboursement_plaque)+parseFloat(taxe_marche_public));
                      var item_facture_mpe = {
                                id: pv_consta_entete_trav.facture.id,        
                                id_pv_consta_entete_travaux: pv_consta_entete_trav.facture.id_pv_consta_entete_travaux,        
                                numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                montant_travaux: montant_trav,
                                pourcentage_rabais: pv_consta_entete_trav.facture.pourcentage_rabais,
                                montant_rabais: montant_rabais,
                                montant_ht: montant_ht,
                                montant_tva: montant_tva,   
                                montant_ttc: montant_ttc, 
                                remboursement_acompte: pv_consta_entete_trav.facture.remboursement_acompte,   
                                penalite_retard: pv_consta_entete_trav.facture.penalite_retard, 
                                retenue_garantie: retenu_garanti, 
                                remboursement_plaque: pv_consta_entete_trav.facture.remboursement_plaque,
                                taxe_marche_public: taxe_marche_public,     
                                net_payer: net_payer,  
                                date_signature: pv_consta_entete_trav.facture.date_signature
                              };
                      console.log(item_facture_mpe);
                      majatfacture_mpe(item_facture_mpe,0);
                }                        
                else
                {     console.log("te2");

                      //montant_rabais 0 satri pourcentage 0 initial
                      //penalite retard 0 initial
                      var montant_trav = parseFloat(demande_latrine_mpe.montant);
                      var montant_ht = parseFloat(montant_trav);
                      var montant_tva = 0;

                      var montant_ttc = montant_ht + montant_tva;
                      var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                      var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                      var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - parseFloat(retenu_garanti)-parseFloat(taxe_marche_public);
                      var item_facture_mpe = {
                                id: 0,        
                                id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,        
                                numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                montant_travaux: montant_trav,
                                pourcentage_rabais: 0,
                                montant_rabais: 0,
                                montant_ht: montant_ht,
                                montant_tva: montant_tva,   
                                montant_ttc: montant_ttc, 
                                remboursement_acompte: 0,   
                                penalite_retard: 0, 
                                retenue_garantie: retenu_garanti, 
                                remboursement_plaque: 0,
                                taxe_marche_public: taxe_marche_public,    
                                net_payer: net_payer,  
                                date_signature: vm.datenow
                              };
                      majatfacture_mpe(item_facture_mpe,0);
                } 
                  //vm.selectedItemPv_consta_entete_travaux.total_cumul =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul) - parseFloat(demande_latrine_mpe.montant);
                  //vm.selectedItemPv_consta_entete_travaux.total_periode =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) - parseFloat(demande_latrine_mpe.montant); 
                  var item_pv =
                  {
                    id:        vm.selectedItemPv_consta_entete_travaux.id,
                    numero: pv_consta_entete_trav.numero,
                    date_etablissement: pv_consta_entete_trav.date_etablissement,
                    montant_travaux: parseFloat(pv_consta_entete_trav.montant_travaux) + parseFloat(demande_latrine_mpe.montant),
                    avancement_global_cumul: pv_consta_entete_trav.avancement_global_cumul,
                    avancement_global_periode: pv_consta_entete_trav.avancement_global_periode,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id
                  } 
                   majpv_consta_entete_travaux(item_pv,0); 
              });                  
          
    }
      //vm.showboutonValider = false;

      demande_latrine_mpe.$selected = false;
      demande_latrine_mpe.$edit = false;
      vm.selectedItemDemande_latrine_mpe = {};
      //vm.showbuttonNouvDemande_latrine_mpe_creer = false;
    //vm.steprubriquelatrine_mpe = false;
  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

}

 
vm.tranchechange_latrine_mpe = function(item)
{ 
  apiFactory.getAPIgeneraliserREST("demande_latrine_mpe/index","menu","getdemandeByContratTranche",
  'id_tranche_demande_mpe',item.id_tranche_demande_mpe,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
  {
    var demande_deja_introduit = result.data.response;
    var data_tranche = vm.alltranche_demande_latrine_mpe.filter(function(obj)
        {
            return obj.id == item.id_tranche_demande_mpe;
        });
        console.log(data_tranche);
        console.log(item);
        console.log(vm.selectedItemContrat_prestataire);
    console.log(demande_deja_introduit);
    if (demande_deja_introduit.length !=0)
    { console.log('1');
      var confirm = $mdDialog.confirm()
            .title('Cette action ne peut pas être réaliser.')
            .textContent('Cette tranche de paiement est déjà introduite.')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('Fermer')
            
            $mdDialog.show(confirm).then(function()
            {  
              item.id_tranche_demande_mpe = null;
            }, function() {
              //alert('rien');
            });
    }
    else
    {  
      
        console.log('2');
      var tranche_current = Math.max.apply(Math, data_tranche.map(function(o){return o.code.split(' ')[1];}));
      if (parseInt(tranche_current)>1)
      { console.log('3');
        var tranche_precedent = 'tranche '+parseInt(tranche_current)-1;
        apiFactory.getAPIgeneraliserREST("demande_latrine_mpe/index","menu","getdemandeByContratTranchenumero",'tranche_numero',
        tranche_precedent,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result_tranche)
        {
          var demande_tranche_precedent = result_tranche.data.response;
          if (demande_tranche_precedent.length!=0)
          {console.log('4');
            var confirm = $mdDialog.confirm()
            .title('Cette action ne peut pas être réaliser.')
            .textContent('Vous devriez entrer la '+tranche_precedent)
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('Fermer')
            
            $mdDialog.show(confirm).then(function()
            {  
              item.id_tranche_demande_mpe = null;
            }, function() {
              //alert('rien');
            });
          }
          else
          {    console.log('5');                      
            var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_latrine) * data_tranche[0].pourcentage)/100;
            var montant = montant_ttc/1;

            item.periode = data_tranche[0].periode;
            item.pourcentage = data_tranche[0].pourcentage;
            item.montant = montant;
          }
        });
      }
      else
      {console.log('6');
        var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_latrine) * data_tranche[0].pourcentage)/100;
            var montant = montant_ttc/1;

            item.periode = data_tranche[0].periode;
            item.pourcentage = data_tranche[0].pourcentage;
            item.montant = montant;
      } 
    }
  });
}
/************************************************fin latrine_mpe***************************************************/
/************************************************Debut rubrique attachement latrine_mpe***************************************************/

vm.pv_consta_rubrique_phase_lat_mpe_column = [
{titre:"Numero"
},
{titre:"Libelle"
},
{titre:"Prévision"
},
{titre:"Période"
},
{titre:"Anterieur"
},
{titre:"Cumul"
},
{titre:"Observation"
},
{titre:"Action"
}];

vm.click_pv_consta_rubrique_phase_lat_mpe = function()
{   
    vm.affiche_load =true;
    apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_phase_lat/index","menu","getpv_consta_rubrique_phase_pourcentagebycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
    {  
        vm.allpv_consta_rubrique_phase_lat_mpe= result.data.response;
        vm.steppv_consta_latrine_travaux = false;
        vm.affiche_load =false;
        console.log(vm.allpv_consta_rubrique_phase_lat_mpe);
    });
}
//fonction selection item rubrique attachement latrine mpe
vm.selectionPv_consta_rubrique_phase_lat_mpe= function (item)
{
    vm.selectedItemPv_consta_rubrique_phase_lat_mpe = item;
    if(item.$edit==false || item.$edit==undefined)
    {               
        currentItemPv_consta_rubrique_phase_lat_mpe   = JSON.parse(JSON.stringify(vm.selectedItemPv_consta_rubrique_phase_lat_mpe)); 
    }
    /*apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_prevu/index","menu","getattachement_latrineprevubyrubrique",
    "id_attachement_latrine",vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id,"id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
    {
            vm.allpv_consta_rubrique_phase_lat_prevus = result.data.response;
            vm.allpv_consta_rubrique_phase_lat_prevu = result.data.response;
            console.log(vm.allpv_consta_rubrique_phase_lat_prevu)
    });*/
    vm.steppv_consta_latrine_travaux = true;
    console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
};

$scope.$watch('vm.selectedItemPv_consta_rubrique_phase_lat_mpe', function()
{
     if (!vm.allpv_consta_rubrique_phase_lat_mpe) return;
     vm.allpv_consta_rubrique_phase_lat_mpe.forEach(function(item)
     {
        item.$selected = false;
     });
     vm.selectedItemPv_consta_rubrique_phase_lat_mpe.$selected = true;
});

function ajoutPv_consta_rubrique_phase_lat_mpe(pv_consta_rubrique_phase_lat_mpe,suppression)
{
    if (NouvelItemPv_consta_rubrique_phase_lat_mpe==false)
    {                
      test_existancePv_consta_rubrique_phase_lat_mpe (pv_consta_rubrique_phase_lat_mpe,suppression); 
    } 
    else
    {
        insert_in_basePv_consta_rubrique_phase_lat_mpe(pv_consta_rubrique_phase_lat_mpe,suppression);
    }
}

//fonction de bouton d'annulation document_feffi_scan
vm.annulerPv_consta_rubrique_phase_lat_mpe = function(item)
{
  if (NouvelItemPv_consta_rubrique_phase_lat_mpe == false)
  {
    item.$edit = false;
    item.$selected = false;
    item.observation   = currentItemPv_consta_rubrique_phase_lat_mpe.observation ;
  }else
  {
    /*vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
    {
        return obj.id != vm.selectedItemDocument_feffi_scan.id;
    });*/
    item.observation   = '' ;
    item.$edit = false;
    item.$selected = false;

    item.id = null;
  }

  vm.selectedItemPv_consta_rubrique_phase_lat_mpe = {} ;
  NouvelItemPv_consta_rubrique_phase_lat_mpe      = false;
  
};


//fonction masque de saisie modification item feffi
vm.modifierPv_consta_rubrique_phase_lat_mpe = function(item)
{
    
    vm.selectedItemPv_consta_rubrique_phase_lat_mpe = item;
    currentItemPv_consta_rubrique_phase_lat_mpe = angular.copy(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
    $scope.vm.allpv_consta_rubrique_phase_lat_mpe.forEach(function(jus) {
      jus.$edit = false;
    });
    item.$edit = true;
    item.$selected = true;
    if (item.id==null)
    { 
      NouvelItemPv_consta_rubrique_phase_lat_mpe=true;
      console.log('atonull');
      item.observation   = vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation ;
      item.id   = '0' ;

    }
    else
    {NouvelItemPv_consta_rubrique_phase_lat_mpe = false ;
        console.log('tsnull');
        item.observation   = vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation ;
    }          
    
    //console.log(item);
    //vm.showThParcourir = true;
};

//fonction bouton suppression item document_feffi_scan
vm.supprimerPv_consta_rubrique_phase_lat_mpe = function()
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
        vm.ajoutPv_consta_rubrique_phase_lat_mpe(vm.selectedItemPv_consta_rubrique_phase_lat_mpe,1);
      }, function() {
        //alert('rien');
      });
};

//function teste s'il existe une modification item feffi
function test_existancePv_consta_rubrique_phase_lat_mpe (item,suppression)
{          
    if (suppression!=1)
    {
       var mem = vm.allpv_consta_rubrique_phase_lat_mpe.filter(function(obj)
        {
           return obj.id == currentItemPv_consta_rubrique_phase_lat_mpe.id;
        });
        if(mem[0])
        {
           if(mem[0].observation   != currentItemPv_consta_rubrique_phase_lat_mpe.observation)                   
              { 
                 insert_in_basePv_consta_rubrique_phase_lat_mpe(item,suppression);
              }
              else
              {  
                item.$selected = true;
                item.$edit = false;
              }
        }
    } else
          insert_in_basePv_consta_rubrique_phase_lat_mpe(item,suppression);
}
//insertion ou mise a jours ou suppression item dans bdd feffi
function insert_in_basePv_consta_rubrique_phase_lat_mpe(pv_consta_rubrique_phase_lat_mpe,suppression)
{
    //add
    var config =
    {
        headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
    };
    
    var getId = 0;
    if (NouvelItemPv_consta_rubrique_phase_lat_mpe==false)
    {
        getId = vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id; 
    } 
    
    var datas = $.param({
            supprimer: suppression,
            id:        getId,
            periode: pv_consta_rubrique_phase_lat_mpe.periode,
            observation: pv_consta_rubrique_phase_lat_mpe.observation,
            id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
            id_rubrique_phase:pv_consta_rubrique_phase_lat_mpe.id_phase               
        });
        console.log(datas);
        //factory
    apiFactory.add("pv_consta_detail_lat_travaux/index",datas, config).success(function (data)
    {  

        if (NouvelItemPv_consta_rubrique_phase_lat_mpe == false)
        {
            // Update or delete: id exclu                 
            if(suppression==0)
            {                        
                //vm.selectedItemPv_consta_rubrique_phase_lat_mpe.convention = conve[0];
                
                vm.selectedItemPv_consta_rubrique_phase_lat_mpe.$selected  = false;
                vm.selectedItemPv_consta_rubrique_phase_lat_mpe.$edit      = false;
                vm.selectedItemPv_consta_rubrique_phase_lat_mpe ={};
            }
            else 
            {    
              vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation='';
            
            }
        }
        else
        {
          //avenant_convention.convention = conve[0];
          pv_consta_rubrique_phase_lat_mpe.id  =   String(data.response);              
          NouvelItemPv_consta_rubrique_phase_lat_mpe=false;
        }
      pv_consta_rubrique_phase_lat_mpe.$selected = false;
      pv_consta_rubrique_phase_lat_mpe.$edit = false;
      vm.selectedItemPv_consta_rubrique_phase_lat_mpe = {};
    
  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

}

vm.Total_prevu_latrine = function(){
    var total_prevu = 0;
    if (vm.allpv_consta_rubrique_phase_lat_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_lat_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_lat_mpe[i];
            total_prevu += parseFloat(product.pourcentage_prevu);
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

vm.Total_periode_latrine = function(){
    var total_periode = 0;
    if (vm.allpv_consta_rubrique_phase_lat_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_lat_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_lat_mpe[i];
            if (product.periode!=null) {                      
            total_periode += parseFloat(product.periode);
            }
        }
    }
    
    var nbr=parseFloat(total_periode);
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

vm.Total_anterieur_latrine = function(){
    var total_anterieur = 0;
    if (vm.allpv_consta_rubrique_phase_lat_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_lat_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_lat_mpe[i];
            if (product.anterieur!=null) {                      
              total_anterieur += parseFloat(product.anterieur);
              }
        }
    }
    
    var nbr=parseFloat(total_anterieur);
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

vm.Total_cumul_latrine = function(){
    var total_cumul = 0;
    if (vm.allpv_consta_rubrique_phase_lat_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_lat_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_lat_mpe[i];
            var p = 0;
            var a = 0;
            if (product.periode!=null) {                      
              p= parseFloat(product.periode);
              }
              if (product.anterieur!=null) {                      
                a= parseFloat(product.anterieur);
                }
            total_cumul += parseFloat(p)+parseFloat(a);
        }
    }
    
    var nbr=parseFloat(total_cumul);
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
vm.click_tab_pv_consta_statu_lat_travaux = function()
{   
    vm.affiche_load =true;
    apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_designation_lat/index","menu","getpv_consta_statutravauxbyphasecontrat",
    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
    ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase).then(function(result)
    {
        vm.allpv_consta_statu_lat_travaux = result.data.response;
        console.log(vm.allpv_consta_statu_lat_travaux);
        console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
        vm.affiche_load =false;
    });
}
vm.changestatu_lat = function(item)
{
    insert_in_basePv_consta_statu_lat_travaux(item,0);
    console.log(item);
}        
//insertion ou mise a jours ou suppression item dans bdd divers_attachement_latrine_travaux
function insert_in_basePv_consta_statu_lat_travaux(pv_consta_statu_lat_travaux,suppression)
{
    //add
    var config =
    {
        headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
    };
    vm.affiche_load = true;
    var getId = 0;
    var stat =0;
    if (pv_consta_statu_lat_travaux.periode==true)
    {
      stat = 1;
    }
    if (pv_consta_statu_lat_travaux.id!=null || pv_consta_statu_lat_travaux.id!=undefined)
    {
        getId = pv_consta_statu_lat_travaux.id; 
    } 
    
    var datas = $.param({
            supprimer: suppression,
            id:        getId,
            id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
            id_rubrique_designation: pv_consta_statu_lat_travaux.id_designation,
            status: stat           
        });
        console.log(datas);
        
        console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
        //factory
    apiFactory.add("pv_consta_statu_lat_travaux/index",datas, config).success(function (data)
    {
        
      if (pv_consta_statu_lat_travaux.id != null || pv_consta_statu_lat_travaux.id != undefined)
      {
        //test et insertion facture p1 et p2 latrine

        var facture_p1etp2latrine = new Promise(function(resolvefact, rejectfact)
        {
              apiFactory.getAPIgeneraliserREST("pv_consta_statu_lat_travaux/index","menu","getcount_desination_inferieur6byphasecontrat",
            "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
            ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase).then(function(result)
            {
                var count_desination_statu = result.data.response;

                if (parseInt(count_desination_statu[0].nombre)==5)
                {                   
                      apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailp5p6byconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                      {
                          var detail = result.data.response;
                          console.log(detail);
                          var paiement1et2 = new Promise(function(resolve, reject)
                          {
                              if (detail[0].id_detail_p5==null || detail[0].id_detail_p5==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe5 = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu_p5,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu_p5,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe5);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe5, config).success(function (data)
                                  {
                                    resolve();                                    
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0,
                                        statu_fact: 1              
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var data_id_entete=String(data.response);
                                      var datas_fact_moe5 = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu_p5,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu_p5,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe5);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe5, config).success(function (data)
                                        {
                                          detail[0].id_entete=data_id_entete;
                                          resolve();
                                        });
                                    });
                                }
                              }
                              else
                              {
                                resolve();
                              }
                            }); 
                            paiement1et2.then(function(){
                            
                                  console.log(detail);
                                  
                                      if (detail[0].id_detail_p6==null || detail[0].id_detail_p6==undefined)
                                      {
                                        if (detail[0].id_entete)
                                        {
                                          var datas_fact_moe6 = $.param({
                                            supprimer: 0,
                                            id:        0,
                                            id_calendrier_paie_moe_prevu: detail[0].id_prevu_p6,
                                            id_facture_moe_entete: detail[0].id_entete,
                                            montant_periode: detail[0].montant_prevu_p6,
                                            observation: ""           
                                          });
                                          console.log(datas_fact_moe6);
                                          apiFactory.add("facture_moe_detail/index",datas_fact_moe6, config).success(function (data)
                                          {
                                            resolvefact();
                                          });
                                        }
                                        else
                                        {     
                                            var num=1;
                                            if (detail[0].num_max)
                                            {
                                              num = parseInt(detail[0].num_max)+1;
                                            }
            
                                              var datas_entete = $.param({
                                                supprimer: 0,
                                                id:        0,
                                                numero: num,
                                                date_br:convertionDate(new Date()),
                                                id_contrat_bureau_etude: detail[0].id_contrat,
                                                validation: 0,
                                                statu_fact: 1               
                                            });
                                            console.log(datas_entete);
                                            //factory
                                            apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                            {
                                                var data_id_entete=String(data.response);
                                              var datas_fact_moe6 = $.param({
                                                  supprimer: 0,
                                                  id:        0,
                                                  id_calendrier_paie_moe_prevu: detail[0].id_prevu_p6,
                                                  id_facture_moe_entete: String(data.response),
                                                  montant_periode: detail[0].montant_prevu_p6,
                                                  observation: ""           
                                                });
                                                console.log(datas_fact_moe6);
                                                apiFactory.add("facture_moe_detail/index",datas_fact_moe6, config).success(function (data)
                                                {
                                                  detail[0].id_entete=data_id_entete;
                                                  resolvefact();
                                                });
                                            });
                                        }
                                      } 
                                      else
                                      {
                                        resolvefact();
                                      }                                                   
                            
                          });                    
                      });
                  

                } 
                if (parseInt(count_desination_statu[0].nombre)<5)
                {
                  apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailp5p6supprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                  {
                      var detail = result.data.response;
                      console.log(detail);
                    
                          if (detail[0].id_detail_p5!=null && detail[0].id_detail_p5!=undefined)
                          {
                            
                              var datas_fact_moe5 = $.param({
                                supprimer: 1,
                                id:        detail[0].id_detail_p5,
                                id_calendrier_paie_moe_prevu: detail[0].id_prevu_p5,
                                id_facture_moe_entete: detail[0].id_entete,
                                montant_periode: detail[0].montant_prevu_p5,
                                observation: ""           
                              });
                              console.log(datas_fact_moe5);
                              apiFactory.add("facture_moe_detail/index",datas_fact_moe5, config).success(function (data)
                              {
                                
                              });
                            
                            
                          }
                              
                          if (detail[0].id_detail_p6!=null && detail[0].id_detail_p6!=undefined)
                          {
                              var datas_fact_moe6 = $.param({
                                        supprimer: 1,
                                        id:        detail[0].id_detail_p6,
                                        id_calendrier_paie_moe_prevu: detail[0].id_prevu_p6,
                                        id_facture_moe_entete: detail[0].id_entete,
                                        montant_periode: detail[0].montant_prevu_p6,
                                        observation: ""           
                              });
                              console.log(datas_fact_moe6);
                              apiFactory.add("facture_moe_detail/index",datas_fact_moe6, config).success(function (data)
                              {
                              });
                                    
                          } 
                          resolvefact();          
                  });
                }
            });
        });
        facture_p1etp2latrine.then(function() {console.log('to');
              apiFactory.getAPIgeneraliserREST("pv_consta_statu_lat_travaux/index","menu","getcount_desination_statubyphasecontrat",
            "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
            ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase).then(function(result)
            {
              console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
                var count_desination_statu = result.data.response;
                console.log(count_desination_statu);
                var getId_detail = 0;
                if (vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id!=null || vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id!=undefined)
                {
                    getId_detail = vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id; 
                }
                if (vm.allpv_consta_statu_lat_travaux.length==parseInt(count_desination_statu[0].nombre))
                { 
                  console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
                    var datas_detail = $.param({
                      supprimer: 0,
                      id:        getId_detail,
                      id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                      id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase,
                      periode: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.pourcentage_prevu,
                      observation: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation           
                    });
                    console.log(datas_detail);
                    apiFactory.add("pv_consta_detail_lat_travaux/index",datas_detail, config).success(function (data)
                    {
                      if (vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != undefined)
                      { 
                        console.log('atodet1');
                      }
                      else
                      {
                        vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id  =   String(data.response);
                        console.log('atodet2');
                      }
                    });
                    apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p7').then(function(result)
                      {
                          var detail_p7 = result.data.response;
                          console.log(detail_p7);
                              if (detail_p7[0].id_detail==null || detail_p7[0].id_detail==undefined)
                              {
                                if (detail_p7[0].id_entete)
                                {
                                  var datas_fact_moe7 = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail_p7[0].id_prevu,
                                    id_facture_moe_entete: detail_p7[0].id_entete,
                                    montant_periode: detail_p7[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe7);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe7, config).success(function (data)
                                  {
                                                                        
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail_p7[0].num_max)
                                    {
                                      num = parseInt(detail_p7[0].num_max)+1;
                                    }
                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail_p7[0].id_contrat,
                                        validation: 0 ,
                                        statu_fact: 1              
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var data_id_entete=String(data.response);
                                      var datas_fact_moe7 = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail_p7[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail_p7[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe7);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe7, config).success(function (data)
                                        {
                                          detail_p7[0].id_entete=data_id_entete;
                                         
                                        });
                                    });
                                }
                              }                     
                      });
                } 
                else
                {
                    var datas_detail = $.param({
                      supprimer: 0,
                      id:        getId_detail,
                      id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                      id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase,
                      periode: 0,
                      observation: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation           
                    });
                    console.log(datas_detail);
                    apiFactory.add("pv_consta_detail_lat_travaux/index",datas_detail, config).success(function (data_detail)
                    {
                      if (vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != undefined)
                      { 
                        console.log('atodett1');
                      }
                      else
                      {
                        vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id  =   String(data_detail.response);
                        console.log('atodett2');
                      }
                    });

                    apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p7').then(function(result)
                    {
                        var detail_p7 = result.data.response;
                        console.log(detail_p7);
                            if (detail_p7[0].id_detail!=null && detail_p7[0].id_detail!=undefined)
                            {
                                var datas_fact_moe7 = $.param({
                                  supprimer: 1,
                                  id:        detail_p7[0].id_detail,
                                  id_calendrier_paie_moe_prevu: detail_p7[0].id_prevu,
                                  id_facture_moe_entete: detail_p7[0].id_entete,
                                  montant_periode: detail_p7[0].montant_prevu,
                                  observation: ""           
                                });
                                console.log(datas_fact_moe7);
                                apiFactory.add("facture_moe_detail/index",datas_fact_moe7, config).success(function (data)
                                {
                                                                      
                                });
                              
                            }                     
                    });
                }
            });
        });
        
      }
      else
      {
        var facture_p1etp2latrine = new Promise(function(resolvefact, rejectfact)
        {
              apiFactory.getAPIgeneraliserREST("pv_consta_statu_lat_travaux/index","menu","getcount_desination_inferieur6byphasecontrat",
            "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
            ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase).then(function(result)
            {
                var count_desination_statu = result.data.response;

                if (parseInt(count_desination_statu[0].nombre)==5)
                {                   
                      apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailp5p6byconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                      {
                          var detail = result.data.response;
                          console.log(detail);
                          var paiement1et2 = new Promise(function(resolve, reject)
                          {
                              if (detail[0].id_detail_p5==null || detail[0].id_detail_p5==undefined)
                              {
                                if (detail[0].id_entete)
                                {
                                  var datas_fact_moe5 = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail[0].id_prevu_p5,
                                    id_facture_moe_entete: detail[0].id_entete,
                                    montant_periode: detail[0].montant_prevu_p5,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe5);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe5, config).success(function (data)
                                  {
                                    resolve();                                    
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail[0].num_max)
                                    {
                                      num = parseInt(detail[0].num_max)+1;
                                    }

                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail[0].id_contrat,
                                        validation: 0,
                                        statu_fact: 1               
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var data_id_entete=String(data.response);
                                      var datas_fact_moe5 = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail[0].id_prevu_p5,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail[0].montant_prevu_p5,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe5);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe5, config).success(function (data)
                                        {
                                          detail[0].id_entete=data_id_entete;
                                          resolve();
                                        });
                                    });
                                }
                              }
                              else
                              {
                                resolve();
                              }
                            }); 
                            paiement1et2.then(function() {
                            
                                  console.log(detail);
                                  
                                      if (detail[0].id_detail_p6==null || detail[0].id_detail_p6==undefined)
                                      {
                                        if (detail[0].id_entete)
                                        {
                                          var datas_fact_moe6 = $.param({
                                            supprimer: 0,
                                            id:        0,
                                            id_calendrier_paie_moe_prevu: detail[0].id_prevu_p6,
                                            id_facture_moe_entete: detail[0].id_entete,
                                            montant_periode: detail[0].montant_prevu_p6,
                                            observation: ""           
                                          });
                                          console.log(datas_fact_moe6);
                                          apiFactory.add("facture_moe_detail/index",datas_fact_moe6, config).success(function (data)
                                          {
                                            resolvefact();
                                          });
                                        }
                                        else
                                        {     
                                            var num=1;
                                            if (detail[0].num_max)
                                            {
                                              num = parseInt(detail[0].num_max)+1;
                                            }
            
                                              var datas_entete = $.param({
                                                supprimer: 0,
                                                id:        0,
                                                numero: num,
                                                date_br:convertionDate(new Date()),
                                                id_contrat_bureau_etude: detail[0].id_contrat,
                                                validation: 0,
                                                statu_fact: 1               
                                            });
                                            console.log(datas_entete);
                                            //factory
                                            apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                            {
                                                var data_id_entete=String(data.response);
                                              var datas_fact_moe6 = $.param({
                                                  supprimer: 0,
                                                  id:        0,
                                                  id_calendrier_paie_moe_prevu: detail[0].id_prevu_p6,
                                                  id_facture_moe_entete: String(data.response),
                                                  montant_periode: detail[0].montant_prevu_p6,
                                                  observation: ""           
                                                });
                                                console.log(datas_fact_moe6);
                                                apiFactory.add("facture_moe_detail/index",datas_fact_moe6, config).success(function (data)
                                                {
                                                  detail[0].id_entete=data_id_entete;
                                                  resolvefact();
                                                });
                                            });
                                        }
                                      } 
                                      else
                                      {
                                        resolvefact();
                                      }                                                   
                            
                          });                    
                      });
                  

                } 
                if (parseInt(count_desination_statu[0].nombre)<5)
                {
                  apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailp5p6supprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                  {
                      var detail = result.data.response;
                      console.log(detail);
                    
                          if (detail[0].id_detail_p5!=null && detail[0].id_detail_p5!=undefined)
                          {
                            
                              var datas_fact_moe5 = $.param({
                                supprimer: 1,
                                id:        detail[0].id_detail_p5,
                                id_calendrier_paie_moe_prevu: detail[0].id_prevu_p5,
                                id_facture_moe_entete: detail[0].id_entete,
                                montant_periode: detail[0].montant_prevu_p5,
                                observation: ""           
                              });
                              console.log(datas_fact_moe5);
                              apiFactory.add("facture_moe_detail/index",datas_fact_moe5, config).success(function (data)
                              {
                                
                              });
                            
                            
                          }
                              
                          if (detail[0].id_detail_p6!=null && detail[0].id_detail_p6!=undefined)
                          {
                              var datas_fact_moe6 = $.param({
                                        supprimer: 1,
                                        id:        detail[0].id_detail_p6,
                                        id_calendrier_paie_moe_prevu: detail[0].id_prevu_p6,
                                        id_facture_moe_entete: detail[0].id_entete,
                                        montant_periode: detail[0].montant_prevu_p6,
                                        observation: ""           
                              });
                              console.log(datas_fact_moe6);
                              apiFactory.add("facture_moe_detail/index",datas_fact_moe6, config).success(function (data)
                              {
                              });
                                    
                          } 
                          resolvefact();          
                  });
                }
            });
        });
        facture_p1etp2latrine.then(function() {
          console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
          pv_consta_statu_lat_travaux.id  =   String(data.response); 
          console.log(pv_consta_statu_lat_travaux)  
          console.log('ato2'); apiFactory.getAPIgeneraliserREST("pv_consta_statu_lat_travaux/index","menu","getcount_desination_statubyphasecontrat",
          "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
          ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase).then(function(result)
          {
              var count_desination_statu = result.data.response;
              console.log(count_desination_statu);
              var getId_detail = 0;
              if (vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id!=null || vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id!=undefined)
              {
                  getId_detail = vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id; 
              }
              if (vm.allpv_consta_statu_lat_travaux.length==parseInt(count_desination_statu[0].nombre))
              { 
                console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
                  var datas_detail = $.param({
                    supprimer: 0,
                    id:        getId_detail,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                    id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase,
                    periode: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.pourcentage_prevu,
                    observation: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation           
                  });
                  console.log(datas_detail);
                  console.log(vm.selectedItemPv_consta_rubrique_phase_lat_mpe);
                  apiFactory.add("pv_consta_detail_lat_travaux/index",datas_detail, config).success(function (data)
                  {
                    if (vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != undefined)
                    { 
                      console.log('atodet1');
                    }
                    else
                    {
                      vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id  =   String(data.response);
                      console.log('atodet2');
                    }
                  });
                  apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p7').then(function(result)
                      {
                          var detail_p7 = result.data.response;
                          console.log(detail_p7);
                              if (detail_p7[0].id_detail==null || detail_p7[0].id_detail==undefined)
                              {
                                if (detail_p7[0].id_entete)
                                {
                                  var datas_fact_moe7 = $.param({
                                    supprimer: 0,
                                    id:        0,
                                    id_calendrier_paie_moe_prevu: detail_p7[0].id_prevu,
                                    id_facture_moe_entete: detail_p7[0].id_entete,
                                    montant_periode: detail_p7[0].montant_prevu,
                                    observation: ""           
                                  });
                                  console.log(datas_fact_moe7);
                                  apiFactory.add("facture_moe_detail/index",datas_fact_moe7, config).success(function (data)
                                  {
                                                                        
                                  });
                                }
                                else
                                {     
                                    var num=1;
                                    if (detail_p7[0].num_max)
                                    {
                                      num = parseInt(detail_p7[0].num_max)+1;
                                    }
                                      var datas_entete = $.param({
                                        supprimer: 0,
                                        id:        0,
                                        numero: num,
                                        date_br:convertionDate(new Date()),
                                        id_contrat_bureau_etude: detail_p7[0].id_contrat,
                                        validation: 0,
                                        statu_fact: 1               
                                    });
                                    console.log(datas_entete);
                                    //factory
                                    apiFactory.add("facture_moe_entete/index",datas_entete, config).success(function (data)
                                    {
                                        var data_id_entete=String(data.response);
                                      var datas_fact_moe7 = $.param({
                                          supprimer: 0,
                                          id:        0,
                                          id_calendrier_paie_moe_prevu: detail_p7[0].id_prevu,
                                          id_facture_moe_entete: String(data.response),
                                          montant_periode: detail_p7[0].montant_prevu,
                                          observation: ""           
                                        });
                                        console.log(datas_fact_moe7);
                                        apiFactory.add("facture_moe_detail/index",datas_fact_moe7, config).success(function (data)
                                        {
                                          detail_p7[0].id_entete=data_id_entete;
                                         
                                        });
                                    });
                                }
                              }                     
                      });
              } 
              else
              {
                  var datas_detail = $.param({
                    supprimer: 0,
                    id:        getId_detail,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                    id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id_phase,
                    periode: 0,
                    observation: vm.selectedItemPv_consta_rubrique_phase_lat_mpe.observation           
                  });
                  console.log(datas_detail);
                  apiFactory.add("pv_consta_detail_lat_travaux/index",datas_detail, config).success(function (data_detail)
                  {
                    if (vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id != undefined)
                    { 
                      console.log('atodett1');
                    }
                    else
                    {
                      vm.selectedItemPv_consta_rubrique_phase_lat_mpe.id  =   String(data_detail.response);
                      console.log('atodett2');
                    }
                  });
                  apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getfacturedetailsupprbyconventionandcode','id_convention_entete',vm.selectedItemConvention_entete.id,'code_pai','p7').then(function(result)
                    {
                        var detail_p7 = result.data.response;
                        console.log(detail_p7);
                            if (detail_p7[0].id_detail!=null && detail_p7[0].id_detail!=undefined)
                            {
                                var datas_fact_moe7 = $.param({
                                  supprimer: 1,
                                  id:        detail_p7[0].id_detail,
                                  id_calendrier_paie_moe_prevu: detail_p7[0].id_prevu,
                                  id_facture_moe_entete: detail_p7[0].id_entete,
                                  montant_periode: detail_p7[0].montant_prevu,
                                  observation: ""           
                                });
                                console.log(datas_fact_moe7);
                                apiFactory.add("facture_moe_detail/index",datas_fact_moe7, config).success(function (data)
                                {
                                                                      
                                });
                              
                            }                     
                    });
              }
          });
        });
        //eto
        
       
      }
      vm.affiche_load = false;
  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

}


    /******************************************fin attachement latrine travaux***********************************************/




/************************************************debut mobilier_mpe*************************************************/
vm.click_tab_tranche_mobilier = function()
{   vm.affiche_load =true;
  NouvelItemDemande_mobilier_mpe = false;
    apiFactory.getAPIgeneraliserREST("demande_mobilier_mpe/index","menu","getdemandeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
    {
        vm.alldemande_mobilier_mpe = result.data.response;
        vm.affiche_load =false;
    });

   /* vm.steprubriquemobilier_mpe = false;
    vm.steprubriquelatrine_mpe = false;                
    vm.steprubriquemobilier_mpe = false;*/

    vm.steppv_consta_mobilier_travaux = false;
    vm.steppv_consta_latrine_travaux = false;
    vm.steppv_consta_mobilier_travaux = false;
}
vm.demande_mobilier_mpe_column = [
{titre:"Tranche"
},
{titre:"Montant"
},
{titre:"Condition de paiement"
},
{titre:"Pourcentage"
},
{titre:"Action"
}];        

//Masque de saisi ajout

vm.ajouterDemande_mobilier_mpe = function ()
{ 
  

if (NouvelItemDemande_mobilier_mpe == false)
  {  
    var items = {
      $edit: true,
      $selected: true,
      id: '0',
      tranche: '',
      montant: '',
      periode: '',
      pourcentage:''
    };
    vm.alldemande_mobilier_mpe.unshift(items);
    vm.alldemande_mobilier_mpe.forEach(function(mem)
    {
      if(mem.$selected==true)
      {
        vm.selectedItemDemande_mobilier_mpe = mem;
      }
    });
    NouvelItemDemande_mobilier_mpe = true ;             
      
  }else
  {
      vm.showAlert('Ajout Tranche demande mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
  }          
  
};

//fonction ajout dans bdd
function ajoutDemande_mobilier_mpe(demande_mobilier_mpe,suppression)
{
    if (NouvelItemDemande_mobilier_mpe==false)
    {
        apiFactory.getAPIgeneraliserREST("demande_mobilier_mpe/index","menu","getdemandevalideById",'id_demande_mobilier_mpe',demande_mobilier_mpe.id).then(function(result)
        {
          var demande_mobilier_valide = result.data.response;
          if (demande_mobilier_valide.length !=0)
          {
              var confirm = $mdDialog.confirm()
            .title('cette modification n\'est pas autorisé.')
            .textContent(' Les données sont déjà validées ou rejetée')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('Fermer')
            
            $mdDialog.show(confirm).then(function()
            { 
              vm.step_tranche_mobilier_mpe = false;                
              vm.step_tranche_latrine_mpe = false;
              vm.step_tranche_mobilier_mpe = false;

              vm.steprubriquemobilier_mpe = false;
              vm.steprubriquelatrine_mpe = false;                
              vm.steprubriquemobilier_mpe = false;
              vm.stepdecompte =false;

              vm.steppv_consta_mobilier_travaux = false;
              vm.steppv_consta_latrine_travaux = false;
              vm.steppv_consta_mobilier_travaux = false;

            }, function() {
              //alert('rien');
            });
          }
          else
          {
            test_existanceDemande_mobilier_mpe (demande_mobilier_mpe,suppression);  
          }
        });  
    } 
    else
    {
        insert_in_baseDemande_mobilier_mpe(demande_mobilier_mpe,suppression);
    }
}

//fonction de bouton d'annulation demande_mobilier_mpe
vm.annulerDemande_mobilier_mpe = function(item)
{
  if (NouvelItemDemande_mobilier_mpe == false)
  {
    item.$edit = false;
    item.$selected = false;
    item.id_tranche_demande_mpe = currentItemDemande_mobilier_mpe.id_tranche_demande_mpe ;
    item.montant   = currentItemDemande_mobilier_mpe.montant ;
    item.periode   = currentItemDemande_mobilier_mpe.periode ;
    item.pourcentage = currentItemDemande_mobilier_mpe.pourcentage ;
  }else
  {
    vm.alldemande_mobilier_mpe = vm.alldemande_mobilier_mpe.filter(function(obj)
    {
        return obj.id !== vm.selectedItemDemande_mobilier_mpe.id;
    });
  }

  vm.selectedItemDemande_mobilier_mpe = {} ;
  NouvelItemDemande_mobilier_mpe     = false;
  
};

//fonction selection item Demande_mobilier_mpe
vm.selectionDemande_mobilier_mpe= function (item)
{
    vm.selectedItemDemande_mobilier_mpe = item;
   // vm.NouvelItemDemande_mobilier_mpe   = item;
    currentItemDemande_mobilier_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_mobilier_mpe));
   
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
    NouvelItemDemande_mobilier_mpe = false ;
    vm.selectedItemDemande_mobilier_mpe = item;
    currentItemDemande_mobilier_mpe = angular.copy(vm.selectedItemDemande_mobilier_mpe);
    $scope.vm.alldemande_mobilier_mpe.forEach(function(mem) {
      mem.$edit = false;
    });

    item.$edit = true;
    item.$selected = true;
    item.id_tranche_demande_mpe = vm.selectedItemDemande_mobilier_mpe.tranche.id ;
    item.montant   = parseFloat(vm.selectedItemDemande_mobilier_mpe.montant);
    item.periode = vm.selectedItemDemande_mobilier_mpe.tranche.periode ;
    item.pourcentage = parseFloat(vm.selectedItemDemande_mobilier_mpe.tranche.pourcentage) ;
};

//fonction bouton suppression item Demande_mobilier_mpe
vm.supprimerDemande_mobilier_mpe = function()
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
           if(pass[0].id_tranche_demande_mpe != currentItemDemande_mobilier_mpe.id_tranche_demande_mpe)                   
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
    if (NouvelItemDemande_mobilier_mpe==false)
    {
        getId = vm.selectedItemDemande_mobilier_mpe.id; 
    } 
    
    var datas = $.param({
            supprimer: suppression,
            id:        getId,
            id_tranche_demande_mpe: demande_mobilier_mpe.id_tranche_demande_mpe ,
            montant: demande_mobilier_mpe.montant,
            id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id              
        });
        console.log(datas);
        //factory
    apiFactory.add("demande_mobilier_mpe/index",datas, config).success(function (data)
    {   

        var tran= vm.alltranche_demande_mobilier_mpe.filter(function(obj)
        {
            return obj.id == demande_mobilier_mpe.id_tranche_demande_mpe;
        });

        if (NouvelItemDemande_mobilier_mpe == false)
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
                
            }
            else 
            {    
              vm.alldemande_mobilier_mpe = vm.alldemande_mobilier_mpe.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_mobilier_mpe.id;
              });

              apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_factureById",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
              {
                var pv_consta_entete_trav = result.data.response[0];
                if (pv_consta_entete_trav.facture!=null ||pv_consta_entete_trav.facture!=undefined)
                {
                      var montant_trav = parseFloat(pv_consta_entete_trav.montant_travaux) - parseFloat(demande_mobilier_mpe.montant);
                      var montant_rabais = (montant_trav * pv_consta_entete_trav.facture.pourcentage_rabais)/100;
                      var montant_ht =  parseFloat(montant_trav)- parseFloat(montant_rabais);
                      //var montant_tva = (montant_ht *20)/100;
                      var montant_tva = 0;

                      var montant_ttc = montant_ht + montant_tva;
                      var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                      var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                      var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(pv_consta_entete_trav.facture.remboursement_acompte) + 
                      parseFloat(retenu_garanti) + parseFloat(pv_consta_entete_trav.facture.penalite_retard) + parseFloat(pv_consta_entete_trav.facture.remboursement_plaque)+parseFloat(taxe_marche_public));
                      var item_facture_mpe = {
                                id: pv_consta_entete_trav.facture.id,        
                                id_pv_consta_entete_travaux: pv_consta_entete_trav.facture.id_pv_consta_entete_travaux,        
                                numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                montant_travaux: montant_trav,
                                pourcentage_rabais: pv_consta_entete_trav.facture.pourcentage_rabais,
                                montant_rabais: montant_rabais,
                                montant_ht: montant_ht,
                                montant_tva: montant_tva,   
                                montant_ttc: montant_ttc, 
                                remboursement_acompte: pv_consta_entete_trav.facture.remboursement_acompte,   
                                penalite_retard: pv_consta_entete_trav.facture.penalite_retard, 
                                retenue_garantie: retenu_garanti, 
                                remboursement_plaque: pv_consta_entete_trav.facture.remboursement_plaque,
                                taxe_marche_public: taxe_marche_public,     
                                net_payer: net_payer,  
                                date_signature: pv_consta_entete_trav.facture.date_signature
                              };
                      console.log(item_facture_mpe);
                      majatfacture_mpe(item_facture_mpe,0);
                } 
                  //vm.selectedItemPv_consta_entete_travaux.total_cumul =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul) - parseFloat(demande_mobilier_mpe.montant);
                  //vm.selectedItemPv_consta_entete_travaux.total_periode =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) - parseFloat(demande_mobilier_mpe.montant); 
                  var item_pv =
                  {
                    id:        vm.selectedItemPv_consta_entete_travaux.id,
                    numero: pv_consta_entete_travaux.numero,
                    date_etablissement: pv_consta_entete_trav.date_etablissement,
                    montant_travaux: parseFloat(pv_consta_entete_trav.montant_travaux) - parseFloat(demande_mobilier_mpe.montant),
                    avancement_global_cumul: pv_consta_entete_trav.avancement_global_cumul,
                    avancement_global_periode: pv_consta_entete_trav.avancement_global_periode,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id
                  } 
                   majpv_consta_entete_travaux(item_pv,0); 
              });
            }
            
        }
        else
        {
          demande_mobilier_mpe.tranche = tran[0] ;
          demande_mobilier_mpe.periode = tran[0].periode ;
          demande_mobilier_mpe.pourcentage = tran[0].pourcentage ;
          demande_mobilier_mpe.id  =   String(data.response);
          NouvelItemDemande_mobilier_mpe= false; 
          apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_factureById",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
              {
                var pv_consta_entete_trav = result.data.response[0];
                console.log(pv_consta_entete_trav);
                if (pv_consta_entete_trav.facture!=null ||pv_consta_entete_trav.facture!=undefined)
                {console.log("te");
                      var montant_trav = parseFloat(pv_consta_entete_trav.montant_travaux) + parseFloat(demande_mobilier_mpe.montant);
                      var montant_rabais = (montant_trav * pv_consta_entete_trav.facture.pourcentage_rabais)/100;
                      var montant_ht =  parseFloat(montant_trav)- parseFloat(montant_rabais);
                      //var montant_tva = (montant_ht *20)/100;
                      var montant_tva = 0;

                      var montant_ttc = montant_ht + montant_tva;
                      var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                      var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                      var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(pv_consta_entete_trav.facture.remboursement_acompte) + 
                      parseFloat(retenu_garanti) + parseFloat(pv_consta_entete_trav.facture.penalite_retard) + parseFloat(pv_consta_entete_trav.facture.remboursement_plaque)+parseFloat(taxe_marche_public));
                      var item_facture_mpe = {
                                id: pv_consta_entete_trav.facture.id,        
                                id_pv_consta_entete_travaux: pv_consta_entete_trav.facture.id_pv_consta_entete_travaux,        
                                numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                montant_travaux: montant_trav,
                                pourcentage_rabais: pv_consta_entete_trav.facture.pourcentage_rabais,
                                montant_rabais: montant_rabais,
                                montant_ht: montant_ht,
                                montant_tva: montant_tva,   
                                montant_ttc: montant_ttc, 
                                remboursement_acompte: pv_consta_entete_trav.facture.remboursement_acompte,   
                                penalite_retard: pv_consta_entete_trav.facture.penalite_retard, 
                                retenue_garantie: retenu_garanti, 
                                remboursement_plaque: pv_consta_entete_trav.facture.remboursement_plaque,
                                taxe_marche_public: taxe_marche_public,     
                                net_payer: net_payer,  
                                date_signature: pv_consta_entete_trav.facture.date_signature
                              };
                      console.log(item_facture_mpe);
                      majatfacture_mpe(item_facture_mpe,0);
                }                        
                else
                {     console.log("te2");

                      //montant_rabais 0 satri pourcentage 0 initial
                      //penalite retard 0 initial
                      var montant_trav = parseFloat(demande_mobilier_mpe.montant);
                      var montant_ht = parseFloat(montant_trav);
                      var montant_tva = 0;

                      var montant_ttc = montant_ht + montant_tva;
                      var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                      var taxe_marche_public = (parseFloat(vm.alltaxe_marche_public[0].pourcentage)* parseFloat(montant_ttc))/100;
                      var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - parseFloat(retenu_garanti)-parseFloat(taxe_marche_public);
                      var item_facture_mpe = {
                                id: 0,        
                                id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,        
                                numero: vm.selectedItemPv_consta_entete_travaux.numero,
                                montant_travaux: montant_trav,
                                pourcentage_rabais: 0,
                                montant_rabais: 0,
                                montant_ht: montant_ht,
                                montant_tva: montant_tva,   
                                montant_ttc: montant_ttc, 
                                remboursement_acompte: 0,   
                                penalite_retard: 0, 
                                retenue_garantie: retenu_garanti, 
                                remboursement_plaque: 0,
                                taxe_marche_public: taxe_marche_public,    
                                net_payer: net_payer,  
                                date_signature: vm.datenow
                              };
                      majatfacture_mpe(item_facture_mpe,0);
                } 
                  //vm.selectedItemPv_consta_entete_travaux.total_cumul =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_cumul) - parseFloat(demande_mobilier_mpe.montant);
                  //vm.selectedItemPv_consta_entete_travaux.total_periode =parseFloat(vm.selectedItemPv_consta_entete_travaux.avancement_global_periode) - parseFloat(demande_mobilier_mpe.montant); 
                  var item_pv =
                  {
                    id:        vm.selectedItemPv_consta_entete_travaux.id,
                    numero: pv_consta_entete_trav.numero,
                    date_etablissement: pv_consta_entete_trav.date_etablissement,
                    montant_travaux: parseFloat(pv_consta_entete_trav.montant_travaux) + parseFloat(demande_mobilier_mpe.montant),
                    avancement_global_cumul: pv_consta_entete_trav.avancement_global_cumul,
                    avancement_global_periode: pv_consta_entete_trav.avancement_global_periode,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id
                  } 
                   majpv_consta_entete_travaux(item_pv,0); 
              });                  
          
    }
      //vm.showboutonValider = false;

      demande_mobilier_mpe.$selected = false;
      demande_mobilier_mpe.$edit = false;
      vm.selectedItemDemande_mobilier_mpe = {};
      //vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
    //vm.steprubriquemobilier_mpe = false;
  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

}

vm.tranchechange_mobilier_mpe = function(item)
{ 
  apiFactory.getAPIgeneraliserREST("demande_mobilier_mpe/index","menu","getdemandeByContratTranche",
  'id_tranche_demande_mpe',item.id_tranche_demande_mpe,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
  {
    var demande_deja_introduit = result.data.response;
    var data_tranche = vm.alltranche_demande_mobilier_mpe.filter(function(obj)
        {
            return obj.id == item.id_tranche_demande_mpe;
        });
        console.log(data_tranche);
        console.log(item);
        console.log(vm.selectedItemContrat_prestataire);
    console.log(demande_deja_introduit);
    if (demande_deja_introduit.length !=0)
    { console.log('1');
      var confirm = $mdDialog.confirm()
            .title('Cette action ne peut pas être réaliser.')
            .textContent('Cette tranche de paiement est déjà introduite.')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('Fermer')
            
            $mdDialog.show(confirm).then(function()
            {  
              item.id_tranche_demande_mpe = null;
            }, function() {
              //alert('rien');
            });
    }
    else
    {  
      
        console.log('2');
      var tranche_current = Math.max.apply(Math, data_tranche.map(function(o){return o.code.split(' ')[1];}));
      if (parseInt(tranche_current)>1)
      { console.log('3');
        var tranche_precedent = 'tranche '+parseInt(tranche_current)-1;
        apiFactory.getAPIgeneraliserREST("demande_mobilier_mpe/index","menu","getdemandeByContratTranchenumero",'tranche_numero',
        tranche_precedent,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result_tranche)
        {
          var demande_tranche_precedent = result_tranche.data.response;
          if (demande_tranche_precedent.length!=0)
          {console.log('4');
            var confirm = $mdDialog.confirm()
            .title('Cette action ne peut pas être réaliser.')
            .textContent('Vous devriez entrer la '+tranche_precedent)
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('Fermer')
            
            $mdDialog.show(confirm).then(function()
            {  
              item.id_tranche_demande_mpe = null;
            }, function() {
              //alert('rien');
            });
          }
          else
          {    console.log('5');                      
            var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_mobilier) * data_tranche[0].pourcentage)/100;
            var montant = montant_ttc/1;

            item.periode = data_tranche[0].periode;
            item.pourcentage = data_tranche[0].pourcentage;
            item.montant = montant;
          }
        });
      }
      else
      {console.log('6');
        var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_mobilier) * data_tranche[0].pourcentage)/100;
            var montant = montant_ttc/1;

            item.periode = data_tranche[0].periode;
            item.pourcentage = data_tranche[0].pourcentage;
            item.montant = montant;
      } 
    }
  });
}
/************************************************fin mobilier_mpe***************************************************/
/************************************************Debut rubrique attachement mobilier_mpe***************************************************/

vm.pv_consta_rubrique_phase_mob_mpe_column = [
{titre:"Numero"
},
{titre:"Libelle"
},
{titre:"Prévision"
},
{titre:"Période"
},
{titre:"Anterieur"
},
{titre:"Cumul"
},
{titre:"Observation"
},
{titre:"Action"
}];

vm.click_pv_consta_rubrique_phase_mob_mpe = function()
{   
    vm.affiche_load =true;
    apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_phase_mob/index","menu","getpv_consta_rubrique_phase_pourcentagebycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
    {  
        vm.allpv_consta_rubrique_phase_mob_mpe= result.data.response;
        vm.steppv_consta_mobilier_travaux = false;
        vm.affiche_load =false;
        console.log(vm.allpv_consta_rubrique_phase_mob_mpe);
    });
}
//fonction selection item rubrique attachement mobilier mpe
vm.selectionPv_consta_rubrique_phase_mob_mpe= function (item)
{
    vm.selectedItemPv_consta_rubrique_phase_mob_mpe = item;
    if(item.$edit==false || item.$edit==undefined)
    {               
        currentItemPv_consta_rubrique_phase_mob_mpe   = JSON.parse(JSON.stringify(vm.selectedItemPv_consta_rubrique_phase_mob_mpe)); 
    }
    /*apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_prevu/index","menu","getattachement_mobilierprevubyrubrique",
    "id_attachement_mobilier",vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id,"id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
    {
            vm.allpv_consta_rubrique_phase_mob_prevus = result.data.response;
            vm.allpv_consta_rubrique_phase_mob_prevu = result.data.response;
            console.log(vm.allpv_consta_rubrique_phase_mob_prevu)
    });*/
    vm.steppv_consta_mobilier_travaux = true;
    
};

$scope.$watch('vm.selectedItemPv_consta_rubrique_phase_mob_mpe', function()
{
     if (!vm.allpv_consta_rubrique_phase_mob_mpe) return;
     vm.allpv_consta_rubrique_phase_mob_mpe.forEach(function(item)
     {
        item.$selected = false;
     });
     vm.selectedItemPv_consta_rubrique_phase_mob_mpe.$selected = true;
});

function ajoutPv_consta_rubrique_phase_mob_mpe(pv_consta_rubrique_phase_mob_mpe,suppression)
{
    if (NouvelItemPv_consta_rubrique_phase_mob_mpe==false)
    {                
      test_existancePv_consta_rubrique_phase_mob_mpe (pv_consta_rubrique_phase_mob_mpe,suppression); 
    } 
    else
    {
        insert_in_basePv_consta_rubrique_phase_mob_mpe(pv_consta_rubrique_phase_mob_mpe,suppression);
    }
}

//fonction de bouton d'annulation document_feffi_scan
vm.annulerPv_consta_rubrique_phase_mob_mpe = function(item)
{
  if (NouvelItemPv_consta_rubrique_phase_mob_mpe == false)
  {
    item.$edit = false;
    item.$selected = false;
    item.observation   = currentItemPv_consta_rubrique_phase_mob_mpe.observation ;
  }else
  {
    /*vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
    {
        return obj.id != vm.selectedItemDocument_feffi_scan.id;
    });*/
    item.observation   = '' ;
    item.$edit = false;
    item.$selected = false;

    item.id = null;
  }

  vm.selectedItemPv_consta_rubrique_phase_mob_mpe = {} ;
  NouvelItemPv_consta_rubrique_phase_mob_mpe      = false;
  
};


//fonction masque de saisie modification item feffi
vm.modifierPv_consta_rubrique_phase_mob_mpe = function(item)
{
    
    vm.selectedItemPv_consta_rubrique_phase_mob_mpe = item;
    currentItemPv_consta_rubrique_phase_mob_mpe = angular.copy(vm.selectedItemPv_consta_rubrique_phase_mob_mpe);
    $scope.vm.allpv_consta_rubrique_phase_mob_mpe.forEach(function(jus) {
      jus.$edit = false;
    });
    item.$edit = true;
    item.$selected = true;
    if (item.id==null)
    { 
      NouvelItemPv_consta_rubrique_phase_mob_mpe=true;
      console.log('atonull');
      item.observation   = vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation ;
      item.id   = '0' ;

    }
    else
    {NouvelItemPv_consta_rubrique_phase_mob_mpe = false ;
        console.log('tsnull');
        item.observation   = vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation ;
    }          
    
    //console.log(item);
    //vm.showThParcourir = true;
};

//fonction bouton suppression item document_feffi_scan
vm.supprimerPv_consta_rubrique_phase_mob_mpe = function()
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
        vm.ajoutPv_consta_rubrique_phase_mob_mpe(vm.selectedItemPv_consta_rubrique_phase_mob_mpe,1);
      }, function() {
        //alert('rien');
      });
};

//function teste s'il existe une modification item feffi
function test_existancePv_consta_rubrique_phase_mob_mpe (item,suppression)
{          
    if (suppression!=1)
    {
       var mem = vm.allpv_consta_rubrique_phase_mob_mpe.filter(function(obj)
        {
           return obj.id == currentItemPv_consta_rubrique_phase_mob_mpe.id;
        });
        if(mem[0])
        {
           if(mem[0].observation   != currentItemPv_consta_rubrique_phase_mob_mpe.observation)                   
              { 
                 insert_in_basePv_consta_rubrique_phase_mob_mpe(item,suppression);
              }
              else
              {  
                item.$selected = true;
                item.$edit = false;
              }
        }
    } else
          insert_in_basePv_consta_rubrique_phase_mob_mpe(item,suppression);
}
//insertion ou mise a jours ou suppression item dans bdd feffi
function insert_in_basePv_consta_rubrique_phase_mob_mpe(pv_consta_rubrique_phase_mob_mpe,suppression)
{
    //add
    var config =
    {
        headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
    };
    
    var getId = 0;
    if (NouvelItemPv_consta_rubrique_phase_mob_mpe==false)
    {
        getId = vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id; 
    } 
    
    var datas = $.param({
            supprimer: suppression,
            id:        getId,
            periode: pv_consta_rubrique_phase_mob_mpe.periode,
            observation: pv_consta_rubrique_phase_mob_mpe.observation,
            id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
            id_rubrique_phase:pv_consta_rubrique_phase_mob_mpe.id_phase               
        });
        console.log(datas);
        //factory
    apiFactory.add("pv_consta_detail_mob_travaux/index",datas, config).success(function (data)
    {  

        if (NouvelItemPv_consta_rubrique_phase_mob_mpe == false)
        {
            // Update or delete: id exclu                 
            if(suppression==0)
            {                        
                //vm.selectedItemPv_consta_rubrique_phase_mob_mpe.convention = conve[0];
                
                vm.selectedItemPv_consta_rubrique_phase_mob_mpe.$selected  = false;
                vm.selectedItemPv_consta_rubrique_phase_mob_mpe.$edit      = false;
                vm.selectedItemPv_consta_rubrique_phase_mob_mpe ={};
            }
            else 
            {    
              vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation='';
            
            }
        }
        else
        {
          //avenant_convention.convention = conve[0];
          pv_consta_rubrique_phase_mob_mpe.id  =   String(data.response);              
          NouvelItemPv_consta_rubrique_phase_mob_mpe=false;
        }
      pv_consta_rubrique_phase_mob_mpe.$selected = false;
      pv_consta_rubrique_phase_mob_mpe.$edit = false;
      vm.selectedItemPv_consta_rubrique_phase_mob_mpe = {};
    
  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

}

vm.Total_prevu_mobilier = function(){
    var total_prevu = 0;
    if (vm.allpv_consta_rubrique_phase_mob_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_mob_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_mob_mpe[i];
            total_prevu += parseFloat(product.pourcentage_prevu);
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

vm.Total_periode_mobilier = function(){
    var total_periode = 0;
    if (vm.allpv_consta_rubrique_phase_mob_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_mob_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_mob_mpe[i];
            if (product.periode!=null) {                      
            total_periode += parseFloat(product.periode);
            }
        }
    }
    
    var nbr=parseFloat(total_periode);
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

vm.Total_anterieur_mobilier = function(){
    var total_anterieur = 0;
    if (vm.allpv_consta_rubrique_phase_mob_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_mob_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_mob_mpe[i];
            if (product.anterieur!=null) {                      
              total_anterieur += parseFloat(product.anterieur);
              }
        }
    }
    
    var nbr=parseFloat(total_anterieur);
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

vm.Total_cumul_mobilier = function(){
    var total_cumul = 0;
    if (vm.allpv_consta_rubrique_phase_mob_mpe.length!=0)
    {                
        for(var i = 0; i < vm.allpv_consta_rubrique_phase_mob_mpe.length; i++){
            var product = vm.allpv_consta_rubrique_phase_mob_mpe[i];
            var p = 0;
            var a = 0;
            if (product.periode!=null) {                      
              p= parseFloat(product.periode);
              }
              if (product.anterieur!=null) {                      
                a= parseFloat(product.anterieur);
                }
            total_cumul += parseFloat(p)+parseFloat(a);
        }
    }
    
    var nbr=parseFloat(total_cumul);
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
vm.click_tab_pv_consta_statu_mob_travaux = function()
{   
    vm.affiche_load =true;
    apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_designation_mob/index","menu","getpv_consta_statutravauxbyphasecontrat",
    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
    ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase).then(function(result)
    {
        vm.allpv_consta_statu_mob_travaux = result.data.response;
        console.log(vm.allpv_consta_statu_mob_travaux);
        vm.affiche_load =false;
    });
}
vm.changestatu_mob = function(item)
{
    insert_in_basePv_consta_statu_mob_travaux(item,0);
    console.log(item);
}        
//insertion ou mise a jours ou suppression item dans bdd divers_attachement_mobilier_travaux
function insert_in_basePv_consta_statu_mob_travaux(pv_consta_statu_mob_travaux,suppression)
{
    //add
    var config =
    {
        headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
    };
    vm.affiche_load = true;
    var getId = 0;
    var stat =0;
    if (pv_consta_statu_mob_travaux.periode==true)
    {
      stat = 1;
    }
    if (pv_consta_statu_mob_travaux.id!=null || pv_consta_statu_mob_travaux.id!=undefined)
    {
        getId = pv_consta_statu_mob_travaux.id; 
    } 
    
    var datas = $.param({
            supprimer: suppression,
            id:        getId,
            id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
            id_rubrique_designation: pv_consta_statu_mob_travaux.id_designation,
            status: stat           
        });
        console.log(datas);
        //factory
    apiFactory.add("pv_consta_statu_mob_travaux/index",datas, config).success(function (data)
    {
        
      if (pv_consta_statu_mob_travaux.id != null || pv_consta_statu_mob_travaux.id != undefined)
      {
        apiFactory.getAPIgeneraliserREST("pv_consta_statu_mob_travaux/index","menu","getcount_desination_statubyphasecontrat",
        "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
        ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase).then(function(result)
        {
            var count_desination_statu = result.data.response;
            console.log(count_desination_statu);
            var getId_detail = 0;
            if (vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id!=null || vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id!=undefined)
            {
                getId_detail = vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id; 
            }
            if (vm.allpv_consta_statu_mob_travaux.length==parseInt(count_desination_statu[0].nombre))
            { 
              console.log(vm.selectedItemPv_consta_rubrique_phase_mob_mpe);
                var datas_detail = $.param({
                  supprimer: 0,
                  id:        getId_detail,
                  id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                  id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase,
                  periode: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.pourcentage_prevu,
                  observation: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation           
                });
                console.log(datas_detail);
                apiFactory.add("pv_consta_detail_mob_travaux/index",datas_detail, config).success(function (data)
                {
                  if (vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != undefined)
                  { 
                    console.log('atodet1');
                  }
                  else
                  {
                    vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id  =   String(data.response);
                    console.log('atodet2');
                  }
                });
            } 
            else
            {
                var datas_detail = $.param({
                  supprimer: 0,
                  id:        getId_detail,
                  id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                  id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase,
                  periode: 0,
                  observation: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation           
                });
                console.log(datas_detail);
                apiFactory.add("pv_consta_detail_mob_travaux/index",datas_detail, config).success(function (data_detail)
                {
                  if (vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != undefined)
                  { 
                    console.log('atodett1');
                  }
                  else
                  {
                    vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id  =   String(data_detail.response);
                    console.log('atodett2');
                  }
                });
            }
        });
        console.log('ato');
      }
      else
      {
        pv_consta_statu_mob_travaux.id  =   String(data.response); 
        console.log(pv_consta_statu_mob_travaux)  
        console.log('ato2'); 
        apiFactory.getAPIgeneraliserREST("pv_consta_statu_mob_travaux/index","menu","getcount_desination_statubyphasecontrat",
        "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id
        ,"id_rubrique_phase",vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase).then(function(result)
        {
            var count_desination_statu = result.data.response;
            console.log(count_desination_statu);
            var getId_detail = 0;
            if (vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id!=null || vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id!=undefined)
            {
                getId_detail = vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id; 
            }
            if (vm.allpv_consta_statu_mob_travaux.length==parseInt(count_desination_statu[0].nombre))
            { 
              console.log(vm.selectedItemPv_consta_rubrique_phase_mob_mpe);
                var datas_detail = $.param({
                  supprimer: 0,
                  id:        getId_detail,
                  id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                  id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase,
                  periode: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.pourcentage_prevu,
                  observation: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation           
                });
                console.log(datas_detail);
                apiFactory.add("pv_consta_detail_mob_travaux/index",datas_detail, config).success(function (data)
                {
                  if (vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != undefined)
                  { 
                    console.log('atodet1');
                  }
                  else
                  {
                    vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id  =   String(data.response);
                    console.log('atodet2');
                  }
                });
            } 
            else
            {
                var datas_detail = $.param({
                  supprimer: 0,
                  id:        getId_detail,
                  id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                  id_rubrique_phase: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id_phase,
                  periode: 0,
                  observation: vm.selectedItemPv_consta_rubrique_phase_mob_mpe.observation           
                });
                console.log(datas_detail);
                apiFactory.add("pv_consta_detail_mob_travaux/index",datas_detail, config).success(function (data_detail)
                {
                  if (vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != null || vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id != undefined)
                  { 
                    console.log('atodett1');
                  }
                  else
                  {
                    vm.selectedItemPv_consta_rubrique_phase_mob_mpe.id  =   String(data_detail.response);
                    console.log('atodett2');
                  }
                });
            }
        });                 
      }
      vm.affiche_load = false;
  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

}


    /******************************************fin attachement mobilier travaux***********************************************/
   /******************************************debut recap***********************************************/
   vm.click_tab_pv_consta_recap_travaux = function()
    {   
        vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getrecapByentete_travauxcontrat",
        'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
        {
            vm.pv_consta_recap_travaux = result.data.response;
            console.log(vm.pv_consta_recap_travaux);
            vm.affiche_load =false;
        });
    }
    /******************************************fin recap***********************************************/
      
    
    /************************************************debut Decompte*************************************************/
        vm.click_tab_decompte_mpe = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getdecompte_mpeBycontratandfacture",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_facture_mpe',vm.id_facture_mpe).then(function(result)
            {
                vm.decompte_mpes = result.data.response;
                console.log(vm.decompte_mpes);
                vm.affiche_load =false;
            });
        }
        vm.decompte_mpe_column = [        
        {titre:"Nature de depenses"
        },
        {titre:"Montant cumule"
        },
        {titre:"Montant antérieur"
        },
        {titre:"Montant de la période"
        }];

    /**************************************Debut Decompte mpe*********************************************/
     /**********************************fin justificatif attachement****************************************/
     vm.click_step_justi_pv_consta_entete_travaux_mpe = function()
     {console.log('mande');
     NouvelItemJustificatif_pv_consta_entete_travaux_mpe= false;
        apiFactory.getAPIgeneraliserREST("justificatif_pv_consta_entete_travaux_mpe/index",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
        {
            vm.alljustificatif_pv_consta_entete_travaux_mpe = result.data.response;
        });
     }
//col table
        vm.justificatif_pv_consta_entete_travaux_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile_justi_facture_mpe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.fichier = vm.myFile[0].name;
         // console.log(vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_pv_consta_entete_travaux_mpe = function ()
        { 
          if (NouvelItemJustificatif_pv_consta_entete_travaux_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_pv_consta_entete_travaux_mpe.push(items);
            vm.alljustificatif_pv_consta_entete_travaux_mpe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = mem;
              }
            });

            NouvelItemJustificatif_pv_consta_entete_travaux_mpe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_pv_consta_entete_travaux_mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_pv_consta_entete_travaux_mpe(justificatif_pv_consta_entete_travaux_mpe,suppression)
        {
            if (NouvelItemJustificatif_pv_consta_entete_travaux_mpe==false)
            {
                test_existanceJustificatif_pv_consta_entete_travaux_mpe (justificatif_pv_consta_entete_travaux_mpe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_pv_consta_entete_travaux_mpe(justificatif_pv_consta_entete_travaux_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_pv_consta_entete_travaux_mpe
        vm.annulerJustificatif_pv_consta_entete_travaux_mpe = function(item)
        {
          if (NouvelItemJustificatif_pv_consta_entete_travaux_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_pv_consta_entete_travaux_mpe.description ;
            item.fichier   = currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier ;
          }else
          {
            vm.alljustificatif_pv_consta_entete_travaux_mpe = vm.alljustificatif_pv_consta_entete_travaux_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.id;
            });
          }

          vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {} ;
          NouvelItemJustificatif_pv_consta_entete_travaux_mpe      = false;
          
        };

        //fonction selection item justificatif facture_mpe
        vm.selectionJustificatif_pv_consta_entete_travaux_mpe= function (item)
        {
            vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = item;
            //vm.nouvelItemJustificatif_pv_consta_entete_travaux_mpe   = item;
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemJustificatif_pv_consta_entete_travaux_mpe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe));
            }
             
        };
        $scope.$watch('vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe', function()
        {
             if (!vm.alljustificatif_pv_consta_entete_travaux_mpe) return;
             vm.alljustificatif_pv_consta_entete_travaux_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_pv_consta_entete_travaux_mpe = function(item)
        {
            NouvelItemJustificatif_pv_consta_entete_travaux_mpe = false ;
            vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = item;
            currentItemJustificatif_pv_consta_entete_travaux_mpe = angular.copy(vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe);
            $scope.vm.alljustificatif_pv_consta_entete_travaux_mpe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.description ;
            item.fichier   = vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_pv_consta_entete_travaux_mpe
        vm.supprimerJustificatif_pv_consta_entete_travaux_mpe = function()
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
                vm.ajoutJustificatif_pv_consta_entete_travaux_mpe(vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_pv_consta_entete_travaux_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_pv_consta_entete_travaux_mpe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_pv_consta_entete_travaux_mpe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_pv_consta_entete_travaux_mpe.description )
                    ||(just[0].fichier   != currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_pv_consta_entete_travaux_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_pv_consta_entete_travaux_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_pv_consta_entete_travaux_mpe
        function insert_in_baseJustificatif_pv_consta_entete_travaux_mpe(justificatif_pv_consta_entete_travaux_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_pv_consta_entete_travaux_mpe==false)
            {
                getId = vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_pv_consta_entete_travaux_mpe.description,
                    fichier: justificatif_pv_consta_entete_travaux_mpe.fichier,
                    id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_pv_consta_entete_travaux_mpe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                    
                          var repertoire = 'justificatif_pv_consta_entete_travaux_mpe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.id
                                              
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
                                    justificatif_pv_consta_entete_travaux_mpe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: currentItemJustificatif_pv_consta_entete_travaux_mpe.description,
                                                      fichier: currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier,
                                                      id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_pv_consta_entete_travaux_mpe.$selected = false;
                                          justificatif_pv_consta_entete_travaux_mpe.$edit = false;                                          
                                          currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier=currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier;
                                          currentItemJustificatif_pv_consta_entete_travaux_mpe.description=currentItemJustificatif_pv_consta_entete_travaux_mpe.description;
                                          
                                          vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_pv_consta_entete_travaux_mpe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_pv_consta_entete_travaux_mpe.description,
                                        fichier: justificatif_pv_consta_entete_travaux_mpe.fichier,
                                        id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_pv_consta_entete_travaux_mpe.$selected = false;
                                      justificatif_pv_consta_entete_travaux_mpe.$edit = false;
                                      vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                supprimer: suppression,
                                id:        getIdFile,
                                description: currentItemJustificatif_pv_consta_entete_travaux_mpe.description,
                                fichier: currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier,
                                id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                                validation:0
                                });
                              apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                              {  
                                  vm.showbuttonNouvManuel = true;
                                  justificatif_pv_consta_entete_travaux_mpe.$selected = false;
                                  justificatif_pv_consta_entete_travaux_mpe.$edit = false;                                          
                                  currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier=currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier;
                                  currentItemJustificatif_pv_consta_entete_travaux_mpe.description=currentItemJustificatif_pv_consta_entete_travaux_mpe.description;
                                  
                                  vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {};
                              console.log('b');
                              });
                            });
                          }


                        vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.$selected  = false;
                        vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.$edit      = false;
                        vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_pv_consta_entete_travaux_mpe = vm.alljustificatif_pv_consta_entete_travaux_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe.fichier;
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
                  justificatif_pv_consta_entete_travaux_mpe.id  =   String(data.response);              
                  NouvelItemJustificatif_pv_consta_entete_travaux_mpe = false;

                  vm.showbuttonNouvManuel = false;
                    
                    
                    var repertoire = 'justificatif_pv_consta_entete_travaux_mpe/';
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
                      {console.log('bb');
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                            console.log('cc');
                            /*var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { console.log('cc1');
                              justificatif_pv_consta_entete_travaux_mpe.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                description: currentItemJustificatif_pv_consta_entete_travaux_mpe.description,
                                                fichier: currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier,
                                                id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                                                
                                  });
                                  console.log(datas);
                                apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                                { 
                                  vm.alljustificatif_pv_consta_entete_travaux_mpe = vm.alljustificatif_pv_consta_entete_travaux_mpe.filter(function(obj)
                                  {
                                      return obj.id !== getIdFile;
                                  });
                                  console.log(vm.alljustificatif_pv_consta_entete_travaux_mpe);
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });*/

                            var confirm = $mdDialog.confirm()
                                .title('Notification')
                                .textContent(msg)
                                .ariaLabel('Lucky day')
                                .clickOutsideToClose(true)
                                .parent(angular.element(document.body))
                                .ok('Fermer');
                                $mdDialog.show(confirm).then(function() {
                                  console.log('cc1');
                                    justificatif_pv_consta_entete_travaux_mpe.fichier='';
                                  var datas = $.param({
                                                      supprimer: 1,
                                                      id:        getIdFile,
                                                      description: currentItemJustificatif_pv_consta_entete_travaux_mpe.description,
                                                      fichier: currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier,
                                                      id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                                                      
                                        });
                                        console.log(datas);
                                      apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                                      { 
                                        vm.alljustificatif_pv_consta_entete_travaux_mpe = vm.alljustificatif_pv_consta_entete_travaux_mpe.filter(function(obj)
                                        {
                                            return obj.id !== getIdFile;
                                        });
                                        console.log(vm.alljustificatif_pv_consta_entete_travaux_mpe);
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                
                                }, function() {
                                  //alert('rien');
                                });
                          }
                          else
                          {
                            justificatif_pv_consta_entete_travaux_mpe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_pv_consta_entete_travaux_mpe.description,
                                  fichier: justificatif_pv_consta_entete_travaux_mpe.fichier,
                                  id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                                               
                              });
                            apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_pv_consta_entete_travaux_mpe.$selected = false;
                                justificatif_pv_consta_entete_travaux_mpe.$edit = false;
                                vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      { console.log('aa');
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                          supprimer: 1,
                          id:        getIdFile,
                          description: currentItemJustificatif_pv_consta_entete_travaux_mpe.description,
                          fichier: currentItemJustificatif_pv_consta_entete_travaux_mpe.fichier,
                          id_pv_consta_entete_travaux: vm.selectedItemPv_consta_entete_travaux.id,
                          
                          });
                        apiFactory.add("justificatif_pv_consta_entete_travaux_mpe/index",datas, config).success(function (data)
                        { 
                          vm.alljustificatif_pv_consta_entete_travaux_mpe = vm.alljustificatif_pv_consta_entete_travaux_mpe.filter(function(obj)
                          {
                              return obj.id !== getIdFile;
                          });
                      
                        });
                      });
                    }
              }
              justificatif_pv_consta_entete_travaux_mpe.$selected = false;
              justificatif_pv_consta_entete_travaux_mpe.$edit = false;
              //vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece_pv_consta_entete_travaux_mpe = function(item)
        {
          window.open(apiUrlFile+item.fichier);
        }
/***************************************fin justificatif facture_mpe**********************************************/
        /**************************************Debut transfert reliquat*********************************************/
         vm.transfert_reliquat_column = [        
        {titre:"Montant"
        },
        {titre:"Objet utilisation"
        },
        {titre:"Date transfert"
        },
        {titre:"Situation utilisation"
        },
        {titre:"Intitulé du compte"
        },
        {titre:"RIB SAE"
        },
        {titre:"Observation"
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
              situation_utilisation: '',
              intitule_compte: '',
              rib: '',
              observation: ''
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
              item.situation_utilisation  = currentItem.situation_utilisation ;
              item.date_transfert       = new Date(currentItem.date_transfert);              
              item.intitule_compte = currentItem.intitule_compte ;
              item.rib = currentItem.rib;
              item.observation = currentItem.observation;
              
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
            item.situation_utilisation  = vm.selectedItemTransfert_reliquat.situation_utilisation ;
            item.date_transfert  = new Date(vm.selectedItemTransfert_reliquat.date_transfert) ;
            item.intitule_compte = vm.selectedItemTransfert_reliquat.intitule_compte ;
            item.rib = parseInt(vm.selectedItemTransfert_reliquat.rib);
            item.observation = parseInt(vm.selectedItemTransfert_reliquat.observation);

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
                    || (trans[0].situation_utilisation!=currentItemTransfert_reliquat.situation_utilisation)                    
                    || (trans[0].intitule_compte!=currentItemTransfert_reliquat.intitule_compte)
                    || (trans[0].montant!=currentItemTransfert_reliquat.montant)
                    || (trans[0].observation!=currentItemTransfert_reliquat.observation))                   
                                       
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
                    situation_utilisation:   transfert_reliquat.situation_utilisation,
                    observation:    transfert_reliquat.observation,
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
                    situation_utilisation:   vm.selectedItemTransfert_reliquat.situation_utilisation,
                    observation:    vm.selectedItemTransfert_reliquat.observation,
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
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
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
          window.open(apiUrlFile+item.fichier);
        }

    /*********************************************Fin justificatif reliquat************************************************/


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

        vm.chiffrevirgule = function(number)
        {
            var initnumber = 0;
            if (number)
            {
                initnumber = parseFloat(number).toFixed(2);
            }
            return initnumber;
        }

          vm.formatMillier = function (nombre) 
          {   //var nbr = nombre.toFixed(0);
            if(nombre!=null && nombre!=undefined)
            {
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
            else
            {
              return 0;
            }
            
          }
          
          vm.formatMillier_double = function (nombre1,nombre2) 
          {   //var nbr = nombre.toFixed(0);
            var nombre_1=0;
            var nombre_2=0;
            if (nombre1!=null && nombre1!='undefined')
            {
              nombre_1=nombre1;
            }
            if (nombre2!=null && nombre2!='undefined')
            {
              nombre_2=nombre2;
            }

            var nbr=parseFloat(nombre_1)+parseFloat(nombre_2);
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
