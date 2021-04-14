(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.decai_fonctionnement')
        .directive('customOnChangepiecedecaiss', function($mdDialog) {
          return {
            restrict: 'A',
            require:'ngModel',
            link: function (scope, element, attrs,ngModel) {
              var onChangeHandler = scope.$eval(attrs.customOnChangepiecedecaiss);
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
                        scope.justificatif_decaiss_fonct_feffi.fichier = null;
                      }, function() {
                        //alert('rien');
                      });
                }
                else
                {                
                    ngModel.$setViewValue(files);
                    scope.justificatif_decaiss_fonct_feffi.fichier = files[0].name;
                } 
            });
            }
          };
        }) 
        .controller('Decai_fonctionnementController', Decai_fonctionnementController)
    /** @ngInject */
    function Decai_fonctionnementController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepDecaiss=false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;
        vm.myFile = [];
        
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

/*******************************Debut initialisation suivi financement feffi******************************/ 
        vm.validation = 0;
        vm.roles = [];


        //initialisation decaissement fonctionnement feffi
        vm.ajoutDecaiss_fonct_feffi = ajoutDecaiss_fonct_feffi;
        var NouvelItemDecaiss_fonct_feffi=false;
        var currentItemDecaiss_fonct_feffi;
        vm.selectedItemDecaiss_fonct_feffi = {} ;
        vm.alldecaiss_fonct_feffi = [] ;

        vm.ajoutJustificatif_decaiss_fonct_feffi = ajoutJustificatif_decaiss_fonct_feffi;
        var NouvelItemJustificatif_decaiss_fonct_feffi=false;
        var currentItemJustificatif_decaiss_fonct_feffi;
        vm.selectedItemJustificatif_decaiss_fonct_feffi = {} ;
        vm.alljustificatif_decaiss_fonct_feffi = [] ;
        vm.stepjusti_decais = false;   

