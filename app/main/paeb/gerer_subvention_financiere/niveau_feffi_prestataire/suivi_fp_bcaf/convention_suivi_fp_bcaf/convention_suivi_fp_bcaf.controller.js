
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_bcaf.convention_suivi_fp_bcaf')
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
        .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;        
          element.bind('change', function(){
            scope.$apply(function(){
              //modelSetter(scope, element[0].files[0]);
               //console.log(element[0].files[0]);

            });
          });
        }
      };
    }])
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
        .controller('Convention_suivi_fp_bcafController', Convention_suivi_fp_bcafController);
    /** @ngInject */
    function Convention_suivi_fp_bcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.styleTabfils = "acc_sous_menu";
        vm.styleTabfils2 = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepsuivi_paiement_moe = false;
        vm.stepsuivi_paiement_mpe = false;
        vm.stepprestation_moe = false;
        vm.stepMenu_reliquat =false; 

        vm.stepjusti_d_tra_moe = false;
        vm.stepjusti_batiment_moe = false;
        vm.stepjusti_latrine_moe = false;
        vm.stepjusti_f_tra_moe = false;

        vm.stepfacture_mpe = false;
        vm.stepattachement_mpe = false;

        vm.stepbatiment_mpe = false;
        vm.steplatrine_mpe = false;
        vm.stepmobilier_mpe = false;

        vm.stepattachement_batiment_travaux = false;
        vm.stepattachement_latrine_travaux = false;
        vm.stepattachement_mobilier_travaux = false;

        vm.session = '';
        vm.ciscos = [];


/*******************************************Debut maitrise d'oeuvre*************************************/
    
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

        vm.ajoutDemande_debut_travaux_moe = ajoutDemande_debut_travaux_moe;
        vm.NouvelItemDemande_debut_travaux_moe=false;
        var currentItemDemande_debut_travaux_moe;
        vm.selectedItemDemande_debut_travaux_moe = {};
        vm.alldemande_debut_travaux_moe = [];

        vm.alldemande_debut_travaux_moe = [];

        vm.allcurenttranche_d_debut_travaux_moe = [];
        vm.alltranche_d_debut_travaux_moe = [];
        vm.dataLastedemande_debut_moe = [];
        vm.showbuttonValidationDemande_debut_travaux_moe_creer = false;

         vm.ajoutJustificatif_debut_travaux_moe = ajoutJustificatif_debut_travaux_moe;
        var NouvelItemJustificatif_debut_travaux_moe=false;
        var currentItemJustificatif_debut_travaux_moe;
        vm.selectedItemJustificatif_debut_travaux_moe = {} ;
        vm.alljustificatif_debut_travaux_moe = [] ;

        vm.ajoutDemande_batiment_moe = ajoutDemande_batiment_moe;
        vm.NouvelItemDemande_batiment_moe=false;
        var currentItemDemande_batiment_moe;
        vm.selectedItemDemande_batiment_moe = {};
        vm.alldemande_batiment_moe = [];

        vm.alldemande_batiment_moe = [];

        vm.allcurenttranche_demande_batiment_moe = [];
        vm.alltranche_demande_batiment_moe = [];
        vm.dataLastedemande_batiment_moe = [];

        vm.showbuttonValidationDemande_batiment_moe_creer = false;

         vm.ajoutJustificatif_batiment_moe = ajoutJustificatif_batiment_moe;
        var NouvelItemJustificatif_batiment_moe=false;
        var currentItemJustificatif_batiment_moe;
        vm.selectedItemJustificatif_batiment_moe = {} ;
        vm.alljustificatif_batiment_moe = [] ;

        vm.ajoutDemande_latrine_moe = ajoutDemande_latrine_moe;
        vm.NouvelItemDemande_latrine_moe=false;
        var currentItemDemande_latrine_moe;
        vm.selectedItemDemande_latrine_moe = {};
        vm.alldemande_latrine_moe = [];

        vm.alldemande_latrine_moe = [];

        vm.allcurenttranche_demande_latrine_moe = [];
        vm.alltranche_demande_latrine_moe = [];
        vm.dataLastedemande_latrine_moe = [];

        vm.showbuttonValidationDemande_latrine_moe_creer = false;

         vm.ajoutJustificatif_latrine_moe = ajoutJustificatif_latrine_moe;
        var NouvelItemJustificatif_latrine_moe=false;
        var currentItemJustificatif_latrine_moe;
        vm.selectedItemJustificatif_latrine_moe = {} ;
        vm.alljustificatif_latrine_moe = [] ;


        vm.ajoutDemande_fin_travaux_moe = ajoutDemande_fin_travaux_moe;
        vm.NouvelItemDemande_fin_travaux_moe=false;
        var currentItemDemande_fin_travaux_moe;
        vm.selectedItemDemande_fin_travaux_moe = {};
        vm.alldemande_fin_travaux_moe = [];

        vm.alldemande_fin_travaux_moe = [];

        vm.allcurenttranche_d_fin_travaux_moe = [];
        vm.alltranche_d_fin_travaux_moe = [];
        vm.dataLastedemande_fin_moe = [];

        vm.showbuttonValidationDemande_fin_travaux_moe_creer = false;

         vm.ajoutJustificatif_fin_travaux_moe = ajoutJustificatif_fin_travaux_moe;
        var NouvelItemJustificatif_fin_travaux_moe=false;
        var currentItemJustificatif_fin_travaux_moe;
        vm.selectedItemJustificatif_fin_travaux_moe = {} ;
        vm.alljustificatif_fin_travaux_moe = [] ;

/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutAttachement_travaux = ajoutAttachement_travaux;
        vm.NouvelItemAttachement_travaux=false;
        var currentItemAttachement_travaux;
        vm.selectedItemAttachement_travaux = {};
        vm.allattachement_travaux = [];

        //vm.ajoutAvance_demarrage = ajoutAvance_demarrage;
        vm.NouvelItemAvance_demarrage=false;
        var currentItemAvance_demarrage;
        vm.selectedItemAvance_demarrage = {};
        vm.allavance_demarrage = [];
        vm.showbuttonValidationAvance_demarrage_creer = false;

        vm.ajoutFacture_mpe = ajoutFacture_mpe;
        vm.NouvelItemFacture_mpe=false;
        var currentItemFacture_mpe;
        vm.selectedItemFacture_mpe = {};
        vm.allfacture_mpe = [];
        vm.showbuttonValidationFacture_mpe_creer = false;

        vm.ajoutDemande_batiment_mpe = ajoutDemande_batiment_mpe;
        vm.NouvelItemDemande_batiment_mpe=false;
        var currentItemDemande_batiment_mpe;
        vm.selectedItemDemande_batiment_mpe = {};
        vm.alldemande_batiment_mpe = [];

        vm.allcurenttranche_demande_batiment_mpe = [];
        vm.alltranche_demande_batiment_mpe = [];
        vm.dataLastedemande_batiment_mpe = [];


        vm.ajoutDivers_attachement_batiment_travaux = ajoutDivers_attachement_batiment_travaux;
        var NouvelItemDivers_attachement_batiment_travaux=false;
        var currentItemDivers_attachement_batiment_travaux;
        vm.selectedItemDivers_attachement_batiment_travaux = {} ;
        vm.alldivers_attachement_batiment_travaux = [] ;

        vm.ajoutDemande_latrine_mpe = ajoutDemande_latrine_mpe;
        vm.NouvelItemDemande_latrine_mpe=false;
        var currentItemDemande_latrine_mpe;
        vm.selectedItemDemande_latrine_mpe = {};
        vm.alldemande_latrine_mpe = [];

        vm.allcurenttranche_demande_latrine_mpe = [];
        vm.alltranche_demande_latrine_mpe = [];
        vm.dataLastedemande_latrine_mpe = [];

        vm.ajoutDivers_attachement_latrine_travaux = ajoutDivers_attachement_latrine_travaux;
        var NouvelItemDivers_attachement_latrine_travaux=false;
        var currentItemDivers_attachement_latrine_travaux;
        vm.selectedItemDivers_attachement_latrine_travaux = {} ;
        vm.alldivers_attachement_latrine_travaux = [] ;

        vm.ajoutDemande_mobilier_mpe = ajoutDemande_mobilier_mpe;
        vm.NouvelItemDemande_mobilier_mpe=false;
        var currentItemDemande_mobilier_mpe;
        vm.selectedItemDemande_mobilier_mpe = {};
        vm.alldemande_mobilier_mpe = [];

        vm.allcurenttranche_demande_mobilier_mpe = [];
        vm.alltranche_demande_mobilier_mpe = [];
        vm.dataLastedemande_mobilier_mpe = [];       

        vm.ajoutDivers_attachement_mobilier_travaux = ajoutDivers_attachement_mobilier_travaux;
        var NouvelItemDivers_attachement_mobilier_travaux=false;
        var currentItemDivers_attachement_mobilier_travaux;
        vm.selectedItemDivers_attachement_mobilier_travaux = {} ;
        vm.alldivers_attachement_mobilier_travaux = [] ;

