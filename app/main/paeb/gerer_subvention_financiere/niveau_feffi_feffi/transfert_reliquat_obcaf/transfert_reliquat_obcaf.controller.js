
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.transfert_reliquat_obcaf')
        .directive('customOnChangepiecereliq', function($mdDialog) {
          return {
            restrict: 'A',
            require:'ngModel',
            link: function (scope, element, attrs,ngModel) {
              var onChangeHandler = scope.$eval(attrs.customOnChangepiecereliq);
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
                        scope.justificatif_transfert_reliquat.fichier = null;
                      }, function() {
                        //alert('rien');
                      });
                }
                else
                {                
                    ngModel.$setViewValue(files);
                    scope.justificatif_transfert_reliquat.fichier = files[0].name;
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
        .controller('Transfert_reliquat_obcafController', Transfert_reliquat_obcafController);
    /** @ngInject */
    function Transfert_reliquat_obcafController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
        vm.stepMenu_reliquat = false;
        vm.stepjusti_trans_reliqua = false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;
        vm.myFile = [];

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
           /* if (vm.session=='ADMIN')
            {*/
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
           // }
            
          
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
        vm.filtre = {
                id_cisco: null,
                id_region: null
              }
        vm.showbuttonNeauveaudemandefeffi=true;
        apiFactory.getAll("region/index").then(function success(response)
        {
            vm.regions = response.data.response;
        });
        /* apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("OBCAF")!= -1)
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

             }else
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
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
            {
                  vm.allconvention_entete = result.data.response;
                  vm.affiche_load =false;
            });

             /* switch (vm.session)
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

           /* donnee_menu_reliquat(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepMenu_reliquat=true;
                console.log(vm.stepMenu_reliquat);  
            });*/
            vm.stepMenu_reliquat=true;            
             /* apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                  vm.allcompte_feffi= result.data.response;
              });*/
              
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

       /* function donnee_menu_reliquat(item,session)
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
                                console.log(result.data.response);
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
        }*/


        /**************************************Debut transfert reliquat*********************************************/
        vm.transfert_reliquat = function()
        { 
          vm.stepjusti_trans_reliqua = false;
          apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','gettransfertByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alltransfert_reliquat = result.data.response.filter(function(obj)
              {
                  return obj.validation == 0;
              });
              console.log(result.data.response);
              if (result.data.response.length!=0)
              {
                  vm.showbuttonNouvTransfert_reliquat=false;
              }
        });
        }
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
          var decaiss = 0;
          var paiement_mpe = 0;
          var paiement_moe = 0;
          var objet_utilisation=0;
          var montant_reliquat = 0;
          if (NouvelItemTransfert_reliquat == false)
          {

            apiFactory.getAPIgeneraliserREST("transfert_reliquat/index",'menu','getmontantatransfererByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                var paiement_detail = result.data.response;
                if (paiement_detail.length!=0)
                {
                  if (paiement_detail[0].montant_decaiss_fonct_feffi !=null)
                  {
                    decaiss = paiement_detail[0].montant_decaiss_fonct_feffi;
                  }

                  if (paiement_detail[0].montant_paiement_mpe !=null)
                  {
                    paiement_mpe = paiement_detail[0].montant_paiement_mpe;
                  }

                  if (paiement_detail[0].montant_paiement_moe !=null)
                  {
                    paiement_moe = paiement_detail[0].montant_paiement_moe;
                  }

                }
                montant_reliquat = parseFloat(vm.selectedItemConvention_entete.montant_total)-parseFloat(decaiss)-parseFloat(paiement_mpe)-parseFloat(paiement_moe)
                if (montant_reliquat<=1000000)
                {
                  objet_utilisation=0;
                }
                            
                var items = {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  montant:parseFloat(vm.selectedItemConvention_entete.montant_total)-parseFloat(decaiss)-parseFloat(paiement_mpe)-parseFloat(paiement_moe),
                  date_transfert: '',
                  objet_utilisation: objet_utilisation,
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
            });
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
              item.id_convention_entete    = currentItemTransfert_reliquat.id_convention_entete ;
              item.montant  = currentItemTransfert_reliquat.montant ;
              item.objet_utilisation  = currentItemTransfert_reliquat.objet_utilisation ;
              item.situation_utilisation  = currentItemTransfert_reliquat.situation_utilisation ;
              item.date_transfert       = new Date(currentItemTransfert_reliquat.date_transfert);              
              item.intitule_compte = currentItemTransfert_reliquat.intitule_compte ;
              item.rib = currentItemTransfert_reliquat.rib;
              item.observation = currentItemTransfert_reliquat.observation;
              
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
            if(item.$edit==false || item.$edit==undefined)
            {
              currentItemTransfert_reliquat     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_reliquat));
              vm.showbuttonValidationtransfert_reliquat = true;
            }
            
            //recuperation donnée convention
           if (vm.selectedItemTransfert_reliquat.id!=0)
            {   
                vm.validation_transfert_reliquat = item.validation;
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
            item.montant  = parseFloat(vm.selectedItemTransfert_reliquat.montant);
            item.objet_utilisation  = vm.selectedItemTransfert_reliquat.objet_utilisation ;
            item.situation_utilisation  = vm.selectedItemTransfert_reliquat.situation_utilisation ;
            item.date_transfert  = new Date(vm.selectedItemTransfert_reliquat.date_transfert) ;
            item.intitule_compte = vm.selectedItemTransfert_reliquat.intitule_compte ;
            item.rib = parseInt(vm.selectedItemTransfert_reliquat.rib);
            item.observation = vm.selectedItemTransfert_reliquat.observation;
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
                vm.ajoutTransfert_reliquat(vm.selectedItemTransfert_reliquat,1);
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
                
                /*var conv = vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == transfert_reliquat.id_convention_entete;
                });*/

                if (NouvelItemTransfert_reliquat == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                       // vm.selectedItemTransfert_reliquat.convention_entete   = conv[0];
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
                  //transfert_reliquat.convention_entete = conv[0];
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
        vm.step_menu_justi = function()
        {          
          apiFactory.getAPIgeneraliserREST("justificatif_transfert_reliquat/index",'id_transfert_reliquat',vm.selectedItemTransfert_reliquat.id).then(function(result)
          {
              vm.alljustificatif_transfert_reliquat = result.data.response;
          });
        }
    vm.justificatif_transfert_reliquat_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFiletransfert_reliquat = function(event)
       {
          //console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemJustificatif_transfert_reliquat.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemJustificatif_transfert_reliquat.fichier);
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
            if (item.$edit==false || item.$edit==undefined)
            {
               currentItemJustificatif_transfert_reliquat    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_transfert_reliquat));
            }
            
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
                         
                    
                          var repertoire = 'justificatif_transfert_reliquat/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_transfert_reliquat.id
                                              
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
                                    justificatif_transfert_reliquat.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: currentItemJustificatif_transfert_reliquat.description,
                                                      fichier: currentItemJustificatif_transfert_reliquat.fichier,
                                                      id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_transfert_reliquat.$selected = false;
                                          justificatif_transfert_reliquat.$edit = false;                                      
                                          justificatif_transfert_reliquat.fichier=currentItemJustificatif_transfert_reliquat.fichier;
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
                              var datas = $.param({
                                supprimer: suppression,
                                id:        getIdFile,
                                description: currentItemJustificatif_transfert_reliquat.description,
                                fichier: currentItemJustificatif_transfert_reliquat.fichier,
                                id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                validation:0
                              });
                            apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                            {  
                                vm.showbuttonNouvManuel = true;
                                justificatif_transfert_reliquat.$selected = false;
                                justificatif_transfert_reliquat.$edit = false;                                      
                                justificatif_transfert_reliquat.fichier=currentItemJustificatif_transfert_reliquat.fichier;
                                vm.selectedItemJustificatif_transfert_reliquat = {};
                            console.log('b');
                            });
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
                    
                    
                    var repertoire = 'justificatif_transfert_reliquat/';
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
                              justificatif_transfert_reliquat.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                description: currentItemJustificatif_transfert_reliquat.description,
                                                fichier: currentItemJustificatif_transfert_reliquat.fichier,
                                                id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                                                
                                  });
                                apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                                { 
                                  vm.alljustificatif_transfert_reliquat = vm.alljustificatif_transfert_reliquat.filter(function(obj)
                                  {
                                      return obj.id !== getIdFile;
                                  });
                                    justificatif_transfert_reliquat.$selected = false;
                                    justificatif_transfert_reliquat.$edit = false;
                                   // justificatif_transfert_reliquat.fichier=currentItemJustificatif_transfert_reliquat.fichier;
                                    //vm.selectedItemJustificatif_transfert_reliquat = {};
                               
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
                        var datas = $.param({
                          supprimer: 1,
                          id:        getIdFile,
                          description: currentItemJustificatif_transfert_reliquat.description,
                          fichier: currentItemJustificatif_transfert_reliquat.fichier,
                          id_transfert_reliquat: vm.selectedItemTransfert_reliquat.id,
                          
                          });
                        apiFactory.add("justificatif_transfert_reliquat/index",datas, config).success(function (data)
                        { 
                          vm.alljustificatif_transfert_reliquat = vm.alljustificatif_transfert_reliquat.filter(function(obj)
                          {
                              return obj.id !== getIdFile;
                          });
                            justificatif_transfert_reliquat.$selected = false;
                            justificatif_transfert_reliquat.$edit = false;
                            //justificatif_transfert_reliquat.fichier=currentItemJustificatif_transfert_reliquat.fichier;
                            //vm.selectedItemJustificatif_transfert_reliquat = {};
                      
                        });
                      });
                    }
              }
              justificatif_transfert_reliquat.$selected = false;
              justificatif_transfert_reliquat.$edit = false;
              //vm.selectedItemJustificatif_transfert_reliquat = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_transfert_reliquat = function(item)
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
