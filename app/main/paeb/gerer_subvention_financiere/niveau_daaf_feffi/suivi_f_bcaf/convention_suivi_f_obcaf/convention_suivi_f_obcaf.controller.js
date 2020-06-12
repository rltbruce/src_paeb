
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.suivi_f_bcaf.convention_suivi_f_obcaf')
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
        .controller('Convention_suivi_f_obcafController', Convention_suivi_f_obcafController);
    /** @ngInject */
    function Convention_suivi_f_obcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;
        vm.stepMenu_reliquat = false;
        vm.stepjusti_trans_reliqua = false;

        vm.session = '';

/*******************************Debut initialisation suivi financement feffi******************************/        

        vm.showbuttonNeauveaudemande = false;

        //initialisation demande_realimentation_feffi
        vm.ajoutDemande_realimentation  = ajoutDemande_realimentation ;
        vm.NouvelItemDemande_realimentation    = false;     
        var currentItemDemande_realimentation;
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;
        vm.alldemande_realimentation_invalide  = [] ;

        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];

        //initialisation piece_justificatif_feffi
        vm.ajoutPiece_justificatif_feffi  = ajoutPiece_justificatif_feffi ;
        var NouvelItemPiece_justificatif_feffi    = false;     
        var currentItemPiece_justificatif_feffi;
        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;

        //initialisation decaissement fonctionnement feffi
        vm.ajoutDecaiss_fonct_feffi = ajoutDecaiss_fonct_feffi;
        var NouvelItemDecaiss_fonct_feffi=false;
        var currentItemDecaiss_fonct_feffi;
        vm.selectedItemDecaiss_fonct_feffi = {} ;
        vm.alldecaiss_fonct_feffi = [] ;            

        vm.nbr_decaiss_feffi=0;     

/*******************************Fin initialisation suivi financement feffi******************************/

/********************************************Fin reliquat********************************************/
        var NouvelItemTransfert_reliquat = false;
        var currentItemTransfert_reliquat;
        vm.ajoutTransfert_reliquat       = ajoutTransfert_reliquat ;
        vm.selectedItemTransfert_reliquat = {} ;
        vm.selectedItemTransfert_reliquat.$selected=false;

        vm.showbuttonNouvTransfert_reliquat=true;

        vm.ajoutJustificatif_transfert_reliquat = ajoutJustificatif_transfert_reliquat;
        var NouvelItemJustificatif_transfert_reliquat=false;
        var currentItemJustificatif_transfert_reliquat;
        vm.selectedItemJustificatif_transfert_reliquat = {} ;
        vm.alljustificatif_transfert_reliquat = [] ;