/*******************************Fin initialisation suivi financement feffi******************************/

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
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
        apiFactory.getAll("region/index").then(function success(response)
        {
            vm.regions = response.data.response;
        });
        /*var id_user = $cookieStore.get('id');
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("OBCAF")!= -1)
            { 
                            vm.usercisco = result.data.response.cisco;
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionbycisco",'id_cisco',vm.usercisco.id).then(function(result)
                            {
                                vm.regions = result.data.response;
                                console.log(vm.regions);
                            }, function error(result){ alert('something went wrong')});
                            vm.ciscos.push(vm.usercisco);
                            vm.showbuttonNeauveaudemandefeffi=true;                            
                            vm.session = 'OBCAF';

            }
            else
            {                           
                            vm.showbuttonNeauveaudemandefeffi=true;
                             apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            }, function error(response){ alert('something went wrong')});
                            vm.session = 'ADMIN'; 
              
            }                  

         });*/

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
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
            });

              /*switch (vm.session)
                { 
                  case 'OBCAF':console.log(vm.usercisco.id);
                            
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByfiltrecisco','id_cisco_user',vm.usercisco.id,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                              {
                                  vm.allconvention_entete = result.data.response;
                                  vm.affiche_load =false;

                              });
                         
                console.log(filtre);                
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
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepDecaiss=true
/*
            donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepDecaiss=true;
                console.log(vm.stepMenu_feffi); 
            });*/
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              vm.nbr_decaiss_feffi = item.nbr_decaiss_feffi;
                vm.stepjusti_decais = false; 
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
        
        /*function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                switch (session)
                {
                  case 'OBCAF':
                              apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.alldecaiss_fonct_feffi = result.data.response; 
                                  return resolve('ok');
                              });

                              vm.modif_suppre = true;
                              //vm.nbr_demande_feffi = item.nbr_demande_feffi_creer
                            
                      break;

                  case 'ADMIN':
                           apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.alldecaiss_fonct_feffi = result.data.response; 
                                return resolve('ok');
                            });                              
                       
                      break;
                  default:
                      break;
              
                }            
            });
        
        }*/


  /**********************************fin decaissement fonctionnement feffi******************************/

        vm.step_menu_decaiss = function()
        { 
          vm.stepjusti_decais = false;
          NouvelItemDecaiss_fonct_feffi = false; 
          apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_invalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alldecaiss_fonct_feffi = result.data.response; 
          });
        }
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
        
            vm.alldecaiss_fonct_feffi.unshift(items);
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
                apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu',"getddecaiss_fonct_feffiById",'id_decaiss_fonct_feffi',decaiss_fonct_feffi.id).then(function(result)
                {
                  var decaiss_fonct_feffi_valide = result.data.response;
                  if (decaiss_fonct_feffi_valide.length !=0)
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
                      vm.alldecaiss_fonct_feffi = vm.alldecaiss_fonct_feffi.filter(function(obj)
                      {
                          return obj.id !== decaiss_fonct_feffi.id;
                      });

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceDecaiss_fonct_feffi (decaiss_fonct_feffi,suppression);  
                  }
                }); 
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
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemDecaiss_fonct_feffi    = JSON.parse(JSON.stringify(vm.selectedItemDecaiss_fonct_feffi));
              vm.stepjusti_decais = true;                
            }
            else
            {
              vm.stepjusti_decais = false;
            }
            vm.validation_decais_fef=item.validation;
             
           /*if (vm.selectedItemDecaiss_fonct_feffi.id!=0)
            {  
                apiFactory.getAPIgeneraliserREST("justificatif_decaiss_fonct_feffi/index",'id_decaiss_fonct_feffi',item.id).then(function(result)
                {
                    vm.alljustificatif_decaiss_fonct_feffi = result.data.response;
                    console.log(vm.alljustificatif_decaiss_fonct_feffi) ;
                });
            };*/
            
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
            item.montant   = parseFloat(vm.selectedItemDecaiss_fonct_feffi.montant);
            item.date_decaissement   = new Date(vm.selectedItemDecaiss_fonct_feffi.date_decaissement) ;
            item.observation   = vm.selectedItemDecaiss_fonct_feffi.observation ;
        };

        //fonction bouton suppression item decaiss_fonct_feffi
        vm.supprimerDecaiss_fonct_feffi = function()
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
              /*var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == decaiss_fonct_feffi.id_convention_entete;
                });*/

              if (NouvelItemDecaiss_fonct_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        //vm.selectedItemDecaiss_fonct_feffi.convention_entete = conv[0];
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
                  //decaiss_fonct_feffi.convention_entete = conv[0];
                  decaiss_fonct_feffi.id  =   String(data.response);              
                  NouvelItemDecaiss_fonct_feffi = false;
                  decaiss_fonct_feffi.validation = 0;
              vm.nbr_decaiss_feffi = parseInt(vm.nbr_decaiss_feffi)+1;
                                        
               }
              
              decaiss_fonct_feffi.$selected = false;
              decaiss_fonct_feffi.$edit = false;
              vm.selectedItemDecaiss_fonct_feffi = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }        

    /*********************************************Fin decaissement feffi************************************************/

    /*********************************************Fin justificatif reliquat************************************************/
        vm.step_menu_justif = function()
        {
          apiFactory.getAPIgeneraliserREST("justificatif_decaiss_fonct_feffi/index",'id_decaiss_fonct_feffi',vm.selectedItemDecaiss_fonct_feffi.id).then(function(result)
          {
            vm.alljustificatif_decaiss_fonct_feffi = result.data.response;
          });
        }
        
        vm.justificatif_decaiss_fonct_feffi_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFiledecaiss_fonct_feffi = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemJustificatif_decaiss_fonct_feffi.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemJustificatif_decaiss_fonct_feffi.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_decaiss_fonct_feffi = function ()
        { 
          if (NouvelItemJustificatif_decaiss_fonct_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_decaiss_fonct_feffi.unshift(items);
            vm.alljustificatif_decaiss_fonct_feffi.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_decaiss_fonct_feffi = mem;
              }
            });

            NouvelItemJustificatif_decaiss_fonct_feffi = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_decaiss_fonct_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_decaiss_fonct_feffi(justificatif_decaiss_fonct_feffi,suppression)
        {
            if (NouvelItemJustificatif_decaiss_fonct_feffi==false)
            {
                apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu',"getddecaiss_fonct_feffiById",'id_decaiss_fonct_feffi',vm.selectedItemDecaiss_fonct_feffi.id).then(function(result)
                {
                  var decaiss_fonct_feffi_valide = result.data.response;
                  if (decaiss_fonct_feffi_valide.length !=0)
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
                        vm.stepjusti_decais = false; 

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceJustificatif_decaiss_fonct_feffi (justificatif_decaiss_fonct_feffi,suppression); 
                  }
                }); 
            } 
            else
            {
                insert_in_baseJustificatif_decaiss_fonct_feffi(justificatif_decaiss_fonct_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_decaiss_fonct_feffi
        vm.annulerJustificatif_decaiss_fonct_feffi = function(item)
        {
          if (NouvelItemJustificatif_decaiss_fonct_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_decaiss_fonct_feffi.description ;
            item.fichier   = currentItemJustificatif_decaiss_fonct_feffi.fichier ;
          }else
          {
            vm.alljustificatif_decaiss_fonct_feffi = vm.alljustificatif_decaiss_fonct_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_decaiss_fonct_feffi.id;
            });
          }

          vm.selectedItemJustificatif_decaiss_fonct_feffi = {} ;
          NouvelItemJustificatif_decaiss_fonct_feffi      = false;
          
        };

        //fonction selection item justificatif decaiss_fonct_feffi
        vm.selectionJustificatif_decaiss_fonct_feffi= function (item)
        {
            vm.selectedItemJustificatif_decaiss_fonct_feffi = item;
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemJustificatif_decaiss_fonct_feffi    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_decaiss_fonct_feffi));
            }
            
        };
        $scope.$watch('vm.selectedItemJustificatif_decaiss_fonct_feffi', function()
        {
             if (!vm.alljustificatif_decaiss_fonct_feffi) return;
             vm.alljustificatif_decaiss_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_decaiss_fonct_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_decaiss_fonct_feffi = function(item)
        {
            NouvelItemJustificatif_decaiss_fonct_feffi = false ;
            vm.selectedItemJustificatif_decaiss_fonct_feffi = item;
            currentItemJustificatif_decaiss_fonct_feffi = angular.copy(vm.selectedItemJustificatif_decaiss_fonct_feffi);
            $scope.vm.alljustificatif_decaiss_fonct_feffi.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_decaiss_fonct_feffi.description ;
            item.fichier   = vm.selectedItemJustificatif_decaiss_fonct_feffi.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_decaiss_fonct_feffi
        vm.supprimerJustificatif_decaiss_fonct_feffi = function()
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
                vm.ajoutJustificatif_decaiss_fonct_feffi(vm.selectedItemJustificatif_decaiss_fonct_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_decaiss_fonct_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_decaiss_fonct_feffi.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_decaiss_fonct_feffi.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_decaiss_fonct_feffi.description )
                    ||(just[0].fichier   != currentItemJustificatif_decaiss_fonct_feffi.fichier ))                   
                      { 
                         insert_in_baseJustificatif_decaiss_fonct_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_decaiss_fonct_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_decaiss_fonct_feffi
        function insert_in_baseJustificatif_decaiss_fonct_feffi(justificatif_decaiss_fonct_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_decaiss_fonct_feffi==false)
            {
                getId = vm.selectedItemJustificatif_decaiss_fonct_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_decaiss_fonct_feffi.description,
                    fichier: justificatif_decaiss_fonct_feffi.fichier,
                    id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_decaiss_fonct_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                    
                          var repertoire = 'justificatif_decaiss_fonct_feffi/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_decaiss_fonct_feffi.id
                                              
                          if(vm.myFile.length !=0)
                          { 
                            var file= vm.myFile[0];
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
                                    justificatif_decaiss_fonct_feffi.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: currentItemJustificatif_decaiss_fonct_feffi.description,
                                                      fichier: currentItemJustificatif_decaiss_fonct_feffi.fichier,
                                                      id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_decaiss_fonct_feffi.$selected = false;
                                          justificatif_decaiss_fonct_feffi.$edit = false;                                          
                                          justificatif_decaiss_fonct_feffi.fichier=currentItemJustificatif_decaiss_fonct_feffi.fichier;
                                          vm.selectedItemJustificatif_decaiss_fonct_feffi = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_decaiss_fonct_feffi.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_decaiss_fonct_feffi.description,
                                        fichier: justificatif_decaiss_fonct_feffi.fichier,
                                        id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_decaiss_fonct_feffi.$selected = false;
                                      justificatif_decaiss_fonct_feffi.$edit = false;
                                      vm.selectedItemJustificatif_decaiss_fonct_feffi = {};
                                     /* var chemin= currentItemDecaiss_fonct_feffi.fichier;
                                        var fd = new FormData();
                                            fd.append('chemin',chemin);
                                      
                                        var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                                        var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                                        headers: {'Content-Type': undefined}, chemin: chemin
                                        }).success(function(data)
                                        {
                                          console.log('ok');
                                        })*/
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                supprimer: suppression,
                                id:        getIdFile,
                                description: currentItemJustificatif_decaiss_fonct_feffi.description,
                                fichier: currentItemJustificatif_decaiss_fonct_feffi.fichier,
                                id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                                validation:0
                                });
                              apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
                              {  
                                  vm.showbuttonNouvManuel = true;
                                  justificatif_decaiss_fonct_feffi.$selected = false;
                                  justificatif_decaiss_fonct_feffi.$edit = false;                                          
                                  justificatif_decaiss_fonct_feffi.fichier=currentItemJustificatif_decaiss_fonct_feffi.fichier;
                                  vm.selectedItemJustificatif_decaiss_fonct_feffi = {};
                              console.log('b');
                              });
                            });
                          }


                        vm.selectedItemJustificatif_decaiss_fonct_feffi.$selected  = false;
                        vm.selectedItemJustificatif_decaiss_fonct_feffi.$edit      = false;
                        vm.selectedItemJustificatif_decaiss_fonct_feffi ={};
                    }
                    else 
                    {    
                      vm.alljustificatif_decaiss_fonct_feffi = vm.alljustificatif_decaiss_fonct_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_decaiss_fonct_feffi.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_decaiss_fonct_feffi.fichier;
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
                  justificatif_decaiss_fonct_feffi.id  =   String(data.response);              
                  NouvelItemJustificatif_decaiss_fonct_feffi = false;

                  vm.showbuttonNouvManuel = false;
                    
                    var repertoire = 'justificatif_decaiss_fonct_feffi/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length!=0)
                    { 
                      var file= vm.myFile[0];
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
                              justificatif_decaiss_fonct_feffi.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                description: currentItemJustificatif_decaiss_fonct_feffi.description,
                                                fichier: currentItemJustificatif_decaiss_fonct_feffi.fichier,
                                                id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                                                
                                  });
                                apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
                                { 
                                  vm.alljustificatif_decaiss_fonct_feffi = vm.alljustificatif_decaiss_fonct_feffi.filter(function(obj)
                                  {
                                      return obj.id !== getIdFile;
                                  });
                                  justificatif_decaiss_fonct_feffi.$selected = false;
                                    justificatif_decaiss_fonct_feffi.$edit = false;
                                    vm.selectedItemJustificatif_decaiss_fonct_feffi = {};
                               
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_decaiss_fonct_feffi.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_decaiss_fonct_feffi.description,
                                  fichier: justificatif_decaiss_fonct_feffi.fichier,
                                  id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                                               
                              });
                            apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_decaiss_fonct_feffi.$selected = false;
                                justificatif_decaiss_fonct_feffi.$edit = false;
                                //vm.selectedItemJustificatif_decaiss_fonct_feffi = {};
                                
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                          supprimer: 1,
                          id:        getIdFile,
                          description: currentItemJustificatif_decaiss_fonct_feffi.description,
                          fichier: currentItemJustificatif_decaiss_fonct_feffi.fichier,
                          id_decaiss_fonct_feffi: vm.selectedItemDecaiss_fonct_feffi.id,
                          
                        });
                      apiFactory.add("justificatif_decaiss_fonct_feffi/index",datas, config).success(function (data)
                      { 
                        vm.alljustificatif_decaiss_fonct_feffi = vm.alljustificatif_decaiss_fonct_feffi.filter(function(obj)
                        {
                            return obj.id !== getIdFile;
                        });
                        justificatif_decaiss_fonct_feffi.$selected = false;
                          justificatif_decaiss_fonct_feffi.$edit = false;
                          //vm.selectedItemJustificatif_decaiss_fonct_feffi = {};
                    
                      });
                      });
                    }
              }
              justificatif_decaiss_fonct_feffi.$selected = false;
              justificatif_decaiss_fonct_feffi.$edit = false;
             // vm.selectedItemJustificatif_decaiss_fonct_feffi = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_decaiss_fonct_feffi = function(item)
        {
          window.open(apiUrlFile+item.fichier);
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
