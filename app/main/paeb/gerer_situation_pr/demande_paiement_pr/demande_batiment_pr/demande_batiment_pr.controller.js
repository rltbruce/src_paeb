(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.demande_paiement_pr.demande_batiment_pr')
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
        .controller('Demande_batiment_prController', Demande_batiment_prController);
    /** @ngInject */
    function Demande_batiment_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_partenaire_relai = {};
        vm.allcontrat_partenaire_relai = [];

         vm.selectedItemBatiment_construction = {};
        vm.allbatiment_construction  = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.ajoutDemande_batiment_pr = ajoutDemande_batiment_pr;
        var NouvelItemDemande_batiment_pr=false;
        var currentItemDemande_batiment_pr;
        vm.selectedItemDemande_batiment_pr = {};
        vm.alldemande_batiment_pr_invalide = [];

        vm.alldemande_batiment_pr = [];

        vm.ajoutJustificatif_batiment_pr = ajoutJustificatif_batiment_pr;
        var NouvelItemJustificatif_batiment_pr=false;
        var currentItemJustificatif_batiment_pr;
        vm.selectedItemJustificatif_batiment_pr = {} ;
        vm.alljustificatif_batiment_pr = [] ;

       

        vm.allcurenttranche_demande_batiment_pr = [];
        vm.alltranche_demande_batiment_pr = [];
        vm.dernierdemande = [];

        vm.alltranche_d_debut_travaux_pr = [];
        vm.alldemande_debut_travaux_pr = [];
       // vm.alldemande_bat = [];

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

/**********************************contrat partenaire_relai****************************************/

        //col table
       vm.contrat_partenaire_relai_column = [
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
        apiFactory.getAll("contrat_partenaire_relai/index").then(function(result)
        {
            vm.allcontrat_partenaire_relai = result.data.response; 
            console.log(vm.allcontrat_partenaire_relai);
        });


        //fonction selection item entete convention cisco/feffi
        vm.selectionContrat_partenaire_relai = function (item)
        {
            vm.selectedItemContrat_partenaire_relai = item;
           // vm.allconvention= [] ;
            
                        //recuperation donnée convention
            if (vm.selectedItemContrat_partenaire_relai.id!=0)
            {
              
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'menu','getbatimentByContrat_partenaire_relai','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;
                  console.log(vm.allbatiment_construction);
              });

              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
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

/**********************************fin contrat partenaire_relai****************************************/


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

             /* apiFactory.getAPIgeneraliserREST("demande_batiment_pr/index",'menu','getdemandeInvalideBybatiment','id_batiment_construction',item.id).then(function(result)
              {
                  vm.alldemande_batiment_pr_invalide = result.data.response;
              }); */

              apiFactory.getAPIgeneraliserREST("demande_batiment_pr/index",'menu','getalldemandeBybatiment','id_batiment_construction',item.id).then(function(result)
              {
                  vm.alldemande_batiment_pr_invalide = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });

                  vm.alldemande_batiment_pr = result.data.response;
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

/**********************************debut demande_batiment_pr****************************************/
//col table
        vm.demande_batiment_pr_column = [
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
        apiFactory.getAll("tranche_demande_batiment_pr/index").then(function(result)
        {
          vm.alltranche_demande_batiment_pr= result.data.response;
          vm.allcurenttranche_demande_batiment_pr = result.data.response;
          console.log(vm.allcurenttranche_demande_batiment_pr);
        });
          
          apiFactory.getAll("tranche_d_debut_travaux_pr/index").then(function(result)
          {
            vm.alltranche_d_debut_travaux_pr= result.data.response;
          });


        //Masque de saisi ajout
        vm.ajouterDemande_batiment_pr = function ()
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

          //var validation_derndemane_bat=0;
          apiFactory.getAPIgeneraliserREST("demande_debut_travaux_pr/index",'menu','getalldemandeByContrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
          {
              vm.alldemande_debut_travaux_pr = result.data.response.filter(function(obj)
              {
                  return obj.validation == 3;
              });

              if (vm.alldemande_debut_travaux_pr.length==vm.alltranche_d_debut_travaux_pr.length)
              {
                  if(vm.alldemande_batiment_pr.length>0)
                  {
                      var last_id_demande = Math.max.apply(Math, vm.alldemande_batiment_pr.map(function(o){ return o.id;}));
                      vm.dernierdemande = vm.alldemande_batiment_pr.filter(function(obj){return obj.id == last_id_demande;});
                      var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

                      if (vm.dernierdemande[0].validation==3)
                      {
                          if (NouvelItemDemande_batiment_pr == false)
                          {
                              vm.alldemande_batiment_pr_invalide.push(items);                        
                              vm.alldemande_batiment_pr_invalide.forEach(function(mem)
                              {
                                  if(mem.$selected==true)
                                  {
                                    vm.selectedItemDemande_batiment_pr = mem;
                                  }
                              });

                              NouvelItemDemande_batiment_pr = true ;
                          }                    
                          else
                          {
                              vm.showAlert('Ajout demande batiment','Un formulaire d\'ajout est déjà ouvert!!!');
                          }

                          vm.allcurenttranche_demande_batiment_pr = vm.alltranche_demande_batiment_pr.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
                      } 
                      else
                      {
                          vm.showAlert('Ajout demande batiment','Dernier demande en-cours!!!');
                      }
                  }
                  else
                  { 
                      if (NouvelItemDemande_batiment_pr == false)
                      {                              
                          vm.alldemande_batiment_pr_invalide.push(items);                        
                          vm.alldemande_batiment_pr_invalide.forEach(function(mem)
                          {
                              if(mem.$selected==true)
                              {
                                  vm.selectedItemDemande_batiment_pr = mem;
                              }
                          });

                          NouvelItemDemande_batiment_pr = true ;
                      }                    
                      else
                      {
                          vm.showAlert('Ajout demande batiment','Un formulaire d\'ajout est déjà ouvert!!!');
                      }

                      vm.allcurenttranche_demande_batiment_pr = vm.alltranche_demande_batiment_pr.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
                  }
              }
              else
              {
                vm.showAlert('Ajout demande batiment','La demande avant travaux incomplète ou en-cours de validation');
              }
          });         
        };

        //fonction ajout dans bdd
        function ajoutDemande_batiment_pr(demande_batiment_pr,suppression)
        {
            if (NouvelItemDemande_batiment_pr==false)
            {
                test_existanceDemande_batiment_pr (demande_batiment_pr,suppression); 
            } 
            else
            {
                insert_in_baseDemande_batiment_pr(demande_batiment_pr,suppression);
            }
        }

        //fonction de bouton d'annulation demande_batiment_pr
        vm.annulerDemande_batiment_pr = function(item)
        {
          if (NouvelItemDemande_batiment_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_batiment_pr.objet ;
            item.description   = currentItemDemande_batiment_pr.description ;
            item.ref_facture   = currentItemDemande_batiment_pr.ref_facture ;
            item.id_tranche_demande_batiment_pr = currentItemDemande_batiment_pr.id_tranche_demande_batiment_pr ;
            item.montant   = currentItemDemande_batiment_pr.montant ;
            item.cumul = currentItemDemande_batiment_pr.cumul ;
            item.anterieur = currentItemDemande_batiment_pr.anterieur;
            item.periode = currentItemDemande_batiment_pr.periode ;
            item.pourcentage = currentItemDemande_batiment_pr.pourcentage ;
            item.reste = currentItemDemande_batiment_pr.reste;
            item.date  = currentItemDemande_batiment_pr.date;
          }else
          {
            vm.alldemande_batiment_pr_invalide = vm.alldemande_batiment_pr_invalide.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_batiment_pr.id;
            });
          }

          vm.selectedItemDemande_batiment_pr = {} ;
          NouvelItemDemande_batiment_pr      = false;
          
        };

        //fonction selection item Demande_batiment_pr
        vm.selectionDemande_batiment_pr= function (item)
        {
            vm.selectedItemDemande_batiment_pr = item;
            vm.nouvelItemDemande_batiment_pr   = item;
            currentItemDemande_batiment_pr    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_pr));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_pr/index",'id_demande_batiment_pr',vm.selectedItemDemande_batiment_pr.id).then(function(result)
            {
                vm.alljustificatif_batiment_pr = result.data.response;
                console.log(vm.alljustificatif_batiment_pr);
            });

           /* apiFactory.getAPIgeneraliserREST("justificatif_facture/index",'id_demande_batiment_pr',vm.selectedItemDemande_batiment_pr.id).then(function(result)
            {
                vm.alljustificatif_facture = result.data.response;
                console.log(vm.alljustificatif_facture);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_autre_pre/index",'id_demande_batiment_pr',vm.selectedItemDemande_batiment_pr.id).then(function(result)
            {
                vm.alljustificatif_autre = result.data.response;
                console.log(vm.alljustificatif_autre);
            });*/

            vm.stepThree = true;
            vm.stepFor = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_pr', function()
        {
             if (!vm.alldemande_batiment_pr_invalide) return;
             vm.alldemande_batiment_pr_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_batiment_pr = function(item)
        {
            NouvelItemDemande_batiment_pr = false ;
            vm.selectedItemDemande_batiment_pr = item;
            currentItemDemande_batiment_pr = angular.copy(vm.selectedItemDemande_batiment_pr);
            $scope.vm.alldemande_batiment_pr_invalide.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_batiment_pr.objet ;
            item.description   = vm.selectedItemDemande_batiment_pr.description ;
            item.ref_facture   = vm.selectedItemDemande_batiment_pr.ref_facture ;
            item.id_tranche_demande_batiment_pr = vm.selectedItemDemande_batiment_pr.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_batiment_pr.montant);
            item.cumul = vm.selectedItemDemande_batiment_pr.cumul ;
            item.anterieur = vm.selectedItemDemande_batiment_pr.anterieur ;
            item.periode = vm.selectedItemDemande_batiment_pr.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_batiment_pr.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_batiment_pr.reste ;
            item.date   =new Date(vm.selectedItemDemande_batiment_pr.date) ;
        };

        //fonction bouton suppression item Demande_batiment_pr
        vm.supprimerDemande_batiment_pr = function()
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
                vm.ajoutDemande_batiment_pr(vm.selectedItemDemande_batiment_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_batiment_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_batiment_pr_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_batiment_pr.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_batiment_pr.objet )
                    || (pass[0].description   != currentItemDemande_batiment_pr.description )
                    || (pass[0].id_tranche_demande_batiment_pr != currentItemDemande_batiment_pr.id_tranche_demande_batiment_pr )
                    || (pass[0].montant   != currentItemDemande_batiment_pr.montant )
                    || (pass[0].cumul != currentItemDemande_batiment_pr.cumul )
                    || (pass[0].anterieur != currentItemDemande_batiment_pr.anterieur )
                    || (pass[0].reste != currentItemDemande_batiment_pr.reste )
                    || (pass[0].date   != currentItemDemande_batiment_pr.date )
                    || (pass[0].ref_facture   != currentItemDemande_batiment_pr.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_batiment_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_batiment_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_pr
        function insert_in_baseDemande_batiment_pr(demande_batiment_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_batiment_pr==false)
            {
                getId = vm.selectedItemDemande_batiment_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_batiment_pr.objet,
                    description:demande_batiment_pr.description,
                    ref_facture:demande_batiment_pr.ref_facture,
                    id_tranche_demande_batiment_pr: demande_batiment_pr.id_tranche_demande_batiment_pr ,
                    montant: demande_batiment_pr.montant,
                    cumul: demande_batiment_pr.cumul ,
                    anterieur: demande_batiment_pr.anterieur ,
                    reste: demande_batiment_pr.reste ,
                    date: convertionDate(new Date(demande_batiment_pr.date)),
                    id_batiment_construction: vm.selectedItemBatiment_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_pr/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_batiment_pr.filter(function(obj)
                {
                    return obj.id == demande_batiment_pr.id_tranche_demande_batiment_pr;
                });

                if (NouvelItemDemande_batiment_pr == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_batiment_pr.tranche = tran[0] ;
                        vm.selectedItemDemande_batiment_pr.periode = tran[0].periode ;
                        vm.selectedItemDemande_batiment_pr.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_batiment_pr.$selected  = false;
                        vm.selectedItemDemande_batiment_pr.$edit      = false;
                        vm.selectedItemDemande_batiment_pr ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_batiment_pr_invalide = vm.alldemande_batiment_pr_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_pr.id;
                      });
                    }
                    
                }
                else
                {
                  demande_batiment_pr.tranche = tran[0] ;
                  demande_batiment_pr.periode = tran[0].periode ;
                  demande_batiment_pr.pourcentage = tran[0].pourcentage ;

                  demande_batiment_pr.id  =   String(data.response);              
                  NouvelItemDemande_batiment_pr=false;
            }
              demande_batiment_pr.$selected = false;
              demande_batiment_pr.$edit = false;
              vm.selectedItemDemande_batiment_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = (parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat) * vm.allcurenttranche_demande_batiment_pr[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_batiment_pr_invalide.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat) - cumul;

          item.periode = vm.allcurenttranche_demande_batiment_pr[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_batiment_pr[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_batiment_pr****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_batiment_pr_column = [
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
          vm.selectedItemJustificatif_batiment_pr.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_batiment_pr.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_batiment_pr = function ()
        { 
          if (NouvelItemJustificatif_batiment_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_batiment_pr.push(items);
            vm.alljustificatif_batiment_pr.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_batiment_pr = mem;
              }
            });

            NouvelItemJustificatif_batiment_pr = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_batiment_pr','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_batiment_pr(justificatif_batiment_pr,suppression)
        {
            if (NouvelItemJustificatif_batiment_pr==false)
            {
                test_existanceJustificatif_batiment_pr (justificatif_batiment_pr,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_batiment_pr(justificatif_batiment_pr,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_batiment_pr
        vm.annulerJustificatif_batiment_pr = function(item)
        {
          if (NouvelItemJustificatif_batiment_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_batiment_pr.description ;
            item.fichier   = currentItemJustificatif_batiment_pr.fichier ;
          }else
          {
            vm.alljustificatif_batiment_pr = vm.alljustificatif_batiment_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_batiment_pr.id;
            });
          }

          vm.selectedItemJustificatif_batiment_pr = {} ;
          NouvelItemJustificatif_batiment_pr      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_batiment_pr= function (item)
        {
            vm.selectedItemJustificatif_batiment_pr = item;
            vm.nouvelItemJustificatif_batiment_pr   = item;
            currentItemJustificatif_batiment_pr    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_batiment_pr)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_batiment_pr', function()
        {
             if (!vm.alljustificatif_batiment_pr) return;
             vm.alljustificatif_batiment_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_batiment_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_batiment_pr = function(item)
        {
            NouvelItemJustificatif_batiment_pr = false ;
            vm.selectedItemJustificatif_batiment_pr = item;
            currentItemJustificatif_batiment_pr = angular.copy(vm.selectedItemJustificatif_batiment_pr);
            $scope.vm.alljustificatif_batiment_pr.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_batiment_pr.description ;
            item.fichier   = vm.selectedItemJustificatif_batiment_pr.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_batiment_pr
        vm.supprimerJustificatif_batiment_pr = function()
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
                vm.ajoutJustificatif_batiment_pr(vm.selectedItemJustificatif_batiment_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_batiment_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_batiment_pr.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_batiment_pr.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_batiment_pr.description )
                    ||(just[0].fichier   != currentItemJustificatif_batiment_pr.fichier ))                   
                      { 
                         insert_in_baseJustificatif_batiment_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_batiment_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_batiment_pr
        function insert_in_baseJustificatif_batiment_pr(justificatif_batiment_pr,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_batiment_pr==false)
            {
                getId = vm.selectedItemJustificatif_batiment_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_batiment_pr.description,
                    fichier: justificatif_batiment_pr.fichier,
                    id_demande_batiment_pr: vm.selectedItemDemande_batiment_pr.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_batiment_pr/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_batiment_pr == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_batiment_pr/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_batiment_pr.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemContrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    justificatif_batiment_pr.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_batiment_pr.description,
                                                      fichier: justificatif_batiment_pr.fichier,
                                                      id_demande_batiment_pr: vm.selectedItemDemande_batiment_pr.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_batiment_pr/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_batiment_pr.$selected = false;
                                          justificatif_batiment_pr.$edit = false;
                                          vm.selectedItemJustificatif_batiment_pr = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_batiment_pr.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_batiment_pr.description,
                                        fichier: justificatif_batiment_pr.fichier,
                                        id_demande_batiment_pr: vm.selectedItemDemande_batiment_pr.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_batiment_pr/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_batiment_pr.$selected = false;
                                      justificatif_batiment_pr.$edit = false;
                                      vm.selectedItemJustificatif_batiment_pr = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_batiment_pr.$selected  = false;
                        vm.selectedItemJustificatif_batiment_pr.$edit      = false;
                        vm.selectedItemJustificatif_batiment_pr ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_batiment_pr = vm.alljustificatif_batiment_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_batiment_pr.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_batiment_pr.fichier;
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
                  justificatif_batiment_pr.id  =   String(data.response);              
                  NouvelItemJustificatif_batiment_pr = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_batiment_pr/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemContrat_partenaire_relai.ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              justificatif_batiment_pr.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_batiment_pr.description,
                                                fichier: justificatif_batiment_pr.fichier,
                                                id_demande_batiment_pr: vm.selectedItemDemande_batiment_pr.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_batiment_pr/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_batiment_pr.$selected = false;
                                    justificatif_batiment_pr.$edit = false;
                                    vm.selectedItemJustificatif_batiment_pr = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_batiment_pr.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_batiment_pr.description,
                                  fichier: justificatif_batiment_pr.fichier,
                                  id_demande_batiment_pr: vm.selectedItemDemande_batiment_pr.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_batiment_pr/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_batiment_pr.$selected = false;
                                justificatif_batiment_pr.$edit = false;
                                vm.selectedItemJustificatif_batiment_pr = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_batiment_pr.$selected = false;
              justificatif_batiment_pr.$edit = false;
              vm.selectedItemJustificatif_batiment_pr = {};
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
