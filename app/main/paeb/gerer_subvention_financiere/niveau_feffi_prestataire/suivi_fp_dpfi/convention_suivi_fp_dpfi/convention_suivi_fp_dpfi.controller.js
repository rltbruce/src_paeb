
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_prestataire.suivi_fp_dpfi.convention_suivi_fp_dpfi')
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
        .controller('Convention_suivi_fp_dpfiController', Convention_suivi_fp_dpfiController);
    /** @ngInject */
    function Convention_suivi_fp_dpfiController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
       
        vm.stepMenu_mpe=false;
        vm.stepMenu_moe=false;
        vm.stepjusti_d_tra_moe = false;
        vm.stepsuivi_paiement_mpe = false;

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
        vm.affiche_load =true;

/*******************************Debut initialisation suivi financement feffi******************************/
      
        //initialisation demande_realimentation_feffi
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;
        vm.alldemande_realimentation_invalide  = [] ;

        vm.permissionboutonValiderdpfi = false;
        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];

        vm.nbr_demande_feffi_emidpfi=0;
        vm.nbr_demande_feffi_encourdpfi=0;

        //initialisation piece_justificatif_feffi
        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;

        //initialisation decaissement fonctionnement feffi

        vm.showbuttonValidationenrejedpfi = false;
        vm.showbuttonValidationencourdpfi = false;        
        vm.showbuttonValidationdpfi = false;    

/*******************************Fin initialisation suivi financement feffi******************************/


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

        vm.showbuttonValidationFacture_moe_encourdpfi = false;
        vm.showbuttonValidationFacture_moe_rejedpfi = false;
        vm.showbuttonValidationFacture_moe_validedpfi = false;
/*********************************************Fin maitrise d'oeuvre*************************************/

/********************************************Debut entreprise******************************************/
       
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.selectedItemAvance_demarrage = {};
        vm.allavance_demarrage = [];
        vm.showbuttonValidationAvance_demarrage_encourdpfi = false;
        vm.showbuttonValidationAvance_demarrage_rejedpfi = false;
        vm.showbuttonValidationAvance_demarrage_validedpfi = false;


        vm.selectedItemFacture_mpe = {};
        vm.allfacture_mpe = [];

        vm.showbuttonValidationFacture_mpe_encourdpfi = false;
        vm.showbuttonValidationFacture_mpe_rejedpfi = false;
        vm.showbuttonValidationFacture_mpe_validedpfi = false;
       
        vm.selectedItemDemande_batiment_mpe = {};
        vm.alldemande_batiment_mpe = [];

        vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = false;
        vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_batiment_mpe_validedpfi = false;        

        vm.selectedItemDivers_attachement_batiment_travaux = {} ;
        vm.alldivers_attachement_batiment_travaux = [] ;

        vm.allrubrique_attachement_batiment_mpe=[];
        vm.selectedItemRubrique_attachement_batiment_mpe = {};
        
        vm.selectedItemDemande_latrine_mpe = {};
        vm.alldemande_latrine_mpe = [];

        vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = false;

        vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_latrine_mpe_validedpfi = false;

        vm.selectedItemDivers_attachement_latrine_travaux = {} ;
        vm.alldivers_attachement_latrine_travaux = [] ;

        vm.allrubrique_attachement_latrine_mpe=[];
        vm.selectedItemRubrique_attachement_latrine_mpe = {};
       
        vm.selectedItemDemande_mobilier_mpe = {};
        vm.alldemande_mobilier_mpe = [];

        vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = false;

        vm.allrubrique_attachement_mobilier_mpe=[];
        vm.selectedItemRubrique_attachement_mobilier_mpe = {};

        vm.selectedItemDivers_attachement_mobilier_travaux = {} ;
        vm.alldivers_attachement_mobilier_travaux = [] ;

        vm.selectedItemJustificatif_attachement_mpe = {} ;
        vm.alljustificatif_attachement_mpe = [] ;
       
