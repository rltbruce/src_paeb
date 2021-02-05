
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_feffi.convention_suivi_f_obcaf_ufp')
        .directive('customOnChangepiecereafeffi', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangepiecereafeffi);
            element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          if((files[0].size/1024/1024)>20)
            {
                ngModel.$setViewValue(null);
                var confirm = $mdDialog.confirm()
                    .title('Cet action n\'est pas autorisé')
                    .textContent('La taille doit être inferieur à 20MB')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    ngModel.$setViewValue(null);
                    element.val(null);
                    scope.justificatif_feffi.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.justificatif_feffi.fichier = files[0].name;
            } 
        });
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
        .controller('Convention_suivi_f_obcaf_ufpController', Convention_suivi_f_obcaf_ufpController);
    /** @ngInject */
    function Convention_suivi_f_obcaf_ufpController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransdaaf=false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;
        vm.myFile = [];
        
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

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

        //initialisation justificatif_feffi
        vm.ajoutJustificatif_feffi = ajoutJustificatif_feffi;
        var NouvelItemJustificatif_feffi=false;
        var currentItemJustificatif_feffi;
        vm.selectedItemJustificatif_feffi = {} ;
        vm.alljustificatif_feffi = [] ;
        vm.myFile={};         

        vm.nbr_decaiss_feffi=0;     

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

        vm.allcurenttranche_deblocage_feffi = [];
        vm.alltranche_deblocage_feffi = [];

        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
          vm.alltranche_deblocage_feffi= result.data.response;
          vm.allcurenttranche_deblocage_feffi = result.data.response;
        });

        vm.datenow = new Date();

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
        vm.filtre = {
                id_cisco: null,
                id_region: null
              }
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              var utilisateur = result.data.response;
            /*if (utilisateur.roles.indexOf("OBCAF")!= -1)
            { 
                            vm.usercisco = result.data.response.cisco;                                                     
                            vm.filtre.id_cisco=result.data.response.cisco.id;
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionBycisco",'id_cisco',vm.usercisco.id).then(function(result)
                            {
                                vm.regions = result.data.response;
                                vm.filtre.id_region=result.data.response[0].id;
                                console.log(vm.regions);
                            }, function error(result){ alert('something went wrong')});
                            vm.ciscos.push(vm.usercisco);
                            vm.showbuttonNeauveaudemandefeffi=true;                            
                            vm.session = 'OBCAF';

            }*/
            apiFactory.getAll("region/index").then(function success(response)
              {
                vm.regions = response.data.response;
              });
            if (utilisateur.roles.indexOf("AAC")!= -1)
            { 
              vm.showbuttonNeauveaudemandefeffi=true;
              
              vm.session = 'AAC';

            }
            else
            {                           
              vm.showbuttonNeauveaudemandefeffi=true;
              vm.session = 'ADMIN'; 
              
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
     

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
              switch (vm.session)
                { 
                  /*case 'OBCAF':console.log(vm.usercisco.id);
                            
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByfiltrecisco','id_cisco_user',vm.usercisco.id,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                              {
                                  vm.allconvention_entete = result.data.response;
                                  vm.affiche_load =false;
                              });
                         
                console.log(filtre);                
                      break;*/
                  case 'AAC':
                            
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydateutilisateur','id_utilisateur',id_user,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });
                                        
                      break;

                  case 'ADMIN':
                           
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                            ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });                 
                      break;
                  default:
                      break;
              
                }
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepMenu_feffi=true;
                          
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              //vm.nbr_decaiss_feffi = item.nbr_decaiss_feffi;
              //console.log(vm.nbr_demande_feffi);
              
              vm.header_ref_convention = item.ref_convention;
              vm.header_cisco = item.cisco.description;
              vm.header_feffi = item.feffi.denomination; 
              vm.header_class = 'headerbig';
                         

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
          apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alldemande_realimentation_invalide = result.data.response;
                                 /* apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                                  {
                                      vm.alldecaiss_fonct_feffi = result.data.response; 
                                  });*/
            vm.affiche_load =false;
          });
          /*switch (vm.session)
                {
                //   case 'OBCAF':
                //               apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',item.id).then(function(result)
                //               {
                //                   vm.alldemande_realimentation_invalide = result.data.response;
                //                   apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                //                   {
                //                       vm.alldecaiss_fonct_feffi = result.data.response; 
                //                       return resolve('ok');
                //                   });
              
                //               });

                //               vm.modif_suppre = true;
                //               //vm.nbr_demande_feffi = item.nbr_demande_feffi_creer
                            
                //       break;

                  case 'AAC':
                              vm.affiche_load =true;
                              apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                
                                vm.affiche_load =false;
                              });

                              vm.modif_suppre = true;
                              //vm.nbr_demande_feffi = item.nbr_demande_feffi_creer
                            
                      break;

                  case 'ADMIN':
                            vm.affiche_load =true;
                           apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandecreerByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
                              {
                                  vm.alldemande_realimentation_invalide = result.data.response;
                                 
                                  vm.affiche_load =false;
                              });                              
                       
                      break;
                  default:
                      break;
              
                }*/
        }
        
       /* function donnee_sousmenu_feffi(item,session)
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
        
        }*/

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
                      case 2: //3
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande);});
                           vm.alldemande_realimentation_invalide.push(items);                          
                           vm.selectedItemDemande_realimentation = items;
                           vm.NouvelItemDemande_realimentation = true ;
                           vm.dataLastedemande = [];                  
                          break;

                     case 6: //6
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+parseInt(last_tranche_demande);});
                           vm.alldemande_realimentation_invalide.push(items);                          
                           vm.selectedItemDemande_realimentation = items;
                           vm.NouvelItemDemande_realimentation = true ;
                           vm.dataLastedemande = [];
                          break;
                      case 3: //7
                          
                          var last_tranche_demande = Math.max.apply(Math, vm.dataLastedemande.map(function(o){return o.tranche.code.split(' ')[1];}));
                            
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                            vm.alldemande_realimentation_invalide.push(items);                          
                            vm.selectedItemDemande_realimentation = items;
                            vm.NouvelItemDemande_realimentation = true ;
                          break;
                      case 3: //7 
                          
                          var last_tranche_demande = Math.max.apply(Math, vm.dataLastedemande.map(function(o){return o.tranche.code.split(' ')[1];}));
                            
                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj){return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                            vm.alldemande_realimentation_invalide.push(items);                          
                            vm.selectedItemDemande_realimentation = items;
                            vm.NouvelItemDemande_realimentation = true ;
                          break;
                      case 7: //7 
                          
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
                apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index",'menu',"getdemande_realimentationvalideById",'id_demande_realimentation',demande_realimentation.id).then(function(result)
                {
                  var demande_realimentation_valide = result.data.response;
                  if (demande_realimentation_valide.length !=0)
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
                      vm.alldemande_realimentation_invalide = vm.alldemande_realimentation_invalide.filter(function(obj)
                      {
                          return obj.id !== demande_realimentation.id;
                      });
                      vm.steppiecefeffi=false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceDemande_realimentation (demande_realimentation,suppression);       
                  }
                }); 
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
          {
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
            if (item.$edit ==false || item.$edit == undefined)
            {
                currentItemDemande_realimentation     = JSON.parse(JSON.stringify(vm.selectedItemDemande_realimentation));
                
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
            $scope.vm.alldemande_realimentation_invalide.forEach(function(dema) {
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
            //item.id_convention_cife_entete = vm.selectedItemDemande_realimentation.convention_cife_entete.id;
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
        {       console.log(suppression);   
            if (suppression!=1)
            {console.log('att');
               var dema = vm.alldemande_realimentation_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_realimentation.id;
                });
               console.log(dema);
                if(dema[0])
                {
                   if((dema[0].id_compte_feffi != currentItemDemande_realimentation.id_compte_feffi )
                    || (dema[0].id_tranche_deblocage_feffi != currentItemDemande_realimentation.id_tranche_deblocage_feffi )
                    || (dema[0].cumul != currentItemDemande_realimentation.cumul )
                    || (dema[0].anterieur != currentItemDemande_realimentation.anterieur )
                    || (dema[0].periode != currentItemDemande_realimentation.periode )
                    || (dema[0].pourcentage != currentItemDemande_realimentation.pourcentage )
                    || (dema[0].reste != currentItemDemande_realimentation.reste )
                    || (dema[0].date != currentItemDemande_realimentation.date ))                    
                      { 
                        insert_in_baseDemande_realimentation(item,suppression);console.log('at0');
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;console.log('at1');
                      }
                }
            } else
              insert_in_baseDemande_realimentation(item,suppression);console.log('at3');
                  
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
                    date: convertionDate(demande_realimentation.date) ,
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
                /*var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == vm.selectedItemConvention_entete.id;
                });*/

                if (vm.NouvelItemDemande_realimentation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_realimentation.compte_feffi = comp[0];
                        vm.selectedItemDemande_realimentation.tranche = tran[0] ;
                        //vm.selectedItemDemande_realimentation.convention_cife_entete = conv[0] ;
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

                  //vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)-1;
                    }
                }
                else
                {
                  demande_realimentation.tranche = tran[0] ;
                  demande_realimentation.compte_feffi = comp[0];
                  //demande_realimentation.convention_cife_entete = conv[0] ;

                  demande_realimentation.id  =   String(data.response); 
                  //vm.alldemande_realimentation.push(demande_realimentation);             
                  vm.NouvelItemDemande_realimentation=false;
                  //vm.nbr_demande_feffi = parseInt(vm.nbr_demande_feffi)+1;
            }
              demande_realimentation.$selected = false;
              demande_realimentation.$edit = false;
              vm.selectedItemDemande_realimentation = {};
              vm.modificationdemande = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.tranchechange = function(item)
        { 
          var reste = 0;
          var anterieur = 0;
          var prevu = 0;
          var cumul= 0;

          if (vm.allcurenttranche_deblocage_feffi[0].code =='tranche 1')
            {
              //prevu = parseInt(vm.allconvention_entete[0].montant_divers)+((parseInt(vm.allconvention_entete[0].montant_trav_mob) * parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100);
              prevu = ((parseFloat(vm.selectedItemConvention_entete.montant_divers) + parseFloat(vm.selectedItemConvention_entete.montant_trav_mob)) * parseFloat(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;
              
              cumul = prevu;
              if (vm.alldemande_realimentation.length>0)
              {                 
                  anterieur = vm.dataLastedemande[0].prevu;         
                  cumul = prevu + parseFloat(vm.dataLastedemande[0].cumul);
              }

              reste= vm.selectedItemConvention_entete.montant_total - cumul;

              item.periode = vm.allcurenttranche_deblocage_feffi[0].periode;
              item.pourcentage = vm.allcurenttranche_deblocage_feffi[0].pourcentage;

              item.prevu = prevu;
              item.anterieur = anterieur;
              item.cumul = cumul;
              item.reste = reste;
            } 
            else if (vm.allcurenttranche_deblocage_feffi[0].code =='tranche 2')
            {
              apiFactory.getAPIgeneraliserREST("avenant_convention/index","menu","getavenantByconvention",'id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  var avenant_convention = result.data.response;
                  var montant_avenant_tranche1 = 0;
                  var montant_avenant_tranche2 = 0;
                  var montant_convention_tranche2 = 0;
                  if (avenant_convention.length !=0)
                  {
                    var tranche_deblo_1 = vm.alltranche_deblocage_feffi.filter(function(obj)
                    {
                        return obj.code == 'tranche 1';
                    });
                    //console.log(tranche_deblo_1);
                    montant_avenant_tranche1 = (parseFloat(avenant_convention[0].montant) * tranche_deblo_1[0].pourcentage)/100;
                    montant_avenant_tranche2 = (parseFloat(avenant_convention[0].montant) * vm.allcurenttranche_deblocage_feffi[0].pourcentage)/100;
                    montant_convention_tranche2 = ((parseFloat(vm.selectedItemConvention_entete.montant_divers) + parseFloat(vm.selectedItemConvention_entete.montant_trav_mob)) * parseFloat(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;                    
                  }
                  prevu = montant_avenant_tranche1 + montant_avenant_tranche2 + montant_convention_tranche2;
                  
                  cumul = prevu;
                  if (vm.alldemande_realimentation.length>0)
                  {                 
                      anterieur = vm.dataLastedemande[0].prevu;         
                      cumul = prevu + parseFloat(vm.dataLastedemande[0].cumul);
                  }

                  reste=parseFloat( vm.selectedItemConvention_entete.montant_total) +parseFloat( avenant_convention[0].montant) -parseFloat( cumul);

                  item.periode = vm.allcurenttranche_deblocage_feffi[0].periode;
                  item.pourcentage = vm.allcurenttranche_deblocage_feffi[0].pourcentage;

                  item.prevu = prevu;
                  item.anterieur = anterieur;
                  item.cumul = cumul;
                  item.reste = reste;
              });
            }
            else 
            {
              //prevu = (parseFloat(vm.allconvention_entete[0].montant_trav_mob )* parseFloat(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;
              apiFactory.getAPIgeneraliserREST("avenant_convention/index","menu","getavenantByconvention",'id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  var avenant_convention = result.data.response;
                  console.log(avenant_convention);
                  var montant_avenant_tranche = 0;
                  var montant_convention_tranche = 0;
                  if (avenant_convention.length !=0)
                  {
                    montant_avenant_tranche = (parseFloat(avenant_convention[0].montant) * vm.allcurenttranche_deblocage_feffi[0].pourcentage)/100;
                    montant_convention_tranche = ((parseFloat(vm.selectedItemConvention_entete.montant_divers) + parseFloat(vm.selectedItemConvention_entete.montant_trav_mob)) * parseFloat(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;                    
                  }
                  prevu = montant_avenant_tranche + montant_convention_tranche;
                  
                  cumul = prevu;
                  if (vm.alldemande_realimentation.length>0)
                  {                 
                      anterieur = vm.dataLastedemande[0].prevu;         
                      cumul = prevu + parseFloat(vm.dataLastedemande[0].cumul);
                  }

                  reste=parseFloat( vm.selectedItemConvention_entete.montant_total) +parseFloat( avenant_convention[0].montant) -parseFloat( cumul);

                  item.periode = vm.allcurenttranche_deblocage_feffi[0].periode;
                  item.pourcentage = vm.allcurenttranche_deblocage_feffi[0].pourcentage;

                  item.prevu = prevu;
                  item.anterieur = anterieur;
                  item.cumul = cumul;
                  item.reste = reste;
                  
              });
            }
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


  /************************************Debut justicatif feffi*********************************************/
    vm.step_justificatif = function()
    {
      apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',vm.selectedItemDemande_realimentation.id,'id_tranche',vm.selectedItemDemande_realimentation.tranche.id).then(function(result)
      {
          vm.alljustificatif_feffi = result.data.response;
      });
    }

    //vm.myFile = [];
        vm.justificatif_feffi_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemJustificatif_feffi.fichier = vm.myFile[0].name;
        } 

        //fonction ajout dans bdd
        function ajoutJustificatif_feffi(justificatif_feffi,suppression)
        {
            if (NouvelItemJustificatif_feffi==false)
            {
                apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index",'menu',"getdemande_realimentationvalideById",'id_demande_realimentation',vm.selectedItemDemande_realimentation.id).then(function(result)
                {
                  var demande_realimentation_valide = result.data.response;
                  if (demande_realimentation_valide.length !=0)
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
                      vm.steppiecefeffi = false;
                      vm.selectedItemJustificatif_feffi = {} ;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceJustificatif_feffi (justificatif_feffi,suppression);      
                  }
                }); 
            } 
            else
            {
                insert_in_baseJustificatif_feffi(justificatif_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation document_feffi_scan
        vm.annulerJustificatif_feffi = function(item)
        {
          if (NouvelItemJustificatif_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemJustificatif_feffi.fichier ;
          }
          else
          {
            /*vm.alljustificatif_feffi = vm.alljustificatif_feffi.filter(function(obj)
            {
                return obj.id != vm.selectedItemJustificatif_feffi.id;
            });*/

            item.fichier   = '';
            item.$edit = false;
            item.$selected = false;

            item.id = 0;
          }

          vm.selectedItemJustificatif_feffi = {} ;
          NouvelItemJustificatif_feffi      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_feffi= function (item)
        {
            vm.selectedItemJustificatif_feffi = item;
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemJustificatif_feffi    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_feffi));
            }
        };
        $scope.$watch('vm.selectedItemJustificatif_feffi', function()
        {
             if (!vm.alljustificatif_feffi) return;
             vm.alljustificatif_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_feffi = function(item)
        {
            
            vm.selectedItemJustificatif_feffi = item;
            currentItemJustificatif_feffi = angular.copy(vm.selectedItemJustificatif_feffi);
            $scope.vm.alljustificatif_feffi.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id==0)
            {   
                NouvelItemJustificatif_feffi=true;
                item.fichier   = vm.selectedItemJustificatif_feffi.fichier ;
                item.id = 0 ;

            }
            else
            {   
                NouvelItemJustificatif_feffi = false ;
                item.fichier = vm.selectedItemJustificatif_feffi.fichier ;
            }
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_feffi_scan
        vm.supprimerJustificatif_feffi = function()
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
                vm.ajoutJustificatif_feffi(vm.selectedItemJustificatif_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alljustificatif_feffi.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_feffi.id;
                });
                if(mem[0])
                {
                   if(mem[0].fichier != currentItemJustificatif_feffi.fichier )                   
                      { 
                         insert_in_baseJustificatif_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_feffi
        function insert_in_baseJustificatif_feffi(justificatif_feffi,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_feffi==false)
            {
                getId = vm.selectedItemJustificatif_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_justificatif_prevu: justificatif_feffi.id_justificatif_prevu,
                    fichier: justificatif_feffi.fichier,
                    id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                    
                          var repertoire = 'justificatif_feffi/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_feffi.id
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0];
                            var name_file = vm.selectedItemConvention_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    justificatif_feffi.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_feffi.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_feffi.fichier,
                                                      id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                                                      //validation:0
                                        });
                                      apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_feffi.$selected = false;
                                          justificatif_feffi.$edit = false;
                                          justificatif_feffi.fichier=currentItemJustificatif_feffi.fichier;
                                          vm.selectedItemJustificatif_feffi = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_feffi.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        id_justificatif_prevu: justificatif_feffi.id_justificatif_prevu,
                                        fichier: justificatif_feffi.fichier,
                                        id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                                        //validation:0               
                                    });
                                  apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_feffi.$selected = false;
                                      justificatif_feffi.$edit = false;
                                      vm.selectedItemJustificatif_feffi = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_feffi.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_feffi.fichier,
                                                      id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                                                      //validation:0
                                        });
                                      apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_feffi.$selected = false;
                                          justificatif_feffi.$edit = false;
                                          justificatif_feffi.fichier=currentItemJustificatif_feffi.fichier;
                                          vm.selectedItemJustificatif_feffi = {};
                                      console.log('b');
                                      });
                            });
                          }


                        vm.selectedItemJustificatif_feffi.$selected  = false;
                        vm.selectedItemJustificatif_feffi.$edit      = false;
                        vm.selectedItemJustificatif_feffi ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      /*vm.alljustificatif_feffi = vm.alljustificatif_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_feffi.id;
                      });*/
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_feffi.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         vm.selectedItemJustificatif_feffi.fichier = '';

                          vm.selectedItemJustificatif_feffi.id = 0;
                          //vm.selectedItemJustificatif_feffi = {};

                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                    }
              }
              else
              {
                  justificatif_feffi.id  =   String(data.response);              
                  NouvelItemJustificatif_feffi = false;

                  vm.showbuttonNouvManuel = false;
                    
                    
                    var repertoire = 'justificatif_feffi/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                      var file= vm.myFile[0];
                      var name_file = vm.selectedItemConvention_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              justificatif_feffi.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                id_justificatif_prevu: currentItemJustificatif_feffi.id_justificatif_prevu,
                                                fichier: currentItemJustificatif_feffi.fichier,
                                                id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id
                                  });
                                apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_feffi.$selected = false;
                                    justificatif_feffi.$edit = false;
                                    justificatif_feffi.fichier=null;
                                    vm.selectedItemJustificatif_feffi = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_feffi.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  id_justificatif_prevu: justificatif_feffi.id_justificatif_prevu,
                                  fichier: justificatif_feffi.fichier,
                                  id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id               
                              });
                            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_feffi.$selected = false;
                                justificatif_feffi.$edit = false;
                                vm.selectedItemJustificatif_feffi = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                                                      supprimer: 1,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_feffi.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_feffi.fichier,
                                                      id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id,
                                                      //validation:0
                                        });
                                      apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_feffi.$selected = false;
                                          justificatif_feffi.$edit = false;
                                          justificatif_feffi.fichier=null;
                                          vm.selectedItemJustificatif_feffi = {};
                                      
                                      });
                      });
                    }
              }
              justificatif_feffi.$selected = false;
              justificatif_feffi.$edit = false;
             // vm.selectedItemJustificatif_feffi = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_justificatif = function(item)
        {
           window.open(apiUrlFile+item.fichier);
        }
       
    /******************************************debut justicatif feffi***********************************************/

        
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
