(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_be.passation_marches_be')
        .controller('Passation_marches_beController', Passation_marches_beController);
    /** @ngInject */
    function Passation_marches_beController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;

        vm.ajoutPassation_marches_be = ajoutPassation_marches_be ;
        var NouvelItemPassation_marches_be=false;
        var currentItemPassation_marches_be;
        vm.selectedItemPassation_marches_be = {} ;
        vm.allpassation_marches_be = [] ;

        vm.allbe = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;

        vm.showbuttonNouvPassation=true;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

        //col table
        vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Numero convention"
        },
        {titre:"Objet"
        },
        {titre:"Date signature"
        },
        {titre:"Financement"
        },
        {titre:"Delai"
        }];
 
/**********************************fin convention entete****************************************/       
        //recuperation donnée convention
        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention_entete = result.data.response; 
            console.log(vm.allconvention_entete);
        });

        //recuperation donnée prestataire
        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allbe= result.data.response;
            console.log(vm.allprestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemConvention_entete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
              {
                  vm.allpassation_marches_be = result.data.response;

                  if (vm.allpassation_marches_be.length!=0)
                  {
                    vm.showbuttonNouvPassation=false;
                  }
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

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

/**********************************fin convention entete****************************************/

/**********************************debut passation_marches_be****************************************/
//col table
        vm.passation_marches_be_column = [
        {titre:"Date shortlist"
        },
        {titre:"Date Appel manifestation"
        },
        {titre:"Date lancement DP"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre plis reçu"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Nom consultant"
        },
        {titre:"Statut"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterPassation_marches_be = function ()
        { 
          if (NouvelItemPassation_marches_be == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_shortlist: '',
              date_manifestation: '',         
              date_lancement_dp: '',
              date_remise: '',
              nbr_offre_recu: '',
              date_rapport_evaluation:'',
              date_demande_ano_dpfi: '',
              date_ano_dpfi: '',
              notification_intention: '',
              date_notification_attribution:'',
              date_signature_contrat:'',
              date_os: '',
              id_be: '',
              statut: '',
              observation:''
            };         
            vm.allpassation_marches_be.push(items);
            vm.allpassation_marches_be.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPassation_marches_be = mem;
              }
            });

            NouvelItemPassation_marches_be = true ;
          }else
          {
            vm.showAlert('Ajout passation_marches_be','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPassation_marches_be(passation_marches_be,suppression)
        {
            if (NouvelItemPassation_marches_be==false)
            {
                test_existancePassation_marches_be (passation_marches_be,suppression); 
            } 
            else
            {
                insert_in_basePassation_marches_be(passation_marches_be,suppression);
            }
        }

        //fonction de bouton d'annulation passation_marches_be
        vm.annulerPassation_marches_be = function(item)
        {
          if (NouvelItemPassation_marches_be == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemPassation_marches_be.observation ;
            item.date_os   = currentItemPassation_marches_be.date_os ;
            item.date_remise   = currentItemPassation_marches_be.date_remise ;
            item.date_ano_dpfi = currentItemPassation_marches_be.date_ano_dpfi ;
            item.nbr_offre_recu = currentItemPassation_marches_be.nbr_offre_recu;
            item.date_lancement_dp = currentItemPassation_marches_be.date_lancement_dp ;
            item.date_shortlist   = currentItemPassation_marches_be.date_shortlist ;
            item.date_manifestation   = currentItemPassation_marches_be.date_manifestation ;
            item.statut  = currentItemPassation_marches_be.statut;
            item.id_be = currentItemPassation_marches_be.id_prestataire ;
            item.date_signature_contrat   = currentItemPassation_marches_be.date_signature_contrat ;
            item.date_demande_ano_dpfi    = currentItemPassation_marches_be.date_demande_ano_dpfi ;
            item.date_rapport_evaluation  = currentItemPassation_marches_be.date_rapport_evaluation ;
            item.notification_intention   = currentItemPassation_marches_be.notification_intention;
            item.date_notification_attribution  = currentItemPassation_marches_be.date_notification_attribution ;
          }else
          {
            vm.allpassation_marches_be = vm.allpassation_marches_be.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPassation_marches_be.id;
            });
          }

          vm.selectedItemPassation_marches_be = {} ;
          NouvelItemPassation_marches_be      = false;
          
        };

        //fonction selection item region
        vm.selectionPassation_marches_be= function (item)
        {
            vm.selectedItemPassation_marches_be = item;
            vm.nouvelItemPassation_marches_be   = item;
            currentItemPassation_marches_be    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches_be));
            vm.stepTwo = true;
            vm.stepThree = false;
        };
        $scope.$watch('vm.selectedItemPassation_marches_be', function()
        {
             if (!vm.allpassation_marches_be) return;
             vm.allpassation_marches_be.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPassation_marches_be.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPassation_marches_be = function(item)
        {
            NouvelItemPassation_marches_be = false ;
            vm.selectedItemPassation_marches_be = item;
            currentItemPassation_marches_be = angular.copy(vm.selectedItemPassation_marches_be);
            $scope.vm.allpassation_marches_be.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemPassation_marches_be.observation ;
            item.date_os   = vm.selectedItemPassation_marches_be.date_os ;
            item.date_remise   = vm.selectedItemPassation_marches_be.date_remise ;
            item.date_ano_dpfi = vm.selectedItemPassation_marches_be.date_ano_dpfi;
            item.nbr_offre_recu = vm.selectedItemPassation_marches_be.nbr_offre_recu;
            item.date_lancement_be = vm.selectedItemPassation_marches_be.date_lancement_be ;
            item.id_be = vm.selectedItemPassation_marches_be.be.id ;
            item.date_signature_contrat   = vm.selectedItemPassation_marches_be.date_signature_contrat ;
            item.date_demande_ano_dpfi    = vm.selectedItemPassation_marches_be.date_demande_ano_dpfi ;
            item.date_rapport_evaluation  = vm.selectedItemPassation_marches_be.date_rapport_evaluation ;
            item.notification_intention   = vm.selectedItemPassation_marches_be.notification_intention;
            item.date_notification_attribution  = vm.selectedItemPassation_marches_be.date_notification_attribution ;
            item.date_shortlist   = vm.selectedItemPassation_marches_be.date_shortlist ;
            item.date_manifestation   = vm.selectedItemPassation_marches_be.date_manifestation ;
            item.statut  = vm.selectedItemPassation_marches_be.statut;
        };

        //fonction bouton suppression item passation_marches_be
        vm.supprimerPassation_marches_be = function()
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
                vm.ajoutPassation_marches_be(vm.selectedItemPassation_marches_be,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePassation_marches_be (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpassation_marches_be.filter(function(obj)
                {
                   return obj.id == currentItemPassation_marches_be.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemPassation_marches_be.observation )
                    || (pass[0].date_os   != currentItemPassation_marches_be.date_os )
                    || (pass[0].date_remise   != currentItemPassation_marches_be.date_remise )
                    || (pass[0].date_ano_dpfi != currentItemPassation_marches_be.date_ano_dpfi )
                    || (pass[0].nbr_offre_recu != currentItemPassation_marches_be.nbr_offre_recu)
                    || (pass[0].date_lancement_dp != currentItemPassation_marches_be.date_lancement_dp )
                    || (pass[0].id_be != currentItemPassation_marches_be.id_be ) 
                    || (pass[0].date_signature_contrat   != currentItemPassation_marches_be.date_signature_contrat )
                    || (pass[0].date_demande_ano_dpfi    != currentItemPassation_marches_be.date_demande_ano_dpfi )
                    || (pass[0].date_rapport_evaluation  != currentItemPassation_marches_be.date_rapport_evaluation )
                    || (pass[0].notification_intention   != currentItemPassation_marches_be.notification_intention)
                    || (pass[0].date_notification_attribution  != currentItemPassation_marches_be.date_notification_attribution )
                    || (pass[0].date_shortlist  != currentItemPassation_marches_be.date_shortlist )
                    || (pass[0].date_manifestation   != currentItemPassation_marches_be.date_manifestation)
                    || (pass[0].statut  != currentItemPassation_marches_be.statut ) )                   
                      { 
                         insert_in_basePassation_marches_be(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePassation_marches_be(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePassation_marches_be(passation_marches_be,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPassation_marches_be==false)
            {
                getId = vm.selectedItemPassation_marches_be.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement_dp: convertionDate(new Date(passation_marches_be.date_lancement_dp)),
                    date_os: convertionDate(new Date(passation_marches_be.date_os)),
                    date_remise: convertionDate(new Date(passation_marches_be.date_remise)),
                    nbr_offre_recu: passation_marches_be.nbr_offre_recu,
                    date_rapport_evaluation:convertionDate(new Date(passation_marches_be.date_rapport_evaluation)),
                    date_demande_ano_dpfi: convertionDate(new Date(passation_marches_be.date_demande_ano_dpfi)),
                    date_ano_dpfi: convertionDate(new Date(passation_marches_be.date_ano_dpfi)),
                    notification_intention: convertionDate(new Date(passation_marches_be.notification_intention)),
                    date_notification_attribution: convertionDate(new Date(passation_marches_be.date_notification_attribution)),
                    date_signature_contrat: convertionDate(new Date(passation_marches_be.date_signature_contrat)),
                    id_be: passation_marches_be.id_be,
                    date_shortlist: convertionDate(new Date(passation_marches_be.date_shortlist)),
                    date_manifestation: convertionDate(new Date(passation_marches_be.date_manifestation)),
                    statut: passation_marches_be.statut,
                    observation:passation_marches_be.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id               
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_be/index",datas, config).success(function (data)
            {   
                var be= vm.allbe.filter(function(obj)
                {
                    return obj.id == passation_marches_be.id_be;
                });

                if (NouvelItemPassation_marches_be == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPassation_marches_be.observation   = passation_marches_be.observation ;
                        vm.selectedItemPassation_marches_be.date_os   = passation_marches_be.date_os ;
                        vm.selectedItemPassation_marches_be.date_remise   = passation_marches_be.date_remise ;
                        vm.selectedItemPassation_marches_be.date_ano_dpfi = passation_marches_be.date_ano_dpfi ;
                        vm.selectedItemPassation_marches_be.nbr_offre_recu = passation_marches_be.nbr_offre_recu;
                        vm.selectedItemPassation_marches_be.date_lancement_dp = passation_marches_be.date_lancement_dp ;
                        vm.selectedItemPassation_marches_be.be = be[0];
                        vm.selectedItemPassation_marches_be.date_signature_contrat   = passation_marches_be.date_signature_contrat ;
                        vm.selectedItemPassation_marches_be.date_demande_ano_dpfi    = passation_marches_be.date_demande_ano_dpfi ;
                        vm.selectedItemPassation_marches_be.date_rapport_evaluation  = passation_marches_be.date_rapport_evaluation ;
                        vm.selectedItemPassation_marches_be.notification_intention   = passation_marches_be.notification_intention;
                        vm.selectedItemPassation_marches_be.date_notification_attribution  = passation_marches_be.date_notification_attribution ;
                        
                        vm.selectedItemPassation_marches_be.date_shortlist  = passation_marches_be.date_shortlist ;
                        vm.selectedItemPassation_marches_be.date_manifestation   = passation_marches_be.date_manifestation;
                        vm.selectedItemPassation_marches_be.statut  = passation_marches_be.statut ;

                        vm.selectedItemPassation_marches_be.$selected  = false;
                        vm.selectedItemPassation_marches_be.$edit      = false;
                        vm.selectedItemPassation_marches_be ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allpassation_marches_be = vm.allpassation_marches_be.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPassation_marches_be.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                  passation_marches_be.observation   = passation_marches_be.observation ;
                  passation_marches_be.date_os   = passation_marches_be.date_os ;
                  passation_marches_be.date_remise   = passation_marches_be.date_remise ;
                  passation_marches_be.date_ano_dpfi = passation_marches_be.date_ano_dpfi ;
                  passation_marches_be.nbr_offre_recu = passation_marches_be.nbr_offre_recu;
                  passation_marches_be.date_lancement_dp = passation_marches_be.date_lancement_dp ;
                  passation_marches_be.be = be[0];
                  passation_marches_be.date_signature_contrat   = passation_marches_be.date_signature_contrat ;
                  passation_marches_be.date_demande_ano_dpfi    = passation_marches_be.date_demande_ano_dpfi ;
                  passation_marches_be.date_rapport_evaluation  = passation_marches_be.date_rapport_evaluation ;
                  passation_marches_be.notification_intention   = passation_marches_be.notification_intention;
                  passation_marches_be.date_notification_attribution  = passation_marches_be.date_notification_attribution ;

                  passation_marches_be.date_shortlist  = passation_marches_be.date_shortlist ;
                  passation_marches_be.date_manifestation   = passation_marches_be.date_manifestation;
                  passation_marches_be.statut  = passation_marches_be.statut ;

                  passation_marches_be.id  =   String(data.response);              
                  NouvelItemPassation_marches_be=false;
                  vm.showbuttonNouvPassation= false;
            }
              passation_marches_be.$selected = false;
              passation_marches_be.$edit = false;
              vm.selectedItemPassation_marches_be = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.affichageStatut= function(statut)
        { var stat= '';
          switch (statut)
            {
              case '1':
                 stat = 'BE';
 
                  break;
              
              case '2':
                   stat = 'CI';
                  break;

              default:
          
            }
         return stat;   
        }
/**********************************fin passation_marches_be****************************************/
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
