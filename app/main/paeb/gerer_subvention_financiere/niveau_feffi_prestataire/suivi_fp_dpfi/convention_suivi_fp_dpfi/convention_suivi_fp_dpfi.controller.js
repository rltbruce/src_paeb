
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

        vm.session = '';

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

        vm.selectedItemDemande_debut_travaux_moe = {};
        vm.alldemande_debut_travaux_moe = [];

        vm.alldemande_debut_travaux_moe = [];
        vm.showbuttonValidationDemande_debut_travaux_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_debut_travaux_moe_rejedpfi = false;  
        vm.showbuttonValidationDemande_debut_travaux_moe_validedpfi = false;

        vm.selectedItemJustificatif_debut_travaux_moe = {} ;
        vm.alljustificatif_debut_travaux_moe = [] ;

        vm.selectedItemDemande_batiment_moe = {};
        vm.alldemande_batiment_moe = [];

        vm.alldemande_batiment_moe = [];

        vm.showbuttonValidationDemande_batiment_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_batiment_moe_rejedpfi = false;
 
        vm.selectedItemJustificatif_batiment_moe = {} ;
        vm.alljustificatif_batiment_moe = [] ;
       
        vm.selectedItemDemande_latrine_moe = {};
        vm.alldemande_latrine_moe = [];

        vm.alldemande_latrine_moe = [];

        vm.showbuttonValidationDemande_latrine_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_latrine_moe_rejedpfi = false;
        vm.showbuttonValidationDemande_latrine_moe_validedpfi = false;
        
        vm.selectedItemJustificatif_latrine_moe = {} ;
        vm.alljustificatif_latrine_moe = [] ;
        
        vm.selectedItemDemande_fin_travaux_moe = {};
        vm.alldemande_fin_travaux_moe = [];

        vm.showbuttonValidationDemande_fin_travaux_moe_encourdpfi = false;
        vm.showbuttonValidationDemande_fin_travaux_moe_rejedpfi = false;
        vm.showbuttonValidationDemande_fin_travaux_moe_validedpfi = false;

        vm.selectedItemJustificatif_fin_travaux_moe = {} ;
        vm.alljustificatif_fin_travaux_moe = [] ;        

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
        
        vm.selectedItemDemande_latrine_mpe = {};
        vm.alldemande_latrine_mpe = [];

        vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = false;

        vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_latrine_mpe_validedpfi = false;

        vm.selectedItemDivers_attachement_latrine_travaux = {} ;
        vm.alldivers_attachement_latrine_travaux = [] ;
       
        vm.selectedItemDemande_mobilier_mpe = {};
        vm.alldemande_mobilier_mpe = [];

        vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = false;
        vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = false;

        vm.selectedItemDivers_attachement_mobilier_travaux = {} ;
        vm.alldivers_attachement_mobilier_travaux = [] ;
       
