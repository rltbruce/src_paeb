(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.demande_paiement_moe.demande_batiment_moe')
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
        .controller('Demande_batiment_moeController', Demande_batiment_moeController);
    /** @ngInject */
    function Demande_batiment_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_bureau_etude = {};
        vm.allcontrat_bureau_etude = [];

         vm.selectedItemBatiment_construction = {};
        vm.allbatiment_construction  = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.ajoutDemande_batiment_moe = ajoutDemande_batiment_moe;
        var NouvelItemDemande_batiment_moe=false;
        var currentItemDemande_batiment_moe;
        vm.selectedItemDemande_batiment_moe = {};
        vm.alldemande_batiment_moe = [];

        vm.ajoutJustificatif_batiment_moe = ajoutJustificatif_batiment_moe;
        var NouvelItemJustificatif_batiment_moe=false;
        var currentItemJustificatif_batiment_moe;
        vm.selectedItemJustificatif_batiment_moe = {} ;
        vm.alljustificatif_batiment_moe = [] ;

       

        vm.allcurenttranche_demande_batiment_moe = [];
        vm.alltranche_demande_batiment_moe = [];
        vm.dernierdemande = [];

        vm.alltranche_d_debut_travaux_moe = [];
        vm.alldemande_debut_travaux_moe = [];

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
              
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'menu','getbatimentByContrat_bureau_etude','id_contrat_bureau_etude',vm.selectedItemContrat_bureau_etude.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;
                  console.log(vm.allbatiment_construction);
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


/**********************************fin batiment construction****************************************/       
//col table
       vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"Nombre batiment"
        },
        {
          titre:"Cout unitaire"
        }];

//fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;
           
            if (vm.selectedItemBatiment_construction.id!=0)
            {  

              apiFactory.getAPIgeneraliserREST("demande_batiment_moe/index",'menu','getdemandeInvalideBybatiment','id_batiment_construction',item.id).then(function(result)
              {
                  vm.alldemande_batiment_moe = result.data.response;
              });           
              vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;
              vm.stepFive = false;
              vm.stepSixe = false;
            }           

        };
        $scope.$watch('vm.selectedItemBatiment_construction', function()
        {
             if (!vm.allbatiment_construction) return;
             vm.allbatiment_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBatiment_construction.$selected = true;
        });           

/**********************************fin batiment construction****************************************/

