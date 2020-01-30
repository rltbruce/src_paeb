(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi')
        .controller('Convention_cisco_feffiController', Convention_cisco_feffiController);
    /** @ngInject */
    function Convention_cisco_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        var NouvelItemTete = false;
        var currentItemTete;

        var NouvelItemDetail = false;
        var currentItemDetail;

        var NouvelItemBatiment_construction = false;
        var currentItemBatiment_construction;

        vm.date_now         = new Date();
        vm.allcisco         = [] ;
        vm.ajoutTete        = ajoutTete ;
        vm.selectedItemTete = {} ;
        vm.allconvention_cife_tete  = [] ;

        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.stepFor           = false;
       
        vm.allacces_zone  = [] ;
        vm.allzone_subvention  = [] ;

        vm.ajoutDetail = ajoutDetail ;
        vm.selectedItemDetail = {} ;
        vm.allconvention_cife_detail  = [] ;
        vm.showbuttonNouvDetail=true;


        vm.allattachement_batiment  = [] ;
        vm.allbatiment_ouvrage  = [] ;

        vm.ajoutBatiment_construction = ajoutBatiment_construction ;
        vm.selectedItemBatiment_construction = {} ;
        vm.allbatiment_construction  = [] ;

        vm.allattachement_latrine  = [] ;
        vm.allannexe_latrine  = [] ;

        var NouvelItemLatrine_construction = false;
        var currentItemLatrine_construction;

        vm.ajoutLatrine_construction = ajoutLatrine_construction ;
        vm.selectedItemLatrine_construction = {} ;
        vm.alllatrine_construction  = [] ;
        vm.showbuttonNouvLatrine=true;

        vm.allattachement_mobilier  = [] ;
        vm.allannexe_mobilier  = [] ;

        var NouvelItemMobilier_construction = false;
        var currentItemMobilier_construction;

        vm.ajoutMobilier_construction = ajoutMobilier_construction ;
        vm.selectedItemMobilier_construction = {} ;
        vm.allmobilier_construction  = [] ;
        vm.showbuttonNouvMobilier=true;

      /*****fin initialisation*****/

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

      /*****************debut convention entete***************/

        //col table
        vm.convention_cife_tete_column = [
        {
          titre:"Cisco"
        },
        {
          titre:"Feffi"
        },
        {
          titre:"Numero convention"
        },
        {
          titre:"Objet"
        },
        {
          titre:"Date signature"
        },
        {
          titre:"Financement"
        },
        {
          titre:"Delai"
        },
        {
          titre:"Action"
        }];
        
        //recuperation donnée convention
        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventioninvalide').then(function(result)
        {
            vm.allconvention_cife_tete = result.data.response; 
            console.log(vm.allconvention_cife_tete);
        });

        //recuperation donnée cisco
        apiFactory.getAll("cisco/index").then(function(result)
        {
          vm.allcisco= result.data.response;
        });

        //recuperation donnée feffi
        apiFactory.getAll("feffi/index").then(function(result)
        {
          vm.allfeffi= result.data.response;
        });

        //Masque de saisi ajout
        vm.ajouterTete = function ()
        { 
          if (NouvelItemTete == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_cisco:'',
              id_feffi:'',
              numero_convention: '',
              objet: '',              
              date_signature: '',
              financement: '',
              delai: ''
            };         
            vm.allconvention_cife_tete.push(items);
            vm.allconvention_cife_tete.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemTete = conv;
              }
            });

            NouvelItemTete = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutTete(convention_cife_tete,suppression)
        {
            if (NouvelItemTete==false)
            {
                test_existanceTete (convention_cife_tete,suppression); 
            } 
            else
            {
                insert_in_baseTete(convention_cife_tete,suppression);
            }
        }

        //fonction de bouton d'annulation convention_cife_tete
        vm.annulerTete = function(item)
        {
          if (NouvelItemTete == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.delai       = currentItemTete.delai ;
              item.id_cisco    = currentItemTete.id_cisco ;
              item.id_feffi    = currentItemTete.id_feffi ;
              item.objet       = currentItemTete.objet ;
              item.date_signature  = currentItemTete.date_signature ;
              item.financement     = currentItemTete.financement ;
              item.numero_convention  = currentItemTete.numero_convention ; 
          }else
          {
            vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
            {
                return obj.id !== vm.selectedItemTete.id;
            });
          }

          vm.selectedItemTete = {} ;
          NouvelItemTete      = false;
          
        };

        //fonction selection item entete convention cisco/feffi
        vm.selectionTete = function (item)
        {
            vm.selectedItemTete = item;
            currentItemTete     = JSON.parse(JSON.stringify(vm.selectedItemTete));
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvDetail=true;
            //recuperation donnée convention
            if (vm.selectedItemTete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
              {
                  vm.allconvention_cife_detail = result.data.response;

                  if (vm.allconvention_cife_detail.length!=0)
                  {
                    vm.showbuttonNouvDetail=false;
                  } 
                  console.log(vm.showbuttonNouvDetail);
                  console.log(vm.allconvention_cife_detail);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
            }
            ;           

        };
        $scope.$watch('vm.selectedItemTete', function()
        {
             if (!vm.allconvention_cife_tete) return;
             vm.allconvention_cife_tete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTete.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierTete = function(item)
        {
            NouvelItemTete = false ;
            vm.selectedItemTete = item;
            currentItemTete = angular.copy(vm.selectedItemTete);
            $scope.vm.allconvention_cife_tete.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.delai = parseInt(vm.selectedItemTete.delai) ;
            item.id_cisco = vm.selectedItemTete.cisco.id ;
            item.id_feffi = vm.selectedItemTete.feffi.id ;
            item.objet    = vm.selectedItemTete.objet ;
            item.date_signature    = vm.selectedItemTete.date_signature ;            
            item.financement       = vm.selectedItemTete.financement ;
            item.numero_convention = parseInt(vm.selectedItemTete.numero_convention) ;

        };

        //fonction bouton suppression item entente convention cisco feffi
        vm.supprimerTete = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutTete(vm.selectedItemTete,1);
              }, function() {
                //alert('rien');
              });

              vm.stepOne = false;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceTete (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allconvention_cife_tete.filter(function(obj)
                {
                   return obj.id == currentItemTete.id;
                });
                if(convT[0])
                {
                   if((convT[0].delai!=currentItemTete.delai)
                    || (convT[0].id_cisco!=currentItemTete.id_cisco)
                    || (convT[0].id_feffi!=currentItemTete.id_feffi)
                    || (convT[0].objet!=currentItemTete.objet)
                    || (convT[0].date_signature!=currentItemTete.date_signature)
                    || (convT[0].financement!=currentItemTete.financement)
                    || (convT[0].numero_convention!=currentItemTete.numero_convention))                    
                      { 
                        insert_in_baseTete(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTete(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseTete(convention_cife_tete,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTete ==false)
            {
                getId = vm.selectedItemTete.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    delai:    convention_cife_tete.delai,
                    id_cisco: convention_cife_tete.id_cisco,
                    id_feffi: convention_cife_tete.id_feffi,
                    objet:    convention_cife_tete.objet,
                    date_signature:    convertionDate(new Date(convention_cife_tete.date_signature)),
                    financement:       convention_cife_tete.financement,
                    numero_convention: convention_cife_tete.numero_convention,
                    validation: 0               
                });
                //console.log(convention.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            {
                
                var cis = vm.allcisco.filter(function(obj)
                {
                    return obj.id == convention_cife_tete.id_cisco;
                });

                var fef = vm.allfeffi.filter(function(obj)
                {
                    return obj.id == convention_cife_tete.id_feffi;
                });

                if (NouvelItemTete == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTete.delai  = convention_cife_tete.delai;;
                        vm.selectedItemTete.cisco   = cis[0];
                        vm.selectedItemTete.feffi   = fef[0];
                        vm.selectedItemTete.objet   = convention_cife_tete.objet;
                        vm.selectedItemTete.date_signature    = convention_cife_tete.date_signature;
                        vm.selectedItemTete.financement       = convention_cife_tete.financement;
                        vm.selectedItemTete.numero_convention = convention_cife_tete.numero_convention;
                        vm.selectedItemTete.$selected  = false;
                        vm.selectedItemTete.$edit      = false;
                        vm.selectedItemTete ={};
                    }
                    else 
                    {    
                      vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTete.id;
                      });
                    }
                }
                else
                {
                  
                  convention_cife_tete.detail= convention_cife_tete.detail;
                  convention_cife_tete.cisco = cis[0];
                  convention_cife_tete.feffi = fef[0];
                  convention_cife_tete.objet = convention_cife_tete.objet;
                  convention_cife_tete.date_signature     = convention_cife_tete.date_signature;
                  convention_cife_tete.financement        = convention_cife_tete.financement;
                  convention_cife_tete.numero_convention  = convention_cife_tete.numero_convention;
                  convention_cife_tete.id  =   String(data.response);              
                  NouvelItemTete = false;
            }
              convention_cife_tete.$selected = false;
              convention_cife_tete.$edit = false;
              vm.selectedItemTete = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

      /*****************fin convention entete***************/

      /*****************debut convention detail**************/

      //col table
        vm.convention_cife_detail_column = [
        {
          titre:"Intitule"
        },
        {
          titre:"Zone subvention"
        },
        {
          titre:"Acces zone"
        },
        {
          titre:"Cout éstimé"
        },
        {
          titre:"Action"
        }];      
        
        //recuperation donnée zone_subvetention
        apiFactory.getAll("zone_subvention/index").then(function(result)
        {
          vm.allzone_subvention= result.data.response;
        });

        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
          vm.allacces_zone= result.data.response;
        });

        //Masque de saisi ajout
        vm.ajouterDetail = function ()
        { 
          if (NouvelItemDetail == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              intitule:'',
              montant_total:0,
              id_zone_subvention:'',
              id_acces_zone: ''
            };         
            vm.allconvention_cife_detail.push(items);
            vm.allconvention_cife_detail.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemDetail = conv;
              }
            });

            NouvelItemDetail = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDetail(convention_cife_detail,suppression)
        {
            if (NouvelItemDetail==false)
            {
                test_existanceDetail (convention_cife_detail,suppression); 
            } 
            else
            {
                insert_in_baseDetail(convention_cife_detail,suppression);
            }
        }

        //fonction de bouton d'annulation convention_cife_detail
        vm.annulerDetail = function(item)
        {
          if (NouvelItemDetail == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.intitule = currentItemDetail.intitule;
              item.montant_total = currentItemDetail.montant_total;
              item.id_zone_subvention = currentItemDetail.id_zone_subvention;
              item.id_acces_zone    = currentItemDetail.id_acces_zone; 
          }else
          {
            vm.allconvention_cife_detail = vm.allconvention_cife_detail.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDetail.id;
            });
          }

          vm.selectedItemDetail = {} ;
          NouvelItemDetail      = false;
          
        };

        //fonction selection item detail convention cisco/feffi
        vm.selectionDetail = function (item)
        {
            vm.selectedItemDetail = item;
            currentItemDetail     = JSON.parse(JSON.stringify(vm.selectedItemDetail));
           // vm.allconvention= [] ;
            
            //recuperation donnée convention
            if (vm.selectedItemDetail.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_detail',vm.selectedItemDetail.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response; 
                  console.log(vm.allbatiment_construction);
              });

              vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;
            }
                        

        };
        $scope.$watch('vm.selectedItemDetail', function()
        {
             if (!vm.allconvention_cife_detail) return;
             vm.allconvention_cife_detail.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDetail.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierDetail = function(item)
        {
            NouvelItemDetail = false ;
            vm.selectedItemDetail = item;
            currentItemDetail = angular.copy(vm.selectedItemDetail);
            $scope.vm.allconvention_cife_detail.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.intitule = vm.selectedItemDetail.intitule ;
            item.montant_total = parseInt(vm.selectedItemDetail.montant_total) ;
            item.id_zone_subvention = vm.selectedItemDetail.zone_subvention.id ;
            item.id_acces_zone = vm.selectedItemDetail.acces_zone.id ;
        };

        //fonction bouton suppression item detail convention cisco feffi
        vm.supprimerDetail = function()
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
                vm.ajoutDetail(vm.selectedItemDetail,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceDetail (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.allconvention_cife_detail.filter(function(obj)
                {
                   return obj.id == currentItemDetail.id;
                });
                if(convT[0])
                {
                   if((convT[0].id_zone_subvention!=currentItemDetail.id_zone_subvention)
                    || (convT[0].intitule!=currentItemDetail.intitule)
                    || (convT[0].id_acces_zone!=currentItemDetail.id_acces_zone))                    
                      { 
                        
                        if ((convT[0].id_zone_subvention!=currentItemDetail.id_zone_subvention)
                          ||(convT[0].id_acces_zone!=currentItemDetail.id_acces_zone))
                        {
                          insert_in_baseDetail(item,suppression);
                          supressionouvrage_construction();
                        }
                        else
                        {
                          insert_in_baseDetail(item,suppression);
                        }
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDetail(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseDetail(convention_cife_detail,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDetail ==false)
            {
                getId = vm.selectedItemDetail.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    montant_total:    convention_cife_detail.montant_total,
                    intitule:    convention_cife_detail.intitule,
                    id_zone_subvention: convention_cife_detail.id_zone_subvention,
                    id_acces_zone: convention_cife_detail.id_acces_zone, 
                    id_convention_entete: vm.selectedItemTete.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_detail/index",datas, config).success(function (data)
            {
                
                var zosub = vm.allzone_subvention.filter(function(obj)
                {
                    return obj.id == convention_cife_detail.id_zone_subvention;
                });

                var azone = vm.allacces_zone.filter(function(obj)
                {
                    return obj.id == convention_cife_detail.id_acces_zone;
                });

                if (NouvelItemDetail == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDetail.intitule  = convention_cife_detail.intitule;
                        vm.selectedItemDetail.montant_total  = convention_cife_detail.montant_total;
                        vm.selectedItemDetail.zone_subvention   = zosub[0];
                        vm.selectedItemDetail.acces_zone   = azone[0];
                        vm.selectedItemDetail.$selected  = false;
                        vm.selectedItemDetail.$edit      = false;
                        vm.selectedItemDetail ={};
                        vm.showbuttonNouvDetail = false;
                    }
                    else 
                    {    
                      vm.allconvention_cife_detail = vm.allconvention_cife_detail.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDetail.id;
                      });
                      vm.showbuttonNouvDetail = true;
                    }
                }
                else
                {
                  
                  convention_cife_detail.intitule= convention_cife_detail.intitule;
                  convention_cife_detail.montant_total= convention_cife_detail.montant_total;
                 
                  convention_cife_detail.zone_subvention = zosub[0];
                  convention_cife_detail.acces_zone = azone[0];
                  convention_cife_detail.id  =   String(data.response);              
                  NouvelItemDetail = false;

                  vm.showbuttonNouvDetail = false;
            }
              convention_cife_detail.$selected = false;
              convention_cife_detail.$edit = false;
              vm.selectedItemDetail = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.change_zone_subvention = function(item)
        {
          item.id_acces_zone = null;
          
          if(NouvelItemDetail == false)
          { 
            if (currentItemDetail.zone_subvention.id!=item.id_zone_subvention)
            {
              vm.showAlert('Avertissement','Les travaux de construction seront supprimer si vous enregistre cette operation');
            }  
          }
        }

        vm.change_acces_zone = function(item)
        {
          if(NouvelItemDetail == false)
          { 
            if (currentItemDetail.acces_zone.id!=item.id_acces_zone)
            {
              vm.showAlert('Avertissement','Les travaux de construction seront supprimer si vous enregistre cette operation');
            }
            
          }
        }

        function supressionouvrage_construction()
        { 
          //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    id_convention_detail: vm.selectedItemDetail.id,
                    menu: 'supressionBydetail'             
                });
            apiFactory.add("batiment_construction/index",datas,config).then(function(result)
            { 
              vm.allbatiment_construction=[];
            });
        }
       
      /*****************fin convention detail****************/

      /*****************debut batiment construction***************/
      //col table
        vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"cout maitrise oeuvre"
        },
        {
          titre:"Cout batiment"
        },
        {
          titre:"Cout sous projet"
        },
        {
          titre:"Attachement"
        },
        {
          titre:"Ponderation"
        },
        {
          titre:"Action"
        }];

        //recuperation donnée batiment ouvrage
        apiFactory.getAll("batiment_ouvrage/index").then(function(result)
        {
          vm.allbatiment_ouvrage= result.data.response;
        });

        //Masque de saisi ajout
        vm.ajouterBatiment_construction = function ()
        { 
          if (NouvelItemBatiment_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_batiment_ouvrage:'',
              cout_maitrise_oeuvre:'',
              cout_batiment:'',
              cout_sous_projet:'',
              id_attachement_batiment: '',
              ponderation_batiment: ''
            };         
            vm.allbatiment_construction.push(items);
            vm.allbatiment_construction.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemBatiment_construction = conv;
              }
            });

            NouvelItemBatiment_construction = true ;
          }else
          {
            vm.showAlert('Ajout entête batiment construction','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutBatiment_construction(batiment_construction,suppression)
        {
            if (NouvelItemBatiment_construction==false)
            {
                test_existanceBatiment_construction (batiment_construction,suppression); 
            } 
            else
            {
                insert_in_baseBatiment_construction(batiment_construction,suppression);
            }
        }

        //fonction de bouton d'annulation batiment_construction
        vm.annulerBatiment_construction = function(item)
        {
          if (NouvelItemBatiment_construction == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_batiment_ouvrage = currentItemBatiment_construction.id_batiment_ouvrage;
              item.cout_maitrise_oeuvre    = currentItemBatiment_construction.cout_maitrise_oeuvre;
              item.cout_sous_projet = currentItemBatiment_construction.cout_sous_projet;
              item.cout_batiment = currentItemBatiment_construction.cout_batiment;
              item.ponderation_batiment = currentItemBatiment_construction.ponderation_batiment;
              item.id_attachement_batiment    = currentItemBatiment_construction.id_attachement_batiment; 
          }else
          {
            vm.allbatiment_construction = vm.allbatiment_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemBatiment_construction.id;
            });
          }

          vm.selectedItemBatiment_construction = {} ;
          NouvelItemBatiment_construction      = false;
          
        };

        //fonction selection item batiment construction cisco/feffi
        vm.selectionBatiment_construction = function (item)
        {
            vm.selectedItemBatiment_construction = item;
            currentItemBatiment_construction     = JSON.parse(JSON.stringify(vm.selectedItemBatiment_construction));
           // vm.allconvention= [] ;            
            //recuperation donnée convention
            if (vm.selectedItemBatiment_construction.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;
                  
                  if(vm.alllatrine_construction.length!=0)
                  {
                    vm.showbuttonNouvLatrine=false;
                  }
                  
              });

              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  if(vm.allmobilier_construction.length!=0)
                  {
                    vm.showbuttonNouvMobilier=false;
                  }
                  
              });

              apiFactory.getAPIgeneraliserREST("annexe_latrine/index",'id_batiment_ouvrage',vm.selectedItemBatiment_construction.batiment_ouvrage.id).then(function(result)
              {
                  vm.allannexe_latrine = result.data.response; 
                  console.log(vm.allannexe_latrine);
              });

              apiFactory.getAPIgeneraliserREST("annexe_mobilier/index",'id_batiment_ouvrage',vm.selectedItemBatiment_construction.batiment_ouvrage.id).then(function(result)
              {
                  vm.allannexe_mobilier = result.data.response; 
                  console.log(vm.allannexe_mobilier);
              });
              vm.stepThree = true;
              vm.stepFor = false;
            }           

        };
        $scope.$watch('vm.selectedItemBatiment_construction', function()
        {
             if (!vm.allbatiment_construction) return;
             vm.allbatiment_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBatiment_construction.$selected = true;
        });

        //fonction masque de saisie modification item batiment construction
        vm.modifierBatiment_construction = function(item)
        {
            NouvelItemBatiment_construction = false ;
            vm.selectedItemBatiment_construction = item;
            currentItemBatiment_construction = angular.copy(vm.selectedItemBatiment_construction);
            $scope.vm.allbatiment_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
             
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_batiment/index","id_batiment_ouvrage",item.batiment_ouvrage.id).then(function(result)
            {
              vm.allattachement_batiment= result.data.response;
              item.id_attachement_batiment = vm.selectedItemBatiment_construction.attachement_batiment.id;
            });

            //recuperation donnée detail_ouvrage
            apiFactory.getAPIgeneraliserREST("batiment_ouvrage/index",'menu','getbatimentByZone','id_zone_subvention',vm.selectedItemDetail.zone_subvention.id,
              'id_acces_zone',vm.selectedItemDetail.acces_zone.id).then(function(result)
            {
              vm.allbatiment_ouvrage = result.data.response;

              item.id_batiment_ouvrage = vm.selectedItemBatiment_construction.batiment_ouvrage.id;
            });

            //item.description = vm.selectedItemBatiment_construction.description;           
            
            item.cout_maitrise_oeuvre = parseInt(vm.selectedItemBatiment_construction.batiment_ouvrage.cout_maitrise_oeuvre);
            item.cout_batiment = parseInt(vm.selectedItemBatiment_construction.batiment_ouvrage.cout_batiment);
            item.cout_sous_projet = parseInt(vm.selectedItemBatiment_construction.batiment_ouvrage.cout_sous_projet);
            item.ponderation = parseInt(vm.selectedItemBatiment_construction.attachement_batiment.ponderation);
            

            
        };

        //fonction bouton suppression item batiment construction cisco feffi
        vm.supprimerBatiment_construction = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutBatiment_construction(vm.selectedItemBatiment_construction,1);
                vm.stepThree = false;
                vm.stepFor = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceBatiment_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var ouv_c = vm.allbatiment_construction.filter(function(obj)
                {
                   return obj.id == currentItemBatiment_construction.id;
                });
                if(ouv_c[0])
                {
                   if((ouv_c[0].id_batiment_ouvrage!=currentItemBatiment_construction.id_batiment_ouvrage)
                    || (ouv_c[0].id_attachement_batiment!=currentItemBatiment_construction.id_attachement_batiment))                    
                      { 
                        insert_in_baseBatiment_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseBatiment_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseBatiment_construction(batiment_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemBatiment_construction ==false)
            {
                getId = vm.selectedItemBatiment_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_batiment_ouvrage: batiment_construction.id_batiment_ouvrage,
                    id_attachement_batiment: batiment_construction.id_attachement_batiment,
                    id_convention_detail: vm.selectedItemDetail.id

                });
                console.log(datas);
                //factory
            apiFactory.add("batiment_construction/index",datas, config).success(function (data)
            {

                var bat_ouvra = vm.allbatiment_ouvrage.filter(function(obj)
                {
                    return obj.id == batiment_construction.id_batiment_ouvrage;
                });

                var atta_b = vm.allattachement_batiment.filter(function(obj)
                {
                    return obj.id == batiment_construction.id_attachement_batiment;
                });

                if (NouvelItemBatiment_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemBatiment_construction.batiment_ouvrage = bat_ouvra[0];
                        vm.selectedItemBatiment_construction.attachement_batiment   = atta_b[0];
                        vm.selectedItemBatiment_construction.$selected  = false;
                        vm.selectedItemBatiment_construction.$edit      = false;
                        vm.selectedItemBatiment_construction ={};
                        var cout_ancien_bat= parseInt(currentItemBatiment_construction.batiment_ouvrage.cout_batiment) +
                                        parseInt(currentItemBatiment_construction.batiment_ouvrage.cout_maitrise_oeuvre)+
                                        parseInt(currentItemBatiment_construction.batiment_ouvrage.cout_sous_projet);
                        var cout_nouveau_bat= parseInt(bat_ouvra[0].cout_batiment) +
                                        parseInt(bat_ouvra[0].cout_maitrise_oeuvre)+
                                        parseInt(bat_ouvra[0].cout_sous_projet);
                        var cout_tot = parseInt(vm.selectedItemDetail.montant_total)- cout_ancien_bat + cout_nouveau_bat ;
                        miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                    else 
                    {    
                      vm.allbatiment_construction = vm.allbatiment_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemBatiment_construction.id;
                      });
                      var cout_ancien_bat= parseInt(currentItemBatiment_construction.batiment_ouvrage.cout_batiment) +
                                        parseInt(currentItemBatiment_construction.batiment_ouvrage.cout_maitrise_oeuvre)+
                                        parseInt(currentItemBatiment_construction.batiment_ouvrage.cout_sous_projet);
                      var cout_tot = parseInt(vm.selectedItemDetail.montant_total) - cout_ancien_bat;

                       miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                }
                else
                {
                  
                  batiment_construction.batiment_ouvrage= bat_ouvra[0];
                  batiment_construction.attachement_batiment = atta_b[0];
                  batiment_construction.id  =   String(data.response);              
                  NouvelItemBatiment_construction = false;

                  //ajout latrine construction
                /*  apiFactory.getAPIgeneraliserREST("annexe_latrine/index",'id_batiment_ouvrage',bat_ouvra[0].id).then(function(result)
                  {
                      vm.allannexe_latrine = result.data.response;
                      console.log(vm.allannexe_latrine);
                      apiFactory.getAPIgeneraliserREST("attachement_latrine/index",'id_annexe_latrine',vm.allannexe_latrine[0].id).then(function(result)
                      {
                          vm.allattachement_latrine = result.data.response;
                          console.log(vm.allattachement_latrine);                      
                      });
                  });*/

                  
                  var cout_tot = parseInt(vm.selectedItemDetail.montant_total)+ 
                  parseInt(bat_ouvra[0].cout_batiment)+ parseInt(bat_ouvra[0].cout_maitrise_oeuvre)+ 
                  parseInt(bat_ouvra[0].cout_sous_projet);
                  
                  miseajourDetail(vm.selectedItemDetail,0,cout_tot);
            }
              batiment_construction.$selected = false;
              batiment_construction.$edit = false;
              vm.selectedItemBatiment_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        //fonction bouton modification ouvrage
        vm.modification_batiment_ouvrage = function(item)
        {   
          item.id_attachement_batiment = null;
            
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_batiment/index","id_batiment_ouvrage",item.id_batiment_ouvrage).then(function(result)
            {
              vm.allattachement_batiment= result.data.response;
            });
            var bato = vm.allbatiment_ouvrage.filter(function(obj)
            {
                return obj.id == item.id_batiment_ouvrage;
            });
            item.cout_maitrise_oeuvre = parseInt(bato[0].cout_maitrise_oeuvre);
            item.cout_batiment = parseInt(bato[0].cout_batiment);
            item.cout_sous_projet = parseInt(bato[0].cout_sous_projet);
            
        };

        vm.modification_attachement_batiment = function(item)
        {
          var atta = vm.allattachement_batiment.filter(function(obj)
            {
                return obj.id == item.id_attachement_batiment;
            });

            item.ponderation_batiment = parseInt(atta[0].ponderation_batiment);
        }

         //insertion ou mise a jours ou suppression item dans bdd convention
        function miseajourDetail(convention_cife_detail,suppression,montant_total)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDetail ==false)
            {
                getId = vm.selectedItemDetail.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    montant_total:    montant_total,
                    intitule:    convention_cife_detail.intitule,
                    id_zone_subvention: convention_cife_detail.zone_subvention.id,
                    id_acces_zone: convention_cife_detail.acces_zone.id, 
                    id_convention_entete: vm.selectedItemTete.id             
                });
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_detail/index",datas, config).success(function (data)
            {
                
                var zosub = vm.allzone_subvention.filter(function(obj)
                {
                    return obj.id == convention_cife_detail.zone_subvention.id;
                });

                var azone = vm.allacces_zone.filter(function(obj)
                {
                    return obj.id == convention_cife_detail.acces_zone.id;
                });

                if (NouvelItemDetail == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDetail.intitule  = convention_cife_detail.intitule;
                        vm.selectedItemDetail.montant_total  = montant_total;
                        vm.selectedItemDetail.zone_subvention   = zosub[0];
                        vm.selectedItemDetail.acces_zone   = azone[0];
                        //vm.selectedItemDetail.$selected  = false;
                        //vm.selectedItemDetail.$edit      = false;
                        //vm.selectedItemDetail ={};
                    }
                    else 
                    {    
                      vm.allconvention_cife_detail = vm.allconvention_cife_detail.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDetail.id;
                      });
                      vm.showbuttonNouvDetail = true;
                    }
                }
                else
                {
                  
                  convention_cife_detail.intitule= convention_cife_detail.intitule;
                  convention_cife_detail.montant_total= montant_total;
                 
                  convention_cife_detail.zone_subvention = zosub[0];
                  convention_cife_detail.acces_zone = azone[0];
                  convention_cife_detail.id  =   String(data.response);              
                  //NouvelItemDetail = false;

                  vm.showbuttonNouvDetail = false;
            }
              //convention_cife_detail.$selected = false;
              //convention_cife_detail.$edit = false;
              //vm.selectedItemDetail = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

      /*****************fin batiment construction***************/


       /*****************debut latrine construction***************/
      //col table
        vm.latrine_construction_column = [        
        {
          titre:"Latrine"
        },
        {
          titre:"cout latrine"
        },
        {
          titre:"Attachement"
        },
        {
          titre:"Ponderation"
        },
        {
          titre:"Action"
        }];

        //Masque de saisi ajout
        vm.ajouterLatrine_construction = function ()
        { 
          if (NouvelItemLatrine_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_annexe_latrine:'',
              cout_latrine:'',
              id_attachement_latrine: '',
              ponderation_latrine: ''
            };         
            vm.alllatrine_construction.push(items);
            vm.alllatrine_construction.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemLatrine_construction = conv;
              }
            });

            NouvelItemLatrine_construction = true ;
          }else
          {
            vm.showAlert('Ajout entête latrine construction','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutLatrine_construction(latrine_construction,suppression)
        {
            if (NouvelItemLatrine_construction==false)
            {
                test_existanceLatrine_construction (latrine_construction,suppression); 
            } 
            else
            {
                insert_in_baseLatrine_construction(latrine_construction,suppression);
            }
        }

        //fonction de bouton d'annulation latrine_construction
        vm.annulerLatrine_construction = function(item)
        {
          if (NouvelItemLatrine_construction == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_annexe_ouvrage = currentItemLatrine_construction.id_annexe_ouvrage;
              item.cout_latrine    = currentItemLatrine_construction.cout_latrine;
              item.ponderation_latrine = currentItemLatrine_construction.ponderation_latrine;
              item.id_attachement_latrine    = currentItemLatrine_construction.id_attachement_latrine; 
          }else
          {
            vm.alllatrine_construction = vm.alllatrine_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemLatrine_construction.id;
            });
          }

          vm.selectedItemLatrine_construction = {} ;
          NouvelItemLatrine_construction      = false;
          
        };

        //fonction selection item Latrine construction cisco/feffi
        vm.selectionLatrine_construction = function (item)
        {
            vm.selectedItemLatrine_construction = item;
            currentItemLatrine_construction     = JSON.parse(JSON.stringify(vm.selectedItemLatrine_construction));
           // vm.allconvention= [] ;
                       

        };
        $scope.$watch('vm.selectedItemLatrine_construction', function()
        {
             if (!vm.alllatrine_construction) return;
             vm.alllatrine_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemLatrine_construction.$selected = true;
        });

        //fonction masque de saisie modification item Latrine construction
        vm.modifierLatrine_construction = function(item)
        {
            NouvelItemLatrine_construction = false ;
            vm.selectedItemLatrine_construction = item;
            currentItemLatrine_construction = angular.copy(vm.selectedItemLatrine_construction);
            $scope.vm.alllatrine_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
             
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_latrine/index","id_annexe_latrine",item.annexe_latrine.id).then(function(result)
            {
              vm.allattachement_latrine= result.data.response;
              item.id_attachement_latrine = vm.selectedItemLatrine_construction.attachement_latrine.id;
            });

            //recuperation donnée annexe_latrine
            apiFactory.getAPIgeneraliserREST("annexe_latrine/index","id_batiment_ouvrage",vm.selectedItemBatiment_construction.batiment_ouvrage.id).then(function(result)
            {
              vm.allannexe_latrine= result.data.response;
              item.id_annexe_latrine = vm.selectedItemLatrine_construction.annexe_latrine.id;
            });
            item.cout_latrine = parseInt(vm.selectedItemLatrine_construction.annexe_latrine.cout_latrine);
            item.ponderation_latrine = parseInt(vm.selectedItemLatrine_construction.attachement_latrine.ponderation_latrine);
            

            
        };

        //fonction bouton suppression item Latrine construction
        vm.supprimerLatrine_construction = function()
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
                vm.ajoutLatrine_construction(vm.selectedItemLatrine_construction,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceLatrine_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var ouv_c = vm.alllatrine_construction.filter(function(obj)
                {
                   return obj.id == currentItemLatrine_construction.id;
                });
                if(ouv_c[0])
                {
                   if((ouv_c[0].id_annexe_latrine!=currentItemLatrine_construction.id_annexe_latrine)
                    || (ouv_c[0].id_attachement_latrine!=currentItemLatrine_construction.id_attachement_latrine))                    
                      { 
                        insert_in_baseLatrine_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseLatrine_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseLatrine_construction(latrine_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemLatrine_construction ==false)
            {
                getId = vm.selectedItemLatrine_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_annexe_latrine: latrine_construction.id_annexe_latrine,
                    id_attachement_latrine: latrine_construction.id_attachement_latrine,
                    id_batiment_construction: vm.selectedItemBatiment_construction.id

                });
                console.log(datas);
                //factory
            apiFactory.add("latrine_construction/index",datas, config).success(function (data)
            {

                var anne_lat = vm.allannexe_latrine.filter(function(obje)
                {
                    return obje.id == latrine_construction.id_annexe_latrine;
                });

                var atta_l = vm.allattachement_latrine.filter(function(obj)
                {
                    return obj.id == latrine_construction.id_attachement_latrine;
                });

                if (NouvelItemLatrine_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemLatrine_construction.latrine_ouvrage = anne_lat[0];
                        vm.selectedItemLatrine_construction.attachement_latrine   = atta_l[0];
                        vm.selectedItemLatrine_construction.$selected  = false;
                        vm.selectedItemLatrine_construction.$edit      = false;
                        vm.selectedItemLatrine_construction ={};

                        var cout_ancien_lat= parseInt(currentItemLatrine_construction.annexe_latrine.cout_latrine);
                        var cout_nouveau_lat= parseInt(anne_lat[0].cout_latrine);
                        var cout_tot = parseInt(vm.selectedItemDetail.montant_total)- cout_ancien_lat + cout_nouveau_lat ;
                        miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                    else 
                    {    
                      vm.alllatrine_construction = vm.alllatrine_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemLatrine_construction.id;
                      });

                      var cout_ancien_lat= parseInt(currentItemLatrine_construction.annexe_latrine.cout_latrine);
                      var cout_tot = parseInt(vm.selectedItemDetail.montant_total) - cout_ancien_lat;

                       miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                      vm.showbuttonNouvLatrine=true;
                    }
                }
                else
                {
                  
                  latrine_construction.annexe_latrine= anne_lat[0];
                  latrine_construction.attachement_latrine = atta_l[0];
                  latrine_construction.id  =   String(data.response);              
                  NouvelItemLatrine_construction = false;
                  vm.showbuttonNouvLatrine=false;
                  //console.log(latrine_construction);
                  var cout_tot = parseInt(vm.selectedItemDetail.montant_total)+ 
                  parseInt(anne_lat[0].cout_latrine);
                  
                  miseajourDetail(vm.selectedItemDetail,0,cout_tot);
            }
              latrine_construction.$selected = false;
              latrine_construction.$edit = false;
              vm.selectedItemLatrine_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //fonction bouton modification ouvrage
        vm.modification_annexe_latrine = function(item)
        {   
          item.id_attachement_latrine = null;
            
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_latrine/index","id_annexe_latrine",item.id_annexe_latrine).then(function(result)
            {
              vm.allattachement_latrine= result.data.response;
              console.log(vm.allattachement_latrine);
            });
            var annel = vm.allannexe_latrine.filter(function(obj)
            {
                return obj.id == item.id_annexe_latrine;
            });
            item.cout_latrine = parseInt(annel[0].cout_latrine);
            
        };

        vm.modification_attachement_latrine = function(item)
        {
          var atta = vm.allattachement_latrine.filter(function(obj)
            {
                return obj.id == item.id_attachement_latrine;
            });

            item.ponderation_latrine = parseInt(atta[0].ponderation_latrine);
        }
      /*****************fin latrine construction***************/

      /*****************debut mobilier construction***************/
      //col table
        vm.mobilier_construction_column = [        
        {
          titre:"Mobilier"
        },
        {
          titre:"cout mobilier"
        },
        {
          titre:"Attachement"
        },
        {
          titre:"Ponderation"
        },
        {
          titre:"Action"
        }];

        //Masque de saisi ajout
        vm.ajouterMobilier_construction = function ()
        { 
          if (NouvelItemLatrine_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_annexe_mobilier:'',
              cout_mobilier:'',
              id_attachement_mobilier: '',
              ponderation_mobilier: ''
            };         
            vm.allmobilier_construction.push(items);
            vm.allmobilier_construction.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemMobilier_construction = conv;
              }
            });

            NouvelItemMobilier_construction = true ;
          }else
          {
            vm.showAlert('Ajout entête mobilier construction','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutMobilier_construction(mobilier_construction,suppression)
        {
            if (NouvelItemMobilier_construction==false)
            {
                test_existanceMobilier_construction (mobilier_construction,suppression); 
            } 
            else
            {
                insert_in_baseMobilier_construction(mobilier_construction,suppression);
            }
        }

        //fonction de bouton d'annulation mobilier_construction
        vm.annulerMobilier_construction = function(item)
        {
          if (NouvelItemMobilier_construction == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.id_annexe_ouvrage = currentItemMobilier_construction.id_annexe_ouvrage;
              item.cout_mobilier    = currentItemMobilier_construction.cout_mobilier;
              item.ponderation_mobilier = currentItemMobilier_construction.ponderation_mobilier;
              item.id_attachement_mobilier    = currentItemMobilier_construction.id_attachement_mobilier; 
          }else
          {
            vm.allmobilier_construction = vm.allmobilier_construction.filter(function(obj)
            {
                return obj.id !== vm.selectedItemMobilier_construction.id;
            });
          }

          vm.selectedItemMobilier_construction = {} ;
          NouvelItemMobilier_construction      = false;
          
        };

        //fonction selection item Latrine construction cisco/feffi
        vm.selectionMobilier_construction = function (item)
        {
            vm.selectedItemMobilier_construction = item;
            currentItemMobilier_construction     = JSON.parse(JSON.stringify(vm.selectedItemMobilier_construction));
           // vm.allconvention= [] ;           

        };
        $scope.$watch('vm.selectedItemMobilier_construction', function()
        {
             if (!vm.allmobilier_construction) return;
             vm.allmobilier_construction.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemMobilier_construction.$selected = true;
        });

        //fonction masque de saisie modification item Mobilier construction
        vm.modifierMobilier_construction = function(item)
        {
            NouvelItemMobilier_construction = false ;
            vm.selectedItemMobilier_construction = item;
            currentItemMobilier_construction = angular.copy(vm.selectedItemMobilier_construction);
            $scope.vm.allmobilier_construction.forEach(function(ouv) {
              ouv.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
             
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_mobilier/index","id_annexe_mobilier",item.annexe_mobilier.id).then(function(result)
            {
              vm.allattachement_mobilier= result.data.response;
              item.id_attachement_mobilier = vm.selectedItemMobilier_construction.attachement_mobilier.id;
              console.log(vm.allattachement_mobilier);
              console.log(item);

            });

            //recuperation donnée annexe_latrine
            apiFactory.getAPIgeneraliserREST("annexe_mobilier/index","id_batiment_ouvrage",vm.selectedItemBatiment_construction.batiment_ouvrage.id).then(function(result)
            {
              vm.allannexe_mobilier= result.data.response;
              item.id_annexe_mobilier = vm.selectedItemMobilier_construction.annexe_mobilier.id;
            });
            item.cout_mobilier = parseInt(vm.selectedItemMobilier_construction.annexe_mobilier.cout_mobilier);
            item.ponderation_mobilier = parseInt(vm.selectedItemMobilier_construction.attachement_mobilier.ponderation_mobilier);
            

            
        };

        //fonction bouton suppression item Latrine construction
        vm.supprimerMobilier_construction = function()
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
                vm.ajoutMobilier_construction(vm.selectedItemMobilier_construction,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceMobilier_construction (item,suppression)
        {          
            if (suppression!=1)
            {
               var ouv_c = vm.allmobilier_construction.filter(function(obj)
                {
                   return obj.id == currentItemMobilier_construction.id;
                });
                if(ouv_c[0])
                {
                   if((ouv_c[0].id_annexe_mobilier!=currentItemMobilier_construction.id_annexe_mobilier)
                    || (ouv_c[0].id_attachement_mobilier!=currentItemMobilier_construction.id_attachement_mobilier))                    
                      { 
                        insert_in_baseMobilier_construction(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseMobilier_construction(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseMobilier_construction(mobilier_construction,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemMobilier_construction ==false)
            {
                getId = vm.selectedItemMobilier_construction.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    id_annexe_mobilier: mobilier_construction.id_annexe_mobilier,
                    id_attachement_mobilier: mobilier_construction.id_attachement_mobilier,
                    id_batiment_construction: vm.selectedItemBatiment_construction.id

                });
                console.log(datas);
                //factory
            apiFactory.add("mobilier_construction/index",datas, config).success(function (data)
            {

                var anne_mob = vm.allannexe_mobilier.filter(function(obje)
                {
                    return obje.id == mobilier_construction.id_annexe_mobilier;
                });

                var atta_m = vm.allattachement_mobilier.filter(function(obj)
                {
                    return obj.id == mobilier_construction.id_attachement_mobilier;
                });

                if (NouvelItemMobilier_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemMobilier_construction.mobilier_ouvrage = anne_mob[0];
                        vm.selectedItemMobilier_construction.attachement_mobilier   = atta_m[0];
                        vm.selectedItemMobilier_construction.$selected  = false;
                        vm.selectedItemMobilier_construction.$edit      = false;
                        vm.selectedItemMobilier_construction ={};

                        var cout_ancien_mob= parseInt(currentItemMobilier_construction.annexe_mobilier.cout_mobilier);
                        var cout_nouveau_mob= parseInt(anne_mob[0].cout_mobilier);
                        var cout_tot = parseInt(vm.selectedItemDetail.montant_total)- cout_ancien_mob + cout_nouveau_mob ;
                        miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                    else 
                    {    
                      vm.allmobilier_construction = vm.allmobilier_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMobilier_construction.id;
                      });
                      var cout_ancien_mob= parseInt(currentItemMobilier_construction.annexe_mobilier.cout_mobilier);
                      var cout_tot = parseInt(vm.selectedItemDetail.montant_total) - cout_ancien_mob;

                       miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                      vm.showbuttonNouvMobilier=true;
                    }
                }
                else
                {
                  
                  mobilier_construction.annexe_mobilier= anne_mob[0];
                  mobilier_construction.attachement_mobilier = atta_m[0];
                  mobilier_construction.id  =   String(data.response);              
                  NouvelItemMobilier_construction = false;
                  vm.showbuttonNouvMobilier=false;
                  //console.log(mobilier_construction);
                  var cout_tot = parseInt(vm.selectedItemDetail.montant_total)+ 
                  parseInt(anne_mob[0].cout_mobilier);
                  
                  miseajourDetail(vm.selectedItemDetail,0,cout_tot);
            }
              mobilier_construction.$selected = false;
              mobilier_construction.$edit = false;
              vm.selectedItemMobilier_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //fonction bouton modification ouvrage
        vm.modification_annexe_mobilier = function(item)
        {   
          item.id_attachement_mobilier = null;
            
            //recuperation donnée attachement
            apiFactory.getAPIgeneraliserREST("attachement_mobilier/index","id_annexe_mobilier",item.id_annexe_mobilier).then(function(result)
            {
              vm.allattachement_mobilier= result.data.response;
              console.log(vm.allattachement_mobilier);
            });
            var annel = vm.allannexe_mobilier.filter(function(obj)
            {
                return obj.id == item.id_annexe_mobilier;
            });
            item.cout_mobilier = parseInt(annel[0].cout_mobilier);
            
        };

        vm.modification_attachement_mobilier = function(item)
        {
          var atta = vm.allattachement_mobilier.filter(function(obj)
            {
                return obj.id == item.id_attachement_mobilier;
            });

            item.ponderation_mobilier = parseInt(atta[0].ponderation_mobilier);
        }
      /*****************fin mobilier construction***************/

      

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
