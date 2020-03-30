(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.reception_mpe')
        .controller('Reception_mpeController', Reception_mpeController);
    /** @ngInject */
    function Reception_mpeController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
		    var vm = this;
       /* vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;*/
        vm.selectedItemPrestataire = {} ;
        vm.allprestataire = [] ;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        vm.ajoutReception_mpe_invalide = ajoutReception_mpe_invalide ;
        var NouvelItemReception_mpe_invalide=false;
        var currentItemReception_mpe_invalide;
        vm.selectedItemReception_mpe_invalide = {} ;
        vm.allreception_mpe_invalide = [] ;

        vm.allprestataire = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.date_now         = new Date();
        vm.showbuttonEnregi = true;
        vm.showboutonValider = false;
        vm.permissionboutonValider = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //style
        vm.dtOptionsperso = {
          dom: '<"top">rt<"bottom"<"left"<"length"l>><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };
/**********************************debut prestataire****************************************/
//col table
       /* vm.prestataire_column = [
        {titre:"Nom"},
        {titre:"Nif"},
        {titre:"Stat"},
        {titre:"Siege"},
        {titre:"telephone"}
        ];
        //recuperation donnée prestataire
        apiFactory.getAll("prestataire/index").then(function(result)
        {
            vm.allprestataire = result.data.response; 
            console.log(vm.allprestataire);
        });

        //fonction selection item entete convention cisco/feffi
        vm.selectionPrestataire = function (item)
        {
            vm.selectedItemPrestataire = item;
           // vm.allconvention= [] ;
            
            
            //recuperation donnée convention
            if (vm.selectedItemPrestataire.id!=0)
            { 

              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menu','getcontratByprestataire','id_prestataire',vm.selectedItemPrestataire.id).then(function(result)
              {
                  vm.allcontrat_prestataire = result.data.response; 
                  console.log(vm.allcontrat_prestataire);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemPrestataire', function()
        {
             if (!vm.allprestataire) return;
             vm.allprestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPrestataire.$selected = true;
        });
*/
/**********************************fin prestataire****************************************/
/*
//col table
        vm.contrat_prestataire_column = [
        {titre:"Prestataire"
        },
        {titre:"Description"
        },
        {titre:"Numero contrat"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Date signature"
        },
        {titre:"Date prévisionnelle"
        },
        {titre:"Date réel"
        },
        {titre:"Délai éxecution"
        }];

        //fonction selection item region
        vm.selectionContrat_prestataire= function (item)
        {
            vm.selectedItemContrat_prestataire = item;
           if(item.id!=0)
           {
              apiFactory.getAPIgeneraliserREST("reception_mpe_invalide/index",'menu','getreceptionBycontrat_prestataire','id_contrat_prestataire',vm.selectedItemContrat_prestataire.id).then(function(result)
              {
                  vm.allreception_mpe_invalide = result.data.response;
                  console.log(vm.allreception_mpe_invalide);

                  if (vm.allreception_mpe_invalide.length!=0)
                  {
                      vm.showbuttonNouvPassation=false;
                  }
              });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_prestataire', function()
        {
             if (!vm.allcontrat_prestataire) return;
             vm.allcontrat_prestataire.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_prestataire.$selected = true;
        });*/

/**********************************debut contrat****************************************/

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

            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreceptioninvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                  vm.allreception_mpe_invalide = result.data.response;
            });
          }
        });

        vm.change_contrat = function(item)
        { 
          if (item.id == 0)
          {
            apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreceptionBycontrat_prestataire','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
            {
                vm.reception_mpe = result.data.response;
                if (vm.reception_mpe.length>0)
                {
                  vm.showAlert('Echec d\'ajout','Donnée exist déjà');
                  vm.showbuttonEnregi = false;
                }
            });
          } 
          else
          {
            if (item.id_contrat_prestataire!=currentItemReception_mpe_invalide.contrat_prestataire.id)
            {
              apiFactory.getAPIgeneraliserREST("reception_mpe/index",'menu','getreceptionBycontrat_prestataire','id_contrat_prestataire',item.id_contrat_prestataire).then(function(result)
              {
                  vm.reception_mpe = result.data.response;
                  if (vm.reception_mpe.length>0)
                  {
                    vm.showAlert('Echec d\'ajout','Donnée exist déjà');
                    vm.showbuttonEnregi = false;
                  }
              });
            }
          }
            
        }

