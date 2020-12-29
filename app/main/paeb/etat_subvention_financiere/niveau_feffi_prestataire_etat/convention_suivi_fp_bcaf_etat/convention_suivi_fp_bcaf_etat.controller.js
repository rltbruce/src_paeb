
(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_prestataire_etat.convention_suivi_fp_bcaf_etat')
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
        .controller('Convention_suivi_fp_bcaf_etatController', Convention_suivi_fp_bcaf_etatController);
    /** @ngInject */
    function Convention_suivi_fp_bcaf_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.affiche_load =false;
        vm.styleTabfils = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepsuivi_paiement_moe = false;
        vm.stepsuivi_paiement_mpe = false;
        vm.stepprestation_moe = false;

        vm.stepjusti_d_tra_moe = false;
        vm.stepjusti_batiment_moe = false;
        vm.stepjusti_latrine_moe = false;
        vm.stepjusti_f_tra_moe = false;

        vm.stepfacture_mpe = false;
        vm.stepattachement_mpe = false;

        vm.stepbatiment_mpe = false;
        vm.steplatrine_mpe = false;
        vm.stepmobilier_mpe = false;

        vm.steppv_consta_batiment_travaux = false;
        vm.steppv_consta_latrine_travaux = false;
        vm.steppv_consta_mobilier_travaux = false;
        vm.stepdecompte_mpe = false;

        vm.steprubriquebatiment_mpe = false;
        vm.steprubriquelatrine_mpe = false;
        vm.steprubriquemobilier_mpe = false;
       // vm.stepdecompte =false;
        
        vm.stepsuivi_marche = false;
        vm.show_avance_dem = false;
        vm.show_facture_mpe = false;
        vm.id_facture_mpe = 0;
        vm.session = '';


/*******************************************Debut maitrise d'oeuvre*************************************/
    
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;     

        vm.selectedItemFacture_moe_entete = {};
        vm.allfacture_moe_entete = [];

        vm.selectedItemRubrique_calendrier_paie_moe = {};
        vm.allrubrique_calendrier_paie_moe = [];

        vm.selectedItemSousrubrique_calendrier_paie_moe = {};
        vm.allsousrubrique_calendrier_paie_moe = [];

        vm.selectedItemFacture_moe_detail = {} ;
        vm.allfacture_moe_detail = [] ;

        vm.selectedItemJustificatif_facture_moe = {} ;
        vm.alljustificatif_facture_moe = [] ;


/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;
        
        vm.selectedItemPv_consta_entete_travaux = {};
        vm.allpv_consta_entete_travaux = [];
        
        vm.selectedItemAvance_demarrage = {};
        vm.allavance_demarrage = [];

        vm.selectedItemFacture_mpe = {};
        vm.facture_mpe = {};

        vm.selectedItemDemande_batiment_mpe = {};
        vm.alldemande_batiment_mpe = [];

        vm.allpv_consta_rubrique_phase_bat_mpe=[];
        vm.selectedItemPv_consta_rubrique_phase_bat_mpe = {};
        vm.allpv_consta_statu_bat_travaux = [] ;


        vm.selectedItemDemande_latrine_mpe = {};
        vm.alldemande_latrine_mpe = [];

        vm.allpv_consta_rubrique_phase_lat_mpe=[];
        vm.selectedItemPv_consta_rubrique_phase_lat_mpe = {};

        vm.allpv_consta_statu_lat_travaux = [] ;

        vm.selectedItemDemande_mobilier_mpe = {};
        vm.alldemande_mobilier_mpe = [];

        vm.allpv_consta_rubrique_phase_mob_mpe=[];
        vm.selectedItemPv_consta_rubrique_phase_mob_mpe = {};

        vm.allpv_consta_statu_mob_travaux = [] ;

        vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = {} ;
        vm.alljustificatif_pv_consta_entete_travaux_mpe = [] ;

        vm.decompte_mpes ={};
        vm.allsuivi_marche_facture_mpe = [];
        vm.suivi_marche_avance_mpe = [];

/********************************************Fin entreprise********************************************/

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        vm.dtOptions_perso = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          order: []

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

                            vm.session = 'BCAF';
                      
                      break;

                  case 'ADMIN':                            
                            vm.session = 'ADMIN';                  
                      break;
                  default:
                      break;
              
                }                  

         });

         
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
        {titre:"Utilisateur"
        }]; 

      

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                 vm.affiche_load =false;
            });
                console.log(filtre);
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
            vm.stepMenu_mpe=true;
            vm.stepMenu_moe=true;
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
      /*  function donnee_menu_moe(item,session)
        {   vm.showbuttonNouvcontrat_moe=true;
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getetatcontratByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allcontrat_moe = result.data.response;
                    console.log(vm.allcontrat_moe);
                    return resolve('ok'); 
                });
            });
        }
        function donnee_menu_mpe(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getetatcontratByconvention','id_convention_entete',item.id).then(function(result)
                {
                    vm.allcontrat_prestataire = result.data.response;
                    console.log(vm.allcontrat_prestataire);
                    return resolve('ok');
                });             
            });
        }*/

        vm.step_menu_mpe=function()
        {
            vm.styleTabfils = "acc_sous_menu";
            vm.stepsuivi_paiement_mpe = false;
            vm.stepsuivi_marche = false;
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getetatcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                    vm.allcontrat_prestataire = result.data.response;
                    vm.affiche_load = false;
            }); 
        }

        vm.step_menu_moe=function()
        {
            vm.styleTabfils = "acc_sous_menu";
            vm.stepsuivi_paiement_moe = false;
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getetatcontratByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                    vm.allcontrat_moe = result.data.response;
                    console.log(vm.allcontrat_moe);

                    vm.affiche_load = false; 
            });
        }    

  /******************************************debut maitrise d'oeuvre*****************************************************/

      

      /**************************************fin contrat moe***************************************************/
        vm.click_step_contrat_moe=function()
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
        {titre:"Date Notification intention"
        },
        {titre:"Date Notification attribution"
        },
        {titre:"Date signature"
        },
        {titre:"Date OS"
        },
        {titre:"Avancement financière"
        }];
     
       
        //fonction selection item contrat
        vm.selectionContrat_moe= function (item)
        {
            vm.selectedItemContrat_moe = item;

           if(item.id!=0)
           {
              if (item.$selected==false || item.$selected==undefined)
              {                  
                  apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandedisponibleBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandedisponibleBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandedisponibleBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandedisponibleBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                    });
                }
                vm.stepsuivi_paiement_moe = true;
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


        vm.affichage_avancement_financ = function(avance)
        {
          var avance_p=0;
          if (avance)
          {
            avance_p = parseFloat(avance).toFixed(2);
          }
          return avance_p +"%";
        }
       
      /*****************************************fin contrat moe******************************************************/
      vm.step_suivi_paiement=function()
      {
        vm.styleTabfils = "acc_menu";
      }
      /**********************************debut demande_debut_travaux_moe****************************************/
 vm.click_step_suivi_paiement_moe = function()
      {
        apiFactory.getAPIgeneraliserREST("facture_moe_entete/index","menu","getfacturedisponibleBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
        {
            vm.allfacture_moe_entete = result.data.response;
            console.log(vm.allfacture_moe_entete);
        });        

        vm.steprubriquecalendrier = false;
        vm.stepsousrubriquecalendrier = false;
        vm.stepjusti_facture_moe = false;
        vm.stepfacture_detail = false;

        vm.showbuttonValidationFacture_moe_encourdpfi = false;
        vm.showbuttonValidationFacture_moe_rejedpfi = false;
        vm.showbuttonValidationFacture_moe_validedpfi = false;
      }

        vm.facture_moe_entete_column = [        
        {titre:"Numero"
        },
        {titre:"Date de BR"
        },
        {titre:"Situation"
        }];

