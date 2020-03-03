(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf_validation_ufp')
        .controller('Demande_deblocage_daaf_validation_ufpController', Demande_deblocage_daaf_validation_ufpController)
    /** @ngInject */
    function Demande_deblocage_daaf_validation_ufpController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,apiUrlFile)
    {
		    var vm    = this;

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;
        vm.stepThree = false;

     //initialisation demande_deblocage_daaf_validation_ufp
        var NouvelItemDemande_deblocage_daaf_validation_ufp    = false;
        vm.selectedItemDemande_deblocage_daaf_validation_ufp = {} ;
        vm.selectedItemDemande_deblocage_daaf_encours = {} ;
        vm.alldemande_deblocage_daaf_valide_daaf  = [] ;
        vm.alldemande_deblocage_daaf_encours  = [] ;

    //initialisation justificatif_daaf
        vm.selectedItemJustificatif_daaf = {} ;
        vm.alljustificatif_daaf = [] ;
        vm.situation = 5;
        vm.showbutton = false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf_invalide","validation",1).then(function(result)
        {
            vm.alldemande_deblocage_daaf_valide_daaf = result.data.response;
            
        });

        apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf_invalide","validation",2).then(function(result)
        {
            vm.alldemande_deblocage_daaf_encours = result.data.response;
            
        });

  /*****************Debut StepTwo demande_deblocage_daaf_validation_ufp****************/

      vm.demande_deblocage_daaf_validation_ufp_column = [
        {titre:"Réference convention"},
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
        //{titre:"Situation"},
        {titre:"Action"}];        

        //fonction selection item region
        vm.selectionDemande_deblocage_daaf_validation_ufp= function (item)
        {
            vm.selectedItemDemande_deblocage_daaf_validation_ufp = item;
           //recuperation donnée demande_deblocage_daaf_validation_ufp
            apiFactory.getAPIgeneraliserREST("justificatif_daaf/index",'id_demande_deblocage_daaf',item.id).then(function(result)
            {
                vm.alljustificatif_daaf = result.data.response;
                console.log(vm.alljustificatif_daaf);
            });
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.traiter = false;

        };
        $scope.$watch('vm.selectedItemDemande_deblocage_daaf_validation_ufp', function()
        {
             if (!vm.alldemande_deblocage_daaf_valide_daaf) return;
             vm.alldemande_deblocage_daaf_valide_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage_daaf_validation_ufp.$selected = true;
        });

        //fonction selection item region
        vm.selectionDemande_deblocage_daaf_encours= function (item)
        {
            vm.selectedItemDemande_deblocage_daaf_encours = item;

        };
        $scope.$watch('vm.selectedItemDemande_deblocage_daaf_encours', function()
        {
             if (!vm.alldemande_deblocage_daaf_valide_daaf) return;
             vm.alldemande_deblocage_daaf_valide_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage_daaf_encours.$selected = true;
        });

        vm.demande_deblocage_daaf_mettreencours = function(item)
        {
            insert_in_baseDemande_deblocage_daaf_validation_ufp(item,0,2);
        }

        vm.demande_deblocage_daaf_finaliser = function(item)
        {   vm.traiter = true;
            insert_in_baseDemande_deblocage_daaf_validation_ufp(item,0,3);
        }
        vm.demande_deblocage_daaf_rejeter = function(item)
        { vm.traiter = true;
            insert_in_baseDemande_deblocage_daaf_validation_ufp(item,0,4);
        }


        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function insert_in_baseDemande_deblocage_daaf_validation_ufp(demande_deblocage_daaf_validation_ufp,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_deblocage_daaf_validation_ufp.id,
                    ref_demande: demande_deblocage_daaf_validation_ufp.ref_demande ,      
                    id_compte_daaf: demande_deblocage_daaf_validation_ufp.id_compte_daaf ,
                    id_tranche_deblocage_daaf: demande_deblocage_daaf_validation_ufp.tranche.id ,
                    prevu: demande_deblocage_daaf_validation_ufp.prevu ,
                    cumul: demande_deblocage_daaf_validation_ufp.cumul ,
                    anterieur: demande_deblocage_daaf_validation_ufp.anterieur ,
                    reste: demande_deblocage_daaf_validation_ufp.reste ,
                    objet: demande_deblocage_daaf_validation_ufp.objet ,
                    ref_demande: demande_deblocage_daaf_validation_ufp.ref_demande ,
                    date: convertionDate(new Date(demande_deblocage_daaf_validation_ufp.date)) ,
                    validation: validation,
                    id_convention_ufp_daaf_entete: demande_deblocage_daaf_validation_ufp.convention_ufp_daaf_entete.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {   if(vm.traiter == false)
                {
                  vm.alldemande_deblocage_daaf_encours.push(vm.selectedItemDemande_deblocage_daaf_validation_ufp);
                  vm.alldemande_deblocage_daaf_valide_daaf = vm.alldemande_deblocage_daaf_valide_daaf.filter(function(obj)
                  {
                      return obj.id !== demande_deblocage_daaf_validation_ufp.id;
                  });
                }else
                {
                  vm.alldemande_deblocage_daaf_encours = vm.alldemande_deblocage_daaf_encours.filter(function(obj)
                  {
                      return obj.id !== demande_deblocage_daaf_validation_ufp.id;
                  });
                }
                
                
              
              vm.stepOne = false;
            vm.stepTwo = false;
            vm.traiter = true;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

      /*  vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Emise';                  
                  break;
              
              case '2':
                        return 'En cours de traitement'; 
                  break;

              case '3':
                  
                  return 'Finalisée'; 
                  break;

             case '4':
                  
                  return 'Rejeté'; 
                  break;

              default:
          
            }
        }*/

  /*****************Fin StepTwo demande_deblocage_daaf_validation_ufp****************/

  /*****************Fin StepThree justificatif_daaf****************/

  //col table
        vm.justificatif_daaf_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

     

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_daaf= function (item)
        {
            vm.selectedItemJustificatif_daaf = item;
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

        vm.DownloadJustificatif_daaf = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
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
