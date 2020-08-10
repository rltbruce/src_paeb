(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf_validation_daaf')
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
        .controller('Demande_deblocage_daaf_validation_daafController', Demande_deblocage_daaf_validation_daafController)
    /** @ngInject */
    function Demande_deblocage_daaf_validation_daafController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		    var vm    = this;

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;
        vm.stepThree   = false;

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

        vm.showbuttonValidation = false;
        vm.date_now         = new Date();

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
          vm.showbuttonfiltre=false;
          vm.showfiltre=true;
        }

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);

              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionByfiltre',
              'date_debut',date_debut,'date_fin',date_fin).then(function(result)
              {
                  vm.allconvention_ufp_daaf_entete = result.data.response; 
                  console.log(vm.allconvention_ufp_daaf_entete);
              });
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
            vm.showbuttonfiltre=true;
            vm.showfiltre=false;
        }

  /*****************Debut StepOne convention_ufp_daaf_entete***************/

  //recuperation donnée convention_ufp_daaf_entete
       apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionByinvalidedemande').then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
            console.log(vm.allconvention_ufp_daaf_entete);
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
            apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf","id_convention_ufp_daaf_entete",item.id).then(function(result)
            {
                vm.alldemande_deblocage_daaf = result.data.response; 
                console.log(vm.alldemande_deblocage_daaf );
            });

            //recuperation donnée convention_ufp_daaf_detail
            apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',item.id).then(function(result)
            {
                vm.allconvention_ufp_daaf_detail = result.data.response;                
                vm.allcompte_daaf.push(vm.allconvention_ufp_daaf_detail[0].compte_daaf);
                
            });
           
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
  
        //fonction ajout dans bdd
        function ajoutDemande_deblocage_daaf(demande_deblocage_daaf,suppression)
        {
            if (NouvelItemDemande_deblocage_daaf==false)
            {
                test_existanceDemande_deblocage_daaf (demande_deblocage_daaf,suppression); 
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
            item.id_convention_ufp_daaf_entete = currentItemDemande_deblocage_daaf.id_convention_ufp_daaf_entete;
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
            currentItemDemande_deblocage_daaf     = JSON.parse(JSON.stringify(vm.selectedItemDemande_deblocage_daaf));
           //recuperation donnée demande_deblocage_daaf
            apiFactory.getAPIgeneraliserREST("justificatif_daaf/index",'id_demande_deblocage_daaf',item.id).then(function(result)
            {
                vm.alljustificatif_daaf = result.data.response;
                console.log(vm.alljustificatif_daaf);
            });
            vm.validation_item=item.validation; 
            vm.stepTwo = true; 
            vm.stepThree = false; 
            vm.showbuttonValidation =true;
            if (item.$edit ==true) {
              vm.showbuttonValidation = false;
            }
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
            });console.log(vm.selectedItemDemande_deblocage_daaf);

            apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
            {
                //vm.allconvention_ufp_daaf_detail = result.data.response;
                console.log(item) ;                
               // vm.allcompte_daaf.push(result.data.response[0].compte_daaf);

                item.$edit = true;
                item.$selected = true;

                item.id_compte_daaf = result.data.response[0].compte_daaf.id ;
                item.id_tranche_deblocage_daaf = vm.selectedItemDemande_deblocage_daaf.tranche.id ;
                item.cumul = vm.selectedItemDemande_deblocage_daaf.cumul ;
                item.anterieur = vm.selectedItemDemande_deblocage_daaf.anterieur ;
                item.periode = vm.selectedItemDemande_deblocage_daaf.tranche.periode ;
                item.pourcentage = vm.selectedItemDemande_deblocage_daaf.tranche.pourcentage ;
                item.reste = vm.selectedItemDemande_deblocage_daaf.reste ;
                item.date = new Date(vm.selectedItemDemande_deblocage_daaf.date);
                item.validation = vm.selectedItemDemande_deblocage_daaf.validation;
                ///item.id_convention_ufp_daaf_entete = vm.selectedItemDemande_deblocage_daaf.convention_ufp_daaf_entete.id;
                vm.modificationdemande = true;
                vm.showbuttonValidation =false;
            });
            vm.allcurenttranche_deblocage_daaf=vm.allcurenttranche_deblocage_daaf.filter(function(obj)
            {
              return obj.id == vm.selectedItemDemande_deblocage_daaf.tranche.id;
            });

            
            //item.date_approbation = vm.selectedItemDemande_deblocage_daaf.date_approbation ; 
            console.log(item) ;
            console.log(vm.selectedItemDemande_deblocage_daaf) ;
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
                    ref_demande: demande_deblocage_daaf.ref_demande ,      
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
                    id_convention_ufp_daaf_entete: demande_deblocage_daaf.id_convention_ufp_daaf_entete              
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
                var conv= vm.allconvention_ufp_daaf_entete.filter(function(obj)
                {
                    return obj.id == demande_deblocage_daaf.id_convention_ufp_daaf_entete;
                });

                if (NouvelItemDemande_deblocage_daaf == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_deblocage_daaf.convention_ufp_daaf_entete = conv[0];
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
                  demande_deblocage_daaf.convention_ufp_daaf_entete = conv[0];
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
          apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getDetailcoutByConvention','id_convention_ufp_daaf_entete',item.id_convention_ufp_daaf_entete).then(function(result)
          {   var conventioufpdaaf = vm.allconvention_ufp_daaf_entete.filter(function(obj)
                          {return obj.id == item.id_convention_ufp_daaf_entete;});
              vm.alldetailcout = result.data.response;
                console.log(vm.alldetailcout);
              if (vm.allcurenttranche_deblocage_daaf[0].code =='tranche 1')
              {
                prevu = parseInt(vm.alldetailcout[0].montant_divers)+((parseInt(vm.alldetailcout[0].montant_trav_mob) * parseInt(vm.allcurenttranche_deblocage_daaf[0].pourcentage))/100);
              console.log(prevu);
              } 
              else 
              {
                prevu = (parseInt(vm.alldetailcout[0].montant_trav_mob )* parseInt(vm.allcurenttranche_deblocage_daaf[0].pourcentage))/100;
              console.log(prevu);
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
                    date: convertionDate(new Date(demande_deblocage_daaf_validation_daaf.date)) ,
                    validation: 1,
                    situation: 1,
                    id_convention_ufp_daaf_entete: vm.selectedItemConvention_ufp_daaf_entete.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {

              /*vm.alldemande_deblocage_daaf = vm.alldemande_deblocage_daaf.filter(function(obj)
              {
                  return obj.id !== demande_deblocage_daaf_validation_daaf.id;
              });*/
              vm.validation_item=1;
              demande_deblocage_daaf_validation_daaf.validation=1;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
  /*****************Fin StepTwo demande_deblocage_daaf****************/

  /*****************Fin StepThree justificatif_daaf****************/

  //col table
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
          vm.selectedItemJustificatif_daaf.fichier = vm.myFile[0].name;
          console.log(vm.selectedItemJustificatif_daaf.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterJustificatif_daaf = function ()
        { 
          if (NouvelItemJustificatif_daaf == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              description: '',
              fichier: ''
            };
        
            vm.alljustificatif_daaf.push(items);
            vm.alljustificatif_daaf.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemJustificatif_daaf = mem;
              }
            });
console.log('ato');
            NouvelItemJustificatif_daaf = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout Justificatif_daaf','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutJustificatif_daaf(justificatif_daaf,suppression)
        {
            if (NouvelItemJustificatif_daaf==false)
            {
                test_existanceJustificatif_daaf (justificatif_daaf,suppression); 
            } 
            else
            {
                insert_in_baseJustificatif_daaf(justificatif_daaf,suppression);
            }
        }

        //fonction de bouton d'annulation Justificatif_daaf
        vm.annulerJustificatif_daaf = function(item)
        {
          if (NouvelItemJustificatif_daaf == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.description   = currentItemJustificatif_daaf.description ;
            item.fichier   = currentItemJustificatif_daaf.fichier ;
          }else
          {
            vm.alljustificatif_daaf = vm.alljustificatif_daaf.filter(function(obj)
            {
                return obj.id !== vm.selectedItemJustificatif_daaf.id;
            });
          }

          vm.selectedItemJustificatif_daaf = {} ;
          NouvelItemJustificatif_daaf      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_daaf= function (item)
        {
            vm.selectedItemJustificatif_daaf = item;
            vm.nouvelItemJustificatif_daaf   = item;
            currentItemJustificatif_daaf    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_daaf)); 
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
            NouvelItemJustificatif_daaf = false ;
            vm.selectedItemJustificatif_daaf = item;
            currentItemJustificatif_daaf = angular.copy(vm.selectedItemJustificatif_daaf);
            $scope.vm.alljustificatif_daaf.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.description   = vm.selectedItemJustificatif_daaf.description ;
            item.fichier   = vm.selectedItemJustificatif_daaf.fichier ;
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item Justificatif_daaf
        vm.supprimerJustificatif_daaf = function()
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
               var just = vm.alljustificatif_daaf.filter(function(obj)
                {
                   return obj.id == currentItemJustificatif_daaf.id;
                });
                if(just[0])
                {
                   if((just[0].description   != currentItemJustificatif_daaf.description )
                    ||(just[0].fichier   != currentItemJustificatif_daaf.fichier ))                   
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
                    description: justificatif_daaf.description,
                    fichier: justificatif_daaf.fichier,
                    id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
            {   

              if (NouvelItemJustificatif_daaf == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'justificatif_daaf/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemJustificatif_daaf.id
                                              
                          if(file)
                          { 

                            var name_file = vm.selectedItemDemande_deblocage_daaf.convention_ufp_daaf_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                                      description: justificatif_daaf.description,
                                                      fichier: justificatif_daaf.fichier,
                                                      id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                                                      //validation:0
                                        });
                                      apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                      {  
                                          vm.showbuttonNouvManuel = true;
                                          justificatif_daaf.$selected = false;
                                          justificatif_daaf.$edit = false;
                                          vm.selectedItemJustificatif_daaf = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  justificatif_daaf.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        description: justificatif_daaf.description,
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
                            });
                          }


                        vm.selectedItemJustificatif_daaf.$selected  = false;
                        vm.selectedItemJustificatif_daaf.$edit      = false;
                        vm.selectedItemJustificatif_daaf ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alljustificatif_daaf = vm.alljustificatif_daaf.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemJustificatif_daaf.id;
                      });
                      vm.showbuttonNouvManuel = true;
                      var chemin= vm.selectedItemJustificatif_daaf.fichier;
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
                  justificatif_daaf.id  =   String(data.response);              
                  NouvelItemJustificatif_daaf = false;

                  vm.showbuttonNouvManuel = false;
                    var file= vm.myFile[0];
                    
                    var repertoire = 'justificatif_daaf/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = vm.selectedItemDemande_deblocage_daaf.convention_ufp_daaf_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                                description: justificatif_daaf.description,
                                                fichier: justificatif_daaf.fichier,
                                                id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                                                validation:0
                                  });
                                apiFactory.add("justificatif_daaf/index",datas, config).success(function (data)
                                {  
                                    vm.showbuttonNouvManuel = true;
                                    justificatif_daaf.$selected = false;
                                    justificatif_daaf.$edit = false;
                                    vm.selectedItemJustificatif_daaf = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            justificatif_daaf.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  description: justificatif_daaf.description,
                                  fichier: justificatif_daaf.fichier,
                                  id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf.id,
                                  validation:0               
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
                      });
                    }
              }
              justificatif_daaf.$selected = false;
              justificatif_daaf.$edit = false;
              vm.selectedItemJustificatif_daaf = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_justificatif = function(item)
        {//console.log(item.fichier);
            window.location = apiUrlFile+item.fichier;
        }

  /*****************Fin StepThree justificatif_daaf****************/ 
        

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
