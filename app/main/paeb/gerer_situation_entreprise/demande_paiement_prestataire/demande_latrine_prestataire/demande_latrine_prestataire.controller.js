(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.demande_paiement_prestataire.demande_latrine_prestataire')
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
        .controller('Demande_latrine_prestataireController', Demande_latrine_prestataireController);
    /** @ngInject */
    function Demande_latrine_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		    var vm = this;

        vm.ajoutDemande_latrine_prest = ajoutDemande_latrine_prest;
        var NouvelItemDemande_latrine_prest=false;
        var currentItemDemande_latrine_prest;
        vm.selectedItemDemande_latrine_prest = {};
        vm.alldemande_latrine_prest_invalide = [];

        vm.ajoutJustificatif_latrine_pre = ajoutJustificatif_latrine_pre ;
        var NouvelItemJustificatif_latrine_pre=false;
        var currentItemJustificatif_latrine_pre;
        vm.selectedItemJustificatif_latrine_pre = {} ;
        vm.alljustificatif_latrine_pre = [] ;

        vm.allcurenttranche_demande_latrine_mpe = [];
        vm.alltranche_demande_latrine_mpe = [];
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
            
            apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index",'menu','getdemandeInvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                  vm.alldemande_latrine_prest_invalide = result.data.response;
                  console.log(vm.alldemande_latrine_prest_invalide);
            });
          }
          

        });


/**********************************fin batiment construction****************************************/       

