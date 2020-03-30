(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.demande_deblocage_feffi')
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
        .controller('Demande_deblocage_feffiController', Demande_deblocage_feffiController)
    /** @ngInject */
    function Demande_deblocage_feffiController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm    = this;

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;
        vm.stepThree = false;
        vm.stepFor = false;
        //vm.stepFor   = false;

    //initialisation feffi
        vm.selectedItemFeffi = {} ;
        vm.allfeffi  = [] ;

        //initialisation convention_cisco_feffi_entete
        vm.selectedItemConvention_cisco_feffi_entete = {} ;
        vm.allconvention_cisco_feffi_entete  = [] ;

     //initialisation demande_realimentation_feffi
      vm.ajoutDemande_realimentation  = ajoutDemande_realimentation ;
        var NouvelItemDemande_realimentation    = false;     
        var currentItemDemande_realimentation;
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ; 

    //initialisation piece_justificatif_feffi
        vm.ajoutPiece_justificatif_feffi  = ajoutPiece_justificatif_feffi ;
        var NouvelItemPiece_justificatif_feffi    = false;     
        var currentItemPiece_justificatif_feffi;
        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;
        vm.modificationdemande = false;
        vm.myFile={};
    //initialisation convention_cife_detail    
        vm.allconvention_cife_detail  = [] ;

        vm.allcurenttranche_deblocage_feffi = [];
        vm.alltranche_deblocage_feffi = [];
        vm.demande_realimentation = [];
        vm.showbuttonValidation = false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        //recuperation donnée tranche deblocage feffi
        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
          vm.alltranche_deblocage_feffi= result.data.response;
          vm.allcurenttranche_deblocage_feffi = result.data.response;
          //console.log(vm.allcurenttranche_deblocage_feffi);
        });

    /*****************Debut StepOne feffi***************/

      //recuperation donnée feffi
      /*  apiFactory.getAll("feffi/index").then(function(result)
        {
            vm.allfeffi = result.data.response; 
            console.log(vm.allfeffi);
        });

        //col table
        vm.feffi_column = [
          {titre:"Identifiant"},
          {titre:"Dénomination"},
          {titre:"Nombre feminin"},
          {titre:"Nombre membre"},
          {titre:"Adresse"},
          {titre:"Ecole"},
          {titre:"Observation"}];
        
        

        //fonction selection item convetion
        vm.selectionFeffi = function (item)
        {
            vm.selectedItemFeffi = item;           
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
            vm.stepFor= false;

            //recuperation donnée convention
           apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideByfeffi','id_feffi',item.id).then(function(result)
          {
              vm.allconvention_cisco_feffi_entete = result.data.response;
              console.log(vm.allconvention_cisco_feffi_entete);
          });
           
        };
        $scope.$watch('vm.selectedItemFeffi', function()
        {
             if (!vm.allfeffi) return;
             vm.allfeffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemFeffi.$selected = true;
        }); */         

  /*****************Fin StepOne feffi****************/
        

  /*****************Debut StepOne convention_cisco_feffi_entete***************/

  //recuperation donnée convention_cisco_feffi_entete
        

        //col table
    /*    vm.convention_cisco_feffi_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        }];
        
        

        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;           
           
            vm.stepTwo = true;
            vm.stepThree = false;
            vm.stepFor= false;

           //recuperation donnée demande
            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi","id_convention_cife_entete",item.id).then(function(result)
            {
                vm.alldemande_realimentation = result.data.response; 
                console.log(vm.alldemande_realimentation);
            });

            //recuperation donnée convention_cisco_feffi_detail
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.allconvention_cife_detail = result.data.response;
              });

            //recuperation donnée compte feffi
            apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
            {
              vm.allcompte_feffi= result.data.response;             
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
             if (!vm.allconvention_cisco_feffi_entete) return;
             vm.allconvention_cisco_feffi_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi_entete.$selected = true;

        });   */          

  /*****************Fin StepOne convention_cisco_feffi_entete****************/
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
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention_cisco_feffi_entete = result.data.response;
                console.log(vm.allconvention_cisco_feffi_entete);
            });
            apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_invalideBycisco",'id_cisco',usercisco.id).then(function(result)
            {
                vm.alldemande_realimentation = result.data.response; 
                console.log(vm.alldemande_realimentation);
            });

          }
        });

  /*****************Debut StepTwo demande_realimentation_feffi****************/

      vm.demande_realimentation_column = [
        {titre:"Convention"},
        {titre:"Numero compte"},        
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Date"},
        {titre:"Action"}];     
        

        //Masque de saisi ajout
        vm.ajouterDemande_realimentation = function ()
        { 
          if (NouvelItemDemande_realimentation == false)
          {
              var items = {
                            $edit: true,
                            $selected: true,
                            id: '0',
                            id_compte_feffi: '',
                            tranche: '',
                            cumul: '',
                            anterieur: '',
                            periode: '',
                            pourcentage:'',
                            reste:'',
                            date:'',
                            validation:'0',
                          };         
              vm.alldemande_realimentation.push(items);                          
              vm.selectedItemDemande_realimentation = items;
              NouvelItemDemande_realimentation = true ;
          }else
          {
              vm.showAlert('Ajout demande_realimentation','Un formulaire d\'ajout est déjà ouvert!!!');
          }
          
        };
        vm.change_convention = function(item)
        { console.log(item) ; 
        var conve = vm.allconvention_cisco_feffi_entete.filter(function(obj) //demande!=rejeter
                      {return obj.id == item.id_convention_cife_entete; });

          apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',conve[0].feffi.id).then(function(result)
            {
              vm.allcompte_feffi= result.data.response; 
              console.log(vm.allcompte_feffi) ; 
              console.log(conve) ;          
            });
          apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi","id_convention_cife_entete",item.id_convention_cife_entete).then(function(result)
          {
                vm.alldemande_realimentation_conv = result.data.response; 
                console.log(vm.alldemande_realimentation_conv);

                var last_id_demande = Math.max.apply(Math, vm.alldemande_realimentation_conv.map(function(o)
                {return o.id;})); console.log(last_id_demande);

                vm.verifiLastedemande = vm.alldemande_realimentation_conv.filter(function(obj)
                {return obj.id == last_id_demande;});console.log(vm.verifiLastedemande);

                if (vm.verifiLastedemande.length>0)
                {
                    if (vm.verifiLastedemande[0].validation == 3 || vm.verifiLastedemande[0].validation == 6)
                    {
                      var demande_realimentation_conv_fe = vm.alldemande_realimentation_conv.filter(function(obj) //demande!=rejeter
                      {return obj.validation != 6; });

                      
                      if(demande_realimentation_conv_fe.length>0)
                        {
                            var last_tranche_demande = Math.max.apply(Math, demande_realimentation_conv_fe.map(function(o)
                            {return o.tranche.code.split(' ')[1];}));

                            vm.dernierdemande = demande_realimentation_conv_fe.filter(function(obj)
                            {return obj.tranche.code == 'tranche '+last_tranche_demande;});

                            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
                            {return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                        }
                          else
                          {
                              vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
                              {return obj.code == 'tranche 1';});
                              vm.dernierdemande = [];
                          }
                    }
                    else
                    {
                      vm.showAlert('Le dernier demande est en cours de traitement!!!');
                      vm.allcurenttranche_deblocage_feffi = [];
                    }
                }
                else
                {
                  vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
                  {return obj.code == 'tranche 1';});
                  vm.dernierdemande = [];
                }
          });
          
        }
       /* vm.ajouterDemande_realimentation = function ()
        { 
          var last_id_demande = Math.max.apply(Math, vm.alldemande_realimentation.map(function(o)
          {return o.id;})); console.log(last_id_demande);

          vm.verifiLastedemande = vm.alldemande_realimentation.filter(function(obj)
          {return obj.id == last_id_demande;});console.log(vm.verifiLastedemande);

          if (vm.verifiLastedemande.length>0)
          {
              if (vm.verifiLastedemande[0].validation == 3 || vm.verifiLastedemande[0].validation == 6)
              {
                var demande_realimentation_fe = vm.alldemande_realimentation.filter(function(obj) //demande!=rejeter
                {return obj.validation != 6; });

                
                if(demande_realimentation_fe.length>0)
                  {
                      var last_tranche_demande = Math.max.apply(Math, demande_realimentation_fe.map(function(o)
                      {return o.tranche.code.split(' ')[1];}));

                      vm.dernierdemande = demande_realimentation_fe.filter(function(obj)
                      {return obj.tranche.code == 'tranche '+last_tranche_demande;});

                      vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
                      {return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                  }
                    else
                    {
                        vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
                        {return obj.code == 'tranche 1';});
                        vm.dernierdemande = [];
                    }

                        if (NouvelItemDemande_realimentation == false)
                        {
                          var items = {
                            $edit: true,
                            $selected: true,
                            id: '0',
                            id_compte_feffi: '',
                            tranche: '',
                            cumul: '',
                            anterieur: '',
                            periode: '',
                            pourcentage:'',
                            reste:'',
                            date:'',
                            validation:'0',
                          };         
                          vm.alldemande_realimentation.push(items);
                          
                          vm.selectedItemDemande_realimentation = items;
                           

                          NouvelItemDemande_realimentation = true ;
                        }else
                        {
                          vm.showAlert('Ajout demande_realimentation','Un formulaire d\'ajout est déjà ouvert!!!');
                        }
              }
              else
              {
                vm.showAlert('Le dernier demande est en cours de traitement!!!');
              }
          }
          else
          {
            vm.allcurenttranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
            {return obj.code == 'tranche 1';});
            vm.dernierdemande = [];

            if (NouvelItemDemande_realimentation == false)
            {
                var items = {
                            $edit: true,
                            $selected: true,
                            id: '0',
                            id_compte_feffi: '',
                            tranche: '',
                            cumul: '',
                            anterieur: '',
                            periode: '',
                            pourcentage:'',
                            reste:'',
                            date:'',
                            validation:'0',
                          };         
                vm.alldemande_realimentation.push(items);
                          
                vm.selectedItemDemande_realimentation = items;
                           

                NouvelItemDemande_realimentation = true ;
            }else
            {
                vm.showAlert('Ajout demande_realimentation','Un formulaire d\'ajout est déjà ouvert!!!');
            }
          }
          
        };*/

        //fonction ajout dans bdd
        function ajoutDemande_realimentation(demande_realimentation,suppression)
        {
            if (NouvelItemDemande_realimentation==false)
            {
                test_existanceDemande_realimentation (demande_realimentation,suppression); 
            } 
            else
            {
                insert_in_baseDemande_realimentation(demande_realimentation,suppression);
            }
        }

        //fonction de bouton d'annulation demande_realimentation
        vm.annulerDemande_realimentation = function(item)
        {
          if (NouvelItemDemande_realimentation == false)
          {
            item.$edit     = false;
            item.$selected = false;

            item.id_compte_feffi = currentItemDemande_realimentation.id_compte_feffi ;
            item.id_tranche_deblocage_feffi = currentItemDemande_realimentation.id_tranche_deblocage_feffi ;
            item.cumul = currentItemDemande_realimentation.cumul ;
            item.anterieur = currentItemDemande_realimentation.anterieur ;
            item.periode = currentItemDemande_realimentation.periode ;
            item.pourcentage = currentItemDemande_realimentation.pourcentage ;
            item.reste = currentItemDemande_realimentation.reste ;
            item.date = currentItemDemande_realimentation.date ;
            item.validation = currentItemDemande_realimentation.validation;
            item.id_convention_cife_entete = currentItemDemande_realimentation.id_convention_cife_entete ;
            vm.showbuttonValidation = false;
            //item.date_approbation = currentItemDemande_realimentation.date_approbation ;
          }else
          {
            vm.alldemande_realimentation = vm.alldemande_realimentation.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_realimentation.id;
            });
          }

          vm.selectedItemDemande_realimentation = {} ;
          NouvelItemDemande_realimentation      = false;
          vm.modificationdemande = false;
          
        };

        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            currentItemDemande_realimentation     = JSON.parse(JSON.stringify(vm.selectedItemDemande_realimentation));
           //recuperation donnée demande_realimentation_feffi
            apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',item.id).then(function(result)
            {
                vm.allpiece_justificatif_feffi = result.data.response;
                console.log(vm.allpiece_justificatif_feffi);
            });
            vm.stepOne = true; 
            vm.stepTwo = false;
            vm.showbuttonValidation = true;
            if (item.$edit ==true) {
              vm.showbuttonValidation = false;
            }
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation) return;
             vm.alldemande_realimentation.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });

        //fonction masque de saisie modification item convention_cisco_feffi_entete
        vm.modifierDemande_realimentation = function(item)
        {
            NouvelItemDemande_realimentation = false ;
            vm.selectedItemDemande_realimentation = item;
            currentItemDemande_realimentation = angular.copy(vm.selectedItemDemande_realimentation);
            $scope.vm.alldemande_realimentation.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.id_compte_feffi = vm.selectedItemDemande_realimentation.compte_feffi.id ;
            item.id_tranche_deblocage_feffi = vm.selectedItemDemande_realimentation.tranche.id ;
            item.cumul = vm.selectedItemDemande_realimentation.cumul ;
            item.anterieur = vm.selectedItemDemande_realimentation.anterieur ;
            item.periode = vm.selectedItemDemande_realimentation.tranche.periode ;
            item.pourcentage = vm.selectedItemDemande_realimentation.tranche.pourcentage ;
            item.reste = vm.selectedItemDemande_realimentation.reste ;
            item.date = vm.selectedItemDemande_realimentation.date ;
            item.validation = vm.selectedItemDemande_realimentation.validation;
            item.id_convention_cife_entete = vm.selectedItemDemande_realimentation.convention_cife_entete.id;
            vm.modificationdemande = true;
            vm.showbuttonValidation = false;
            //item.date_approbation = vm.selectedItemDemande_realimentation.date_approbation ;  
        };

        //fonction bouton suppression item convention_cisco_feffi_entete
        vm.supprimerDemande_realimentation = function()
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
                vm.ajoutDemande_realimentation(vm.selectedItemDemande_realimentation,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_cisco_feffi_entete
        function test_existanceDemande_realimentation (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_realimentation.filter(function(obj)
                {
                   return obj.id == currentItemDemande_realimentation.id;
                });
                if(dema[0])
                {
                   if((dema[0].id_compte_feffi != currentItemDemande_realimentation.id_compte_feffi )
                    || (dema[0].id_tranche_deblocage_feffi != currentItemDemande_realimentation.id_tranche_deblocage_feffi )
                    || (dema[0].cumul != currentItemDemande_realimentation.cumul )
                    || (dema[0].anterieur != currentItemDemande_realimentation.anterieur )
                    || (dema[0].periode != currentItemDemande_realimentation.periode )
                    || (dema[0].pourcentage != currentItemDemande_realimentation.pourcentage )
                    || (dema[0].reste != currentItemDemande_realimentation.reste )
                    || (dema[0].date != currentItemDemande_realimentation.date )
                    || (dema[0].id_convention_cife_entete != currentItemDemande_realimentation.id_convention_cife_entete ))                    
                      { 
                        insert_in_baseDemande_realimentation(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_realimentation(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function insert_in_baseDemande_realimentation(demande_realimentation,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_realimentation==false)
            {
                getId = vm.selectedItemDemande_realimentation.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    id_compte_feffi: demande_realimentation.id_compte_feffi ,
                    id_tranche_deblocage_feffi: demande_realimentation.id_tranche_deblocage_feffi ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: 0 ,
                    id_convention_cife_entete: demande_realimentation.id_convention_cife_entete              
                });
                //console.log(demande_realimentation.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                var comp = vm.allcompte_feffi.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_compte_feffi;
                });

                var tran= vm.alltranche_deblocage_feffi.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_tranche_deblocage_feffi;
                });
                var conv= vm.allconvention_cisco_feffi_entete.filter(function(obj)
                {
                    return obj.id == demande_realimentation.id_convention_cife_entete;
                });

                if (NouvelItemDemande_realimentation == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_realimentation.compte_feffi = comp[0];
                        vm.selectedItemDemande_realimentation.tranche = tran[0] ;
                        vm.selectedItemDemande_realimentation.convention_cife_entete = conv[0] ;
                        /*vm.selectedItemDemande_realimentation.cumul = demande_realimentation.cumul ;
                        vm.selectedItemDemande_realimentation.anterieur = demande_realimentation.anterieur ;
                        vm.selectedItemDemande_realimentation.periode = tran[0].periode ;
                        vm.selectedItemDemande_realimentation.pourcentage = tran[0].pourcentage ;
                        vm.selectedItemDemande_realimentation.reste = demande_realimentation.reste ;
                        vm.selectedItemDemande_realimentation.date = demande_realimentation.date ;
                        vm.selectedItemDemande_realimentation.validation = 0;*/
                        //vm.selectedItemDemande_realimentation.date_approbation = demande_realimentation.date_approbation ;
                        vm.selectedItemDemande_realimentation.$selected  = false;
                        vm.selectedItemDemande_realimentation.$edit      = false;
                        vm.selectedItemDemande_realimentation ={};
                    }
                    else 
                    {    
                      vm.alldemande_realimentation = vm.alldemande_realimentation.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_realimentation.id;
                      });
                    }
                }
                else
                {
                  //demande_realimentation.objet = demande_realimentation.objet ;
                  demande_realimentation.tranche = tran[0] ;
                  demande_realimentation.compte_feffi = comp[0];
                  demande_realimentation.convention_cife_entete = conv[0] ;
                  /*demande_realimentation.cumul = demande_realimentation.cumul ;
                  demande_realimentation.anterieur = demande_realimentation.anterieur ;
                  demande_realimentation.periode = tran[0].periode ;
                  demande_realimentation.pourcentage = tran[0].pourcentage ;
                  demande_realimentation.reste = demande_realimentation.reste ;
                  demande_realimentation.validation = 0;*/
                  //demande_realimentation.date_approbation = demande_realimentation.date_approbation ;

                  demande_realimentation.id  =   String(data.response);              
                  NouvelItemDemande_realimentation=false;
            }
              demande_realimentation.$selected = false;
              demande_realimentation.$edit = false;
              vm.selectedItemDemande_realimentation = {};
              vm.modificationdemande = false;
              vm.showbuttonValidation = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.tranchechange = function(item)
        { 
          console.log('eeeee');
          var reste = 0;
          var anterieur = 0;
          var prevu = 0;
          var cumul= 0;
          /*switch(vm.allcurenttranche_deblocage_feffi[0].code)
          {
              case 'trance 1':
              {   prevu = vm.allconvention_cisco_feffi_entete[0].montant_divers+((vm.allconvention_cisco_feffi_entete[0].montant_trav_mob * vm.allcurenttranche_deblocage_feffi[0].pourcentage)/100);
                  return prevu;
                  break;
              }

              default:
              {
                  prevu = (vm.allconvention_cisco_feffi_entete[0].montant_trav_mob * vm.allcurenttranche_deblocage_feffi[0].pourcentage)/100;
                  return prevu;
                  break;
              }
          }*/
          if (vm.allcurenttranche_deblocage_feffi[0].code =='tranche 1')
            {
              prevu = parseInt(vm.allconvention_cisco_feffi_entete[0].montant_divers)+((parseInt(vm.allconvention_cisco_feffi_entete[0].montant_trav_mob) * parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100);
            console.log(prevu);
            } 
            else 
            {
              prevu = (parseInt(vm.allconvention_cisco_feffi_entete[0].montant_trav_mob )* parseInt(vm.allcurenttranche_deblocage_feffi[0].pourcentage))/100;
            console.log(prevu);
            }

          cumul = prevu;
 console.log( vm.alldemande_realimentation_conv) ;
          if (vm.alldemande_realimentation_conv.length>0
            )
          {                 
              anterieur = vm.dernierdemande[0].prevu; console.log( anterieur) ;         
              cumul = prevu + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= vm.allconvention_cisco_feffi_entete[0].montant_total - cumul;

          item.periode = vm.allcurenttranche_deblocage_feffi[0].periode;
          item.pourcentage = vm.allcurenttranche_deblocage_feffi[0].pourcentage;

          item.prevu = prevu;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          //console.log(prevu + parseInt(vm.dernierdemande[0].cumul));
          
          if(NouvelItemDemande_realimentation==false)
          {
            

          }
        }

        vm.valider_convention = function()
        {
            validation_in_baseDemande_realimentation(vm.selectedItemDemande_realimentation,0,1);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi_entete
        function validation_in_baseDemande_realimentation(demande_realimentation,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };

            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_realimentation.id,      
                    id_compte_feffi: demande_realimentation.compte_feffi.id ,
                    id_tranche_deblocage_feffi: demande_realimentation.tranche.id ,
                    prevu: demande_realimentation.prevu ,
                    cumul: demande_realimentation.cumul ,
                    anterieur: demande_realimentation.anterieur ,
                    reste: demande_realimentation.reste ,
                    date: convertionDate(new Date(demande_realimentation.date)) ,
                    validation: validation ,
                    id_convention_cife_entete: demande_realimentation.convention_cife_entete.id              
                });

                //factory
            apiFactory.add("demande_realimentation_feffi/index",datas, config).success(function (data)
            {
                vm.selectedItemDemande_realimentation.validation = validation;
                        
                //vm.alldemande_realimentation_valide.push(vm.selectedItemDemande_realimentation);
                

                vm.alldemande_realimentation = vm.alldemande_realimentation.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemDemande_realimentation.id;
                });
                vm.showbuttonValidation = false;
                vm.selectedItemDemande_realimentation.$selected  = false;
                vm.selectedItemDemande_realimentation.$edit      = false;
                vm.selectedItemDemande_realimentation ={};

            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
  /*****************Fin StepTwo demande_realimentation_feffi****************/

  /*****************Fin StepThree piece_justificatif_feffi****************/

  vm.piece_justificatif_feffi_column = [
        {titre:"Description"},
        {titre:"Fichier"},
        {titre:"Date"},
        {titre:"Action"}];

  $scope.uploadFile = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemPiece_justificatif_feffi.fichier = vm.myFile[0].name;
        } 

        //Masque de saisi ajout
        vm.ajouterPiece_justificatif_feffi = function ()
        { 
          if (NouvelItemPiece_justificatif_feffi == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              description: '',
              fichier:'',
              date: ''
            };         
            vm.allpiece_justificatif_feffi.push(items);
            vm.selectedItemPiece_justificatif_feffi = items;
             

            NouvelItemPiece_justificatif_feffi = true ;
          }else
          {
            vm.showAlert('Ajout piece_justificatif_feffi','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                test_existancePiece_justificatif_feffi (piece_justificatif_feffi,suppression); 
            } 
            else
            {
                insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation piece_justificatif_feffi
        vm.annulerPiece_justificatif_feffi = function(item)
        {
          if (NouvelItemPiece_justificatif_feffi == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.description = currentItemPiece_justificatif_feffi.description ;
            item.fichier = currentItemPiece_justificatif_feffi.fichier ;
            item.date        = currentItemPiece_justificatif_feffi.date ;  
          }else
          {
            vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
            });
          }

          vm.selectedItemPiece_justificatif_feffi = {} ;
          NouvelItemPiece_justificatif_feffi      = false;
          
        };

        //fonction selection item Piece_justificatif_feffi
        vm.selectionPiece_justificatif_feffi= function (item)
        {
            vm.selectedItemPiece_justificatif_feffi = item;
            currentItemPiece_justificatif_feffi     = JSON.parse(JSON.stringify(vm.selectedItemPiece_justificatif_feffi));
           // vm.allconvention_cisco_feffi_entete= [] ; 
        };
        $scope.$watch('vm.selectedItemPiece_justificatif_feffi', function()
        {
             if (!vm.allpiece_justificatif_feffi) return;
             vm.allpiece_justificatif_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPiece_justificatif_feffi.$selected = true;
        });

        //fonction masque de saisie modification item piece_justificatif_feffi
        vm.modifierPiece_justificatif_feffi = function(item)
        {
            NouvelItemPiece_justificatif_feffi = false ;
            vm.selectedItemPiece_justificatif_feffi = item;
            currentItemPiece_justificatif_feffi = angular.copy(vm.selectedItemPiece_justificatif_feffi);
            $scope.vm.allpiece_justificatif_feffi.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.description = vm.selectedItemPiece_justificatif_feffi.description ;
            item.fichier = vm.selectedItemPiece_justificatif_feffi.fichier ;
            item.date    = new Date(vm.selectedItemPiece_justificatif_feffi.date );  
        };

        //fonction bouton suppression item Piece_justificatif_feffi
        vm.supprimerPiece_justificatif_feffi = function()
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
                vm.ajoutPiece_justificatif_feffi(vm.selectedItemPiece_justificatif_feffi,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_cisco_feffi_entete
        function test_existancePiece_justificatif_feffi (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.allpiece_justificatif_feffi.filter(function(obj)
                {
                   return obj.id == currentItemPiece_justificatif_feffi.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItemPiece_justificatif_feffi.description)
                    || (dema[0].fichier!=currentItemPiece_justificatif_feffi.fichier)
                    || (dema[0].date!=currentItemPiece_justificatif_feffi.date))                    
                      { 
                        insert_in_basePiece_justificatif_feffi(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePiece_justificatif_feffi(item,suppression);
        }

         function insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                getId = vm.selectedItemPiece_justificatif_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description: piece_justificatif_feffi.description,
                    fichier: piece_justificatif_feffi.fichier,
                    date: convertionDate(new Date(piece_justificatif_feffi.date)),
                    id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                    validation: 0               
                });
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
            {   

              if (NouvelItemPiece_justificatif_feffi == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'piece_justificatif_feffi/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemPiece_justificatif_feffi.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemDemande_realimentation.convention_cife_entete.ref_convention+'_'+getIdFile+'_attachement' ;

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
                                    piece_justificatif_feffi.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      description: piece_justificatif_feffi.description,
                                                      fichier: piece_justificatif_feffi.fichier,
                                                      date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                                      id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                                      validation: 0 
                                        });
                                      apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          piece_justificatif_feffi.$selected = false;
                                          piece_justificatif_feffi.$edit = false;
                                          vm.selectedItemPiece_justificatif_feffi = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: piece_justificatif_feffi.description,
                                        fichier: piece_justificatif_feffi.fichier,
                                        date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                        id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                        validation: 0                
                                    });
                                  apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                  {
                                        
                                      piece_justificatif_feffi.$selected = false;
                                      piece_justificatif_feffi.$edit = false;
                                      vm.selectedItemPiece_justificatif_feffi = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }


                        vm.selectedItemPiece_justificatif_feffi.$selected  = false;
                        vm.selectedItemPiece_justificatif_feffi.$edit      = false;
                        vm.selectedItemPiece_justificatif_feffi ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemPiece_justificatif_feffi.fichier;
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
                          vm.showAlert(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  piece_justificatif_feffi.id  =   String(data.response);              
                  NouvelItemPiece_justificatif_feffi = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'piece_justificatif_feffi/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemDemande_realimentation.convention_cife_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              piece_justificatif_feffi.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                description: piece_justificatif_feffi.description,
                                                fichier: piece_justificatif_feffi.fichier,
                                                date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                                id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                                validation: 0 
                                  });
                                apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    piece_justificatif_feffi.$selected = false;
                                    piece_justificatif_feffi.$edit = false;
                                    vm.selectedItemPiece_justificatif_feffi = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                            console.log(data['nomFile']);
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: piece_justificatif_feffi.description,
                                  fichier: piece_justificatif_feffi.fichier,
                                  date: convertionDate(new Date(piece_justificatif_feffi.date)),
                                  id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                                  validation: 0                
                              });
                            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                            {
                                  
                                piece_justificatif_feffi.$selected = false;
                                piece_justificatif_feffi.$edit = false;
                                vm.selectedItemPiece_justificatif_feffi = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              piece_justificatif_feffi.$selected = false;
              piece_justificatif_feffi.$edit = false;
              vm.selectedItemPiece_justificatif_feffi = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
         vm.download_piece_justificatif = function(item)
        {//console.log(item.fichier);
            window.location = apiUrlFile+item.fichier;
        }

        //insertion ou mise a jours ou suppression item dans bdd Piece_justificatif_feffi
       /* function insert_in_basePiece_justificatif_feffi(piece_justificatif_feffi,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPiece_justificatif_feffi==false)
            {
                getId = vm.selectedItemPiece_justificatif_feffi.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description:  piece_justificatif_feffi.description,
                    fichier:  piece_justificatif_feffi.fichier,
                    date: convertionDate(new Date(piece_justificatif_feffi.date)),
                    id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                    validation: 0               
                });
                //console.log(demande_deblocage.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
            {
               var file       = vm.myFile[0];
                var repertoire = 'piece_justificatif_demande_feffi/';
                var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                var getIdFile = 0;

                if (NouvelItemPiece_justificatif_feffi==false)
                {
                    getIdFile = vm.selectedItemPiece_justificatif_feffi.id; 
                }
                else
                { 
                 getIdFile = String(data.response);
                }

                var name_file = vm.selectedItemConvention_cisco_feffi_entete.numero_convention+'_'+getIdFile+'_attachement' ;
                
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
                          piece_justificatif_feffi.fichier='';
                          var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description:  piece_justificatif_feffi.description,
                              fichier:  piece_justificatif_feffi.fichier,
                              date: convertionDate(new Date(piece_justificatif_feffi.date)),
                              id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                              validation: 0               
                          });
                            apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                            {
                              if (NouvelItemPiece_justificatif_feffi == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {
                                      vm.selectedItemPiece_justificatif_feffi.description = piece_justificatif_feffi.description;
                                      
                                      vm.selectedItemPiece_justificatif_feffi.fichier = piece_justificatif_feffi.fichier;
                                      vm.selectedItemPiece_justificatif_feffi.date     = piece_justificatif_feffi.date;
                                      vm.selectedItemPiece_justificatif_feffi.$selected  = false;
                                      vm.selectedItemPiece_justificatif_feffi.$edit      = false;
                                      vm.selectedItemPiece_justificatif_feffi ={};
                                  }
                                  else 
                                  {    
                                    vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
                                    });
                                  }
                              }
                              else
                              {
                                piece_justificatif_feffi.description = piece_justificatif_feffi.description;
                                
                                piece_justificatif_feffi.fichier = piece_justificatif_feffi.fichier;
                                piece_justificatif_feffi.date        = piece_justificatif_feffi.date;
                                piece_justificatif_feffi.id  =   String(data.response);              
                                NouvelItemPiece_justificatif_feffi=false;
                              }
                            piece_justificatif_feffi.$selected = false;
                            piece_justificatif_feffi.$edit = false;
                            vm.selectedItemPiece_justificatif_feffi = {};
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                        });
                      }
                      else
                      {
                        piece_justificatif_feffi.fichier=repertoire+data['nomFile'];
                        var datas = $.param({
                              supprimer: suppression,
                              id:        getIdFile,
                              description:  piece_justificatif_feffi.description,
                              fichier:  piece_justificatif_feffi.fichier,
                              date: convertionDate(new Date(piece_justificatif_feffi.date)),
                              id_demande_rea_feffi:   vm.selectedItemDemande_realimentation.id,
                              validation: 0               
                          });
                        apiFactory.add("piece_justificatif_feffi/index",datas, config).success(function (data)
                            {
                              if (NouvelItemPiece_justificatif_feffi == false)
                              {
                                  // Update or delete: id exclu                 
                                  if(suppression==0)
                                  {
                                      vm.selectedItemPiece_justificatif_feffi.description = piece_justificatif_feffi.description;
                                      
                                      vm.selectedItemPiece_justificatif_feffi.fichier = piece_justificatif_feffi.fichier;
                                      vm.selectedItemPiece_justificatif_feffi.date     = piece_justificatif_feffi.date;
                                      vm.selectedItemPiece_justificatif_feffi.$selected  = false;
                                      vm.selectedItemPiece_justificatif_feffi.$edit      = false;
                                      vm.selectedItemPiece_justificatif_feffi ={};
                                  }
                                  else 
                                  {    
                                    vm.allpiece_justificatif_feffi = vm.allpiece_justificatif_feffi.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemPiece_justificatif_feffi.id;
                                    });
                                  }
                              }
                              else
                              {
                                piece_justificatif_feffi.description = piece_justificatif_feffi.description;
                                
                                piece_justificatif_feffi.fichier = piece_justificatif_feffi.fichier;
                                piece_justificatif_feffi.date        = piece_justificatif_feffi.date;
                                piece_justificatif_feffi.id  =   String(data.response);              
                                NouvelItemPiece_justificatif_feffi=false;
                              }
                            piece_justificatif_feffi.$selected = false;
                            piece_justificatif_feffi.$edit = false;
                            vm.selectedItemPiece_justificatif_feffi = {};
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                      }
                  }).error(function()
                  {
                    vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                  });
                }
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }*/

  /*****************Fin StepThree piece_justificatif_feffi****************/ 
        

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

        //convertion date au format AAAA-MM-JJ
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
    }
})();