/**********************************debut demande_batiment_moe****************************************/
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
        },
        {titre:"Action"
        }];

        //recuperation donnée tranche deblocage mpe
        apiFactory.getAll("tranche_demande_batiment_moe/index").then(function(result)
        {
          vm.alltranche_demande_batiment_moe= result.data.response;
          vm.allcurenttranche_demande_batiment_moe = result.data.response;
          console.log(vm.allcurenttranche_demande_batiment_moe);
        });
          
          apiFactory.getAll("tranche_d_debut_travaux_moe/index").then(function(result)
          {
            vm.alltranche_d_debut_travaux_moe= result.data.response;
          });


        //Masque de saisi ajout
        vm.ajouterDemande_batiment_moe = function ()
        {
          apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index",'menu','getalldemandeByContrat','id_contrat_bureau_etude',vm.selectedItemContrat_bureau_etude.id).then(function(result)
          {
            vm.alldemande_debut_travaux_moe = result.data.response;

            if(vm.alldemande_batiment_moe.length>0)
          {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_batiment_moe.map(function(o)
            { 
              return o.id;
            }));

            vm.dernierdemande = vm.alldemande_batiment_moe.filter(function(obj)
            {
                return obj.id == last_id_demande;
            });
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

            vm.allcurenttranche_demande_batiment_moe = vm.alltranche_demande_batiment_moe.filter(function(obj)
            {
                return obj.code == 'tranche '+(parseInt(numcode)+1);
            });

          }
          else
          {
            vm.allcurenttranche_demande_batiment_moe = vm.alltranche_demande_batiment_moe.filter(function(obj)
            {
                return obj.code == 'tranche 1';
            });
            vm.dernierdemande = [];
          }
           console.log(vm.alldemande_debut_travaux_moe.length);
           console.log(vm.alltranche_d_debut_travaux_moe.length);
          if (vm.alldemande_debut_travaux_moe.length==vm.alltranche_d_debut_travaux_moe.length)
          {
              var last_id_demande_debut = Math.max.apply(Math, vm.alldemande_debut_travaux_moe.map(function(o)
              { 
                return o.id;
              }));

              var dernierdemande_debut = vm.alldemande_debut_travaux_moe.filter(function(obj)
              {
                  return obj.id == last_id_demande_debut;
              });
              if (dernierdemande_debut[0].validation==3)
              {
                  if (NouvelItemDemande_batiment_moe == false)
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
                    vm.alldemande_batiment_moe.push(items);
                    vm.alldemande_batiment_moe.forEach(function(mem)
                    {
                      if(mem.$selected==true)
                      {
                        vm.selectedItemDemande_batiment_moe = mem;
                      }
                    });

                    NouvelItemDemande_batiment_moe = true ;
                  }else
                  {
                    vm.showAlert('Ajout demande batiment','Un formulaire d\'ajout est déjà ouvert!!!');
                  }
              }
              else
              {
                vm.showAlert('Ajout demande batiment','La dernière demande n\'est pas encore valide');
              }

          }
          else
          {
            vm.showAlert('Ajout demande batiment','Ile faut remplir les demandes avant le l\'execution travaux');
          }
          });

          
                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_batiment_moe(demande_batiment_moe,suppression)
        {
            if (NouvelItemDemande_batiment_moe==false)
            {
                test_existanceDemande_batiment_moe (demande_batiment_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_batiment_moe(demande_batiment_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_moe
        vm.annulerDemande_batiment_moe = function(item)
        {
          if (NouvelItemDemande_batiment_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_batiment_moe.objet ;
            item.description   = currentItemDemande_batiment_moe.description ;
            item.ref_facture   = currentItemDemande_batiment_moe.ref_facture ;
            item.id_tranche_demande_batiment_moe = currentItemDemande_batiment_moe.id_tranche_demande_batiment_moe ;
            item.montant   = currentItemDemande_batiment_moe.montant ;
            item.cumul = currentItemDemande_batiment_moe.cumul ;
            item.anterieur = currentItemDemande_batiment_moe.anterieur;
            item.periode = currentItemDemande_batiment_moe.periode ;
            item.pourcentage = currentItemDemande_batiment_moe.pourcentage ;
            item.reste = currentItemDemande_batiment_moe.reste;
            item.date  = currentItemDemande_batiment_moe.date;
          }else
          {
            vm.alldemande_batiment_moe = vm.alldemande_batiment_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_moe.id;
            });
          }

          vm.selectedItemDemande_batiment_moe = {} ;
          NouvelItemDemande_batiment_moe      = false;
          
        };

        //fonction selection item Demande_batiment_moe
        vm.selectionDemande_batiment_moe= function (item)
        {
            vm.selectedItemDemande_batiment_moe = item;
            vm.nouvelItemDemande_batiment_moe   = item;
            currentItemDemande_batiment_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_moe));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_moe/index",'id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
            {
                vm.alljustificatif_batiment_moe = result.data.response;
                console.log(vm.alljustificatif_batiment_moe);
            });

           /* apiFactory.getAPIgeneraliserREST("justificatif_facture/index",'id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
            {
                vm.alljustificatif_facture = result.data.response;
                console.log(vm.alljustificatif_facture);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_autre_pre/index",'id_demande_batiment_moe',vm.selectedItemDemande_batiment_moe.id).then(function(result)
            {
                vm.alljustificatif_autre = result.data.response;
                console.log(vm.alljustificatif_autre);
            });*/

            vm.stepThree = true;
            vm.stepFor = false;
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

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_batiment_moe = function(item)
        {
            NouvelItemDemande_batiment_moe = false ;
            vm.selectedItemDemande_batiment_moe = item;
            currentItemDemande_batiment_moe = angular.copy(vm.selectedItemDemande_batiment_moe);
            $scope.vm.alldemande_batiment_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_batiment_moe.objet ;
            item.description   = vm.selectedItemDemande_batiment_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_batiment_moe.ref_facture ;
            item.id_tranche_demande_batiment_moe = vm.selectedItemDemande_batiment_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_batiment_moe.montant);
            item.cumul = vm.selectedItemDemande_batiment_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_batiment_moe.anterieur ;
            item.periode = vm.selectedItemDemande_batiment_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_batiment_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_batiment_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_batiment_moe.date) ;
        };

        //fonction bouton suppression item Demande_batiment_moe
        vm.supprimerDemande_batiment_moe = function()
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
                vm.ajoutDemande_batiment_moe(vm.selectedItemDemande_batiment_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_batiment_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_batiment_moe.filter(function(obj)
                {
                   return obj.id == currentItemDemande_batiment_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_batiment_moe.objet )
                    || (pass[0].description   != currentItemDemande_batiment_moe.description )
                    || (pass[0].id_tranche_demande_batiment_moe != currentItemDemande_batiment_moe.id_tranche_demande_batiment_moe )
                    || (pass[0].montant   != currentItemDemande_batiment_moe.montant )
                    || (pass[0].cumul != currentItemDemande_batiment_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_batiment_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_batiment_moe.reste )
                    || (pass[0].date   != currentItemDemande_batiment_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_batiment_moe.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_batiment_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_batiment_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_moe
        function insert_in_baseDemande_batiment_moe(demande_batiment_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_batiment_moe==false)
            {
                getId = vm.selectedItemDemande_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_batiment_moe.objet,
                    description:demande_batiment_moe.description,
                    ref_facture:demande_batiment_moe.ref_facture,
                    id_tranche_demande_batiment_moe: demande_batiment_moe.id_tranche_demande_batiment_moe ,
                    montant: demande_batiment_moe.montant,
                    cumul: demande_batiment_moe.cumul ,
                    anterieur: demande_batiment_moe.anterieur ,
                    reste: demande_batiment_moe.reste ,
                    date: convertionDate(new Date(demande_batiment_moe.date)),
                    id_batiment_construction: vm.selectedItemBatiment_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_batiment_moe.filter(function(obj)
                {
                    return obj.id == demande_batiment_moe.id_tranche_demande_batiment_moe;
                });

                if (NouvelItemDemande_batiment_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_batiment_moe.tranche = tran[0] ;
                        vm.selectedItemDemande_batiment_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_batiment_moe.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_batiment_moe.$selected  = false;
                        vm.selectedItemDemande_batiment_moe.$edit      = false;
                        vm.selectedItemDemande_batiment_moe ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_batiment_moe = vm.alldemande_batiment_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_moe.id;
                      });
                    }
                    
                }
                else
                {
                  demande_batiment_moe.tranche = tran[0] ;
                  demande_batiment_moe.periode = tran[0].periode ;
                  demande_batiment_moe.pourcentage = tran[0].pourcentage ;

                  demande_batiment_moe.id  =   String(data.response);              
                  NouvelItemDemande_batiment_moe=false;
            }
              demande_batiment_moe.$selected = false;
              demande_batiment_moe.$edit = false;
              vm.selectedItemDemande_batiment_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = (parseInt(vm.selectedItemContrat_bureau_etude.montant_contrat) * vm.allcurenttranche_demande_batiment_moe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_batiment_moe.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= parseInt(vm.selectedItemContrat_bureau_etude.montant_contrat) - cumul;

          item.periode = vm.allcurenttranche_demande_batiment_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_batiment_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_batiment_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_moe_column = [
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
          vm.selectedItemJustificatif_batiment_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_batiment_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_batiment_moe = function ()
        { 
          if (NouvelItemJustificatif_batiment_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_batiment_moe.push(items);
            vm.alljustificatif_batiment_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_batiment_moe = mem;
              }
            });

            NouvelItemJustificatif_batiment_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_batiment_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_batiment_moe(justificatif_batiment_moe,suppression)
        {
            if (NouvelItemJustificatif_batiment_moe==false)
            {
                test_existanceJustificatif_batiment_moe (justificatif_batiment_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_batiment_moe(justificatif_batiment_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_batiment_moe
        vm.annulerJustificatif_batiment_moe = function(item)
        {
          if (NouvelItemJustificatif_batiment_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_batiment_moe.description ;
            item.fichier   = currentItemJustificatif_batiment_moe.fichier ;
          }else
          {
            vm.alljustificatif_batiment_moe = vm.alljustificatif_batiment_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_batiment_moe.id;
            });
          }

          vm.selectedItemJustificatif_batiment_moe = {} ;
          NouvelItemJustificatif_batiment_moe      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_batiment_moe= function (item)
        {
            vm.selectedItemJustificatif_batiment_moe = item;
            vm.nouvelItemJustificatif_batiment_moe   = item;
            currentItemJustificatif_batiment_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_batiment_moe)); 
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

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_batiment_moe = function(item)
        {
            NouvelItemJustificatif_batiment_moe = false ;
            vm.selectedItemJustificatif_batiment_moe = item;
            currentItemJustificatif_batiment_moe = angular.copy(vm.selectedItemJustificatif_batiment_moe);
            $scope.vm.alljustificatif_batiment_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_batiment_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_batiment_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_batiment_moe
        vm.supprimerJustificatif_batiment_moe = function()
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
                vm.ajoutJustificatif_batiment_moe(vm.selectedItemJustificatif_batiment_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_batiment_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_batiment_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_batiment_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_batiment_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_batiment_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_batiment_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_batiment_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_batiment_moe
        function insert_in_baseJustificatif_batiment_moe(justificatif_batiment_moe,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_batiment_moe==false)
            {
                getId = vm.selectedItemJustificatif_batiment_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_batiment_moe.description,
                    fichier: justificatif_batiment_moe.fichier,
                    id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_batiment_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_batiment_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_batiment_moe.id
                                              
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
                                    justificatif_batiment_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_batiment_moe.description,
                                                      fichier: justificatif_batiment_moe.fichier,
                                                      id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_batiment_moe.$selected = false;
                                          justificatif_batiment_moe.$edit = false;
                                          vm.selectedItemJustificatif_batiment_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_batiment_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_batiment_moe.description,
                                        fichier: justificatif_batiment_moe.fichier,
                                        id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_batiment_moe.$selected = false;
                                      justificatif_batiment_moe.$edit = false;
                                      vm.selectedItemJustificatif_batiment_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_batiment_moe.$selected  = false;
                        vm.selectedItemJustificatif_batiment_moe.$edit      = false;
                        vm.selectedItemJustificatif_batiment_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_batiment_moe = vm.alljustificatif_batiment_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_batiment_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_batiment_moe.fichier;
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
                  justificatif_batiment_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_batiment_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_batiment_moe/';
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
                              justificatif_batiment_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_batiment_moe.description,
                                                fichier: justificatif_batiment_moe.fichier,
                                                id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_batiment_moe.$selected = false;
                                    justificatif_batiment_moe.$edit = false;
                                    vm.selectedItemJustificatif_batiment_moe = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_batiment_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_batiment_moe.description,
                                  fichier: justificatif_batiment_moe.fichier,
                                  id_demande_batiment_moe: vm.selectedItemDemande_batiment_moe.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_batiment_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_batiment_moe.$selected = false;
                                justificatif_batiment_moe.$edit = false;
                                vm.selectedItemJustificatif_batiment_moe = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_batiment_moe.$selected = false;
              justificatif_batiment_moe.$edit = false;
              vm.selectedItemJustificatif_batiment_moe = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif batiment****************************************/



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
