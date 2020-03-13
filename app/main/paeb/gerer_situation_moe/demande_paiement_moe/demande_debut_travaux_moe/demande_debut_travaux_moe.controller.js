(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.demande_paiement_moe.demande_debut_travaux_moe')
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
        .controller('Demande_debut_travaux_moeController', Demande_debut_travaux_moeController);
    /** @ngInject */
    function Demande_debut_travaux_moeController($mdDialog, $scope, apiFactory, $state,apiUrl,$http)
    {
		    var vm = this;
        vm.selectedItemContrat_bureau_etude = {};
        vm.allcontrat_bureau_etude = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];

        vm.ajoutDemande_debut_travaux_moe = ajoutDemande_debut_travaux_moe;
        var NouvelItemDemande_debut_travaux_moe=false;
        var currentItemDemande_debut_travaux_moe;
        vm.selectedItemDemande_debut_travaux_moe = {};
        vm.alldemande_debut_travaux_moe_invalide = [];

        vm.alldemande_debut_travaux_moe = [];

        vm.ajoutJustificatif_debut_travaux_moe = ajoutJustificatif_debut_travaux_moe;
        var NouvelItemJustificatif_debut_travaux_moe=false;
        var currentItemJustificatif_debut_travaux_moe;
        vm.selectedItemJustificatif_debut_travaux_moe = {} ;
        vm.alljustificatif_debut_travaux_moe = [] ;

       

        vm.allcurenttranche_d_debut_travaux_moe = [];
        vm.alltranche_d_debut_travaux_moe = [];
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
              
              apiFactory.getAPIgeneraliserREST("demande_debut_travaux_moe/index",'menu','getalldemandeBycontrat','id_contrat_bureau_etude',vm.selectedItemContrat_bureau_etude.id).then(function(result)
              {
                  vm.alldemande_debut_travaux_moe_invalide = result.data.response.filter(function(obj)
                  {
                      return obj.validation == 0;
                  });
                  vm.alldemande_debut_travaux_moe = result.data.response;
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


/**********************************debut demande_debut_travaux_moe****************************************/
//col table
        vm.demande_debut_travaux_moe_column = [
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

        //recuperation donnée tranche deblocage moe
        apiFactory.getAll("tranche_d_debut_travaux_moe/index").then(function(result)
        {
          vm.alltranche_d_debut_travaux_moe= result.data.response;
          vm.allcurenttranche_d_debut_travaux_moe = result.data.response;
          //console.log(vm.allcurenttranche_d_debut_travaux_moe);
        });

        //Masque de saisi ajout
        vm.ajouterDemande_debut_travaux_moe = function ()
        {     var items = {
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
            if(vm.alldemande_debut_travaux_moe.length>0)
                  {
                      var last_id_demande = Math.max.apply(Math, vm.alldemande_debut_travaux_moe.map(function(o){ return o.id;}));
                      vm.dernierdemande = vm.alldemande_debut_travaux_moe.filter(function(obj){return obj.id == last_id_demande;});
                      var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

                      if (vm.dernierdemande[0].validation==3)
                      {
                          if (NouvelItemDemande_debut_travaux_moe == false)
                          {
                              vm.alldemande_debut_travaux_moe_invalide.push(items);                        
                              vm.alldemande_debut_travaux_moe_invalide.forEach(function(mem)
                              {
                                  if(mem.$selected==true)
                                  {
                                    vm.selectedItemDemande_debut_travaux_moe = mem;
                                  }
                              });

                              NouvelItemDemande_debut_travaux_moe = true ;
                          }                    
                          else
                          {
                              vm.showAlert('Ajout demande debut_travaux','Un formulaire d\'ajout est déjà ouvert!!!');
                          }

                          vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
                      } 
                      else
                      {
                          vm.showAlert('Ajout demande debut_travaux','Dernier demande en-cours!!!');
                      }
                  }
                  else
                  { 
                      if (NouvelItemDemande_debut_travaux_moe == false)
                      {                              
                          vm.alldemande_debut_travaux_moe_invalide.push(items);                        
                          vm.alldemande_debut_travaux_moe_invalide.forEach(function(mem)
                          {
                              if(mem.$selected==true)
                              {
                                  vm.selectedItemDemande_debut_travaux_moe = mem;
                              }
                          });

                          NouvelItemDemande_debut_travaux_moe = true ;
                      }                    
                      else
                      {
                          vm.showAlert('Ajout demande debut_travaux','Un formulaire d\'ajout est déjà ouvert!!!');
                      }

                      vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
                  }
                      
         /* if(vm.alldemande_debut_travaux_moe_invalide.length>0)
          {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_debut_travaux_moe_invalide.map(function(o)
            { 
              return o.id;
            }));

            vm.dernierdemande = vm.alldemande_debut_travaux_moe_invalide.filter(function(obj)
            {
                return obj.id == last_id_demande;
            });
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];

            vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj)
            {
                return obj.code == 'tranche '+(parseInt(numcode)+1);
            });

          }
          else
          {
            vm.allcurenttranche_d_debut_travaux_moe = vm.alltranche_d_debut_travaux_moe.filter(function(obj)
            {
                return obj.code == 'tranche 1';
            });
            vm.dernierdemande = [];console.log(vm.allcurenttranche_d_debut_travaux_moe);
          }
          if (NouvelItemDemande_debut_travaux_moe == false)
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
            vm.alldemande_debut_travaux_moe_invalide.push(items);
            vm.alldemande_debut_travaux_moe_invalide.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDemande_debut_travaux_moe = mem;
              }
            });

            NouvelItemDemande_debut_travaux_moe = true ;
          }else
          {
            vm.showAlert('Ajout demande debut_travaux','Un formulaire d\'ajout est déjà ouvert!!!');
          } */               
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression)
        {
            if (NouvelItemDemande_debut_travaux_moe==false)
            {
                test_existanceDemande_debut_travaux_moe (demande_debut_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation demande_debut_travaux_moe
        vm.annulerDemande_debut_travaux_moe = function(item)
        {
          if (NouvelItemDemande_debut_travaux_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.objet   = currentItemDemande_debut_travaux_moe.objet ;
            item.description   = currentItemDemande_debut_travaux_moe.description ;
            item.ref_facture   = currentItemDemande_debut_travaux_moe.ref_facture ;
            item.id_tranche_d_debut_travaux_moe = currentItemDemande_debut_travaux_moe.id_tranche_d_debut_travaux_moe ;
            item.montant   = currentItemDemande_debut_travaux_moe.montant ;
            item.cumul = currentItemDemande_debut_travaux_moe.cumul ;
            item.anterieur = currentItemDemande_debut_travaux_moe.anterieur;
            item.periode = currentItemDemande_debut_travaux_moe.periode ;
            item.pourcentage = currentItemDemande_debut_travaux_moe.pourcentage ;
            item.reste = currentItemDemande_debut_travaux_moe.reste;
            item.date  = currentItemDemande_debut_travaux_moe.date;
          }else
          {
            vm.alldemande_debut_travaux_moe_invalide = vm.alldemande_debut_travaux_moe_invalide.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_debut_travaux_moe.id;
            });
          }

          vm.selectedItemDemande_debut_travaux_moe = {} ;
          NouvelItemDemande_debut_travaux_moe      = false;
          
        };

        //fonction selection item Demande_debut_travaux_moe
        vm.selectionDemande_debut_travaux_moe= function (item)
        {
            vm.selectedItemDemande_debut_travaux_moe = item;
            vm.nouvelItemDemande_debut_travaux_moe   = item;
            currentItemDemande_debut_travaux_moe    = JSON.parse(JSON.stringify(vm.selectedItemDemande_debut_travaux_moe));
           if(item.id!=0)
           {
           apiFactory.getAPIgeneraliserREST("justificatif_debut_travaux_moe/index",'id_demande_debut_travaux_moe',vm.selectedItemDemande_debut_travaux_moe.id).then(function(result)
            {
                vm.alljustificatif_debut_travaux_moe = result.data.response;
                console.log(vm.alljustificatif_debut_travaux_moe);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_debut_travaux_moe', function()
        {
             if (!vm.alldemande_debut_travaux_moe_invalide) return;
             vm.alldemande_debut_travaux_moe_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_debut_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDemande_debut_travaux_moe = function(item)
        {
            NouvelItemDemande_debut_travaux_moe = false ;
            vm.selectedItemDemande_debut_travaux_moe = item;
            currentItemDemande_debut_travaux_moe = angular.copy(vm.selectedItemDemande_debut_travaux_moe);
            $scope.vm.alldemande_debut_travaux_moe_invalide.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.objet   = vm.selectedItemDemande_debut_travaux_moe.objet ;
            item.description   = vm.selectedItemDemande_debut_travaux_moe.description ;
            item.ref_facture   = vm.selectedItemDemande_debut_travaux_moe.ref_facture ;
            item.id_tranche_d_debut_travaux_moe = vm.selectedItemDemande_debut_travaux_moe.tranche.id ;
            item.montant   = parseInt(vm.selectedItemDemande_debut_travaux_moe.montant);
            item.cumul = vm.selectedItemDemande_debut_travaux_moe.cumul ;
            item.anterieur = vm.selectedItemDemande_debut_travaux_moe.anterieur ;
            item.periode = vm.selectedItemDemande_debut_travaux_moe.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_debut_travaux_moe.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_debut_travaux_moe.reste ;
            item.date   =new Date(vm.selectedItemDemande_debut_travaux_moe.date) ;
        };

        //fonction bouton suppression item Demande_debut_travaux_moe
        vm.supprimerDemande_debut_travaux_moe = function()
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
                vm.ajoutDemande_debut_travaux_moe(vm.selectedItemDemande_debut_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDemande_debut_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.alldemande_debut_travaux_moe_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_debut_travaux_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_debut_travaux_moe.objet )
                    || (pass[0].description   != currentItemDemande_debut_travaux_moe.description )
                    || (pass[0].id_tranche_d_debut_travaux_moe != currentItemDemande_debut_travaux_moe.id_tranche_d_debut_travaux_moe )
                    || (pass[0].montant   != currentItemDemande_debut_travaux_moe.montant )
                    || (pass[0].cumul != currentItemDemande_debut_travaux_moe.cumul )
                    || (pass[0].anterieur != currentItemDemande_debut_travaux_moe.anterieur )
                    || (pass[0].reste != currentItemDemande_debut_travaux_moe.reste )
                    || (pass[0].date   != currentItemDemande_debut_travaux_moe.date )
                    || (pass[0].ref_facture   != currentItemDemande_debut_travaux_moe.ref_facture ) )                   
                      { 
                         insert_in_baseDemande_debut_travaux_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_debut_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Demande_debut_travaux_moe
        function insert_in_baseDemande_debut_travaux_moe(demande_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_debut_travaux_moe==false)
            {
                getId = vm.selectedItemDemande_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet: demande_debut_travaux_moe.objet,
                    description:demande_debut_travaux_moe.description,
                    ref_facture:demande_debut_travaux_moe.ref_facture,
                    id_tranche_d_debut_travaux_moe: demande_debut_travaux_moe.id_tranche_d_debut_travaux_moe ,
                    montant: demande_debut_travaux_moe.montant,
                    cumul: demande_debut_travaux_moe.cumul ,
                    anterieur: demande_debut_travaux_moe.anterieur ,
                    reste: demande_debut_travaux_moe.reste ,
                    date: convertionDate(new Date(demande_debut_travaux_moe.date)),
                    id_contrat_bureau_etude: vm.selectedItemContrat_bureau_etude.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_debut_travaux_moe/index",datas, config).success(function (data)
            {   

                var tran= vm.alltranche_d_debut_travaux_moe.filter(function(obj)
                {
                    return obj.id == demande_debut_travaux_moe.id_tranche_d_debut_travaux_moe;
                });

                if (NouvelItemDemande_debut_travaux_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        /*vm.selectedItemDemande_debut_travaux_moe.objet   = demande_debut_travaux_moe.objet ;
                        vm.selectedItemDemande_debut_travaux_moe.description   = demande_debut_travaux_moe.description ;
                        vm.selectedItemDemande_debut_travaux_moe.ref_facture   = demande_debut_travaux_moe.ref_facture ;
                        vm.selectedItemDemande_debut_travaux_moe.montant   = demande_debut_travaux_moe.montant ;*/
                        vm.selectedItemDemande_debut_travaux_moe.tranche = tran[0] ;
                        /*vm.selectedItemDemande_debut_travaux_moe.cumul = demande_debut_travaux_moe.cumul ;
                        vm.selectedItemDemande_debut_travaux_moe.anterieur = demande_debut_travaux_moe.anterieur ;*/
                        vm.selectedItemDemande_debut_travaux_moe.periode = tran[0].periode ;
                        vm.selectedItemDemande_debut_travaux_moe.pourcentage = tran[0].pourcentage ;
                        /*vm.selectedItemDemande_debut_travaux_moe.reste = demande_debut_travaux_moe.reste ;
                        vm.selectedItemDemande_debut_travaux_moe.date   = demande_debut_travaux_moe.date ;*/
                        
                        vm.selectedItemDemande_debut_travaux_moe.$selected  = false;
                        vm.selectedItemDemande_debut_travaux_moe.$edit      = false;
                        vm.selectedItemDemande_debut_travaux_moe ={};
                        ;
                    }
                    else 
                    {    
                      vm.alldemande_debut_travaux_moe_invalide = vm.alldemande_debut_travaux_moe_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_debut_travaux_moe.id;
                      });
                    }
                    
                }
                else
                {
                  /*demande_debut_travaux_moe.objet   = demande_debut_travaux_moe.objet ;
                  demande_debut_travaux_moe.description   = demande_debut_travaux_moe.description ;
                  demande_debut_travaux_moe.ref_facture   = demande_debut_travaux_moe.ref_facture ;
                  demande_debut_travaux_moe.montant   = demande_debut_travaux_moe.montant ;*/
                  demande_debut_travaux_moe.tranche = tran[0] ;
                  /*demande_debut_travaux_moe.cumul = demande_debut_travaux_moe.cumul ;
                  demande_debut_travaux_moe.anterieur = demande_debut_travaux_moe.anterieur ;*/
                  demande_debut_travaux_moe.periode = tran[0].periode ;
                  demande_debut_travaux_moe.pourcentage = tran[0].pourcentage ;
                  /*demande_debut_travaux_moe.reste = demande_debut_travaux_moe.reste ;
                  demande_debut_travaux_moe.date   = demande_debut_travaux_moe.date ;*/

                  demande_debut_travaux_moe.id  =   String(data.response);              
                  NouvelItemDemande_debut_travaux_moe=false;
            }
              demande_debut_travaux_moe.$selected = false;
              demande_debut_travaux_moe.$edit = false;
              vm.selectedItemDemande_debut_travaux_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          var nbr_t = [];
          var reste = 0;
          var anterieur = 0;

            var montant = (parseInt(vm.selectedItemContrat_bureau_etude.montant_contrat) * (vm.allcurenttranche_d_debut_travaux_moe[0].pourcentage))/100;
            var cumul = montant;

          if (vm.alldemande_debut_travaux_moe_invalide.length>1)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }
          

          reste= (parseInt(vm.selectedItemContrat_bureau_etude.montant_contrat)) - cumul;

          item.periode = vm.allcurenttranche_d_debut_travaux_moe[0].periode;
          item.pourcentage = vm.allcurenttranche_d_debut_travaux_moe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          console.log(item);
          console.log(vm.selectedItemContrat_bureau_etude);
         
          //var nbr_debut_travaux_total = vm.alldemande_debut_travaux_moe_invalide.length;
          
        }
/**********************************fin demande_debut_travaux_moe****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_debut_travaux_moe_column = [
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
          vm.selectedItemJustificatif_debut_travaux_moe.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_debut_travaux_moe.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_debut_travaux_moe = function ()
        { 
          if (NouvelItemJustificatif_debut_travaux_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_debut_travaux_moe.push(items);
            vm.alljustificatif_debut_travaux_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_debut_travaux_moe = mem;
              }
            });

            NouvelItemJustificatif_debut_travaux_moe = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_debut_travaux_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_debut_travaux_moe(justificatif_debut_travaux_moe,suppression)
        {
            if (NouvelItemJustificatif_debut_travaux_moe==false)
            {
                test_existanceJustificatif_debut_travaux_moe (justificatif_debut_travaux_moe,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_debut_travaux_moe(justificatif_debut_travaux_moe,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_debut_travaux_moe
        vm.annulerJustificatif_debut_travaux_moe = function(item)
        {
          if (NouvelItemJustificatif_debut_travaux_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_debut_travaux_moe.description ;
            item.fichier   = currentItemJustificatif_debut_travaux_moe.fichier ;
          }else
          {
            vm.alljustificatif_debut_travaux_moe = vm.alljustificatif_debut_travaux_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_debut_travaux_moe.id;
            });
          }

          vm.selectedItemJustificatif_debut_travaux_moe = {} ;
          NouvelItemJustificatif_debut_travaux_moe      = false;
          
        };

        //fonction selection item justificatif debut_travaux
        vm.selectionJustificatif_debut_travaux_moe= function (item)
        {
            vm.selectedItemJustificatif_debut_travaux_moe = item;
            vm.nouvelItemJustificatif_debut_travaux_moe   = item;
            currentItemJustificatif_debut_travaux_moe    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_debut_travaux_moe)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_debut_travaux_moe', function()
        {
             if (!vm.alljustificatif_debut_travaux_moe) return;
             vm.alljustificatif_debut_travaux_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_debut_travaux_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_debut_travaux_moe = function(item)
        {
            NouvelItemJustificatif_debut_travaux_moe = false ;
            vm.selectedItemJustificatif_debut_travaux_moe = item;
            currentItemJustificatif_debut_travaux_moe = angular.copy(vm.selectedItemJustificatif_debut_travaux_moe);
            $scope.vm.alljustificatif_debut_travaux_moe.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_debut_travaux_moe.description ;
            item.fichier   = vm.selectedItemJustificatif_debut_travaux_moe.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_debut_travaux_moe
        vm.supprimerJustificatif_debut_travaux_moe = function()
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
                vm.ajoutJustificatif_debut_travaux_moe(vm.selectedItemJustificatif_debut_travaux_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_debut_travaux_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var just = vm.alljustificatif_debut_travaux_moe.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_debut_travaux_moe.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_debut_travaux_moe.description )
                    ||(just[0].fichier   != currentItemJustificatif_debut_travaux_moe.fichier ))                   
                      { 
                         insert_in_baseJustificatif_debut_travaux_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_debut_travaux_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_debut_travaux_moe
        function insert_in_baseJustificatif_debut_travaux_moe(justificatif_debut_travaux_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_debut_travaux_moe==false)
            {
                getId = vm.selectedItemJustificatif_debut_travaux_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: justificatif_debut_travaux_moe.description,
                    fichier: justificatif_debut_travaux_moe.fichier,
                    id_demande_debut_travaux_moe: vm.selectedItemDemande_debut_travaux_moe.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_debut_travaux_moe == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_debut_travaux_moe/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_debut_travaux_moe.id
                                              
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
                                    justificatif_debut_travaux_moe.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_debut_travaux_moe.description,
                                                      fichier: justificatif_debut_travaux_moe.fichier,
                                                      id_demande_debut_travaux_moe: vm.selectedItemDemande_debut_travaux_moe.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_debut_travaux_moe.$selected = false;
                                          justificatif_debut_travaux_moe.$edit = false;
                                          vm.selectedItemJustificatif_debut_travaux_moe = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_debut_travaux_moe.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_debut_travaux_moe.description,
                                        fichier: justificatif_debut_travaux_moe.fichier,
                                        id_demande_debut_travaux_moe: vm.selectedItemDemande_debut_travaux_moe.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_debut_travaux_moe.$selected = false;
                                      justificatif_debut_travaux_moe.$edit = false;
                                      vm.selectedItemJustificatif_debut_travaux_moe = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_debut_travaux_moe.$selected  = false;
                        vm.selectedItemJustificatif_debut_travaux_moe.$edit      = false;
                        vm.selectedItemJustificatif_debut_travaux_moe ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_debut_travaux_moe = vm.alljustificatif_debut_travaux_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_debut_travaux_moe.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_debut_travaux_moe.fichier;
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
                  justificatif_debut_travaux_moe.id  =   String(data.response);              
                  NouvelItemJustificatif_debut_travaux_moe = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_debut_travaux_moe/';
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
                              justificatif_debut_travaux_moe.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_debut_travaux_moe.description,
                                                fichier: justificatif_debut_travaux_moe.fichier,
                                                id_demande_debut_travaux_moe: vm.selectedItemDemande_debut_travaux_moe.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_debut_travaux_moe.$selected = false;
                                    justificatif_debut_travaux_moe.$edit = false;
                                    vm.selectedItemJustificatif_debut_travaux_moe = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_debut_travaux_moe.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_debut_travaux_moe.description,
                                  fichier: justificatif_debut_travaux_moe.fichier,
                                  id_demande_debut_travaux_moe: vm.selectedItemDemande_debut_travaux_moe.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_debut_travaux_moe/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_debut_travaux_moe.$selected = false;
                                justificatif_debut_travaux_moe.$edit = false;
                                vm.selectedItemJustificatif_debut_travaux_moe = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_debut_travaux_moe.$selected = false;
              justificatif_debut_travaux_moe.$edit = false;
              vm.selectedItemJustificatif_debut_travaux_moe = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin justificatif debut_travaux****************************************/



/**********************************fin moe_sousmissionnaire****************************************/
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
