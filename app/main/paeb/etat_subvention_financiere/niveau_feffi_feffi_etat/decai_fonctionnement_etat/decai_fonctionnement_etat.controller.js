(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.decai_fonctionnement_etat') 
        .controller('Decai_fonctionnement_etatController', Decai_fonctionnement_etatController)
    /** @ngInject */
    function Decai_fonctionnement_etatController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepDecaiss=false;
        vm.stepjusti_decais = false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;
        
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;


/*******************************Debut initialisation suivi financement feffi******************************/ 
        vm.validation = 0;
        vm.roles = [];


        //initialisation decaissement fonctionnement feffi
        vm.selectedItemDecaiss_fonct_feffi = {} ;
        vm.alldecaiss_fonct_feffi = [] ; 

        vm.selectedItemJustificatif_decaiss_fonct_feffi = {} ;
        vm.alljustificatif_decaiss_fonct_feffi = [] ;
        vm.stepjusti_decais = false;    

/*******************************Fin initialisation suivi financement feffi******************************/

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

        vm.datenow = new Date();

        vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                    console.log(vm.ciscos);
                }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.ciscos = [];
            }
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
                console.log(vm.communes);
              }, function error(result){ alert('something went wrong')});
            }
            else
            {
                vm.communes = [];
            }
          
        }
        
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index","menu","getzapBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.filtre_change_zap = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.ecoles = result.data.response;
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }
        vm.filtre_change_ecole = function(item)
        { 
            vm.filtre.id_convention_entete_entete = null;
            if (item.id_ecole != '*')
            {
                  apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
                  {
                    vm.convention_cisco_feffi_entetes = result.data.response;
                  }, function error(result){ alert('something went wrong')});
            }
        }
        apiFactory.getAll("region/index").then(function success(response)
        {
            vm.regions = response.data.response;
        });
        /*var id_user = $cookieStore.get('id');
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;
              switch (vm.roles[0])
                {
                  case 'OBCAF': 
                            vm.usercisco = result.data.response.cisco;
                            apiFactory.getAPIgeneraliserREST("region/index","menu","getregionbycisco",'id_cisco',vm.usercisco.id).then(function(result)
                            {
                                vm.regions = result.data.response;
                                console.log(vm.regions);
                            }, function error(result){ alert('something went wrong')});
                            vm.ciscos.push(vm.usercisco);
                            vm.showbuttonNeauveaudemandefeffi=true;                            
                            vm.session = 'OBCAF';

                      break;

                  case 'ADMIN':                            
                            vm.showbuttonNeauveaudemandefeffi=true;
                             apiFactory.getAll("region/index").then(function success(response)
                            {
                              vm.regions = response.data.response;
                            }, function error(response){ alert('something went wrong')});
                            vm.session = 'ADMIN';                  
                      break;
                  default:
                      break;
              
                }                  

         });*/

        /***************debut convention cisco/feffi**********/
        vm.convention_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Code sous projet site"
        },
        {titre:"Accés site"
        },
        {titre:"Référence convention"
        },
        {titre:"Objet"
        },
        {titre:"Référence Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Utilisateur"
        }]; 
     

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
            ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;

            });
             /* switch (vm.session)
                { 
                  case 'OBCAF':console.log(vm.usercisco.id);
                            
                              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpByfiltrecisco','id_cisco_user',vm.usercisco.id,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                              {
                                  vm.allconvention_entete = result.data.response;
                                  vm.affiche_load =false;

                              });
                         
                console.log(filtre);                
                      break;

                  case 'ADMIN':
                           
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;

                            });                 
                      break;
                  default:
                      break;
              
                }*/
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepDecaiss=true;
            vm.stepjusti_decais = false;
            /*donnee_sousmenu_feffi(item,vm.session).then(function () 
            {
                    // On récupère le resultat de la requête dans la varible "response"                    
                vm.stepDecaiss=true;
                console.log(vm.stepMenu_feffi);  
            });*/
              
              vm.steppiecefeffi=false;
              vm.steptransdaaf=false;
              vm.nbr_decaiss_feffi = item.nbr_decaiss_feffi;
              //console.log(vm.nbr_demande_feffi);
              vm.header_ref_convention = item.ref_convention;
              vm.header_cisco = item.cisco.description;
              vm.header_feffi = item.feffi.denomination; 
              vm.header_class = 'headerbig';

        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
        });
        
        /*function donnee_sousmenu_feffi(item,session)
        {
            return new Promise(function (resolve, reject) 
            {
                switch (session)
                {
                  case 'OBCAF':
                              apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_valideByconvention','id_convention_entete',item.id).then(function(result)
                              {
                                  vm.alldecaiss_fonct_feffi = result.data.response; 
                                  return resolve('ok');
                              });

                              vm.modif_suppre = true;
                              //vm.nbr_demande_feffi = item.nbr_demande_feffi_creer
                            
                      break;

                  case 'ADMIN':
                           apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_valideByconvention','id_convention_entete',item.id).then(function(result)
                            {
                                vm.alldecaiss_fonct_feffi = result.data.response; 
                                return resolve('ok');
                            });                              
                       
                      break;
                  default:
                      break;
              
                }            
            });
        
        }*/


  /**********************************fin decaissement fonctionnement feffi******************************/
      vm.step_menu_decaiss = function()
      { 
        vm.stepjusti_decais = false; 
        apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_valideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
        {
            vm.alldecaiss_fonct_feffi = result.data.response; 
        });
      }

       

        //fonction selection item justificatif batiment
        vm.selectionDecaiss_fonct_feffi= function (item)
        {
            vm.selectedItemDecaiss_fonct_feffi = item;
            vm.validation_decais_fef=item.validation;
            vm.stepjusti_decais = true;
           /* apiFactory.getAPIgeneraliserREST("justificatif_decaiss_fonct_feffi/index",'id_decaiss_fonct_feffi',item.id).then(function(result)
            {
                vm.alljustificatif_decaiss_fonct_feffi = result.data.response;
                
            }); */
            
        };
        $scope.$watch('vm.selectedItemDecaiss_fonct_feffi', function()
        {
             if (!vm.alldecaiss_fonct_feffi) return;
             vm.alldecaiss_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDecaiss_fonct_feffi.$selected = true;
        });

                

    /*********************************************Fin justificatif reliquat************************************************/

    vm.step_menu_justif = function()
    {
      apiFactory.getAPIgeneraliserREST("justificatif_decaiss_fonct_feffi/index",'id_decaiss_fonct_feffi',vm.selectedItemDecaiss_fonct_feffi.id).then(function(result)
      {
        vm.alljustificatif_decaiss_fonct_feffi = result.data.response;
      });
    }
      //fonction selection item justificatif decaiss_fonct_feffi
        vm.selectionJustificatif_decaiss_fonct_feffi= function (item)
        {
            vm.selectedItemJustificatif_decaiss_fonct_feffi = item;
            
        };
        $scope.$watch('vm.selectedItemJustificatif_decaiss_fonct_feffi', function()
        {
             if (!vm.alljustificatif_decaiss_fonct_feffi) return;
             vm.alljustificatif_decaiss_fonct_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_decaiss_fonct_feffi.$selected = true;
        });

        
        vm.download_decaiss_fonct_feffi = function(item)
        {
          window.open(apiUrlFile+item.fichier);
        }
  /******************************************fin maitrise d'oeuvre*******************************************************/
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
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
        vm.affichage_sexe= function (sexe)
        { var affiche='';
          switch (sexe)
          {
            case '1':
                affiche= 'Masculin';
                break;
            case '2':
                affiche= 'Feminin';
                break;
            default:
          }
          return affiche;
        };
        
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
