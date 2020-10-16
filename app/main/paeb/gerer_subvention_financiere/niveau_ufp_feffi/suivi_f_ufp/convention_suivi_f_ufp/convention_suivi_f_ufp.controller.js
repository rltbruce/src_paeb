
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_feffi.suivi_f_ufp.convention_suivi_f_ufp')        
        .controller('Convention_suivi_f_ufpController', Convention_suivi_f_ufpController);
    /** @ngInject */
    function Convention_suivi_f_ufpController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;       
        
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransufp=false;

        vm.session = '';
        vm.affiche_load =true;

/*******************************Debut initialisation suivi financement feffi******************************/ 
        
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;
        vm.alldemande_realimentation_invalide  = [] ;
        vm.validation = 0;

        vm.roles = [];
        vm.nbr_demande_feffi_emiufp=0;
        vm.nbr_demande_feffi_encourufp=0;

        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;
        
        vm.showbuttonValidationenrejeufp = false;
        vm.showbuttonValidationencourufp = false;        
        vm.showbuttonValidationufp = false;       

        var NouvelItemTransfert_ufp = false;
        var currentItemTransfert_ufp;
        vm.selectedItemTransfert_ufp = {} ;
        vm.ajoutTransfert_ufp  = ajoutTransfert_ufp ;
        vm.alltransfert_ufp=[];
        vm.showbuttonValidation_trans_ufp = false;   


        vm.showbuttonNouvtransfert_ufp= true; 

/*******************************Fin initialisation suivi financement feffi******************************/     