/********************************************Fin entreprise********************************************/

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
            if (vm.session=='ADMIN')
            {
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
                            vm.ciscos.push(vm.usercisco);
                            console.log(vm.ciscos);
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionbycisco",'id_cisco',vm.usercisco.id).then(function(result)
                            {
                                vm.regions = result.data.response;
                                console.log(vm.regions);
                            }, function error(result){ alert('something went wrong')});                         

                            vm.session = 'BCAF';
                      
                      break;

                  case 'ADMIN':                            
                            vm.session = 'ADMIN';                  
                      break;
                  default:
                      break;
              
                }                  

         });

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
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
                 case 'BCAF':
                            if (vm.usercisco.id!=undefined)
                            {
                                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu',
                                    'getconventionvalideufpByciscodate','id_cisco',vm.usercisco.id,'date_debut',
                                    date_debut,'date_fin',date_fin).then(function(result)
                                {
                                    vm.allconvention_entete = result.data.response;
                                });
                            }
                      
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
             
            vm.stepMenu_reliquat =true;
            vm.stepMenu_moe=true;
            vm.stepMenu_mpe=true; 

           /* donnee_menu_moe(item,vm.session).then(function () 
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
            }); */           
                          
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });             
              
              vm.stepprestaion_pr=false;
              vm.stepprestation_moe = false;
              vm.stepjusti_d_tra_moe = false;
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
        
        vm.step_menu_moe = function()
        {
            vm.showbuttonNouvcontrat_moe=true;
            vm.styleTabfils = "acc_sous_menu";
            vm.stepsuivi_paiement_moe = false;
            return new Promise(function (resolve, reject) 
            {  
                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_moe = result.data.response;
                    return resolve('ok'); 
                });
                  
            });
        }
        vm.step_menu_mpe = function()
        {
            vm.styleTabfils = "acc_sous_menu";
            vm.stepsuivi_paiement_mpe = false;
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    return resolve('ok');
                });           
            });
        }

  /******************************************debut maitrise d'oeuvre*****************************************************/

      

      /**************************************fin contrat moe***************************************************/
      vm.click_step_contrat_moe = function()
        {
            vm.stepsuivi_paiement_moe = false;
             vm.styleTabfils = "acc_sous_menu"
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
                  vm.showbuttonValidationcontrat_pr = true;
                  
                  if(vm.roles.indexOf("BCAF")!= -1)
                  {                      
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                    });
                    
                  }

                  
                  if(vm.roles.indexOf("ADMIN")!= -1)
                  {                      
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                    });

                  }
                }
                vm.stepsuivi_paiement_moe = true;
            vm.showbuttonValidationcontrat_moe = true;
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

       
      /*****************************************fin contrat moe******************************************************/
      
      /**********************************debut demande_debut_travaux_moe****************************************/

      vm.click_step_suivi_paiement_moe = function()
      {
        vm.styleTabfils = "acc_menu";
      }
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
               apiFactory.getAPIgeneraliserREST("justificatif_debut_travaux_moe/index",'id_demande_debut_travaux_moe',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                {
                    vm.alljustificatif_debut_travaux_moe = result.data.response;
                    console.log(vm.alljustificatif_debut_travaux_moe);
                });                 
            
            vm.validation_demande_debut_travaux_moe = item.validation;
            vm.stepjusti_d_tra_moe = true;
            vm.steppai_d_tra_moe = true;
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

        $scope.uploadFile_debu_travau_moe = function(event)
       {console.log('ok');
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_debut_travaux_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_debut_travaux_moe.fichier);
        } 

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
            
            vm.validation_demande_batiment_moe = item.validation;
            
            vm.stepjusti_batiment_moe = true;
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

        $scope.uploadFile_justi_batiment_moe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_batiment_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_batiment_moe.fichier);
        } 
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
                       
            vm.validation_demande_latrine_moe = item.validation;
            vm.stepjusti_latrine_moe = true;
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

        $scope.uploadFile_justi_latrine_moe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_latrine_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_latrine_moe.fichier);
        } 

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
            
            vm.validation_demande_fin_travaux_moe = item.validation;
            vm.stepjusti_f_tra_moe = true;
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

        $scope.uploadFile_justi_fintravau_moe = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_fin_travaux_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_fin_travaux_moe.fichier);
        } 

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


