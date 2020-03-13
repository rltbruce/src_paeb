(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.demande_paiement_pr.demande_mobilier_pr')
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
        .controller('Demande_mobilier_prController', Demande_mobilier_prController);
    /** @ngInject */
    function Demande_mobilier_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_partenaire_relai = {};
        vm.allcontrat_partenaire_relai = [];

         vm.selectedItemmobilier_construction = {};
        vm.allmobilier_construction  = [];

        vm.selectedItemmobilier_construction = {};
        vm.allmobilier_construction  = [];

        vm.ajoutDemande_mobilier_pr = ajoutDemande_mobilier_pr;
        var NouvelItemDemande_mobilier_pr=false;
        var currentItemDemande_mobilier_pr;
        vm.selectedItemDemande_mobilier_pr = {};
        vm.alldemande_mobilier_pr_invalide = [];

        vm.alldemande_mobilier_pr = [];

        vm.ajoutJustificatif_mobilier_pr = ajoutJustificatif_mobilier_pr;
        var NouvelItemJustificatif_mobilier_pr=false;
        var currentItemJustificatif_mobilier_pr;
        vm.selectedItemJustificatif_mobilier_pr = {} ;
        vm.alljustificatif_mobilier_pr = [] ;

       

        vm.allcurenttranche_demande_mobilier_pr = [];
        vm.alltranche_demande_mobilier_pr = [];
        vm.dernierdemande = [];

        vm.alltranche_d_debut_travaux_pr = [];
        vm.alldemande_debut_travaux_pr = [];

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
        {titre:"Partenaires relais"
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
              
              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'menu','getmobilierByContrat_partenaire_relai','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  console.log(vm.allmobilier_construction);
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


/**********************************fin mobilier construction****************************************/       
//col table
       vm.mobilier_construction_column = [        
        {
          titre:"mobilier"
        },
        {
          titre:"Nombre mobilier"
        },
        {
          titre:"Cout unitaire"
        }];

//fonction selection item mobilier construction cisco/feffi
        vm.selectionmobilier_construction = function (item)
        {
            vm.selectedItemmobilier_construction = item;
           
            if (vm.selectedItemmobilier_construction.id!=0)
            {  

              apiFactory.getAPIgeneraliserREST("demande_mobilier_pr/index",'menu','getalldemandeBymobilier','id_mobilier_construction',item.id).then(function(result)
              {
                  vm.alldemande_mobilier_pr_invalide = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });

                  vm.alldemande_mobilier_pr = result.data.response;
              });           
              vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;
              vm.stepFive = false;
              vm.stepSixe = false;
            }           

        };
        $scope.$watch('vm.selectedItemmobilier_construction', function()
        {
             if (!vm.allmobilier_construction) return;
             vm.allmobilier_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemmobilier_construction.$selected = true;
        });           

/**********************************fin mobilier construction****************************************/

