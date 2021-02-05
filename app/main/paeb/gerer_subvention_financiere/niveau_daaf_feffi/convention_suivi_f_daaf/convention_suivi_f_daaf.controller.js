
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.convention_suivi_f_daaf')        
        .controller('Convention_suivi_f_daafController', Convention_suivi_f_daafController);
    /** @ngInject */
    function Convention_suivi_f_daafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;       
        
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;

        vm.session = '';
        vm.affiche_load =true;


/*******************************Debut initialisation suivi financement feffi******************************/ 
        
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;
        vm.alldemande_realimentation_invalide  = [] ;
        vm.validation = 0;

        vm.roles = [];
        vm.nbr_demande_feffi_emidaaf=0;
        vm.nbr_demande_feffi_encourdaaf=0;

        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;
        
        vm.showbuttonValidationenrejedaaf = false;
        vm.showbuttonValidationencourdaaf = false;        
        vm.showbuttonValidationdaaf = false;       

        var NouvelItemTransfert_daaf = false;
        var currentItemTransfert_daaf;
        vm.selectedItemTransfert_daaf = {} ;
        vm.ajoutTransfert_daaf  = ajoutTransfert_daaf ;
        vm.alltransfert_daaf=[];
        vm.showbuttonValidation_trans_daaf = false;   

/*******************************Fin initialisation suivi financement feffi******************************/     

/*******************************************Debut maitrise d'oeuvre*************************************/        
       
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

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
        /* apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("DAAF")!= -1)
            {
                            vm.usercisco = result.data.response.cisco;                             
                            
                            vm.session = 'DAAF'; 
            }else
            {
                            vm.usercisco = result.data.response.cisco;                            
                            
                            vm.session = 'ADMIN';
              
            }                  

         });*/

        /***************debut convention cisco/feffi**********/


        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionNeeddemandefeffivalidationdaaf').then(function(result)
        {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;

        });

        vm.convention_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Site"
        },
        {titre:"Accés"
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
       

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
            });

              /*switch (vm.session)
                {                                     
                  case 'DAAF':
                            
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu',
                                'getconventionvalideufpBydate','date_debut',date_debut,'date_fin',
                                date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,
                                'id_convention_entete',filtre.id_convention_entete).then(function(result)
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
              
                }*/
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;         
            vm.stepMenu_feffi=true;
           /* donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });*/
                          
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
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
       
        vm.step_menu_demande = function()
        {   
            vm.affiche_load =true;

          vm.steppiecefeffi=false;
          vm.steptransdaaf=false;
          //vm.showbuttonValidationencourdaaf= false;
          vm.showbuttonValidationdaaf = false;
          vm.showbuttonValidationenrejedaaf = false;
             apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeemidaafByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                vm.alldemande_realimentation_invalide = result.data.response; 
                vm.affiche_load =false;
            });
        
        }               

