(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_batiment_prestataire')
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
        .controller('Demande_batiment_prestataireController', Demande_batiment_prestataireController);
    /** @ngInject */
    function Demande_batiment_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_prestataire = {};
        vm.allcontrat_prestataire = [];

        vm.selectedItemBatiment_construction = {};
        vm.allbatiment_construction  = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.ajoutDemande_batiment_prest = ajoutDemande_batiment_prest;
        var NouvelItemDemande_batiment_prest=false;
        var currentItemDemande_batiment_prest;
        vm.selectedItemDemande_batiment_prest = {};
        vm.alldemande_batiment_prest = [];

        vm.ajoutJustificatif_batiment_pre = ajoutJustificatif_batiment_pre;
        var NouvelItemJustificatif_batiment_pre=false;
        var currentItemJustificatif_batiment_pre;
        vm.selectedItemJustificatif_batiment_pre = {} ;
        vm.alljustificatif_batiment_pre = [] ;

        vm.ajoutDemande_latrine_prest = ajoutDemande_latrine_prest;
        var NouvelItemDemande_latrine_prest=false;
        var currentItemDemande_latrine_prest;
        vm.selectedItemDemande_latrine_prest = {};
        vm.alldemande_latrine_prest = [];

        vm.ajoutJustificatif_latrine_pre = ajoutJustificatif_latrine_pre ;
        var NouvelItemJustificatif_latrine_pre=false;
        var currentItemJustificatif_latrine_pre;
        vm.selectedItemJustificatif_latrine_pre = {} ;
        vm.alljustificatif_latrine_pre = [] ;

        vm.ajoutDemande_mobilier_prest = ajoutDemande_mobilier_prest;
        var NouvelItemDemande_mobilier_prest=false;
        var currentItemDemande_mobilier_prest;
        vm.selectedItemDemande_mobilier_prest = {};
        vm.alldemande_mobilier_prest = [];

        vm.ajoutJustificatif_mobilier_pre = ajoutJustificatif_mobilier_pre ;
        var NouvelItemJustificatif_mobilier_pre=false;
        var currentItemJustificatif_mobilier_pre;
        vm.selectedItemJustificatif_mobilier_pre = {} ;
        vm.alljustificatif_mobilier_pre = [] ;

        /*vm.ajoutJustificatif_autre = ajoutJustificatif_autre ;
        var NouvelItemJustificatif_autre=false;
        var currentItemJustificatif_autre;
        vm.selectedItemJustificatif_autre = {} ;
        vm.alljustificatif_autre = [] ;*/

        vm.allcurenttranche_demande_mpe = [];
        vm.alltranche_demande_mpe = [];
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

/**********************************contrat prestataire****************************************/

        //col table
        vm.contrat_prestataire_column = [
        {titre:"Numero contrat"
        },
        {titre:"Description"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];
       
        //recuperation donnée convention
        apiFactory.getAll("contrat_prestataire/index").then(function(result)
        {
            vm.allcontrat_prestataire = result.data.response; 
            console.log(vm.allcontrat_prestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_prestataire = function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           // vm.allconvention= [] ;
            
                        //recuperation donnée convention
            if (vm.selectedItemContrat_prestataire.id!=0)
            {
              
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'menu','getbatimentByContrat_prestataire','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;
                  console.log(vm.allbatiment_construction);
              });

              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
              vm.stepThree = false;
              vm.stepFor = false;
            }           

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

/**********************************fin contrat prestataire****************************************/

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

              apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index",'menu','getdemandeInvalide','id_batiment_construction',item.id).then(function(result)
              {
                  vm.alldemande_batiment_prest = result.data.response;
              });

              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                  console.log(vm.alllatrine_construction);                  
              });

              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  console.log(vm.allmobilier_construction);                  
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

