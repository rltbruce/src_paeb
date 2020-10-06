(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_ufp_daaf_etat.convention_ufp_daaf_etat')
        .controller('Convention_ufp_daaf_etatController', Convention_ufp_daaf_etatController)
    /** @ngInject */
    function Convention_ufp_daaf_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService)
    {
		    var vm = this;

    //initialisation convetion ufp/daaf entete 

        vm.selectedItemConvention_ufp_daaf_entete = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        

      //initialisation convetion ufp/daaf detail  

        vm.selectedItemConvention_ufp_daaf_detail = {} ;
        vm.allconvention_ufp_daaf_detail  = [] ; 

        vm.allcompte_daaf  = [] ; 

    //initialisation convention
        vm.selectedItemConvention_cisco_feffi_entete = {} ;

        vm.allconvention_cisco_feffi_entete = [] ;

        vm.date_now = new Date();

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;     

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //style
        vm.dtOptionsperso = {
          dom: '<"top">rt<"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //style
        vm.dtOptionsperso2 = {
          dom: '<"top"><"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        vm.showformfiltre = function()
        {
          //vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }

        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

         var id_user = $cookieStore.get('id');

       /* apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
            //var roles = result.data.response.roles;

            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'DAAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
            if(result.data.response.roles.indexOf("DAAF")!= -1 || result.data.response.roles.indexOf("ADMIN")!= -1)
            {
                vm.permissionboutonValider = true;
            }

        });*/
/*****************Debut StepOne convention_ufp_daaf_entete****************/

  //col table
        vm.convention_ufp_daaf_entete_column = [        
        {titre:"Numero vague"},        
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Nombre bénéficiaire"},        
        {titre:"Montant convention"},        
        {titre:"Avancement physique"}];
      var annee = vm.date_now.getFullYear();
  //recuperation donnée programmation
        apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getetatconvention_now","annee",annee).then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
                console.log(vm.allconvention_ufp_daaf_entete)
        });

         vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);

            apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getetatconventionByfiltre",'date_debut',
                                    date_debut,'date_fin',date_fin).then(function(result)
            {
                vm.allconvention_ufp_daaf_entete = result.data.response;
                console.log(vm.allconvention_ufp_daaf_entete);
            });
        }


        //fonction selection item region
        vm.selectionConvention_ufp_daaf_entete= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;
           // vm.allconvention_ufp_daaf_entete= [] ;
            
           if (vm.selectedItemConvention_ufp_daaf_entete.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_ufp_daaf_detail = result.data.response;
                  ////console.log(result.data.response);                 
              });

              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi_entete = result.data.response; 
                  //console.log(vm.allconvention_cisco_feffi_entete);                
              });

              vm.stepOne           = true;
              vm.stepTwo           = false;
              vm.stepThree         = false;
              
           }
           vm.validation_button = item.validation;
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

        
        vm.changevague = function(item)
        {
          var objet= 'Transfert d’argent vers les deux cent (200) communautés de la première vague';
          if (item.num_vague==2)
          {
            objet= 'Transfert d’argent vers les deux cent (200) communautés de la deuxième vague';
          }
          item.objet= objet;
        }
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

  /*****************Debut StepOne convention_ufp_daaf_detail****************/

  //col table
        vm.convention_ufp_daaf_detail_column = [        
        {titre:"Nom banque"},
        {titre:"Adresse banque"},        
        {titre:"compte"},
        {titre:"Delai"},
        {titre:"Date signature"},        
        {titre:"Observation"}];

              //fonction selection item region
        vm.selectionConvention_ufp_daaf_detail= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_detail = item;
            
            vm.stepTwo = false;
            vm.stepThree = false;
          /* if (vm.selectedItemConvention_ufp_daaf_detail.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_detail.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi = result.data.response;                  
              });
           }*/
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_detail', function()
        {
            if (!vm.allconvention_ufp_daaf_detail) return;
            vm.allconvention_ufp_daaf_detail.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_ufp_daaf_detail.$selected = true;
        });

        
        vm.changecompte_daaf = function(item)
        { var compte = vm.allcompte_daaf.filter(function(obj)
          {
            return obj.id == item.id_compte_daaf;
          });
          item.agence = compte[0].agence;
          item.compte = compte[0].compte;
        }

  /*****************Fin StepOne convention_ufp_daaf_detail****************/


  /*****************Debut StepTwo convention***************/

        //col table
        vm.convention_cisco_feffi_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Site"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement physique"
        },
        {titre:"Utilisateur"
        }];
        
        

        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;
            vm.stepOne = true;
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
             if (!vm.allconvention_cisco_feffi_entete) return;
             vm.allconvention_cisco_feffi_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi_entete.$selected = true;

        });

                    

  /*****************Fin StepTwo convention****************/        

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
        vm.getAnneeDate = function (daty)
        {
          if (daty) 
          {   
            var date  = new Date(daty);
              var annee = date.getFullYear();
              return annee;
          }            

        }
        vm.affichage_avancement_physi = function(avance)
        {
          var avance_p=0;
          if (avance)
          {
            avance_p = parseFloat(avance).toFixed(2);
          }
          return avance_p +"%";
        }


    }

})();
