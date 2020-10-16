
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_dpfi.convention_suivi_f_dpfi')       
        .controller('Convention_suivi_f_dpfiController', Convention_suivi_f_dpfiController);
    /** @ngInject */
    function Convention_suivi_f_dpfiController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
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

        vm.stepjusti_d_tra_moe = false;

        vm.stepjusti_trans_reliqua = false;

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
        {titre:"Utilisateur"
        }]; 

        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionNeeddemandefeffivalidationpdfi').then(function(result)
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
 
            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });
              
              vm.steppiecefeffi=false;
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
        
        function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeemidpfiByconvention",'id_convention_cife_entete',item.id).then(function(result)
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
        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            vm.showbuttonNouvtransfert_daaf = true;
            if (item.$selected ==false || item.$selected == undefined)
            {
               //recuperation donnée demande_realimentation_feffi
                apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',item.id,'id_tranche',item.tranche.id).then(function(result)
                {
                    vm.allpiece_justificatif_feffi = result.data.response;
                });
                
                console.log(item.validation);
                vm.validation = item.validation;
                vm.steppiecefeffi=true;
                vm.steptransdaaf=true;
                vm.showbuttonValidation = true;

                vm.showbuttonValidationenrejedpfi = true;
                vm.showbuttonValidationencourdpfi = true;        
                vm.showbuttonValidationdpfi = true;
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
      
         vm.download_piece_justificatif = function(item)
        {//console.log(item.fichier);
            window.location = apiUrlFile+item.fichier;
        }


  /**********************************Fin StepThree piece_justificatif_feffi****************************/


 

  
  
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
              vm.showbuttonValidationcontrat_pr=true;

                apiFactory.getAPIgeneraliserREST("avenant_partenaire_relai/index",'menu','getavenantBycontrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
                {
                    vm.allavenant_partenaire = result.data.response;
                });
              vm.validation_contrat_pr = item.validation;
              vm.stepprestaion_pr=true;
              
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

  /******************************************debut maitrise d'oeuvre*****************************************************/

       /**************************************debut contrat moe***************************************************/
        
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

               /* apiFactory.getAPIgeneraliserREST("attachement_batiment/index",'id_contrat_prestataire',item.id).then(function(result)
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
                });*/
            //vm.showbuttonValidationcontrat_prestataire = true;
            vm.validation_contrat_prestataire = item.validation;
              switch (vm.session)
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
            
              }
              
           }
           vm.stepsuiviexecution = true;
           vm.stepavenant_mpe = true;  
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
        }];

       
        //fonction selection item Demande_batiment_mpe
        vm.selectionDemande_batiment_mpe= function (item)
        {
            vm.selectedItemDemande_batiment_mpe = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_batiment_mpe.id).then(function(result)
            {
                vm.alljustificatif_batiment_pre = result.data.response;
                console.log(vm.alljustificatif_batiment_pre);
            });
            
              vm.showbuttonValidationDemande_batiment_mpe_encourdpfi = true;
              vm.showbuttonValidationDemande_batiment_mpe_rejedpfi = true;
              vm.showbuttonValidationDemande_batiment_mpe_validedpfi = true;

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
/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

 
        //fonction selection item justificatif batiment_mpe
        vm.selectionJustificatif_batiment_mpe= function (item)
        {
            vm.selectedItemJustificatif_batiment_mpe = item;
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
    
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif batiment_mpe**********************************************/


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
        }];
 
        //fonction selection item Demande_latrine_mpe
        vm.selectionDemande_latrine_mpe= function (item)
        {
            vm.selectedItemDemande_latrine_mpe = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_latrine_pre/index",'id_demande_demande_pre',vm.selectedItemDemande_latrine_mpe.id).then(function(result)
            {
                vm.alljustificatif_latrine_pre = result.data.response;
                console.log(vm.alljustificatif_latrine_pre);
            });

              vm.showbuttonValidationDemande_latrine_mpe_encourdpfi = true;
              vm.showbuttonValidationDemande_latrine_mpe_rejedpfi = true;
              vm.showbuttonValidationDemande_latrine_mpe_validedpfi = true;
           
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
/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_latrine_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        //fonction selection item justificatif latrine_mpe
        vm.selectionJustificatif_latrine_mpe= function (item)
        {
            vm.selectedItemJustificatif_latrine_mpe = item;
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

        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif latrine_mpe**********************************************/


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
        }];

   
        //fonction selection item Demande_mobilier_mpe
        vm.selectionDemande_mobilier_mpe= function (item)
        {
            vm.selectedItemDemande_mobilier_mpe = item;
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_mobilier_pre/index",'id_demande_demande_pre',vm.selectedItemDemande_mobilier_mpe.id).then(function(result)
            {
                vm.alljustificatif_mobilier_pre = result.data.response;
                console.log(vm.alljustificatif_mobilier_pre);
            });

              vm.showbuttonValidationDemande_mobilier_mpe_encourdpfi = true;
              vm.showbuttonValidationDemande_mobilier_mpe_rejedpfi = true;
              vm.showbuttonValidationDemande_mobilier_mpe_validedpfi = true;
            
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
/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_mobilier_mpe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        //fonction selection item justificatif mobilier_mpe
        vm.selectionJustificatif_mobilier_mpe= function (item)
        {
            vm.selectedItemJustificatif_mobilier_mpe = item;
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

        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/***************************************fin justificatif mobilier_mpe**********************************************/

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
