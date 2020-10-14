
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

        vm.steprubriquebatiment_mpe = false;
        vm.steprubriquelatrine_mpe = false;
        vm.steprubriquemobilier_mpe = false;

        vm.stepjusti_attachement_mpe = false;
        vm.stepdecompte =false;
        vm.session = '';
        vm.ciscos = [];
        vm.affiche_load =false;

/*******************************************Debut maitrise d'oeuvre*************************************/
    
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;
        vm.showbuttonValidationFacture_moe_creer = false;

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
        vm.id_facture_mpe = 0;

        vm.allrubrique_attachement_batiment_mpe=[];
        vm.selectedItemRubrique_attachement_batiment_mpe = {};

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

        vm.allrubrique_attachement_latrine_mpe=[];
        vm.selectedItemRubrique_attachement_latrine_mpe = {};

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

        vm.allrubrique_attachement_mobilier_mpe=[];
        vm.selectedItemRubrique_attachement_mobilier_mpe = {};

        vm.allcurenttranche_demande_mobilier_mpe = [];
        vm.alltranche_demande_mobilier_mpe = [];
        vm.dataLastedemande_mobilier_mpe = [];       

        vm.ajoutDivers_attachement_mobilier_travaux = ajoutDivers_attachement_mobilier_travaux;
        var NouvelItemDivers_attachement_mobilier_travaux=false;
        var currentItemDivers_attachement_mobilier_travaux;
        vm.selectedItemDivers_attachement_mobilier_travaux = {} ;
        vm.alldivers_attachement_mobilier_travaux = [] ;

         vm.ajoutJustificatif_attachement_mpe = ajoutJustificatif_attachement_mpe;
        var NouvelItemJustificatif_attachement_mpe=false;
        var currentItemJustificatif_attachement_mpe;
        vm.selectedItemJustificatif_attachement_mpe = {} ;
        vm.alljustificatif_attachement_mpe = [] ;