/**********************************debut demande_batiment_prest****************************************/
//col table
        vm.demande_batiment_prest_column = [
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
        apiFactory.getAll("tranche_demande_mpe/index").then(function(result)
        {
          vm.alltranche_demande_mpe= result.data.response;
          vm.allcurenttranche_demande_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mpe);
        });

        //Masque de saisi ajout
        vm.ajouterDemande_batiment_prest = function ()
        { 
          if(vm.alldemande_batiment_prest.length>0)
          {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_batiment_prest.map(function(o)
            { 
              return o.id;
            }));

            vm.dernierdemande = vm.alldemande_batiment_prest.filter(function(obj)
            {
                return obj.id == last_id_demande;
            });
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

            vm.allcurenttranche_demande_mpe = vm.alltranche_demande_mpe.filter(function(obj)
            {
                return obj.code == 'tranche '+(parseInt(numcode)+1);
            });

          }
          else
          {
            vm.allcurenttranche_demande_mpe = vm.alltranche_demande_mpe.filter(function(obj)
            {
                return obj.code == 'tranche 1';
            });
            vm.dernierdemande = [];console.log(vm.allcurenttranche_demande_mpe);
          }
          if (NouvelItemDemande_batiment_prest == false)
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
            vm.alldemande_batiment_prest.push(items);
            vm.alldemande_batiment_prest.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_batiment_prest = mem;
              }
            });

            NouvelItemDemande_batiment_prest = true ;
          }else
          {
            vm.showAlert('Ajout demande batiment','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_batiment_prest(demande_batiment_prest,suppression)
        {
            if (NouvelItemDemande_batiment_prest==false)
            {
                test_existanceDemande_batiment_prest (demande_batiment_prest,suppression); 
            } 
            else
            {
                insert_in_baseDemande_batiment_prest(demande_batiment_prest,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_prest
        vm.annulerDemande_batiment_prest = function(item)
        {
          if (NouvelItemDemande_batiment_prest == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_batiment_prest.objet ;
            item.description   = currentItemDemande_batiment_prest.description ;
            item.ref_facture   = currentItemDemande_batiment_prest.ref_facture ;
            item.id_tranche_demande_mpe = currentItemDemande_batiment_prest.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_batiment_prest.montant ;
            item.cumul = currentItemDemande_batiment_prest.cumul ;
            item.anterieur = currentItemDemande_batiment_prest.anterieur;
            item.periode = currentItemDemande_batiment_prest.periode ;
            item.pourcentage = currentItemDemande_batiment_prest.pourcentage ;
            item.reste = currentItemDemande_batiment_prest.reste;
            item.date  = currentItemDemande_batiment_prest.date;
          }else
          {
            vm.alldemande_batiment_prest = vm.alldemande_batiment_prest.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_prest.id;
            });
          }

          vm.selectedItemDemande_batiment_prest = {} ;
          NouvelItemDemande_batiment_prest      = false;
          
        };

        //fonction selection item Demande_batiment_prest
        vm.selectionDemande_batiment_prest= function (item)
        {
            vm.selectedItemDemande_batiment_prest = item;
            vm.nouvelItemDemande_batiment_prest   = item;
            currentItemDemande_batiment_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.alljustificatif_batiment_pre = result.data.response;
                console.log(vm.alljustificatif_batiment_pre);
            });

           /* apiFactory.getAPIgeneraliserREST("justificatif_facture/index",'id_demande_pay_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.alljustificatif_facture = result.data.response;
                console.log(vm.alljustificatif_facture);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_autre_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.alljustificatif_autre = result.data.response;
                console.log(vm.alljustificatif_autre);
            });*/

            vm.stepThree = true;
            vm.stepFor = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_prest', function()
        {
             if (!vm.alldemande_batiment_prest) return;
             vm.alldemande_batiment_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_prest.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_batiment_prest = function(item)
        {
            NouvelItemDemande_batiment_prest = false ;
            vm.selectedItemDemande_batiment_prest = item;
            currentItemDemande_batiment_prest = angular.copy(vm.selectedItemDemande_batiment_prest);
            $scope.vm.alldemande_batiment_prest.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_batiment_prest.objet ;
            item.description   = vm.selectedItemDemande_batiment_prest.description ;
            item.ref_facture   = vm.selectedItemDemande_batiment_prest.ref_facture ;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_batiment_prest.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_batiment_prest.montant);
            item.cumul = vm.selectedItemDemande_batiment_prest.cumul ;
            item.anterieur = vm.selectedItemDemande_batiment_prest.anterieur ;
            item.periode = vm.selectedItemDemande_batiment_prest.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_batiment_prest.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_batiment_prest.reste ;
            item.date   =new Date(vm.selectedItemDemande_batiment_prest.date) ;
        };

        //fonction bouton suppression item Demande_batiment_prest
        vm.supprimerDemande_batiment_prest = function()
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
                vm.ajoutDemande_batiment_prest(vm.selectedItemDemande_batiment_prest,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_batiment_prest (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_batiment_prest.filter(function(obj)
                {
                   return obj.id == currentItemDemande_batiment_prest.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_batiment_prest.objet )
                    || (pass[0].description   != currentItemDemande_batiment_prest.description )
                    || (dema[0].id_tranche_demande_mpe != currentItemDemande_batiment_prest.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_batiment_prest.montant )
                    || (pass[0].cumul != currentItemDemande_batiment_prest.cumul )
                    || (pass[0].anterieur != currentItemDemande_batiment_prest.anterieur )
                    || (pass[0].reste != currentItemDemande_batiment_prest.reste )
                    || (pass[0].date   != currentItemDemande_batiment_prest.date )
                    || (pass[0].ref_facture   != currentItemDemande_batiment_prest.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_batiment_prest(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_batiment_prest(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_prest
        function insert_in_baseDemande_batiment_prest(demande_batiment_prest,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_batiment_prest==false)
            {
                getId = vm.selectedItemDemande_batiment_prest.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_batiment_prest.objet,
                    description:demande_batiment_prest.description,
                    ref_facture:demande_batiment_prest.ref_facture,
                    id_tranche_demande_mpe: demande_batiment_prest.id_tranche_demande_mpe ,
                    montant: demande_batiment_prest.montant,
                    cumul: demande_batiment_prest.cumul ,
                    anterieur: demande_batiment_prest.anterieur ,
                    reste: demande_batiment_prest.reste ,
                    date: convertionDate(new Date(demande_batiment_prest.date)),
                    id_batiment_construction: vm.selectedItemBatiment_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_prestataire/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_mpe.filter(function(obj)
                {
                    return obj.id == demande_batiment_prest.id_tranche_demande_mpe;
                });

                if (NouvelItemDemande_batiment_prest == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        /*vm.selectedItemDemande_batiment_prest.objet   = demande_batiment_prest.objet ;
                        vm.selectedItemDemande_batiment_prest.description   = demande_batiment_prest.description ;
                        vm.selectedItemDemande_batiment_prest.ref_facture   = demande_batiment_prest.ref_facture ;
                        vm.selectedItemDemande_batiment_prest.montant   = demande_batiment_prest.montant ;*/
                        vm.selectedItemDemande_batiment_prest.tranche = tran[0] ;
                        /*vm.selectedItemDemande_batiment_prest.cumul = demande_batiment_prest.cumul ;
                        vm.selectedItemDemande_batiment_prest.anterieur = demande_batiment_prest.anterieur ;*/
                        vm.selectedItemDemande_batiment_prest.periode = tran[0].periode ;
                        vm.selectedItemDemande_batiment_prest.pourcentage = tran[0].pourcentage ;
                        /*vm.selectedItemDemande_batiment_prest.reste = demande_batiment_prest.reste ;
                        vm.selectedItemDemande_batiment_prest.date   = demande_batiment_prest.date ;*/
                        
                        vm.selectedItemDemande_batiment_prest.$selected  = false;
                        vm.selectedItemDemande_batiment_prest.$edit      = false;
                        vm.selectedItemDemande_batiment_prest ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_batiment_prest = vm.alldemande_batiment_prest.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_prest.id;
                      });
                    }
                    
                }
                else
                {
                  /*demande_batiment_prest.objet   = demande_batiment_prest.objet ;
                  demande_batiment_prest.description   = demande_batiment_prest.description ;
                  demande_batiment_prest.ref_facture   = demande_batiment_prest.ref_facture ;
                  demande_batiment_prest.montant   = demande_batiment_prest.montant ;*/
                  demande_batiment_prest.tranche = tran[0] ;
                  /*demande_batiment_prest.cumul = demande_batiment_prest.cumul ;
                  demande_batiment_prest.anterieur = demande_batiment_prest.anterieur ;*/
                  demande_batiment_prest.periode = tran[0].periode ;
                  demande_batiment_prest.pourcentage = tran[0].pourcentage ;
                  /*demande_batiment_prest.reste = demande_batiment_prest.reste ;
                  demande_batiment_prest.date   = demande_batiment_prest.date ;*/

                  demande_batiment_prest.id  =   String(data.response);              
                  NouvelItemDemande_batiment_prest=false;
            }
              demande_batiment_prest.$selected = false;
              demande_batiment_prest.$edit = false;
              vm.selectedItemDemande_batiment_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = ((parseInt(vm.selectedItemContrat_prestataire.cout_batiment)+
            parseInt(vm.selectedItemContrat_prestataire.cout_latrine)+parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)) * vm.allcurenttranche_demande_mpe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_batiment_prest.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= (parseInt(vm.selectedItemContrat_prestataire.cout_batiment)+
            parseInt(vm.selectedItemContrat_prestataire.cout_latrine)+parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)) - cumul;

          item.periode = vm.allcurenttranche_demande_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_batiment_prest****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_pre_column = [
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
          vm.selectedItemJustificatif_batiment_pre.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_batiment_pre.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_batiment_pre = function ()
        { 
          if (NouvelItemJustificatif_batiment_pre == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_batiment_pre.push(items);
            vm.alljustificatif_batiment_pre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_batiment_pre = mem;
              }
            });

            NouvelItemJustificatif_batiment_pre = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_batiment_pre','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_batiment_pre(justificatif_batiment_pre,suppression)
        {
            if (NouvelItemJustificatif_batiment_pre==false)
            {
                test_existanceJustificatif_batiment_pre (justificatif_batiment_pre,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_batiment_pre(justificatif_batiment_pre,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_batiment_pre
        vm.annulerJustificatif_batiment_pre = function(item)
        {
          if (NouvelItemJustificatif_batiment_pre == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_batiment_pre.description ;
            item.fichier   = currentItemJustificatif_batiment_pre.fichier ;
          }else
          {
            vm.alljustificatif_batiment_pre = vm.alljustificatif_batiment_pre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_batiment_pre.id;
            });
          }

          vm.selectedItemJustificatif_batiment_pre = {} ;
          NouvelItemJustificatif_batiment_pre      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_batiment_pre= function (item)
        {
            vm.selectedItemJustificatif_batiment_pre = item;
            vm.nouvelItemJustificatif_batiment_pre   = item;
            currentItemJustificatif_batiment_pre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_batiment_pre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_batiment_pre', function()
        {
             if (!vm.alljustificatif_batiment_pre) return;
             vm.alljustificatif_batiment_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_batiment_pre.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_batiment_pre = function(item)
        {
            NouvelItemJustificatif_batiment_pre = false ;
            vm.selectedItemJustificatif_batiment_pre = item;
            currentItemJustificatif_batiment_pre = angular.copy(vm.selectedItemJustificatif_batiment_pre);
            $scope.vm.alljustificatif_batiment_pre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_batiment_pre.description ;
            item.fichier   = vm.selectedItemJustificatif_batiment_pre.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_batiment_pre
        vm.supprimerJustificatif_batiment_pre = function()
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
                vm.ajoutJustificatif_batiment_pre(vm.selectedItemJustificatif_batiment_pre,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_batiment_pre (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_batiment_pre.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_batiment_pre.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_batiment_pre.description )
                    ||(just[0].fichier   != currentItemJustificatif_batiment_pre.fichier ))                   
                      { 
                         insert_in_baseJustificatif_batiment_pre(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_batiment_pre(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_batiment_pre
        function insert_in_baseJustificatif_batiment_pre(justificatif_batiment_pre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_batiment_pre==false)
            {
                getId = vm.selectedItemJustificatif_batiment_pre.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_batiment_pre.description,
                    fichier: justificatif_batiment_pre.fichier,
                    id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'justificatif_batiment_pre/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemJustificatif_batiment_pre==false)
                {
                    getIdFile = vm.selectedItemJustificatif_batiment_pre.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          justificatif_batiment_pre.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_batiment_pre.description,
                              fichier: justificatif_batiment_pre.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id               
                          });
                            apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_batiment_pre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_batiment_pre.description = justificatif_batiment_pre.description;
                                      vm.selectedItemJustificatif_batiment_pre.fichier = justificatif_batiment_pre.fichier;
                                      vm.selectedItemJustificatif_batiment_pre.$selected  = false;
                                      vm.selectedItemJustificatif_batiment_pre.$edit      = false;
                                      vm.selectedItemJustificatif_batiment_pre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_batiment_pre = vm.alljustificatif_batiment_pre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_batiment_pre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_batiment_pre.description = justificatif_batiment_pre.description;
                                justificatif_batiment_pre.fichier = justificatif_batiment_pre.fichier; 

                                justificatif_batiment_pre.id  =   String(data.response);              
                                NouvelItemJustificatif_batiment_pre=false;
                          }
                            justificatif_batiment_pre.$selected = false;
                            justificatif_batiment_pre.$edit = false;
                            vm.selectedItemJustificatif_batiment_pre = {};
                            //vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        justificatif_batiment_pre.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_batiment_pre.description,
                              fichier: justificatif_batiment_pre.fichier,
                              id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id               
                          });
                        apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_batiment_pre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_batiment_pre.description = justificatif_batiment_pre.description;
                                      vm.selectedItemJustificatif_batiment_pre.fichier = justificatif_batiment_pre.fichier;
                                      vm.selectedItemJustificatif_batiment_pre.$selected  = false;
                                      vm.selectedItemJustificatif_batiment_pre.$edit      = false;
                                      vm.selectedItemJustificatif_batiment_pre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_batiment_pre = vm.alljustificatif_batiment_pre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_batiment_pre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_batiment_pre.description = justificatif_batiment_pre.description;
                                justificatif_batiment_pre.fichier = justificatif_batiment_pre.fichier; 

                                justificatif_batiment_pre.id  =   String(data.response);              
                                NouvelItemJustificatif_batiment_pre=false;
                          }
                            justificatif_batiment_pre.$selected = false;
                            justificatif_batiment_pre.$edit = false;
                            vm.selectedItemJustificatif_batiment_pre = {};
                            //vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            //vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif batiment****************************************/


/**********************************debut latrine construction****************************************/
      //col table
        vm.latrine_construction_column = [        
        {
          titre:"Latrine"
        },
        {
          titre:"Nombre latrine"
        },
        {
          titre:"cout latrine"
        }];

      //fonction selection item Latrine construction
        vm.selectionLatrine_construction = function (item)
        {
            vm.selectedItemLatrine_construction = item;

            if (vm.selectedItemLatrine_construction.id!=0)
            {  

              apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index",'menu','getdemandeInvalide','id_latrine_construction',item.id).then(function(result)
              {
                  vm.alldemande_latrine_prest = result.data.response;
                  console.log(vm.alldemande_latrine_prest);
              });
              vm.stepFor = true;
              vm.stepFive = false;
              vm.stepSixe = false;
            }          

        };
        $scope.$watch('vm.selectedItemLatrine_construction', function()
        {
             if (!vm.alllatrine_construction) return;
             vm.alllatrine_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemLatrine_construction.$selected = true;
        });


/**********************************fin latrine construction****************************************/

/**********************************debut demande_batiment_prest****************************************/
//col table
        vm.demande_latrine_prest_column = [
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
        apiFactory.getAll("tranche_demande_latrine_mpe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_mpe= result.data.response;
          vm.allcurenttranche_demande_latrine_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_latrine_mpe);
        });

        //Masque de saisi ajout
        vm.ajouterDemande_latrine_prest = function ()
        { 
          if(vm.alldemande_latrine_prest.length>0)
          {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_latrine_prest.map(function(o)
            { 
              return o.id;
            }));

            vm.dernierdemande = vm.alldemande_latrine_prest.filter(function(obj)
            {
                return obj.id == last_id_demande;
            });
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

            vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj)
            {
                return obj.code == 'tranche '+(parseInt(numcode)+1);
            });

          }
          else
          {
            vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj)
            {
                return obj.code == 'tranche 1';
            });
            vm.dernierdemande = [];console.log(vm.allcurenttranche_demande_latrine_mpe);
          }
          if (NouvelItemDemande_latrine_prest == false)
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
            vm.alldemande_latrine_prest.push(items);
            vm.alldemande_latrine_prest.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_latrine_prest = mem;
              }
            });

            NouvelItemDemande_latrine_prest = true ;
          }else
          {
            vm.showAlert('Ajout demande latrine','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_latrine_prest(demande_latrine_prest,suppression)
        {
            if (NouvelItemDemande_latrine_prest==false)
            {
                test_existanceDemande_latrine_prest (demande_latrine_prest,suppression); 
            } 
            else
            {
                insert_in_baseDemande_latrine_prest(demande_latrine_prest,suppression);
            }
        }

        //fonction de bouton d'annulation demande_latrine_prest
        vm.annulerDemande_latrine_prest = function(item)
        {
          if (NouvelItemDemande_latrine_prest == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_latrine_prest.objet ;
            item.description   = currentItemDemande_latrine_prest.description ;
            item.ref_facture   = currentItemDemande_latrine_prest.ref_facture ;
            item.id_tranche_demande_mpe = currentItemDemande_latrine_prest.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_latrine_prest.montant ;
            item.cumul = currentItemDemande_latrine_prest.cumul ;
            item.anterieur = currentItemDemande_latrine_prest.anterieur;
            item.periode = currentItemDemande_latrine_prest.periode ;
            item.pourcentage = currentItemDemande_latrine_prest.pourcentage ;
            item.reste = currentItemDemande_latrine_prest.reste;
            item.date  = currentItemDemande_latrine_prest.date;
          }else
          {
            vm.alldemande_latrine_prest = vm.alldemande_latrine_prest.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_latrine_prest.id;
            });
          }

          vm.selectedItemDemande_latrine_prest = {} ;
          NouvelItemDemande_latrine_prest      = false;
          
        };

        //fonction selection item Demande_latrine_prest
        vm.selectionDemande_latrine_prest= function (item)
        {
            vm.selectedItemDemande_latrine_prest = item;
            vm.nouvelItemDemande_latrine_prest   = item;
            currentItemDemande_latrine_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_latrine_pre/index",'id_demande_latrine_pre',vm.selectedItemDemande_latrine_prest.id).then(function(result)
            {
                vm.alljustificatif_latrine_pre = result.data.response;
                console.log(vm.alljustificatif_latrine_pre);
            });

            vm.stepFive = true;
            vm.stepSixe = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_latrine_prest', function()
        {
             if (!vm.alldemande_latrine_prest) return;
             vm.alldemande_latrine_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_prest.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_latrine_prest = function(item)
        {
            NouvelItemDemande_latrine_prest = false ;
            vm.selectedItemDemande_latrine_prest = item;
            currentItemDemande_latrine_prest = angular.copy(vm.selectedItemDemande_latrine_prest);
            $scope.vm.alldemande_latrine_prest.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_latrine_prest.objet ;
            item.description   = vm.selectedItemDemande_latrine_prest.description ;
            item.ref_facture   = vm.selectedItemDemande_latrine_prest.ref_facture ;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_latrine_prest.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_latrine_prest.montant);
            item.cumul = vm.selectedItemDemande_latrine_prest.cumul ;
            item.anterieur = vm.selectedItemDemande_latrine_prest.anterieur ;
            item.periode = vm.selectedItemDemande_latrine_prest.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_latrine_prest.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_latrine_prest.reste ;
            item.date   =new Date(vm.selectedItemDemande_latrine_prest.date) ;
        };

        //fonction bouton suppression item Demande_latrine_prest
        vm.supprimerDemande_latrine_prest = function()
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
                vm.ajoutDemande_latrine_prest(vm.selectedItemDemande_latrine_prest,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_latrine_prest (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_latrine_prest.filter(function(obj)
                {
                   return obj.id == currentItemDemande_latrine_prest.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_latrine_prest.objet )
                    || (pass[0].description   != currentItemDemande_latrine_prest.description )
                    || (dema[0].id_tranche_demande_mpe != currentItemDemande_latrine_prest.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_latrine_prest.montant )
                    || (pass[0].cumul != currentItemDemande_latrine_prest.cumul )
                    || (pass[0].anterieur != currentItemDemande_latrine_prest.anterieur )
                    || (pass[0].reste != currentItemDemande_latrine_prest.reste )
                    || (pass[0].date   != currentItemDemande_latrine_prest.date )
                    || (pass[0].ref_facture   != currentItemDemande_latrine_prest.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_latrine_prest(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_latrine_prest(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_latrine_prest
        function insert_in_baseDemande_latrine_prest(demande_latrine_prest,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_latrine_prest==false)
            {
                getId = vm.selectedItemDemande_latrine_prest.id; 
            } 
            console.log(demande_latrine_prest);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_latrine_prest.objet,
                    description:demande_latrine_prest.description,
                    ref_facture:demande_latrine_prest.ref_facture,
                    id_tranche_demande_mpe: demande_latrine_prest.id_tranche_demande_mpe ,
                    montant: demande_latrine_prest.montant,
                    cumul: demande_latrine_prest.cumul ,
                    anterieur: demande_latrine_prest.anterieur ,
                    reste: demande_latrine_prest.reste ,
                    date: convertionDate(new Date(demande_latrine_prest.date)),
                    id_latrine_construction: vm.selectedItemLatrine_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_prestataire/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_latrine_mpe.filter(function(obj)
                {
                    return obj.id == demande_latrine_prest.id_tranche_demande_mpe;
                });

                if (NouvelItemDemande_latrine_prest == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                       
                        vm.selectedItemDemande_latrine_prest.tranche = tran[0] ;
                        vm.selectedItemDemande_latrine_prest.periode = tran[0].periode ;
                        vm.selectedItemDemande_latrine_prest.pourcentage = tran[0].pourcentage ;
                        vm.selectedItemDemande_latrine_prest.$selected  = false;
                        vm.selectedItemDemande_latrine_prest.$edit      = false;
                        vm.selectedItemDemande_latrine_prest ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_latrine_prest = vm.alldemande_latrine_prest.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_latrine_prest.id;
                      });
                    }
                    
                }
                else
                {
                  demande_latrine_prest.tranche = tran[0] ;
                  demande_latrine_prest.periode = tran[0].periode ;
                  demande_latrine_prest.pourcentage = tran[0].pourcentage ;

                  demande_latrine_prest.id  =   String(data.response);              
                  NouvelItemDemande_latrine_prest=false;
                }
              demande_latrine_prest.$selected = false;
              demande_latrine_prest.$edit = false;
              vm.selectedItemDemande_latrine_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_latrine = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = ((parseInt(vm.selectedItemContrat_prestataire.cout_latrine)+
            parseInt(vm.selectedItemContrat_prestataire.cout_latrine)+parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)) * vm.allcurenttranche_demande_latrine_mpe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_latrine_prest.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= (parseInt(vm.selectedItemContrat_prestataire.cout_latrine)+
            parseInt(vm.selectedItemContrat_prestataire.cout_latrine)+parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)) - cumul;

          item.periode = vm.allcurenttranche_demande_latrine_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_latrine_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_latrine_prest****************************************/

/**********************************Debut justificatif facture****************************************/

//col table
        vm.justificatif_latrine_pre_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFileLatrinefacture = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_latrine_pre.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_latrine_pre = function ()
        { 
          if (NouvelItemJustificatif_latrine_pre == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_latrine_pre.push(items);
            vm.alljustificatif_latrine_pre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_latrine_pre = mem;
              }
            });

            NouvelItemJustificatif_latrine_pre = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_latrine_pre','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_latrine_pre(justificatif_latrine_pre,suppression)
        {
            if (NouvelItemJustificatif_latrine_pre==false)
            {
                test_existanceJustificatif_latrine_pre (justificatif_latrine_pre,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_latrine_pre(justificatif_latrine_pre,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_latrine_pre
        vm.annulerJustificatif_latrine_pre = function(item)
        {
          if (NouvelItemJustificatif_latrine_pre == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_latrine_pre.description ;
            item.fichier   = currentItemJustificatif_latrine_pre.fichier ;
          }else
          {
            vm.alljustificatif_latrine_pre = vm.alljustificatif_latrine_pre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_latrine_pre.id;
            });
          }

          vm.selectedItemJustificatif_latrine_pre = {} ;
          NouvelItemJustificatif_latrine_pre      = false;
          
        };

        //fonction selection item region
        vm.selectionJustificatif_latrine_pre= function (item)
        {
            vm.selectedItemJustificatif_latrine_pre = item;
            vm.nouvelItemJustificatif_latrine_pre   = item;
            currentItemJustificatif_latrine_pre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_latrine_pre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_latrine_pre', function()
        {
             if (!vm.alljustificatif_latrine_pre) return;
             vm.alljustificatif_latrine_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_latrine_pre.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_latrine_pre = function(item)
        {
            NouvelItemJustificatif_latrine_pre = false ;
            vm.selectedItemJustificatif_latrine_pre = item;
            currentItemJustificatif_latrine_pre = angular.copy(vm.selectedItemJustificatif_latrine_pre);
            $scope.vm.alljustificatif_latrine_pre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_latrine_pre.description ;
            item.fichier   = vm.selectedItemJustificatif_latrine_pre.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_latrine_pre
        vm.supprimerJustificatif_latrine_pre = function()
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
                vm.ajoutJustificatif_latrine_pre(vm.selectedItemJustificatif_latrine_pre,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_latrine_pre (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_latrine_pre.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_latrine_pre.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_latrine_pre.description )
                    ||(just[0].fichier   != currentItemJustificatif_latrine_pre.fichier ))                   
                      { 
                         insert_in_baseJustificatif_latrine_pre(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_latrine_pre(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_latrine_pre
        function insert_in_baseJustificatif_latrine_pre(justificatif_latrine_pre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_latrine_pre==false)
            {
                getId = vm.selectedItemJustificatif_latrine_pre.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_latrine_pre.description,
                    fichier: justificatif_latrine_pre.fichier,
                    id_demande_latrine_pre: vm.selectedItemDemande_latrine_prest.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'justificatif_latrine_pre/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemJustificatif_latrine_pre==false)
                {
                    getIdFile = vm.selectedItemJustificatif_latrine_pre.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          justificatif_latrine_pre.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_latrine_pre.description,
                              fichier: justificatif_latrine_pre.fichier,
                              id_demande_latrine_pre: vm.selectedItemDemande_latrine_prest.id               
                          });
                            apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_latrine_pre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_latrine_pre.description = justificatif_latrine_pre.description;
                                      vm.selectedItemJustificatif_latrine_pre.fichier = justificatif_latrine_pre.fichier;
                                      vm.selectedItemJustificatif_latrine_pre.$selected  = false;
                                      vm.selectedItemJustificatif_latrine_pre.$edit      = false;
                                      vm.selectedItemJustificatif_latrine_pre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_latrine_pre = vm.alljustificatif_latrine_pre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_latrine_pre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_latrine_pre.description = justificatif_latrine_pre.description;
                                justificatif_latrine_pre.fichier = justificatif_latrine_pre.fichier; 

                                justificatif_latrine_pre.id  =   String(data.response);              
                                NouvelItemJustificatif_latrine_pre=false;
                          }
                            justificatif_latrine_pre.$selected = false;
                            justificatif_latrine_pre.$edit = false;
                            vm.selectedItemJustificatif_latrine_pre = {};
                            //vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        justificatif_latrine_pre.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_latrine_pre.description,
                              fichier: justificatif_latrine_pre.fichier,
                              id_demande_latrine_pre: vm.selectedItemDemande_latrine_prest.id               
                          });
                        apiFactory.add("justificatif_latrine_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_latrine_pre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_latrine_pre.description = justificatif_latrine_pre.description;
                                      vm.selectedItemJustificatif_latrine_pre.fichier = justificatif_latrine_pre.fichier;
                                      vm.selectedItemJustificatif_latrine_pre.$selected  = false;
                                      vm.selectedItemJustificatif_latrine_pre.$edit      = false;
                                      vm.selectedItemJustificatif_latrine_pre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_latrine_pre = vm.alljustificatif_latrine_pre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_latrine_pre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_latrine_pre.description = justificatif_latrine_pre.description;
                                justificatif_latrine_pre.fichier = justificatif_latrine_pre.fichier; 

                                justificatif_latrine_pre.id  =   String(data.response);              
                                NouvelItemJustificatif_latrine_pre=false;
                          }
                            justificatif_latrine_pre.$selected = false;
                            justificatif_latrine_pre.$edit = false;
                            vm.selectedItemJustificatif_latrine_pre = {};
                            //vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            //vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin mpe_sousmissionnaire****************************************/

/**********************************debut mobilier construction****************************************/
      //col table
        vm.mobilier_construction_column = [        
        {
          titre:"Mobilier"
        },
        {
          titre:"Nombre mobilier"
        },
        {
          titre:"cout latrine"
        }];

      //fonction selection item Latrine construction
        vm.selectionMobilier_construction = function (item)
        {
            vm.selectedItemMobilier_construction = item;

            if (vm.selectedItemMobilier_construction.id!=0)
            {  

              apiFactory.getAPIgeneraliserREST("demande_mobilier_prestataire/index",'menu','getdemandeInvalide','id_mobilier_construction',item.id).then(function(result)
              {
                  vm.alldemande_mobilier_prest = result.data.response;
                  console.log(vm.alldemande_mobilier_prest);
              });
              vm.stepFor = true;
              vm.stepFive = false;
              vm.stepSixe = false;
            }          

        };
        $scope.$watch('vm.selectedItemMobilier_construction', function()
        {
             if (!vm.allmobilier_construction) return;
             vm.allmobilier_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMobilier_construction.$selected = true;
        });


/**********************************fin mobilier construction****************************************/

/**********************************debut demande_batiment_prest****************************************/
//col table
        vm.demande_mobilier_prest_column = [
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
        apiFactory.getAll("tranche_demande_mobilier_mpe/index").then(function(result)
        {
          vm.alltranche_demande_mobilier_mpe= result.data.response;
          vm.allcurenttranche_demande_mobilier_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_mobilier_mpe);
        });

        //Masque de saisi ajout
        vm.ajouterDemande_mobilier_prest = function ()
        { 
          if(vm.alldemande_mobilier_prest.length>0)
          {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_mobilier_prest.map(function(o)
            { 
              return o.id;
            }));

            vm.dernierdemande = vm.alldemande_mobilier_prest.filter(function(obj)
            {
                return obj.id == last_id_demande;
            });
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

            vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj)
            {
                return obj.code == 'tranche '+(parseInt(numcode)+1);
            });

          }
          else
          {
            vm.allcurenttranche_demande_mobilier_mpe = vm.alltranche_demande_mobilier_mpe.filter(function(obj)
            {
                return obj.code == 'tranche 1';
            });
            vm.dernierdemande = [];console.log(vm.allcurenttranche_demande_mobilier_mpe);
          }
          if (NouvelItemDemande_mobilier_prest == false)
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
            vm.alldemande_mobilier_prest.push(items);
            vm.alldemande_mobilier_prest.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_mobilier_prest = mem;
              }
            });

            NouvelItemDemande_mobilier_prest = true ;
          }else
          {
            vm.showAlert('Ajout demande mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_mobilier_prest(demande_mobilier_prest,suppression)
        {
            if (NouvelItemDemande_mobilier_prest==false)
            {
                test_existanceDemande_mobilier_prest (demande_mobilier_prest,suppression); 
            } 
            else
            {
                insert_in_baseDemande_mobilier_prest(demande_mobilier_prest,suppression);
            }
        }

        //fonction de bouton d'annulation demande_mobilier_prest
        vm.annulerDemande_mobilier_prest = function(item)
        {
          if (NouvelItemDemande_mobilier_prest == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_mobilier_prest.objet ;
            item.description   = currentItemDemande_mobilier_prest.description ;
            item.ref_facture   = currentItemDemande_mobilier_prest.ref_facture ;
            item.id_tranche_demande_mpe = currentItemDemande_mobilier_prest.id_tranche_demande_mpe ;
            item.montant   = currentItemDemande_mobilier_prest.montant ;
            item.cumul = currentItemDemande_mobilier_prest.cumul ;
            item.anterieur = currentItemDemande_mobilier_prest.anterieur;
            item.periode = currentItemDemande_mobilier_prest.periode ;
            item.pourcentage = currentItemDemande_mobilier_prest.pourcentage ;
            item.reste = currentItemDemande_mobilier_prest.reste;
            item.date  = currentItemDemande_mobilier_prest.date;
          }else
          {
            vm.alldemande_mobilier_prest = vm.alldemande_mobilier_prest.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_mobilier_prest.id;
            });
          }

          vm.selectedItemDemande_mobilier_prest = {} ;
          NouvelItemDemande_mobilier_prest      = false;
          
        };

        //fonction selection item Demande_mobilier_prest
        vm.selectionDemande_mobilier_prest= function (item)
        {
            vm.selectedItemDemande_mobilier_prest = item;
            vm.nouvelItemDemande_mobilier_prest   = item;
            currentItemDemande_mobilier_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_mobilier_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_mobilier_pre/index",'id_demande_mobilier_pre',vm.selectedItemDemande_mobilier_prest.id).then(function(result)
            {
                vm.alljustificatif_mobilier_pre = result.data.response;
                console.log(vm.alljustificatif_mobilier_pre);
            });

            vm.stepFive = true;
            vm.stepSixe = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_prest', function()
        {
             if (!vm.alldemande_mobilier_prest) return;
             vm.alldemande_mobilier_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_prest.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_mobilier_prest = function(item)
        {
            NouvelItemDemande_mobilier_prest = false ;
            vm.selectedItemDemande_mobilier_prest = item;
            currentItemDemande_mobilier_prest = angular.copy(vm.selectedItemDemande_mobilier_prest);
            $scope.vm.alldemande_mobilier_prest.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_mobilier_prest.objet ;
            item.description   = vm.selectedItemDemande_mobilier_prest.description ;
            item.ref_facture   = vm.selectedItemDemande_mobilier_prest.ref_facture ;
            item.id_tranche_demande_mpe = vm.selectedItemDemande_mobilier_prest.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_mobilier_prest.montant);
            item.cumul = vm.selectedItemDemande_mobilier_prest.cumul ;
            item.anterieur = vm.selectedItemDemande_mobilier_prest.anterieur ;
            item.periode = vm.selectedItemDemande_mobilier_prest.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_mobilier_prest.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_mobilier_prest.reste ;
            item.date   =new Date(vm.selectedItemDemande_mobilier_prest.date) ;
        };

        //fonction bouton suppression item Demande_mobilier_prest
        vm.supprimerDemande_mobilier_prest = function()
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
                vm.ajoutDemande_mobilier_prest(vm.selectedItemDemande_mobilier_prest,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_mobilier_prest (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_mobilier_prest.filter(function(obj)
                {
                   return obj.id == currentItemDemande_mobilier_prest.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_mobilier_prest.objet )
                    || (pass[0].description   != currentItemDemande_mobilier_prest.description )
                    || (dema[0].id_tranche_demande_mpe != currentItemDemande_mobilier_prest.id_tranche_demande_mpe )
                    || (pass[0].montant   != currentItemDemande_mobilier_prest.montant )
                    || (pass[0].cumul != currentItemDemande_mobilier_prest.cumul )
                    || (pass[0].anterieur != currentItemDemande_mobilier_prest.anterieur )
                    || (pass[0].reste != currentItemDemande_mobilier_prest.reste )
                    || (pass[0].date   != currentItemDemande_mobilier_prest.date )
                    || (pass[0].ref_facture   != currentItemDemande_mobilier_prest.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_mobilier_prest(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_mobilier_prest(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_mobilier_prest
        function insert_in_baseDemande_mobilier_prest(demande_mobilier_prest,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_mobilier_prest==false)
            {
                getId = vm.selectedItemDemande_mobilier_prest.id; 
            } 
            console.log(demande_mobilier_prest);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_mobilier_prest.objet,
                    description:demande_mobilier_prest.description,
                    ref_facture:demande_mobilier_prest.ref_facture,
                    id_tranche_demande_mpe: demande_mobilier_prest.id_tranche_demande_mpe ,
                    montant: demande_mobilier_prest.montant,
                    cumul: demande_mobilier_prest.cumul ,
                    anterieur: demande_mobilier_prest.anterieur ,
                    reste: demande_mobilier_prest.reste ,
                    date: convertionDate(new Date(demande_mobilier_prest.date)),
                    id_mobilier_construction: vm.selectedItemMobilier_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_prestataire/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_mobilier_mpe.filter(function(obj)
                {
                    return obj.id == demande_mobilier_prest.id_tranche_demande_mpe;
                });

                if (NouvelItemDemande_mobilier_prest == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                       
                        vm.selectedItemDemande_mobilier_prest.tranche = tran[0] ;
                        vm.selectedItemDemande_mobilier_prest.periode = tran[0].periode ;
                        vm.selectedItemDemande_mobilier_prest.pourcentage = tran[0].pourcentage ;
                        vm.selectedItemDemande_mobilier_prest.$selected  = false;
                        vm.selectedItemDemande_mobilier_prest.$edit      = false;
                        vm.selectedItemDemande_mobilier_prest ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_mobilier_prest = vm.alldemande_mobilier_prest.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_mobilier_prest.id;
                      });
                    }
                    
                }
                else
                {
                  demande_mobilier_prest.tranche = tran[0] ;
                  demande_mobilier_prest.periode = tran[0].periode ;
                  demande_mobilier_prest.pourcentage = tran[0].pourcentage ;

                  demande_mobilier_prest.id  =   String(data.response);              
                  NouvelItemDemande_mobilier_prest=false;
                }
              demande_mobilier_prest.$selected = false;
              demande_mobilier_prest.$edit = false;
              vm.selectedItemDemande_mobilier_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_mobilier = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = ((parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)+
            parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)+parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)) * vm.allcurenttranche_demande_mobilier_mpe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_mobilier_prest.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= (parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)+
            parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)+parseInt(vm.selectedItemContrat_prestataire.cout_mobilier)) - cumul;

          item.periode = vm.allcurenttranche_demande_mobilier_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_mobilier_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_mobilier_prest****************************************/