/*****************Debut StepTwo demande_realimentation_feffi****************/

      vm.demande_realimentation_column = [                
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Antérieur"},
        {titre:"Cumul"},
        {titre:"Calendrier de paiement"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Nom banque"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Situation"}];     
        
        //fonction ajout dans bdd
             //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            vm.showbuttonNouvtransfert_daaf = true;
            if (item.$selected ==false || item.$selected == undefined)
            {
                vm.validation = item.validation;
                vm.steppiecefeffi=true;
                vm.steptransdaaf=true;
                
                vm.showbuttonValidationenrejedaaf = true;
                //vm.showbuttonValidationencourdaaf = true;        
                vm.showbuttonValidationdaaf = true;
            }
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

    

        vm.valider_demande = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
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
                    date: convertionDate(demande_realimentation.date) ,
                    validation: validation ,
                    id_convention_cife_entete: vm.selectedItemConvention_entete.id              
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
                //vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)-1;

                vm.showbuttonValidationenrejedaaf = false;
                vm.showbuttonValidationencourdaaf = false;
                vm.showbuttonValidationdaaf = false;

                if (validation==7)
                {
                    var items = {
                        id:        '0',      
                        montant_transfert:    demande_realimentation.prevu,
                        frais_bancaire:    0,
                        montant_total: demande_realimentation.prevu,
                        observation: '',
                        date: convertionDate(new Date()), 
                        id_demande_rea_feffi: demande_realimentation.id,
                        validation:0
                    };
                    insert_in_baseautoTransfert_daaf(items,0);
                }

            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Validée par DPFI';                  
                  break;

             case '2':
                  
                  return 'Rejetée par UFP'; 
                  break;
              case '3':                  
                  return 'Validée par UFP'; 
                  break;
             
             case '5':                  
                  return 'Validée par DPFI'; 
                  break;
             case '6':                  
                  return 'Rejetée par DAAF'; 
                  break;
              case '7':                  
                  return 'Validée par DAAF'; 
                  break;
              
              default:
                  break;
          
            }
        }
        /*vm.situationdemande = function(validation)
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
                  
                  return 'Rejeté par DAAF'; 
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
        }*/
  
  /*************************Fin StepTwo demande_realimentation_feffi***************************************/


  /*********************************Fin StepThree piece_justificatif_feffi*******************************/

        vm.step_justificatif = function()
        {   
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',vm.selectedItemDemande_realimentation.id,'id_tranche',vm.selectedItemDemande_realimentation.tranche.id).then(function(result)
            {
                vm.allpiece_justificatif_feffi = result.data.response;
                vm.affiche_load = false;
            });
        }
        vm.piece_justificatif_feffi_column = [
        {titre:"Description"},
        {titre:"Fichier"},
        {titre:"Action"}];


        //fonction selection item Piece_justificatif_feffi
        vm.selectionPiece_justificatif_feffi= function (item)
        {
            vm.selectedItemPiece_justificatif_feffi = item;
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
            $scope.vm.allpiece_justificatif_feffi.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.description = vm.selectedItemPiece_justificatif_feffi.description ;
            item.fichier = vm.selectedItemPiece_justificatif_feffi.fichier ;
            item.date    = new Date(vm.selectedItemPiece_justificatif_feffi.date );  
        };

    
         vm.download_piece_justificatif = function(item)
        {//console.log(item.fichier);
            window.open(apiUrlFile+item.fichier);
        }


  /**********************************Fin StepThree piece_justificatif_feffi****************************/


  /*************************************debut StepThree transfert daaf********************************/
          vm.step_transfert_daaf = function()
            {   
                vm.affiche_load =true;
                vm.showbuttonValidation_trans_daaf = false;
                apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferBydemande','id_demande_rea_feffi',vm.selectedItemDemande_realimentation.id).then(function(result)
                {
                    vm.alltransfert_daaf = result.data.response;
                    vm.affiche_load =false;                      
                });
            }
          //col table
            vm.transfert_daaf_column = [
            {titre:"Montant transféré"},        
            {titre:"Frais bancaire"},
            {titre:"Montant total"},
            {titre:"Date"},
            {titre:"Situation"},
            {titre:"Observation"},
            {titre:"Action"}];

            //fonction ajout dans bdd
            function ajoutTransfert_daaf(transfert_daaf,suppression)
            {
                if (NouvelItemTransfert_daaf==false)
                {
                    apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu',"gettransfert_daafvalideById",'id_transfert_daaf',transfert_daaf.id).then(function(result)
                    {
                      var transfert_daaf_valide = result.data.response;
                      
                      if (transfert_daaf_valide.length !=0)
                      {
                          var confirm = $mdDialog.confirm()
                        .title('cette modification n\'est pas autorisé.')
                        .textContent(' Les données sont déjà validées!')
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('Fermer')
                        
                        $mdDialog.show(confirm).then(function()
                        { 
                          vm.alltransfert_daaf = transfert_daaf_valide;
                        vm.showbuttonValidation_trans_daaf = false;
                          //vm.selectedItemJustificatif_feffi = {} ;

                        }, function() {
                          //alert('rien');
                        });
                      }
                      else
                      {
                        test_existanceTransfert_daaf (transfert_daaf,suppression); 
                      }
                    }); 
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
                if (item.$edit == false || item.$edit==undefined)
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

                item.montant_transfert = parseFloat(vm.selectedItemTransfert_daaf.montant_transfert) ;
                item.frais_bancaire = parseFloat(vm.selectedItemTransfert_daaf.frais_bancaire) ;
                item.montant_total = parseFloat(vm.selectedItemTransfert_daaf.montant_total );
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
                        date: convertionDate(transfert_daaf.date), 
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
                        date: convertionDate(transfert_daaf.date), 
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

        function insert_in_baseautoTransfert_daaf(transfert_daaf,suppression)
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
                        date: transfert_daaf.date, 
                        id_demande_rea_feffi: transfert_daaf.id_demande_rea_feffi,
                        validation:transfert_daaf.validation           
                    });
                    //console.log(datas);
                    //factory
                apiFactory.add("transfert_daaf/index",datas, config).success(function (data)
                {
              }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


            }
  /**********************************Fin StepThree transfert daaf***********************************/
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
