(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf')
        .directive('customOnChangepiecedaaf', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangepiecedaaf);
            element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          if((files[0].size/1024/1024)>20)
            {
                ngModel.$setViewValue(null);
                var confirm = $mdDialog.confirm()
                    .title('Cet action n\'est pas autorisé')
                    .textContent('La taille doit être inferieur à 20MB')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    ngModel.$setViewValue(null);
                    element.val(null);
                    scope.justificatif_daaf.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.justificatif_daaf.fichier = files[0].name;
            } 
        });
        }
      };
    })
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
        .controller('Demande_deblocage_daafController', Demande_deblocage_daafController)
    /** @ngInject */
    function Demande_deblocage_daafController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		  var vm    = this;

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;
        vm.stepThree   = false;
        vm.affiche_load =true;
        vm.myFile = [];

        //initialisation convention_ufp_daaf_entete
        vm.selectedItemConvention_ufp_daaf_entete = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;

     //initialisation demande_deblocage_daaf
      vm.ajoutDemande_deblocage_daaf  = ajoutDemande_deblocage_daaf ;
        var NouvelItemDemande_deblocage_daaf    = false;     
        var currentItemDemande_deblocage_daaf;
        vm.selectedItemDemande_deblocage_daaf = {} ;
        vm.alldemande_deblocage_daaf  = [] ; 
        vm.allcompte_daaf = [];

    //initialisation justificatif_daaf
        vm.ajoutJustificatif_daaf = ajoutJustificatif_daaf;
        var NouvelItemJustificatif_daaf=false;
        var currentItemJustificatif_daaf;
        vm.selectedItemJustificatif_daaf = {} ;
        vm.alljustificatif_daaf = [] ;
        vm.modificationdemande = false;
        vm.myFile={};
    //initialisation convention_cife_detail    
        vm.allconvention_cife_detail  = [] ;

        vm.allcurenttranche_deblocage_daaf = [];
        vm.alltranche_deblocage_daaf = [];
        vm.demande_deblocage_daaf = [];

        vm.date_now         = new Date();
        var annee = vm.date_now.getFullYear();

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        //recuperation donnée tranche deblocage feffi
        apiFactory.getAll("tranche_deblocage_daaf/index").then(function(result)
        {
          vm.alltranche_deblocage_daaf= result.data.response;
          vm.allcurenttranche_deblocage_daaf = result.data.response;
          console.log(vm.allcurenttranche_deblocage_daaf);
        });
       
       
        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionByfiltre',
              'date_debut',date_debut,'date_fin',date_fin).then(function(result)
              {
                  vm.allconvention_ufp_daaf_entete = result.data.response; 
                  vm.affiche_load =false;
              });
        }
        apiFactory.getAll("compte_daaf/index").then(function(result)
        {
            vm.allcompte_daaf = result.data.response;
        });

  /*****************Debut StepOne convention_ufp_daaf_entete***************/

  //recuperation donnée convention_ufp_daaf_entete
        apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionByinvalidedemande').then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
            vm.affiche_load =false;
        });

        //col table
        vm.convention_ufp_daaf_entete_column = [
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Montant convention"},        
        {titre:"Numero vague"},        
        {titre:"Nombre bénéficiaire"}
        ];
        
        

        //fonction selection item convetion
        vm.selectionConvention_ufp_daaf_entete = function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;    
            
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;

           //recuperation donnée demande
            
            //recuperation donnée convention_ufp_daaf_detail
            /*apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',item.id).then(function(result)
            {
                vm.allconvention_ufp_daaf_detail = result.data.response;                
                vm.allcompte_daaf[0]=vm.allconvention_ufp_daaf_detail[0].compte_daaf;
                console.log(vm.allconvention_ufp_daaf_detail);
                console.log(vm.allcompte_daaf);
            });*/
           
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_entete', function()
        {
             if (!vm.allconvention_ufp_daaf_entete) return;
             vm.allconvention_ufp_daaf_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_ufp_daaf_entete.$selected = true;

        });  
        vm.affichevague = function(num_vague)
        {
          var affiche = 'Première vague';
          if (num_vague==2)
          {
            affiche= 'Deuxième vague';
          }
          return affiche;
        }           

  /*****************Fin StepOne convention_ufp_daaf_entete****************/
  //recuperation donnée demande
           /* apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf_invalide","validation",0).then(function(result)
            {
                vm.alldemande_deblocage_daaf = result.data.response; 
                console.log(vm.alldemande_deblocage_daaf );
            });*/

  /*****************Debut StepTwo demande_deblocage_daaf****************/
  vm.step_menu_demande_daaf = function()
  { 
    vm.affiche_load = true;
    apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemandeByvalidationconvention","id_convention_ufp_daaf_entete",vm.selectedItemConvention_ufp_daaf_entete.id,'validation',0).then(function(result)
    {
        vm.alldemande_deblocage_daaf = result.data.response;
        vm.affiche_load = false;
    });

  }

      vm.demande_deblocage_daaf_column = [        
        {titre:"Réference demande"},
        {titre:"Objet"},       
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Action"}];    
        
        vm.ajouterDemande_deblocage_daaf = function ()
        { 

            if (NouvelItemDemande_deblocage_daaf == false)
            {
                var items =
                {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  id_compte_daaf: '',
                  tranche: '',
                  cumul: '',
                  anterieur: '',
                  periode: '',
                  pourcentage:'',
                  reste:'',
                  date:'',
                  ref_demande:'',
                  objet:'',
                  validation:'0',
                };         
                

                apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf","id_convention_ufp_daaf_entete",vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
                { 
                  vm.alldemande_deblocage_daaf_conv = result.data.response;
                  
                  var last_id_demande = Math.max.apply(Math, vm.alldemande_deblocage_daaf_conv.map(function(o)
                  {return o.id;}));

                  vm.dernierdemande = vm.alldemande_deblocage_daaf_conv.filter(function(obj)
                  {return obj.id == last_id_demande;});
                  
                  if (vm.dernierdemande.length>0)
                  {
                    var last_tranche_demande = Math.max.apply(Math, vm.dernierdemande.map(function(o){return o.tranche.code.split(' ')[1];}));
                      //3 validéufp 4 rejeté                   

                      switch (parseInt(vm.dernierdemande[0].validation))
                      {
                        case 3:     //valide ufp

                            vm.allcurenttranche_deblocage_daaf = vm.alltranche_deblocage_daaf.filter(function(obj)
                              {return obj.code == 'tranche '+(parseInt(last_tranche_demande)+1);});
                              
                              vm.alldemande_deblocage_daaf.push(items);                                  
                              vm.selectedItemDemande_deblocage_daaf = items;
                              NouvelItemDemande_deblocage_daaf = true ;
                             
                            break;

                        case 2: //rejeter 
                            
                              vm.allcurenttranche_deblocage_daaf = vm.alltranche_deblocage_daaf.filter(function(obj)
                              {return obj.code == 'tranche '+parseInt(last_tranche_demande);});
                              vm.alldemande_deblocage_daaf.push(items);                                  
                              vm.selectedItemDemande_deblocage_daaf = items;
                              NouvelItemDemande_deblocage_daaf = true ;
                              vm.dernierdemande = [];
                            break;

                        default:

                            vm.showAlert('La dernière demande est en cours de traitement!!!');
                            vm.allcurenttranche_deblocage_daaf = [];
                            break;
                    
                      }
                  }
                  else
                  {
                      vm.allcurenttranche_deblocage_daaf = vm.alltranche_deblocage_daaf.filter(function(obj)
                      {return obj.code == 'tranche 1';});
                      vm.alldemande_deblocage_daaf.push(items);                                  
                      vm.selectedItemDemande_deblocage_daaf = items;
                      NouvelItemDemande_deblocage_daaf = true ;
                       vm.dernierdemande = [];
                       
                  }
                });
            }
            else
            {
              vm.showAlert('Ajout demande_deblocage_daaf','Un formulaire d\'ajout est déjà ouvert!!!');
            }
                              
        }       

        //fonction ajout dans bdd
        function ajoutDemande_deblocage_daaf(demande_deblocage_daaf,suppression)
        {
            if (NouvelItemDemande_deblocage_daaf==false)
            {
                apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index",'menu',"getdemande_deblocageById",'id_demande_deblocage_daaf',demande_deblocage_daaf.id).then(function(result)
                {
                  var demande_deblocage_valide = result.data.response;
                  if (demande_deblocage_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.alldemande_deblocage_daaf = vm.alldemande_deblocage_daaf.filter(function(obj)
                      {
                          return obj.id !== demande_deblocage_daaf.id;
                      });
                      vm.stepTwo=false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceDemande_deblocage_daaf (demande_deblocage_daaf,suppression);     
                  }
                }); 
            } 
            else
            {
                insert_in_baseDemande_deblocage_daaf(demande_deblocage_daaf,suppression);
            }
        }

        //fonction de bouton d'annulation demande_deblocage_daaf
        vm.annulerDemande_deblocage_daaf = function(item)
        {
          if (NouvelItemDemande_deblocage_daaf == false)
          {
            item.$edit     = false;
            item.$selected = false;

            item.id_compte_feffi = currentItemDemande_deblocage_daaf.id_compte_feffi ;
            item.id_tranche_deblocage_daaf = currentItemDemande_deblocage_daaf.id_tranche_deblocage_daaf ;
            item.cumul = currentItemDemande_deblocage_daaf.cumul ;
            item.anterieur = currentItemDemande_deblocage_daaf.anterieur ;
            item.periode = currentItemDemande_deblocage_daaf.periode ;
            item.pourcentage = currentItemDemande_deblocage_daaf.pourcentage ;
            item.reste = currentItemDemande_deblocage_daaf.reste ;
            item.date = currentItemDemande_deblocage_daaf.date ;
            item.validation = currentItemDemande_deblocage_daaf.validation;
            //item.id_convention_ufp_daaf_entete = currentItemDemande_deblocage_daaf.id_convention_ufp_daaf_entete;
            //item.date_approbation = currentItemDemande_deblocage_daaf.date_approbation ;
          }else
          {
            vm.alldemande_deblocage_daaf = vm.alldemande_deblocage_daaf.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_deblocage_daaf.id;
            });
          }

          vm.selectedItemDemande_deblocage_daaf = {} ;
          NouvelItemDemande_deblocage_daaf      = false;
          vm.modificationdemande = false;
          vm.showbuttonValidation =false;
        };

        //fonction selection item region
        vm.selectionDemande_deblocage_daaf= function (item)
        {
            vm.selectedItemDemande_deblocage_daaf = item;
            //recuperation donnée demande_deblocage_daaf
            if (item.$edit==false || item.$edit==undefined)
            {
              currentItemDemande_deblocage_daaf     = JSON.parse(JSON.stringify(vm.selectedItemDemande_deblocage_daaf));                         
            } 
            vm.stepTwo = true; 
            vm.stepThree = false;
        };
        $scope.$watch('vm.selectedItemDemande_deblocage_daaf', function()
        {
             if (!vm.alldemande_deblocage_daaf) return;
             vm.alldemande_deblocage_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage_daaf.$selected = true;
        });

        //fonction masque de saisie modification item convention_ufp_daaf_entete
        vm.modifierDemande_deblocage_daaf = function(item)
        {
            NouvelItemDemande_deblocage_daaf = false ;
            vm.selectedItemDemande_deblocage_daaf = item;
            currentItemDemande_deblocage_daaf = angular.copy(vm.selectedItemDemande_deblocage_daaf);
            $scope.vm.alldemande_deblocage_daaf.forEach(function(dema) {
              dema.$edit = false;
            });console.log(item);
            //console.log(vm.selectionDemande_deblocage_daaf.compte_daaf);
           // apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
           // {
                //vm.allconvention_ufp_daaf_detail = result.data.response;
               // console.log(item) ;                
                //vm.allcompte_daaf.push(result.data.response[0].compte_daaf);

                item.$edit = true;
                item.$selected = true;

                item.id_compte_daaf = vm.selectedItemDemande_deblocage_daaf.compte_daaf.id ;
                item.id_tranche_deblocage_daaf = vm.selectedItemDemande_deblocage_daaf.tranche.id ;
                item.cumul = vm.selectedItemDemande_deblocage_daaf.cumul ;
                item.anterieur = vm.selectedItemDemande_deblocage_daaf.anterieur ;
                item.periode = vm.selectedItemDemande_deblocage_daaf.tranche.periode ;
                item.pourcentage = vm.selectedItemDemande_deblocage_daaf.tranche.pourcentage ;
                item.reste = vm.selectedItemDemande_deblocage_daaf.reste ;
                item.date = new Date(vm.selectedItemDemande_deblocage_daaf.date);
                item.validation = vm.selectedItemDemande_deblocage_daaf.validation;
                //item.id_convention_ufp_daaf_entete = vm.selectedItemDemande_deblocage_daaf.convention_ufp_daaf_entete.id;
                vm.modificationdemande = true;
                vm.showbuttonValidation =false;
            //});
            vm.allcurenttranche_deblocage_daaf=vm.allcurenttranche_deblocage_daaf.filter(function(obj)
            {
              return obj.id == vm.selectedItemDemande_deblocage_daaf.tranche.id;
            });

            
            //item.date_approbation = vm.selectedItemDemande_deblocage_daaf.date_approbation ; 
            //console.log(vm.allcurenttranche_deblocage_daaf) ;
            //console.log(vm.selectedItemDemande_deblocage_daaf) ;
        };

        //fonction bouton suppression item convention_ufp_daaf_entete
        vm.supprimerDemande_deblocage_daaf = function()
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
                vm.ajoutDemande_deblocage_daaf(vm.selectedItemDemande_deblocage_daaf,1);
                vm.showbuttonValidation =false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_ufp_daaf_entete
        function test_existanceDemande_deblocage_daaf (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_deblocage_daaf.filter(function(obj)
                {
                   return obj.id == currentItemDemande_deblocage_daaf.id;
                });
                if(dema[0])
                {
                   if((dema[0].id_compte_daaf != currentItemDemande_deblocage_daaf.id_compte_daaf )
                    || (dema[0].id_tranche_deblocage_daaf != currentItemDemande_deblocage_daaf.id_tranche_deblocage_daaf )
                    || (dema[0].cumul != currentItemDemande_deblocage_daaf.cumul )
                    || (dema[0].anterieur != currentItemDemande_deblocage_daaf.anterieur )
                    || (dema[0].periode != currentItemDemande_deblocage_daaf.periode )
                    || (dema[0].pourcentage != currentItemDemande_deblocage_daaf.pourcentage )
                    || (dema[0].reste != currentItemDemande_deblocage_daaf.reste )
                    || (dema[0].date != currentItemDemande_deblocage_daaf.date )
                    || (dema[0].ref_demande != currentItemDemande_deblocage_daaf.ref_demande )
                    || (dema[0].id_convention_ufp_daaf_entete!= currentItemDemande_deblocage_daaf.id_convention_ufp_daaf_entete))                    
                      { 
                        insert_in_baseDemande_deblocage_daaf(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_deblocage_daaf(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function insert_in_baseDemande_deblocage_daaf(demande_deblocage_daaf,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_deblocage_daaf==false)
            {
                getId = vm.selectedItemDemande_deblocage_daaf.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    id_compte_daaf: demande_deblocage_daaf.id_compte_daaf ,
                    id_tranche_deblocage_daaf: demande_deblocage_daaf.id_tranche_deblocage_daaf ,
                    prevu: demande_deblocage_daaf.prevu ,
                    cumul: demande_deblocage_daaf.cumul ,
                    anterieur: demande_deblocage_daaf.anterieur ,
                    reste: demande_deblocage_daaf.reste ,
                    objet: demande_deblocage_daaf.objet ,
                    ref_demande: demande_deblocage_daaf.ref_demande ,
                    date: convertionDate(new Date(demande_deblocage_daaf.date)) ,
                    validation: 0,
                    id_convention_ufp_daaf_entete: vm.selectedItemConvention_ufp_daaf_entete.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {
                var comp = vm.allcompte_daaf.filter(function(obj)
                {
                    return obj.id == demande_deblocage_daaf.id_compte_daaf;
                });

                var tran= vm.alltranche_deblocage_daaf.filter(function(obj)
                {
                    return obj.id == demande_deblocage_daaf.id_tranche_deblocage_daaf;
                });
                /*var conv= vm.allconvention_ufp_daaf_entete.filter(function(obj)
                {
                    return obj.id == vm.selectedItemConvention_ufp_daaf_entete.id;
                });*/

                if (NouvelItemDemande_deblocage_daaf == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        //vm.selectedItemDemande_deblocage_daaf.convention_ufp_daaf_entete = conv[0];
                        vm.selectedItemDemande_deblocage_daaf.compte_daaf = comp[0];
                        vm.selectedItemDemande_deblocage_daaf.tranche = tran[0] ;
                        vm.selectedItemDemande_deblocage_daaf.periode = tran[0].periode ;
                        vm.selectedItemDemande_deblocage_daaf.pourcentage = tran[0].pourcentage ;
                        //vm.selectedItemDemande_deblocage_daaf.date_approbation = demande_deblocage_daaf.date_approbation ;
                        vm.selectedItemDemande_deblocage_daaf.$selected  = false;
                        vm.selectedItemDemande_deblocage_daaf.$edit      = false;
                        vm.selectedItemDemande_deblocage_daaf ={};
                    }
                    else 
                    {    
                      vm.alldemande_deblocage_daaf = vm.alldemande_deblocage_daaf.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_deblocage_daaf.id;
                      });
                    }
                }
                else
                {
                  //demande_deblocage_daaf.convention_ufp_daaf_entete = conv[0];
                  demande_deblocage_daaf.tranche = tran[0] ;
                  demande_deblocage_daaf.compte_daaf = comp[0];
                  demande_deblocage_daaf.periode = tran[0].periode ;
                  demande_deblocage_daaf.pourcentage = tran[0].pourcentage ;
                  //demande_deblocage_daaf.date_approbation = demande_deblocage_daaf.date_approbation ;

                  demande_deblocage_daaf.id  =   String(data.response);              
                  NouvelItemDemande_deblocage_daaf=false;
            }
              demande_deblocage_daaf.$selected = false;
              demande_deblocage_daaf.$edit = false;
              vm.selectedItemDemande_deblocage_daaf = {};
              vm.modificationdemande = false;
              vm.showbuttonValidation =false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.tranchechange = function(item)
        { 
          console.log(item);
          var reste = 0;
          var anterieur = 0;
          var prevu = 0;
          var cumul = 0;
          apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getDetailcoutByConvention','id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
          {   var conventioufpdaaf = vm.allconvention_ufp_daaf_entete.filter(function(obj)
                          {return obj.id == vm.selectedItemConvention_ufp_daaf_entete.id;});
              vm.alldetailcout = result.data.response;
                console.log(vm.alldetailcout);
              if (vm.alldetailcout.length!=0)
              {
                if (vm.allcurenttranche_deblocage_daaf[0].code =='tranche 1')
                {
                  prevu = ((parseInt(vm.alldetailcout[0].montant_divers)+parseInt(vm.alldetailcout[0].montant_trav_mob)) * parseInt(vm.allcurenttranche_deblocage_daaf[0].pourcentage))/100;
                
                } 
                else 
                {
                  prevu = ((parseInt(vm.alldetailcout[0].montant_divers)+parseInt(vm.alldetailcout[0].montant_trav_mob)) * parseInt(vm.allcurenttranche_deblocage_daaf[0].pourcentage))/100;
                
                }
              }
              
              cumul = prevu;
              if (vm.alldemande_deblocage_daaf_conv.length>0)
              {                 
                  anterieur = vm.dernierdemande[0].prevu;           
                  cumul = prevu + parseInt(vm.dernierdemande[0].cumul);
                  
              }

              reste= conventioufpdaaf[0].montant_trans_comm - cumul;
console.log(conventioufpdaaf);
              item.periode = vm.allcurenttranche_deblocage_daaf[0].periode;
              item.pourcentage = vm.allcurenttranche_deblocage_daaf[0].pourcentage;

              item.prevu = prevu;
              item.anterieur = anterieur;
              item.cumul = cumul;
              item.reste = reste
              });


         /* if (vm.alldemande_deblocage_daaf.length>1)
          {                 
              anterieur = vm.dernierdemande[0].prevu;           
              cumul = prevu + parseInt(vm.dernierdemande[0].cumul);
          }

          reste= vm.allconvention_ufp_daaf_entete[0].montant_trans_comm - cumul;

          item.periode = vm.allcurenttranche_deblocage_daaf[0].periode;
          item.pourcentage = vm.allcurenttranche_deblocage_daaf[0].pourcentage;*/

          item.prevu = prevu;
          item.anterieur = anterieur;
          item.cumul = cumul;
          item.reste = reste;
          //console.log(prevu + parseInt(vm.dernierdemande[0].cumul));
          
         
        }
        vm.valider_convention = function()
        {
            maj_in_baseDemande_deblocage_daaf_validation_daaf(vm.selectedItemDemande_deblocage_daaf,0);
        }


        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function maj_in_baseDemande_deblocage_daaf_validation_daaf(demande_deblocage_daaf_validation_daaf,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_deblocage_daaf_validation_daaf.id,
                    ref_demande: demande_deblocage_daaf_validation_daaf.ref_demande ,      
                    id_compte_daaf: demande_deblocage_daaf_validation_daaf.id_compte_daaf ,
                    id_tranche_deblocage_daaf: demande_deblocage_daaf_validation_daaf.tranche.id ,
                    prevu: demande_deblocage_daaf_validation_daaf.prevu ,
                    cumul: demande_deblocage_daaf_validation_daaf.cumul ,
                    anterieur: demande_deblocage_daaf_validation_daaf.anterieur ,
                    reste: demande_deblocage_daaf_validation_daaf.reste ,
                    objet: demande_deblocage_daaf_validation_daaf.objet ,
                    ref_demande: demande_deblocage_daaf_validation_daaf.ref_demande ,
                    date: convertionDate(demande_deblocage_daaf_validation_daaf.date) ,
                    validation: 1,
                    situation: 1,
                    id_convention_ufp_daaf_entete: vm.selectedItemConvention_ufp_daaf_entete.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {

              vm.alldemande_deblocage_daaf = vm.alldemande_deblocage_daaf.filter(function(obj)
              {
                  return obj.id !== demande_deblocage_daaf_validation_daaf.id;
              });
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
  /*****************Fin StepTwo demande_deblocage_daaf****************/


  /**********************************************Debut justicatif daaf***************************************************/
    //vm.myFile = [];

    vm.step_menu_fustificatif = function()
    { 
        vm.affiche_load = true;
        apiFactory.getAPIgeneraliserREST("justificatif_daaf/index",'id_demande_deblocage_daaf',vm.selectedItemDemande_deblocage_daaf.id,'id_tranche',vm.selectedItemDemande_deblocage_daaf.tranche.id).then(function(result)
        {
            vm.alljustificatif_daaf = result.data.response;
            vm.affiche_load = false;
        }); 
    }
        vm.justificatif_daaf_column = [
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
          //vm.selectedItemJustificatif_daaf.fichier = vm.myFile[0].name;
        } 

        //fonction ajout dans bdd
        function ajoutJustificatif_daaf(justificatif_daaf,suppression)
        {
            if (NouvelItemJustificatif_daaf==false)
            {                
                apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index",'menu',"getdemande_deblocageById",'id_demande_deblocage_daaf',demande_deblocage_daaf.id).then(function(result)
                {
                  var demande_deblocage_valide = result.data.response;
                  if (demande_deblocage_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {
                      vm.StepTwo=false;

                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceJustificatif_daaf (justificatif_daaf,suppression);    
                  }
                }); 
            } 
            else
            {
                insert_in_baseJustificatif_daaf(justificatif_daaf,suppression);
            }
        }

        //fonction de bouton d'annulation document_feffi_scan
        vm.annulerJustificatif_daaf = function(item)
        {
          if (NouvelItemJustificatif_daaf == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemJustificatif_daaf.fichier ;
          }
          else
          {
            /*vm.alljustificatif_daaf = vm.alljustificatif_daaf.filter(function(obj)
            {
                return obj.id != vm.selectedItemJustificatif_daaf.id;
            });*/

            item.fichier   = '';
            item.$edit = false;
            item.$selected = false;

            item.id = 0;
          }

          vm.selectedItemJustificatif_daaf = {} ;
          NouvelItemJustificatif_daaf      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_daaf= function (item)
        {
            vm.selectedItemJustificatif_daaf = item;
            if (item.$edit==false || item.$edit==undefined)
            {              
              currentItemJustificatif_daaf    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_daaf));
            }
            
        };
        $scope.$watch('vm.selectedItemJustificatif_daaf', function()
        {
             if (!vm.alljustificatif_daaf) return;
             vm.alljustificatif_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_daaf.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierJustificatif_daaf = function(item)
        {
            
            vm.selectedItemJustificatif_daaf = item;
            currentItemJustificatif_daaf = angular.copy(vm.selectedItemJustificatif_daaf);
            $scope.vm.alljustificatif_daaf.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id==0)
            {   
                NouvelItemJustificatif_daaf=true;
                item.fichier   = vm.selectedItemJustificatif_daaf.fichier ;
                item.id = 0 ;

            }
            else
            {   
                NouvelItemJustificatif_daaf = false ;
                item.fichier = vm.selectedItemJustificatif_daaf.fichier ;
            }
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_feffi_scan
        vm.supprimerJustificatif_daaf = function()
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
                vm.ajoutJustificatif_daaf(vm.selectedItemJustificatif_daaf,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceJustificatif_daaf (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alljustificatif_daaf.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_daaf.id;
                });
                if(mem[0])
                {
                   if(mem[0].fichier != currentItemJustificatif_daaf.fichier )                   
                      { 
                         insert_in_baseJustificatif_daaf(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseJustificatif_daaf(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd Justificatif_daaf
        function insert_in_baseJustificatif_daaf(justificatif_daaf,suppression)
        {
            //add
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemJustificatif_daaf==false)
            {
                getId = vm.selectedItemJustificatif_daaf.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_justificatif_prevu: justificatif_daaf.id_justificatif_prevu,
                    fichier: justificatif_daaf.fichier,
                    id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id              
                });
                //factory
            apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_daaf == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         
                    
                          var repertoire = 'justificatif_daaf/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_daaf.id
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0];
                            var name_file = vm.selectedItemConvention_ufp_daaf_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    justificatif_daaf.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_daaf.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_daaf.fichier,
                                                      id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                                                      //validation:0
                                        });
                                      apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_daaf.$selected = false;
                                          justificatif_daaf.$edit = false;
                                          justificatif_daaf.fichier=currentItemJustificatif_daaf.fichier;
                                          vm.selectedItemJustificatif_daaf = {};
                                      
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_daaf.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        id_justificatif_prevu: justificatif_daaf.id_justificatif_prevu,
                                        fichier: justificatif_daaf.fichier,
                                        id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                                        //validation:0               
                                    });
                                  apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                  {
                                        
                                      justificatif_daaf.$selected = false;
                                      justificatif_daaf.$edit = false;
                                      vm.selectedItemJustificatif_daaf = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      id_justificatif_prevu: currentItemJustificatif_daaf.id_justificatif_prevu,
                                                      fichier: currentItemJustificatif_daaf.fichier,
                                                      id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                                                      //validation:0
                                        });
                                      apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_daaf.$selected = false;
                                          justificatif_daaf.$edit = false;
                                          justificatif_daaf.fichier=currentItemJustificatif_daaf.fichier;
                                          vm.selectedItemJustificatif_daaf = {};
                                      
                                      });
                            });
                          }


                        vm.selectedItemJustificatif_daaf.$selected  = false;
                        vm.selectedItemJustificatif_daaf.$edit      = false;
                        vm.selectedItemJustificatif_daaf ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      /*vm.alljustificatif_daaf = vm.alljustificatif_daaf.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_daaf.id;
                      });*/
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_daaf.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         vm.selectedItemJustificatif_daaf.fichier = '';

                          vm.selectedItemJustificatif_daaf.id = 0;
                          vm.selectedItemJustificatif_daaf = {};

                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                    }
              }
              else
              {
                  justificatif_daaf.id  =   String(data.response);              
                  NouvelItemJustificatif_daaf = false;

                  vm.showbuttonNouvManuel = false;
                    
                    
                    var repertoire = 'justificatif_daaf/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                      var file= vm.myFile[0];
                      var name_file = vm.selectedItemConvention_ufp_daaf_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              justificatif_daaf.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                id_justificatif_prevu: currentItemJustificatif_daaf.id_justificatif_prevu,
                                                fichier: currentItemJustificatif_daaf.fichier,
                                                id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id
                                  });
                                apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_daaf.$selected = false;
                                    justificatif_daaf.$edit = false;
                                    justificatif_daaf.fichier=null;
                                    vm.selectedItemJustificatif_daaf = {};
                                
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_daaf.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  id_justificatif_prevu: justificatif_daaf.id_justificatif_prevu,
                                  fichier: justificatif_daaf.fichier,
                                  id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id               
                              });
                            apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                            {
                                  
                                justificatif_daaf.$selected = false;
                                justificatif_daaf.$edit = false;
                                vm.selectedItemJustificatif_daaf = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                id_justificatif_prevu: currentItemJustificatif_daaf.id_justificatif_prevu,
                                                fichier: currentItemJustificatif_daaf.fichier,
                                                id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id
                                  });
                                apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_daaf.$selected = false;
                                    justificatif_daaf.$edit = false;
                                    justificatif_daaf.fichier=null;
                                    vm.selectedItemJustificatif_daaf = {};
                                
                                });
                      });
                    }
              }
              justificatif_daaf.$selected = false;
              justificatif_daaf.$edit = false;
              //vm.selectedItemJustificatif_daaf = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_justificatif = function(item)
        {//console.log(item.fichier);
            window.open(apiUrlFile+item.fichier);
        }
       
    /******************************************debut justicatif daaf***********************************************/
        

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
            var date_final = null;  
            if(daty!='Invalid Date' && daty!='' && daty!=null)
            {
                console.log(daty);
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                date_final= annee+"-"+mois+"-"+jour;
            }
            return date_final;      
        }
        
        vm.formatMillier = function (nombre) 
      {   //var nbr = nombre.toFixed(0);
        var nbr=parseFloat(nombre);
        var n = nbr.toFixed(2);
        var spl= n.split('.');
        var apre_virgule = spl[1];
        var avan_virgule = spl[0];

          if (typeof avan_virgule != 'undefined' && parseInt(avan_virgule) >= 0) {
              avan_virgule += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(avan_virgule)) {
                  avan_virgule = avan_virgule.replace(reg, '$1' + sep + '$2');
              }
              return avan_virgule+","+apre_virgule;
          } else {
              return "0,00";
          }
      }
    }
})();