/********************************************Fin entreprise********************************************/

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

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

        //recuperation donnée tranche deblocage moe
       /* apiFactory.getAll("tranche_demande_latrine_moe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_moe= result.data.response;
          vm.allcurenttranche_demande_latrine_moe = result.data.response;
          console.log(vm.allcurenttranche_demande_latrine_moe);
        });*/

        //recuperation donnée tranche deblocage moe
       /* apiFactory.getAll("tranche_demande_batiment_moe/index").then(function(result)
        {
          vm.alltranche_demande_batiment_moe= result.data.response;
          vm.allcurenttranche_demande_batiment_moe = result.data.response;
          console.log(vm.allcurenttranche_demande_batiment_moe);
        });*/

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
              vm.affiche_load =true;
              switch (vm.roles[0])
                {
                 case 'BCAF':   
                             vm.usercisco = result.data.response.cisco;
                            vm.ciscos.push(vm.usercisco);
                            console.log(vm.ciscos);
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionBycisco",'id_cisco',vm.usercisco.id).then(function(result)
                            {
                                vm.regions = result.data.response;
                                console.log(vm.regions);
                            }, function error(result){ alert('something went wrong')}); 


                          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionneedfacturevalidationBycisco","id_cisco",vm.usercisco.id).then(function(result)
                          {
                            vm.allconvention_entete = result.data.response;
                            vm.affiche_load =false;
                          }, function error(result){ alert('something went wrong')});                        

                            vm.session = 'BCAF';
                      
                      break;

                  case 'ADMIN': 

                            apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            }, function error(response){ alert('something went wrong')});

                          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionneedfacturevalidation").then(function(result)
                          {
                            vm.allconvention_entete = result.data.response;
                            vm.affiche_load =false;
                          }, function error(result){ alert('something went wrong')});                            
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
                 case 'BCAF':
                            if (vm.usercisco.id!=undefined)
                            {
                                apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu',
                                    'getconventionvalideufpByciscodate','id_cisco',vm.usercisco.id,'date_debut',
                                    date_debut,'date_fin',date_fin).then(function(result)
                                {
                                    vm.allconvention_entete = result.data.response;
                                    vm.affiche_load =false;
                                });
                            }
                      
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
                console.log(filtre);
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

           if(item.id!=0)
           {
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

/***************************************fin justificatif batiment_moe**********************************************/

    /**************************************debut facture moe entete*********************************************/
      vm.click_step_suivi_paiement_moe = function()
      {
        apiFactory.getAPIgeneraliserREST("facture_moe_entete/index","menu","getfacture_moe_enteteinvalideBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
        {
            vm.allfacture_moe_entete = result.data.response;
        });        

        vm.steprubriquecalendrier = false;
        vm.stepsousrubriquecalendrier = false;
        vm.stepjusti_facture_moe = false;
        vm.stepfacture_detail = false;
        vm.showbuttonValidationFacture_moe_creer =false;
      }

        vm.facture_moe_entete_column = [        
        {titre:"Numero"
        },
        {titre:"Date de BR"
        },
        {titre:"Action"
        }];

         //fonction ajout dans bdd
        function ajoutFacture_moe_entete(facture_moe_entete,suppression)
        {
            if (NouvelItemFacture_moe_entete==false)
            {
                test_existanceFacture_moe_entete (facture_moe_entete,suppression); 
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

                vm.steprubriquecalendrier = true;
                vm.stepsousrubriquecalendrier = false;
                vm.stepjusti_facture_moe = true;
                vm.stepfacture_detail = false;
           }

            vm.validation_fact_moe = item.validation;
            vm.showbuttonValidationFacture_moe_creer =true;
           
            //vm.stepjusti_batiment_mpe = true;   
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
            //item.id_contrat_prestataire   = vm.selectedItemAttachement_travaux.contrat_prestataire.id ;
            item.numero   = vm.selectedItemFacture_moe_entete.numero ;
            item.date_br   = new Date(vm.selectedItemFacture_moe_entete.date_br) ;
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
                    || (pass[0].date_br   != currentItemFacture_moe_entete.date_br ))                   
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
                    validation: 0               
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

                    NouvelItemFacture_moe_entete      = true;
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

        vm.validerFacture_moe_creer = function()
        {
          maj_in_baseFacture_moe_entete(vm.selectedItemFacture_moe_entete,0,1);
        }
         //insertion ou mise a jours ou suppression item dans bdd Facture_moe_entete
        function maj_in_baseFacture_moe_entete(facture_moe_entete,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        facture_moe_entete.id,
                    numero: facture_moe_entete.numero,
                    date_br:convertionDate(new Date(facture_moe_entete.date_br)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_moe.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_moe_entete/index",datas, config).success(function (data)
            {
              //vm.showboutonValider = false;
              vm.showbuttonValidationDemande_facture_moe_creer = false;
              facture_moe_entete.validation = validation;
              vm.validation_fact_moe = validation;
              facture_moe_entete.$selected = false;
              facture_moe_entete.$edit = false;
              vm.selectedItemFacture_moe_entete = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

    /**************************************fin facture moe entete*********************************************/

    /**************************************debut facture moe detail*********************************************/

      vm.click_step_rubrique_calendrier_paie_moe = function()
      {
        apiFactory.getAPIgeneraliserREST("divers_rubrique_calendrier_paie_moe/index","menu","getrubrique_calendrier_moewithmontantByentetecontrat",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id,'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
        {
            vm.allrubrique_calendrier_paie_moe = result.data.response;
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
            return total_prevu.toFixed(2);
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
            return total_prevu.toFixed(2);
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
            return ((total_cumulc*100)/total_prevuc).toFixed(2);
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
            return ((total_anterieur*100)/total_prevu).toFixed(2);
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
            return ((total_periode*100)/total_prevu).toFixed(2);
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
            return total_prevu.toFixed(2);
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
            return total_prevu.toFixed(2);
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
            return total_prevu.toFixed(2);
        }

    /**************************************fin facture moe detail*********************************************/
/**************************************debut facture moe detail*********************************************/

      vm.click_step_sousrubrique_calendrier_paie_moe = function()
      {
        apiFactory.getAPIgeneraliserREST("divers_sousrubrique_calendrier_paie_moe/index","menu","getsousrubrique_calendrier_moewithmontantByentetecontrat",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id,'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'id_rubrique',vm.selectedItemRubrique_calendrier_paie_moe.id).then(function(result)
        {
            vm.allsousrubrique_calendrier_paie_moe = result.data.response;
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
        {
            apiFactory.getAPIgeneraliserREST("facture_moe_detail/index","menu","getfacture_moe_detailwithcalendrier_detailbyentete",
                    "id_facture_moe_entete",vm.selectedItemFacture_moe_entete.id,"id_sousrubrique",vm.selectedItemSousrubrique_calendrier_paie_moe.id,
                    "id_contrat_bureau_etude",vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allfacture_moe_detail = result.data.response;
                console.log(vm.allfacture_moe_detail);
            });
        }
        vm.change_montant_periode = function(item)
        { 
            var cumul_montant   =   0;
            var pourcentage_periode =   0;
            var pourcentage_anterieur =   0;
            var pourcentage_cumul =   0;

            pourcentage_periode     =   (parseFloat(item.montant_periode) * 100)/parseFloat(item.montant_prevu);
            item.pourcentage_periode  =   pourcentage_periode.toFixed(3);

            cumul_montant           =   parseFloat(currentItemFacture_moe_detail.montant_cumul)-parseFloat(currentItemFacture_moe_detail.montant_periode) + parseFloat(item.montant_periode) ;
            pourcentage_cumul       =   (parseFloat(cumul_montant) * 100)/parseFloat(item.montant_prevu);
            item.montant_cumul      =   cumul_montant;
            item.pourcentage_cumul  =   pourcentage_cumul.toFixed(3);
            apiFactory.getAPIgeneraliserREST("facture_moe_detail/index",'menu','getmontant_anterieurbycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_moe.id,'code_pai',item.code).then(function(result)
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
                test_existanceFacture_moe_detail (facture_moe_detail,suppression); 
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
            console.log(item);
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
        apiFactory.getAPIgeneraliserREST("justificatif_facture_moe/index",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id).then(function(result)
        {
            vm.alljustificatif_facture_moe = result.data.response;
            console.log(vm.alljustificatif_facture_moe);
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
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_facture_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_facture_moe.fichier);
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
                test_existanceJustificatif_facture_moe (justificatif_facture_moe,suppression); 
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
            currentItemJustificatif_facture_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_facture_moe)); 
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
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_facture_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_facture_moe.id
                                              
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
                                    justificatif_facture_moe.fichier='';
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
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_facture_moe.$selected = false;
                                          justificatif_facture_moe.$edit = false;
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
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
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
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_facture_moe/';
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
                              justificatif_facture_moe.fichier='';
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
                      });
                    }
              }
              justificatif_facture_moe.$selected = false;
              justificatif_facture_moe.$edit = false;
              vm.selectedItemJustificatif_facture_moe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece_facture_moe = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif facture_moe**********************************************/

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
            vm.stepattachement_mpe = false;
            apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavance_demarrageBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavance_demarrage = result.data.response;
                vm.stepattachement_mpe = true;
            });
            vm.styleTabfils = "acc_menu";             
            vm.styleTabfils2 = "acc_sous_menu";
            vm.stepfacture_mpe = false;
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
            item.net_payer   = parseFloat(vm.selectedItemAvance_demarrage.net_payer);
            item.montant_avance   = parseFloat(vm.selectedItemAvance_demarrage.montant_avance) ;
            item.pourcentage_rabais = parseFloat(vm.selectedItemAvance_demarrage.pourcentage_rabais) ;
            item.montant_rabais = parseFloat(vm.selectedItemAvance_demarrage.montant_rabais) ;

            vm.showbuttonValidationAvance_demarrage_creer = false;
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
            vm.styleTabfils2 = "acc_sous_menu";

            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                   vm.facture_mpe = result.data.response[0];
                    if (result.data.response.length>0)
                    {
                        vm.validation_facture_mpe = result.data.response[0].validation;
                        vm.showbuttonNouvFacture_mpe = false; 
                        vm.id_facture_mpe = parseInt(result.data.response[0].id);
                    }else{
                        vm.validation_facture_mpe = 0;
                        vm.showbuttonNouvFacture_mpe = true;
                        vm.id_facture_mpe = 0;
                    }
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
            //var montant_tva = (montant_ht *20)/100;
            var montant_tva = 0;
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
            vm.selectedItemFacture_mpe.net_payer = (parseFloat(facture_mpe.montant_ht) + parseFloat(facture_mpe.montant_tva)) - 
            (parseFloat(facture_mpe.remboursement_acompte )+ parseFloat(facture_mpe.retenue_garantie) + parseFloat(facture_mpe.penalite_retard) + parseFloat(facture_mpe.remboursement_plaque));
            console.log(vm.selectedItemFacture_mpe);
        }

        vm.change_remboursement_plaque_mpe = function(facture_mpe)
        {    
            vm.selectedItemFacture_mpe.net_payer = facture_mpe.montant_ht + facture_mpe.montant_tva - 
            (facture_mpe.remboursement_acompte + facture_mpe.retenue_garantie + facture_mpe.penalite_retard + facture_mpe.remboursement_plaque);
        }
        //fonction ajout dans bdd
        function ajoutFacture_mpe(facture_mpe,suppression)
        {
            if (NouvelItemFacture_mpe==false)
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
            item.net_payer = parseFloat(vm.selectedItemFacture_mpe.net_payer) ;
            console.log(vm.selectedItemFacture_mpe);
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
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(new Date(facture_mpe.date_signature)) ,
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
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
        vm.validerFacture_mpe = function(facture_mpe)
        {
            maj_insertFacture_mpe(facture_mpe,0,1)
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
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
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
              vm.validation_facture_mpe = 1;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/

/************************************************debut attachement*************************************************/
 /************************************************debut attachement*************************************************/
        vm.click_tabs_attachement_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("attachement_travaux/index","menu","getattachement_travauxinvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allattachement_travaux = result.data.response.filter(function(obj)
                {
                    return obj.validation_fact == null || obj.validation_fact == 0;
                });
               /* if (result.data.response.length>0)
                {
                    vm.showbuttonNouvAttachement_travaux = false;
                }*/
                vm.stepbatiment_mpe = false;                
                vm.steplatrine_mpe = false;
                vm.stepmobilier_mpe = false;

                vm.steprubriquebatiment_mpe = false;
                vm.steprubriquelatrine_mpe = false;                
                vm.steprubriquemobilier_mpe = false;

                vm.stepattachement_batiment_travaux = false;
                vm.stepattachement_latrine_travaux = false;
                vm.stepattachement_mobilier_travaux = false;

                vm.stepdecompte =false;
            });
                        
            vm.styleTabfils2 = "acc_menu";
            vm.stepfacture_mpe = false;
            vm.stepjusti_attachement_mpe = false;
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

        //fonction ajout dans bdd
        function ajoutAttachement_travaux(attachement_travaux,suppression)
        {
            if (NouvelItemAttachement_travaux==false)
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
          if (NouvelItemAttachement_travaux == false)
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
          NouvelItemAttachement_travaux      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionAttachement_travaux= function (item)
        {
            vm.selectedItemAttachement_travaux = item;
           // vm.NouvelItemAttachement_travaux   = item;
           if (item.$edit==false || item.$edit==undefined)
           {
                currentItemAttachement_travaux    = JSON.parse(JSON.stringify(vm.selectedItemAttachement_travaux));

                apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
                {
                   vm.allfacture_mpe = result.data.response;
                   /* vm.allfacture_mpe = result.data.response.filter(function(obj)
                    {
                        return obj.validation == 0;
                    });*/
                    if (vm.allfacture_mpe.length>0)
                    {
                        vm.validation_facture_mpe = vm.allfacture_mpe[0].validation;
                        vm.showbuttonNouvFacture_mpe = false;
                        vm.id_facture_mpe = parseInt(vm.allfacture_mpe[0].id) 
                    }else{
                        vm.validation_facture_mpe = 0;
                        vm.showbuttonNouvFacture_mpe = true;
                        vm.id_facture_mpe = 0;
                    }
                });

                vm.stepdecompte =true;
                apiFactory.getAPIgeneraliserREST("justificatif_attachement_mpe/index",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
                {
                    vm.alljustificatif_attachement_mpe = result.data.response;
                });

                vm.stepbatiment_mpe = true;
                vm.steplatrine_mpe = true;
                vm.stepmobilier_mpe = true;
                vm.stepfacture_mpe = true;
                vm.stepjusti_attachement_mpe = true;
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
            NouvelItemAttachement_travaux = false ;
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
            item.total_periode = vm.selectedItemAttachement_travaux.total_periode ;
        };

        //fonction bouton suppression item Demande_batiment_mpe
        vm.supprimerAttachement_travaux = function()
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
            if (NouvelItemAttachement_travaux==false)
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
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("attachement_travaux/index",datas, config).success(function (data)
            {

                if (NouvelItemAttachement_travaux == false)
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

                    NouvelItemAttachement_travaux      = true;
                    }
                    
                }
                else
                {                  
                  attachement_travaux.id  =   String(data.response);

                NouvelItemAttachement_travaux      = false;
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
            vm.showbuttonNouvDemande_batiment_mpe_creer = true;
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_batiment_mpe = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                }
            });

            vm.steprubriquebatiment_mpe = false;
            vm.steprubriquelatrine_mpe = false;                
            vm.steprubriquemobilier_mpe = false;

            vm.stepattachement_batiment_travaux = false;
            vm.stepattachement_latrine_travaux = false;
            vm.stepattachement_mobilier_travaux = false;
        }
        vm.demande_batiment_mpe_column = [
        {titre:"Tranche"
        },
        {titre:"Période"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Condition de paiement"
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

        if (NouvelItemDemande_batiment_mpe == false)
          {  
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {             
                var last_id_demande_batiment_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLastedemande_batiment_mpe = result.data.response.filter(function(obj){return obj.id == last_id_demande_batiment_mpe;});

                if (vm.dataLastedemande_batiment_mpe.length>0)
                {   
                    var last_tranche_demande_batiment_mpe = Math.max.apply(Math, vm.dataLastedemande_batiment_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    vm.allcurenttranche_demande_batiment_mpe = vm.alltranche_demande_batiment_mpe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_batiment_mpe)+1);});
                    vm.alldemande_batiment_mpe.push(items);                          
                    vm.selectedItemDemande_batiment_mpe = items;
                    NouvelItemDemande_batiment_mpe = true ;
                }
                else
                {
                    vm.allcurenttranche_demande_batiment_mpe = vm.alltranche_demande_batiment_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_batiment_mpe.push(items);                          
                    vm.selectedItemDemande_batiment_mpe = items;
                    NouvelItemDemande_batiment_mpe = true ;
                    vm.dataLastedemande_batiment_mpe = [];
                }
            });             
              
          }else
          {
              vm.showAlert('Ajout Attachement total batiment','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_batiment_mpe(demande_batiment_mpe,suppression)
        {
            if (NouvelItemDemande_batiment_mpe==false)
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
          if (NouvelItemDemande_batiment_mpe == false)
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
          NouvelItemDemande_batiment_mpe_      = false;
          
        };

        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           // vm.NouvelItemDemande_batiment_mpe   = item;
            currentItemDemande_batiment_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_mpe));
           if(item.$edit==false || item.$edit==undefined)
           {
                vm.steprubriquebatiment_mpe = true;          

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
            item.cumul = parseFloat(vm.selectedItemDemande_batiment_mpe.cumul) ;
            item.anterieur = parseFloat(vm.selectedItemDemande_batiment_mpe.anterieur) ;
            item.periode = parseFloat(vm.selectedItemDemande_batiment_mpe.tranche.periode) ;
            item.pourcentage = parseFloat(vm.selectedItemDemande_batiment_mpe.tranche.pourcentage) ;
            item.reste = parseFloat(vm.selectedItemDemande_batiment_mpe.reste );
            vm.showbuttonValidationDemande_batiment_mpe_creer = false;
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
            if (NouvelItemDemande_batiment_mpe==false)
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
                      vm.showbuttonNouvDemande_batiment_mpe_creer = true;

                            console.log('supp');
                      if (vm.allfacture_mpe.length>0)
                      {
                            var montant_trav = parseFloat(vm.allfacture_mpe[0].montant_travaux) - parseFloat(demande_batiment_mpe.montant);
                            var montant_rabais = (montant_trav * vm.allfacture_mpe[0].pourcentage_rabais)/100;
                            var montant_ht = parseFloat(montant_rabais) + parseFloat(montant_trav);
                            var montant_tva = 0;

                            var montant_ttc = montant_ht + montant_tva;
                            var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                            var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(vm.allfacture_mpe[0].remboursement_acompte) + 
                            parseFloat(retenu_garanti) + parseFloat(vm.allfacture_mpe[0].penalite_retard) + parseFloat(vm.allfacture_mpe[0].remboursement_plaque));
                            var item_facture_mpe = {
                                      id: vm.allfacture_mpe[0].id,        
                                      id_attachement: vm.allfacture_mpe[0].id_attachement_travaux,        
                                      numero: vm.selectedItemAttachement_travaux.numero,
                                      montant_travaux: montant_trav,
                                      pourcentage_rabais: vm.allfacture_mpe[0].pourcentage_rabais,
                                      montant_rabais: montant_rabais,
                                      montant_ht: montant_ht,
                                      montant_tva: montant_tva,   
                                      montant_ttc: montant_ttc, 
                                      remboursement_acompte: vm.allfacture_mpe[0].remboursement_acompte,   
                                      penalite_retard: vm.allfacture_mpe[0].penalite_retard, 
                                      retenue_garantie: retenu_garanti, 
                                      remboursement_plaque: vm.allfacture_mpe[0].remboursement_plaque,    
                                      net_payer: net_payer,  
                                      date_signature: vm.allfacture_mpe[0].date_signature
                                    };
                            console.log(item_facture_mpe);
                            majatfacture_mpe(item_facture_mpe,0);
                      }

                  vm.selectedItemAttachement_travaux.total_cumul =parseFloat(vm.selectedItemAttachement_travaux.total_cumul) - parseFloat(demande_batiment_mpe.montant);
                  vm.selectedItemAttachement_travaux.total_periode =parseFloat(vm.selectedItemAttachement_travaux.total_periode) - parseFloat(demande_batiment_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux); 
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0); 
                    }
                    
                }
                else
                {
                  demande_batiment_mpe.tranche = tran[0] ;
                  demande_batiment_mpe.periode = tran[0].periode ;
                  demande_batiment_mpe.pourcentage = tran[0].pourcentage ;
                  demande_batiment_mpe.id  =   String(data.response);
                  vm.showbuttonNouvDemande_batiment_mpe_creer = false;
                  NouvelItemDemande_batiment_mpe= false;
                  vm.selectedItemAttachement_travaux.total_cumul =parseFloat(vm.selectedItemAttachement_travaux.total_cumul) + parseFloat(demande_batiment_mpe.montant);
                  vm.selectedItemAttachement_travaux.total_periode =parseFloat(vm.selectedItemAttachement_travaux.total_periode) + parseFloat(demande_batiment_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux);
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0); 

                  if (vm.allfacture_mpe.length>0)
                  {
                        var montant_trav = parseFloat(vm.allfacture_mpe[0].montant_travaux) + parseFloat(demande_batiment_mpe.montant);
                        var montant_rabais = (montant_trav * vm.allfacture_mpe[0].pourcentage_rabais)/100;
                        var montant_ht = parseFloat(montant_rabais) + parseFloat(montant_trav);
                        var montant_tva = 0;

                        var montant_ttc = montant_ht + montant_tva;
                        var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                        var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(vm.allfacture_mpe[0].remboursement_acompte) + 
                        parseFloat(retenu_garanti) + parseFloat(vm.allfacture_mpe[0].penalite_retard) + parseFloat(vm.allfacture_mpe[0].remboursement_plaque));
                        var item_facture_mpe = {
                                  id: vm.allfacture_mpe[0].id,        
                                  id_attachement: vm.allfacture_mpe[0].id_attachement_travaux,        
                                  numero: vm.selectedItemAttachement_travaux.numero,
                                  montant_travaux: montant_trav,
                                  pourcentage_rabais: vm.allfacture_mpe[0].pourcentage_rabais,
                                  montant_rabais: montant_rabais,
                                  montant_ht: montant_ht,
                                  montant_tva: montant_tva,   
                                  montant_ttc: montant_ttc, 
                                  remboursement_acompte: vm.allfacture_mpe[0].remboursement_acompte,   
                                  penalite_retard: vm.allfacture_mpe[0].penalite_retard, 
                                  retenue_garantie: retenu_garanti, 
                                  remboursement_plaque: vm.allfacture_mpe[0].remboursement_plaque,    
                                  net_payer: net_payer,  
                                  date_signature: vm.allfacture_mpe[0].date_signature
                                };
                        majatfacture_mpe(item_facture_mpe,0);
                  }
                  else
                  {     

                        //montant_rabais 0 satri pourcentage 0 initial
                        //penalite retard 0 initial
                        var montant_trav = parseFloat(demande_batiment_mpe.montant);
                        var montant_ht = parseFloat(montant_trav);
                        var montant_tva = 0;

                        var montant_ttc = montant_ht + montant_tva;
                        var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                        var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - parseFloat(retenu_garanti);
                        var item_facture_mpe = {
                                  id: 0,        
                                  id_attachement: vm.selectedItemAttachement_travaux.id,        
                                  numero: vm.selectedItemAttachement_travaux.numero,
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
                                  net_payer: net_payer,  
                                  date_signature: convertionDate(vm.datenow)
                                };
                        majatfacture_mpe(item_facture_mpe,0);
                  }

                  
            }
              //vm.showboutonValider = false;

              demande_batiment_mpe.$selected = false;
              demande_batiment_mpe.$edit = false;
              vm.selectedItemDemande_batiment_mpe = {};
              //vm.showbuttonNouvDemande_batiment_mpe_creer = false;
            vm.showbuttonValidationDemande_batiment_mpe_creer = false;
            vm.steprubriquebatiment_mpe = false;
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
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
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
                    net_payer: facture_mpe.net_payer,
                    date_signature:convertionDate(new Date(facture_mpe.date_signature)) ,
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {
                console.log('vita facture');
                if(parseInt(facture_mpe.id) == 0)
                {
                   vm.allfacture_mpe[0]={
                                        id:       String(data.response),
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
                                        id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                                        validation: 0               
                                    }; 
                }
                else
                {
                    vm.allfacture_mpe[0]={
                                        id:       facture_mpe.id,
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
                                        id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                                        validation: 0               
                                    }; 
                }
                
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_batiment_mpe = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;

          var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_batiment) * vm.allcurenttranche_demande_batiment_mpe[0].pourcentage)/100;
          var montant = montant_ttc/1;
          var cumul = montant;

          var demande_ancien = vm.alldemande_batiment_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (vm.allcurenttranche_demande_batiment_mpe[0].code != 'tranche 1')
          {                 
              anterieur = vm.dataLastedemande_batiment_mpe[0].montant;           
              cumul = montant + parseFloat(vm.dataLastedemande_batiment_mpe[0].cumul);
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
/************************************************Debut rubrique attachement batiment_mpe***************************************************/
       
        vm.rubrique_attachement_batiment_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        },
        {titre:"Montant période"
        },
        {titre:"Montant anterieur"
        },
        {titre:"Montant cumul"
        },
        {titre:"Pourcentage période"
        },
        {titre:"Pourcentage anterieur"
        },
        {titre:"Pourcentage cumul"
        }];

        vm.click_rubrique_attachement_batiment_mpe = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index","menu","getrubrique_attachement_withmontantbycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_demande_batiment_mpe",vm.selectedItemDemande_batiment_mpe.id).then(function(result)
            {   
                vm.allrubrique_attachement_batiment_mpe= result.data.response;
                vm.stepattachement_batiment_travaux = false;

                console.log(vm.allrubrique_attachement_batiment_mpe);
            });
        }
 //fonction selection item rubrique attachement batiment mpe
        vm.selectionRubrique_attachement_batiment_mpe= function (item)
        {
            vm.selectedItemRubrique_attachement_batiment_mpe = item;
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_prevu/index","menu","getattachement_batimentprevubyrubrique",
            "id_attachement_batiment",vm.selectedItemRubrique_attachement_batiment_mpe.id,"id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                    vm.alldivers_attachement_batiment_prevus = result.data.response;
                    vm.alldivers_attachement_batiment_prevu = result.data.response;
                    console.log(vm.alldivers_attachement_batiment_prevu)
            });
            vm.stepattachement_batiment_travaux = true;
            
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

        vm.Total_prevu = function(){
            var total_prevu = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
            return total_prevu;
        }

        vm.Total_periode = function(){
            var total_periode = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_periode += parseFloat(product.montant_periode);
                }
            }
            return total_periode;
        }

        vm.Total_anterieur = function(){
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
                }
            }
            return total_anterieur;
        }

        vm.Total_cumul = function(){
            var total_cumul = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_cumul += parseFloat(product.montant_cumul);
                }
            }
            return total_cumul;
        }


        vm.Periode_pourcentage_mpe = function(){
            var periode_pourcentage = 0;
            var total_prevu = 0;
            var total_periode = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_periode += parseFloat(product.montant_periode);
                    
                }
                periode_pourcentage = (total_periode*100)/ total_prevu;
            }

            return periode_pourcentage.toFixed(2);
        }

        vm.Anterieur_pourcentage_mpe = function(){
            var anterieur_pourcentage = 0;
            var total_prevu = 0;
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_anterieur += parseFloat(product.montant_anterieur);
                    
                }
                anterieur_pourcentage = (total_anterieur*100)/ total_prevu;
            }

            return anterieur_pourcentage.toFixed(2);
        }

        vm.Total_pourcentage = function(){
            var total_pourcentage = 0;
            var total_prevu = 0;
            var total_cumul = 0;
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_cumul += parseFloat(product.montant_cumul);
                    
                }
                total_pourcentage = (total_cumul*100)/ total_prevu;
            }

            return total_pourcentage.toFixed(2);
        }
