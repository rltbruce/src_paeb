(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.demande_paiement_pr.demande_fin_travaux_pr')
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
        .controller('Demande_fin_travaux_prController', Demande_fin_travaux_prController);
    /** @ngInject */
    function Demande_fin_travaux_prController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_partenaire_relai = {};
        vm.allcontrat_partenaire_relai = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.ajoutDemande_fin_travaux_pr = ajoutDemande_fin_travaux_pr;
        var NouvelItemDemande_fin_travaux_pr=false;
        var currentItemDemande_fin_travaux_pr;
        vm.selectedItemDemande_fin_travaux_pr = {};
        vm.alldemande_fin_travaux_pr_invalide = [];

        vm.alldemande_fin_travaux_pr = [];

        vm.ajoutJustificatif_fin_travaux_pr = ajoutJustificatif_fin_travaux_pr;
        var NouvelItemJustificatif_fin_travaux_pr=false;
        var currentItemJustificatif_fin_travaux_pr;
        vm.selectedItemJustificatif_fin_travaux_pr = {} ;
        vm.alljustificatif_fin_travaux_pr = [] ;

       

        vm.allcurenttranche_d_fin_travaux_pr = [];
        vm.alltranche_d_fin_travaux_pr = [];
        vm.dernierdemande = [];

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

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
              
              apiFactory.getAPIgeneraliserREST("demande_fin_travaux_pr/index",'menu','getalldemandeByContrat','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  vm.alldemande_fin_travaux_pr_invalide = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });
                  vm.alldemande_fin_travaux_pr = result.data.response;
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

/**********************************fin contrat bureau_etude****************************************/


/**********************************fin demande_fin_travaux_pr****************************************/
//col table
        vm.demande_fin_travaux_pr_column = [
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

        //recuperation donnée tranche deblocage pr
        apiFactory.getAll("tranche_d_fin_travaux_pr/index").then(function(result)
        {
          vm.alltranche_d_fin_travaux_pr= result.data.response;
          vm.allcurenttranche_d_fin_travaux_pr = result.data.response;
          //console.log(vm.allcurenttranche_d_fin_travaux_pr);
        });                        

        //Masque de saisi ajout
        vm.ajouterDemande_fin_travaux_pr = function ()
        {      var items = {
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
              apiFactory.getAPIgeneraliserREST("demande_fin_travaux_pr/index",'menu','summePourcentageCurrent','id_contrat_partenaire_relai',vm.selectedItemContrat_partenaire_relai.id).then(function(result)
              {
                  var pourcentagecurrenttotal = result.data.response[0].pourcentage_total;
                  console.log(pourcentagecurrenttotal);
              
                  if (pourcentagecurrenttotal == 100)
                  {
                      if(vm.alldemande_fin_travaux_pr.length>0)
                      {
                          var last_id_demande = Math.max.apply(Math, vm.alldemande_fin_travaux_pr.map(function(o){ return o.id;}));
                          vm.dernierdemande = vm.alldemande_fin_travaux_pr.filter(function(obj){return obj.id == last_id_demande;});
                          var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

                          if (vm.dernierdemande[0].validation==3)
                          {
                              if (NouvelItemDemande_fin_travaux_pr == false)
                              {
                                  vm.alldemande_fin_travaux_pr_invalide.push(items);                        
                                  vm.alldemande_fin_travaux_pr_invalide.forEach(function(mem)
                                  {
                                      if(mem.$selected==true)
                                      {
                                        vm.selectedItemDemande_fin_travaux_pr = mem;
                                      }
                                  });

                                  NouvelItemDemande_fin_travaux_pr = true ;
                              }                    
                              else
                              {
                                  vm.showAlert('Ajout demande fin_travaux','Un formulaire d\'ajout est déjà ouvert!!!');
                              }

                              vm.allcurenttranche_d_fin_travaux_pr = vm.alltranche_d_fin_travaux_pr.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
                          } 
                          else
                          {
                              vm.showAlert('Ajout demande fin_travaux','Dernier demande en-cours!!!');
                          }
                      }
                      else
                      { 
                          if (NouvelItemDemande_fin_travaux_pr == false)
                          {                              
                              vm.alldemande_fin_travaux_pr_invalide.push(items);                        
                              vm.alldemande_fin_travaux_pr_invalide.forEach(function(mem)
                              {
                                  if(mem.$selected==true)
                                  {
                                      vm.selectedItemDemande_fin_travaux_pr = mem;
                                  }
                              });

                              NouvelItemDemande_fin_travaux_pr = true ;
                          }                    
                          else
                          {
                              vm.showAlert('Ajout demande fin_travaux','Un formulaire d\'ajout est déjà ouvert!!!');
                          }

                          vm.allcurenttranche_d_fin_travaux_pr = vm.alltranche_d_fin_travaux_pr.filter(function(obj){return obj.code == 'tranche 1';});
                        //vm.dernierdemande = [];
                      }
                  }
                  else
                  {
                    vm.showAlert('Ajout demande fin travaux',' Les demandes durant les travaux ne sont pas achevées !!!');
                  }

                  
              });              
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression)
        {
            if (NouvelItemDemande_fin_travaux_pr==false)
            {
                test_existanceDemande_fin_travaux_pr (demande_fin_travaux_pr,suppression); 
            } 
            else
            {
                insert_in_baseDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression);
            }
        }

        //fonction de bouton d'annulation demande_fin_travaux_pr
        vm.annulerDemande_fin_travaux_pr = function(item)
        {
          if (NouvelItemDemande_fin_travaux_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_fin_travaux_pr.objet ;
            item.description   = currentItemDemande_fin_travaux_pr.description ;
            item.ref_facture   = currentItemDemande_fin_travaux_pr.ref_facture ;
            item.id_tranche_d_fin_travaux_pr = currentItemDemande_fin_travaux_pr.id_tranche_d_fin_travaux_pr ;
            item.montant   = currentItemDemande_fin_travaux_pr.montant ;
            item.cumul = currentItemDemande_fin_travaux_pr.cumul ;
            item.anterieur = currentItemDemande_fin_travaux_pr.anterieur;
            item.periode = currentItemDemande_fin_travaux_pr.periode ;
            item.pourcentage = currentItemDemande_fin_travaux_pr.pourcentage ;
            item.reste = currentItemDemande_fin_travaux_pr.reste;
            item.date  = currentItemDemande_fin_travaux_pr.date;
          }else
          {
            vm.alldemande_fin_travaux_pr_invalide = vm.alldemande_fin_travaux_pr_invalide.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_fin_travaux_pr.id;
            });
          }

          vm.selectedItemDemande_fin_travaux_pr = {} ;
          NouvelItemDemande_fin_travaux_pr      = false;
          
        };

        //fonction selection item Demande_fin_travaux_pr
        vm.selectionDemande_fin_travaux_pr= function (item)
        {
            vm.selectedItemDemande_fin_travaux_pr = item;
            vm.nouvelItemDemande_fin_travaux_pr   = item;
            currentItemDemande_fin_travaux_pr    = JSON.parse(JSON.stringify(vm.selectedItemDemande_fin_travaux_pr));
           if(item.id!=0)
           {
             // if (item.$selected==false)
             // {
                  apiFactory.getAPIgeneraliserREST("justificatif_fin_travaux_pr/index",'id_demande_fin_travaux_pr',vm.selectedItemDemande_fin_travaux_pr.id).then(function(result)
                {
                    vm.alljustificatif_fin_travaux_pr = result.data.response;
                    console.log(vm.alljustificatif_fin_travaux_pr);
                });
             // }
              

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_fin_travaux_pr', function()
        {
             if (!vm.alldemande_fin_travaux_pr_invalide) return;
             vm.alldemande_fin_travaux_pr_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_fin_travaux_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_fin_travaux_pr = function(item)
        {
            NouvelItemDemande_fin_travaux_pr = false ;
            vm.selectedItemDemande_fin_travaux_pr = item;
            currentItemDemande_fin_travaux_pr = angular.copy(vm.selectedItemDemande_fin_travaux_pr);
            $scope.vm.alldemande_fin_travaux_pr_invalide.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_fin_travaux_pr.objet ;
            item.description   = vm.selectedItemDemande_fin_travaux_pr.description ;
            item.ref_facture   = vm.selectedItemDemande_fin_travaux_pr.ref_facture ;
            item.id_tranche_d_fin_travaux_pr = vm.selectedItemDemande_fin_travaux_pr.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_fin_travaux_pr.montant);
            item.cumul = vm.selectedItemDemande_fin_travaux_pr.cumul ;
            item.anterieur = vm.selectedItemDemande_fin_travaux_pr.anterieur ;
            item.periode = vm.selectedItemDemande_fin_travaux_pr.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_fin_travaux_pr.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_fin_travaux_pr.reste ;
            item.date   =new Date(vm.selectedItemDemande_fin_travaux_pr.date) ;
        };

        //fonction bouton suppression item Demande_fin_travaux_pr
        vm.supprimerDemande_fin_travaux_pr = function()
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
                vm.ajoutDemande_fin_travaux_pr(vm.selectedItemDemande_fin_travaux_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_fin_travaux_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_fin_travaux_pr_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_fin_travaux_pr.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_fin_travaux_pr.objet )
                    || (pass[0].description   != currentItemDemande_fin_travaux_pr.description )
                    || (pass[0].id_tranche_d_fin_travaux_pr != currentItemDemande_fin_travaux_pr.id_tranche_d_fin_travaux_pr )
                    || (pass[0].montant   != currentItemDemande_fin_travaux_pr.montant )
                    || (pass[0].cumul != currentItemDemande_fin_travaux_pr.cumul )
                    || (pass[0].anterieur != currentItemDemande_fin_travaux_pr.anterieur )
                    || (pass[0].reste != currentItemDemande_fin_travaux_pr.reste )
                    || (pass[0].date   != currentItemDemande_fin_travaux_pr.date )
                    || (pass[0].ref_facture   != currentItemDemande_fin_travaux_pr.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_fin_travaux_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_fin_travaux_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_fin_travaux_pr
        function insert_in_baseDemande_fin_travaux_pr(demande_fin_travaux_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_fin_travaux_pr==false)
            {
                getId = vm.selectedItemDemande_fin_travaux_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_fin_travaux_pr.objet,
                    description:demande_fin_travaux_pr.description,
                    ref_facture:demande_fin_travaux_pr.ref_facture,
                    id_tranche_d_fin_travaux_pr: demande_fin_travaux_pr.id_tranche_d_fin_travaux_pr ,
                    montant: demande_fin_travaux_pr.montant,
                    cumul: demande_fin_travaux_pr.cumul ,
                    anterieur: demande_fin_travaux_pr.anterieur ,
                    reste: demande_fin_travaux_pr.reste ,
                    date: convertionDate(new Date(demande_fin_travaux_pr.date)),
                    id_contrat_partenaire_relai: vm.selectedItemContrat_partenaire_relai.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_fin_travaux_pr/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_d_fin_travaux_pr.filter(function(obj)
                {
                    return obj.id == demande_fin_travaux_pr.id_tranche_d_fin_travaux_pr;
                });

                if (NouvelItemDemande_fin_travaux_pr == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        /*vm.selectedItemDemande_fin_travaux_pr.objet   = demande_fin_travaux_pr.objet ;
                        vm.selectedItemDemande_fin_travaux_pr.description   = demande_fin_travaux_pr.description ;
                        vm.selectedItemDemande_fin_travaux_pr.ref_facture   = demande_fin_travaux_pr.ref_facture ;
                        vm.selectedItemDemande_fin_travaux_pr.montant   = demande_fin_travaux_pr.montant ;*/
                        vm.selectedItemDemande_fin_travaux_pr.tranche = tran[0] ;
                        /*vm.selectedItemDemande_fin_travaux_pr.cumul = demande_fin_travaux_pr.cumul ;
                        vm.selectedItemDemande_fin_travaux_pr.anterieur = demande_fin_travaux_pr.anterieur ;*/
                        vm.selectedItemDemande_fin_travaux_pr.periode = tran[0].periode ;
                        vm.selectedItemDemande_fin_travaux_pr.pourcentage = tran[0].pourcentage ;
                        /*vm.selectedItemDemande_fin_travaux_pr.reste = demande_fin_travaux_pr.reste ;
                        vm.selectedItemDemande_fin_travaux_pr.date   = demande_fin_travaux_pr.date ;*/
                        
                        vm.selectedItemDemande_fin_travaux_pr.$selected  = false;
                        vm.selectedItemDemande_fin_travaux_pr.$edit      = false;
                        vm.selectedItemDemande_fin_travaux_pr ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_fin_travaux_pr_invalide = vm.alldemande_fin_travaux_pr_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_fin_travaux_pr.id;
                      });
                    }
                    
                }
                else
                {
                  /*demande_fin_travaux_pr.objet   = demande_fin_travaux_pr.objet ;
                  demande_fin_travaux_pr.description   = demande_fin_travaux_pr.description ;
                  demande_fin_travaux_pr.ref_facture   = demande_fin_travaux_pr.ref_facture ;
                  demande_fin_travaux_pr.montant   = demande_fin_travaux_pr.montant ;*/
                  demande_fin_travaux_pr.tranche = tran[0] ;
                  /*demande_fin_travaux_pr.cumul = demande_fin_travaux_pr.cumul ;
                  demande_fin_travaux_pr.anterieur = demande_fin_travaux_pr.anterieur ;*/
                  demande_fin_travaux_pr.periode = tran[0].periode ;
                  demande_fin_travaux_pr.pourcentage = tran[0].pourcentage ;
                  /*demande_fin_travaux_pr.reste = demande_fin_travaux_pr.reste ;
                  demande_fin_travaux_pr.date   = demande_fin_travaux_pr.date ;*/

                  demande_fin_travaux_pr.id  =   String(data.response);              
                  NouvelItemDemande_fin_travaux_pr=false;
            }
              demande_fin_travaux_pr.$selected = false;
              demande_fin_travaux_pr.$edit = false;
              vm.selectedItemDemande_fin_travaux_pr = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          var nbr_t = [];
          var reste = 0;
          var anterieur = 0;

            var montant = (parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat) * (vm.allcurenttranche_d_fin_travaux_pr[0].pourcentage))/100;
            var cumul = montant;

          if (vm.alldemande_fin_travaux_pr_invalide.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }
          

          reste= (parseInt(vm.selectedItemContrat_partenaire_relai.montant_contrat)) - cumul;

          item.periode = vm.allcurenttranche_d_fin_travaux_pr[0].periode;
          item.pourcentage = vm.allcurenttranche_d_fin_travaux_pr[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          console.log(item);
          console.log(vm.selectedItemContrat_partenaire_relai);
         
          //var nbr_batiment_total = vm.alldemande_fin_travaux_pr_invalide.length;
          
        }
/**********************************fin demande_fin_travaux_pr****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_fin_travaux_pr_column = [
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
          vm.selectedItemJustificatif_fin_travaux_pr.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_fin_travaux_pr.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_fin_travaux_pr = function ()
        { 
          if (NouvelItemJustificatif_fin_travaux_pr == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_fin_travaux_pr.push(items);
            vm.alljustificatif_fin_travaux_pr.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_fin_travaux_pr = mem;
              }
            });

            NouvelItemJustificatif_fin_travaux_pr = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_fin_travaux_pr','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_fin_travaux_pr(justificatif_fin_travaux_pr,suppression)
        {
            if (NouvelItemJustificatif_fin_travaux_pr==false)
            {
                test_existanceJustificatif_fin_travaux_pr (justificatif_fin_travaux_pr,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_fin_travaux_pr(justificatif_fin_travaux_pr,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_fin_travaux_pr
        vm.annulerJustificatif_fin_travaux_pr = function(item)
        {
          if (NouvelItemJustificatif_fin_travaux_pr == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_fin_travaux_pr.description ;
            item.fichier   = currentItemJustificatif_fin_travaux_pr.fichier ;
          }else
          {
            vm.alljustificatif_fin_travaux_pr = vm.alljustificatif_fin_travaux_pr.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_fin_travaux_pr.id;
            });
          }

          vm.selectedItemJustificatif_fin_travaux_pr = {} ;
          NouvelItemJustificatif_fin_travaux_pr      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_fin_travaux_pr= function (item)
        {
            vm.selectedItemJustificatif_fin_travaux_pr = item;
            vm.nouvelItemJustificatif_fin_travaux_pr   = item;
            currentItemJustificatif_fin_travaux_pr    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_fin_travaux_pr)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_fin_travaux_pr', function()
        {
             if (!vm.alljustificatif_fin_travaux_pr) return;
             vm.alljustificatif_fin_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_fin_travaux_pr.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_fin_travaux_pr = function(item)
        {
            NouvelItemJustificatif_fin_travaux_pr = false ;
            vm.selectedItemJustificatif_fin_travaux_pr = item;
            currentItemJustificatif_fin_travaux_pr = angular.copy(vm.selectedItemJustificatif_fin_travaux_pr);
            $scope.vm.alljustificatif_fin_travaux_pr.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_fin_travaux_pr.description ;
            item.fichier   = vm.selectedItemJustificatif_fin_travaux_pr.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_fin_travaux_pr
        vm.supprimerJustificatif_fin_travaux_pr = function()
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
                vm.ajoutJustificatif_fin_travaux_pr(vm.selectedItemJustificatif_fin_travaux_pr,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_fin_travaux_pr (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_fin_travaux_pr.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_fin_travaux_pr.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_fin_travaux_pr.description )
                    ||(just[0].fichier   != currentItemJustificatif_fin_travaux_pr.fichier ))                   
                      { 
                         insert_in_baseJustificatif_fin_travaux_pr(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_fin_travaux_pr(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_fin_travaux_pr
        function insert_in_baseJustificatif_fin_travaux_pr(justificatif_fin_travaux_pr,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_fin_travaux_pr==false)
            {
                getId = vm.selectedItemJustificatif_fin_travaux_pr.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_fin_travaux_pr.description,
                    fichier: justificatif_fin_travaux_pr.fichier,
                    id_demande_fin_travaux_pr: vm.selectedItemDemande_fin_travaux_pr.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_fin_travaux_pr/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_fin_travaux_pr == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_fin_travaux_pr/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_fin_travaux_pr.id
                                              
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
                                    justificatif_fin_travaux_pr.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_fin_travaux_pr.description,
                                                      fichier: justificatif_fin_travaux_pr.fichier,
                                                      id_demande_fin_travaux_pr: vm.selectedItemDemande_fin_travaux_pr.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_fin_travaux_pr/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_fin_travaux_pr.$selected = false;
                                          justificatif_fin_travaux_pr.$edit = false;
                                          vm.selectedItemJustificatif_fin_travaux_pr = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_fin_travaux_pr.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_fin_travaux_pr.description,
                                        fichier: justificatif_fin_travaux_pr.fichier,
                                        id_demande_fin_travaux_pr: vm.selectedItemDemande_fin_travaux_pr.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_fin_travaux_pr/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_fin_travaux_pr.$selected = false;
                                      justificatif_fin_travaux_pr.$edit = false;
                                      vm.selectedItemJustificatif_fin_travaux_pr = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_fin_travaux_pr.$selected  = false;
                        vm.selectedItemJustificatif_fin_travaux_pr.$edit      = false;
                        vm.selectedItemJustificatif_fin_travaux_pr ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_fin_travaux_pr = vm.alljustificatif_fin_travaux_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_fin_travaux_pr.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_fin_travaux_pr.fichier;
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
                  justificatif_fin_travaux_pr.id  =   String(data.response);              
                  NouvelItemJustificatif_fin_travaux_pr = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_fin_travaux_pr/';
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
                              justificatif_fin_travaux_pr.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_fin_travaux_pr.description,
                                                fichier: justificatif_fin_travaux_pr.fichier,
                                                id_demande_fin_travaux_pr: vm.selectedItemDemande_fin_travaux_pr.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_fin_travaux_pr/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_fin_travaux_pr.$selected = false;
                                    justificatif_fin_travaux_pr.$edit = false;
                                    vm.selectedItemJustificatif_fin_travaux_pr = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_fin_travaux_pr.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_fin_travaux_pr.description,
                                  fichier: justificatif_fin_travaux_pr.fichier,
                                  id_demande_fin_travaux_pr: vm.selectedItemDemande_fin_travaux_pr.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_fin_travaux_pr/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_fin_travaux_pr.$selected = false;
                                justificatif_fin_travaux_pr.$edit = false;
                                vm.selectedItemJustificatif_fin_travaux_pr = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_fin_travaux_pr.$selected = false;
              justificatif_fin_travaux_pr.$edit = false;
              vm.selectedItemJustificatif_fin_travaux_pr = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif batiment****************************************/



/**********************************fin pr_sousmissionnaire****************************************/
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
    function showDialog($event,items) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '<md-subheader style="background-color: rgb(245,245,245)">'+
            '<h3 mat-dialog-title  style="margin:0px; color: red;">Erreur de suppression de fichier</h3>'+
          '</md-subheader>'+
           '  <md-dialog-content>'+
           '    <p>Veuillez communiquer ce réference à l\'administrateur</p>'+
           '    <p>Réference: {{items}}</p>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Fermer' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: items
         },
         controller: DialogController
      });

    }

      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }  

    }
})();
