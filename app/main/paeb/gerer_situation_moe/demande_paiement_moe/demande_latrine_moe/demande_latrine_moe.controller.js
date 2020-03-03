(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.demande_paiement_moe.demande_latrine_moe')
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
        .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;        
          element.bind('change', function(){
            scope.$apply(function(){
              //modelSetter(scope, element[0].files[0]);
               //console.log(element[0].files[0]);

            });
          });
        }
      };
    }])
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
        .controller('Demande_latrine_moeController', Demande_latrine_moeController);
    /** @ngInject */
    function Demande_latrine_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_bureau_etude = {};
        vm.allcontrat_bureau_etude = [];

         vm.selectedItemlatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.ajoutDemande_latrine_moe = ajoutDemande_latrine_moe;
        var NouvelItemDemande_latrine_moe=false;
        var currentItemDemande_latrine_moe;
        vm.selectedItemDemande_latrine_moe = {};
        vm.alldemande_latrine_moe = [];

        vm.ajoutJustificatif_latrine_moe = ajoutJustificatif_latrine_moe;
        var NouvelItemJustificatif_latrine_moe=false;
        var currentItemJustificatif_latrine_moe;
        vm.selectedItemJustificatif_latrine_moe = {} ;
        vm.alljustificatif_latrine_moe = [] ;

       

        vm.allcurenttranche_demande_latrine_moe = [];
        vm.alltranche_demande_latrine_moe = [];
        vm.dernierdemande = [];

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;
        vm.stepThree = false;
        vm.stepFor = false;
        vm.stepFive = false;
        vm.stepSixe = false;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************contrat bureau_etude****************************************/

        //col table
       vm.contrat_bureau_etude_column = [
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
       
        //recuperation donnée convention
        apiFactory.getAll("contrat_be/index").then(function(result)
        {
            vm.allcontrat_bureau_etude = result.data.response; 
            console.log(vm.allcontrat_bureau_etude);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_bureau_etude = function (item)
        {
            vm.selectedItemContrat_bureau_etude = item;
           // vm.allconvention= [] ;
            
                        //recuperation donnée convention
            if (vm.selectedItemContrat_bureau_etude.id!=0)
            {
              
              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'menu','getlatrineByContrat_bureau_etude','id_contrat_bureau_etude',vm.selectedItemContrat_bureau_etude.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                  console.log(vm.alllatrine_construction);
              });

              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemContrat_bureau_etude', function()
        {
             if (!vm.allcontrat_bureau_etude) return;
             vm.allcontrat_bureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_bureau_etude.$selected = true;
        });        

/**********************************fin contrat bureau_etude****************************************/


/**********************************fin latrine construction****************************************/       
//col table
       vm.latrine_construction_column = [        
        {
          titre:"latrine"
        },
        {
          titre:"Nombre latrine"
        },
        {
          titre:"Cout unitaire"
        }];

//fonction selection item latrine construction cisco/feffi
        vm.selectionlatrine_construction = function (item)
        {
            vm.selectedItemlatrine_construction = item;
           
            if (vm.selectedItemlatrine_construction.id!=0)
            {  

              apiFactory.getAPIgeneraliserREST("demande_latrine_moe/index",'menu','getdemandeInvalideBylatrine','id_latrine_construction',item.id).then(function(result)
              {
                  vm.alldemande_latrine_moe = result.data.response;
              });           
              vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;
              vm.stepFive = false;
              vm.stepSixe = false;
            }           

        };
        $scope.$watch('vm.selectedItemlatrine_construction', function()
        {
             if (!vm.alllatrine_construction) return;
             vm.alllatrine_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemlatrine_construction.$selected = true;
        });           

/**********************************fin latrine construction****************************************/

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
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_latrine_moe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_moe= result.data.response;
          vm.allcurenttranche_demande_latrine_moe = result.data.response;
          console.log(vm.allcurenttranche_demande_latrine_moe);
        });

        //Masque de saisi ajout
        vm.ajouterDemande_latrine_moe = function ()
        { 
          if(vm.alldemande_latrine_moe.length>0)
          {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_latrine_moe.map(function(o)
            { 
              return o.id;
            }));

            vm.dernierdemande = vm.alldemande_latrine_moe.filter(function(obj)
            {
                return obj.id == last_id_demande;
            });
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

            vm.allcurenttranche_demande_latrine_moe = vm.alltranche_demande_latrine_moe.filter(function(obj)
            {
                return obj.code == 'tranche '+(parseInt(numcode)+1);
            });

          }
          else
          {
            vm.allcurenttranche_demande_latrine_moe = vm.alltranche_demande_latrine_moe.filter(function(obj)
            {
                return obj.code == 'tranche 1';
            });
            vm.dernierdemande = [];console.log(vm.allcurenttranche_demande_latrine_moe);
          }
          if (NouvelItemDemande_latrine_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              objet: '',
              description: '',
              ref_facture: '',
              tranche: '',
              montant: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:'',
              date: ''
            };         
            vm.alldemande_latrine_moe.push(items);
            vm.alldemande_latrine_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_latrine_moe = mem;
              }
            });

            NouvelItemDemande_latrine_moe = true ;
          }else
          {
            vm.showAlert('Ajout demande latrine','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_latrine_moe(demande_latrine_moe,suppression)
        {
            if (NouvelItemDemande_latrine_moe==false)
            {
                test_existanceDemande_latrine_moe (demande_latrine_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_latrine_moe(demande_latrine_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_latrine_moe
        vm.annulerDemande_latrine_moe = function(item)
        {
          if (NouvelItemDemande_latrine_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_latrine_moe.objet ;
            item.description   = currentItemDemande_latrine_moe.description ;
            item.ref_facture   = currentItemDemande_latrine_moe.ref_facture ;
            item.id_tranche_demande_latrine_moe = currentItemDemande_latrine_moe.id_tranche_demande_latrine_moe ;
            item.montant   = currentItemDemande_latrine_moe.montant ;
            item.cumul = currentItemDemande_latrine_moe.cumul ;
            item.anterieur = currentItemDemande_latrine_moe.anterieur;
            item.periode = currentItemDemande_latrine_moe.periode ;
            item.pourcentage = currentItemDemande_latrine_moe.pourcentage ;
            item.reste = currentItemDemande_latrine_moe.reste;
            item.date  = currentItemDemande_latrine_moe.date;
          }else
          {
            vm.alldemande_latrine_moe = vm.alldemande_latrine_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_latrine_moe.id;
            });
          }

          vm.selectedItemDemande_latrine_moe = {} ;
          NouvelItemDemande_latrine_moe      = false;
          
        };

        //fonction selection item Demande_latrine_moe
        vm.selectionDemande_latrine_moe= function (item)
        {
            vm.selectedItemDemande_latrine_moe = item;
            vm.nouvelItemDemande_latrine_moe   = item;
            currentItemDemande_latrine_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_moe));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_latrine_moe/index",'id_demande_latrine_moe',vm.selectedItemDemande_latrine_moe.id).then(function(result)
            {
                vm.alljustificatif_latrine_moe = result.data.response;
                console.log(vm.alljustificatif_latrine_moe);
            });

            vm.stepThree = true;
            vm.stepFor = false;
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
        vm.modifierDemande_latrine_moe = function(item)
        {
            NouvelItemDemande_latrine_moe = false ;
            vm.selectedItemDemande_latrine_moe = item;
            currentItemDemande_latrine_moe = angular.copy(vm.selectedItemDemande_latrine_moe);
            $scope.vm.alldemande_latrine_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_latrine_moe.objet ;
            item.description   = vm.selectedItemDemande_latrine_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_latrine_moe.ref_facture ;
            item.id_tranche_demande_latrine_moe = vm.selectedItemDemande_latrine_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_latrine_moe.montant);
            item.cumul = vm.selectedItemDemande_latrine_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_latrine_moe.anterieur ;
            item.periode = vm.selectedItemDemande_latrine_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_latrine_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_latrine_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_latrine_moe.date) ;
        };

        //fonction bouton suppression item Demande_latrine_moe
        vm.supprimerDemande_latrine_moe = function()
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
                vm.ajoutDemande_latrine_moe(vm.selectedItemDemande_latrine_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_latrine_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_latrine_moe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_latrine_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_latrine_moe.objet )
                    || (pass[0].description   != currentItemDemande_latrine_moe.description )
                    || (pass[0].id_tranche_demande_latrine_moe != currentItemDemande_latrine_moe.id_tranche_demande_latrine_moe )
                    || (pass[0].montant   != currentItemDemande_latrine_moe.montant )
                    || (pass[0].cumul != currentItemDemande_latrine_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_latrine_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_latrine_moe.reste )
                    || (pass[0].date   != currentItemDemande_latrine_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_latrine_moe.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_latrine_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_latrine_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_latrine_moe
        function insert_in_baseDemande_latrine_moe(demande_latrine_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_latrine_moe==false)
            {
                getId = vm.selectedItemDemande_latrine_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_latrine_moe.objet,
                    description:demande_latrine_moe.description,
                    ref_facture:demande_latrine_moe.ref_facture,
                    id_tranche_demande_latrine_moe: demande_latrine_moe.id_tranche_demande_latrine_moe ,
                    montant: demande_latrine_moe.montant,
                    cumul: demande_latrine_moe.cumul ,
                    anterieur: demande_latrine_moe.anterieur ,
                    reste: demande_latrine_moe.reste ,
                    date: convertionDate(new Date(demande_latrine_moe.date)),
                    id_latrine_construction: vm.selectedItemlatrine_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_latrine_moe.filter(function(obj)
                {
                    return obj.id == demande_latrine_moe.id_tranche_demande_latrine_moe;
                });

                if (NouvelItemDemande_latrine_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_latrine_moe.tranche = tran[0] ;
                        vm.selectedItemDemande_latrine_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_latrine_moe.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_latrine_moe.$selected  = false;
                        vm.selectedItemDemande_latrine_moe.$edit      = false;
                        vm.selectedItemDemande_latrine_moe ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_latrine_moe = vm.alldemande_latrine_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_latrine_moe.id;
                      });
                    }
                    
                }
                else
                {
                  demande_latrine_moe.tranche = tran[0] ;
                  demande_latrine_moe.periode = tran[0].periode ;
                  demande_latrine_moe.pourcentage = tran[0].pourcentage ;

                  demande_latrine_moe.id  =   String(data.response);              
                  NouvelItemDemande_latrine_moe=false;
            }
              demande_latrine_moe.$selected = false;
              demande_latrine_moe.$edit = false;
              vm.selectedItemDemande_latrine_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = (parseInt(vm.selectedItemContrat_bureau_etude.montant_contrat) * vm.allcurenttranche_demande_latrine_moe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_latrine_moe.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= parseInt(vm.selectedItemContrat_bureau_etude.montant_contrat) - cumul;

          item.periode = vm.allcurenttranche_demande_latrine_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_latrine_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_latrine_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_latrine_moe_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_latrine_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_latrine_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_latrine_moe = function ()
        { 
          if (NouvelItemJustificatif_latrine_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_latrine_moe.push(items);
            vm.alljustificatif_latrine_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_latrine_moe = mem;
              }
            });

            NouvelItemJustificatif_latrine_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_latrine_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_latrine_moe(justificatif_latrine_moe,suppression)
        {
            if (NouvelItemJustificatif_latrine_moe==false)
            {
                test_existanceJustificatif_latrine_moe (justificatif_latrine_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_latrine_moe(justificatif_latrine_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_latrine_moe
        vm.annulerJustificatif_latrine_moe = function(item)
        {
          if (NouvelItemJustificatif_latrine_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_latrine_moe.description ;
            item.fichier   = currentItemJustificatif_latrine_moe.fichier ;
          }else
          {
            vm.alljustificatif_latrine_moe = vm.alljustificatif_latrine_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_latrine_moe.id;
            });
          }

          vm.selectedItemJustificatif_latrine_moe = {} ;
          NouvelItemJustificatif_latrine_moe      = false;
          
        };

        //fonction selection item justificatif latrine
        vm.selectionJustificatif_latrine_moe= function (item)
        {
            vm.selectedItemJustificatif_latrine_moe = item;
            vm.nouvelItemJustificatif_latrine_moe   = item;
            currentItemJustificatif_latrine_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_latrine_moe)); 
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

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_latrine_moe = function(item)
        {
            NouvelItemJustificatif_latrine_moe = false ;
            vm.selectedItemJustificatif_latrine_moe = item;
            currentItemJustificatif_latrine_moe = angular.copy(vm.selectedItemJustificatif_latrine_moe);
            $scope.vm.alljustificatif_latrine_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_latrine_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_latrine_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_latrine_moe
        vm.supprimerJustificatif_latrine_moe = function()
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
                vm.ajoutJustificatif_latrine_moe(vm.selectedItemJustificatif_latrine_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_latrine_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_latrine_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_latrine_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_latrine_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_latrine_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_latrine_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_latrine_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_latrine_moe
        function insert_in_baseJustificatif_latrine_moe(justificatif_latrine_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_latrine_moe==false)
            {
                getId = vm.selectedItemJustificatif_latrine_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_latrine_moe.description,
                    fichier: justificatif_latrine_moe.fichier,
                    id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_latrine_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_latrine_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_latrine_moe.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemContrat_bureau_etude.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    justificatif_latrine_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_latrine_moe.description,
                                                      fichier: justificatif_latrine_moe.fichier,
                                                      id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_latrine_moe.$selected = false;
                                          justificatif_latrine_moe.$edit = false;
                                          vm.selectedItemJustificatif_latrine_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_latrine_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_latrine_moe.description,
                                        fichier: justificatif_latrine_moe.fichier,
                                        id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_latrine_moe.$selected = false;
                                      justificatif_latrine_moe.$edit = false;
                                      vm.selectedItemJustificatif_latrine_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_latrine_moe.$selected  = false;
                        vm.selectedItemJustificatif_latrine_moe.$edit      = false;
                        vm.selectedItemJustificatif_latrine_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_latrine_moe = vm.alljustificatif_latrine_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_latrine_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_latrine_moe.fichier;
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
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  justificatif_latrine_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_latrine_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_latrine_moe/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemContrat_bureau_etude.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              justificatif_latrine_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_latrine_moe.description,
                                                fichier: justificatif_latrine_moe.fichier,
                                                id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_latrine_moe.$selected = false;
                                    justificatif_latrine_moe.$edit = false;
                                    vm.selectedItemJustificatif_latrine_moe = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_latrine_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_latrine_moe.description,
                                  fichier: justificatif_latrine_moe.fichier,
                                  id_demande_latrine_moe: vm.selectedItemDemande_latrine_moe.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_latrine_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_latrine_moe.$selected = false;
                                justificatif_latrine_moe.$edit = false;
                                vm.selectedItemJustificatif_latrine_moe = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_latrine_moe.$selected = false;
              justificatif_latrine_moe.$edit = false;
              vm.selectedItemJustificatif_latrine_moe = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif latrine****************************************/



/**********************************fin mpe_sousmissionnaire****************************************/
        //Alert
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
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

      vm.affichageDate = function (daty)
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
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= jour+"/"+mois+"/"+annee;
                return date_final
            }      
        }
        

    }
})();