/************************************************fin rubrique attachement batiment_mpe***************************************************/
        
/**********************************************debut attachement batiment travauxe***************************************************/
        vm.click_tab_attachement_batiment_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_travaux/index","menu","getattachement_batimenttravauxbydemande",
                    "id_demande_batiment_mpe",vm.selectedItemDemande_batiment_mpe.id,"id_attachement_batiment",vm.selectedItemRubrique_attachement_batiment_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_travaux = result.data.response;
                console.log(vm.alldivers_attachement_batiment_travaux);
            });
        }
        vm.change_quantite_periode_batiment = function(item)
        { 
            var cumul_quatite   =   0;
            var cumul_montant   =   0;
            var pourcentage_periode =   0;
            var pourcentage_anterieur =   0;
            var pourcentage_cumul =   0;
            var montant_current =   parseFloat(item.quantite_periode)* parseFloat(item.prix_unitaire);

            cumul_quatite           =   parseFloat(currentItemDivers_attachement_batiment_travaux.quantite_cumul)-parseFloat(currentItemDivers_attachement_batiment_travaux.quantite_periode) + parseFloat(item.quantite_periode) ;
            item.quantite_cumul     =   cumul_quatite;

            item.montant_periode    =   montant_current;
            pourcentage_periode     =   (parseFloat(montant_current) * 100)/item.montant_prevu;
            item.pourcentage_periode  =   pourcentage_periode.toFixed(3);

            cumul_montant           =   parseFloat(currentItemDivers_attachement_batiment_travaux.montant_cumul)-parseFloat(currentItemDivers_attachement_batiment_travaux.montant_periode) + parseFloat(montant_current) ;
            pourcentage_cumul       =   (parseFloat(cumul_montant) * 100)/item.montant_prevu;
            item.montant_cumul      =   cumul_montant;
            item.pourcentage_cumul  =   pourcentage_cumul.toFixed(3);
            
            if (item.quantite_prevu<item.quantite_cumul)
            {
                item.quantite_periode = 0;
                vm.showAlert('Ajout detail attachement','La quantité que vous avez entré est supérieure à la quantité prévue');
            }

        }
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

            item.quantite_periode   = currentItemDivers_attachement_batiment_travaux.quantite_periode ;
            item.quantite_cumul     = currentItemDivers_attachement_batiment_travaux.quantite_cumul ;
            item.montant_periode    = currentItemDivers_attachement_batiment_travaux.montant_periode ;
            item.pourcentage_periode = currentItemDivers_attachement_batiment_travaux.pourcentage_periode ;
            item.montant_cumul      = currentItemDivers_attachement_batiment_travaux.montant_cumul ;
            item.pourcentage_cumul  = currentItemDivers_attachement_batiment_travaux.pourcentage_cumul ;
            item.id_attachement_batiment_prevu   = currentItemDivers_attachement_batiment_travaux.id_attachement_batiment_prevu ;
          }else
          { 
            item.$edit = false;
            item.$selected = false;
            item.quantite_periode   = 0;
            item.quantite_cumul     = currentItemDivers_attachement_batiment_travaux.quantite_cumul ;
            item.montant_periode    = 0 ;
            item.pourcentage_periode = 0;
            item.montant_cumul      = currentItemDivers_attachement_batiment_travaux.montant_cumul ;
            item.pourcentage_cumul  = currentItemDivers_attachement_batiment_travaux.pourcentage_cumul ;
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
            console.log(item);
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
            
            item.quantite_periode   = parseFloat(item.quantite_periode) ;
            if (item.id==0)
            {   
                NouvelItemDivers_attachement_batiment_travaux = true ;
            }
            else
            {   
                NouvelItemDivers_attachement_batiment_travaux = false ;
            }
            
        };

        //fonction bouton suppression item divers_attachement_batiment_travaux
        vm.supprimerDivers_attachement_batiment_travaux = function()
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
                   if((mem[0].quantite_periode != currentItemDivers_attachement_batiment_travaux.quantite_periode ))                   
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
                    quantite_periode: divers_attachement_batiment_travaux.quantite_periode,
                    montant_periode: divers_attachement_batiment_travaux.montant_periode,
                    id_demande_batiment_mpe: vm.selectedItemDemande_batiment_mpe.id,
                    id_attachement_batiment_prevu: divers_attachement_batiment_travaux.id_attachement_batiment_prevu            
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
                        //vm.selectedItemDivers_attachement_batiment_travaux.attachement_batiment_prevu  = bat_prevu[0];
                        vm.selectedItemDivers_attachement_batiment_travaux.$selected  = false;
                        vm.selectedItemDivers_attachement_batiment_travaux.$edit      = false;
                        vm.selectedItemDivers_attachement_batiment_travaux ={};
                        vm.showbuttonValidation = false;
                        console.log('mandalo1');
                    }
                    else 
                    { 
                        console.log(divers_attachement_batiment_travaux.quantite_cumul);
                        console.log(divers_attachement_batiment_travaux.quantite_periode);
                        console.log(parseFloat(divers_attachement_batiment_travaux.quantite_cumul) - parseFloat(divers_attachement_batiment_travaux.quantite_periode));
                        var quantite_cumul = parseFloat(divers_attachement_batiment_travaux.quantite_cumul) - parseFloat(divers_attachement_batiment_travaux.quantite_periode);
                        var montant_cumul = parseFloat(divers_attachement_batiment_travaux.montant_cumul) - parseFloat(divers_attachement_batiment_travaux.montant_periode);
                        var pourcentage_cumul = (montant_cumul*100)/parseFloat(divers_attachement_batiment_travaux.montant_prevu);
                        vm.selectedItemDivers_attachement_batiment_travaux.quantite_periode   = 0 ;
                        vm.selectedItemDivers_attachement_batiment_travaux.quantite_cumul     = quantite_cumul;
                        vm.selectedItemDivers_attachement_batiment_travaux.montant_periode    = 0 ;
                        vm.selectedItemDivers_attachement_batiment_travaux.pourcentage_periode = 0 ;
                        vm.selectedItemDivers_attachement_batiment_travaux.montant_cumul      = montant_cumul;
                        vm.selectedItemDivers_attachement_batiment_travaux.pourcentage_cumul  = pourcentage_cumul;
                        vm.selectedItemDivers_attachement_batiment_travaux.id   = 0 ;                     
                    }
              }
              else
              {
                  divers_attachement_batiment_travaux.id  =   String(data.response); 
                  //divers_attachement_batiment_travaux.attachement_batiment_prevu  = bat_prevu[0];             
                  NouvelItemDivers_attachement_batiment_travaux = false;                    
              } 
              divers_attachement_batiment_travaux.$selected = false;
              divers_attachement_batiment_travaux.$edit = false;
              console.log(vm.selectedItemDivers_attachement_batiment_travaux);
              vm.selectedItemDivers_attachement_batiment_travaux ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement batiment travaux***********************************************/