//fonction selection item Demande_batiment_mpe
        vm.selectionFacture_moe_entete= function (item)
        {
            vm.selectedItemFacture_moe_entete = item;
           // vm.NouvelItemFacture_moe_entete   = item;
           if (item.$edit==false || item.$edit==undefined)
           {
                vm.steprubriquecalendrier = true;
                vm.stepsousrubriquecalendrier = false;
                vm.stepjusti_facture_moe = true;
                vm.stepfacture_detail = false;
           }

            vm.validation_fact_moe = item.validation;
            vm.showbuttonValidationFacture_moe_encourdpfi = true;
            vm.showbuttonValidationFacture_moe_rejedpfi = true;
            vm.showbuttonValidationFacture_moe_validedpfi = true;           
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


        vm.situationfacture_moe = function(validation)
        {
            switch (parseInt(validation))
            {
              case 1:
                      return 'Validé par BCAF';                  
                  break;
              
              case 2:
                        return 'En cours de traitement DPFI'; 
                  break;

              case 3:
                  
                  return 'Rejetée'; 
                  break;

             case 4:
                  
                  return 'Finalisée'; 
                  break;

              default:
          
            }
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
            var tot = ((total_cumulc*100)/total_prevuc);

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
            var tot = ((total_anterieur*100)/total_prevu);

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
            var tot=((total_periode*100)/total_prevu);

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
        //fonction selection item justificatif batiment
        vm.selectionFacture_moe_detail= function (item)
        {
            vm.selectedItemFacture_moe_detail = item;
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

        //fonction selection item justificatif facture_moe
        vm.selectionJustificatif_facture_moe= function (item)
        {
            vm.selectedItemJustificatif_facture_moe = item;
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


        vm.download_piece_facture_moe = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif fin_travaux**********************************************/

/**********************************debut contrat prestataire****************************************/
         vm.click_step_contrat_mpe=function()
      {
        vm.styleTabfils = "acc_sous_menu";

        vm.stepsuivi_marche = false;
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
        {titre:"Avancement financière"
        }];
        //Masque de saisi ajout
         //fonction ajout dans bdd
       
        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;            

            vm.stepsuivi_paiement_mpe = true;

            vm.stepsuivi_marche = true;
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
            vm.steppv_consta_mpe = false;
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavance_demarragevalidebcafBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavance_demarrage = result.data.response;
                
                vm.steppv_consta_mpe = true;
                vm.affiche_load =false;
            });            
            vm.stepfacture_mpe = false;
            vm.stepdecompte = false;
            vm.stepjusti_pv_consta_entete_travaux_mpe = false;
        }

        vm.click_tab_avance_mpe = function()
        { 
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
        }];        


        
        //fonction selection item Demande_batiment_mpe
        vm.selectionAvance_demarrage= function (item)
        {
            vm.selectedItemAvance_demarrage = item;
           
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

        
/************************************************fin avance demarrage***************************************************/
 

/************************************************debut facture*************************************************/
        vm.click_tab_facture_mpe = function()
        {
            
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
        {titre:"Etat"
        }];        

        //fonction selection item Demande_batiment_mpe
        vm.selectionFacture_mpe= function (item)
        {
            vm.selectedItemFacture_mpe = item;
            vm.validation_facture_mpe = item.validation;

            vm.stepdecompte_mpe = true;
            vm.stepattachement_mpe = true;
            vm.stepattachement_mpe = true; 
              
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
        vm.situationfacture = function(validation)
        {
            switch (parseInt(validation))
            {
              case 1:
                      return 'Rejeté';                  
                  break;
              
              case 2:
                        return 'Validé'; 
                  break;

              default:
          
            }
        }

/************************************************fin avance demarrage***************************************************/

/************************************************debut attachement*************************************************/
vm.click_tabs_pv_consta_entete_travaux = function()
{   
    vm.affiche_load =true;
    apiFactory.getAPIgeneraliserREST("pv_consta_entete_travaux/index","menu","getpv_consta_entete_travauxvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
    {
        vm.allpv_consta_entete_travaux = result.data.response;
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
    {titre:"Situation"
    }];        

      vm.situation_facture_mpe = function(situ)
      {
          var affichage="Validé";
          if (parseInt(situ)==1)
          {
            affichage = "Rejeté";  
          }
          return affichage;
      }  
        //fonction selection item Demande_batiment_mpe
        //fonction selection item Demande_batiment_mpe
        //fonction selection item Demande_batiment_mpe
            vm.selectionPv_consta_entete_travaux= function (item)
            {
                vm.selectedItemPv_consta_entete_travaux = item;
            // vm.NouvelItemPv_consta_entete_travaux   = item;
                
                    vm.showbuttonNouvFacture_mpe = true;
                    vm.steprubriquebatiment_mpe = true;
                    vm.steprubriquelatrine_mpe = true;
                    vm.steprubriquemobilier_mpe = true;
                    vm.steppv_consta_recap_travaux = true;

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

        
/************************************************fin attachement***************************************************/



/************************************************debut batiment_mpe*************************************************/
        vm.click_tab_tranche_batiment = function()
        {   vm.affiche_load =true;
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
        }]; 
        
        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;  
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
            }];
    
    vm.click_pv_consta_rubrique_phase_bat_mpe = function()
    {   
        vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("pv_consta_rubrique_phase_bat/index","menu","getpv_consta_rubrique_phase_pourcentagebycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_pv_consta_entete_travaux",vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
        {  
            vm.allpv_consta_rubrique_phase_bat_mpe= result.data.response;
            vm.steppv_consta_batiment_travaux = false;
            vm.affiche_load =false;
        });
    }
    //fonction selection item rubrique attachement batiment mpe
    vm.selectionPv_consta_rubrique_phase_bat_mpe= function (item)
    {
        vm.selectedItemPv_consta_rubrique_phase_bat_mpe = item;
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
        
           
    /******************************************fin attachement batiment travaux***********************************************/


/************************************************debut latrine_mpe*************************************************/
        vm.click_tab_tranche_latrine = function()
        {   vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("demande_latrine_mpe/index","menu","getdemandeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
            {
            vm.alldemande_latrine_mpe = result.data.response;
            vm.affiche_load =false;
            });

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
        }];        

        
        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item; 
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
                vm.steppv_consta_latrine_travaux = true;
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
                vm.affiche_load =false;
            });
        }
               
    /******************************************fin attachement latrine travaux***********************************************/