/**********************************debut demande_mobilier_pr****************************************/
//col table
        vm.demande_mobilier_pr_column = [
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
        apiFactory.getAll("tranche_demande_mobilier_pr/index").then(function(result)
        {
          vm.alltranche_demande_mobilier_pr= result.data.response;
          vm.allcurenttranche_demande_mobilier_pr = result.data.response;
          console.log(vm.allcurenttranche_demande_mobilier_pr);
        });

        apiFactory.getAll("tranche_d_debut_travaux_pr/index").then(function(result)
        {
            vm.alltranche_d_debut_travaux_pr= result.data.response;
        });

        //Masque de saisi ajout
        vm.ajouterDemande_mobilier_pr = function ()
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
                  if(vm.alldemande_mobilier_pr.length>0)
                  {
                      var last_id_demande = Math.max.apply(Math, vm.alldemande_mobilier_pr.map(function(o){ return o.id;}));
                      vm.dernierdemande = vm.alldemande_mobilier_pr.filter(function(obj){return obj.id == last_id_demande;});
                      var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

                      if (vm.dernierdemande[0].validation==3)
                      {
                          if (NouvelItemDemande_mobilier_pr == false)
                          {
                              vm.alldemande_mobilier_pr_invalide.push(items);                        
                              vm.alldemande_mobilier_pr_invalide.forEach(function(mem)
                              {
                                  if(mem.$selected==true)
                                  {
                                    vm.selectedItemDemande_mobilier_pr = mem;
                                  }
                              });

                              NouvelItemDemande_mobilier_pr = true ;
                          }                    
                          else
                          {
                              vm.showAlert('Ajout demande mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
                          }

                          vm.allcurenttranche_demande_mobilier_pr = vm.alltranche_demande_mobilier_pr.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
                      } 
                      else
                      {
                          vm.showAlert('Ajout demande mobilier','Dernier demande en-cours!!!');
                      }
                  }
                  else
                  { 
                      if (NouvelItemDemande_mobilier_pr == false)
                      {                              
                          vm.alldemande_mobilier_pr_invalide.push(items);                        
                          vm.alldemande_mobilier_pr_invalide.forEach(function(mem)
                          {
                              if(mem.$selected==true)
                              {
                                  vm.selectedItemDemande_mobilier_pr = mem;
                              }
                          });

                          NouvelItemDemande_mobilier_pr = true ;
                      }                    
                      else
                      {
                          vm.showAlert('Ajout demande mobilier','Un formulaire d\'ajout est déjà ouvert!!!');
                      }

                      vm.allcurenttranche_demande_mobilier_pr = vm.alltranche_demande_mobilier_pr.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
                  }
              }
              else
              {
                vm.showAlert('Ajout demande mobilier','La demande avant travaux incomplète ou en-cours de validation');
              }
          });                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_mobilier_pr(demande_mobilier_pr,suppression)
        {
            if (NouvelItemDemande_mobilier_pr==false)
            {
                test_existanceDemande_mobilier_pr (demande_mobilier_pr,suppression); 
            } 
            else
            {
                insert_in_baseDemande_mobilier_pr(demande_mobilier_pr,suppression);
            }
        }

        //fonction de bouton d'annulation demande_mobilier_pr
        vm.annulerDemande_mobilier_pr = function(item)
        {
          if (NouvelItemDemande_mobilier_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_mobilier_pr.objet ;
            item.description   = currentItemDemande_mobilier_pr.description ;
            item.ref_facture   = currentItemDemande_mobilier_pr.ref_facture ;
            item.id_tranche_demande_mobilier_pr = currentItemDemande_mobilier_pr.id_tranche_demande_mobilier_pr ;
            item.montant   = currentItemDemande_mobilier_pr.montant ;
            item.cumul = currentItemDemande_mobilier_pr.cumul ;
            item.anterieur = currentItemDemande_mobilier_pr.anterieur;
            item.periode = currentItemDemande_mobilier_pr.periode ;
            item.pourcentage = currentItemDemande_mobilier_pr.pourcentage ;
            item.reste = currentItemDemande_mobilier_pr.reste;
            item.date  = currentItemDemande_mobilier_pr.date;
          }else
          {
            vm.alldemande_mobilier_pr_invalide = vm.alldemande_mobilier_pr_invalide.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_mobilier_pr.id;
            });
          }

          vm.selectedItemDemande_mobilier_pr = {} ;
          NouvelItemDemande_mobilier_pr      = false;
          
        };

        //fonction selection item Demande_mobilier_pr
        vm.selectionDemande_mobilier_pr= function (item)
        {
            vm.selectedItemDemande_mobilier_pr = item;
            vm.nouvelItemDemande_mobilier_pr   = item;
            currentItemDemande_mobilier_pr    = JSON.parse(JSON.stringify(vm.selectedItemDemande_mobilier_pr));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_mobilier_pr/index",'id_demande_mobilier_pr',vm.selectedItemDemande_mobilier_pr.id).then(function(result)
            {
                vm.alljustificatif_mobilier_pr = result.data.response;
                console.log(vm.alljustificatif_mobilier_pr);
            });

            vm.stepThree = true;
            vm.stepFor = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_mobilier_pr', function()
        {
             if (!vm.alldemande_mobilier_pr_invalide) return;
             vm.alldemande_mobilier_pr_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_mobilier_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_mobilier_pr = function(item)
        {
            NouvelItemDemande_mobilier_pr = false ;
            vm.selectedItemDemande_mobilier_pr = item;
            currentItemDemande_mobilier_pr = angular.copy(vm.selectedItemDemande_mobilier_pr);
            $scope.vm.alldemande_mobilier_pr_invalide.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_mobilier_pr.objet ;
            item.description   = vm.selectedItemDemande_mobilier_pr.description ;
            item.ref_facture   = vm.selectedItemDemande_mobilier_pr.ref_facture ;
            item.id_tranche_demande_mobilier_pr = vm.selectedItemDemande_mobilier_pr.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_mobilier_pr.montant);
            item.cumul = vm.selectedItemDemande_mobilier_pr.cumul ;
            item.anterieur = vm.selectedItemDemande_mobilier_pr.anterieur ;
            item.periode = vm.selectedItemDemande_mobilier_pr.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_mobilier_pr.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_mobilier_pr.reste ;
            item.date   =new Date(vm.selectedItemDemande_mobilier_pr.date) ;
        };

        //fonction bouton suppression item Demande_mobilier_pr
        vm.supprimerDemande_mobilier_pr = function()
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
                vm.ajoutDemande_mobilier_pr(vm.selectedItemDemande_mobilier_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_mobilier_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_mobilier_pr_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_mobilier_pr.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_mobilier_pr.objet )
                    || (pass[0].description   != currentItemDemande_mobilier_pr.description )
                    || (pass[0].id_tranche_demande_mobilier_pr != currentItemDemande_mobilier_pr.id_tranche_demande_mobilier_pr )
                    || (pass[0].montant   != currentItemDemande_mobilier_pr.montant )
                    || (pass[0].cumul != currentItemDemande_mobilier_pr.cumul )
                    || (pass[0].anterieur != currentItemDemande_mobilier_pr.anterieur )
                    || (pass[0].reste != currentItemDemande_mobilier_pr.reste )
                    || (pass[0].date   != currentItemDemande_mobilier_pr.date )
                    || (pass[0].ref_facture   != currentItemDemande_mobilier_pr.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_mobilier_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_mobilier_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_mobilier_pr
        function insert_in_baseDemande_mobilier_pr(demande_mobilier_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_mobilier_pr==false)
            {
                getId = vm.selectedItemDemande_mobilier_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_mobilier_pr.objet,
                    description:demande_mobilier_pr.description,
                    ref_facture:demande_mobilier_pr.ref_facture,
                    id_tranche_demande_mobilier_pr: demande_mobilier_pr.id_tranche_demande_mobilier_pr ,
                    montant: demande_mobilier_pr.montant,
                    cumul: demande_mobilier_pr.cumul ,
                    anterieur: demande_mobilier_pr.anterieur ,
                    reste: demande_mobilier_pr.reste ,
                    date: convertionDate(new Date(demande_mobilier_pr.date)),
                    id_mobilier_construction: vm.selectedItemmobilier_construction.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_mobilier_pr/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_demande_mobilier_pr.filter(function(obj)
                {
                    return obj.id == demande_mobilier_pr.id_tranche_demande_mobilier_pr;
                });

                if (NouvelItemDemande_mobilier_pr == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_mobilier_pr.tranche = tran[0] ;
                        vm.selectedItemDemande_mobilier_pr.periode = tran[0].periode ;
                        vm.selectedItemDemande_mobilier_pr.pourcentage = tran[0].pourcentage ;
                        
                        vm.selectedItemDemande_mobilier_pr.$selected  = false;
                        vm.selectedItemDemande_mobilier_pr.$edit      = false;
                        vm.selectedItemDemande_mobilier_pr ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_mobilier_pr_invalide = vm.alldemande_mobilier_pr_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_mobilier_pr.id;
                      });
                    }
                    
                }
                else
                {
                  demande_mobilier_pr.tranche = tran[0] ;
                  demande_mobilier_pr.periode = tran[0].periode ;
                  demande_mobilier_pr.pourcentage = tran[0].pourcentage ;

                  demande_mobilier_pr.id  =   String(data.response);              
                  NouvelItemDemande_mobilier_pr=false;
            }
              demande_mobilier_pr.$selected = false;
              demande_mobilier_pr.$edit = false;
              vm.selectedItemDemande_mobilier_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          var montant = (parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat) * vm.allcurenttranche_demande_mobilier_pr[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_mobilier_pr_invalide.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat) - cumul;

          item.periode = vm.allcurenttranche_demande_mobilier_pr[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_mobilier_pr[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
/**********************************fin demande_mobilier_pr****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_mobilier_pr_column = [
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
          vm.selectedItemJustificatif_mobilier_pr.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_mobilier_pr.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_mobilier_pr = function ()
        { 
          if (NouvelItemJustificatif_mobilier_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_mobilier_pr.push(items);
            vm.alljustificatif_mobilier_pr.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_mobilier_pr = mem;
              }
            });

            NouvelItemJustificatif_mobilier_pr = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_mobilier_pr','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_mobilier_pr(justificatif_mobilier_pr,suppression)
        {
            if (NouvelItemJustificatif_mobilier_pr==false)
            {
                test_existanceJustificatif_mobilier_pr (justificatif_mobilier_pr,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_mobilier_pr(justificatif_mobilier_pr,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_mobilier_pr
        vm.annulerJustificatif_mobilier_pr = function(item)
        {
          if (NouvelItemJustificatif_mobilier_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_mobilier_pr.description ;
            item.fichier   = currentItemJustificatif_mobilier_pr.fichier ;
          }else
          {
            vm.alljustificatif_mobilier_pr = vm.alljustificatif_mobilier_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_mobilier_pr.id;
            });
          }

          vm.selectedItemJustificatif_mobilier_pr = {} ;
          NouvelItemJustificatif_mobilier_pr      = false;
          
        };

        //fonction selection item justificatif mobilier
        vm.selectionJustificatif_mobilier_pr= function (item)
        {
            vm.selectedItemJustificatif_mobilier_pr = item;
            vm.nouvelItemJustificatif_mobilier_pr   = item;
            currentItemJustificatif_mobilier_pr    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_mobilier_pr)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_mobilier_pr', function()
        {
             if (!vm.alljustificatif_mobilier_pr) return;
             vm.alljustificatif_mobilier_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_mobilier_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_mobilier_pr = function(item)
        {
            NouvelItemJustificatif_mobilier_pr = false ;
            vm.selectedItemJustificatif_mobilier_pr = item;
            currentItemJustificatif_mobilier_pr = angular.copy(vm.selectedItemJustificatif_mobilier_pr);
            $scope.vm.alljustificatif_mobilier_pr.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_mobilier_pr.description ;
            item.fichier   = vm.selectedItemJustificatif_mobilier_pr.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_mobilier_pr
        vm.supprimerJustificatif_mobilier_pr = function()
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
                vm.ajoutJustificatif_mobilier_pr(vm.selectedItemJustificatif_mobilier_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_mobilier_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_mobilier_pr.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_mobilier_pr.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_mobilier_pr.description )
                    ||(just[0].fichier   != currentItemJustificatif_mobilier_pr.fichier ))                   
                      { 
                         insert_in_baseJustificatif_mobilier_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_mobilier_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_mobilier_pr
        function insert_in_baseJustificatif_mobilier_pr(justificatif_mobilier_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_mobilier_pr==false)
            {
                getId = vm.selectedItemJustificatif_mobilier_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_mobilier_pr.description,
                    fichier: justificatif_mobilier_pr.fichier,
                    id_demande_mobilier_pr: vm.selectedItemDemande_mobilier_pr.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_mobilier_pr/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_mobilier_pr == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_mobilier_pr/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_mobilier_pr.id
                                              
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
                                    justificatif_mobilier_pr.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_mobilier_pr.description,
                                                      fichier: justificatif_mobilier_pr.fichier,
                                                      id_demande_mobilier_pr: vm.selectedItemDemande_mobilier_pr.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_mobilier_pr/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_mobilier_pr.$selected = false;
                                          justificatif_mobilier_pr.$edit = false;
                                          vm.selectedItemJustificatif_mobilier_pr = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_mobilier_pr.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_mobilier_pr.description,
                                        fichier: justificatif_mobilier_pr.fichier,
                                        id_demande_mobilier_pr: vm.selectedItemDemande_mobilier_pr.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_mobilier_pr/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_mobilier_pr.$selected = false;
                                      justificatif_mobilier_pr.$edit = false;
                                      vm.selectedItemJustificatif_mobilier_pr = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_mobilier_pr.$selected  = false;
                        vm.selectedItemJustificatif_mobilier_pr.$edit      = false;
                        vm.selectedItemJustificatif_mobilier_pr ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_mobilier_pr = vm.alljustificatif_mobilier_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_mobilier_pr.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_mobilier_pr.fichier;
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
                  justificatif_mobilier_pr.id  =   String(data.response);              
                  NouvelItemJustificatif_mobilier_pr = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_mobilier_pr/';
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
                              justificatif_mobilier_pr.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_mobilier_pr.description,
                                                fichier: justificatif_mobilier_pr.fichier,
                                                id_demande_mobilier_pr: vm.selectedItemDemande_mobilier_pr.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_mobilier_pr/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_mobilier_pr.$selected = false;
                                    justificatif_mobilier_pr.$edit = false;
                                    vm.selectedItemJustificatif_mobilier_pr = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_mobilier_pr.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_mobilier_pr.description,
                                  fichier: justificatif_mobilier_pr.fichier,
                                  id_demande_mobilier_pr: vm.selectedItemDemande_mobilier_pr.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_mobilier_pr/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_mobilier_pr.$selected = false;
                                justificatif_mobilier_pr.$edit = false;
                                vm.selectedItemJustificatif_mobilier_pr = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_mobilier_pr.$selected = false;
              justificatif_mobilier_pr.$edit = false;
              vm.selectedItemJustificatif_mobilier_pr = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif mobilier****************************************/



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