/**********************************debut contrat prestataire****************************************/
 vm.step_contrat_mpe = function ()
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
         //fonction ajout dans bdd
       
        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;            

            vm.stepsuivi_paiement_mpe = true;
           if(item.id!=0)
           {
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
            apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavance_demarrageBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavance_demarrage = result.data.response;
                console.log(vm.allavance_demarrage);
                console.log(vm.selectedItemContrat_prestataire.id);
            });
            vm.styleTabfils = "acc_menu";             
            vm.styleTabfils2 = "acc_sous_menu";
            vm.stepattachement_mpe = false;
        }
        vm.click_tab_avance_mpe = function()
        {                        
            vm.styleTabfils2 = "acc_sous_menu";
            vm.stepattachement_mpe = false;
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
        {titre:"Net à payer"
        },
        {titre:"Date_signature"
        },
        {titre:"Action"
        }];        


        vm.change_pourcentage_rabais = function(avance_demarrage)
        {
            vm.selectedItemAvance_demarrage.montant_rabais = (avance_demarrage.montant_avance * avance_demarrage.pourcentage_rabais)/100;
            vm.selectedItemAvance_demarrage.net_payer = ((avance_demarrage.montant_avance * avance_demarrage.pourcentage_rabais)/100) + 
            avance_demarrage.montant_avance;
        }
        //fonction ajout dans bdd
        function ajoutAvance_demarrage(avance_demarrage,suppression)
        {
            if (vm.NouvelItemAvance_demarrage==false)
            {
                test_existanceAvance_demarrage (avance_demarrage,suppression); 
            } 
            else
            {
                insert_in_baseAvance_demarrage(avance_demarrage,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerAvance_demarrage = function(item)
        {
          if (vm.NouvelItemAvance_demarrage == false)
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
          }
          else
          {
            vm.allavance_demarrage = vm.allavance_demarrage.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvance_demarrage.id;
            });
          }

          vm.selectedItemAvance_demarrage = {} ;
          vm.NouvelItemAvance_demarrage      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionAvance_demarrage= function (item)
        {
            vm.selectedItemAvance_demarrage = item;
           // vm.vm.NouvelItemAvance_demarrage   = item;
           if(item.$edit!=false || item.$edit!=undefined)
           {
            currentItemAvance_demarrage    = JSON.parse(JSON.stringify(vm.selectedItemAvance_demarrage));
            vm.showbuttonValidationAvance_demarrage_creer = true;
           }
            vm.validation_avance_demarrage = item.validation;
            //vm.stepjusti_batiment_mpe = true;   
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
            vm.NouvelItemAvance_demarrage = false ;
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
            item.net_payer   = parseInt(vm.selectedItemAvance_demarrage.net_payer);
            item.montant_avance   = parseInt(vm.selectedItemAvance_demarrage.montant_avance) ;
            item.pourcentage_rabais = parseInt(vm.selectedItemAvance_demarrage.pourcentage_rabais) ;
            item.montant_rabais = parseInt(vm.selectedItemAvance_demarrage.montant_rabais) ;

            vm.showbuttonValidationAvance_demarrage_creer = false;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerAvance_demarrage = function()
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
                    || (pass[0].montant_avance   != currentItemAvance_demarrage.montant_avance ) )                   
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
            if (vm.NouvelItemAvance_demarrage==false)
            {
                getId = vm.selectedItemAvance_demarrage.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: avance_demarrage.description,
                    date_signature:convertionDate(new Date(avance_demarrage.date_signature)),
                    montant_avance:avance_demarrage.montant_avance,
                    net_payer: avance_demarrage.net_payer,
                    pourcentage_rabais: avance_demarrage.pourcentage_rabais ,
                    montant_rabais: avance_demarrage.montant_rabais ,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avance_demarrage/index",datas, config).success(function (data)
            {

                if (vm.NouvelItemAvance_demarrage == false)
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

        vm.validerAvance_demarrage = function()
        {
            maj_insert_avance_demarrage(vm.selectedItemAvance_demarrage,0,1)
        }

        function maj_insert_avance_demarrage(avance_demarrage,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avance_demarrage.id,
                    description: avance_demarrage.description,
                    date_signature:convertionDate(new Date(avance_demarrage.date_signature)),
                    montant_avance:avance_demarrage.montant_avance,
                    net_payer: avance_demarrage.net_payer,
                    pourcentage_rabais: avance_demarrage.pourcentage_rabais ,
                    montant_rabais: avance_demarrage.montant_rabais ,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avance_demarrage/index",datas, config).success(function (data)
            {
              //vm.showboutonValider = false;
              avance_demarrage.validation = validation;
              avance_demarrage.$selected = false;
              vm.selectedItemAvance_demarrage = {};
              vm.showbuttonValidationAvance_demarrage_creer = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/
 

/************************************************debut facture*************************************************/
        vm.click_tab_facture_mpe = function()
        {
            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allfacture_mpe = result.data.response.filter(function(obj)
                {
                    return obj.validation == 0;
                });
            });
                         
            vm.styleTabfils2 = "acc_sous_menu";
            vm.stepattachement_mpe = false;
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
        {titre:"Net à payer"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];        

        //Masque de saisi ajout
       
        vm.change_pourcentage_rabais_mpe = function(facture_mpe)
        {    
            var montant_rabais = (facture_mpe.montant_travaux * facture_mpe.pourcentage_rabais)/100;
            var montant_ht = montant_rabais + facture_mpe.montant_travaux;
            var montant_tva = (montant_ht *20)/100;
            vm.selectedItemFacture_mpe.montant_rabais = montant_rabais;
            vm.selectedItemFacture_mpe.montant_ht = montant_ht;
            vm.selectedItemFacture_mpe.montant_tva = montant_tva;

            vm.selectedItemFacture_mpe.montant_ttc = montant_ht + montant_tva;
            vm.selectedItemFacture_mpe.net_payer = montant_ht + montant_tva - (facture_mpe.remboursement_acompte + 
                facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque);
        }
        vm.change_penalite_retard_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque);
        }
        vm.change_retenue_garantie_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque);
        }
        vm.change_remboursement_acompte_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque);
        }
        vm.change_remboursement_plaque_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque);
        }
        //fonction ajout dans bdd
        function ajoutFacture_mpe(facture_mpe,suppression)
        {
            if (vm.NouvelItemFacture_mpe==false)
            {
                test_existanceFacture_mpe (facture_mpe,suppression); 
            } 
            else
            {
                insert_in_baseFacture_mpe(facture_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerFacture_mpe = function(item)
        {
          if (vm.NouvelItemFacture_mpe == false)
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
            item.net_payer   = currentItemFacture_mpe.net_payer ;
            item.date_signature   = currentItemFacture_mpe.date_signature ;
          }
          else
          {
            vm.allavance_demarrage = vm.allavance_demarrage.filter(function(obj)
            {
                return obj.id !== vm.selectedItemFacture_mpe.id;
            });
          }

          vm.selectedItemFacture_mpe = {} ;
          vm.NouvelItemFacture_mpe      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionFacture_mpe= function (item)
        {
            vm.selectedItemFacture_mpe = item;
           // vm.vm.NouvelItemAvance_demarrage   = item;
           if(item.$edit!=false || item.$edit!=undefined)
           {
            currentItemFacture_mpe    = JSON.parse(JSON.stringify(vm.selectedItemFacture_mpe));
            vm.stepattachement_mpe = true; 

            vm.showbuttonValidationFacture_mpe_creer = true;
           }
            vm.validation_facture_mpe = item.validation;
              
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
            vm.NouvelItemFacture_mpe = false ;
            vm.selectedItemFacture_mpe = item;
            currentItemFacture_mpe = angular.copy(vm.selectedItemFacture_mpe);
            $scope.vm.allfacture_mpe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemAvance_demarrage.contrat_prestataire.id ;
            item.numero   = vm.selectedItemFacture_mpe.numero ;
            item.date_signature   = new Date(vm.selectedItemFacture_mpe.date_signature) ;
            item.montant_travaux   = parseInt(vm.selectedItemFacture_mpe.montant_travaux);
            item.pourcentage_rabais = parseInt(vm.selectedItemFacture_mpe.pourcentage_rabais) ;
            item.montant_rabais = parseInt(vm.selectedItemFacture_mpe.montant_rabais) ;
            item.montant_ht   = parseInt(vm.selectedItemFacture_mpe.montant_ht) ;
            item.montant_tva   = parseInt(vm.selectedItemFacture_mpe.montant_tva);
            item.montant_ttc   = parseInt(vm.selectedItemFacture_mpe.montant_ttc) ;
            item.remboursement_acompte = parseInt(vm.selectedItemFacture_mpe.remboursement_acompte) ;
            item.penalite_retard = parseInt(vm.selectedItemFacture_mpe.penalite_retard) ;
            item.retenue_garantie = parseInt(vm.selectedItemFacture_mpe.retenue_garantie) ;
            item.remboursement_plaque = parseInt(vm.selectedItemFacture_mpe.remboursement_plaque) ;
            item.net_payer = parseInt(vm.selectedItemFacture_mpe.net_payer) ;

            vm.showbuttonValidationFacture_mpe_creer = false;
        };
          
        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerFacture_mpe = function()
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
                vm.ajoutFacture_mpe(vm.selectedItemFacture_mpe,1);
              }, function() {
                //alert('rien');
              });
        };
        //function teste s'il existe une modification item feffi
        function test_existanceAvance_demarrage (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allfacture_mpe.filter(function(obj)
                {
                   return obj.id == currentItemFacture_mpe.id;
                });
                if(pass[0])
                {
                   if((pass[0].numero   != currentItemFacture_mpe.numero )
                    || (pass[0].montant_travaux   != currentItemFacture_mpe.montant_travaux )
                    || (pass[0].pourcentage_rabais != currentItemFacture_mpe.pourcentage_rabais )
                    || (pass[0].montant_rabais != currentItemFacture_mpe.montant_rabais )
                    || (pass[0].montant_ht   != currentItemFacture_mpe.montant_ht )
                    || (pass[0].montant_tva   != currentItemFacture_mpe.montant_tva )
                    || (pass[0].montant_ttc   != currentItemFacture_mpe.montant_ttc ) 
                    || (pass[0].remboursement_acompte   != currentItemFacture_mpe.remboursement_acompte )
                    || (pass[0].penalite_retard != currentItemFacture_mpe.penalite_retard )
                    || (pass[0].retenue_garantie != currentItemFacture_mpe.retenue_garantie ) 
                    || (pass[0].remboursement_plaque   != currentItemFacture_mpe.remboursement_plaque )
                    || (pass[0].net_payer   != currentItemFacture_mpe.net_payer )
                    || (pass[0].date_signature   != currentItemFacture_mpe.date_signature ))                   
                      { 
                         insert_in_baseFacture_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseFacture_mpe(item,suppression);
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
            if (vm.NouvelItemAvance_demarrage==false)
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
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(new Date(facture_mpe.date_signature)) ,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {

                if (vm.NouvelItemFacture_mpe == false)
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
                      vm.allfacture_mpe = vm.allfacture_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemFacture_mpe.id;
                      });
                      vm.showbuttonNouvFacture_mpe = true;
                    }
                    
                }
                else
                {                  
                  facture_mpe.id  =   String(data.response);
                  vm.showbuttonNouvFacture_mpe = false;
                }
              //vm.showboutonValider = false;

              facture_mpe.$selected = false;
              facture_mpe.$edit = false;
              vm.selectedItemFacture_mpe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerFacture_mpe = function()
        {
            maj_insertFacture_mpe(vm.selectedItemFacture_mpe,0,1)
        }
            
        function maj_insertFacture_mpe(facture_mpe,suppression)
        {
            //add
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
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(new Date(facture_mpe.date_signature)) ,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 1               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {                
                facture_mpe.validation = 1; 
              facture_mpe.$selected = false;
              vm.selectedItemFacture_mpe = {};
              vm.showbuttonValidationFacture_mpe_creer = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/

/************************************************debut attachement*************************************************/
        vm.click_tabs_attachement_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("attachement_travaux/index","menu","getattachement_travauxByfacture",'id_facture_mpe',vm.selectedItemFacture_mpe.id).then(function(result)
            {
                vm.allattachement_travaux = result.data.response;
            });
            vm.styleTabfils2 = "acc_menu";
        }
        vm.attachement_travaux_column = [        
        {titre:"Numero"
        },
        {titre:"Date de début"
        },
        {titre:"Date de fin"
        },
        {titre:"Total prévu"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterAttachement_travaux = function ()
        { 
            apiFactory.getAPIgeneraliserREST("attachement_travaux/index","menu","getattachement_travauxBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {   
                var last_id_attachement_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLasteattachement_mpe = result.data.response.filter(function(obj){return obj.id == last_id_attachement_mpe;});

                if (vm.dataLasteattachement_mpe.length>0)
                {   
                    last_numero_attachement_mpe = vm.dataLasteattachement_mpe[0].numero;
                    last_total_periode_attachement_mpe = vm.dataLasteattachement_mpe[0].total_periode;
                    last_total_cumul_attachement_mpe = vm.dataLasteattachement_mpe[0].total_cumul;
                    last_anterieur_attachement_mpe = vm.dataLasteattachement_mpe[0].anterieur;
                    
                    var items = {
                      $edit: true,
                      $selected: true,
                      id: '0',        
                      numero: parseInt(vm.dataLasteattachement_mpe[0].numero)+1,
                      date_debut: '',
                      date_fin: '',
                      total_prevu: vm.dataLasteattachement_mpe[0].total_prevu,
                      total_cumul: vm.dataLasteattachement_mpe[0].total_cumul,
                      total_anterieur: vm.dataLasteattachement_mpe[0].total_periode,
                      total_periode: 0,
                      validation: 0
                    };

                    if (vm.NouvelItemAttachement_travaux == false)
                  {                              
                    vm.allattachement_travaux.push(items);
                    vm.allattachement_travaux.forEach(function(cis)
                    {
                      if(cis.$selected==true)
                      {
                        vm.selectedItemAttachement_travaux = cis;
                      }
                    });
                  }
                  else
                  {
                      vm.showAlert('Ajout attachement travaux','Un formulaire d\'ajout est déjà ouvert!!!');
                  } 
                    
                }
                else
                {   
                    apiFactory.getAPIgeneraliserREST("attachement_travaux/index","menu","getattachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                    {
                        vm.montant_attachement_prevu = result.data.response;
                        var items = {
                      $edit: true,
                      $selected: true,
                      id: '0',        
                      numero: 1,
                      date_debut: '',
                      date_fin: '',
                      total_prevu: parseInt(vm.montant_attachement_prevu[0].total_prevu),
                      total_cumul: 0,
                      total_anterieur: 0,
                      total_periode: 0,
                      validation: 0
                    };
                    console.log(items);
                        if (vm.NouvelItemAttachement_travaux == false)
                        {                              
                            vm.allattachement_travaux.push(items);
                            vm.allattachement_travaux.forEach(function(cis)
                            {
                                if(cis.$selected==true)
                                {
                                    vm.selectedItemAttachement_travaux = cis;
                                }
                            });
                          }
                          else
                          {
                              vm.showAlert('Ajout attachement travaux','Un formulaire d\'ajout est déjà ouvert!!!');
                          }
                    });
                }         
            });
                
                
          
        };

        //fonction ajout dans bdd
        function ajoutAttachement_travaux(attachement_travaux,suppression)
        {
            if (vm.NouvelItemAttachement_travaux==false)
            {
                test_existanceAttachement_travaux (attachement_travaux,suppression); 
            } 
            else
            {
                insert_in_baseAttachement_travaux(attachement_travaux,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_mpe
        vm.annulerAttachement_travaux = function(item)
        {
          if (vm.NouvelItemAttachement_travaux == false)
          {
            item.$edit = false;
            item.$selected = false;
            //item.id_contrat_prestataire   = currentItemDemande_batiment_mpe.id_contrat_prestataire ;
            item.numero   = currentItemAttachement_travaux.numero ;
            item.date_debut   = currentItemAttachement_travaux.date_debut ;
            item.date_fin   = currentItemAttachement_travaux.date_fin ;
            item.total_prevu   = currentItemAttachement_travaux.total_prevu ;
            item.total_cumul = currentItemAttachement_travaux.total_cumul ;
            item.total_anterieur = currentItemAttachement_travaux.total_anterieur;
            item.total_periode = currentItemAttachement_travaux.total_periode ;
          }else
          {
            vm.allattachement_travaux = vm.allattachement_travaux.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAttachement_travaux.id;
            });
          }

          vm.selectedItemAttachement_travaux = {} ;
          vm.NouvelItemAttachement_travaux      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionAttachement_travaux= function (item)
        {
            vm.selectedItemAttachement_travaux = item;
           // vm.vm.NouvelItemAttachement_travaux   = item;
           if (item.$edit==false || item.$edit==undefined)
           {
                currentItemAttachement_travaux    = JSON.parse(JSON.stringify(vm.selectedItemAttachement_travaux));

                vm.stepbatiment_mpe = true;
                vm.steplatrine_mpe = true;
                vm.stepmobilier_mpe = true;
                vm.validation_facture_mpe = item.validation;
           }
            
           if(item.id!=0)
           {
           /* apiFactory.getAPIgeneraliserREST("justificatif_batiment_pre/index",'id_demande_pay_pre',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alljustificatif_batiment_mpe = result.data.response;
                console.log(vm.alljustificatif_batiment_mpe);
            });*/

           }
            vm.validation_attachement_travaux = item.validation;
            //vm.stepjusti_batiment_mpe = true;   
        };
        $scope.$watch('vm.selectedItemAttachement_travaux', function()
        {
             if (!vm.allattachement_travaux) return;
             vm.allattachement_travaux.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAttachement_travaux.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAttachement_travaux = function(item)
        {
            vm.NouvelItemAttachement_travaux = false ;
            vm.selectedItemAttachement_travaux = item;
            currentItemAttachement_travaux = angular.copy(vm.selectedItemAttachement_travaux);
            $scope.vm.allattachement_travaux.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            //item.id_contrat_prestataire   = vm.selectedItemAttachement_travaux.contrat_prestataire.id ;
            item.numero   = vm.selectedItemAttachement_travaux.numero ;
            item.date_debut   = new Date(vm.selectedItemAttachement_travaux.date_debut) ;
            item.date_fin   = new Date(vm.selectedItemAttachement_travaux.date_fin);
            item.total_prevu   = vm.selectedItemAttachement_travaux.total_prevu ;
            item.total_cumul = vm.selectedItemAttachement_travaux.total_cumul ;
            item.total_anterieur = vm.selectedItemAttachement_travaux.total_anterieur ;
            item.total_periode = vm.selectedItemAttachement_travaux.tranche.total_periode ;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerAttachement_travaux = function()
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
                vm.ajoutAttachement_travaux(vm.selectedItemAttachement_travaux,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAttachement_travaux (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allattachement_travaux.filter(function(obj)
                {
                   return obj.id == currentItemAttachement_travaux.id;
                });
                if(pass[0])
                {
                   if((pass[0].numero   != currentItemAttachement_travaux.numero )
                    || (pass[0].date_debut   != currentItemAttachement_travaux.date_debut )
                    || (pass[0].date_fin   != currentItemAttachement_travaux.date_fin )
                    || (pass[0].total_cumul != currentItemAttachement_travaux.total_cumul )
                    || (pass[0].total_anterieur != currentItemAttachement_travaux.total_anterieur )
                    || (pass[0].total_prevu   != currentItemAttachement_travaux.total_prevu ) )                   
                      { 
                         insert_in_baseAttachement_travaux(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAttachement_travaux(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Attachement_travaux
        function insert_in_baseAttachement_travaux(attachement_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemAttachement_travaux==false)
            {
                getId = vm.selectedItemAttachement_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    numero: attachement_travaux.numero,
                    date_debut:convertionDate(new Date(attachement_travaux.date_debut)),
                    total_prevu:attachement_travaux.total_prevu,
                    date_fin: convertionDate(new Date(attachement_travaux.date_fin)),
                    total_cumul: attachement_travaux.total_cumul ,
                    total_anterieur: attachement_travaux.total_anterieur ,
                    total_periode: attachement_travaux.total_periode ,
                    id_facture_mpe: vm.selectedItemFacture_mpe.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("attachement_travaux/index",datas, config).success(function (data)
            {

                if (vm.NouvelItemAttachement_travaux == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemAttachement_travaux.$selected  = false;
                        vm.selectedItemAttachement_travaux.$edit      = false;
                        vm.selectedItemAttachement_travaux ={};
                    }
                    else 
                    {    
                      vm.allattachement_travaux = vm.allattachement_travaux.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAttachement_travaux.id;
                      });
                    }
                    
                }
                else
                {                  
                  attachement_travaux.id  =   String(data.response);
                }
              //vm.showboutonValider = false;

              attachement_travaux.$selected = false;
              attachement_travaux.$edit = false;
              vm.selectedItemAttachement_travaux = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin attachement***************************************************/



/************************************************debut batiment_mpe*************************************************/
    vm.click_tab_tranche_batiment = function()
        {
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_batiment_mpe = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                }
            });
            console.log('okok');
        }
        vm.demande_batiment_mpe_column = [
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
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterDemande_batiment_mpe = function ()
        { 
          var items = {
              $edit: true,
              $selected: true,
              id: '0',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              validation: 0
            };

        if (vm.NouvelItemDemande_batiment_mpe == false)
          {  
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {             
                var last_id_demande_batiment_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLastedemande_batiment_mpe = result.data.response.filter(function(obj){return obj.id == last_id_demande_batiment_mpe;});

                if (vm.dataLastedemande_batiment_mpe.length>0)
                {   
                    var last_tranche_demande_batiment_mpe = Math.max.apply(Math, vm.dataLastedemande_batiment_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_batiment_mpe[0].facture_mpe.validation))
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
            });             
              
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
            item.id_tranche_demande_mpe = currentItemDemande_batiment_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_batiment_mpe.montant ;
            item.cumul = currentItemDemande_batiment_mpe.cumul ;
            item.anterieur = currentItemDemande_batiment_mpe.anterieur;
            item.periode = currentItemDemande_batiment_mpe.periode ;
            item.pourcentage = currentItemDemande_batiment_mpe.pourcentage ;
            item.reste = currentItemDemande_batiment_mpe.reste;
          }else
          {
            vm.alldemande_batiment_mpe = vm.alldemande_batiment_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_mpe.id;
            });
          }

          vm.selectedItemDemande_batiment_mpe = {} ;
          vm.NouvelItemDemande_batiment_mpe_      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           // vm.vm.NouvelItemDemande_batiment_mpe   = item;
            currentItemDemande_batiment_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_mpe));
           if(item.$edit==false || item.$edit==undefined)
           {
                vm.stepattachement_batiment_travaux = true;
           }
            vm.validation_demande_batiment_mpe = item.validation;
            vm.stepjusti_batiment_mpe = true;   
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

            item.$edit = true;
            item.$selected = true;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_batiment_mpe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_batiment_mpe.montant);
            item.cumul = vm.selectedItemDemande_batiment_mpe.cumul ;
            item.anterieur = vm.selectedItemDemande_batiment_mpe.anterieur ;
            item.periode = vm.selectedItemDemande_batiment_mpe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_batiment_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_batiment_mpe.reste ;
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
                   if((pass[0].id_tranche_demande_mpe != currentItemDemande_batiment_mpe.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_batiment_mpe.montant )
                    || (pass[0].cumul != currentItemDemande_batiment_mpe.cumul )
                    || (pass[0].anterieur != currentItemDemande_batiment_mpe.anterieur )
                    || (pass[0].reste != currentItemDemande_batiment_mpe.reste ) )                   
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
                    id_tranche_demande_mpe: demande_batiment_mpe.id_tranche_demande_mpe ,
                    montant: demande_batiment_mpe.montant,
                    cumul: demande_batiment_mpe.cumul ,
                    anterieur: demande_batiment_mpe.anterieur ,
                    reste: demande_batiment_mpe.reste ,
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id              
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
                      vm.showbuttonNouvDemande_batiment_mpe_creer = true;
                    }
                    
                }
                else
                {
                  demande_batiment_mpe.tranche = tran[0] ;
                  demande_batiment_mpe.periode = tran[0].periode ;
                  demande_batiment_mpe.pourcentage = tran[0].pourcentage ;
                  demande_batiment_mpe.id  =   String(data.response);
                  vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                  vm.NouvelItemDemande_batiment_mpe= false;
                  vm.selectedItemAttachement_travaux.total_cumul =parseInt(vm.selectedItemAttachement_travaux.total_cumul) + parseInt(demande_batiment_mpe.cumul);
                  vm.selectedItemAttachement_travaux.total_anterieur =parseInt(vm.selectedItemAttachement_travaux.total_anterieur) + parseInt(demande_batiment_mpe.anterieur);                  
                  vm.selectedItemAttachement_travaux.total_periode =parseInt(vm.selectedItemAttachement_travaux.total_periode) + parseInt(demande_batiment_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux);
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0) ; 

                  var montant_trav = parseInt(vm.selectedItemFacture_mpe.montant_travaux) + parseInt(demande_batiment_mpe.montant);
                  var montant_rabais = (montant_trav * vm.selectedItemFacture_mpe.pourcentage_rabais)/100;
                    var montant_ht = parseInt(montant_rabais) + parseInt(montant_trav);
                    var montant_tva = (montant_ht *20)/100;
                    vm.selectedItemFacture_mpe.montant_travaux = montant_trav;
                    vm.selectedItemFacture_mpe.montant_rabais = montant_rabais;
                    vm.selectedItemFacture_mpe.montant_ht = montant_ht;
                    vm.selectedItemFacture_mpe.montant_tva = montant_tva;

                    vm.selectedItemFacture_mpe.montant_ttc = montant_ht + montant_tva;
                    vm.selectedItemFacture_mpe.net_payer = parseInt(montant_ht) + parseInt(montant_tva) - (parseInt(vm.selectedItemFacture_mpe.remboursement_acompte) + 
                    parseInt(vm.selectedItemFacture_mpe.retenue_garantie) + parseInt(vm.selectedItemFacture_mpe.penalite_retard) + parseInt(vm.selectedItemFacture_mpe.remboursement_plaque));
                    majatfacture_mpe(vm.selectedItemFacture_mpe,0);
            }
              //vm.showboutonValider = false;

              demande_batiment_mpe.$selected = false;
              demande_batiment_mpe.$edit = false;
              vm.selectedItemDemande_batiment_mpe = {};
              //vm.showbuttonNouvDemande_batiment_mpe_creer = false;
            vm.showbuttonValidationDemande_batiment_mpe_creer = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //insertion ou mise a jours ou suppression item dans bdd Attachement_travaux
        function majattachement_travaux(attachement_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        attachement_travaux.id,
                    numero: attachement_travaux.numero,
                    date_debut:convertionDate(new Date(attachement_travaux.date_debut)),
                    total_prevu:attachement_travaux.total_prevu,
                    date_fin: convertionDate(new Date(attachement_travaux.date_fin)),
                    total_cumul: attachement_travaux.total_cumul ,
                    total_anterieur: attachement_travaux.total_anterieur ,
                    total_periode: attachement_travaux.total_periode ,
                    id_facture_mpe: vm.selectedItemFacture_mpe.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("attachement_travaux/index",datas, config).success(function (data)
            {   console.log('vita attachement') ;           
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        function majatfacture_mpe(facture_mpe,suppression)
        {
            //add
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
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(new Date(facture_mpe.date_signature)) ,
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
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
          
          var reste = 0;
          var anterieur = 0;

          var montant = ((vm.selectedItemContrat_prestataire.cout_batiment) * vm.allcurenttranche_demande_batiment_mpe[0].pourcentage)/100;
          var cumul = montant;

          var demande_ancien = vm.alldemande_batiment_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (vm.allcurenttranche_demande_batiment_mpe[0].code != 'tranche 1')
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
/************************************************fin batiment_mpe***************************************************/

/**********************************************debut attachement batiment travauxe***************************************************/
        vm.click_tab_attachement_batiment_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_travaux/index","menu","getdivers_attachementByDemande",'id_demande_batiment_mpe',vm.selectedItemDemande_batiment_mpe.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_travaux= result.data.response;
            });
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_prevu/index","menu","getdivers_attachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_prevu= result.data.response;
            console.log(vm.alldivers_attachement_batiment_prevu);
            });
        }
        vm.change_attachement_prevu = function(item)
        {   
            vm.allmontant_prevu = vm.alldivers_attachement_batiment_prevu.filter(function(obj)
            {
                return obj.id == item.id_divers_attachement_batiment_prevu;
            });

            item.montant_prevu = vm.allmontant_prevu[0].montant_prevu;

            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_travaux/index","menu",
                "getmaxattachement_travauxByattachement_prevu",'id_divers_attachement_batiment_prevu',
                item.id_divers_attachement_batiment_prevu,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alllast_attachement_batiment_travaux= result.data.response;
                if(vm.alllast_attachement_batiment_travaux.length>0)
                {
                 console.log(vm.alllast_attachement_batiment_travaux);                
                 item.montant_anterieur = vm.alllast_attachement_batiment_travaux[0].montant_prevu;
                item.montant_cumul = parseInt(vm.alllast_attachement_batiment_travaux[0].montant_cumul) + parseInt(item.montant_prevu) ;

                }
                
            });
        }
        vm.change_montant_periode = function(item)
        { 
            var cumul=0;
            var pourcentage=0;

            if (NouvelItemDivers_attachement_batiment_travaux==true)
            {
                if (vm.alllast_attachement_batiment_travaux>0)
                 {  cumul =parseInt(vm.alllast_attachement_batiment_travaux[0].montant_cumul) + parseInt(item.montant_prevu) + parseInt(item.montant_periode)  ;
                    
                    pourcentage =((parseInt(vm.alllast_attachement_batiment_travaux[0].montant_cumul) + parseInt(item.montant_prevu) + parseInt(item.montant_periode)) * 100)/item.montant_prevu;
                    item.montant_cumul=cumul;
                    item.pourcentage = pourcentage.toFixed(3);
                 }
                 else{
                    cumul = parseInt(item.montant_periode)  ;
                    pourcentage = (parseInt(item.montant_periode) * 100)/item.montant_prevu;
                    item.montant_cumul=cumul;
                    item.pourcentage = pourcentage.toFixed(3);
               
                 }
            }else{

                cumul = parseInt(currentItemDivers_attachement_batiment_travaux.montant_cumul) + parseInt(item.montant_periode) ;
                pourcentage = ((parseInt(currentItemDivers_attachement_batiment_travaux.montant_cumul) + parseInt(item.montant_periode)) * 100)/item.montant_prevu;
                item.montant_cumul=cumul;
                item.pourcentage = pourcentage.toFixed(3);
            }


        }
        vm.ajouterDivers_attachement_batiment_travaux = function ()
        {
          var items = {
                $edit: true,
                $selected: true,
                id: '0',
                montant_prevu  : 0 ,
                montant_periode  : 0 ,
                montant_anterieur  : 0 ,
                montant_cumul  : 0 ,
                pourcentage  : 0 ,
                id_divers_attachement_batiment_prevu : ''
            };

        if (NouvelItemDivers_attachement_batiment_travaux == false)
          {                      
            vm.alldivers_attachement_batiment_travaux.push(items);
            vm.alldivers_attachement_batiment_travaux.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemDivers_attachement_batiment_travaux = cis;
              }
            });
            NouvelItemDivers_attachement_batiment_travaux = true;
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDivers_attachement_batiment_travaux(divers_attachement_batiment_travaux,suppression)
        {
            if (NouvelItemDivers_attachement_batiment_travaux==false)
            {
                test_existanceDivers_attachement_batiment_travaux (divers_attachement_batiment_travaux,suppression); 
            } 
            else
            {
                insert_in_baseDivers_attachement_batiment_travaux(divers_attachement_batiment_travaux,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_batiment_travaux
        vm.annulerDivers_attachement_batiment_travaux = function(item)
        {
          if (NouvelItemDivers_attachement_batiment_travaux == false)
          {
            item.$edit = false;
            item.$selected = false;                
            item.montant_prevu   = currentItemDivers_attachement_batiment_travaux.montant_prevu ;
            item.montant_periode   = currentItemDivers_attachement_batiment_travaux.montant_periode ;
            item.montant_anterieur   = currentItemDivers_attachement_batiment_travaux.montant_anterieur ;
            item.montant_cumul   = currentItemDivers_attachement_batiment_travaux.montant_cumul ;
            item.pourcentage   = currentItemDivers_attachement_batiment_travaux.pourcentage ;
            item.id_divers_attachement_batiment_prevu   = currentItemDivers_attachement_batiment_travaux.id_divers_attachement_batiment_prevu ;
          }else
          {
            vm.alldivers_attachement_batiment_travaux = vm.alldivers_attachement_batiment_travaux.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDivers_attachement_batiment_travaux.id;
            });
          }

          vm.selectedItemDivers_attachement_batiment_travaux = {} ;
          NouvelItemDivers_attachement_batiment_travaux      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDivers_attachement_batiment_travaux= function (item)
        {
            vm.selectedItemDivers_attachement_batiment_travaux = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemDivers_attachement_batiment_travaux    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_batiment_travaux));             
            }
            
        };
        $scope.$watch('vm.selectedItemDivers_attachement_batiment_travaux', function()
        {
             if (!vm.alldivers_attachement_batiment_travaux) return;
             vm.alldivers_attachement_batiment_travaux.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDivers_attachement_batiment_travaux.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDivers_attachement_batiment_travaux = function(item)
        {
            
            vm.selectedItemDivers_attachement_batiment_travaux = item;
            currentItemDivers_attachement_batiment_travaux = angular.copy(vm.selectedItemDivers_attachement_batiment_travaux);
            $scope.vm.alldivers_attachement_batiment_travaux.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
              
            NouvelItemDivers_attachement_batiment_travaux = false ;                
            item.montant_prevu   = vm.selectedItemDivers_attachement_batiment_travaux.montant_prevu ;
            item.montant_periode   = parseInt(vm.selectedItemDivers_attachement_batiment_travaux.montant_periode) ;
            item.montant_anterieur   = parseInt(vm.selectedItemDivers_attachement_batiment_travaux.montant_anterieur) ;
            item.montant_cumul   = parseInt(vm.selectedItemDivers_attachement_batiment_travaux.montant_cumul );
            item.pourcentage   = parseInt(vm.selectedItemDivers_attachement_batiment_travaux.pourcentage) ;
            item.id_divers_attachement_batiment_prevu = vm.selectedItemParticipant_odc.divers_attachement_batiment_prevu.id;
            
        };

        //fonction bouton suppression item divers_attachement_batiment_travaux
        vm.supprimerDivers_attachement_batiment_travaux = function()
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
                vm.ajoutDivers_attachement_batiment_travaux(vm.selectedItemDivers_attachement_batiment_travaux,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDivers_attachement_batiment_travaux (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldivers_attachement_batiment_travaux.filter(function(obj)
                {
                   return obj.id == currentItemDivers_attachement_batiment_travaux.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_prevu != currentItemDivers_attachement_batiment_travaux.montant_prevu )
                    || (mem[0].montant_periode != currentItemDivers_attachement_batiment_travaux.montant_periode ))                   
                      { 
                         insert_in_baseDivers_attachement_batiment_travaux(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDivers_attachement_batiment_travaux(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_batiment_travaux
        function insert_in_baseDivers_attachement_batiment_travaux(divers_attachement_batiment_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDivers_attachement_batiment_travaux==false)
            {
                getId = vm.selectedItemDivers_attachement_batiment_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_prevu: divers_attachement_batiment_travaux.montant_prevu,
                    montant_periode: divers_attachement_batiment_travaux.montant_periode,
                    montant_anterieur: divers_attachement_batiment_travaux.montant_anterieur,
                    montant_cumul: divers_attachement_batiment_travaux.montant_cumul,
                    pourcentage: divers_attachement_batiment_travaux.pourcentage,
                    id_demande_batiment_mpe: vm.selectedItemDemande_batiment_mpe.id,
                    id_divers_attachement_batiment_prevu: divers_attachement_batiment_travaux.id_divers_attachement_batiment_prevu            
                });
                console.log(datas);
                //factory
            apiFactory.add("divers_attachement_batiment_travaux/index",datas, config).success(function (data)
            {

              if (NouvelItemDivers_attachement_batiment_travaux == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDivers_attachement_batiment_travaux.$selected  = false;
                        vm.selectedItemDivers_attachement_batiment_travaux.$edit      = false;
                        vm.selectedItemDivers_attachement_batiment_travaux ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        vm.alldivers_attachement_batiment_travaux = vm.alldivers_attachement_batiment_travaux.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDivers_attachement_batiment_travaux.id;
                      });                      
                    }
              }
              else
              {
                  divers_attachement_batiment_travaux.id_divers_attachement_batiment_travaux  =   String(data.response);              
                  NouvelItemDivers_attachement_batiment_travaux = false;                    
              }

              divers_attachement_batiment_travaux.$selected = false;
              divers_attachement_batiment_travaux.$edit = false;
              vm.selectedItemDivers_attachement_batiment_travaux ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement batiment travaux***********************************************/


/************************************************debut latrine_mpe*************************************************/
    vm.click_tab_tranche_latrine = function()
        {
            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_latrine_mpe = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                }
            });
            console.log('okok');
        }
        vm.demande_latrine_mpe_column = [
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
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterDemande_latrine_mpe = function ()
        { 
          var items = {
              $edit: true,
              $selected: true,
              id: '0',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              validation: 0
            };

        if (vm.NouvelItemDemande_latrine_mpe == false)
          {  
            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {             
                var last_id_demande_latrine_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLastedemande_latrine_mpe = result.data.response.filter(function(obj){return obj.id == last_id_demande_latrine_mpe;});

                if (vm.dataLastedemande_latrine_mpe.length>0)
                {   
                    var last_tranche_demande_latrine_mpe = Math.max.apply(Math, vm.dataLastedemande_latrine_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_latrine_mpe[0].facture_mpe.validation))
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
            });             
              
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
            item.id_tranche_demande_mpe = currentItemDemande_latrine_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_latrine_mpe.montant ;
            item.cumul = currentItemDemande_latrine_mpe.cumul ;
            item.anterieur = currentItemDemande_latrine_mpe.anterieur;
            item.periode = currentItemDemande_latrine_mpe.periode ;
            item.pourcentage = currentItemDemande_latrine_mpe.pourcentage ;
            item.reste = currentItemDemande_latrine_mpe.reste;
          }else
          {
            vm.alldemande_latrine_mpe = vm.alldemande_latrine_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_latrine_mpe.id;
            });
          }

          vm.selectedItemDemande_latrine_mpe = {} ;
          vm.NouvelItemDemande_latrine_mpe_      = false;
          
        };

        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item;
           // vm.vm.NouvelItemDemande_latrine_mpe   = item;
            currentItemDemande_latrine_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_mpe));
           if(item.$edit==false || item.$edit==undefined)
           {
                vm.stepattachement_latrine_travaux = true;
           }
            vm.validation_demande_latrine_mpe = item.validation;
            vm.stepjusti_latrine_mpe = true;   
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

            item.$edit = true;
            item.$selected = true;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_latrine_mpe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_latrine_mpe.montant);
            item.cumul = vm.selectedItemDemande_latrine_mpe.cumul ;
            item.anterieur = vm.selectedItemDemande_latrine_mpe.anterieur ;
            item.periode = vm.selectedItemDemande_latrine_mpe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_latrine_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_latrine_mpe.reste ;
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
                   if((pass[0].id_tranche_demande_mpe != currentItemDemande_latrine_mpe.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_latrine_mpe.montant )
                    || (pass[0].cumul != currentItemDemande_latrine_mpe.cumul )
                    || (pass[0].anterieur != currentItemDemande_latrine_mpe.anterieur )
                    || (pass[0].reste != currentItemDemande_latrine_mpe.reste ) )                   
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
                    id_tranche_demande_mpe: demande_latrine_mpe.id_tranche_demande_mpe ,
                    montant: demande_latrine_mpe.montant,
                    cumul: demande_latrine_mpe.cumul ,
                    anterieur: demande_latrine_mpe.anterieur ,
                    reste: demande_latrine_mpe.reste ,
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id              
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
                      vm.showbuttonNouvDemande_latrine_mpe_creer = true;
                    }
                    
                }
                else
                {
                  demande_latrine_mpe.tranche = tran[0] ;
                  demande_latrine_mpe.periode = tran[0].periode ;
                  demande_latrine_mpe.pourcentage = tran[0].pourcentage ;
                  demande_latrine_mpe.id  =   String(data.response);
                  vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                  vm.NouvelItemDemande_latrine_mpe= false;
                  vm.selectedItemAttachement_travaux.total_cumul =parseInt(vm.selectedItemAttachement_travaux.total_cumul) + parseInt(demande_latrine_mpe.cumul);
                  vm.selectedItemAttachement_travaux.total_anterieur =parseInt(vm.selectedItemAttachement_travaux.total_anterieur) + parseInt(demande_latrine_mpe.anterieur);                  
                  vm.selectedItemAttachement_travaux.total_periode =parseInt(vm.selectedItemAttachement_travaux.total_periode) + parseInt(demande_latrine_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux);
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0) ; 

                  var montant_trav = parseInt(vm.selectedItemFacture_mpe.montant_travaux) + parseInt(demande_latrine_mpe.montant);
                  var montant_rabais = (montant_trav * vm.selectedItemFacture_mpe.pourcentage_rabais)/100;
                    var montant_ht =parseInt( montant_rabais) + parseInt(montant_trav);
                    var montant_tva = (montant_ht *20)/100;
                    vm.selectedItemFacture_mpe.montant_travaux = montant_trav;
                    vm.selectedItemFacture_mpe.montant_rabais = montant_rabais;
                    vm.selectedItemFacture_mpe.montant_ht = montant_ht;
                    vm.selectedItemFacture_mpe.montant_tva = montant_tva;

                    vm.selectedItemFacture_mpe.montant_ttc = montant_ht + montant_tva;
                    vm.selectedItemFacture_mpe.net_payer = parseInt(montant_ht) + parseInt(montant_tva) - (parseInt(vm.selectedItemFacture_mpe.remboursement_acompte) + 
                    parseInt(vm.selectedItemFacture_mpe.retenue_garantie) + parseInt(vm.selectedItemFacture_mpe.penalite_retard) + parseInt(vm.selectedItemFacture_mpe.remboursement_plaque));
                    majatfacture_mpe(vm.selectedItemFacture_mpe,0);
                    console.log(vm.selectedItemAttachement_travaux);
            }
              //vm.showboutonValider = false;

              demande_latrine_mpe.$selected = false;
              demande_latrine_mpe.$edit = false;
              vm.selectedItemDemande_latrine_mpe = {};
              //vm.showbuttonNouvDemande_latrine_mpe_creer = false;
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

          if (vm.allcurenttranche_demande_latrine_mpe[0].code != 'tranche 1')
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
/************************************************fin latrine_mpe***************************************************/