/********************************************Fin entreprise********************************************/
       
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

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
                  case 'DPFI':                                                        
                            vm.session = 'DPFI';
                      
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

        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionNeedvalidationpdfi').then(function(result)
        {
                vm.allconvention_entete = result.data.response;
                console.log(vm.allconvention_entete);
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
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                console.log(vm.allconvention_entete);
            });
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
        
        function donnee_menu_moe(item,session)
        {   vm.showbuttonNouvcontrat_moe=true;
            return new Promise(function (resolve, reject) 
            {
                switch (session)
                {
                  
                  case 'DPFI':
                           apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allcontrat_moe = result.data.response;
                                vm.showbuttonNouvcontrat_moe=false;
                                return resolve('ok');
                            });
                                               
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allcontrat_moe = result.data.response;
                                vm.showbuttonNouvcontrat_moe=false;
                                return resolve('ok');
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
                  case 'DPFI':
                            
                            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allcontrat_prestataire = result.data.response;
                                    
                                return resolve('ok');
                            });
                       
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratvalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.allcontrat_prestataire = result.data.response;
                                    
                                return resolve('ok');
                            });                            
                       
                      break;
                  default:
                      break;
              
                }            
            });
        }   


  
  
  /******************************************debut maitrise d'oeuvre*****************************************************/

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
                  
                  if(vm.roles.indexOf("DPFI")!= -1)
                  {
                      
                     apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
                    });
                  }

                  
                  if(vm.roles.indexOf("ADMIN")!= -1)
                  {
                      apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_debut_travaux_moe = result.data.response;
                      console.log(vm.alldemande_debut_travaux_moe);
                    });
                     apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_batiment_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_latrine_moe = result.data.response;
                    });
                     apiFactory.getAPIgeneraliserREST("demande_fin_travaux_moe/index","menu","getdemandeemidpfiBycontrat",'id_contrat_bureau_etude',vm.selectedItemContrat_moe.id).then(function(result)
                    {
                      vm.alldemande_fin_travaux_moe = result.data.response;
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

  
      /*****************************************fin contrat moe******************************************************/

      
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
        }];
        //fonction selection item Demande_debut_travaux_moe
        vm.selectionDemande_debut_travaux_moe= function (item)
        {
            vm.selectedItemDemande_debut_travaux_moe = item;
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_debut_travaux_moe/index",'id_demande_debut_travaux',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
                {
                    vm.alljustificatif_debut_travaux_moe = result.data.response;
                    console.log(vm.alljustificatif_debut_travaux_moe);
                });                 

                vm.showbuttonValidationDemande_debut_travaux_moe_encourdpfi = true;
                vm.showbuttonValidationDemande_debut_travaux_moe_rejedpfi = true;
                vm.showbuttonValidationDemande_debut_travaux_moe_validedpfi = true;               
            
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
        
        //fonction selection item justificatif debut_travaux
        vm.selectionJustificatif_debut_travaux_moe= function (item)
        {
            vm.selectedItemJustificatif_debut_travaux_moe = item; 
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
        }];
     
        //fonction selection item Demande_batiment_moe
        vm.selectionDemande_batiment_moe= function (item)
        {
            vm.selectedItemDemande_batiment_moe = item;
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_batiment_moe/index",'id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
                {
                    vm.alljustificatif_batiment_moe = result.data.response;
                    console.log(vm.alljustificatif_batiment_moe);
                }); 

                vm.showbuttonValidationDemande_batiment_moe_encourdpfi = true;
                vm.showbuttonValidationDemande_batiment_moe_rejedpfi = true;
                vm.showbuttonValidationDemande_batiment_moe_validedpfi = true;               
            
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

     
        //fonction selection item justificatif batiment_moe
        vm.selectionJustificatif_batiment_moe= function (item)
        {
            vm.selectedItemJustificatif_batiment_moe = item;
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
        }];


        //fonction selection item Demande_latrine_moe
        vm.selectionDemande_latrine_moe= function (item)
        {
            vm.selectedItemDemande_latrine_moe = item;
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_latrine_moe/index",'id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
                {
                    vm.alljustificatif_latrine_moe = result.data.response;
                    console.log(vm.alljustificatif_latrine_moe);
                });

                  vm.showbuttonValidationDemande_latrine_moe_encourdpfi = true;
                  vm.showbuttonValidationDemande_latrine_moe_rejedpfi = true;
                  vm.showbuttonValidationDemande_latrine_moe_validedpfi = true;
                            
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

        //fonction selection item justificatif latrine_moe
        vm.selectionJustificatif_latrine_moe= function (item)
        {
            vm.selectedItemJustificatif_latrine_moe = item;
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
        }];

        //fonction selection item Demande_fin_travaux_moe
        vm.selectionDemande_fin_travaux_moe= function (item)
        {
            vm.selectedItemDemande_fin_travaux_moe = item;
           if(item.id!=0)
           {
               apiFactory.getAPIgeneraliserREST("justificatif_fin_travaux_moe/index",'id_demande_fin_travaux',vm.selectedItemDemande_fin_travaux_moe.id).then(function(result)
                {
                    vm.alljustificatif_fin_travaux_moe = result.data.response;
                    console.log(vm.alljustificatif_fin_travaux_moe);
                });


                  vm.showbuttonValidationDemande_fin_travaux_moe_encourdpfi = true;
                  vm.showbuttonValidationDemande_fin_travaux_moe_rejedpfi = true;
                  vm.showbuttonValidationDemande_fin_travaux_moe_validedpfi = true;
                            
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

        //fonction selection item justificatif fin_travaux
        vm.selectionJustificatif_fin_travaux_moe= function (item)
        {
            vm.selectedItemJustificatif_fin_travaux_moe = item;
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
   
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif fin_travaux**********************************************/


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
        }];
        //fonction selection item contrat
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;            

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
            vm.showbuttonValidationcontrat_prestataire = true;
            vm.validation_contrat_prestataire = item.validation;
             /* switch (vm.session)
              {
                
                case 'DPFI':
                          
                          apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_batiment_mpe = result.data.response;
                            });
                           apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_latrine_mpe = result.data.response;
                            });
                            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_mobilier_mpe = result.data.response;
                            });

                            apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.allavenant_mpe = result.data.response;
                            });
                     
                    break;

                case 'ADMIN':
                          apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_batiment_mpe = result.data.response;
                            });
                           apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_latrine_mpe = result.data.response;
                            });
                            apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index","menu","getdemandevalidebcafBycontrat",'id_contrat_prestataire',item.id).then(function(result)
                            {
                              vm.alldemande_mobilier_mpe = result.data.response;
                            });

                            apiFactory.getAPIgeneraliserREST("avenant_prestataire/index","menu","getavenantvalideBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
                            {
                              vm.allavenant_mpe = result.data.response;
                            }); 
                    
                     
                    break;
                default:
                    break;
            
              }*/
              
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
            apiFactory.getAPIgeneraliserREST("avance_demarrage/index","menu","getavance_demarragevalidebcafBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allavance_demarrage = result.data.response;
            });
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
            apiFactory.getAPIgeneraliserREST("facture_mpe/index","menu","getfacture_mpevalidebcafBycontrat",'id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
            {
                vm.allfacture_mpe = result.data.response;
                console.log(vm.allfacture_mpe);
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

        vm.validerFacture_mpe_encourdpfi = function()
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
        }
            
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
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("facture_mpe/index",datas, config).success(function (data)
            {                
                facture_mpe.validation = validation; 
              facture_mpe.$selected = false;
              vm.selectedItemFacture_mpe = {};

              vm.showbuttonValidationFacture_mpe_encourdpfi = false;
              vm.showbuttonValidationFacture_mpe_rejedpfi = false;
              vm.showbuttonValidationFacture_mpe_validedpfi = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

/************************************************fin avance demarrage***************************************************/

/************************************************debut attachement*************************************************/
        vm.click_tabs_attachement_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("attachement_travaux/index","menu","getattachement_travauxByfacture",'id_facture_mpe',vm.selectedItemFacture_mpe.id).then(function(result)
            {
                vm.allattachement_travaux = result.data.response;
                if (result.data.response.length>0)
                {
                    vm.showbuttonNouvAttachement_travaux = false;
                }
            });
            console.log('okok');
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
        }];

       
        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           if(item.id!=0)
           {            
              vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = true;
              vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = true;
              vm.showbuttonValidationDemande_batiment_mpe_validedpfi = true;
              vm.stepattachement_batiment_travaux = true;
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
        }];
 
        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item;
           if(item.id!=0)
           {
              vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = true;
              vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = true;
              vm.showbuttonValidationDemande_latrine_mpe_validedpfi = true;
              vm.stepattachement_latrine_travaux = true;
           
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


/**********************************************debut attachement latrine travauxe***************************************************/
        vm.click_tab_attachement_latrine_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_latrine_travaux/index","menu","getdivers_attachementByDemande",'id_demande_latrine_mpe',vm.selectedItemDemande_latrine_mpe.id).then(function(result)
            {
                vm.alldivers_attachement_latrine_travaux= result.data.response;
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
        }];

   
        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item;
           if(item.id!=0)
           {

              vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = true;
              vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = true;
              vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = true;
              vm.stepattachement_mobilier_travaux = true;
            
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


/**********************************************debut attachement mobilier travauxe***************************************************/
        vm.click_tab_attachement_mobilier_travaux = function()
        {
            apiFactory.getAPIgeneraliserREST("divers_attachement_mobilier_travaux/index","menu","getdivers_attachementByDemande",'id_demande_mobilier_mpe',vm.selectedItemDemande_mobilier_mpe.id).then(function(result)
            {
                vm.alldivers_attachement_mobilier_travaux= result.data.response;
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