/*******************************************Debut maitrise d'oeuvre*************************************/        
       
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

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
                  case 'UFP':
                            vm.usercisco = result.data.response.cisco; 
                            vm.permissionboutonencourufp = true;
                            vm.permissionboutonenrejeufp = true;
                            vm.permissionboutonvaliderufp = true;
                            vm.permissionboutonvalidertrans_ufp = true;                            
                            
                            vm.session = 'UFP'; 
                      break;                                    
                  case 'ADMIN':
                            vm.usercisco = result.data.response.cisco; 
                            vm.permissionboutonencourufp = true;
                            vm.permissionboutonenrejeufp = true;
                            vm.permissionboutonvaliderufp = true;
                            vm.permissionboutonvalidertrans_ufp = true;                            
                            
                            vm.session = 'ADMIN'; 
                      break;
                  
                  default:
                      break;
              
                }                  

         });

        /***************debut convention cisco/feffi**********/


        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionNeeddemandefeffivalidationpdfi').then(function(result)
        {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
        });

        vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Site"
        },
        {titre:"Accès"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
       /* {titre:"Avancement"
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
                  case 'UFP':
                            
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
                                console.log(vm.allconvention_entete);
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
         
            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });
                          
              vm.steppiecefeffi=false;
              vm.steptransufp=false;
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
       
        function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeemiufpByconvention",'id_convention_cife_entete',item.id).then(function(result)
                {
                        vm.alldemande_realimentation_invalide = result.data.response;
                        return resolve('ok');            
                });           
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
            vm.showbuttonNouvtransfert_ufp = true;
            if (item.$selected ==false || item.$selected == undefined)
            {
               //recuperation donnée demande_realimentation_feffi
                apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',item.id,'id_tranche',item.tranche.id).then(function(result)
                {
                    vm.allpiece_justificatif_feffi = result.data.response;
                });
               
                apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferBydemande','id_demande_rea_feffi',item.id).then(function(result)
                {
                    vm.alltransfert_ufp = result.data.response;
                    if (vm.alltransfert_ufp.length>0)
                      {
                        vm.showbuttonNouvtransfert_ufp = false;
                      }
                });                      
                  
                
                console.log(item.validation);
                vm.validation = item.validation;
                vm.steppiecefeffi=true;
                vm.steptransufp=true;
                
                vm.showbuttonValidationenrejeufp = true;
                vm.showbuttonValidationencourufp = true;        
                vm.showbuttonValidationufp = true;
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

        vm.valider_demandeemiufp = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_emiufp = parseInt(vm.nbr_demande_feffi_emiufp)-1;
            vm.nbr_demande_feffi_encourufp = parseInt(vm.nbr_demande_feffi_encourufp)+1;
        }
        vm.rejeter_demandeufp = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_encourufp = parseInt(vm.nbr_demande_feffi_encourufp)-1;
        }
        vm.valider_demande_final = function(validation)
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,validation);
            vm.nbr_demande_feffi_encourufp = parseInt(vm.nbr_demande_feffi_encourufp)-1;
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

                vm.showbuttonValidationenrejeufp = false;
                vm.showbuttonValidationencourufp = false;
                vm.showbuttonValidationufp = false;

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
                    insert_in_baseautoTransfert_ufp(items,0);
                }

            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Validé par BCAF';                  
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

              case '8':    
                  return 'En cours de traitement UFP'; 
                  break;

              case '9':
                  
                  return 'Rejeté par UFP'; 
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
            window.location = apiUrlFile+item.fichier;
        }


  /**********************************Fin StepThree piece_justificatif_feffi****************************/


  /*************************************debut StepThree transfert ufp********************************/
          //col table
            vm.transfert_ufp_column = [
            {titre:"Montant transféré"},        
            {titre:"Frais bancaire"},
            {titre:"Montant total"},
            {titre:"Date"},
            {titre:"Situation"},
            {titre:"Observation"},
            {titre:"Action"}];

            vm.ajouterTransfert_ufp = function ()
            { 
              if (NouvelItemTransfert_ufp == false)
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
                vm.alltransfert_ufp.push(items);
                vm.alltransfert_ufp.forEach(function(conv)
                {
                  if(conv.$selected==true)
                  {
                    vm.selectedItemTransfert_ufp = conv;
                  }
                });

                NouvelItemTransfert_ufp = true ;
              }else
              {
                vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
              }                
                          
            };

            //fonction ajout dans bdd
            function ajoutTransfert_ufp(transfert_ufp,suppression)
            {
                if (NouvelItemTransfert_ufp==false)
                {
                    test_existanceTransfert_ufp (transfert_ufp,suppression); 
                } 
                else
                {
                    insert_in_baseTransfert_ufp(transfert_ufp,suppression);
                }
            }

            //fonction de bouton d'annulation transfert_ufp
            vm.annulerTransfert_ufp = function(item)
            {
              if (NouvelItemTransfert_ufp == false)
              {
                  item.$edit = false;
                  item.$selected = false;

                  item.montant_transfert = currentItemTransfert_ufp.montant_transfert;
                  item.frais_bancaire = currentItemTransfert_ufp.frais_bancaire;
                  item.montant_total = currentItemTransfert_ufp.montant_total;
                  item.date = currentItemTransfert_ufp.date;
                  item.observation    = currentItemTransfert_ufp.observation; 
              }else
              {
                vm.alltransfert_ufp = vm.alltransfert_ufp.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemTransfert_ufp.id;
                });
              }

              vm.selectedItemTransfert_ufp = {} ;
              NouvelItemTransfert_ufp      = false;
              
            };

            //fonction selection item Transfert_ufp convention cisco/feffi
            vm.selectionTransfert_ufp = function (item)
            {
                vm.selectedItemTransfert_ufp = item;
               // vm.allconvention= [] ;
                if (item.$selected == false || item.$selected==undefined)
                {
                  vm.showbuttonValidation_trans_ufp = true;
                  currentItemTransfert_ufp     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_ufp));
                }
                vm.validation_transfert_ufp  = item.validation;          