/************************************************debut latrine_mpe*************************************************/
    vm.click_tab_tranche_latrine = function()
        {   
            vm.showbuttonNouvDemande_latrine_mpe_creer = true;
            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_latrine_mpe = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                }
            });
            
            vm.steprubriquebatiment_mpe = false;
            vm.stepattachement_batiment_travaux = false;
        }
        vm.demande_latrine_mpe_column = [
        {titre:"Tranche"
        },
        {titre:"Période"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Condition de paiement"
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

        if (NouvelItemDemande_latrine_mpe == false)
          {  
            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {             
                var last_id_demande_latrine_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLastedemande_latrine_mpe = result.data.response.filter(function(obj){return obj.id == last_id_demande_latrine_mpe;});

                if (vm.dataLastedemande_latrine_mpe.length>0)
                {   
                    var last_tranche_demande_latrine_mpe = Math.max.apply(Math, vm.dataLastedemande_latrine_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_latrine_mpe)+1);});
                    vm.alldemande_latrine_mpe.push(items);                          
                    vm.selectedItemDemande_latrine_mpe = items;
                    NouvelItemDemande_latrine_mpe = true ;
                }
                else
                {
                    vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_latrine_mpe.push(items);                          
                    vm.selectedItemDemande_latrine_mpe = items;
                    NouvelItemDemande_latrine_mpe = true ;
                    vm.dataLastedemande_latrine_mpe = [];
                }
            });             
              
          }else
          {
              vm.showAlert('Ajout Attachement total latrine','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_latrine_mpe(demande_latrine_mpe,suppression)
        {
            if (NouvelItemDemande_latrine_mpe==false)
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
          if (NouvelItemDemande_latrine_mpe == false)
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
          NouvelItemDemande_latrine_mpe      = false;
          
        };

        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item;
           // vm.NouvelItemDemande_latrine_mpe   = item;
            currentItemDemande_latrine_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_mpe));
           if(item.$edit==false || item.$edit==undefined)
           {                
                vm.steprubriquelatrine_mpe = true;
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
            item.cumul = parseFloat(vm.selectedItemDemande_latrine_mpe.cumul) ;
            item.anterieur = parseFloat(vm.selectedItemDemande_latrine_mpe.anterieur) ;
            item.periode = parseFloat(vm.selectedItemDemande_latrine_mpe.tranche.periode) ;
            item.pourcentage = vm.selectedItemDemande_latrine_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_latrine_mpe.reste ;
            vm.showbuttonValidationDemande_latrine_mpe_creer = false;
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
            if (NouvelItemDemande_latrine_mpe==false)
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
                      vm.showbuttonNouvDemande_latrine_mpe_creer = true;
                      if (vm.allfacture_mpe.length>0)
                      {
                        console.log('suulat'); 
                            var montant_trav = parseFloat(vm.allfacture_mpe[0].montant_travaux) - parseFloat(demande_latrine_mpe.montant);
                            var montant_rabais = (montant_trav * vm.allfacture_mpe[0].pourcentage_rabais)/100;
                            var montant_ht = parseFloat(montant_rabais) + parseFloat(montant_trav);
                            var montant_tva = 0;

                            var montant_ttc = montant_ht + montant_tva;
                            var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                            var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(vm.allfacture_mpe[0].remboursement_acompte) + 
                            parseFloat(retenu_garanti) + parseFloat(vm.allfacture_mpe[0].penalite_retard) + parseFloat(vm.allfacture_mpe[0].remboursement_plaque));
                            var item_facture_mpe = {
                                      id: vm.allfacture_mpe[0].id,        
                                      id_attachement: vm.allfacture_mpe[0].id_attachement_travaux,        
                                      numero: vm.selectedItemAttachement_travaux.numero,
                                      montant_travaux: montant_trav,
                                      pourcentage_rabais: vm.allfacture_mpe[0].pourcentage_rabais,
                                      montant_rabais: montant_rabais,
                                      montant_ht: montant_ht,
                                      montant_tva: montant_tva,   
                                      montant_ttc: montant_ttc, 
                                      remboursement_acompte: vm.allfacture_mpe[0].remboursement_acompte,   
                                      penalite_retard: vm.allfacture_mpe[0].penalite_retard, 
                                      retenue_garantie: retenu_garanti, 
                                      remboursement_plaque: vm.allfacture_mpe[0].remboursement_plaque,    
                                      net_payer: net_payer,  
                                      date_signature: vm.allfacture_mpe[0].date_signature
                                    };
                        console.log(item_facture_mpe); 
                            majatfacture_mpe(item_facture_mpe,0);
                      }



                  vm.selectedItemAttachement_travaux.total_cumul =parseFloat(vm.selectedItemAttachement_travaux.total_cumul) - parseFloat(demande_latrine_mpe.montant);
                  vm.selectedItemAttachement_travaux.total_periode =parseFloat(vm.selectedItemAttachement_travaux.total_periode) - parseFloat(demande_latrine_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux); 
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0);
                    }
                    
                }
                else
                {
                  demande_latrine_mpe.tranche = tran[0] ;
                  demande_latrine_mpe.periode = tran[0].periode ;
                  demande_latrine_mpe.pourcentage = tran[0].pourcentage ;
                  demande_latrine_mpe.id  =   String(data.response);
                  vm.showbuttonNouvDemande_latrine_mpe_creer = false;
                  NouvelItemDemande_latrine_mpe= false;
                  vm.selectedItemAttachement_travaux.total_cumul =parseFloat(vm.selectedItemAttachement_travaux.total_cumul) + parseFloat(demande_latrine_mpe.cumul);
                  //vm.selectedItemAttachement_travaux.total_anterieur =parseFloat(vm.selectedItemAttachement_travaux.total_anterieur) + parseFloat(demande_latrine_mpe.anterieur);                  
                  vm.selectedItemAttachement_travaux.total_periode =parseFloat(vm.selectedItemAttachement_travaux.total_periode) + parseFloat(demande_latrine_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux);
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0); 
                 
                  if (vm.allfacture_mpe.length>0)
                  {
                        var montant_trav = parseFloat(vm.allfacture_mpe[0].montant_travaux) + parseFloat(demande_latrine_mpe.montant);
                        var montant_rabais = (montant_trav * vm.allfacture_mpe[0].pourcentage_rabais)/100;
                        var montant_ht = parseFloat(montant_rabais) + parseFloat(montant_trav);
                        var montant_tva = 0;

                        var montant_ttc = montant_ht + montant_tva;
                        var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                        var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(vm.allfacture_mpe[0].remboursement_acompte) + 
                        parseFloat(retenu_garanti) + parseFloat(vm.allfacture_mpe[0].penalite_retard) + parseFloat(vm.allfacture_mpe[0].remboursement_plaque));
                        var item_facture_mpe = {
                                  id: vm.allfacture_mpe[0].id,        
                                  id_attachement: vm.allfacture_mpe[0].id_attachement_travaux,        
                                  numero: vm.selectedItemAttachement_travaux.numero,
                                  montant_travaux: montant_trav,
                                  pourcentage_rabais: vm.allfacture_mpe[0].pourcentage_rabais,
                                  montant_rabais: montant_rabais,
                                  montant_ht: montant_ht,
                                  montant_tva: montant_tva,   
                                  montant_ttc: montant_ttc, 
                                  remboursement_acompte: vm.allfacture_mpe[0].remboursement_acompte,   
                                  penalite_retard: vm.allfacture_mpe[0].penalite_retard, 
                                  retenue_garantie: retenu_garanti, 
                                  remboursement_plaque: vm.allfacture_mpe[0].remboursement_plaque,    
                                  net_payer: net_payer,  
                                  date_signature: vm.allfacture_mpe[0].date_signature
                                };
                        majatfacture_mpe(item_facture_mpe,0);
                  }
                  else
                  {     
                        //montant_rabais 0 satri pourcentage 0 initial
                        //penalite retard 0 initial
                        var montant_trav = parseFloat(demande_latrine_mpe.montant);
                        var montant_ht = parseFloat(montant_trav);
                        var montant_tva = 0;

                        var montant_ttc = montant_ht + montant_tva;
                        var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                        var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - parseFloat(retenu_garanti);
                        var item_facture_mpe = {
                                  id: 0,        
                                  id_attachement: vm.selectedItemAttachement_travaux.id,        
                                  numero: vm.selectedItemAttachement_travaux.numero,
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
                                  net_payer: net_payer,  
                                  date_signature: convertionDate(vm.datenow)
                                };
                        majatfacture_mpe(item_facture_mpe,0);
                  }

                  
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

          var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_latrine) * vm.allcurenttranche_demande_latrine_mpe[0].pourcentage)/100;
          var montant = montant_ttc/1;
          var cumul = montant;

          var demande_ancien = vm.alldemande_latrine_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (vm.allcurenttranche_demande_latrine_mpe[0].code != 'tranche 1')
          {                 
              anterieur = vm.dataLastedemande_latrine_mpe[0].montant;           
              cumul = montant + parseFloat(vm.dataLastedemande_latrine_mpe[0].cumul);
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

/************************************************Debut rubrique attachement latrine_mpe***************************************************/
       
        vm.rubrique_attachement_latrine_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        },
        {titre:"Montant période"
        },
        {titre:"Montant anterieur"
        },
        {titre:"Montant cumul"
        },
        {titre:"Pourcentage période"
        },
        {titre:"Pourcentage anterieur"
        },
        {titre:"Pourcentage cumul"
        }];

        vm.click_rubrique_attachement_latrine_mpe = function()
        {console.log(vm.selectedItemContrat_prestataire.id);
            console.log(vm.selectedItemDemande_latrine_mpe.id);
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine/index","menu","getrubrique_attachement_withmontantbycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_demande_latrine_mpe",vm.selectedItemDemande_latrine_mpe.id).then(function(result)
            {   
                vm.allrubrique_attachement_latrine_mpe= result.data.response;
                console.log(vm.allrubrique_attachement_latrine_mpe);
                vm.stepattachement_latrine_travaux = false;
            });
        }
 //fonction selection item rubrique attachement latrine mpe
        vm.selectionRubrique_attachement_latrine_mpe= function (item)
        {
            vm.selectedItemRubrique_attachement_latrine_mpe = item;
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_prevu/index","menu","getattachement_latrineprevubyrubrique",
            "id_attachement_latrine",vm.selectedItemRubrique_attachement_latrine_mpe.id,"id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                    vm.alldivers_attachement_latrine_prevus = result.data.response;
                    vm.alldivers_attachement_latrine_prevu = result.data.response;
                    console.log(vm.alldivers_attachement_latrine_prevu)
            });
            vm.stepattachement_latrine_travaux = true;
            
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

        vm.Total_prevu_latrine_mpe = function(){
            var total_prevu = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
            return total_prevu;
        }

        vm.Total_periode_latrine_mpe = function(){
            var total_periode = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_periode += parseFloat(product.montant_periode);
                }
            }
            return total_periode;
        }

        vm.Total_anterieur_latrine_mpe = function(){
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
                }
            }
            return total_anterieur;
        }

        vm.Total_cumul_latrine_mpe = function(){
            var total_cumul = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_cumul += parseFloat(product.montant_cumul);
                }
            }
            return total_cumul;
        }

        vm.Periode_pourcentage_latrine_mpe = function(){
            var periode_pourcentage = 0;
            var total_prevu = 0;
            var total_periode = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_periode += parseFloat(product.montant_periode);
                    
                }
                periode_pourcentage = (total_periode*100)/ total_prevu;
            }

            return periode_pourcentage.toFixed(2);
        }

        vm.Anterieur_pourcentage_latrine_mpe = function(){
            var anterieur_pourcentage = 0;
            var total_prevu = 0;
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_anterieur += parseFloat(product.montant_anterieur);
                    
                }
                anterieur_pourcentage = (total_anterieur*100)/ total_prevu;
            }

            return anterieur_pourcentage.toFixed(2);
        }

        vm.Total_pourcentage_latrine_mpe = function(){
            var total_pourcentage = 0;
            var total_prevu = 0;
            var total_cumul = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_cumul += parseFloat(product.montant_cumul);
                    
                }
                total_pourcentage = (total_cumul*100)/ total_prevu;
            }

            return total_pourcentage.toFixed(2);
        }