/**********************************************debut attachement latrine travauxe***************************************************/
        vm.click_tab_attachement_latrine_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_travaux/index","menu","getdivers_attachementByDemande",'id_demande_latrine_mpe',vm.selectedItemDemande_latrine_mpe.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_travaux= result.data.response;
            });
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_prevu/index","menu","getdivers_attachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_prevu= result.data.response;
            console.log(vm.alldivers_attachement_latrine_prevu);
            });
        }
        vm.change_attachement_prevu_latrine = function(item)
        {   
            vm.allmontant_prevu = vm.alldivers_attachement_latrine_prevu.filter(function(obj)
            {
                return obj.id == item.id_divers_attachement_latrine_prevu;
            });

            item.montant_prevu = vm.allmontant_prevu[0].montant_prevu;

            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_travaux/index","menu",
                "getmaxattachement_travauxByattachement_prevu",'id_divers_attachement_latrine_prevu',
                item.id_divers_attachement_latrine_prevu,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alllast_attachement_latrine_travaux= result.data.response;
                if(vm.alllast_attachement_latrine_travaux.length>0)
                {
                 console.log(vm.alllast_attachement_latrine_travaux);                
                 item.montant_anterieur = vm.alllast_attachement_latrine_travaux[0].montant_prevu;
                item.montant_cumul = parseInt(vm.alllast_attachement_latrine_travaux[0].montant_cumul) + parseInt(item.montant_prevu) ;

                }
                
            });
        }
        vm.change_montant_periode_latrine = function(item)
        { 
            var cumul=0;
            var pourcentage=0;

            if (NouvelItemDivers_attachement_latrine_travaux==true)
            {
                if (vm.alllast_attachement_latrine_travaux>0)
                 {  cumul =parseInt(vm.alllast_attachement_latrine_travaux[0].montant_cumul) + parseInt(item.montant_prevu) + parseInt(item.montant_periode)  ;
                    
                    pourcentage =((parseInt(vm.alllast_attachement_latrine_travaux[0].montant_cumul) + parseInt(item.montant_prevu) + parseInt(item.montant_periode)) * 100)/item.montant_prevu;
                    item.montant_cumul=cumul;
                    item.pourcentage = pourcentage.toFixed(3);
                 }
                 else{
                    cumul = parseInt(item.montant_periode)  ;
                    pourcentage = (parseInt(item.montant_periode) * 100)/item.montant_prevu;
                    item.montant_cumul=cumul;
                    item.pourcentage = pourcentage.toFixed(3);
               
                 }
            }else{

                cumul = parseInt(currentItemDivers_attachement_latrine_travaux.montant_cumul) + parseInt(item.montant_periode) ;
                pourcentage = ((parseInt(currentItemDivers_attachement_latrine_travaux.montant_cumul) + parseInt(item.montant_periode)) * 100)/item.montant_prevu;
                item.montant_cumul=cumul;
                item.pourcentage = pourcentage.toFixed(3);
            }


        }
        vm.ajouterDivers_attachement_latrine_travaux = function ()
        {
          var items = {
                $edit: true,
                $selected: true,
                id: '0',
                montant_prevu  : 0 ,
                montant_periode  : 0 ,
                montant_anterieur  : 0 ,
                montant_cumul  : 0 ,
                pourcentage  : 0 ,
                id_divers_attachement_latrine_prevu : ''
            };

        if (NouvelItemDivers_attachement_latrine_travaux == false)
          {                      
            vm.alldivers_attachement_latrine_travaux.push(items);
            vm.alldivers_attachement_latrine_travaux.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemDivers_attachement_latrine_travaux = cis;
              }
            });
            NouvelItemDivers_attachement_latrine_travaux = true;
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDivers_attachement_latrine_travaux(divers_attachement_latrine_travaux,suppression)
        {
            if (NouvelItemDivers_attachement_latrine_travaux==false)
            {
                test_existanceDivers_attachement_latrine_travaux (divers_attachement_latrine_travaux,suppression); 
            } 
            else
            {
                insert_in_baseDivers_attachement_latrine_travaux(divers_attachement_latrine_travaux,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_latrine_travaux
        vm.annulerDivers_attachement_latrine_travaux = function(item)
        {
          if (NouvelItemDivers_attachement_latrine_travaux == false)
          {
            item.$edit = false;
            item.$selected = false;                
            item.montant_prevu   = currentItemDivers_attachement_latrine_travaux.montant_prevu ;
            item.montant_periode   = currentItemDivers_attachement_latrine_travaux.montant_periode ;
            item.montant_anterieur   = currentItemDivers_attachement_latrine_travaux.montant_anterieur ;
            item.montant_cumul   = currentItemDivers_attachement_latrine_travaux.montant_cumul ;
            item.pourcentage   = currentItemDivers_attachement_latrine_travaux.pourcentage ;
            item.id_divers_attachement_latrine_prevu   = currentItemDivers_attachement_latrine_travaux.id_divers_attachement_latrine_prevu ;
          }else
          {
            vm.alldivers_attachement_latrine_travaux = vm.alldivers_attachement_latrine_travaux.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDivers_attachement_latrine_travaux.id;
            });
          }

          vm.selectedItemDivers_attachement_latrine_travaux = {} ;
          NouvelItemDivers_attachement_latrine_travaux      = false;
          
        };

        //fonction selection item justificatif latrine
        vm.selectionDivers_attachement_latrine_travaux= function (item)
        {
            vm.selectedItemDivers_attachement_latrine_travaux = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemDivers_attachement_latrine_travaux    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_latrine_travaux));             
            }
            
        };
        $scope.$watch('vm.selectedItemDivers_attachement_latrine_travaux', function()
        {
             if (!vm.alldivers_attachement_latrine_travaux) return;
             vm.alldivers_attachement_latrine_travaux.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDivers_attachement_latrine_travaux.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDivers_attachement_latrine_travaux = function(item)
        {
            
            vm.selectedItemDivers_attachement_latrine_travaux = item;
            currentItemDivers_attachement_latrine_travaux = angular.copy(vm.selectedItemDivers_attachement_latrine_travaux);
            $scope.vm.alldivers_attachement_latrine_travaux.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
              
            NouvelItemDivers_attachement_latrine_travaux = false ;                
            item.montant_prevu   = vm.selectedItemDivers_attachement_latrine_travaux.montant_prevu ;
            item.montant_periode   = parseInt(vm.selectedItemDivers_attachement_latrine_travaux.montant_periode) ;
            item.montant_anterieur   = parseInt(vm.selectedItemDivers_attachement_latrine_travaux.montant_anterieur) ;
            item.montant_cumul   = parseInt(vm.selectedItemDivers_attachement_latrine_travaux.montant_cumul );
            item.pourcentage   = parseInt(vm.selectedItemDivers_attachement_latrine_travaux.pourcentage) ;
            item.id_divers_attachement_latrine_prevu = vm.selectedItemParticipant_odc.divers_attachement_latrine_prevu.id;
            
        };

        //fonction bouton suppression item divers_attachement_latrine_travaux
        vm.supprimerDivers_attachement_latrine_travaux = function()
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
                vm.ajoutDivers_attachement_latrine_travaux(vm.selectedItemDivers_attachement_latrine_travaux,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDivers_attachement_latrine_travaux (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldivers_attachement_latrine_travaux.filter(function(obj)
                {
                   return obj.id == currentItemDivers_attachement_latrine_travaux.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_prevu != currentItemDivers_attachement_latrine_travaux.montant_prevu )
                    || (mem[0].montant_periode != currentItemDivers_attachement_latrine_travaux.montant_periode ))                   
                      { 
                         insert_in_baseDivers_attachement_latrine_travaux(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDivers_attachement_latrine_travaux(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_latrine_travaux
        function insert_in_baseDivers_attachement_latrine_travaux(divers_attachement_latrine_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDivers_attachement_latrine_travaux==false)
            {
                getId = vm.selectedItemDivers_attachement_latrine_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_prevu: divers_attachement_latrine_travaux.montant_prevu,
                    montant_periode: divers_attachement_latrine_travaux.montant_periode,
                    montant_anterieur: divers_attachement_latrine_travaux.montant_anterieur,
                    montant_cumul: divers_attachement_latrine_travaux.montant_cumul,
                    pourcentage: divers_attachement_latrine_travaux.pourcentage,
                    id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                    id_divers_attachement_latrine_prevu: divers_attachement_latrine_travaux.id_divers_attachement_latrine_prevu            
                });
                console.log(datas);
                //factory
            apiFactory.add("divers_attachement_latrine_travaux/index",datas, config).success(function (data)
            {

              if (NouvelItemDivers_attachement_latrine_travaux == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDivers_attachement_latrine_travaux.$selected  = false;
                        vm.selectedItemDivers_attachement_latrine_travaux.$edit      = false;
                        vm.selectedItemDivers_attachement_latrine_travaux ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        vm.alldivers_attachement_latrine_travaux = vm.alldivers_attachement_latrine_travaux.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDivers_attachement_latrine_travaux.id;
                      });                      
                    }
              }
              else
              {
                  divers_attachement_latrine_travaux.id_divers_attachement_latrine_travaux  =   String(data.response);              
                  NouvelItemDivers_attachement_latrine_travaux = false;                    
              }

              divers_attachement_latrine_travaux.$selected = false;
              divers_attachement_latrine_travaux.$edit = false;
              vm.selectedItemDivers_attachement_latrine_travaux ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement latrine travaux***********************************************/




/************************************************debut mobilier_mpe*************************************************/
    vm.click_tab_tranche_mobilier = function()
        {
            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_mobilier_mpe = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                }
            });
            console.log('okok');
        }
        vm.demande_mobilier_mpe_column = [
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
        {titre:"Action"
        }];        

        //Masque de saisi ajout

        vm.ajouterDemande_mobilier_mpe = function ()
        { 
          var items = {
              $edit: true,
              $selected: true,
              id: '0',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              validation: 0
            };

        if (vm.NouvelItemDemande_mobilier_mpe == false)
          {  
            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {             
                var last_id_demande_mobilier_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLastedemande_mobilier_mpe = result.data.response.filter(function(obj){return obj.id == last_id_demande_mobilier_mpe;});

                if (vm.dataLastedemande_mobilier_mpe.length>0)
                {   
                    var last_tranche_demande_mobilier_mpe = Math.max.apply(Math, vm.dataLastedemande_mobilier_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    switch (parseInt(vm.dataLastedemande_mobilier_mpe[0].facture_mpe.validation))
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
            });             
              
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
            item.id_tranche_demande_mpe = currentItemDemande_mobilier_mpe.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_mobilier_mpe.montant ;
            item.cumul = currentItemDemande_mobilier_mpe.cumul ;
            item.anterieur = currentItemDemande_mobilier_mpe.anterieur;
            item.periode = currentItemDemande_mobilier_mpe.periode ;
            item.pourcentage = currentItemDemande_mobilier_mpe.pourcentage ;
            item.reste = currentItemDemande_mobilier_mpe.reste;
          }else
          {
            vm.alldemande_mobilier_mpe = vm.alldemande_mobilier_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_mobilier_mpe.id;
            });
          }

          vm.selectedItemDemande_mobilier_mpe = {} ;
          vm.NouvelItemDemande_mobilier_mpe_      = false;
          
        };

        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item;
           // vm.vm.NouvelItemDemande_mobilier_mpe   = item;
            currentItemDemande_mobilier_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_mobilier_mpe));
           if(item.$edit==false || item.$edit==undefined)
           {
                vm.stepattachement_mobilier_travaux = true;
           }
            vm.validation_demande_mobilier_mpe = item.validation;
            vm.stepjusti_mobilier_mpe = true;   
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

            
            item.$edit = true;
            item.$selected = true;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_mobilier_mpe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_mobilier_mpe.montant);
            item.cumul = vm.selectedItemDemande_mobilier_mpe.cumul ;
            item.anterieur = vm.selectedItemDemande_mobilier_mpe.anterieur ;
            item.periode = vm.selectedItemDemande_mobilier_mpe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_mobilier_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_mobilier_mpe.reste ;
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
                   if((pass[0].id_tranche_demande_mpe != currentItemDemande_mobilier_mpe.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_mobilier_mpe.montant )
                    || (pass[0].cumul != currentItemDemande_mobilier_mpe.cumul )
                    || (pass[0].anterieur != currentItemDemande_mobilier_mpe.anterieur )
                    || (pass[0].reste != currentItemDemande_mobilier_mpe.reste ) )                   
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
                    id_tranche_demande_mpe: demande_mobilier_mpe.id_tranche_demande_mpe ,
                    montant: demande_mobilier_mpe.montant,
                    cumul: demande_mobilier_mpe.cumul ,
                    anterieur: demande_mobilier_mpe.anterieur ,
                    reste: demande_mobilier_mpe.reste ,
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id              
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
                      vm.showbuttonNouvDemande_mobilier_mpe_creer = true;
                    }
                    
                }
                else
                {
                  demande_mobilier_mpe.tranche = tran[0] ;
                  demande_mobilier_mpe.periode = tran[0].periode ;
                  demande_mobilier_mpe.pourcentage = tran[0].pourcentage ;
                  demande_mobilier_mpe.id  =   String(data.response);
                  vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                  vm.NouvelItemDemande_mobilier_mpe= false;
                  vm.selectedItemAttachement_travaux.total_cumul =parseInt(vm.selectedItemAttachement_travaux.total_cumul) + parseInt(demande_mobilier_mpe.cumul);
                  vm.selectedItemAttachement_travaux.total_anterieur =parseInt(vm.selectedItemAttachement_travaux.total_anterieur) + parseInt(demande_mobilier_mpe.anterieur);                  
                  vm.selectedItemAttachement_travaux.total_periode =parseInt(vm.selectedItemAttachement_travaux.total_periode) + parseInt(demande_mobilier_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux);
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0) ; 

                  var montant_trav = parseInt(vm.selectedItemFacture_mpe.montant_travaux) + parseInt(demande_mobilier_mpe.montant);
                  var montant_rabais = (montant_trav * vm.selectedItemFacture_mpe.pourcentage_rabais)/100;
                    var montant_ht = parseInt(montant_rabais) + parseInt(montant_trav);
                    var montant_tva = (montant_ht *20)/100;
                    vm.selectedItemFacture_mpe.montant_travaux = montant_trav;
                    vm.selectedItemFacture_mpe.montant_rabais = montant_rabais;
                    vm.selectedItemFacture_mpe.montant_ht = montant_ht;
                    vm.selectedItemFacture_mpe.montant_tva = montant_tva;

                    vm.selectedItemFacture_mpe.montant_ttc = montant_ht + montant_tva;
                    vm.selectedItemFacture_mpe.net_payer = parseInt(montant_ht) + parseInt(montant_tva) - (parseInt(vm.selectedItemFacture_mpe.remboursement_acompte) + 
                    parseInt(vm.selectedItemFacture_mpe.retenue_garantie) + parseInt(vm.selectedItemFacture_mpe.penalite_retard) + parseInt(vm.selectedItemFacture_mpe.remboursement_plaque));
                    majatfacture_mpe(vm.selectedItemFacture_mpe,0);
            }
              //vm.showboutonValider = false;

              demande_mobilier_mpe.$selected = false;
              demande_mobilier_mpe.$edit = false;
              vm.selectedItemDemande_mobilier_mpe = {};
              //vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
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

          if (vm.allcurenttranche_demande_mobilier_mpe[0].code != 'tranche 1')
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
/************************************************fin mobilier_mpe***************************************************/

