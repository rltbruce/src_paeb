
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.convention_cisco_feffi')
        .controller('Convention_cisco_feffiController', Convention_cisco_feffiController);
    /** @ngInject */
    function Convention_cisco_feffiController($mdDialog, $scope, apiFactory, $state,$cookieStore)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        var NouvelItemTete = false;
        var currentItemTete;
        vm.allfeffi = [];
        vm.allsite = [];

        var NouvelItemDetail = false;
        var currentItemDetail;

        var NouvelItemBatiment_construction = false;
        var currentItemBatiment_construction;

        var Nouvel_elem_cout_divers = false;
        var current_elem_cout_divers;

        var Nouvel_elem_cout_maitrise = false;
        var current_elem_cout_maitrise;
        vm.selectedItem_cout_maitrise = {} ;

        var Nouvel_elem_cout_sousprojet = false;
        var current_elem_cout_sousprojet;
        vm.selectedItem_cout_sousprojet = {} ;

        vm.date_now         = new Date();
        vm.allcisco         = [] ;
        vm.ajoutTete        = ajoutTete ;
        vm.selectedItemTete = {} ;
        vm.selectedItemTete.$selected=false;
        vm.allconvention_cife_tete  = [] ;
        vm.allcompte_feffi = [];

        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.stepFor           = false;

        vm.ajoutDetail = ajoutDetail ;
        vm.selectedItemDetail = {} ;

        vm.allconvention_cife_detail  = [] ;
        vm.showbuttonNouvDetail=true;


        //vm.allattachement_batiment  = [] ;
        vm.alltype_batiment  = [] ;

        vm.ajoutBatiment_construction = ajoutBatiment_construction ;
        vm.selectedItemBatiment_construction = {} ;
        vm.selectedItemBatiment_construction.$selected=false;
        vm.allbatiment_construction  = [] ;

        //vm.allattachement_latrine  = [] ;
        vm.alltype_latrine  = [] ;

        var NouvelItemLatrine_construction = false;
        var currentItemLatrine_construction;

        vm.ajoutLatrine_construction = ajoutLatrine_construction ;
        vm.selectedItemLatrine_construction = {} ;
        vm.selectedItemLatrine_construction.$selected=false;
        vm.alllatrine_construction  = [] ;
        

        //vm.allattachement_mobilier  = [] ;
        vm.alltype_mobilier  = [] ;

        var NouvelItemMobilier_construction = false;
        var currentItemMobilier_construction;

        vm.ajoutMobilier_construction = ajoutMobilier_construction ;
        vm.selectedItemMobilier_construction = {} ;
        vm.selectedItemMobilier_construction.$selected=false;
        vm.allmobilier_construction  = [] ;
        vm.showbuttonNouvMobilier=true;
        vm.showbuttonNouvBatiment=true;
        vm.showbuttonNouvLatrine=true;
        vm.showbuttonNouvMobilier=true;

        vm.afficherboutonValider = false;
        vm.permissionboutonValider = false;
        //vm.usercisco = [];
      /*****fin initialisation*****/

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
        
        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          vm.allcisco.push(usercisco);
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
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventioninvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention_cife_tete = result.data.response; 
                console.log(vm.allconvention_cife_tete);
            });
          }
          

        });

        vm.formatMillier = function (nombre) 
        {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return nombre;
            } else {
                return "";
            }
        }
      /*****************debut convention entete***************/

        //col table
        vm.convention_cife_tete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
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
        {titre:"Avancement"
        },
        {titre:"Action"
        }];
        
        /*if (vm.usercisco)
        { console.log(vm.usercisco);
          //recuperation donnée convention
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventioninvalideBycisco','id_cisco',vm.usercisco.id).then(function(result)
          {
              vm.allconvention_cife_tete = result.data.response; 
              console.log(vm.allconvention_cife_tete);
          });
        }*/
        

        //recuperation donnée cisco
        /*apiFactory.getAll("cisco/index").then(function(result)
        {
          vm.allcisco= result.data.response;
        });*/

        //recuperation donnée type_cout_divers
        apiFactory.getAll("type_cout_divers/index").then(function(result)
        {
          vm.all_type_cout_divers= result.data.response;
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
              id_site:'',
              ref_convention: '',
              objet: '',
              ref_financement: '',
              montant_total:0,
              avancement:0
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
              item.id_cisco    = currentItemTete.id_cisco ;
              item.id_feffi    = currentItemTete.id_feffi ;
              item.id_site    = currentItemTete.id_site ;
              item.ref_convention  = currentItemTete.ref_convention ;
              item.objet       = currentItemTete.objet ;              
              item.ref_financement = currentItemTete.ref_financement ;
              item.montant_total = currentItemTete.montant_total; 
              item.avancement = currentItemTete.avancement;
              
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
            if(item.$selected==false)
            {
              currentItemTete     = JSON.parse(JSON.stringify(vm.selectedItemTete));
            }
            
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvDetail=true;
            vm.showbuttonNouvBatiment=true;
            //recuperation donnée convention
           if (vm.selectedItemTete.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',item.id).then(function(result)
              {
                  vm.allconvention_cife_detail = result.data.response;

                  if (vm.allconvention_cife_detail.length!=0)
                  {
                    vm.showbuttonNouvDetail=false;
                  } 
                  console.log(vm.selectedItemTete);
                  console.log(vm.allconvention_cife_detail);
              });
              apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.feffi.id).then(function(result)
              {
                vm.allcompte_feffi = result.data.response;
                console.log(vm.allcompte_feffi);
               
              });

              //Récupération cout divers par convention

              apiFactory.getAPIgeneraliserREST("cout_maitrise_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                vm.all_cout_maitrise = result.data.response;
                console.log(vm.all_cout_maitrise);
               
              });
              apiFactory.getAPIgeneraliserREST("cout_sousprojet_construction/index",'id_convention_entete',item.id).then(function(result)
              {
                vm.all_cout_sousprojet = result.data.response;
                console.log(vm.all_cout_sousprojet);
               
              });
              //recuperation donnée convention
           
              apiFactory.getAPIgeneraliserREST("batiment_construction/index",'id_convention_entete',vm.selectedItemTete.id).then(function(result)
              {
                  vm.allbatiment_construction = result.data.response;

                  if (vm.allbatiment_construction.length >0)
                  {                    
                    vm.showbuttonNouvBatiment=false;
                  } 
                  console.log(vm.allbatiment_construction);
              });

              //recuperation donnée batiment ouvrage
              apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getbatimentByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,
                'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                vm.alltype_batiment = result.data.response;
                console.log(vm.alltype_batiment);
              });

              /*vm.stepTwo = true;
              vm.stepThree = false;
              vm.stepFor = false;*/
              vm.afficherboutonValider = true;
              //Fin Récupération cout divers par convention
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.stepFor = false;
            };           

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

            item.id_cisco = vm.selectedItemTete.cisco.id ;
            item.id_feffi = vm.selectedItemTete.feffi.id ;
            item.id_site = vm.selectedItemTete.site.id ;

            item.ref_convention  = vm.selectedItemTete.ref_convention ;
            item.objet           = vm.selectedItemTete.objet ;
            item.ref_financement = vm.selectedItemTete.ref_financement ;
            item.montant_total = parseInt(vm.selectedItemTete.montant_total);
            item.avancement = parseInt(vm.selectedItemTete.avancement);

            vm.afficherboutonValider = false; 
            //recuperation donnée feffi
          apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',item.id_cisco).then(function(result)
          {
            vm.allfeffi= result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("site/index",'menu','getsitecreeByfeffi','id_feffi',item.id_feffi).then(function(result)
          {
            vm.allsite= result.data.response;
            vm.allsite.push(vm.selectedItemTete.site);
            console.log(vm.allsite);
          });

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
                    || (convT[0].id_site!=currentItemTete.id_site)
                    || (convT[0].objet!=currentItemTete.objet)
                    
                    || (convT[0].ref_financement!=currentItemTete.ref_financement)
                    || (convT[0].ref_convention!=currentItemTete.ref_convention))                   
                                       
                      { 
                        if (convT[0].id_feffi!=currentItemTete.id_feffi)
                        {
                          insert_in_baseTete(item,suppression);
                          supressiondetail_construction();
                        }
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
                    id_cisco: convention_cife_tete.id_cisco,
                    id_feffi: convention_cife_tete.id_feffi,
                    id_site: convention_cife_tete.id_site,
                    objet:    convention_cife_tete.objet,
                    ref_financement:  convention_cife_tete.ref_financement,
                    ref_convention:   convention_cife_tete.ref_convention,
                    montant_total:    convention_cife_tete.montant_total,
                    avancement:    convention_cife_tete.avancement,
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
                var sit = vm.allsite.filter(function(obj)
                {
                    return obj.id == convention_cife_tete.id_site;
                });

                if (NouvelItemTete == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTete.cisco   = cis[0];
                        vm.selectedItemTete.feffi = fef[0];
                        vm.selectedItemTete.site = sit[0];
                        vm.selectedItemTete.$selected  = false;
                        vm.selectedItemTete.$edit      = false;
                        vm.selectedItemTete ={};
                        
                        if (convention_cife_tete.id_site!=currentItemTete.site.id)
                        {currentItemTete.site.ecole = {id: currentItemTete.site.id_ecole}

                          console.log(currentItemTete.site);
                            maj_site_in_base(currentItemTete.site,0,0);
                                maj_site_in_base(sit[0],0,1);
                              
                          
                        }
                    }
                    else 
                    {    
                      vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTete.id;
                      });
                      
                      maj_site_in_base(vm.selectedItemTete.site,0,0);
                    }
                }
                else
                {
                  
                  convention_cife_tete.cisco = cis[0];
                  convention_cife_tete.feffi = fef[0];
                  convention_cife_tete.site = sit[0];
                  convention_cife_tete.id  =   String(data.response);
                  NouvelItemTete = false;
                  maj_site_in_base(sit[0],0,1);
            }
              convention_cife_tete.$selected = false;
              convention_cife_tete.$edit = false;
              vm.selectedItemTete = {};
              vm.afficherboutonValider = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.change_feffi = function(item)
        { 
          apiFactory.getAPIgeneraliserREST("compte_feffi/index",'id_feffi',item.id_feffi).then(function(result)
          {
              vm.allcompte_feffi = result.data.response;
              console.log(vm.allcompte_feffi);

          });
          var fef = vm.allfeffi.filter(function(obj)
          {
            return obj.id == item.id_feffi;
          });

          apiFactory.getOne("ecole/index",fef[0].ecole.id).then(function(result)
          {
            var tem={
                      libelle_zone: result.data.response.zone_subvention.libelle,
                      libelle_acces: result.data.response.acces_zone.libelle,
                      id_zone: result.data.response.zone_subvention.id,
                      id_acces: result.data.response.acces_zone.id,   
                    }
             item.ecole=tem;
          });
          item.id_site = null;
          if(NouvelItemTete == false)
          { 
            apiFactory.getAPIgeneraliserREST("site/index",'menu','getsitecreeByfeffi','id_feffi',item.id_feffi).then(function(result)
              {
                vm.allsite= result.data.response;
                vm.allsite.push(item.site);
                console.log(vm.allsite);
              });

            if (currentItemTete.feffi.id!=item.id_feffi)
            {
              vm.showAlert('Avertissement','Les detailles ainsi que travaux de construction seront supprimer si vous enregistre cette operation');
            }  
          }
          else 
            {
              apiFactory.getAPIgeneraliserREST("site/index",'menu','getsitecreeByfeffi','id_feffi',item.id_feffi).then(function(result)
              {
                vm.allsite= result.data.response;
                console.log(vm.allsite);
              });
            }
        }

        vm.change_cisco = function(item)
        {
          item.id_feffi = null;
//console.lod(item)
          //recuperation donnée feffi
          apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',item.id_cisco).then(function(result)
          {
            vm.allfeffi= result.data.response;
            console.log(vm.allfeffi);
          });
        }

        function supressiondetail_construction()
        { 
          //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    id_convention_entete: vm.selectedItemTete.id,
                    menu: 'supressionBytete'             
                });
            apiFactory.add("convention_cisco_feffi_detail/index",datas,config).then(function(result)
            { 
              vm.allbatiment_construction=[];
            });
        }

        vm.validerConvention = function()
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemTete.id,
                    id_cisco: vm.selectedItemTete.cisco.id,
                    id_feffi: vm.selectedItemTete.feffi.id,
                    objet:    vm.selectedItemTete.objet,
                    ref_financement:  vm.selectedItemTete.ref_financement,
                    ref_convention:   vm.selectedItemTete.ref_convention,
                    montant_total:    vm.selectedItemTete.montant_total,
                    avancement:    vm.selectedItemTete.avancement,
                    validation: 1               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            { 
                vm.allconvention_cife_tete = vm.allconvention_cife_tete.filter(function(obj)
                {
                    return obj.id !== vm.selectedItemTete.id;
                });
                   
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
        }

      /*****************fin convention entete***************/

      function maj_site_in_base(site,suppression,statu)
        {
            //add
            console.log(site);
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        site.id,      
                    code_sous_projet:      site.code_sous_projet,
                    denomination_epp:      site.denomination_epp,      
                    observation:    site.observation,
                    agence_acc:   site.agence_acc,
                    statu_convention:    statu,
                    objet_sous_projet: site.objet_sous_projet,
                    id_ecole: site.ecole.id,                
                });
                console.log(datas);
                //factory
            apiFactory.add("site/index",datas, config).success(function (data)
            {
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
      /*****************debut cout maitrise**************/

      vm.cout_maitrise_column = 
      [        
        {
          titre:"Déscription"
        },
        {
          titre:"Coût"
        },
        {titre:"Action"
        }
      ];

      vm.ajouter_cout_maitrise = function()
        {
          console.log(Nouvel_elem_cout_maitrise);
          if (Nouvel_elem_cout_maitrise == false) 
          {
            Nouvel_elem_cout_maitrise = true ;

            var items = 
            {
              $edit: true,
              $selected: true,
              id: '0',
              description:'',
              cout:''
            };   

            vm.all_cout_maitrise.push(items);
            vm.selectedItem_cout_maitrise = items ;
          }
          else
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
            
        }


        vm.modifier_cout_maitrise = function(item)
        {

          Nouvel_elem_cout_maitrise == false;
          item.$edit = true ;
          vm.selectedItem_cout_maitrise = item ;
          current_elem_cout_maitrise = angular.copy(item) ;
          item.cout = (Number)(item.cout) ;

         
        }


        vm.ajout_cout_maitrise = function(cout_maitrise,suppression)
        {
          console.log(cout_maitrise);

          insert_in_base_cout_maitrise(cout_maitrise,suppression) ;
        }

        vm.supprimer_cout_maitrise = function(item)
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() 
              {
                insert_in_base_cout_maitrise(vm.selectedItem_cout_maitrise,1);
              }, 
              function() 
              {
                //alert('rien');
              });
        }


        function insert_in_base_cout_maitrise(cout_maitrise,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (Nouvel_elem_cout_maitrise == false)
            {
                getId = vm.selectedItem_cout_maitrise.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id: getId,
                    description: cout_maitrise.description,
                    cout: cout_maitrise.cout,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("cout_maitrise_construction/index",datas, config).success(function (data)
            {

              cout_maitrise.$edit = false ;             

              if (Nouvel_elem_cout_maitrise == false)
              {
                  // Update or delete: id exclu                 
                  if(suppression == 0)
                  {
                      //update tsy miasa eto
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total)- current_elem_cout_maitrise.cout + cout_maitrise.cout ;

                        vm.selectedItemTete.montant_total= cout_tot;
                  }
                  else 
                  {    
                    vm.all_cout_maitrise = vm.all_cout_maitrise.filter(function(obj)
                    {
                       return obj.id !== cout_maitrise.id;
                    });
                    vm.selectedItemTete.montant_total= parseInt(vm.selectedItemTete.montant_total)-vm.selectedItem_cout_maitrise.cout;
                  }
              }
              else
              {
                
                cout_maitrise.id = String(data.response);
                Nouvel_elem_cout_maitrise = false ;
                vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+cout_maitrise.cout;

              }              
            
            })
            .error
            (
              function (data)
              {
                vm.showAlert("Error","Erreur lors de l'insertion de donnée");
              }
            );


        }




        vm.annuler_cout_maitrise = function(item)
        {
          item.$edit = false ;
          

          if (Nouvel_elem_cout_maitrise == false) 
          { 
            
            item.description = current_elem_cout_maitrise.description ;
            item.cout = current_elem_cout_maitrise.cout ;
          }
          else
          {
            vm.all_cout_maitrise = vm.all_cout_maitrise.filter(function(obj)
            {
                return obj.id !== '0';
            });

            Nouvel_elem_cout_maitrise = false;
          }

        }

        vm.select_cout_maitrise = function(item)
        {
          vm.selectedItem_cout_maitrise = item ;
          console.log(vm.selectedItem_cout_maitrise);
          if(item.$selected==false)
            {
              current_elem_cout_maitrise     = JSON.parse(JSON.stringify(vm.selectedItem_cout_maitrise));
            }
        }

        $scope.$watch('vm.selectedItem_cout_maitrise', function()
        {
             if (!vm.all_cout_maitrise) return;
             vm.all_cout_maitrise.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_cout_maitrise.$selected = true;
        });
      /*****************fin cout maitrise**************/

      /*****************debut cout sousprojet**************/