/**********************************debut passation_marches****************************************/
//col table
        vm.reception_mpe_invalide_column = [
        {titre:"Contrat"
        },
        {titre:"Date prévisionnelle réception technique"
        },
        {titre:"Date réelle de réception technique"
        },
        {titre:"Date levée des réserves de la réception technique"
        },
        {titre:"Date prévisionnelle réception provisoire"
        },
        {titre:"Date réelle réception provisoire"
        },
        {titre:"Date prévisionnelle de levée des réserves avant RD"
        },
        {titre:"Date réelle de levée des réserves avant RD"
        },
        {titre:"Date prévisionnelle réception définitive"
        },
        {titre:"Date réelle réception définitive"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];        //Masque de saisi ajout
        vm.ajouterReception_mpe_invalide = function ()
        { 
          if (NouvelItemReception_mpe_invalide == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              id_contrat_prestataire: '',         
              date_previ_recep_tech: '',
              date_reel_tech: '',
              date_leve_recep_tech: '',
              date_previ_recep_prov:'',
              date_reel_recep_prov:'',
              date_previ_leve: '',
              date_reel_lev_ava_rd:'',
              date_previ_recep_defi: '',
              date_reel_recep_defi: '',
              observation:''
            };         
            vm.allreception_mpe_invalide.push(items);
           
            vm.selectedItemReception_mpe_invalide = items;             

            NouvelItemReception_mpe_invalide = true ;
          }else
          {
            vm.showAlert('Ajout reception_mpe_invalides','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutReception_mpe_invalide(reception_mpe_invalide,suppression)
        {
            if (NouvelItemReception_mpe_invalide==false)
            {
                test_existanceReception_mpe_invalide (reception_mpe_invalide,suppression); 
            } 
            else
            {
                insert_in_baseReception_mpe_invalide(reception_mpe_invalide,suppression);
            }
        }

        //fonction de bouton d'annulation reception_mpe_invalide
        vm.annulerReception_mpe_invalide = function(item)
        {
          if (NouvelItemReception_mpe_invalide == false)
          {
            item.$edit      = false;
            item.$selected = false;

            item.id_contrat_prestataire   = currentItemReception_mpe_invalide.id_contrat_prestataire ;
            item.observation              = currentItemReception_mpe_invalide.observation ;
            item.date_previ_recep_tech    = currentItemReception_mpe_invalide.date_previ_recep_tech ;
            item.date_reel_tech           = currentItemReception_mpe_invalide.date_reel_tech ;
            item.date_leve_recep_tech     = currentItemReception_mpe_invalide.date_leve_recep_tech ;
            item.date_previ_recep_prov    = currentItemReception_mpe_invalide.date_previ_recep_prov;
            item.date_reel_recep_prov     = currentItemReception_mpe_invalide.date_reel_recep_prov ; 
            item.date_previ_leve          = currentItemReception_mpe_invalide.date_previ_leve ; 
            item.date_reel_lev_ava_rd     = currentItemReception_mpe_invalide.date_reel_lev_ava_rd ;
            item.date_previ_recep_defi    = currentItemReception_mpe_invalide.date_previ_recep_defi ;
            item.date_reel_recep_defi     = currentItemReception_mpe_invalide.date_reel_recep_defi ;
          }
            else
            {
              vm.allreception_mpe_invalide = vm.allreception_mpe_invalide.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemReception_mpe_invalide.id;
              });
            }

          vm.selectedItemReception_mpe_invalide = {} ;
          NouvelItemReception_mpe_invalide      = false;
          vm.showbuttonEnregi = true;
          
        };

        //fonction selection item region
        vm.selectionReception_mpe_invalide= function (item)
        {
            vm.selectedItemReception_mpe_invalide = item;

            if (item.$selected = false)
            {
              currentItemReception_mpe_invalide    = JSON.parse(JSON.stringify(vm.selectedItemReception_mpe_invalide));
            }
            if (item.$edit ==false) 
            {
              vm.showboutonValider = true;
            }
            
             
        };
        $scope.$watch('vm.selectedItemReception_mpe_invalide', function()
        {
             if (!vm.allreception_mpe_invalide) return;
             vm.allreception_mpe_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemReception_mpe_invalide.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierReception_mpe_invalide = function(item)
        {console.log('tonga');
            NouvelItemReception_mpe_invalide = false ;
            vm.selectedItemReception_mpe_invalide = item;

            currentItemReception_mpe_invalide = angular.copy(vm.selectedItemReception_mpe_invalide);
            $scope.vm.allreception_mpe_invalide.forEach(function(mem) {
              mem.$edit = false;
            });

            item.observation              = vm.selectedItemReception_mpe_invalide.observation ;
            item.id_contrat_prestataire              = vm.selectedItemReception_mpe_invalide.contrat_prestataire.id ;
            item.date_previ_recep_tech    = new Date( vm.selectedItemReception_mpe_invalide.date_previ_recep_tech );
            item.date_reel_tech           = new Date( vm.selectedItemReception_mpe_invalide.date_reel_tech );
            item.date_leve_recep_tech     = new Date( vm.selectedItemReception_mpe_invalide.date_leve_recep_tech );
            item.date_previ_recep_prov    = new Date( vm.selectedItemReception_mpe_invalide.date_previ_recep_prov);
            item.date_reel_recep_prov     = new Date( vm.selectedItemReception_mpe_invalide.date_reel_recep_prov ); 
            item.date_previ_leve          = new Date( vm.selectedItemReception_mpe_invalide.date_previ_leve ); 
            item.date_reel_lev_ava_rd     = new Date( vm.selectedItemReception_mpe_invalide.date_reel_lev_ava_rd );
            item.date_previ_recep_defi    = new Date( vm.selectedItemReception_mpe_invalide.date_previ_recep_defi );
            item.date_reel_recep_defi     = new Date( vm.selectedItemReception_mpe_invalide.date_reel_recep_defi );
            item.$edit=true;
        };

        //fonction bouton suppression item reception_mpe_invalide
        vm.supprimerReception_mpe_invalide = function()
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
                vm.ajoutReception_mpe_invalide(vm.selectedItemReception_mpe_invalide,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceReception_mpe_invalide (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allreception_mpe_invalide.filter(function(obj)
                {
                   return obj.id == currentItemReception_mpe_invalide.id;
                });
                if(pass[0])
                {
                   if((item.observation               != currentItemReception_mpe_invalide.observation )
                    || (item.date_previ_recep_tech    != currentItemReception_mpe_invalide.date_previ_recep_tech )
                    || (item.date_reel_tech           != currentItemReception_mpe_invalide.date_reel_tech )
                    || (item.date_leve_recep_tech     != currentItemReception_mpe_invalide.date_leve_recep_tech )
                    || (item.date_previ_recep_prov    != currentItemReception_mpe_invalide.date_previ_recep_prov)
                    || (item.date_reel_recep_prov     != currentItemReception_mpe_invalide.date_reel_recep_prov ) 
                    || (item.date_previ_leve          != currentItemReception_mpe_invalide.date_previ_leve )
                    || (item.date_reel_lev_ava_rd     != currentItemReception_mpe_invalide.date_reel_lev_ava_rd )
                    || (item.date_previ_recep_defi    != currentItemReception_mpe_invalide.date_previ_recep_defi )
                    || (item.date_reel_recep_defi     != currentItemReception_mpe_invalide.date_reel_recep_defi )
                    || (item.id_contrat_prestataire   != currentItemReception_mpe_invalide.id_contrat_prestataire ))                   
                      { 
                         insert_in_baseReception_mpe_invalide(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseReception_mpe_invalide(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseReception_mpe_invalide(reception_mpe_invalide,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemReception_mpe_invalide==false)
            {
                getId = vm.selectedItemReception_mpe_invalide.id; 
            } 
            console.log(vm.selectedItemReception_mpe_invalide);
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    observation              : reception_mpe_invalide.observation,
                    date_previ_recep_tech    : convertionDate(new Date(reception_mpe_invalide.date_previ_recep_tech )),
                    date_reel_tech           : convertionDate(new Date(reception_mpe_invalide.date_reel_tech )),
                    date_leve_recep_tech     : convertionDate(new Date(reception_mpe_invalide.date_leve_recep_tech )),
                    date_previ_recep_prov    : convertionDate(new Date(reception_mpe_invalide.date_previ_recep_prov)),
                    date_reel_recep_prov     : convertionDate(new Date(reception_mpe_invalide.date_reel_recep_prov )), 
                    date_previ_leve          : convertionDate(new Date(reception_mpe_invalide.date_previ_leve )), 
                    date_reel_lev_ava_rd     : convertionDate(new Date(reception_mpe_invalide.date_reel_lev_ava_rd )),
                    date_previ_recep_defi    : convertionDate(new Date(reception_mpe_invalide.date_previ_recep_defi )),
                    date_reel_recep_defi     : convertionDate(new Date(reception_mpe_invalide.date_reel_recep_defi )),
                    id_contrat_prestataire    :reception_mpe_invalide.id_contrat_prestataire,
                    validation    :0
                      
                });
                console.log(datas);
                //factory
            apiFactory.add("reception_mpe/index",datas, config).success(function (data)
            {   
                var contrat= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == reception_mpe_invalide.id_contrat_prestataire;
                });

                if (NouvelItemReception_mpe_invalide == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                       
                        vm.selectedItemReception_mpe_invalide.contrat_prestataire = contrat[0];
                        vm.selectedItemReception_mpe_invalide.$selected  = false;
                        vm.selectedItemReception_mpe_invalide.$edit      = false;
                        vm.selectedItemReception_mpe_invalide ={};
                        
                    }
                    else 
                    {    
                      vm.allreception_mpe_invalide = vm.allreception_mpe_invalide.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemReception_mpe_invalide.id;
                      });
                      
                    }
                    
                }
                else
                {
                  reception_mpe_invalide.contrat_prestataire = contrat[0];
                  reception_mpe_invalide.id  =   String(data.response);              
                  NouvelItemReception_mpe_invalide=false;
                  
            }
              
              vm.showboutonValider = false;
              reception_mpe_invalide.$selected = false;
              reception_mpe_invalide.$edit = false;
              vm.selectedItemReception_mpe_invalide = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.valider_reception = function()
        {
          valider_reception_in_base(vm.selectedItemReception_mpe_invalide,0,1);
        }
        function valider_reception_in_base(reception_mpe_invalide,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            var datas = $.param({
                    supprimer: suppression,
                    id:        reception_mpe_invalide.id,
                    observation              : reception_mpe_invalide.observation,
                    date_previ_recep_tech    : convertionDate(new Date(reception_mpe_invalide.date_previ_recep_tech )),
                    date_reel_tech           : convertionDate(new Date(reception_mpe_invalide.date_reel_tech )),
                    date_leve_recep_tech     : convertionDate(new Date(reception_mpe_invalide.date_leve_recep_tech )),
                    date_previ_recep_prov    : convertionDate(new Date(reception_mpe_invalide.date_previ_recep_prov)),
                    date_reel_recep_prov     : convertionDate(new Date(reception_mpe_invalide.date_reel_recep_prov )), 
                    date_previ_leve          : convertionDate(new Date(reception_mpe_invalide.date_previ_leve )), 
                    date_reel_lev_ava_rd     : convertionDate(new Date(reception_mpe_invalide.date_reel_lev_ava_rd )),
                    date_previ_recep_defi    : convertionDate(new Date(reception_mpe_invalide.date_previ_recep_defi )),
                    date_reel_recep_defi     : convertionDate(new Date(reception_mpe_invalide.date_reel_recep_defi )),
                    id_contrat_prestataire    :reception_mpe_invalide.contrat_prestataire.id,
                    validation    :validation
                      
                });
                console.log(datas);
                //factory
            apiFactory.add("reception_mpe/index",datas, config).success(function (data)
            {   
                vm.allreception_mpe_invalide = vm.allreception_mpe_invalide.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemReception_mpe_invalide.id;
                });
              
              vm.showboutonValider = false;
              reception_mpe_invalide.$selected = false;
              reception_mpe_invalide.$edit = false;
              vm.selectedItemReception_mpe_invalide = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin reception_mpe_invalide****************************************/


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