/************************************************fin rubrique attachement latrine_mpe***************************************************/


/**********************************************debut attachement latrine travauxe***************************************************/
       vm.click_tab_attachement_latrine_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_travaux/index","menu","getattachement_latrinetravauxbydemande",
                    "id_demande_latrine_mpe",vm.selectedItemDemande_latrine_mpe.id,"id_attachement_latrine",vm.selectedItemRubrique_attachement_latrine_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_travaux = result.data.response;
                console.log(vm.alldivers_attachement_latrine_travaux);
            });
        }
        vm.change_quantite_periode_latrine = function(item)
        { 
            var cumul_quatite   =   0;
            var cumul_montant   =   0;
            var pourcentage_periode =   0;
            var pourcentage_anterieur =   0;
            var pourcentage_cumul =   0;
            var montant_current =   parseFloat(item.quantite_periode)* parseFloat(item.prix_unitaire);

            cumul_quatite           =   parseFloat(currentItemDivers_attachement_latrine_travaux.quantite_cumul)-parseFloat(currentItemDivers_attachement_latrine_travaux.quantite_periode) + parseFloat(item.quantite_periode) ;
            item.quantite_cumul     =   cumul_quatite;

            item.montant_periode    =   montant_current;
            pourcentage_periode     =   (parseFloat(montant_current) * 100)/item.montant_prevu;
            item.pourcentage_periode  =   pourcentage_periode.toFixed(3);

            cumul_montant           =   parseFloat(currentItemDivers_attachement_latrine_travaux.montant_cumul)-parseFloat(currentItemDivers_attachement_latrine_travaux.montant_periode) + parseFloat(montant_current) ;
            pourcentage_cumul       =   (parseFloat(cumul_montant) * 100)/item.montant_prevu;
            item.montant_cumul      =   cumul_montant;
            item.pourcentage_cumul  =   pourcentage_cumul.toFixed(3);
            
            if (item.quantite_prevu<item.quantite_cumul)
            {
                item.quantite_periode = 0;
                vm.showAlert('Ajout detail attachement','La quantité que vous avez entré est supérieure à la quantité prévue');
            }

        }
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

            item.quantite_periode   = currentItemDivers_attachement_latrine_travaux.quantite_periode ;
            item.quantite_cumul     = currentItemDivers_attachement_latrine_travaux.quantite_cumul ;
            item.montant_periode    = currentItemDivers_attachement_latrine_travaux.montant_periode ;
            item.pourcentage_periode = currentItemDivers_attachement_latrine_travaux.pourcentage_periode ;
            item.montant_cumul      = currentItemDivers_attachement_latrine_travaux.montant_cumul ;
            item.pourcentage_cumul  = currentItemDivers_attachement_latrine_travaux.pourcentage_cumul ;
            item.id_attachement_latrine_prevu   = currentItemDivers_attachement_latrine_travaux.id_attachement_latrine_prevu ;
          }else
          { 
            item.$edit = false;
            item.$selected = false;
            item.quantite_periode   = 0;
            item.quantite_cumul     = currentItemDivers_attachement_latrine_travaux.quantite_cumul ;
            item.montant_periode    = 0 ;
            item.pourcentage_periode = 0;
            item.montant_cumul      = currentItemDivers_attachement_latrine_travaux.montant_cumul ;
            item.pourcentage_cumul  = currentItemDivers_attachement_latrine_travaux.pourcentage_cumul ;
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
            console.log(item);
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
            
            item.quantite_periode   = parseFloat(item.quantite_periode) ;
            if (item.id==0)
            {   
                NouvelItemDivers_attachement_latrine_travaux = true ;
            }
            else
            {   
                NouvelItemDivers_attachement_latrine_travaux = false ;
            }
            
        };

        //fonction bouton suppression item divers_attachement_latrine_travaux
        vm.supprimerDivers_attachement_latrine_travaux = function()
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
                   if((mem[0].quantite_periode != currentItemDivers_attachement_latrine_travaux.quantite_periode ))                   
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
                    quantite_periode: divers_attachement_latrine_travaux.quantite_periode,
                    montant_periode: divers_attachement_latrine_travaux.montant_periode,
                    id_demande_latrine_mpe: vm.selectedItemDemande_latrine_mpe.id,
                    id_attachement_latrine_prevu: divers_attachement_latrine_travaux.id_attachement_latrine_prevu            
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
                        //vm.selectedItemDivers_attachement_latrine_travaux.attachement_latrine_prevu  = bat_prevu[0];
                        vm.selectedItemDivers_attachement_latrine_travaux.$selected  = false;
                        vm.selectedItemDivers_attachement_latrine_travaux.$edit      = false;
                        vm.selectedItemDivers_attachement_latrine_travaux ={};
                        vm.showbuttonValidation = false;
                        console.log('mandalo1');
                    }
                    else 
                    { 
                        console.log(divers_attachement_latrine_travaux.quantite_cumul);
                        console.log(divers_attachement_latrine_travaux.quantite_periode);
                        console.log(parseFloat(divers_attachement_latrine_travaux.quantite_cumul) - parseFloat(divers_attachement_latrine_travaux.quantite_periode));
                        var quantite_cumul = parseFloat(divers_attachement_latrine_travaux.quantite_cumul) - parseFloat(divers_attachement_latrine_travaux.quantite_periode);
                        var montant_cumul = parseFloat(divers_attachement_latrine_travaux.montant_cumul) - parseFloat(divers_attachement_latrine_travaux.montant_periode);
                        var pourcentage_cumul = (montant_cumul*100)/parseFloat(divers_attachement_latrine_travaux.montant_prevu);
                        vm.selectedItemDivers_attachement_latrine_travaux.quantite_periode   = 0 ;
                        vm.selectedItemDivers_attachement_latrine_travaux.quantite_cumul     = quantite_cumul;
                        vm.selectedItemDivers_attachement_latrine_travaux.montant_periode    = 0 ;
                        vm.selectedItemDivers_attachement_latrine_travaux.pourcentage_periode = 0 ;
                        vm.selectedItemDivers_attachement_latrine_travaux.montant_cumul      = montant_cumul;
                        vm.selectedItemDivers_attachement_latrine_travaux.pourcentage_cumul  = pourcentage_cumul;
                        vm.selectedItemDivers_attachement_latrine_travaux.id   = 0 ;                     
                    }
              }
              else
              {
                  divers_attachement_latrine_travaux.id  =   String(data.response); 
                  //divers_attachement_latrine_travaux.attachement_latrine_prevu  = bat_prevu[0];             
                  NouvelItemDivers_attachement_latrine_travaux = false;                    
              } 
              divers_attachement_latrine_travaux.$selected = false;
              divers_attachement_latrine_travaux.$edit = false;
              console.log(vm.selectedItemDivers_attachement_latrine_travaux);
              vm.selectedItemDivers_attachement_latrine_travaux ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement latrine travaux***********************************************/