vm.cout_sousprojet_column = 
      [        
        {
          titre:"Déscription"
        },
        {
          titre:"Coût"
        },
        {titre:"Action"
        }
      ];

      vm.ajouter_cout_sousprojet = function()
        {
          console.log(Nouvel_elem_cout_sousprojet);
          if (Nouvel_elem_cout_sousprojet == false) 
          {
            Nouvel_elem_cout_sousprojet = true ;

            var items = 
            {
              $edit: true,
              $selected: true,
              id: '0',
              description:'',
              cout:''
            };   

            vm.all_cout_sousprojet.push(items);
            vm.selectedItem_cout_sousprojet = items ;
          }
          else
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
            
        }


        vm.modifier_cout_sousprojet = function(item)
        {

          Nouvel_elem_cout_sousprojet == false;
          item.$edit = true ;
          vm.selectedItem_cout_sousprojet = item ;
          current_elem_cout_sousprojet = angular.copy(item) ;
          item.cout = (Number)(item.cout) ;

         
        }


        vm.ajout_cout_sousprojet = function(cout_sousprojet,suppression)
        {
          console.log(cout_sousprojet);

          insert_in_base_cout_sousprojet(cout_sousprojet,suppression) ;
        }

        vm.supprimer_cout_sousprojet = function(item)
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() 
              {
                insert_in_base_cout_sousprojet(vm.selectedItem_cout_sousprojet,1);
              }, 
              function() 
              {
                //alert('rien');
              });
        }


        function insert_in_base_cout_sousprojet(cout_sousprojet,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (Nouvel_elem_cout_sousprojet == false)
            {
                getId = vm.selectedItem_cout_sousprojet.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id: getId,
                    description: cout_sousprojet.description,
                    cout: cout_sousprojet.cout,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("cout_sousprojet_construction/index",datas, config).success(function (data)
            {

              cout_sousprojet.$edit = false ;             

              if (Nouvel_elem_cout_sousprojet == false)
              {
                  // Update or delete: id exclu                 
                  if(suppression == 0)
                  {
                      //update tsy miasa eto
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total)- current_elem_cout_sousprojet.cout + cout_sousprojet.cout ;

                        vm.selectedItemTete.montant_total= cout_tot;
                  }
                  else 
                  {    
                    vm.all_cout_sousprojet = vm.all_cout_sousprojet.filter(function(obj)
                    {
                       return obj.id !== cout_sousprojet.id;
                    });
                    vm.selectedItemTete.montant_total= parseInt(vm.selectedItemTete.montant_total)-vm.selectedItem_cout_sousprojet.cout;
                  }
              }
              else
              {
                
                cout_sousprojet.id = String(data.response);
                Nouvel_elem_cout_sousprojet = false ;
                vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+cout_sousprojet.cout;

              }              
            
            })
            .error
            (
              function (data)
              {
                vm.showAlert("Error","Erreur lors de l'insertion de donnée");
              }
            );


        }




        vm.annuler_cout_sousprojet = function(item)
        {
          item.$edit = false ;
          

          if (Nouvel_elem_cout_sousprojet == false) 
          { 
            
            item.description = current_elem_cout_sousprojet.description ;
            item.cout = current_elem_cout_sousprojet.cout ;
          }
          else
          {
            vm.all_cout_sousprojet = vm.all_cout_sousprojet.filter(function(obj)
            {
                return obj.id !== '0';
            });

            Nouvel_elem_cout_sousprojet = false;
          }

        }

        vm.select_cout_sousprojet = function(item)
        {
          vm.selectedItem_cout_sousprojet = item ;
          console.log(vm.selectedItem_cout_sousprojet);
          if(item.$selected==false)
            {
              current_elem_cout_sousprojet     = JSON.parse(JSON.stringify(vm.selectedItem_cout_sousprojet));
            }
        }

        $scope.$watch('vm.selectedItem_cout_sousprojet', function()
        {
             if (!vm.all_cout_sousprojet) return;
             vm.all_cout_sousprojet.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_cout_sousprojet.$selected = true;
        });
      /*****************fin cout sousprojet**************/

      /*****************debut cout divers**************/