/************************************************debut mobilier_mpe*************************************************/
        vm.click_tab_tranche_mobilier = function()
        {   vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("demande_mobilier_mpe/index","menu","getdemandeBypv_consta_entete",'id_pv_consta_entete_travaux',vm.selectedItemPv_consta_entete_travaux.id).then(function(result)
            {
            vm.alldemande_mobilier_mpe = result.data.response;
            vm.affiche_load =false;
            });
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
        }];        

        
        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item; 
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
/**********************************debut justificatif attachement****************************************/
        vm.click_step_justi_pv_consta_entete_travaux_mpe = function()
        {   console.log('mande');
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

        vm.selectionJustificatif_pv_consta_entete_travaux_mpe= function (item)
        {
            vm.selectedItemJustificatif_pv_consta_entete_travaux_mpe = item;
            
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
        vm.download_piece_pv_consta_entete_travaux_mpe = function(item)
        {
            window.open(apiUrlFile+item.fichier);
        }
/**********************************fin justificatif attachement****************************************/

    
        
    vm.click_tab_suivi_marche = function()
    {
            
        apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpevalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
        {
            vm.allsuivi_marche_facture_mpe = result.data.response;
            if(vm.allsuivi_marche_facture_mpe.length!=0)
            {
                vm.show_facture_mpe = true;
            }
            console.log(vm.allsuivi_marche_facture_mpe);
        });

        apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavancevalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
        {
            vm.suivi_marche_avance_mpe = result.data.response;
            if(vm.suivi_marche_avance_mpe.length!=0)
            {
                vm.show_avance_dem = true;
            }
        });
    }
    vm.som_montant_travaux= function()
    {
        var total_cumul = 0;
        var total_avance = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
           for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.montant_travaux);
            }
        }
        if (vm.suivi_marche_avance_mpe.length!=0)
        {                
            total_avance = parseFloat(vm.suivi_marche_avance_mpe[0].montant_avance);            
        }
        var total = total_cumul + total_avance;

        
            var nbr=parseFloat(total);
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

    vm.som_montant_ht= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.montant_ht);
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

    vm.som_montant_tva= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.montant_tva);
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

    vm.som_montant_ttc= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.montant_ttc);
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

    vm.som_retenue_garantie= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.retenue_garantie);
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

    vm.som_remboursement_plaque= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.remboursement_plaque);
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

    vm.som_remboursement_acompte= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.remboursement_acompte);
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

    vm.som_penalite_retard= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.penalite_retard);
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
    vm.som_taxe_marche_public= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.taxe_marche_public);
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

    vm.som_net_payer= function()
    {
        var total_cumul = 0;
        if (vm.allsuivi_marche_facture_mpe.length!=0)
        {                
            for(var i = 0; i < vm.allsuivi_marche_facture_mpe.length; i++){
                var product = vm.allsuivi_marche_facture_mpe[i];
                total_cumul += parseFloat(product.net_payer);
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
