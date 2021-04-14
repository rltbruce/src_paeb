(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_feffi_feffi.addition_frais_fonctionnement_validation')
        .directive('customOnChangepieceaddition', function($mdDialog) {
          return {
            restrict: 'A',
            require:'ngModel',
            link: function (scope, element, attrs,ngModel) {
              var onChangeHandler = scope.$eval(attrs.customOnChangepieceaddition);
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
                        scope.justificatif_frais_fonction_feffi.fichier = null;
                      }, function() {
                        //alert('rien');
                      });
                }
                else
                {                
                    ngModel.$setViewValue(files);
                    scope.justificatif_frais_fonction_feffi.fichier = files[0].name;
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
        .controller('Addition_frais_fonctionnement_validationController', Addition_frais_fonctionnement_validationController)
    /** @ngInject */
    function Addition_frais_fonctionnement_validationController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepAddition=false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;

        vm.ajoutJustificatif_frais_fonction_feffi = ajoutJustificatif_frais_fonction_feffi;
        var NouvelItemJustificatif_frais_fonction_feffi=false;
        var currentItemJustificatif_frais_fonction_feffi;
        vm.selectedItemJustificatif_frais_fonction_feffi = {} ;
        vm.alljustificatif_frais_fonction_feffi = [] ;
        vm.myFile = [];
        
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

/*******************************Debut initialisation suivi financement feffi******************************/ 
        vm.validation = 0;
        vm.roles = [];
        vm.steppieceaddition = false;


        //initialisation decaissement fonctionnement feffi
        vm.ajoutAddition_frais_fonctionnement_validation = ajoutAddition_frais_fonctionnement_validation;
        var NouvelItemAddition_frais_fonctionnement_validation=false;
        var currentItemAddition_frais_fonctionnement_validation;
        vm.selectedItemAddition_frais_fonctionnement_validation = {} ;
        vm.alladdition_frais_fonctionnement_validation = [] ;  
        vm.showbuttonvalidation_addition = false;
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

        
        apiFactory.getAll("rubrique_addition_fonct_feffi/index").then(function success(response)
        {
            vm.allrubrique_addition_fonctionnement = response.data.response;
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
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepAddition=true;
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
        
  /**********************************fin decaissement fonctionnement feffi******************************/

        vm.step_menu_addition = function()
        { 
          vm.affiche_load =true;
          NouvelItemAddition_frais_fonctionnement_validation = false;
          apiFactory.getAPIgeneraliserREST("addition_frais_fonctionnement/index",'menu','getaddition_invalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alladdition_frais_fonctionnement_validation = result.data.response;
              console.log(vm.alladdition_frais_fonctionnement_validation);
              vm.affiche_load =false; 
              vm.showbuttonvalidation_addition = false;              
              vm.steppieceaddition = false;
          });
        }
        //Masque de saisi ajout
        vm.ajouterAddition_frais_fonctionnement_validation= function ()
        { 
          
          if (NouvelItemAddition_frais_fonctionnement_validation == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              libelle: '',
              montant: '',
              observation: ''
            };
        
            vm.alladdition_frais_fonctionnement_validation.unshift(items);
            vm.alladdition_frais_fonctionnement_validation.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemAddition_frais_fonctionnement_validation = mem;
              }
            });

            NouvelItemAddition_frais_fonctionnement_validation = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout addition_frais_fonctionnement_validation','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutAddition_frais_fonctionnement_validation(addition_frais_fonctionnement_validation,suppression)
        {
            if (NouvelItemAddition_frais_fonctionnement_validation==false)
            {
                apiFactory.getAPIgeneraliserREST("addition_frais_fonctionnement/index",'menu',"getaddition_frais_fonctionnementById",'id_addition',addition_frais_fonctionnement_validation.id).then(function(result)
                {
                  var addition_frais_fonctionnement_validation_valide = result.data.response;
                  if (addition_frais_fonctionnement_validation_valide.length !=0)
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
                      vm.alladdition_frais_fonctionnement_validation = vm.alladdition_frais_fonctionnement_validation.filter(function(obj)
                      {
                          return obj.id !== addition_frais_fonctionnement_validation.id;
                      });
                      vm.showbuttonvalidation_addition = false;
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceAddition_frais_fonctionnement_validation (addition_frais_fonctionnement_validation,suppression);  
                  }
                }); 
            } 
            else
            {
                insert_in_baseAddition_frais_fonctionnement_validation(addition_frais_fonctionnement_validation,suppression);
            }
        }

        //fonction de bouton d'annulation addition_frais_fonctionnement_validation
        vm.annulerAddition_frais_fonctionnement_validation = function(item)
        {
          if (NouvelItemAddition_frais_fonctionnement_validation == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.montant   = currentItemAddition_frais_fonctionnement_validation.montant ;
            item.libelle   = currentItemAddition_frais_fonctionnement_validation.libelle ;
            item.observation   = currentItemAddition_frais_fonctionnement_validation.observation ;
          }else
          {
            vm.alladdition_frais_fonctionnement_validation = vm.alladdition_frais_fonctionnement_validation.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAddition_frais_fonctionnement_validation.id;
            });
          }

          vm.selectedItemAddition_frais_fonctionnement_validation = {} ;
          NouvelItemAddition_frais_fonctionnement_validation      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionAddition_frais_fonctionnement_validation= function (item)
        {
            vm.selectedItemAddition_frais_fonctionnement_validation = item;
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemAddition_frais_fonctionnement_validation    = JSON.parse(JSON.stringify(vm.selectedItemAddition_frais_fonctionnement_validation));
              vm.showbuttonvalidation_addition = true;
              vm.steppieceaddition = true; 
            }
            else
            {
              vm.showbuttonvalidation_addition = false;
              vm.steppieceaddition = false;
            }
            vm.validation_decais_fef=item.validation;            
            
            
        };
        $scope.$watch('vm.selectedItemAddition_frais_fonctionnement_validation', function()
        {
             if (!vm.alladdition_frais_fonctionnement_validation) return;
             vm.alladdition_frais_fonctionnement_validation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAddition_frais_fonctionnement_validation.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierAddition_frais_fonctionnement_validation = function(item)
        {
            NouvelItemAddition_frais_fonctionnement_validation = false ;
            vm.selectedItemAddition_frais_fonctionnement_validation = item;
            currentItemAddition_frais_fonctionnement_validation = angular.copy(vm.selectedItemAddition_frais_fonctionnement_validation);
            $scope.vm.alladdition_frais_fonctionnement_validation.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.montant   = parseFloat(vm.selectedItemAddition_frais_fonctionnement_validation.montant);
            item.libelle   = vm.selectedItemAddition_frais_fonctionnement_validation.libelle ;
            item.observation   = vm.selectedItemAddition_frais_fonctionnement_validation.observation ;
            item.id_rubrique_addition   = vm.selectedItemAddition_frais_fonctionnement_validation.rubrique.id;
            vm.showbuttonvalidation_addition = false;
        };

        //fonction bouton suppression item addition_frais_fonctionnement_validation
        vm.supprimerAddition_frais_fonctionnement_validation = function()
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
                vm.ajoutAddition_frais_fonctionnement_validation(vm.selectedItemAddition_frais_fonctionnement_validation,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAddition_frais_fonctionnement_validation (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alladdition_frais_fonctionnement_validation.filter(function(obj)
                {
                   return obj.id == currentItemAddition_frais_fonctionnement_validation.id;
                });
                if(mem[0])
                {
                   if((mem[0].montant   != currentItemAddition_frais_fonctionnement_validation.montant )
                    ||(mem[0].observation   != currentItemAddition_frais_fonctionnement_validation.observation )
                    ||(mem[0].id_rubrique_addition   != currentItemAddition_frais_fonctionnement_validation.id_rubrique_addition ))                   
                      { 
                         insert_in_baseAddition_frais_fonctionnement_validation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAddition_frais_fonctionnement_validation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd addition_frais_fonctionnement_validation
        function insert_in_baseAddition_frais_fonctionnement_validation(addition_frais_fonctionnement_validation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAddition_frais_fonctionnement_validation==false)
            {
                getId = vm.selectedItemAddition_frais_fonctionnement_validation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    montant: addition_frais_fonctionnement_validation.montant,
                    libelle: addition_frais_fonctionnement_validation.libelle,
                    observation: addition_frais_fonctionnement_validation.observation,
                    id_rubrique_addition: addition_frais_fonctionnement_validation.id_rubrique_addition,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("addition_frais_fonctionnement/index",datas, config).success(function (data)
            {  
              var rubri = vm.allrubrique_addition_fonctionnement.filter(function(obj)
                {
                   return obj.id == addition_frais_fonctionnement_validation.id_rubrique_addition;
                });

              if (NouvelItemAddition_frais_fonctionnement_validation == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    { 
                        vm.selectedItemAddition_frais_fonctionnement_validation.rubrique  = rubri[0];
                        vm.selectedItemAddition_frais_fonctionnement_validation.$selected  = false;
                        vm.selectedItemAddition_frais_fonctionnement_validation.$edit      = false;
                        vm.selectedItemAddition_frais_fonctionnement_validation ={};
                        vm.showbuttonValidation_addition_feffi = false;
                    }
                    else 
                    {    
                      vm.alladdition_frais_fonctionnement_validation = vm.alladdition_frais_fonctionnement_validation.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAddition_frais_fonctionnement_validation.id;
                      });
                      vm.showbuttonValidation_addition_feffi = false;
                    }
              }
              else
              {   
                  //addition_frais_fonctionnement_validation.convention_entete = conv[0];
                  addition_frais_fonctionnement_validation.rubrique  = rubri[0];
                  addition_frais_fonctionnement_validation.id  =   String(data.response);              
                  NouvelItemAddition_frais_fonctionnement_validation = false;
                  addition_frais_fonctionnement_validation.validation = 0;
                                        
               }
              
              addition_frais_fonctionnement_validation.$selected = false;
              addition_frais_fonctionnement_validation.$edit = false;
              vm.selectedItemAddition_frais_fonctionnement_validation = {};

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }  
        vm.valider_addition = function()
        {
          maj_addition_frais(vm.selectedItemAddition_frais_fonctionnement_validation,0,1)
        } 
        function maj_addition_frais(addition_frais_fonctionnement_validation,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        addition_frais_fonctionnement_validation.id,
                    montant: addition_frais_fonctionnement_validation.montant,
                    observation: addition_frais_fonctionnement_validation.observation,
                    id_rubrique_addition: addition_frais_fonctionnement_validation.rubrique.id,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("addition_frais_fonctionnement/index",datas, config).success(function (data)
            {  
              vm.alladdition_frais_fonctionnement_validation = vm.alladdition_frais_fonctionnement_validation.filter(function(obj)
              {
                  return obj.id !== addition_frais_fonctionnement_validation.id;
              });
              vm.showbuttonvalidation_addition = false;
              
              vm.steppieceaddition = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }     

    /*********************************************Fin decaissement feffi************************************************/

    /*********************************************Debut justificatif************************************************/
    vm.step_justificatif = function()
    {
      apiFactory.getAPIgeneraliserREST("piece_justificatif_frais_fonction_feffi/index",'id_addition_frais',vm.selectedItemAddition_frais_fonctionnement_validation.id).then(function(result)
      {
          vm.alljustificatif_frais_fonction_feffi = result.data.response;
          console.log(vm.alljustificatif_frais_fonction_feffi);
      });
    }
        vm.justificatif_frais_fonction_feffi_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile_addi = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          console.log(files);
          //vm.selectedItemJustificatif_frais_fonction_feffi.fichier = vm.myFile[0].name;
        } 

        //fonction ajout dans bdd
        function ajoutJustificatif_frais_fonction_feffi(justificatif_frais_fonction_feffi,suppression)
        {
            if (NouvelItemJustificatif_frais_fonction_feffi==false)
            {
                apiFactory.getAPIgeneraliserREST("addition_frais_fonctionnement/index",'menu',"getaddition_frais_fonctionnementById",'id_addition',vm.selectedItemAddition_frais_fonctionnement_validation.id).then(function(result)
                {
                  var addition_frais_fonctionnement_valide = result.data.response;
                  if (addition_frais_fonctionnement_valide.length !=0)
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
                      vm.steppieceaddition= false;
                      vm.selectedItemJustificatif_frais_fonction_feffi = {} ;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceJustificatif_frais_fonction_feffi (justificatif_frais_fonction_feffi,suppression);      
                  }
                }); 
            } 
            else
            {
                insert_in_baseJustificatif_frais_fonction_feffi(justificatif_frais_fonction_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation document_feffi_scan
        vm.annulerJustificatif_frais_fonction_feffi = function(item)
        {
          if (NouvelItemJustificatif_frais_fonction_feffi == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemJustificatif_frais_fonction_feffi.fichier ;
          }
          else
          {
            /*vm.alljustificatif_frais_fonction_feffi = vm.alljustificatif_frais_fonction_feffi.filter(function(obj)
            {
                return obj.id != vm.selectedItemJustificatif_frais_fonction_feffi.id;
            });*/

            item.fichier   = '';
            item.$edit = false;
            item.$selected = false;

            item.id = 0;
          }

          vm.selectedItemJustificatif_frais_fonction_feffi = {} ;
          NouvelItemJustificatif_frais_fonction_feffi      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_frais_fonction_feffi= function (item)
        {
            vm.selectedItemJustificatif_frais_fonction_feffi = item;
            console.log(vm.selectedItemJustificatif_frais_fonction_feffi);
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemJustificatif_frais_fonction_feffi    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_frais_fonction_feffi));
            }
            
            
        };
        $scope.$watch('vm.selectedItemJustificatif_frais_fonction_feffi', function()
        {
             if (!vm.alljustificatif_frais_fonction_feffi) return;
             vm.alljustificatif_frais_fonction_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_frais_fonction_feffi.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_frais_fonction_feffi = function(item)
        {
            
            vm.selectedItemJustificatif_frais_fonction_feffi = item;
            currentItemJustificatif_frais_fonction_feffi = angular.copy(vm.selectedItemJustificatif_frais_fonction_feffi);
            $scope.vm.alljustificatif_frais_fonction_feffi.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id==0)
            {   
                NouvelItemJustificatif_frais_fonction_feffi=true;
                item.fichier   = vm.selectedItemJustificatif_frais_fonction_feffi.fichier ;
                item.id = 0 ;

            }
            else
            {   
                NouvelItemJustificatif_frais_fonction_feffi = false ;
                item.fichier = vm.selectedItemJustificatif_frais_fonction_feffi.fichier ;
            }
            
            
            console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_feffi_scan
        vm.supprimerJustificatif_frais_fonction_feffi = function()
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
                vm.ajoutJustificatif_frais_fonction_feffi(vm.selectedItemJustificatif_frais_fonction_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_frais_fonction_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alljustificatif_frais_fonction_feffi.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_frais_fonction_feffi.id;
                });
                if(mem[0])
                {
                   if(mem[0].fichier != currentItemJustificatif_frais_fonction_feffi.fichier )                   
                      { 
                         insert_in_baseJustificatif_frais_fonction_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_frais_fonction_feffi(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_frais_fonction_feffi
        function insert_in_baseJustificatif_frais_fonction_feffi(justificatif_frais_fonction_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_frais_fonction_feffi==false)
            {
                getId = vm.selectedItemJustificatif_frais_fonction_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_justificatif_prevu: justificatif_frais_fonction_feffi.id_justificatif_prevu,
                    fichier: justificatif_frais_fonction_feffi.fichier,
                    id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
            {

              if (NouvelItemJustificatif_frais_fonction_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {                    
                          var repertoire = 'justificatif_frais_fonction_feffi/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_frais_fonction_feffi.id;
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0]
                            var name_file = getIdFile+'_'+vm.myFile[0].name;

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
                                    justificatif_frais_fonction_feffi.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_frais_fonction_feffi.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_frais_fonction_feffi.fichier,
                                                      id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id,
                                        });
                                      apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          justificatif_frais_fonction_feffi.$selected = false;
                                          justificatif_frais_fonction_feffi.$edit = false;
                                          justificatif_frais_fonction_feffi.fichier=currentItemJustificatif_frais_fonction_feffi.fichier;
                                          vm.selectedItemJustificatif_frais_fonction_feffi = {};
                                      console.log('a');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_frais_fonction_feffi.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        id_justificatif_prevu: justificatif_frais_fonction_feffi.id_justificatif_prevu,
                                        fichier: justificatif_frais_fonction_feffi.fichier,
                                        id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id,             
                                    });
                                  apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
                                  {
                                       
                                      justificatif_frais_fonction_feffi.$selected = false;
                                      justificatif_frais_fonction_feffi.$edit = false;
                                      vm.selectedItemJustificatif_frais_fonction_feffi = {};
                                      console.log('b');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_frais_fonction_feffi.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_frais_fonction_feffi.fichier,
                                                      id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id,
                                        });
                                      apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
                                      {
                                          justificatif_frais_fonction_feffi.$selected = false;
                                          justificatif_frais_fonction_feffi.$edit = false;
                                          justificatif_frais_fonction_feffi.fichier=currentItemJustificatif_frais_fonction_feffi.fichier;
                                          vm.selectedItemJustificatif_frais_fonction_feffi = {};
                                      
                                      });
                            });
                          }
                        //vm.selectedItemJustificatif_frais_fonction_feffi.document_prestataire = doc[0];
                        vm.selectedItemJustificatif_frais_fonction_feffi.$selected  = false;
                        vm.selectedItemJustificatif_frais_fonction_feffi.$edit      = false;
                        vm.selectedItemJustificatif_frais_fonction_feffi ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                     /* vm.alljustificatif_frais_fonction_feffi = vm.alljustificatif_frais_fonction_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_frais_fonction_feffi.id;
                      });*/
                      var chemin= vm.selectedItemJustificatif_frais_fonction_feffi.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {                         
                          vm.selectedItemJustificatif_frais_fonction_feffi.fichier = '';

                          vm.selectedItemJustificatif_frais_fonction_feffi.id = 0;
                          console.log('c');
                      }).error(function()
                      {
                          showAlert(event,chemin);
                      });;
                    }
              }
              else
              {
                  justificatif_frais_fonction_feffi.id  =   String(data.response);              
                  NouvelItemJustificatif_frais_fonction_feffi = false;                    
                    
                    var repertoire = 'justificatif_frais_fonction_feffi/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                     console.log('1');
          console.log(vm.myFile);                   
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = getIdFile+'_'+vm.myFile[0].name;
                      console.log('2'); 
                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {console.log('3'); 
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              justificatif_frais_fonction_feffi.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                id_justificatif_prevu: currentItemJustificatif_frais_fonction_feffi.id_justificatif_prevu,
                                                fichier: currentItemJustificatif_frais_fonction_feffi.fichier,
                                                id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id
                                  });
                                apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
                                {
                                    justificatif_frais_fonction_feffi.$selected = false;
                                    justificatif_frais_fonction_feffi.$edit = false;

                                    justificatif_frais_fonction_feffi.id= 0;
                                    justificatif_frais_fonction_feffi.fichier=null;
                                    vm.selectedItemJustificatif_frais_fonction_feffi = {};
                                console.log('d');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {console.log('4'); 
                            justificatif_frais_fonction_feffi.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  id_justificatif_prevu: justificatif_frais_fonction_feffi.id_justificatif_prevu,
                                  fichier: justificatif_frais_fonction_feffi.fichier,
                                  id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id             
                              });

                            apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
                            {    
                                justificatif_frais_fonction_feffi.$selected = false;
                                justificatif_frais_fonction_feffi.$edit = false;
                                vm.selectedItemJustificatif_frais_fonction_feffi = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                id_justificatif_prevu: currentItemJustificatif_frais_fonction_feffi.id_justificatif_prevu,
                                                fichier: currentItemJustificatif_frais_fonction_feffi.fichier,
                                                id_addition_frais: vm.selectedItemAddition_frais_fonctionnement_validation.id,
                                  });
                                apiFactory.add("piece_justificatif_frais_fonction_feffi/index",datas, config).success(function (data)
                                {
                                    justificatif_frais_fonction_feffi.$selected = false;
                                    justificatif_frais_fonction_feffi.$edit = false;

                                    justificatif_frais_fonction_feffi.id_= 0;
                                    vm.selectedItemJustificatif_frais_fonction_feffi = {};
                                console.log('d');
                                });
                      });
                    }
              }
              //justificatif_frais_fonction_feffi.document_prestataire = doc[0];
              justificatif_frais_fonction_feffi.$selected = false;
              justificatif_frais_fonction_feffi.$edit = false;
              //vm.selectedItemJustificatif_frais_fonction_feffi = {};
             
              vm.showbuttonValidation_justificatif_frais_fonction_feffi = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*********************************************Debut justificatif************************************************/
        vm.download_justificatif = function(item)
        {
           window.open(apiUrlFile+item.fichier);
        }
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
