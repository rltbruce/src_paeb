
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_daaf.convention_suivi_f_odaaf')        
        .controller('Convention_suivi_f_odaafController', Convention_suivi_f_odaafController);
    /** @ngInject */
    function Convention_suivi_f_odaafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;       
        
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;

        vm.session = '';

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

        var NouvelItemTransfert_daaf = false;
        var currentItemTransfert_daaf;
        vm.selectedItemTransfert_daaf = {} ;
        vm.ajoutTransfert_daaf  = ajoutTransfert_daaf ;
        vm.alltransfert_daaf=[];
       
        vm.showbuttonNouvtransfert_daaf= true;   

/*******************************Fin initialisation suivi financement feffi******************************/     

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
                  case 'ODAAF': 
                            vm.session = 'DAAF'; 
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
                  case 'ODAAF':
                            
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu',
                                'getconventionvalideufpBydate','date_debut',date_debut,'date_fin',
                                date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,
                                'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                            });
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
         
            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });
                          
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
       
        function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                switch (session)
                {                                    
                  case 'ODAAF': 
                               apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandevalidedaafByconvention",'id_convention_cife_entete',item.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response; 
                                 return resolve('ok');  
                              });
                                                            
                      break;
                  
                  case 'ADMIN':
                            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandevalidedaafByconvention",'id_convention_cife_entete',item.id).then(function(result)
                            {
                                  vm.alldemande_realimentation_invalide = result.data.response;
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
        {titre:"Situation"}];     
        
        //fonction ajout dans bdd
             //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            vm.showbuttonNouvtransfert_daaf = true;
            if (item.$selected ==false || item.$selected == undefined)
            {               
                if (vm.session=='DAAF') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      if (vm.alltransfert_daaf.length>0)
                      {
                        vm.showbuttonNouvtransfert_daaf = false;
                      }
                  });
                } 
                
                if (vm.session=='ADMIN') 
                {
                  apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransferBydemande','id_demande_rea_feffi',item.id).then(function(result)
                  {
                      vm.alltransfert_daaf = result.data.response;
                      if (vm.alltransfert_daaf.length>0)
                      {
                        vm.showbuttonNouvtransfert_daaf = false;
                      }
                  });
                }                      
                  
                
                console.log(item.validation);
                vm.validation = item.validation;
                vm.steppiecefeffi=true;
                vm.steptransdaaf=true;
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
  
  /*************************Fin StepTwo demande_realimentation_feffi***************************************/

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