console.log(item);
console.log(vm.validation_transfert_ufp);
            };
            $scope.$watch('vm.selectedItemTransfert_ufp', function()
            {
                 if (!vm.alltransfert_ufp) return;
                 vm.alltransfert_ufp.forEach(function(item)
                 {
                    item.$selected = false;
                 });
                 vm.selectedItemTransfert_ufp.$selected = true;
            });

            //fonction masque de saisie modification item convention
            vm.modifierTransfert_ufp = function(item)
            {
                NouvelItemTransfert_ufp = false ;
                vm.selectedItemTransfert_ufp = item;
                currentItemTransfert_ufp = angular.copy(vm.selectedItemTransfert_ufp);
                $scope.vm.alltransfert_ufp.forEach(function(cis) {
                  cis.$edit = false;
                });

                item.$edit = true;
                item.$selected = true;

                item.montant_transfert = parseInt(vm.selectedItemTransfert_ufp.montant_transfert) ;
                item.frais_bancaire = parseInt(vm.selectedItemTransfert_ufp.frais_bancaire) ;
                item.montant_total = parseInt(vm.selectedItemTransfert_ufp.montant_total );
                item.observation = vm.selectedItemTransfert_ufp.observation ;
                item.date = new Date(vm.selectedItemTransfert_ufp.date);
            };

            //fonction bouton suppression item Transfert_ufp convention cisco feffi
            vm.supprimerTransfert_ufp = function()
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
                    vm.ajoutTransfert_ufp(vm.selectedItemTransfert_ufp,1);
                  }, function() {
                    //alert('rien');
                  });
                  vm.stepTwo = false;
                  vm.stepThree = false;
            };

            //function teste s'il existe une modification item entente convention cisco feffi
            function test_existanceTransfert_ufp (item,suppression)
            {          
                if (suppression!=1)
                {
                   var convT = vm.alltransfert_ufp.filter(function(obj)
                    {
                       return obj.id == currentItemTransfert_ufp.id;
                    });
                    if(convT[0])
                    {
                       if((convT[0].observation!=currentItemTransfert_ufp.observation)
                        || (convT[0].date!=currentItemTransfert_ufp.date)
                        || (convT[0].montant_transfert!=currentItemTransfert_ufp.montant_transfert)
                        || (convT[0].frais_bancaire!=currentItemTransfert_ufp.frais_bancaire)
                        || (convT[0].montant_total!=currentItemTransfert_ufp.montant_total))                    
                          {
                              insert_in_baseTransfert_ufp(item,suppression);                        
                          }
                          else
                          {  
                            item.$selected = true;
                            item.$edit = false;
                          }
                    }
                } else
                      insert_in_baseTransfert_ufp(item,suppression);
            }

            //insertion ou mise a jours ou suppression item dans bdd convention
            function insert_in_baseTransfert_ufp(transfert_ufp,suppression)
            {
                //add
                var config =
                {
                    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
                };
                
                var getId = 0;
                if (NouvelItemTransfert_ufp ==false)
                {
                    getId = vm.selectedItemTransfert_ufp.id; 
                } 
                
                var datas = $.param({
                        supprimer: suppression,
                        id:        getId,      
                        montant_transfert:    transfert_ufp.montant_transfert,
                        frais_bancaire:    transfert_ufp.frais_bancaire,
                        montant_total: transfert_ufp.montant_total,
                        observation: transfert_ufp.observation,
                        date: convertionDate(new Date(transfert_ufp.date)), 
                        id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                        validation:0            
                    });
                    //console.log(datas);
                    //factory
                apiFactory.add("transfert_daaf/index",datas, config).success(function (data)
                {

                    if (NouvelItemTransfert_ufp == false)
                    {
                        // Update or delete: id exclu                 
                        if(suppression==0)
                        {
                            
                            vm.selectedItemTransfert_ufp.$selected  = false;
                            vm.selectedItemTransfert_ufp.$edit      = false;
                            vm.selectedItemTransfert_ufp ={};
                        }
                        else 
                        {    
                          vm.alltransfert_ufp = vm.alltransfert_ufp.filter(function(obj)
                          {
                              return obj.id !== vm.selectedItemTransfert_ufp.id;
                          });
                          vm.showbuttonNouvtransfert_ufp = true;
                        }
                    }
                    else
                    {
                      transfert_ufp.validation = 0;
                      transfert_ufp.id  =   String(data.response);              
                      NouvelItemTransfert_ufp = false;

                      vm.showbuttonNouvtransfert_ufp = false;
                } 
                  transfert_ufp.$selected = false;
                  transfert_ufp.$edit = false;
                  vm.selectedItemTransfert_ufp = {};
                  vm.showbuttonValidation_trans_ufp = false;
              }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


            }

            vm.valider_transfert_ufp= function()
            {
              validation_in_baseTransfert_ufp(vm.selectedItemTransfert_ufp,0);
            }
            function validation_in_baseTransfert_ufp(transfert_ufp,suppression)
            {
                //add
                var config =
                {
                    headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
                };
                
                var datas = $.param({
                        supprimer: suppression,
                        id:        transfert_ufp.id,      
                        montant_transfert:    transfert_ufp.montant_transfert,
                        frais_bancaire:    transfert_ufp.frais_bancaire,
                        montant_total: transfert_ufp.montant_total,
                        observation: transfert_ufp.observation,
                        date: convertionDate(new Date(transfert_ufp.date)), 
                        id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                        validation:1            
                    });
                    console.log(datas);
                    //factory
                apiFactory.add("transfert_daaf/index",datas, config).success(function (data)
                { vm.selectedItemTransfert_ufp.validation=1;
                  vm.validation_transfert_ufp=1;
                  transfert_ufp.$selected = false;
                  transfert_ufp.$edit = false;
                  vm.selectedItemTransfert_ufp = {};
                  vm.showbuttonValidation_trans_ufp = false;
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

        function insert_in_baseautoTransfert_ufp(transfert_daaf,suppression)
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
  /**********************************Fin StepThree transfert ufp***********************************/
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
