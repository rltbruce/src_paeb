(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.convention_ufp_daaf_valide')
        .controller('Convention_ufp_daaf_valideController', Convention_ufp_daaf_valideController);
    /** @ngInject */
    function Convention_ufp_daaf_valideController($mdDialog, $scope, apiFactory, $state,$cookieStore)
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
        vm.showbuttonNouvDetail = true;
        vm.allcompte_daaf  = [] ; 

    //initialisation convention
        vm.selectedItemConvention_cisco_feffi_entete = {} ;
        vm.allconvention_cisco_feffi_entete = [] ;

        vm.date_now = new Date();     

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

         var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
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

        });
/*****************Debut StepOne convention_ufp_daaf_entete****************/

  //col table
        vm.convention_ufp_daaf_entete_column = [        
        {titre:"Numero vague"},        
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Montant convention"},        
        {titre:"Nombre bénéficiaire"}];

  //recuperation donnée programmation
        apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getconvention_ufp_daaf_validation","validation",0).then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
        });

   //recuperation donnée programmation
        apiFactory.getAll("compte_daaf/index").then(function(result)
        {
            vm.allcompte_daaf = result.data.response;
            ////console.log(vm.allcompte_daaf);
        });


        //fonction selection item region
        vm.selectionConvention_ufp_daaf_entete= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;
            currentItemConvention_ufp_daaf_entete     = JSON.parse(JSON.stringify(vm.selectedItemConvention_ufp_daaf_entete));
           // vm.allconvention_ufp_daaf_entete= [] ;
            
           if (vm.selectedItemConvention_ufp_daaf_entete.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_ufp_daaf_detail = result.data.response;
                  if (vm.allconvention_ufp_daaf_detail.length>0)
                  {
                    vm.showbuttonNouvDetail = false;
                  } 
                  ////console.log(result.data.response);                 
              });

              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi_entete = result.data.response;                 
              });

              vm.stepOne           = true;
              vm.stepTwo           = false;
              vm.stepThree         = false;
              vm.afficherboutonValider = true;
              
           }
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


  /*****************Fin StepOne convention_ufp_daaf_entete****************/

  /*****************Debut StepOne convention_ufp_daaf_detail****************/

  //col table
        vm.convention_ufp_daaf_detail_column = [        
        {titre:"Nom banque"},
        {titre:"Adresse banque"},        
        {titre:"compte"},
        {titre:"Delai"},
        {titre:"Date signature"},        
        {titre:"Observation"},
        {titre:"Action"}];

  //recuperation donnée programmation
        apiFactory.getAll("convention_ufp_daaf_detail/index").then(function(result)
        {
            vm.allconvention_ufp_daaf_detail = result.data.response;
        });


        //fonction selection item region
        vm.selectionConvention_ufp_daaf_detail= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_detail = item;
            if (item.$selected==false)
            {
              currentItemConvention_ufp_daaf_detail     = JSON.parse(JSON.stringify(vm.selectedItemConvention_ufp_daaf_detail));
           
            }
            
            vm.stepTwo = false;
            vm.stepThree = false;
           if (vm.selectedItemConvention_ufp_daaf_detail.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_detail.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi = result.data.response;                  
              });
           }
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



  /*****************Fin StepOne convention_ufp_daaf_detail****************/


  /*****************Debut StepTwo convention***************/

        //col table
        vm.convention_cisco_feffi_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Site"
        },
        {titre:"Type convention"
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
        },
        {titre:"Utilisateur"
        }];
        
        

        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;
            currentItemConvention_cisco_feffi_entete     = JSON.parse(JSON.stringify(vm.selectedItemConvention_cisco_feffi_entete));
           // vm.allconvention= [] ;
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
        vm.affichage_type_convention = function(type_convention)
        { 
          var affichage = 'Initial';
          if(type_convention == 0)
          {
            affichage = 'Autre';
          }
          return affichage;
        }
    }


/*****************Debut ConventionDialogue Controlleur  ****************/    


/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
