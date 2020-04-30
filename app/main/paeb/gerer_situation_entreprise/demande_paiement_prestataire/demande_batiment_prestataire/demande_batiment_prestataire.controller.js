(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_paiement_prestataire.demande_batiment_prestataire')
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
    function Demande_batiment_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		    var vm = this;
        /*vm.selectedItemContrat_prestataire = {};
        vm.allcontrat_prestataire = [];

        vm.selectedItemBatiment_construction = {};
        vm.allbatiment_construction  = [];

        vm.selectedItemLatrine_construction = {};
        vm.alllatrine_construction  = [];*/

        vm.ajoutDemande_batiment_prest = ajoutDemande_batiment_prest;
        var NouvelItemDemande_batiment_prest=false;
        var currentItemDemande_batiment_prest;
        vm.selectedItemDemande_batiment_prest = {};
        vm.alldemande_batiment_prest_invalide = [];

        vm.alldemande_batiment_prest_contra

        vm.ajoutJustificatif_batiment_pre = ajoutJustificatif_batiment_pre;
        var NouvelItemJustificatif_batiment_pre=false;
        var currentItemJustificatif_batiment_pre;
        vm.selectedItemJustificatif_batiment_pre = {} ;
        vm.alljustificatif_batiment_pre = [] ; 

        vm.allcurenttranche_demande_mpe = [];
        vm.alltranche_demande_mpe = [];
        vm.dernierdemande = [];

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.showboutonValider = false;
        vm.permissionboutonValider = false;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontrat_prestataireBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allcontrat_prestataire = result.data.response; 
                console.log(vm.allcontrat_prestataire);
            });
            
            apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index",'menu','getdemandeInvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                  vm.alldemande_batiment_prest_invalide = result.data.response;
                  console.log(vm.alldemande_batiment_prest_invalide);
            });
          }
          

        });

/**********************************fin batiment construction****************************************/       
  vm.change_contrat = function(item)
  {
    apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index",'menu','getalldemandeBycontrat','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
    {
        if (NouvelItemDemande_batiment_prest ==false)
        {
            vm.alldemande_batiment_prest_contra = result.data.response.filter(function(obj){return obj.id == item.id;});
            console.log(vm.alldemande_batiment_prest_contra);
            if(vm.alldemande_batiment_prest_contra.length>0)
            {
                var last_id_demande = Math.max.apply(Math, vm.alldemande_batiment_prest_contra.map(function(o){ return o.id;}));
                vm.dernierdemande = vm.alldemande_batiment_prest_contra.filter(function(obj){return obj.id == last_id_demande;});
                var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];


            if (vm.dernierdemande[0].validation==3)
            { 
                vm.allcurenttranche_demande_mpe = vm.alltranche_demande_mpe.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
            } 
            else
            {
                 vm.showAlert('Impossible d\'ajouter la demande','Dernier demande en-cours!!!');
                 vm.allcurenttranche_demande_mpe = [];
            }
            }
            else
            { 
              vm.allcurenttranche_demande_mpe = vm.alltranche_demande_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
            }
        }
        else
        {
           vm.alldemande_batiment_prest_contra = result.data.response;
           if(vm.alldemande_batiment_prest_contra.length>0)
        {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_batiment_prest_contra.map(function(o){ return o.id;}));
            vm.dernierdemande = vm.alldemande_batiment_prest_contra.filter(function(obj){return obj.id == last_id_demande;});
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];
            console.log(vm.dernierdemande);
            if (vm.dernierdemande[0].validation==3)
            { 
                vm.allcurenttranche_demande_mpe = vm.alltranche_demande_mpe.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
            } 
            else
            {
                 vm.showAlert('Impossible d\'ajouter la demande','Dernier demande en-cours!!!');
                 vm.allcurenttranche_demande_mpe = [];
            }
          }
          else
          { 
              vm.allcurenttranche_demande_mpe = vm.alltranche_demande_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
          }
        }
              
      });
  }

/**********************************fin batiment construction****************************************/