/**********************************Debut justificatif facture****************************************/

//col table
        vm.justificatif_mobilier_pre_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        $scope.uploadFilemobilierfacture = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemJustificatif_mobilier_pre.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_mobilier_pre = function ()
        { 
          if (NouvelItemJustificatif_mobilier_pre == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_mobilier_pre.push(items);
            vm.alljustificatif_mobilier_pre.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_mobilier_pre = mem;
              }
            });

            NouvelItemJustificatif_mobilier_pre = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_mobilier_pre','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_mobilier_pre(justificatif_mobilier_pre,suppression)
        {
            if (NouvelItemJustificatif_mobilier_pre==false)
            {
                test_existanceJustificatif_mobilier_pre (justificatif_mobilier_pre,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_mobilier_pre(justificatif_mobilier_pre,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_mobilier_pre
        vm.annulerJustificatif_mobilier_pre = function(item)
        {
          if (NouvelItemJustificatif_mobilier_pre == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_mobilier_pre.description ;
            item.fichier   = currentItemJustificatif_mobilier_pre.fichier ;
          }else
          {
            vm.alljustificatif_mobilier_pre = vm.alljustificatif_mobilier_pre.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_mobilier_pre.id;
            });
          }

          vm.selectedItemJustificatif_mobilier_pre = {} ;
          NouvelItemJustificatif_mobilier_pre      = false;
          
        };

        //fonction selection item region
        vm.selectionJustificatif_mobilier_pre= function (item)
        {
            vm.selectedItemJustificatif_mobilier_pre = item;
            vm.nouvelItemJustificatif_mobilier_pre   = item;
            currentItemJustificatif_mobilier_pre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_mobilier_pre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_mobilier_pre', function()
        {
             if (!vm.alljustificatif_mobilier_pre) return;
             vm.alljustificatif_mobilier_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_mobilier_pre.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_mobilier_pre = function(item)
        {
            NouvelItemJustificatif_mobilier_pre = false ;
            vm.selectedItemJustificatif_mobilier_pre = item;
            currentItemJustificatif_mobilier_pre = angular.copy(vm.selectedItemJustificatif_mobilier_pre);
            $scope.vm.alljustificatif_mobilier_pre.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_mobilier_pre.description ;
            item.fichier   = vm.selectedItemJustificatif_mobilier_pre.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_mobilier_pre
        vm.supprimerJustificatif_mobilier_pre = function()
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
                vm.ajoutJustificatif_mobilier_pre(vm.selectedItemJustificatif_mobilier_pre,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_mobilier_pre (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_mobilier_pre.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_mobilier_pre.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_mobilier_pre.description )
                    ||(just[0].fichier   != currentItemJustificatif_mobilier_pre.fichier ))                   
                      { 
                         insert_in_baseJustificatif_mobilier_pre(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_mobilier_pre(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_mobilier_pre
        function insert_in_baseJustificatif_mobilier_pre(justificatif_mobilier_pre,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_mobilier_pre==false)
            {
                getId = vm.selectedItemJustificatif_mobilier_pre.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_mobilier_pre.description,
                    fichier: justificatif_mobilier_pre.fichier,
                    id_demande_mobilier_pre: vm.selectedItemDemande_mobilier_prest.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
            {
                var file       = vm.myFile[0];
                var repertoire = 'justificatif_mobilier_pre/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemJustificatif_mobilier_pre==false)
                {
                    getIdFile = vm.selectedItemJustificatif_mobilier_pre.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }
                var name_file = vm.selectedItemContrat_prestataire.num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

                var fd = new FormData();
                fd.append('file', file);
                fd.append('repertoire',repertoire);
                fd.append('name_fichier',name_file);
                if(file)
                { 
                  var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}, repertoire: repertoire
                  }).success(function(data)
                  {
                      if(data['erreur'])
                      {
                        var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                        //var msg = data['erreur'];
                        var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                        $mdDialog.show( alert ).finally(function()
                        {   
                          justificatif_mobilier_pre.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_mobilier_pre.description,
                              fichier: justificatif_mobilier_pre.fichier,
                              id_demande_mobilier_pre: vm.selectedItemDemande_mobilier_prest.id               
                          });
                            apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_mobilier_pre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_mobilier_pre.description = justificatif_mobilier_pre.description;
                                      vm.selectedItemJustificatif_mobilier_pre.fichier = justificatif_mobilier_pre.fichier;
                                      vm.selectedItemJustificatif_mobilier_pre.$selected  = false;
                                      vm.selectedItemJustificatif_mobilier_pre.$edit      = false;
                                      vm.selectedItemJustificatif_mobilier_pre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_mobilier_pre = vm.alljustificatif_mobilier_pre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_mobilier_pre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_mobilier_pre.description = justificatif_mobilier_pre.description;
                                justificatif_mobilier_pre.fichier = justificatif_mobilier_pre.fichier; 

                                justificatif_mobilier_pre.id  =   String(data.response);              
                                NouvelItemJustificatif_mobilier_pre=false;
                          }
                            justificatif_mobilier_pre.$selected = false;
                            justificatif_mobilier_pre.$edit = false;
                            vm.selectedItemJustificatif_mobilier_pre = {};
                            //vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        justificatif_mobilier_pre.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description: justificatif_mobilier_pre.description,
                              fichier: justificatif_mobilier_pre.fichier,
                              id_demande_mobilier_pre: vm.selectedItemDemande_mobilier_prest.id               
                          });
                        apiFactory.add("justificatif_mobilier_pre/index",datas, config).success(function (data)
                            {
                              if (NouvelItemJustificatif_mobilier_pre == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {                        
                                      vm.selectedItemJustificatif_mobilier_pre.description = justificatif_mobilier_pre.description;
                                      vm.selectedItemJustificatif_mobilier_pre.fichier = justificatif_mobilier_pre.fichier;
                                      vm.selectedItemJustificatif_mobilier_pre.$selected  = false;
                                      vm.selectedItemJustificatif_mobilier_pre.$edit      = false;
                                      vm.selectedItemJustificatif_mobilier_pre ={};
                                  }
                                  else 
                                  {    
                                    vm.alljustificatif_mobilier_pre = vm.alljustificatif_mobilier_pre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemJustificatif_mobilier_pre.id;
                                    });
                                  }
                              }
                              else
                              {
                                justificatif_mobilier_pre.description = justificatif_mobilier_pre.description;
                                justificatif_mobilier_pre.fichier = justificatif_mobilier_pre.fichier; 

                                justificatif_mobilier_pre.id  =   String(data.response);              
                                NouvelItemJustificatif_mobilier_pre=false;
                          }
                            justificatif_mobilier_pre.$selected = false;
                            justificatif_mobilier_pre.$edit = false;
                            vm.selectedItemJustificatif_mobilier_pre = {};
                            //vm.showThParcourir = false;
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            //vm.showThParcourir = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
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