/**********************************************debut attachement mobilier travauxe***************************************************/
        vm.click_tab_attachement_mobilier_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_travaux/index","menu","getdivers_attachementByDemande",'id_demande_mobilier_mpe',vm.selectedItemDemande_mobilier_mpe.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_travaux= result.data.response;
            });
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_prevu/index","menu","getdivers_attachement_prevuBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_prevu= result.data.response;
            console.log(vm.alldivers_attachement_mobilier_prevu);
            });
        }
        vm.change_attachement_prevu_mobilier = function(item)
        {   
            vm.allmontant_prevu = vm.alldivers_attachement_mobilier_prevu.filter(function(obj)
            {
                return obj.id == item.id_divers_attachement_mobilier_prevu;
            });

            item.montant_prevu = vm.allmontant_prevu[0].montant_prevu;

            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_travaux/index","menu",
                "getmaxattachement_travauxByattachement_prevu",'id_divers_attachement_mobilier_prevu',
                item.id_divers_attachement_mobilier_prevu,'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alllast_attachement_mobilier_travaux= result.data.response;
                if(vm.alllast_attachement_mobilier_travaux.length>0)
                {
                 console.log(vm.alllast_attachement_mobilier_travaux);                
                 item.montant_anterieur = vm.alllast_attachement_mobilier_travaux[0].montant_prevu;
                item.montant_cumul = parseInt(vm.alllast_attachement_mobilier_travaux[0].montant_cumul) + parseInt(item.montant_prevu) ;

                }
                
            });
        }
        vm.change_montant_periode_mobilier = function(item)
        { 
            var cumul=0;
            var pourcentage=0;

            if (NouvelItemDivers_attachement_mobilier_travaux==true)
            {
                if (vm.alllast_attachement_mobilier_travaux>0)
                 {  cumul =parseInt(vm.alllast_attachement_mobilier_travaux[0].montant_cumul) + parseInt(item.montant_prevu) + parseInt(item.montant_periode)  ;
                    
                    pourcentage =((parseInt(vm.alllast_attachement_mobilier_travaux[0].montant_cumul) + parseInt(item.montant_prevu) + parseInt(item.montant_periode)) * 100)/item.montant_prevu;
                    item.montant_cumul=cumul;
                    item.pourcentage = pourcentage.toFixed(3);
                 }
                 else{
                    cumul = parseInt(item.montant_periode)  ;
                    pourcentage = (parseInt(item.montant_periode) * 100)/item.montant_prevu;
                    item.montant_cumul=cumul;
                    item.pourcentage = pourcentage.toFixed(3);
               
                 }
            }else{

                cumul = parseInt(currentItemDivers_attachement_mobilier_travaux.montant_cumul) + parseInt(item.montant_periode) ;
                pourcentage = ((parseInt(currentItemDivers_attachement_mobilier_travaux.montant_cumul) + parseInt(item.montant_periode)) * 100)/item.montant_prevu;
                item.montant_cumul=cumul;
                item.pourcentage = pourcentage.toFixed(3);
            }


        }
        vm.ajouterDivers_attachement_mobilier_travaux = function ()
        {
          var items = {
                $edit: true,
                $selected: true,
                id: '0',
                montant_prevu  : 0 ,
                montant_periode  : 0 ,
                montant_anterieur  : 0 ,
                montant_cumul  : 0 ,
                pourcentage  : 0 ,
                id_divers_attachement_mobilier_prevu : ''
            };

        if (NouvelItemDivers_attachement_mobilier_travaux == false)
          {                      
            vm.alldivers_attachement_mobilier_travaux.push(items);
            vm.alldivers_attachement_mobilier_travaux.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItemDivers_attachement_mobilier_travaux = cis;
              }
            });
            NouvelItemDivers_attachement_mobilier_travaux = true;
          }
          else
          {
              vm.showAlert('Ajout avance démarrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDivers_attachement_mobilier_travaux(divers_attachement_mobilier_travaux,suppression)
        {
            if (NouvelItemDivers_attachement_mobilier_travaux==false)
            {
                test_existanceDivers_attachement_mobilier_travaux (divers_attachement_mobilier_travaux,suppression); 
            } 
            else
            {
                insert_in_baseDivers_attachement_mobilier_travaux(divers_attachement_mobilier_travaux,suppression);
            }
        }

        //fonction de bouton d'annulation divers_attachement_mobilier_travaux
        vm.annulerDivers_attachement_mobilier_travaux = function(item)
        {
          if (NouvelItemDivers_attachement_mobilier_travaux == false)
          {
            item.$edit = false;
            item.$selected = false;                
            item.montant_prevu   = currentItemDivers_attachement_mobilier_travaux.montant_prevu ;
            item.montant_periode   = currentItemDivers_attachement_mobilier_travaux.montant_periode ;
            item.montant_anterieur   = currentItemDivers_attachement_mobilier_travaux.montant_anterieur ;
            item.montant_cumul   = currentItemDivers_attachement_mobilier_travaux.montant_cumul ;
            item.pourcentage   = currentItemDivers_attachement_mobilier_travaux.pourcentage ;
            item.id_divers_attachement_mobilier_prevu   = currentItemDivers_attachement_mobilier_travaux.id_divers_attachement_mobilier_prevu ;
          }else
          {
            vm.alldivers_attachement_mobilier_travaux = vm.alldivers_attachement_mobilier_travaux.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDivers_attachement_mobilier_travaux.id;
            });
          }

          vm.selectedItemDivers_attachement_mobilier_travaux = {} ;
          NouvelItemDivers_attachement_mobilier_travaux      = false;
          
        };

        //fonction selection item justificatif mobilier
        vm.selectionDivers_attachement_mobilier_travaux= function (item)
        {
            vm.selectedItemDivers_attachement_mobilier_travaux = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemDivers_attachement_mobilier_travaux    = JSON.parse(JSON.stringify(vm.selectedItemDivers_attachement_mobilier_travaux));             
            }
            
        };
        $scope.$watch('vm.selectedItemDivers_attachement_mobilier_travaux', function()
        {
             if (!vm.alldivers_attachement_mobilier_travaux) return;
             vm.alldivers_attachement_mobilier_travaux.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDivers_attachement_mobilier_travaux.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDivers_attachement_mobilier_travaux = function(item)
        {
            
            vm.selectedItemDivers_attachement_mobilier_travaux = item;
            currentItemDivers_attachement_mobilier_travaux = angular.copy(vm.selectedItemDivers_attachement_mobilier_travaux);
            $scope.vm.alldivers_attachement_mobilier_travaux.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
              
            NouvelItemDivers_attachement_mobilier_travaux = false ;                
            item.montant_prevu   = vm.selectedItemDivers_attachement_mobilier_travaux.montant_prevu ;
            item.montant_periode   = parseInt(vm.selectedItemDivers_attachement_mobilier_travaux.montant_periode) ;
            item.montant_anterieur   = parseInt(vm.selectedItemDivers_attachement_mobilier_travaux.montant_anterieur) ;
            item.montant_cumul   = parseInt(vm.selectedItemDivers_attachement_mobilier_travaux.montant_cumul );
            item.pourcentage   = parseInt(vm.selectedItemDivers_attachement_mobilier_travaux.pourcentage) ;
            item.id_divers_attachement_mobilier_prevu = vm.selectedItemParticipant_odc.divers_attachement_mobilier_prevu.id;
            
        };

        //fonction bouton suppression item divers_attachement_mobilier_travaux
        vm.supprimerDivers_attachement_mobilier_travaux = function()
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
                vm.ajoutDivers_attachement_mobilier_travaux(vm.selectedItemDivers_attachement_mobilier_travaux,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDivers_attachement_mobilier_travaux (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldivers_attachement_mobilier_travaux.filter(function(obj)
                {
                   return obj.id == currentItemDivers_attachement_mobilier_travaux.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant_prevu != currentItemDivers_attachement_mobilier_travaux.montant_prevu )
                    || (mem[0].montant_periode != currentItemDivers_attachement_mobilier_travaux.montant_periode ))                   
                      { 
                         insert_in_baseDivers_attachement_mobilier_travaux(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDivers_attachement_mobilier_travaux(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd divers_attachement_mobilier_travaux
        function insert_in_baseDivers_attachement_mobilier_travaux(divers_attachement_mobilier_travaux,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDivers_attachement_mobilier_travaux==false)
            {
                getId = vm.selectedItemDivers_attachement_mobilier_travaux.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant_prevu: divers_attachement_mobilier_travaux.montant_prevu,
                    montant_periode: divers_attachement_mobilier_travaux.montant_periode,
                    montant_anterieur: divers_attachement_mobilier_travaux.montant_anterieur,
                    montant_cumul: divers_attachement_mobilier_travaux.montant_cumul,
                    pourcentage: divers_attachement_mobilier_travaux.pourcentage,
                    id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                    id_divers_attachement_mobilier_prevu: divers_attachement_mobilier_travaux.id_divers_attachement_mobilier_prevu            
                });
                console.log(datas);
                //factory
            apiFactory.add("divers_attachement_mobilier_travaux/index",datas, config).success(function (data)
            {

              if (NouvelItemDivers_attachement_mobilier_travaux == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDivers_attachement_mobilier_travaux.$selected  = false;
                        vm.selectedItemDivers_attachement_mobilier_travaux.$edit      = false;
                        vm.selectedItemDivers_attachement_mobilier_travaux ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {                                                
                        vm.alldivers_attachement_mobilier_travaux = vm.alldivers_attachement_mobilier_travaux.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDivers_attachement_mobilier_travaux.id;
                      });                      
                    }
              }
              else
              {
                  divers_attachement_mobilier_travaux.id_divers_attachement_mobilier_travaux  =   String(data.response);              
                  NouvelItemDivers_attachement_mobilier_travaux = false;                    
              }

              divers_attachement_mobilier_travaux.$selected = false;
              divers_attachement_mobilier_travaux.$edit = false;
              vm.selectedItemDivers_attachement_mobilier_travaux ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement mobilier travaux***********************************************/


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