/************************************************debut mobilier_mpe*************************************************/
    vm.click_tab_tranche_mobilier = function()
        {   
            vm.showbuttonNouvDemande_mobilier_mpe_creer = true;
            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_mobilier_mpe = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                }
            });
            
            vm.steprubriquebatiment_mpe = false;
            vm.stepattachement_batiment_travaux = false;
        }
        vm.demande_mobilier_mpe_column = [
        {titre:"Tranche"
        },
        {titre:"Période"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Condition de paiement"
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

            vm.alllast_attachement_mobilier_travaux = [];
        if (NouvelItemDemande_mobilier_mpe == false)
          {  
            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {             
                var last_id_demande_mobilier_mpe = Math.max.apply(Math, result.data.response.map(function(o){return o.id;}));

                vm.dataLastedemande_mobilier_mpe = result.data.response.filter(function(obj){return obj.id == last_id_demande_mobilier_mpe;});

                if (vm.dataLastedemande_mobilier_mpe.length>0)
                {   
                    var last_tranche_demande_mobilier_mpe = Math.max.apply(Math, vm.dataLastedemande_mobilier_mpe.map(function(o){return o.tranche.code.split(' ')[1];}));
                    
                    vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande_mobilier_mpe)+1);});
                    vm.alldemande_mobilier_mpe.push(items);                          
                    vm.selectedItemDemande_mobilier_mpe = items;
                    NouvelItemDemande_mobilier_mpe = true ;
                }
                else
                {
                    vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_mobilier_mpe.push(items);                          
                    vm.selectedItemDemande_mobilier_mpe = items;
                    NouvelItemDemande_mobilier_mpe = true ;
                    vm.dataLastedemande_mobilier_mpe = [];
                }
            });             
              
          }else
          {
              vm.showAlert('Ajout Attachement total mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
          }          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_mobilier_mpe(demande_mobilier_mpe,suppression)
        {
            if (NouvelItemDemande_mobilier_mpe==false)
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
          if (NouvelItemDemande_mobilier_mpe == false)
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
          NouvelItemDemande_mobilier_mpe_      = false;
          
        };

        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item;
           // vm.NouvelItemDemande_mobilier_mpe   = item;
            currentItemDemande_mobilier_mpe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_mobilier_mpe));
           if(item.$edit==false || item.$edit==undefined)
           {                
                vm.steprubriquemobilier_mpe = true;
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
            item.cumul = parseFloat(vm.selectedItemDemande_mobilier_mpe.cumul) ;
            item.anterieur = parseFloat(vm.selectedItemDemande_mobilier_mpe.anterieur) ;
            item.periode = parseFloat(vm.selectedItemDemande_mobilier_mpe.tranche.periode) ;
            item.pourcentage = vm.selectedItemDemande_mobilier_mpe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_mobilier_mpe.reste ;
            vm.showbuttonValidationDemande_mobilier_mpe_creer = false;
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
            if (NouvelItemDemande_mobilier_mpe==false)
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
                      vm.showbuttonNouvDemande_mobilier_mpe_creer = true;
                      if (vm.allfacture_mpe.length>0)
                      {
                            var montant_trav = parseFloat(vm.allfacture_mpe[0].montant_travaux) - parseFloat(demande_mobilier_mpe.montant);
                            var montant_rabais = (montant_trav * vm.allfacture_mpe[0].pourcentage_rabais)/100;
                            var montant_ht = parseFloat(montant_rabais) + parseFloat(montant_trav);
                            var montant_tva = 0;

                            var montant_ttc = montant_ht + montant_tva;
                            var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                            var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(vm.allfacture_mpe[0].remboursement_acompte) + 
                            parseFloat(retenu_garanti) + parseFloat(vm.allfacture_mpe[0].penalite_retard) + parseFloat(vm.allfacture_mpe[0].remboursement_plaque));
                            var item_facture_mpe = {
                                      id: vm.allfacture_mpe[0].id,        
                                      id_attachement: vm.allfacture_mpe[0].id_attachement_travaux,        
                                      numero: vm.selectedItemAttachement_travaux.numero,
                                      montant_travaux: montant_trav,
                                      pourcentage_rabais: vm.allfacture_mpe[0].pourcentage_rabais,
                                      montant_rabais: montant_rabais,
                                      montant_ht: montant_ht,
                                      montant_tva: montant_tva,   
                                      montant_ttc: montant_ttc, 
                                      remboursement_acompte: vm.allfacture_mpe[0].remboursement_acompte,   
                                      penalite_retard: vm.allfacture_mpe[0].penalite_retard, 
                                      retenue_garantie: retenu_garanti, 
                                      remboursement_plaque: vm.allfacture_mpe[0].remboursement_plaque,    
                                      net_payer: net_payer,  
                                      date_signature: vm.allfacture_mpe[0].date_signature
                                    };
                            majatfacture_mpe(item_facture_mpe,0);
                      }



                  vm.selectedItemAttachement_travaux.total_cumul =parseFloat(vm.selectedItemAttachement_travaux.total_cumul) - parseFloat(demande_mobilier_mpe.montant);
                  vm.selectedItemAttachement_travaux.total_periode =parseFloat(vm.selectedItemAttachement_travaux.total_periode) - parseFloat(demande_mobilier_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux); 
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0);
                    }
                    
                }
                else
                {
                  demande_mobilier_mpe.tranche = tran[0] ;
                  demande_mobilier_mpe.periode = tran[0].periode ;
                  demande_mobilier_mpe.pourcentage = tran[0].pourcentage ;
                  demande_mobilier_mpe.id  =   String(data.response);
                  vm.showbuttonNouvDemande_mobilier_mpe_creer = false;
                  NouvelItemDemande_mobilier_mpe= false;
                  vm.selectedItemAttachement_travaux.total_cumul =parseFloat(vm.selectedItemAttachement_travaux.total_cumul) + parseFloat(demande_mobilier_mpe.cumul);
                  //vm.selectedItemAttachement_travaux.total_anterieur =parseFloat(vm.selectedItemAttachement_travaux.total_anterieur) + parseFloat(demande_mobilier_mpe.anterieur);                  
                  vm.selectedItemAttachement_travaux.total_periode =parseFloat(vm.selectedItemAttachement_travaux.total_periode) + parseFloat(demande_mobilier_mpe.montant); 
                  console.log(vm.selectedItemAttachement_travaux);
                  majattachement_travaux(vm.selectedItemAttachement_travaux,0); 

                  /*vm.selectedItemAttachement_travaux.total_cumul =parseInt(vm.selectedItemAttachement_travaux.total_cumul) + parseInt(demande_mobilier_mpe.cumul);
                  vm.selectedItemAttachement_travaux.total_anterieur =parseInt(vm.selectedItemAttachement_travaux.total_anterieur) + parseInt(demande_mobilier_mpe.anterieur);                  
                  vm.selectedItemAttachement_travaux.total_periode =parseInt(vm.selectedItemAttachement_travaux.total_periode) + parseInt(demande_mobilier_mpe.montant);*/

                  if (vm.allfacture_mpe.length>0)
                  {
                        var montant_trav = parseFloat(vm.allfacture_mpe[0].montant_travaux) + parseFloat(demande_mobilier_mpe.montant);
                        var montant_rabais = (montant_trav * vm.allfacture_mpe[0].pourcentage_rabais)/100;
                        var montant_ht = parseFloat(montant_rabais) + parseFloat(montant_trav);
                        var montant_tva = 0;

                        var montant_ttc = montant_ht + montant_tva;
                        var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                        var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - (parseFloat(vm.allfacture_mpe[0].remboursement_acompte) + 
                        parseFloat(retenu_garanti) + parseFloat(vm.allfacture_mpe[0].penalite_retard) + parseFloat(vm.allfacture_mpe[0].remboursement_plaque));
                        var item_facture_mpe = {
                                  id: vm.allfacture_mpe[0].id,        
                                  id_attachement: vm.allfacture_mpe[0].id_attachement_travaux,        
                                  numero: vm.selectedItemAttachement_travaux.numero,
                                  montant_travaux: montant_trav,
                                  pourcentage_rabais: vm.allfacture_mpe[0].pourcentage_rabais,
                                  montant_rabais: montant_rabais,
                                  montant_ht: montant_ht,
                                  montant_tva: montant_tva,   
                                  montant_ttc: montant_ttc, 
                                  remboursement_acompte: vm.allfacture_mpe[0].remboursement_acompte,   
                                  penalite_retard: vm.allfacture_mpe[0].penalite_retard, 
                                  retenue_garantie: retenu_garanti, 
                                  remboursement_plaque: vm.allfacture_mpe[0].remboursement_plaque,    
                                  net_payer: net_payer,  
                                  date_signature: vm.allfacture_mpe[0].date_signature
                                };
                        majatfacture_mpe(item_facture_mpe,0);
                  }
                  else
                  {     
                        //montant_rabais 0 satri pourcentage 0 initial
                        //penalite retard 0 initial
                        var montant_trav = parseFloat(demande_mobilier_mpe.montant);
                        var montant_ht = parseFloat(montant_trav);
                        var montant_tva = 0;

                        var montant_ttc = montant_ht + montant_tva;
                        var retenu_garanti = (parseFloat(montant_ttc)*5)/100;
                        var net_payer = parseFloat(montant_ht) + parseFloat(montant_tva) - parseFloat(retenu_garanti);
                        var item_facture_mpe = {
                                  id: 0,        
                                  id_attachement: vm.selectedItemAttachement_travaux.id,        
                                  numero: vm.selectedItemAttachement_travaux.numero,
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
                                  net_payer: net_payer,  
                                  date_signature: convertionDate(vm.datenow)
                                };
                        majatfacture_mpe(item_facture_mpe,0);
                  }

                  
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

          var montant_ttc = ((vm.selectedItemContrat_prestataire.cout_mobilier) * vm.allcurenttranche_demande_mobilier_mpe[0].pourcentage)/100;
          var montant = montant_ttc/1;
          var cumul = montant;

          var demande_ancien = vm.alldemande_mobilier_mpe.filter(function(obj)
              {
                return obj.id != 0;
              });

          if (vm.allcurenttranche_demande_mobilier_mpe[0].code != 'tranche 1')
          {                 
              anterieur = vm.dataLastedemande_mobilier_mpe[0].montant;           
              cumul = montant + parseFloat(vm.dataLastedemande_mobilier_mpe[0].cumul);
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

/************************************************Debut rubrique attachement mobilier_mpe***************************************************/
       
        vm.rubrique_attachement_mobilier_mpe_column = [
        {titre:"Numero"
        },
        {titre:"Libelle"
        },
        {titre:"Montant prévu"
        },
        {titre:"Montant période"
        },
        {titre:"Montant anterieur"
        },
        {titre:"Montant cumul"
        },
        {titre:"Pourcentage période"
        },
        {titre:"Pourcentage anterieur"
        },
        {titre:"Pourcentage cumul"
        }];

        vm.click_rubrique_attachement_mobilier_mpe = function()
        {console.log(vm.selectedItemContrat_prestataire.id);
            console.log(vm.selectedItemDemande_mobilier_mpe.id);
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier/index","menu","getrubrique_attachement_withmontantbycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_demande_mobilier_mpe",vm.selectedItemDemande_mobilier_mpe.id).then(function(result)
            {   
                vm.allrubrique_attachement_mobilier_mpe= result.data.response;
                console.log(vm.allrubrique_attachement_mobilier_mpe);
                vm.stepattachement_mobilier_travaux = false;
            });
        }
 //fonction selection item rubrique attachement mobilier mpe
        vm.selectionRubrique_attachement_mobilier_mpe= function (item)
        {
            vm.selectedItemRubrique_attachement_mobilier_mpe = item;
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_prevu/index","menu","getattachement_mobilierprevubyrubrique",
            "id_attachement_mobilier",vm.selectedItemRubrique_attachement_mobilier_mpe.id,"id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                    vm.alldivers_attachement_mobilier_prevus = result.data.response;
                    vm.alldivers_attachement_mobilier_prevu = result.data.response;
                    console.log(vm.alldivers_attachement_mobilier_prevu)
            });
            vm.stepattachement_mobilier_travaux = true;
            
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

        vm.Total_prevu_mobilier_mpe = function(){
            var total_prevu = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                }
            }
            return total_prevu;
        }

        vm.Total_periode_mobilier_mpe = function(){
            var total_periode = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_periode += parseFloat(product.montant_periode);
                }
            }
            return total_periode;
        }

        vm.Total_anterieur_mobilier_mpe = function(){
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
                }
            }
            return total_anterieur;
        }

        vm.Total_cumul_mobilier_mpe = function(){
            var total_cumul = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_cumul += parseFloat(product.montant_cumul);
                }
            }
            return total_cumul;
        }

        vm.Periode_pourcentage_mobilier_mpe = function(){
            var periode_pourcentage = 0;
            var total_prevu = 0;
            var total_periode = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_periode += parseFloat(product.montant_periode);
                    
                }
                periode_pourcentage = (total_periode*100)/ total_prevu;
            }

            return periode_pourcentage.toFixed(2);
        }

        vm.Anterieur_pourcentage_mobilier_mpe = function(){
            var anterieur_pourcentage = 0;
            var total_prevu = 0;
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_anterieur += parseFloat(product.montant_anterieur);
                    
                }
                anterieur_pourcentage = (total_anterieur*100)/ total_prevu;
            }

            return anterieur_pourcentage.toFixed(2);
        }

        vm.Total_pourcentage_mobilier_mpe = function(){
            var total_pourcentage = 0;
            var total_prevu = 0;
            var total_cumul = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_prevu += parseFloat(product.montant_prevu);
                    total_cumul += parseFloat(product.montant_cumul);
                    
                }
                total_pourcentage = (total_cumul*100)/ total_prevu;
            }

            return total_pourcentage.toFixed(2);
        }