/*
      vm.cout_divers_column = 
      [        
        {
          titre:"Déscription"
        },
        {
          titre:"Coût"
        },
        {titre:"Action"
        }
      ];

      vm.ajouter_cout_divers = function()
        {
          console.log(Nouvel_elem_cout_divers);
          if (Nouvel_elem_cout_divers == false) 
          {
            Nouvel_elem_cout_divers = true ;

            var items = 
            {
              $edit: true,
              $selected: true,
              id: '0',
              id_tcd:'',
              cout:''
            };   

            vm.all_cout_divers.push(items);
            vm.selectedItem_cout_divers = items ;
          }
          else
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
            
        }


        vm.modifier_cout_divers = function(item)
        {

          Nouvel_elem_cout_divers == false;
          item.$edit = true ;
          vm.selectedItem_cout_divers = item ;
          current_elem_cout_divers = angular.copy(item) ;
          item.cout = (Number)(item.cout) ;

         
        }


        vm.ajout_cout_diver = function(cout_divers,suppression)
        {
          console.log(cout_divers);

          insert_in_base_cout_divers(cout_divers,suppression) ;
        }

        vm.supprimer_cout_divers = function(item)
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données latrine et mobilier seront également supprimées')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() 
              {
                insert_in_base_cout_divers(vm.selectedItem_cout_divers,1);
              }, 
              function() 
              {
                //alert('rien');
              });
        }


        function insert_in_base_cout_divers(cout_divers,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (Nouvel_elem_cout_divers == false)
            {
                getId = vm.selectedItem_cout_divers.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id: getId,
                    id_type_cout_divers: cout_divers.id_tcd,
                    cout: cout_divers.cout,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("cout_divers_construction/index",datas, config).success(function (data)
            {

              cout_divers.$edit = false ;

              var tpc = vm.all_type_cout_divers.filter(function(obj)
                        {
                           return obj.id == cout_divers.id_tcd;
                        });
              cout_divers.description = tpc[0].description ;

              if (Nouvel_elem_cout_divers == false)
              {
                  // Update or delete: id exclu                 
                  if(suppression == 0)
                  {
                      //update tsy miasa eto
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total)- current_elem_cout_divers.cout + cout_divers.cout ;

                        vm.selectedItemTete.montant_total= cout_tot;
                  }
                  else 
                  {    
                    vm.all_cout_divers = vm.all_cout_divers.filter(function(obj)
                    {
                       return obj.id !== cout_divers.id;
                    });
                    vm.selectedItemTete.montant_total= parseInt(vm.selectedItemTete.montant_total)-vm.selectedItem_cout_divers.cout;
                  }
              }
              else
              {
                
                cout_divers.id = String(data.response);
                Nouvel_elem_cout_divers = false ;
                vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+cout_divers.cout;

              }


              
            
            })
            .error
            (
              function (data)
              {
                vm.showAlert("Error","Erreur lors de l'insertion de donnée");
              }
            );


        }




        vm.annuler_cout_divers = function(item)
        {
          item.$edit = false ;
          

          if (Nouvel_elem_cout_divers == false) 
          { 
            
            item.id_tcd = current_elem_cout_divers.id_tcd ;
            item.cout = current_elem_cout_divers.cout ;
          }
          else
          {
            vm.all_cout_divers = vm.all_cout_divers.filter(function(obj)
            {
                return obj.id !== '0';
            });

            Nouvel_elem_cout_divers = false;
          }

        }

        vm.select_cout_divers = function(item)
        {
          vm.selectedItem_cout_divers = item ;
          console.log(vm.selectedItem_cout_divers);
          if(item.$selected==false)
            {
              current_elem_cout_divers     = JSON.parse(JSON.stringify(vm.selectedItem_cout_divers));
            }
        }

        $scope.$watch('vm.selectedItem_cout_divers', function()
        {
             if (!vm.all_cout_divers) return;
             vm.all_cout_divers.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem_cout_divers.$selected = true;
        });*/
      /*****************fin cout divers**************/
      /*****************debut convention detail**************/

      //col table
        vm.convention_cife_detail_column1 = [
        {
          titre:"Intitule"
        },
        {
          titre:"Delai"
        },
        {
          titre:"Date signature"
        },
        {
          titre:"Observation"
        }];

        vm.convention_cife_detail_column2 = [
        {
          titre:"Nom banque"
        },
        {
          titre:"Adresse banque"
        },
        {
          titre:"RIB"
        }];

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
              id_compte_feffi:'',
              adresse_banque:'',
              rib:'',
              delai:'',
              date_signature:'',
              observation:''
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

              item.id_compte_feffi  = currentItemDetail.compte_feffi.id ;
              item.nom_banque  = currentItemDetail.compte_feffi.nom_banque ;
              item.adresse_banque  = currentItemDetail.compte_feffi.adresse_banque ;
              item.rib  = currentItemDetail.compte_feffi.rib ;
              item.delai = currentItemDetail.delai ;
              item.observation  = currentItemDetail.observation ;
              item.date_signature  = new Date(currentItemDetail.date_signature) ; 
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

            if(item.$selected==false)
            {
              currentItemDetail     = JSON.parse(JSON.stringify(vm.selectedItemDetail));
            }
            
           // vm.allconvention= [] ;             

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

            item.id_compte_feffi  = vm.selectedItemDetail.compte_feffi.id ;
            item.nom_banque  = vm.selectedItemDetail.compte_feffi.nom_banque ;
            item.adresse_banque  = vm.selectedItemDetail.compte_feffi.adresse_banque ;
            item.rib  = vm.selectedItemDetail.compte_feffi.rib ;
            item.delai = parseInt(vm.selectedItemDetail.delai) ;
            item.observation  = vm.selectedItemDetail.observation ;
            item.date_signature  = new Date(vm.selectedItemDetail.date_signature)
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
               var convD = vm.allconvention_cife_detail.filter(function(obj)
                {
                   return obj.id == currentItemDetail.id;
                });
                if(convD[0])
                {
                   if((convD[0].intitule!=currentItemDetail.intitule)
                    || (convD[0].date_signature!=currentItemDetail.date_signature)
                    || (convD[0].id_compte_feffi!=currentItemDetail.id_compte_feffi)
                    || (convD[0].observation!=currentItemDetail.observation)
                    || (convD[0].delai!=currentItemDetail.delai))                    
                      {
                          insert_in_baseDetail(item,suppression);                        
                        
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
                    //montant_total:    convention_cife_detail.montant_total,
                    //avancement:    convention_cife_detail.avancement,
                    intitule:    convention_cife_detail.intitule, 
                    id_convention_entete: vm.selectedItemTete.id ,
                    delai:    convention_cife_detail.delai,
                    date_signature:    convertionDate(new Date(convention_cife_detail.date_signature)),
                    //id_compte_feffi: convention_cife_detail.id_compte_feffi,
                    observation: convention_cife_detail.observation,           
                });
                console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_detail/index",datas, config).success(function (data)
            {
                var comp_fef = vm.allcompte_feffi.filter(function(obj)
                {
                    return obj.id == convention_cife_detail.id_compte_feffi;
                });

                if (NouvelItemDetail == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                       /* vm.selectedItemDetail.intitule  = convention_cife_detail.intitule;
                        vm.selectedItemDetail.delai  = convention_cife_detail.delai;
                        vm.selectedItemDetail.date_signature    = convention_cife_detail.date_signature;*/
                        vm.selectedItemDetail.compte_feffi = comp_fef[0];
                       // vm.selectedItemDetail.observation = convention_cife_detail.observation;

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
                  
                 /* convention_cife_detail.intitule= convention_cife_detail.intitule;
                  convention_cife_detail.delai  = convention_cife_detail.delai;
                  convention_cife_detail.date_signature    = convention_cife_detail.date_signature;*/
                  convention_cife_detail.compte_feffi = comp_fef[0];
                  //convention_cife_detail.observation = convention_cife_detail.observation;
                  convention_cife_detail.id  =   String(data.response);              
                  NouvelItemDetail = false;

                  vm.showbuttonNouvDetail = false;
            }
              convention_cife_detail.$selected = false;
              convention_cife_detail.$edit = false;
              vm.selectedItemDetail = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }


        vm.changecompte_feffi = function(item)
        {
          var comp_fef = vm.allcompte_feffi.filter(function(obj)
          {
             return obj.id == item.id_compte_feffi;
          });
          vm.selectedItemDetail.adresse_banque    = comp_fef[0].adresse_banque;
          vm.selectedItemDetail.rib       = comp_fef[0].rib;

        }
       
      /*****************fin convention detail****************/

      /*****************debut batiment construction***************/
      //col table

        vm.batiment_construction_column = [        
        {
          titre:"Batiment"
        },
        {
          titre:"Description"
        },
        {
          titre:"Nombre salle"
        },
       // {
        //  titre:"Nombre batiment"
        //},
        {
          titre:"Cout unitaire"
        },
        {
          titre:"Action"
        }];




        //Masque de saisi ajout
        vm.ajouterBatiment_construction = function ()
        { 
          if (NouvelItemBatiment_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_batiment:'',
              nbr_batiment:1,
              cout_unitaire:'',
              description:'',
              nbr_salle:''
            };         
            vm.allbatiment_construction.push(items);
            
              
            vm.selectedItemBatiment_construction = items;
            

            NouvelItemBatiment_construction = true ;
          }
          else
          {
            vm.showAlert("Ajout entête batiment construction','Un formulaire d'ajout est déjà ouvert!!!");
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
              item.id_type_batiment = currentItemBatiment_construction.id_type_batiment;
              item.nbr_batiment    = currentItemBatiment_construction.nbr_batiment;
              item.cout_unitaire = currentItemBatiment_construction.cout_unitaire;
              item.description = currentItemBatiment_construction.type_batiment.description;
             item.nbr_salle = currentItemBatiment_construction.type_batiment.nbr_salle;
             // item.id_attachement_batiment    = currentItemBatiment_construction.id_attachement_batiment; 
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

            if(item.$selected==false)
            {
               currentItemBatiment_construction     = JSON.parse(JSON.stringify(vm.selectedItemBatiment_construction));
            }
           vm.showbuttonNouvLatrine=true;
           // vm.allconvention= [] ;          
            //recuperation donnée convention
            if (vm.selectedItemBatiment_construction.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("latrine_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.alllatrine_construction = result.data.response;

                  if (vm.alllatrine_construction.length >0)
                  {
                    vm.showbuttonNouvLatrine=false;
                  }
                console.log(vm.alllatrine_construction);
                  
              });

              apiFactory.getAPIgeneraliserREST("mobilier_construction/index",'id_batiment_construction',vm.selectedItemBatiment_construction.id).then(function(result)
              {
                  vm.allmobilier_construction = result.data.response;
                  if(vm.allmobilier_construction.length!=0)
                  {
                    vm.showbuttonNouvMobilier=false;
                  }
                  
              });

              apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                  vm.alltype_latrine = result.data.response; 
                  //console.log(vm.alltype_latrine);
              });

              apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',vm.selectedItemTete.ecole.id_zone,'id_acces_zone',vm.selectedItemTete.ecole.id_acces).then(function(result)
              {
                  vm.alltype_mobilier = result.data.response; 
                  //console.log(vm.alltype_mobilier);
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

            item.id_type_batiment = vm.selectedItemBatiment_construction.type_batiment.id;
            item.nbr_batiment = parseInt(vm.selectedItemBatiment_construction.nbr_batiment);
            //item.cout_batiment = parseInt(vm.selectedItemBatiment_construction.cout_batiment);
            item.cout_unitaire = parseInt(vm.selectedItemBatiment_construction.cout_unitaire);
            item.description = vm.selectedItemBatiment_construction.type_batiment.description;
            item.nbr_salle = parseInt(vm.selectedItemBatiment_construction.type_batiment.nbr_salle);

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
                   if((ouv_c[0].id_type_batiment!=currentItemBatiment_construction.id_type_batiment)
                    || (ouv_c[0].nbr_batiment!=currentItemBatiment_construction.nbr_batiment)
                    || (ouv_c[0].cout_unitaire!=currentItemBatiment_construction.cout_unitaire)
                    )                    
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
                    id_type_batiment: batiment_construction.id_type_batiment,
                    nbr_batiment: batiment_construction.nbr_batiment,
                    cout_unitaire: batiment_construction.cout_unitaire,
                    id_convention_entete: vm.selectedItemTete.id

                });
                console.log(datas);
                //factory
            apiFactory.add("batiment_construction/index",datas, config).success(function (data)
            {

                var typ_bat = vm.alltype_batiment.filter(function(obj)
                {
                    return obj.id == batiment_construction.id_type_batiment;
                });

                if (NouvelItemBatiment_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemBatiment_construction.type_batiment = typ_bat[0];
                       // vm.selectedItemBatiment_construction.nbr_batiment = batiment_construction.nbr_batiment;
                       // vm.selectedItemBatiment_construction.cout_unitaire = batiment_construction.cout_unitaire;
                        vm.selectedItemBatiment_construction.$selected  = false;
                        vm.selectedItemBatiment_construction.$edit      = false;
                        vm.selectedItemBatiment_construction ={};
                        var cout_ancien_bat= parseInt(currentItemBatiment_construction.cout_unitaire)*parseInt(currentItemBatiment_construction.nbr_batiment);
                        var cout_nouveau_bat= parseInt(typ_bat[0].cout_batiment)*parseInt(batiment_construction.nbr_batiment);
                        var cout_tot = parseInt(vm.selectedItemTete.montant_total)- cout_ancien_bat + cout_nouveau_bat ;

                        vm.selectedItemTete.montant_total= cout_tot;
                        vm.showbuttonNouvBatiment=false;
                        // miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                    else 
                    {    
                      vm.allbatiment_construction = vm.allbatiment_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemBatiment_construction.id;
                      });
                      vm.showbuttonNouvBatiment=true;
                      /*var prix_latrine=0;
                      var prix_mobilier=0;

                      if(vm.alllatrine_construction.length!=0)
                      { 
                          vm.alllatrine_construction.forEach(function(item)
                         {
                            prix_latrine = prix_latrine + (item.nbr_latrine*item.cout_unitaire)
                         });
                      }
                      if(vm.allmobilier_construction.length!=0)
                      { 
                          vm.allmobilier_construction.forEach(function(item)
                         {
                            prix_mobilier = prix_mobilier + (item.nbr_mobilier*item.cout_unitaire)
                         });
                      }*/
                      var cout_ancien_bat= parseInt(currentItemBatiment_construction.cout_unitaire) *
                                        parseInt(currentItemBatiment_construction.nbr_batiment);
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total) - cout_ancien_bat;
                      vm.selectedItemTete.montant_total = cout_tot;
                       //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                    }
                }
                else
                {
                  
                  batiment_construction.type_batiment= typ_bat[0];
                  /*batiment_construction.nbr_batiment = batiment_construction.nbr_batiment;
                  batiment_construction.cout_unitaire = batiment_construction.cout_unitaire;*/
                  batiment_construction.id  =   String(data.response);              
                  NouvelItemBatiment_construction = false;
                  
                  vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+ 
                  (parseInt(batiment_construction.cout_unitaire)*parseInt(batiment_construction.nbr_batiment));
                  vm.showbuttonNouvBatiment=false;
                 //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
            }
              batiment_construction.$selected = false;
              batiment_construction.$edit = false;
              vm.selectedItemBatiment_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        //fonction bouton modification ouvrage
        vm.modification_type_batiment = function(item)
        { 
            var bato = vm.alltype_batiment.filter(function(obj)
            {
                return obj.id == item.id_type_batiment;
            });
            item.cout_unitaire = parseInt(bato[0].cout_batiment);
            item.nbr_salle = parseInt(bato[0].nbr_salle);
            item.description = bato[0].description;
            
        };


      /*****************fin batiment construction***************/


       /*****************debut latrine construction***************/
      //col table
        vm.latrine_construction_column1 = [        
        {
          titre:"Latrine"
        },
        /*{
          titre:"Nombre latrine"
        },
        */
        {
          titre:"Description"
        }];

         vm.latrine_construction_column2 = [        
        
        {
          titre:"Nombre boxe latrine"
        },
        {
          titre:"Nombre point d'eau"
        },
        {
          titre:"cout latrine"
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
              id_type_latrine:'',
              cout_unitaire:'',
              nbr_latrine:1,
              nbr_box_latrine:'',
              nbr_point_eau:'',
              description:''
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
              item.id_type_latrine = currentItemLatrine_construction.id_type_latrine;
              item.nbr_latrine    = currentItemLatrine_construction.nbr_latrine;
              item.cout_unitaire = currentItemLatrine_construction.cout_unitaire;
              item.description = currentItemLatrine_construction.description;
              item.nbr_box_latrine = currentItemLatrine_construction.nbr_box_latrine;
              item.nbr_point_eau = currentItemLatrine_construction.nbr_point_eau; 
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

            if (item.$selected==false)
            {
               currentItemLatrine_construction     = JSON.parse(JSON.stringify(vm.selectedItemLatrine_construction));
            }           

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

            //recuperation donnée type_latrine
            /*apiFactory.getAPIgeneraliserREST("type_latrine/index","id_type_batiment",vm.selectedItemBatiment_construction.type_batiment.id).then(function(result)
            {
              vm.alltype_latrine= result.data.response;
              item.id_type_latrine = vm.selectedItemLatrine_construction.type_latrine.id;
            });*/
            item.id_type_latrine = vm.selectedItemLatrine_construction.type_latrine.id;
            item.nbr_latrine = parseInt(vm.selectedItemLatrine_construction.nbr_latrine);
            //item.cout_latrine = parseInt(vm.selectedItemLatrine_construction.cout_latrine);
            item.cout_unitaire = parseInt(vm.selectedItemLatrine_construction.cout_unitaire);
            item.description = vm.selectedItemLatrine_construction.type_latrine.description;
            item.nbr_box_latrine = parseInt(vm.selectedItemLatrine_construction.type_latrine.nbr_box_latrine);
            item.nbr_point_eau = parseInt(vm.selectedItemLatrine_construction.type_latrine.nbr_point_eau);
            

            
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
               var latr_con = vm.alllatrine_construction.filter(function(obj)
                {
                   return obj.id == currentItemLatrine_construction.id;
                });
                if(latr_con[0])
                {
                   if((latr_con[0].id_type_latrine!=currentItemLatrine_construction.id_type_latrine)
                    || (latr_con[0].nbr_latrine!=currentItemLatrine_construction.nbr_latrine)
                    || (latr_con[0].cout_unitaire!=currentItemLatrine_construction.cout_unitaire)
                    )                    
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
                    id_type_latrine: latrine_construction.id_type_latrine,
                    nbr_latrine: latrine_construction.nbr_latrine,
                    cout_unitaire: latrine_construction.cout_unitaire,
                    id_batiment_construction: vm.selectedItemBatiment_construction.id

                });
                console.log(datas);
                //factory
            apiFactory.add("latrine_construction/index",datas, config).success(function (data)
            {

                var typ_lat = vm.alltype_latrine.filter(function(obje)
                {
                    return obje.id == latrine_construction.id_type_latrine;
                });

                if (NouvelItemLatrine_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemLatrine_construction.latrine_ouvrage = typ_lat[0];
                        //vm.selectedItemLatrine_construction.nbr_latrine = latrine_construction.nbr_latrine;
                        //vm.selectedItemLatrine_construction.cout_unitaire = latrine_construction.cout_unitaire;
                        vm.selectedItemLatrine_construction.$selected  = false;
                        vm.selectedItemLatrine_construction.$edit      = false;
                        vm.selectedItemLatrine_construction ={};

                        var cout_ancien_lat= parseInt(currentItemLatrine_construction.cout_unitaire)*parseInt(currentItemLatrine_construction.nbr_latrine);
                        var cout_nouveau_lat= parseInt(typ_lat[0].cout_latrine)*parseInt(latrine_construction.nbr_latrine);
                        var cout_tot = parseInt(vm.selectedItemTete.montant_total)- cout_ancien_lat + cout_nouveau_lat ;
                        vm.selectedItemTete.montant_total = cout_tot;
                        //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                        vm.showbuttonNouvLatrine=false;
                    }
                    else 
                    {    
                      vm.alllatrine_construction = vm.alllatrine_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemLatrine_construction.id;
                      });

                      var cout_ancien_lat= parseInt(currentItemLatrine_construction.cout_unitaire) *
                                        parseInt(currentItemLatrine_construction.nbr_latrine);
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total) - cout_ancien_lat;
                      vm.selectedItemTete.montant_total = cout_tot;
                       //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                       vm.showbuttonNouvLatrine=true;
                      
                    }
                }
                else
                {
                  
                  latrine_construction.type_latrine= typ_lat[0];
                  //latrine_construction.nbr_latrine = latrine_construction.nbr_latrine;
                  //latrine_construction.cout_unitaire = latrine_construction.cout_unitaire;
                  latrine_construction.id  =   String(data.response);              
                  NouvelItemLatrine_construction = false;
                  
                  //console.log(latrine_construction);
                  //var cout_tot = parseInt(vm.selectedItemDetail.montant_total)+ 
                  //(parseInt(latrine_construction.cout_unitaire)*parseInt(latrine_construction.nbr_latrine));
                  vm.selectedItemTete.montant_total = parseInt(vm.selectedItemTete.montant_total)+ 
                  (parseInt(latrine_construction.cout_unitaire)*parseInt(latrine_construction.nbr_latrine));
                  //miseajourDetail(vm.selectedItemDetail,0,cout_tot);
                  vm.showbuttonNouvLatrine=false;
            }
              latrine_construction.$selected = false;
              latrine_construction.$edit = false;
              vm.selectedItemLatrine_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //fonction bouton modification ouvrage
        vm.modification_type_latrine = function(item)
        {
            var annel = vm.alltype_latrine.filter(function(obj)
            {
                return obj.id == item.id_type_latrine;
            });
            //console.log(annel[0]);
            item.cout_unitaire = parseInt(annel[0].cout_latrine);            
            item.description = annel[0].description;
            item.nbr_box_latrine = parseInt(annel[0].nbr_box_latrine);
            item.nbr_point_eau = parseInt(annel[0].nbr_point_eau);
        };
      /*****************fin latrine construction***************/

      /*****************debut mobilier construction***************/
       //col table
        vm.mobilier_construction_column1 = [        
        {
          titre:"Mobilier"
        },
       /* {
          titre:"Nombre mobilier"
        },*/
        {
          titre:"Description"
        }];

        //col table
        vm.mobilier_construction_column2 = [        
        
        {
          titre:"Nombre table banc"
        },
        {
          titre:"Nombre table maitre"
        },
        {
          titre:"Nombre chaise maitre"
        },
        {
          titre:"cout mobilier"
        }];

        //Masque de saisi ajout
        vm.ajouterMobilier_construction = function ()
        { 
          if (NouvelItemMobilier_construction == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_type_mobilier:'',
              cout_unitaire:'',
              nbr_mobilier:1,
              description:'',
              nbr_table_banc:'',
              nbr_table_maitre:'',
              nbr_chaise_maitre:'',
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
              item.id_type_mobilier = currentItemMobilier_construction.id_type_mobilier;
              item.nbr_mobilier    = currentItemMobilier_construction.nbr_mobilier;
              item.cout_unitaire = currentItemMobilier_construction.cout_unitaire;
              item.description = currentItemMobilier_construction.description;
              item.nbr_table_banc = currentItemMobilier_construction.nbr_table_banc;
              item.nbr_table_maitre = currentItemMobilier_construction.nbr_table_maitre;
              item.nbr_chaise_maitre = currentItemMobilier_construction.nbr_chaise_maitre; 
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

        //fonction selection item Mobilier construction cisco/feffi
        vm.selectionMobilier_construction = function (item)
        {
            
            vm.selectedItemMobilier_construction = item;

            if(item.$selected == false)
            {
               currentItemMobilier_construction     = JSON.parse(JSON.stringify(vm.selectedItemMobilier_construction));
            }
           
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
            item.id_type_mobilier = vm.selectedItemMobilier_construction.type_mobilier.id;
            item.nbr_mobilier = parseInt(vm.selectedItemMobilier_construction.nbr_mobilier);
            item.cout_unitaire = parseInt(vm.selectedItemMobilier_construction.cout_unitaire);
            item.description = vm.selectedItemMobilier_construction.type_mobilier.description;
            item.nbr_table_banc = parseInt(vm.selectedItemMobilier_construction.type_mobilier.nbr_table_banc);
            item.nbr_table_maitre = parseInt(vm.selectedItemMobilier_construction.type_mobilier.nbr_table_maitre);
            item.nbr_chaise_maitre = parseInt(vm.selectedItemMobilier_construction.type_mobilier.nbr_chaise_maitre);
            

            
        };

        //fonction bouton suppression item Latrine construction
        vm.supprimerMobilier_construction = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Les données mobiliers et latrines seront également supprimer')
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
               var latr_con = vm.allmobilier_construction.filter(function(obj)
                {
                   return obj.id == currentItemMobilier_construction.id;
                });
                if(latr_con[0])
                {
                   if((latr_con[0].id_type_mobilier!=currentItemMobilier_construction.id_type_mobilier)
                    || (latr_con[0].nbr_mobilier!=currentItemMobilier_construction.nbr_mobilier)
                    || (latr_con[0].cout_unitaire!=currentItemMobilier_construction.cout_unitaire)
                    )                    
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
                    id_type_mobilier: mobilier_construction.id_type_mobilier,
                    nbr_mobilier: mobilier_construction.nbr_mobilier,
                    cout_unitaire: mobilier_construction.cout_unitaire,
                    id_batiment_construction: vm.selectedItemBatiment_construction.id

                });
                console.log(datas);
                //factory
            apiFactory.add("mobilier_construction/index",datas, config).success(function (data)
            {

                var typ_mob = vm.alltype_mobilier.filter(function(obje)
                {
                    return obje.id == mobilier_construction.id_type_mobilier;
                });

                if (NouvelItemMobilier_construction == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemMobilier_construction.mobilier_ouvrage = typ_mob[0];
                        //vm.selectedItemMobilier_construction.nbr_mobilier = mobilier_construction.nbr_mobilier;
                        //vm.selectedItemMobilier_construction.cout_unitaire = mobilier_construction.cout_unitaire;
                        vm.selectedItemMobilier_construction.$selected  = false;
                        vm.selectedItemMobilier_construction.$edit      = false;
                        vm.selectedItemMobilier_construction ={};

                        var cout_ancien_mob= parseInt(currentItemMobilier_construction.cout_unitaire)*parseInt(currentItemMobilier_construction.nbr_mobilier);
                        var cout_nouveau_mob= parseInt(typ_mob[0].cout_mobilier)*parseInt(mobilier_construction.nbr_mobilier);
                        var cout_tot = parseInt(vm.selectedItemTete.montant_total)- cout_ancien_mob + cout_nouveau_mob ;
                        vm.selectedItemTete.montant_total = cout_tot;
                        vm.showbuttonNouvMobilier=false;
                    }
                    else 
                    {    
                      vm.allmobilier_construction = vm.allmobilier_construction.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemMobilier_construction.id;
                      });

                      var cout_ancien_mob= parseInt(currentItemMobilier_construction.cout_unitaire) *
                                        parseInt(currentItemMobilier_construction.nbr_mobilier);
                      var cout_tot = parseInt(vm.selectedItemTete.montant_total) - cout_ancien_mob;

                      vm.selectedItemTete.montant_total = cout_tot;
                      vm.showbuttonNouvMobilier=true;
                      
                    }
                }
                else
                {
                  
                  mobilier_construction.type_mobilier= typ_mob[0];
                  //mobilier_construction.nbr_mobilier = mobilier_construction.nbr_mobilier;
                  //mobilier_construction.cout_unitaire = mobilier_construction.cout_unitaire;
                  mobilier_construction.id  =   String(data.response);              
                  NouvelItemMobilier_construction = false;
                  
                  //console.log(latrine_construction);
                  
                  vm.selectedItemTete.montant_total = parseInt(vm.selectedItemDetail.montant_total)+ 
                  (parseInt(mobilier_construction.cout_unitaire)*parseInt(mobilier_construction.nbr_mobilier));
                  vm.showbuttonNouvMobilier=false;
            }
              mobilier_construction.$selected = false;
              mobilier_construction.$edit = false;
              vm.selectedItemMobilier_construction = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

         //fonction bouton modification ouvrage
        vm.modification_type_mobilier = function(item)
        {
            var annel = vm.alltype_mobilier.filter(function(obj)
            {
                return obj.id == item.id_type_mobilier;
            });
            item.cout_unitaire = parseInt(annel[0].cout_mobilier);
            item.description = annel[0].description;
            item.nbr_table_banc = parseInt(annel[0].nbr_table_banc);
            item.nbr_table_maitre = parseInt(annel[0].nbr_table_maitre);
            item.nbr_chaise_maitre = parseInt(annel[0].nbr_chaise_maitre);
            
        };
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