/********************************************Fin entreprise********************************************/
       
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
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("DPFI")!= -1)
            {                                                        
                vm.session = 'DPFI';
                      
            }
            else
            {
                vm.session = 'ADMIN'; 
              
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
        /*{titre:"Avancement"
        },*/
        {titre:"Utilisateur"
        }]; 

        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionNeedvalidationpdfi').then(function(result)
        {   
            vm.allconvention_entete = result.data.response;
            vm.affiche_load =false;
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
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
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
            });*/
              
              vm.stepjusti_d_tra_moe = false;
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
        {titre:"Montant contrat"
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

  
      /*****************************************fin contrat moe******************************************************/

      
     
    /**************************************debut facture moe entete*********************************************/
      vm.click_step_suivi_paiement_moe = function()
      { vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("facture_moe_entete/index","menu","getfactureemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
        {
            vm.allfacture_moe_entete = result.data.response;
            vm.affiche_load =false;
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

        vm.validerFacture_moe_encourdpfi = function()
        {
          maj_in_baseFacture_moe_entete(vm.selectedItemFacture_moe_entete,0,2);
        }
        vm.validerFacture_moe_rejedpfi = function()
        {
          maj_in_baseFacture_moe_entete(vm.selectedItemFacture_moe_entete,0,3);
        }
        vm.validerFacture_moe_validedpfi = function()
        {
          maj_in_baseFacture_moe_entete(vm.selectedItemFacture_moe_entete,0,4);
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
              //facture_moe_entete.$selected = false;
              facture_moe_entete.$edit = false;
              //vm.selectedItemFacture_moe_entete = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

    /**************************************fin facture moe entete*********************************************/

    /**************************************debut facture moe detail*********************************************/

      vm.click_step_rubrique_calendrier_paie_moe = function()
      { vm.affiche_load =true;
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
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("facture_moe_detail/index","menu","getfacture_moe_detailwithcalendrier_detailbyentete",
                    "id_facture_moe_entete",vm.selectedItemFacture_moe_entete.id,"id_sousrubrique",vm.selectedItemSousrubrique_calendrier_paie_moe.id,
                    "id_contrat_bureau_etude",vm.selectedItemContrat_moe.id).then(function(result)
            {
                vm.allfacture_moe_detail = result.data.response;
                vm.affiche_load =false;
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
    {   vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("justificatif_facture_moe/index",'id_facture_moe_entete',vm.selectedItemFacture_moe_entete.id).then(function(result)
        {
            vm.alljustificatif_facture_moe = result.data.response;
            vm.affiche_load =false;
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
        }];
        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;            

           if(item.id!=0)
           {
                vm.validation_contrat_prestataire = item.validation;
           }
            vm.stepsuiviexecution = true;
            vm.stepavenant_mpe = true; 
            vm.stepsuivi_paiement_mpe = true; 
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
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavance_demarragevalidebcafBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavance_demarrage = result.data.response;
                vm.stepattachement_mpe = true;
                vm.affiche_load =false;
            });
            vm.styleTabfils = "acc_menu";
            vm.stepfacture_mpe = false;
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
        }];        
        //fonction selection item Demande_batiment_mpe
        vm.selectionAvance_demarrage= function (item)
        {
            vm.selectedItemAvance_demarrage = item;
           // vm.vm.NouvelItemAvance_demarrage   = item;
            
              vm.showbuttonValidationAvance_demarrage_encourdpfi = true;
              vm.showbuttonValidationAvance_demarrage_rejedpfi = true;
              vm.showbuttonValidationAvance_demarrage_validedpfi = true;
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

        vm.validerAvance_demarrage_encourdpfi = function()
        {
          maj_insert_avance_demarrage(vm.selectedItemAvance_demarrage,0,2);
        }
        vm.validerAvance_demarrage_rejedpfi = function()
        {
          maj_insert_avance_demarrage(vm.selectedItemAvance_demarrage,0,3);
        }
        vm.validerAvance_demarrage_validedpfi = function()
        {
          maj_insert_avance_demarrage(vm.selectedItemAvance_demarrage,0,4);
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
              vm.showbuttonValidationAvance_demarrage_encourdpfi = false;
              vm.showbuttonValidationAvance_demarrage_rejedpfi = false;
              vm.showbuttonValidationAvance_demarrage_validedpfi = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/ 

/************************************************debut facture*************************************************/
        vm.click_tab_facture_mpe = function()
        {
            vm.affiche_load =true;
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
                    vm.affiche_load =false;
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
        }];        

       
        //fonction selection item Demande_batiment_mpe
        vm.selectionFacture_mpe= function (item)
        {
            vm.selectedItemFacture_mpe = item;           
            vm.validation_facture_mpe = item.validation;
            vm.showbuttonValidationFacture_mpe_encourdpfi = true;
              vm.showbuttonValidationFacture_mpe_rejedpfi = true;
              vm.showbuttonValidationFacture_mpe_validedpfi = true;
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
        vm.validerFacture_mpe_encourdpfi = function(facture_mpe)
        {
          maj_insertFacture_mpe(facture_mpe,0,2);
        }
        vm.validerFacture_mpe_rejedpfi = function(facture_mpe)
        {
          maj_insertFacture_mpe(facture_mpe,0,3);
        }
        vm.validerFacture_mpe_validedpfi = function(facture_mpe)
        {
          maj_insertFacture_mpe(facture_mpe,0,4);
        }

        /*vm.validerFacture_mpe_encourdpfi = function()
        {
          maj_insertFacture_mpe(vm.selectedItemFacture_mpe,0,2);
        }
        vm.validerFacture_mpe_rejedpfi = function()
        {
          maj_insertFacture_mpe(vm.selectedItemFacture_mpe,0,3);
        }
        vm.validerFacture_mpe_validedpfi = function()
        {
          maj_insertFacture_mpe(vm.selectedItemFacture_mpe,0,4);
        }*/
            
        function maj_insertFacture_mpe(facture_mpe,suppression,validation)
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
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {                
                facture_mpe.validation = validation; 
              //facture_mpe.$selected = false;
              //vm.selectedItemFacture_mpe = {};
              vm.validation_facture_mpe = validation;
              vm.showbuttonValidationFacture_mpe_encourdpfi = false;
              vm.showbuttonValidationFacture_mpe_rejedpfi = false;
              vm.showbuttonValidationFacture_mpe_validedpfi = false;
              console.log(data.data);
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/
        /************************************************debut Decompte*************************************************/
        vm.click_tab_decompte_mpe = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getdecompte_mpeBycontratandfacture",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id,'id_facture_mpe',vm.id_facture_mpe).then(function(result)
            {
                vm.decompte_mpes = result.data.response[0];
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

/************************************************debut attachement*************************************************/
        vm.click_tabs_attachement_travaux = function()
        {   vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("attachement_travaux/index","menu","getattachement_travauxneedvalidationdpfiBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allattachement_travaux = result.data.response;
                vm.stepbatiment_mpe = false;                
                vm.steplatrine_mpe = false;
                vm.stepmobilier_mpe = false;

                vm.steprubriquebatiment_mpe = false;
                vm.steprubriquelatrine_mpe = false;                
                vm.steprubriquemobilier_mpe = false;

                vm.stepattachement_batiment_travaux = false;
                vm.stepattachement_latrine_travaux = false;
                vm.stepattachement_mobilier_travaux = false;
                vm.affiche_load =false;
            });
                        
            vm.stepfacture_mpe = false;
            vm.stepjusti_attachement_mpe = false;
            vm.stepdecompte =false;
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
        }];        

       
        //fonction selection item Demande_batiment_mpe
        vm.selectionAttachement_travaux= function (item)
        {
            vm.selectedItemAttachement_travaux = item;
           // vm.vm.NouvelItemAttachement_travaux   = item;
           if (item.$edit==false || item.$edit==undefined)
           {
                apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
                {
                   vm.allfacture_mpe = result.data.response;
                    if (vm.allfacture_mpe.length>0)
                    {
                        vm.validation_facture_mpe = vm.allfacture_mpe[0].validation; 

                        vm.id_facture_mpe = parseInt(result.data.response[0].id);
                    }else{
                        vm.validation_facture_mpe = 0;
                        vm.id_facture_mpe = 0;
                    }
                });

                apiFactory.getAPIgeneraliserREST("justificatif_attachement_mpe/index",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
                {
                    vm.alljustificatif_attachement_mpe = result.data.response;
                });

                vm.stepbatiment_mpe = true;
                vm.steplatrine_mpe = true;
                vm.stepmobilier_mpe = true;
                vm.stepfacture_mpe = true;
                vm.stepjusti_attachement_mpe = true;
                vm.stepdecompte =true;
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

       
/************************************************fin attachement***************************************************/
 
  

/************************************************debut batiment_mpe*************************************************/
        vm.click_tab_tranche_batiment = function()
        {   vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_batiment_mpe = result.data.response;
                vm.affiche_load =false;                
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
        {titre:"Calendrier de paiement"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        }];

       
        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           if(item.id!=0)
           {
                vm.stepattachement_batiment_travaux = true;
                vm.steprubriquebatiment_mpe = true;
           }
            vm.validation_demande_batiment_mpe = item.validation;   
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
        {titre:"Pourcentage"
        }];

        vm.click_rubrique_attachement_batiment_mpe = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment/index","menu","getrubrique_attachement_withmontantbycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_demande_batiment_mpe",vm.selectedItemDemande_batiment_mpe.id).then(function(result)
            {   
                vm.allrubrique_attachement_batiment_mpe= result.data.response;
                vm.affiche_load =false;
                vm.stepattachement_batiment_travaux = false;
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
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_periode += parseFloat(product.montant_periode);
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
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
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
            if (vm.allrubrique_attachement_batiment_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_batiment_mpe.length; i++){
                    var product = vm.allrubrique_attachement_batiment_mpe[i];
                    total_cumul += parseFloat(product.montant_cumul);
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

            
            var nbr=parseFloat(periode_pourcentage);
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

            
            var nbr=parseFloat(anterieur_pourcentage);
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

            
            var nbr=parseFloat(total_pourcentage);
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
        vm.click_tab_attachement_batiment_travaux = function()
        {
             vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_batiment_travaux/index","menu","getattachement_batimenttravauxbydemande",
                    "id_demande_batiment_mpe",vm.selectedItemDemande_batiment_mpe.id,"id_attachement_batiment",vm.selectedItemRubrique_attachement_batiment_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_batiment_travaux = result.data.response;
                vm.affiche_load =false;
            });
        }
        
        //fonction selection item justificatif batiment
        vm.selectionDivers_attachement_batiment_travaux= function (item)
        {
            vm.selectedItemDivers_attachement_batiment_travaux = item;
           
            
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

       
    /******************************************fin attachement batiment travaux***********************************************/

/************************************************debut latrine_mpe*************************************************/

        vm.click_tab_tranche_latrine = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_latrine_mpe = result.data.response;
                vm.affiche_load =false;
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
        {titre:"Calendrier de paiement"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        }];
 
        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item;
           if(item.id!=0)
           {
                vm.stepattachement_latrine_travaux = true;                
                vm.steprubriquelatrine_mpe = true;           
           }
            vm.validation_demande_latrine_mpe = item.validation;   
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
        {titre:"Pourcentage"
        }];

        vm.click_rubrique_attachement_latrine_mpe = function()
        {
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine/index","menu","getrubrique_attachement_withmontantbycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_demande_latrine_mpe",vm.selectedItemDemande_latrine_mpe.id).then(function(result)
            {   
                vm.allrubrique_attachement_latrine_mpe= result.data.response;
                console.log(vm.allrubrique_attachement_latrine_mpe);
                vm.stepattachement_latrine_travaux = false;
                vm.affiche_load =false;
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

        vm.Total_periode_latrine_mpe = function(){
            var total_periode = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_periode += parseFloat(product.montant_periode);
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

        vm.Total_anterieur_latrine_mpe = function(){
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
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

        vm.Total_cumul_latrine_mpe = function(){
            var total_cumul = 0;
            if (vm.allrubrique_attachement_latrine_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_latrine_mpe.length; i++){
                    var product = vm.allrubrique_attachement_latrine_mpe[i];
                    total_cumul += parseFloat(product.montant_cumul);
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

            var nbr=parseFloat(periode_pourcentage);
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

            var nbr=parseFloat(anterieur_pourcentage);
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

           
            var nbr=parseFloat(total_pourcentage);
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
        vm.click_tab_attachement_latrine_travaux = function()
        {   
            vm.affiche_load =true;          
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_travaux/index","menu","getattachement_latrinetravauxbydemande",
                    "id_demande_latrine_mpe",vm.selectedItemDemande_latrine_mpe.id,"id_attachement_latrine",vm.selectedItemRubrique_attachement_latrine_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_travaux = result.data.response;
                console.log(vm.alldivers_attachement_latrine_travaux);
                vm.affiche_load =false;
            });
        }
       
        //fonction selection item justificatif latrine
        vm.selectionDivers_attachement_latrine_travaux= function (item)
        {
            vm.selectedItemDivers_attachement_latrine_travaux = item;
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

       
    /******************************************fin attachement latrine travaux***********************************************/



/************************************************debut mobilier_mpe*************************************************/

        vm.click_tab_tranche_mobilier = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandeByattachement",'id_attachement_travaux',vm.selectedItemAttachement_travaux.id).then(function(result)
            {
                vm.alldemande_mobilier_mpe = result.data.response;
                vm.affiche_load =false;
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
        {titre:"Calendrier de paiement"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        }];

   
        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item;
           if(item.id!=0)
           {
              vm.stepattachement_mobilier_travaux = true;
              vm.steprubriquemobilier_mpe = true;            
           }
            vm.validation_demande_mobilier_mpe = item.validation;  
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
        {titre:"Pourcentage"
        }];

        vm.click_rubrique_attachement_mobilier_mpe = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier/index","menu","getrubrique_attachement_withmontantbycontrat","id_contrat_prestataire",vm.selectedItemContrat_prestataire.id,"id_demande_mobilier_mpe",vm.selectedItemDemande_mobilier_mpe.id).then(function(result)
            {   
                vm.allrubrique_attachement_mobilier_mpe= result.data.response;
                console.log(vm.allrubrique_attachement_mobilier_mpe);
                vm.stepattachement_mobilier_travaux = false;
                vm.affiche_load =false;
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

        vm.Total_periode_mobilier_mpe = function(){
            var total_periode = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_periode += parseFloat(product.montant_periode);
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

        vm.Total_anterieur_mobilier_mpe = function(){
            var total_anterieur = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_anterieur += parseFloat(product.montant_anterieur);
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

        vm.Total_cumul_mobilier_mpe = function(){
            var total_cumul = 0;
            if (vm.allrubrique_attachement_mobilier_mpe.length!=0)
            {                
                for(var i = 0; i < vm.allrubrique_attachement_mobilier_mpe.length; i++){
                    var product = vm.allrubrique_attachement_mobilier_mpe[i];
                    total_cumul += parseFloat(product.montant_cumul);
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

            
            var nbr=parseFloat(periode_pourcentage);
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

            var nbr=parseFloat(anterieur_pourcentage);
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

            var nbr=parseFloat(total_pourcentage);
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
        vm.click_tab_attachement_mobilier_travaux = function()
        {
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_travaux/index","menu","getattachement_mobiliertravauxbydemande",
                    "id_demande_mobilier_mpe",vm.selectedItemDemande_mobilier_mpe.id,"id_attachement_mobilier",vm.selectedItemRubrique_attachement_mobilier_mpe.id,
                    "id_contrat_prestataire",vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_travaux = result.data.response;
                vm.affiche_load =false;
            });
        }
        //fonction selection item justificatif mobilier
        vm.selectionDivers_attachement_mobilier_travaux= function (item)
        {
            vm.selectedItemDivers_attachement_mobilier_travaux = item;
            
            
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

       
    /******************************************fin attachement mobilier travaux***********************************************/

    /**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_attachement_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

         //fonction selection item justificatif facture_mpe
        vm.selectionJustificatif_attachement_mpe= function (item)
        {
            vm.selectedItemJustificatif_attachement_mpe = item;
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
        vm.download_piece_attachement_mpe = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
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