/************************************************fin rubrique attachement mobilier_mpe***************************************************/



/**********************************************debut attachement mobilier travauxe***************************************************/
        vm.click_tab_attachement_mobilier_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_travaux/index","menu","getattachement_mobiliertravauxbydemande",
                    "id_demande_mobilier_mpe",vm.selectedItemDemande_mobilier_mpe.id,"id_attachement_mobilier",vm.selectedItemRubrique_attachement_mobilier_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_travaux = result.data.response;
                console.log(vm.alldivers_attachement_mobilier_travaux);
            });
        }
        vm.change_quantite_periode_mobilier = function(item)
        { 
            var cumul_quatite   =   0;
            var cumul_montant   =   0;
            var pourcentage_periode =   0;
            var pourcentage_anterieur =   0;
            var pourcentage_cumul =   0;
            var montant_current =   parseFloat(item.quantite_periode)* parseFloat(item.prix_unitaire);

            cumul_quatite           =   parseFloat(currentItemDivers_attachement_mobilier_travaux.quantite_cumul)-parseFloat(currentItemDivers_attachement_mobilier_travaux.quantite_periode) + parseFloat(item.quantite_periode) ;
            item.quantite_cumul     =   cumul_quatite;

            item.montant_periode    =   montant_current;
            pourcentage_periode     =   (parseFloat(montant_current) * 100)/item.montant_prevu;
            item.pourcentage_periode  =   pourcentage_periode.toFixed(3);

            cumul_montant           =   parseFloat(currentItemDivers_attachement_mobilier_travaux.montant_cumul)-parseFloat(currentItemDivers_attachement_mobilier_travaux.montant_periode) + parseFloat(montant_current) ;
            pourcentage_cumul       =   (parseFloat(cumul_montant) * 100)/item.montant_prevu;
            item.montant_cumul      =   cumul_montant;
            item.pourcentage_cumul  =   pourcentage_cumul.toFixed(3);
            
            if (item.quantite_prevu<item.quantite_cumul)
            {
                item.quantite_periode = 0;
                vm.showAlert('Ajout detail attachement','La quantité que vous avez entré est supérieure à la quantité prévue');
            }

        }
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

            item.quantite_periode   = currentItemDivers_attachement_mobilier_travaux.quantite_periode ;
            item.quantite_cumul     = currentItemDivers_attachement_mobilier_travaux.quantite_cumul ;
            item.montant_periode    = currentItemDivers_attachement_mobilier_travaux.montant_periode ;
            item.pourcentage_periode = currentItemDivers_attachement_mobilier_travaux.pourcentage_periode ;
            item.montant_cumul      = currentItemDivers_attachement_mobilier_travaux.montant_cumul ;
            item.pourcentage_cumul  = currentItemDivers_attachement_mobilier_travaux.pourcentage_cumul ;
            item.id_attachement_mobilier_prevu   = currentItemDivers_attachement_mobilier_travaux.id_attachement_mobilier_prevu ;
          }else
          { 
            item.$edit = false;
            item.$selected = false;
            item.quantite_periode   = 0;
            item.quantite_cumul     = currentItemDivers_attachement_mobilier_travaux.quantite_cumul ;
            item.montant_periode    = 0 ;
            item.pourcentage_periode = 0;
            item.montant_cumul      = currentItemDivers_attachement_mobilier_travaux.montant_cumul ;
            item.pourcentage_cumul  = currentItemDivers_attachement_mobilier_travaux.pourcentage_cumul ;
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
            console.log(item);
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
            
            item.quantite_periode   = parseFloat(item.quantite_periode) ;
            if (item.id==0)
            {   
                NouvelItemDivers_attachement_mobilier_travaux = true ;
            }
            else
            {   
                NouvelItemDivers_attachement_mobilier_travaux = false ;
            }
            
        };

        //fonction bouton suppression item divers_attachement_mobilier_travaux
        vm.supprimerDivers_attachement_mobilier_travaux = function()
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
                   if((mem[0].quantite_periode != currentItemDivers_attachement_mobilier_travaux.quantite_periode ))                   
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
                    quantite_periode: divers_attachement_mobilier_travaux.quantite_periode,
                    montant_periode: divers_attachement_mobilier_travaux.montant_periode,
                    id_demande_mobilier_mpe: vm.selectedItemDemande_mobilier_mpe.id,
                    id_attachement_mobilier_prevu: divers_attachement_mobilier_travaux.id_attachement_mobilier_prevu            
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
                        //vm.selectedItemDivers_attachement_mobilier_travaux.attachement_mobilier_prevu  = bat_prevu[0];
                        vm.selectedItemDivers_attachement_mobilier_travaux.$selected  = false;
                        vm.selectedItemDivers_attachement_mobilier_travaux.$edit      = false;
                        vm.selectedItemDivers_attachement_mobilier_travaux ={};
                        vm.showbuttonValidation = false;
                        console.log('mandalo1');
                    }
                    else 
                    { 
                        console.log(divers_attachement_mobilier_travaux.quantite_cumul);
                        console.log(divers_attachement_mobilier_travaux.quantite_periode);
                        console.log(parseFloat(divers_attachement_mobilier_travaux.quantite_cumul) - parseFloat(divers_attachement_mobilier_travaux.quantite_periode));
                        var quantite_cumul = parseFloat(divers_attachement_mobilier_travaux.quantite_cumul) - parseFloat(divers_attachement_mobilier_travaux.quantite_periode);
                        var montant_cumul = parseFloat(divers_attachement_mobilier_travaux.montant_cumul) - parseFloat(divers_attachement_mobilier_travaux.montant_periode);
                        var pourcentage_cumul = (montant_cumul*100)/parseFloat(divers_attachement_mobilier_travaux.montant_prevu);
                        vm.selectedItemDivers_attachement_mobilier_travaux.quantite_periode   = 0 ;
                        vm.selectedItemDivers_attachement_mobilier_travaux.quantite_cumul     = quantite_cumul;
                        vm.selectedItemDivers_attachement_mobilier_travaux.montant_periode    = 0 ;
                        vm.selectedItemDivers_attachement_mobilier_travaux.pourcentage_periode = 0 ;
                        vm.selectedItemDivers_attachement_mobilier_travaux.montant_cumul      = montant_cumul;
                        vm.selectedItemDivers_attachement_mobilier_travaux.pourcentage_cumul  = pourcentage_cumul;
                        vm.selectedItemDivers_attachement_mobilier_travaux.id   = 0 ;                     
                    }
              }
              else
              {
                  divers_attachement_mobilier_travaux.id  =   String(data.response); 
                  //divers_attachement_mobilier_travaux.attachement_mobilier_prevu  = bat_prevu[0];             
                  NouvelItemDivers_attachement_mobilier_travaux = false;                    
              } 
              divers_attachement_mobilier_travaux.$selected = false;
              divers_attachement_mobilier_travaux.$edit = false;
              console.log(vm.selectedItemDivers_attachement_mobilier_travaux);
              vm.selectedItemDivers_attachement_mobilier_travaux ={};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }


    /******************************************fin attachement mobilier travaux***********************************************/
        /************************************************debut Decompte*************************************************/
        vm.click_tab_decompte_mpe = function()
        {   

            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getdecompte_mpeBycontratandfacture",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_facture_mpe',vm.id_facture_mpe).then(function(result)
            {
                vm.decompte_mpes = result.data.response[0];
                console.log(vm.decompte_mpes);
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

//col table
        vm.justificatif_attachement_mpe_column = [
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
          vm.selectedItemJustificatif_attachement_mpe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_attachement_mpe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_attachement_mpe = function ()
        { 
          if (NouvelItemJustificatif_attachement_mpe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_attachement_mpe.push(items);
            vm.alljustificatif_attachement_mpe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_attachement_mpe = mem;
              }
            });

            NouvelItemJustificatif_attachement_mpe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_attachement_mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_attachement_mpe(justificatif_attachement_mpe,suppression)
        {
            if (NouvelItemJustificatif_attachement_mpe==false)
            {
                test_existanceJustificatif_attachement_mpe (justificatif_attachement_mpe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_attachement_mpe(justificatif_attachement_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_attachement_mpe
        vm.annulerJustificatif_attachement_mpe = function(item)
        {
          if (NouvelItemJustificatif_attachement_mpe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_attachement_mpe.description ;
            item.fichier   = currentItemJustificatif_attachement_mpe.fichier ;
          }else
          {
            vm.alljustificatif_attachement_mpe = vm.alljustificatif_attachement_mpe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_attachement_mpe.id;
            });
          }

          vm.selectedItemJustificatif_attachement_mpe = {} ;
          NouvelItemJustificatif_attachement_mpe      = false;
          
        };

        //fonction selection item justificatif facture_mpe
        vm.selectionJustificatif_attachement_mpe= function (item)
        {
            vm.selectedItemJustificatif_attachement_mpe = item;
            vm.nouvelItemJustificatif_attachement_mpe   = item;
            currentItemJustificatif_attachement_mpe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_attachement_mpe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_attachement_mpe', function()
        {
             if (!vm.alljustificatif_attachement_mpe) return;
             vm.alljustificatif_attachement_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_attachement_mpe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_attachement_mpe = function(item)
        {
            NouvelItemJustificatif_attachement_mpe = false ;
            vm.selectedItemJustificatif_attachement_mpe = item;
            currentItemJustificatif_attachement_mpe = angular.copy(vm.selectedItemJustificatif_attachement_mpe);
            $scope.vm.alljustificatif_attachement_mpe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_attachement_mpe.description ;
            item.fichier   = vm.selectedItemJustificatif_attachement_mpe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_attachement_mpe
        vm.supprimerJustificatif_attachement_mpe = function()
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
                vm.ajoutJustificatif_attachement_mpe(vm.selectedItemJustificatif_attachement_mpe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_attachement_mpe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_attachement_mpe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_attachement_mpe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_attachement_mpe.description )
                    ||(just[0].fichier   != currentItemJustificatif_attachement_mpe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_attachement_mpe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_attachement_mpe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_attachement_mpe
        function insert_in_baseJustificatif_attachement_mpe(justificatif_attachement_mpe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_attachement_mpe==false)
            {
                getId = vm.selectedItemJustificatif_attachement_mpe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_attachement_mpe.description,
                    fichier: justificatif_attachement_mpe.fichier,
                    id_attachement_travaux: vm.selectedItemAttachement_travaux.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_attachement_mpe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_attachement_mpe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_attachement_mpe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_attachement_mpe.id
                                              
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
                                    justificatif_attachement_mpe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_attachement_mpe.description,
                                                      fichier: justificatif_attachement_mpe.fichier,
                                                      id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_attachement_mpe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_attachement_mpe.$selected = false;
                                          justificatif_attachement_mpe.$edit = false;
                                          vm.selectedItemJustificatif_attachement_mpe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_attachement_mpe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_attachement_mpe.description,
                                        fichier: justificatif_attachement_mpe.fichier,
                                        id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_attachement_mpe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_attachement_mpe.$selected = false;
                                      justificatif_attachement_mpe.$edit = false;
                                      vm.selectedItemJustificatif_attachement_mpe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_attachement_mpe.$selected  = false;
                        vm.selectedItemJustificatif_attachement_mpe.$edit      = false;
                        vm.selectedItemJustificatif_attachement_mpe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_attachement_mpe = vm.alljustificatif_attachement_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_attachement_mpe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_attachement_mpe.fichier;
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
                  justificatif_attachement_mpe.id  =   String(data.response);              
                  NouvelItemJustificatif_attachement_mpe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_attachement_mpe/';
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
                              justificatif_attachement_mpe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_attachement_mpe.description,
                                                fichier: justificatif_attachement_mpe.fichier,
                                                id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                                                
                                  });
                                apiFactory.add("justificatif_attachement_mpe/index",datas, config).success(function (data)
                                { 
                                    justificatif_attachement_mpe.$selected = false;
                                    justificatif_attachement_mpe.$edit = false;
                                    vm.selectedItemJustificatif_attachement_mpe = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_attachement_mpe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_attachement_mpe.description,
                                  fichier: justificatif_attachement_mpe.fichier,
                                  id_attachement_travaux: vm.selectedItemAttachement_travaux.id,
                                               
                              });
                            apiFactory.add("justificatif_attachement_mpe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_attachement_mpe.$selected = false;
                                justificatif_attachement_mpe.$edit = false;
                                vm.selectedItemJustificatif_attachement_mpe = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_attachement_mpe.$selected = false;
              justificatif_attachement_mpe.$edit = false;
              vm.selectedItemJustificatif_attachement_mpe = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece_attachement_mpe = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif facture_mpe**********************************************/
 


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