/**********************************debut demande_latrine_prest****************************************/
//col table
        vm.demande_latrine_prest_column = [
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
        apiFactory.getAll("tranche_demande_latrine_mpe/index").then(function(result)
        {
          vm.alltranche_demande_latrine_mpe= result.data.response;
          vm.allcurenttranche_demande_latrine_mpe = result.data.response;
          //console.log(vm.allcurenttranche_demande_latrine_mpe);
        });

  vm.change_contrat = function(item)
  {
    apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index",'menu','getalldemandeBycontrat','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
    {
        if (NouvelItemDemande_latrine_prest ==false)
        {
            vm.alldemande_latrine_prest_contra = result.data.response.filter(function(obj){return obj.id == item.id;});
            console.log(vm.alldemande_latrine_prest_contra);
            if(vm.alldemande_latrine_prest_contra.length>0)
            {
                var last_id_demande = Math.max.apply(Math, vm.alldemande_latrine_prest_contra.map(function(o){ return o.id;}));
                vm.dernierdemande = vm.alldemande_latrine_prest_contra.filter(function(obj){return obj.id == last_id_demande;});
                var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];


            if (vm.dernierdemande[0].validation==3)
            { 
                vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
            } 
            else
            {
                 vm.showAlert('Impossible d\'ajouter la demande','Dernier demande en-cours!!!');
                 vm.allcurenttranche_demande_latrine_mpe = [];
            }
            }
            else
            { 
              vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
            }
        }
        else
        {
           vm.alldemande_latrine_prest_contra = result.data.response; console.log(vm.alldemande_latrine_prest_contra);
           if(vm.alldemande_latrine_prest_contra.length>0)
        {
            var last_id_demande = Math.max.apply(Math, vm.alldemande_latrine_prest_contra.map(function(o){ return o.id;}));
            vm.dernierdemande = vm.alldemande_latrine_prest_contra.filter(function(obj){return obj.id == last_id_demande;});
            var numcode=vm.dernierdemande[0].tranche.code.split(' ')[1];
            console.log(vm.dernierdemande);
            if (vm.dernierdemande[0].validation==3)
            { 
                vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){ return obj.code == 'tranche '+(parseInt(numcode)+1);});
            } 
            else
            {
                 vm.showAlert('Impossible d\'ajouter la demande','Dernier demande en-cours!!!');
                 vm.allcurenttranche_demande_latrine_mpe = [];
            }
          }
          else
          { 
              vm.allcurenttranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj){return obj.code == 'tranche 1';});
                    //vm.dernierdemande = [];
          }
        }
         console.log(vm.allcurenttranche_demande_latrine_mpe);     
      });
  } 

        //Masque de saisi ajout
        vm.ajouterDemande_latrine_prest = function ()
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
          if (NouvelItemDemande_latrine_prest == false)
          {         
            vm.alldemande_latrine_prest_invalide.push(items);
            vm.alldemande_latrine_prest_invalide.forEach(function(mem)
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
            item.id_contrat_prestataire   = currentItemDemande_latrine_prest.id_contrat_prestataire ;
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
            vm.alldemande_latrine_prest_invalide = vm.alldemande_latrine_prest_invalide.filter(function(obj)
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
            vm.showboutonValider = true;
            vm.stepOne = true;
            vm.stepTwo = false;
           }
             
        };
        $scope.$watch('vm.selectedItemDemande_latrine_prest', function()
        {
             if (!vm.alldemande_latrine_prest_invalide) return;
             vm.alldemande_latrine_prest_invalide.forEach(function(item)
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
            $scope.vm.alldemande_latrine_prest_invalide.forEach(function(mem) {
              mem.$edit = false;
            });
            apiFactory.getAPIgeneraliserREST("latrine_construction/index",'menu','getlatrineByContrat_prestataire','id_contrat_prestataire',item.contrat_prestataire.id).then(function(result)
            {
                vm.alllatrine_construction = result.data.response;
                console.log(vm.alllatrine_construction);
            });

            item.$edit = true;
            item.$selected = true;
            item.id_contrat_prestataire   = vm.selectedItemDemande_latrine_prest.contrat_prestataire.id ;
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
               var pass = vm.alldemande_latrine_prest_invalide.filter(function(obj)
                {
                   return obj.id == currentItemDemande_latrine_prest.id;
                });
                if(pass[0])
                {
                   if((pass[0].objet   != currentItemDemande_latrine_prest.objet )                    
                    || (pass[0].id_contrat_prestataire != currentItemDemande_latrine_prest.id_contrat_prestataire )
                    || (pass[0].description   != currentItemDemande_latrine_prest.description )
                    || (pass[0].id_tranche_demande_mpe != currentItemDemande_latrine_prest.id_tranche_demande_mpe )
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
                    id_contrat_prestataire: demande_latrine_prest.id_contrat_prestataire,
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

                var contrat= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == demande_latrine_prest.id_contrat_prestataire;
                });

                if (NouvelItemDemande_latrine_prest == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   console.log(lat_c);
                        vm.selectedItemDemande_latrine_prest.contrat_prestataire = contrat[0] ;                    
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
                      vm.alldemande_latrine_prest_invalide = vm.alldemande_latrine_prest_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_latrine_prest.id;
                      });
                    }
                    
                }
                else
                {
                  demande_latrine_prest.contrat_prestataire = contrat[0] ;
                  demande_latrine_prest.tranche = tran[0] ;
                  demande_latrine_prest.periode = tran[0].periode ;
                  demande_latrine_prest.pourcentage = tran[0].pourcentage ;

                  demande_latrine_prest.id  =   String(data.response);              
                  NouvelItemDemande_latrine_prest=false;
                }
              vm.showboutonValider = false;
              demande_latrine_prest.$selected = false;
              demande_latrine_prest.$edit = false;
              vm.selectedItemDemande_latrine_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.tranchechange_latrine = function(item)
        {
          var reste = 0;
          var anterieur = 0;

          var contra = vm.allcontrat_prestataire.filter(function(obj)
          {
              return obj.id == item.id_contrat_prestataire;
          });

          var montant = (parseInt(contra[0].cout_latrine) * vm.allcurenttranche_demande_latrine_mpe[0].pourcentage)/100;
          var cumul = montant;

          if (vm.alldemande_latrine_prest_contra.length>0)
          {                 
              anterieur = vm.dernierdemande[0].montant;           
              cumul = montant + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= parseInt(contra[0].cout_latrine) - cumul;

          item.periode = vm.allcurenttranche_demande_latrine_mpe[0].periode;
          item.pourcentage = vm.allcurenttranche_demande_latrine_mpe[0].pourcentage;

          item.montant = montant;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
        }
        
       /* vm.change_latrine = function(item)
        {
          var latri = vm.alllatrine_construction.filter(function(obj)
              {
                  return obj.id !== item.id_latrine_construction;
              });
          //item.latrine_construction.libelle_type= latri[0].type_latrine.libelle
        }*/
        vm.validationDemande = function()
        {
          validationDemande_latrine_prest(vm.selectedItemDemande_latrine_prest,0,1);
        }

        function validationDemande_latrine_prest(demande_latrine_prest,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_latrine_prest.id,
                    objet: demande_latrine_prest.objet,
                    description:demande_latrine_prest.description,
                    ref_facture:demande_latrine_prest.ref_facture,
                    id_tranche_demande_mpe: demande_latrine_prest.tranche.id ,
                    montant: demande_latrine_prest.montant,
                    cumul: demande_latrine_prest.cumul ,
                    anterieur: demande_latrine_prest.anterieur ,
                    reste: demande_latrine_prest.reste ,
                    date: convertionDate(new Date(demande_latrine_prest.date)),
                    id_contrat_prestataire: demande_latrine_prest.contrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_prestataire/index",datas, config).success(function (data)
            {
                       
              vm.alldemande_latrine_prest_invalide = vm.alldemande_latrine_prest_invalide.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_latrine_prest.id;
              });                  
               vm.stepTwo=false;     
               vm.showboutonValider = false;
              demande_latrine_prest.$selected = false;
              demande_latrine_prest.$edit = false;
              vm.selectedItemDemande_latrine_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

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
          apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratBydemande_latrine','id_demande_latrine_pre',vm.selectedItemDemande_latrine_prest.id).then(function(result)
            {
                var contrat_presta = result.data.response;
                console.log(contrat_presta);
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
                var name_file = contrat_presta[0].num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
});
        }
        vm.download_piece = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
/**********************************fin mpe_sousmissionnaire****************************************/


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