/**********************************debut demande_batiment_prest****************************************/
//col table
        vm.demande_batiment_prest_column = [
        {titre:"Contrat prestataire"
        },
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
          var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',        
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

            if (NouvelItemDemande_batiment_prest == false)
          {         
            vm.alldemande_batiment_prest_invalide.push(items);
            vm.alldemande_batiment_prest_invalide.forEach(function(mem)
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
            item.id_contrat_prestataire   = currentItemDemande_batiment_prest.id_contrat_prestataire ;
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
            vm.alldemande_batiment_prest_invalide = vm.alldemande_batiment_prest_invalide.filter(function(obj)
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
            vm.showboutonValider = true;

            vm.stepOne = true;
            vm.stepTwo = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_batiment_prest', function()
        {
             if (!vm.alldemande_batiment_prest_invalide) return;
             vm.alldemande_batiment_prest_invalide.forEach(function(item)
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
            $scope.vm.alldemande_batiment_prest_invalide.forEach(function(mem) {
              mem.$edit = false;
            });

            apiFactory.getAPIgeneraliserREST("batiment_construction/index",'menu','getbatimentByContrat_prestataire','id_contrat_prestataire',item.contrat_prestataire.id).then(function(result)
            {
                vm.allbatiment_construction = result.data.response;
                console.log(vm.allbatiment_construction);
            });

            item.$edit = true;
            item.$selected = true;
            item.id_contrat_prestataire   = vm.selectedItemDemande_batiment_prest.contrat_prestataire.id ;
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
               var pass = vm.alldemande_batiment_prest_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_batiment_prest.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_batiment_prest.objet )
                    || (pass[0].description   != currentItemDemande_batiment_prest.description )
                    || (pass[0].id_tranche_demande_mpe != currentItemDemande_batiment_prest.id_tranche_demande_mpe )
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
                    id_contrat_prestataire: demande_batiment_prest.id_contrat_prestataire,
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

                var contrat= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == demande_batiment_prest.id_contrat_prestataire;
                });

                if (NouvelItemDemande_batiment_prest == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_batiment_prest.contrat_prestataire = contrat[0] ;
                        vm.selectedItemDemande_batiment_prest.tranche = tran[0] ;
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
                      vm.alldemande_batiment_prest_invalide = vm.alldemande_batiment_prest_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_batiment_prest.id;
                      });
                    }
                    
                }
                else
                {
                  demande_batiment_prest.contrat_prestataire = contrat[0] ;
                  demande_batiment_prest.tranche = tran[0] ;
                  demande_batiment_prest.periode = tran[0].periode ;
                  demande_batiment_prest.pourcentage = tran[0].pourcentage ;

                  demande_batiment_prest.id  =   String(data.response);              
                  NouvelItemDemande_batiment_prest=false;
            }
              vm.showboutonValider = false;

              demande_batiment_prest.$selected = false;
              demande_batiment_prest.$edit = false;
              vm.selectedItemDemande_batiment_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange = function(item)
        { 
          
          var reste = 0;
          var anterieur = 0;
          
          var contra = vm.allcontrat_prestataire.filter(function(obj)
          {
              return obj.id == item.id_contrat_prestataire;
          });

          var montant = ((parseInt(contra[0].cout_batiment)) * vm.allcurenttranche_demande_mpe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_batiment_prest_contra.length>0)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= (parseInt(contra[0].cout_batiment)) - cumul;

          item.periode = vm.allcurenttranche_demande_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }

      vm.validationDemande = function()
      {
        validationDemande_batiment_prest(vm.selectedItemDemande_batiment_prest,0,1);
      }

      function validationDemande_batiment_prest(demande_batiment_prest,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_prest.id,
                    objet: demande_batiment_prest.objet,
                    description:demande_batiment_prest.description,
                    ref_facture:demande_batiment_prest.ref_facture,
                    id_tranche_demande_mpe: demande_batiment_prest.tranche.id ,
                    montant: demande_batiment_prest.montant,
                    cumul: demande_batiment_prest.cumul ,
                    anterieur: demande_batiment_prest.anterieur ,
                    reste: demande_batiment_prest.reste ,
                    date: convertionDate(new Date(demande_batiment_prest.date)),
                    id_contrat_prestataire: demande_batiment_prest.contrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_prestataire/index",datas, config).success(function (data)
            {
                       
              vm.alldemande_batiment_prest_invalide = vm.alldemande_batiment_prest_invalide.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_batiment_prest.id;
              });                  
               vm.stepTwo=false;     
              vm.showboutonValider = false;
 
              demande_batiment_prest.$selected = false;
              demande_batiment_prest.$edit = false;
              vm.selectedItemDemande_batiment_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
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
            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratBydemande_batiment','id_demande_batiment_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                var contrat_presta = result.data.response;
                console.log(contrat_presta);
            
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
                    id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_batiment_pre == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_batiment_pre/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_batiment_pre.id
                                              
                          if(file)
                          { 

                            var name_file = contrat_presta[0].num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    justificatif_batiment_pre.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: justificatif_batiment_pre.description,
                                                      fichier: justificatif_batiment_pre.fichier,
                                                      id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id,
                                                      validation:0
                                        });
                                      apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_batiment_pre.$selected = false;
                                          justificatif_batiment_pre.$edit = false;
                                          vm.selectedItemJustificatif_batiment_pre = {};
                                      console.log('b');
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
                                        id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id,
                                        validation:0               
                                    });
                                  apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_batiment_pre.$selected = false;
                                      justificatif_batiment_pre.$edit = false;
                                      vm.selectedItemJustificatif_batiment_pre = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemJustificatif_batiment_pre.$selected  = false;
                        vm.selectedItemJustificatif_batiment_pre.$edit      = false;
                        vm.selectedItemJustificatif_batiment_pre ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_batiment_pre = vm.alljustificatif_batiment_pre.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_batiment_pre.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_batiment_pre.fichier;
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
                  justificatif_batiment_pre.id  =   String(data.response);              
                  NouvelItemJustificatif_batiment_pre = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_batiment_pre/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = contrat_presta[0].num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              justificatif_batiment_pre.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: justificatif_batiment_pre.description,
                                                fichier: justificatif_batiment_pre.fichier,
                                                id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_batiment_pre.$selected = false;
                                    justificatif_batiment_pre.$edit = false;
                                    vm.selectedItemJustificatif_batiment_pre = {};
                                console.log('b');
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
                                  id_demande_pay_pre: vm.selectedItemDemande_batiment_prest.id,
                                  validation:0               
                              });
                            apiFactory.add("justificatif_batiment_pre/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_batiment_pre.$selected = false;
                                justificatif_batiment_pre.$edit = false;
                                vm.selectedItemJustificatif_batiment_pre = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              justificatif_batiment_pre.$selected = false;
              justificatif_batiment_pre.$edit = false;
              vm.selectedItemJustificatif_batiment_pre = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
});
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