/********************************************Fin reliquat********************************************/

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
                  case 'OBCAF': 
                            vm.usercisco = result.data.response.cisco;
                            vm.showbuttonNeauveaudemandefeffi=true;                            
                            vm.session = 'OBCAF';

                      break;

                  case 'ADMIN':                            
                            vm.showbuttonNeauveaudemandefeffi=true;
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
                  case 'OBCAF':
                            if (vm.usercisco.id!=undefined)
                            {
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByciscodate',
                                'id_cisco',vm.usercisco.id,'date_debut',date_debut,'date_fin',date_fin).then(function(result)
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

            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_feffi=true;
                console.log(vm.stepMenu_feffi);  
            });
            donnee_menu_reliquat(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_reliquat=true;
                console.log(vm.stepMenu_reliquat);  
            });
                          
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
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
                switch (session)
                {
                  case 'OBCAF':
                              apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',item.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                  apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.alldecaiss_fonct_feffi = result.data.response; 
                                      return resolve('ok');
                                  });
              
                              });

                              vm.modif_suppre = true;
                              //vm.nbr_demande_feffi = item.nbr_demande_feffi_creer
                            
                      break;

                  case 'ADMIN':
                           apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',item.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                  apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.alldecaiss_fonct_feffi = result.data.response; 
                                      return resolve('ok');
                                  });
              
                              });                              
                       
                      break;
                  default:
                      break;
              
                }            
            });
        
        }
       

        function donnee_menu_reliquat(item,session)
        {
            return new Promise(function (resolve, reject)
            {
                switch (session)
                {
                  case 'OBCAF':

                              apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.alltransfert_reliquat = result.data.response.filter(function(obj)
                                  {
                                      return obj.validation == 0;
                                  });
                                  console.log(result.data.response);
                                  console.log(vm.showbuttonNouvTransfert_reliquat);
                                  if (result.data.response.length!=0)
                                  {
                                    vm.showbuttonNouvTransfert_reliquat=false;
                                    
                                  console.log(vm.showbuttonNouvTransfert_reliquat);
                                  }
                                  return resolve('ok');
                              });
                                                
                      break;

                  case 'ADMIN':
                            
                            apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.alltransfert_reliquat = result.data.response.filter(function(obj)
                                  {
                                      return obj.validation == 0;
                                  });

                                if (result.data.response.length!=0)
                                {
                                  vm.showbuttonNouvTransfert_reliquat=false;
                                }
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
        {titre:"Situation"},
        {titre:"Action"}];     
        

        //Masque de saisi ajout
        vm.ajouterDemande_realimentation = function ()
        { 
            var items = {
                            $edit: true,
                            $selected: true,
                            id: '0',
                            id_compte_feffi: vm.allcompte_feffi[0].id,
                            numero_compte: vm.allcompte_feffi[0].numero_compte,
                            tranche: '',
                            cumul: '',
                            anterieur: '',
                            periode: '',
                            pourcentage:'',
                            reste:'',
                            date:'',
                            validation:'0',
                          };
          if (vm.NouvelItemDemande_realimentation == false)
          {   
              apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandeByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.alldemande_realimentation = result.data.response;
                  var last_id_demande = Math.max.apply(Math, vm.alldemande_realimentation.map(function(o){return o.id;}));

                vm.dataLastedemande = vm.alldemande_realimentation.filter(function(obj){return obj.id == last_id_demande;});

                if (vm.dataLastedemande.length>0)
                {
                    switch (parseInt(vm.dataLastedemande[0].validation))
                    {
                      case 3:
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande);});
                           vm.alldemande_realimentation_invalide.push(items);                          
                           vm.selectedItemDemande_realimentation = items;
                           vm.NouvelItemDemande_realimentation = true ;
                           vm.dataLastedemande = [];                  
                          break;

                     case 6:
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande);});
                           vm.alldemande_realimentation_invalide.push(items);                          
                           vm.selectedItemDemande_realimentation = items;
                           vm.NouvelItemDemande_realimentation = true ;
                           vm.dataLastedemande = [];
                          break;
                      case 7:
                          
                          var last_tranche_demande = Math.max.apply(Math, vm.dataLastedemande.map(function(o){return o.tranche.code.split(' ')[1];}));
                            
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                            vm.alldemande_realimentation_invalide.push(items);                          
                            vm.selectedItemDemande_realimentation = items;
                            vm.NouvelItemDemande_realimentation = true ;
                          break;

                      default:
                            vm.showAlert('Ajout réfuser','La dernière demande est en cours de traitement!!!');
                            vm.allcurenttranche_deblocage_feffi = [];
                          break;
                  
                    }
                }
                else
                {
                    vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche 1';});
                    vm.alldemande_realimentation_invalide.push(items);                          
                    vm.selectedItemDemande_realimentation = items;
                    vm.NouvelItemDemande_realimentation = true ;
                    vm.dataLastedemande = [];
                }
              });             
              
          }else
          {
              vm.showAlert('Ajout demande_realimentation','Un formulaire d\'ajout est déjà ouvert!!!');
          }

          
          
        };

        //fonction ajout dans bdd
        function ajoutDemande_realimentation(demande_realimentation,suppression)
        {
            if (vm.NouvelItemDemande_realimentation==false)
            {
                test_existanceDemande_realimentation (demande_realimentation,suppression); 
            } 
            else
            {
                insert_in_baseDemande_realimentation(demande_realimentation,suppression);
            }
        }

        //fonction de bouton d'annulation demande_realimentation
        vm.annulerDemande_realimentation = function(item)
        {
          if (vm.NouvelItemDemande_realimentation == false)
          {console.log('1');
            item.$edit     = false;
            item.$selected = false;

            item.id_compte_feffi = currentItemDemande_realimentation.id_compte_feffi ;
            item.numero_compte = currentItemDemande_realimentation.numero_compte ;
            item.id_tranche_deblocage_feffi = currentItemDemande_realimentation.id_tranche_deblocage_feffi ;
            item.cumul = currentItemDemande_realimentation.cumul ;
            item.anterieur = currentItemDemande_realimentation.anterieur ;
            item.periode = currentItemDemande_realimentation.periode ;
            item.pourcentage = currentItemDemande_realimentation.pourcentage ;
            item.reste = currentItemDemande_realimentation.reste ;
            item.date = currentItemDemande_realimentation.date ;
            item.validation = currentItemDemande_realimentation.validation;
            item.id_convention_cife_entete = currentItemDemande_realimentation.id_convention_cife_entete ;
            vm.showbuttonValidation = false;
            //item.date_approbation = currentItemDemande_realimentation.date_approbation ;
          }else
          {
            vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_realimentation.id;
            });
          }

          vm.selectedItemDemande_realimentation = {} ;
          vm.NouvelItemDemande_realimentation      = false;
          vm.modificationdemande = false;
          
        };

        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            vm.showbuttonNouvtransfert_daaf = true;
            if (item.$selected ==false || item.$selected == undefined)
            {
                currentItemDemande_realimentation     = JSON.parse(JSON.stringify(vm.selectedItemDemande_realimentation));
               //recuperation donnée demande_realimentation_feffi
                apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',item.id).then(function(result)
                {
                    vm.allpiece_justificatif_feffi = result.data.response;
                    
                });
                
                console.log(item.validation);
                vm.validation = item.validation;
                vm.steppiecefeffi=true;
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

        //fonction masque de saisie modification item convention_cisco_feffi_entete
        vm.modifierDemande_realimentation = function(item)
        {
            vm.NouvelItemDemande_realimentation = false ;
            vm.selectedItemDemande_realimentation = item;
            currentItemDemande_realimentation = angular.copy(vm.selectedItemDemande_realimentation);
            $scope.vm.alldemande_realimentation.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.id_compte_feffi = vm.selectedItemDemande_realimentation.compte_feffi.id ;
            item.numero_compte = vm.selectedItemDemande_realimentation.compte_feffi.numero_compte ;
            item.id_tranche_deblocage_feffi = vm.selectedItemDemande_realimentation.tranche.id ;
            item.cumul = vm.selectedItemDemande_realimentation.cumul ;
            item.anterieur = vm.selectedItemDemande_realimentation.anterieur ;
            item.periode = vm.selectedItemDemande_realimentation.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_realimentation.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_realimentation.reste ;
            item.date = new Date(vm.selectedItemDemande_realimentation.date) ;
            item.validation = vm.selectedItemDemande_realimentation.validation;
            item.id_convention_cife_entete = vm.selectedItemDemande_realimentation.convention_cife_entete.id;
            vm.modificationdemande = true;
            //item.date_approbation = vm.selectedItemDemande_realimentation.date_approbation ;  
        };

        //fonction bouton suppression item convention_cisco_feffi_entete
        vm.supprimerDemande_realimentation = function()
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
                vm.ajoutDemande_realimentation(vm.selectedItemDemande_realimentation,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_cisco_feffi_entete
        function test_existanceDemande_realimentation (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_realimentation.filter(function(obj)
                {
                   return obj.id == currentItemDemande_realimentation.id;
                });
                if(dema[0])
                {
                   if((dema[0].id_compte_feffi != currentItemDemande_realimentation.id_compte_feffi )
                    || (dema[0].id_tranche_deblocage_feffi != currentItemDemande_realimentation.id_tranche_deblocage_feffi )
                    || (dema[0].cumul != currentItemDemande_realimentation.cumul )
                    || (dema[0].anterieur != currentItemDemande_realimentation.anterieur )
                    || (dema[0].periode != currentItemDemande_realimentation.periode )
                    || (dema[0].pourcentage != currentItemDemande_realimentation.pourcentage )
                    || (dema[0].reste != currentItemDemande_realimentation.reste )
                    || (dema[0].date != currentItemDemande_realimentation.date )
                    || (dema[0].id_convention_cife_entete != currentItemDemande_realimentation.id_convention_cife_entete ))                    
                      { 
                        insert_in_baseDemande_realimentation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_realimentation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function insert_in_baseDemande_realimentation(demande_realimentation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (vm.NouvelItemDemande_realimentation==false)
            {
                getId = vm.selectedItemDemande_realimentation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    id_compte_feffi: demande_realimentation.id_compte_feffi ,
                    id_tranche_deblocage_feffi: demande_realimentation.id_tranche_deblocage_feffi ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: 0 ,
                    id_convention_cife_entete: vm.selectedItemConvention_entete.id              
                });
                //console.log(demande_realimentation.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                var comp = vm.allcompte_feffi.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_compte_feffi;
                });

                var tran= vm.alltranche_deblocage_feffi.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_tranche_deblocage_feffi;
                });
                var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == vm.selectedItemConvention_entete.id;
                });

                if (vm.NouvelItemDemande_realimentation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_realimentation.compte_feffi = comp[0];
                        vm.selectedItemDemande_realimentation.tranche = tran[0] ;
                        vm.selectedItemDemande_realimentation.convention_cife_entete = conv[0] ;
                        vm.selectedItemDemande_realimentation.$selected  = false;
                        vm.selectedItemDemande_realimentation.$edit      = false;
                        vm.selectedItemDemande_realimentation ={};
                    }
                    else 
                    {    
                      vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_realimentation.id;
                      });

                  vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)-1;
                    }
                }
                else
                {
                  demande_realimentation.tranche = tran[0] ;
                  demande_realimentation.compte_feffi = comp[0];
                  demande_realimentation.convention_cife_entete = conv[0] ;

                  demande_realimentation.id  =   String(data.response); 
                  //vm.alldemande_realimentation.push(demande_realimentation);             
                  vm.NouvelItemDemande_realimentation=false;
                  vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)+1;
            }
              demande_realimentation.$selected = false;
              demande_realimentation.$edit = false;
              vm.selectedItemDemande_realimentation = {};
              vm.modificationdemande = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.tranchechange = function(item)
        { 
          console.log('eeeee');
          var reste = 0;
          var anterieur = 0;
          var prevu = 0;
          var cumul= 0;

          if (vm.allcurenttranche_deblocage_feffi[0].code =='tranche 1')
            {
              prevu = parseInt(vm.allconvention_entete[0].montant_divers)+((parseInt(vm.allconvention_entete[0].montant_trav_mob) * parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100);
            console.log(prevu);
            } 
            else 
            {
              prevu = (parseInt(vm.allconvention_entete[0].montant_trav_mob )* parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;
            console.log(prevu);
            }

          cumul = prevu;
          if (vm.alldemande_realimentation.length>0)
          {                 
              anterieur = vm.dataLastedemande[0].prevu; console.log( anterieur) ;         
              cumul = prevu + parseInt(vm.dataLastedemande[0].cumul);
          }

          reste= vm.allconvention_entete[0].montant_total - cumul;

          item.periode = vm.allcurenttranche_deblocage_feffi[0].periode;
          item.pourcentage = vm.allcurenttranche_deblocage_feffi[0].pourcentage;

          item.prevu = prevu;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
        vm.change_compte = function(item)
        {
          var comp = vm.allcompte_feffi.filter(function(obj)
          {
              return obj.id == item.id_compte_feffi;
          });
          item.numero_compte = comp[0].numero_compte;
        }
  
  /*************************Fin StepTwo demande_realimentation_feffi***************************************/


  /*********************************Fin StepThree piece_justificatif_feffi*******************************/

        vm.piece_justificatif_feffi_column = [
        {titre:"Description"},
        {titre:"Fichier"},
        {titre:"Date"},
        {titre:"Action"}];

        $scope.uploadFile_justi_feffi = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemPiece_justificatif_feffi.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterPiece_justificatif_feffi = function ()
        { 
          if (NouvelItemPiece_justificatif_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              description: '',
              fichier:'',
              date: ''
            };         
            vm.allpiece_justificatif_feffi.push(items);
            vm.selectedItemPiece_justificatif_feffi = items;
             

            NouvelItemPiece_justificatif_feffi = true ;
          }else
          {
            vm.showAlert('Ajout piece_justificatif_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                test_existancePiece_justificatif_feffi (piece_justificatif_feffi,suppression); 
            } 
            else
            {
                insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation piece_justificatif_feffi
        vm.annulerPiece_justificatif_feffi = function(item)
        {
          if (NouvelItemPiece_justificatif_feffi == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.description = currentItemPiece_justificatif_feffi.description ;
            item.fichier = currentItemPiece_justificatif_feffi.fichier ;
            item.date        = currentItemPiece_justificatif_feffi.date ;  
          }else
          {
            vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
            });
          }

          vm.selectedItemPiece_justificatif_feffi = {} ;
          NouvelItemPiece_justificatif_feffi      = false;
          
        };

        //fonction selection item Piece_justificatif_feffi
        vm.selectionPiece_justificatif_feffi= function (item)
        {
            vm.selectedItemPiece_justificatif_feffi = item;
            currentItemPiece_justificatif_feffi     = JSON.parse(JSON.stringify(vm.selectedItemPiece_justificatif_feffi));
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
            currentItemPiece_justificatif_feffi = angular.copy(vm.selectedItemPiece_justificatif_feffi);
            $scope.vm.allpiece_justificatif_feffi.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.description = vm.selectedItemPiece_justificatif_feffi.description ;
            item.fichier = vm.selectedItemPiece_justificatif_feffi.fichier ;
            item.date    = new Date(vm.selectedItemPiece_justificatif_feffi.date );  
        };

        //fonction bouton suppression item Piece_justificatif_feffi
        vm.supprimerPiece_justificatif_feffi = function()
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
                vm.ajoutPiece_justificatif_feffi(vm.selectedItemPiece_justificatif_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_cisco_feffi_entete
        function test_existancePiece_justificatif_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.allpiece_justificatif_feffi.filter(function(obj)
                {
                   return obj.id == currentItemPiece_justificatif_feffi.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItemPiece_justificatif_feffi.description)
                    || (dema[0].fichier!=currentItemPiece_justificatif_feffi.fichier)
                    || (dema[0].date!=currentItemPiece_justificatif_feffi.date))                    
                      { 
                        insert_in_basePiece_justificatif_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePiece_justificatif_feffi(item,suppression);
        }

         function insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                getId = vm.selectedItemPiece_justificatif_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: piece_justificatif_feffi.description,
                    fichier: piece_justificatif_feffi.fichier,
                    date: convertionDate(new Date(piece_justificatif_feffi.date)),
                    id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
            {   

              if (NouvelItemPiece_justificatif_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'piece_justificatif_feffi/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemPiece_justificatif_feffi.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemDemande_realimentation.convention_cife_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    piece_justificatif_feffi.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: piece_justificatif_feffi.description,
                                                      fichier: piece_justificatif_feffi.fichier,
                                                      date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                                      id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                                      validation: 0 
                                        });
                                      apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          piece_justificatif_feffi.$selected = false;
                                          piece_justificatif_feffi.$edit = false;
                                          vm.selectedItemPiece_justificatif_feffi = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: piece_justificatif_feffi.description,
                                        fichier: piece_justificatif_feffi.fichier,
                                        date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                        id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                        validation: 0                
                                    });
                                  apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                  {
                                        
                                      piece_justificatif_feffi.$selected = false;
                                      piece_justificatif_feffi.$edit = false;
                                      vm.selectedItemPiece_justificatif_feffi = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemPiece_justificatif_feffi.$selected  = false;
                        vm.selectedItemPiece_justificatif_feffi.$edit      = false;
                        vm.selectedItemPiece_justificatif_feffi ={};
                    }
                    else 
                    {    
                      vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemPiece_justificatif_feffi.fichier;
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
                          vm.showAlert(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  piece_justificatif_feffi.id  =   String(data.response);              
                  NouvelItemPiece_justificatif_feffi = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'piece_justificatif_feffi/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemDemande_realimentation.convention_cife_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              piece_justificatif_feffi.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: piece_justificatif_feffi.description,
                                                fichier: piece_justificatif_feffi.fichier,
                                                date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                                id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                                validation: 0 
                                  });
                                apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    piece_justificatif_feffi.$selected = false;
                                    piece_justificatif_feffi.$edit = false;
                                    vm.selectedItemPiece_justificatif_feffi = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                            console.log(data['nomFile']);
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: piece_justificatif_feffi.description,
                                  fichier: piece_justificatif_feffi.fichier,
                                  date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                  id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                  validation: 0                
                              });
                            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                            {
                                  
                                piece_justificatif_feffi.$selected = false;
                                piece_justificatif_feffi.$edit = false;
                                vm.selectedItemPiece_justificatif_feffi = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              piece_justificatif_feffi.$selected = false;
              piece_justificatif_feffi.$edit = false;
              vm.selectedItemPiece_justificatif_feffi = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
         vm.download_piece_justificatif = function(item)
        {//console.log(item.fichier);
            window.location = apiUrlFile+item.fichier;
        }


  /**********************************Fin StepThree piece_justificatif_feffi****************************/  

  /**********************************fin decaissement fonctionnement feffi******************************/


        //Masque de saisi ajout
        vm.ajouterDecaiss_fonct_feffi= function ()
        { 
          
          if (NouvelItemDecaiss_fonct_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant: '',
              date_decaissement: '',
              observation: ''
            };
        
            vm.alldecaiss_fonct_feffi.push(items);
            vm.alldecaiss_fonct_feffi.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDecaiss_fonct_feffi = mem;
              }
            });

            NouvelItemDecaiss_fonct_feffi = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout decaiss_fonct_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            if (NouvelItemDecaiss_fonct_feffi==false)
            {
                test_existanceDecaiss_fonct_feffi (decaiss_fonct_feffi,suppression); 
            } 
            else
            {
                insert_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation decaiss_fonct_feffi
        vm.annulerDecaiss_fonct_feffi = function(item)
        {
          if (NouvelItemDecaiss_fonct_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant   = currentItemDecaiss_fonct_feffi.montant ;
            item.date_decaissement   = currentItemDecaiss_fonct_feffi.date_decaissement ;
            item.observation   = currentItemDecaiss_fonct_feffi.observation ;
          }else
          {
            vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDecaiss_fonct_feffi.id;
            });
          }

          vm.selectedItemDecaiss_fonct_feffi = {} ;
          NouvelItemDecaiss_fonct_feffi      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDecaiss_fonct_feffi= function (item)
        {
            vm.selectedItemDecaiss_fonct_feffi = item;
            vm.nouvelItemDecaiss_fonct_feffi   = item;
            currentItemDecaiss_fonct_feffi    = JSON.parse(JSON.stringify(vm.selectedItemDecaiss_fonct_feffi));
            
            vm.validation_decais_fef=item.validation;
            
        };
        $scope.$watch('vm.selectedItemDecaiss_fonct_feffi', function()
        {
             if (!vm.alldecaiss_fonct_feffi) return;
             vm.alldecaiss_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDecaiss_fonct_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDecaiss_fonct_feffi = function(item)
        {
            NouvelItemDecaiss_fonct_feffi = false ;
            vm.selectedItemDecaiss_fonct_feffi = item;
            currentItemDecaiss_fonct_feffi = angular.copy(vm.selectedItemDecaiss_fonct_feffi);
            $scope.vm.alldecaiss_fonct_feffi.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.montant   = parseInt(vm.selectedItemDecaiss_fonct_feffi.montant);
            item.date_decaissement   = new Date(vm.selectedItemDecaiss_fonct_feffi.date_decaissement) ;
            item.observation   = vm.selectedItemDecaiss_fonct_feffi.observation ;
        };

        //fonction bouton suppression item decaiss_fonct_feffi
        vm.supprimerDecaiss_fonct_feffi = function()
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
                vm.ajoutDecaiss_fonct_feffi(vm.selectedItemDecaiss_fonct_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDecaiss_fonct_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldecaiss_fonct_feffi.filter(function(obj)
                {
                   return obj.id == currentItemDecaiss_fonct_feffi.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant   != currentItemDecaiss_fonct_feffi.montant )
                    ||(mem[0].date_decaissement   != currentItemDecaiss_fonct_feffi.date_decaissement )
                    ||(mem[0].observation   != currentItemDecaiss_fonct_feffi.observation ))                   
                      { 
                         insert_in_baseDecaiss_fonct_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDecaiss_fonct_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd decaiss_fonct_feffi
        function insert_in_baseDecaiss_fonct_feffi(decaiss_fonct_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDecaiss_fonct_feffi==false)
            {
                getId = vm.selectedItemDecaiss_fonct_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant: decaiss_fonct_feffi.montant,
                    date_decaissement: convertionDate(new Date(decaiss_fonct_feffi.date_decaissement)),
                    observation: decaiss_fonct_feffi.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("decaiss_fonct_feffi/index",datas, config).success(function (data)
            {   
              var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == decaiss_fonct_feffi.id_convention_entete;
                });

              if (NouvelItemDecaiss_fonct_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        vm.selectedItemDecaiss_fonct_feffi.convention_entete = conv[0];
                        vm.selectedItemDecaiss_fonct_feffi.$selected  = false;
                        vm.selectedItemDecaiss_fonct_feffi.$edit      = false;
                        vm.selectedItemDecaiss_fonct_feffi ={};
                        vm.showbuttonValidation_dec_feffi = false;
                    }
                    else 
                    {    
                      vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDecaiss_fonct_feffi.id;
                      });
                      vm.showbuttonValidation_dec_feffi = false;

              vm.nbr_decaiss_feffi = parseInt(vm.nbr_decaiss_feffi)-1;
                    }
              }
              else
              {   
                  decaiss_fonct_feffi.convention_entete = conv[0];
                  decaiss_fonct_feffi.id  =   String(data.response);              
                  NouvelItemDecaiss_fonct_feffi = false;

              vm.nbr_decaiss_feffi = parseInt(vm.nbr_decaiss_feffi)+1;
                                        
               }
              
              decaiss_fonct_feffi.$selected = false;
              decaiss_fonct_feffi.$edit = false;
              vm.selectedItemDecaiss_fonct_feffi = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /**************************************fin decaissement fonctionnement feffi****************************************/

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

            item.id_convention_entete = vm.selectedItemTransfert_reliquat.id_convention_entete ;
            item.montant  = vm.selectedItemTransfert_reliquat.montant ;
            item.objet_utilisation  = vm.selectedItemTransfert_reliquat.objet_utilisation ;
            item.situation_utilisation  = vm.selectedItemTransfert_reliquat.situation_utilisation ;
            item.date_transfert  = new Date(vm.selectedItemTransfert_reliquat.date_transfert) ;
            item.intitule_compte = vm.selectedItemTransfert_reliquat.intitule_compte ;
            item.rib = parseInt(vm.selectedItemTransfert_reliquat.rib);
            item.observation = parseInt(vm.selectedItemTransfert_reliquat.observation);
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
                  transfert_reliquat.validation=0;
                  transfert_reliquat.convention_entete = conv[0];
                  transfert_reliquat.id  =   String(data.response);
                  NouvelItemTransfert_reliquat = false;
                  vm.showbuttonNouvTransfert_reliquat= false;
            }
              vm.validation_transfert_reliquat = 0; 
              transfert_reliquat.$selected = false;
              transfert_reliquat.$edit = false;
              vm.selectedItemTransfert_reliquat = {};
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

                            var name_file = vm.selectedItemConvention_entete.ref_convention +'_'+getIdFile+'_'+vm.myFile[0].name ;

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

                      var name_file = vm.selectedItemConvention_entete.ref_convention +'_'+getIdFile+'_'+vm.myFile[0].name ;

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
