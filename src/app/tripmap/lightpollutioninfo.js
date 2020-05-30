var $jscomp = {
    scope: {},
    findInternal: function(b, a, c) {
        b instanceof String && (b = String(b));
        for (var d = b.length, e = 0; e < d; e++) {
            var f = b[e];
            if (a.call(c, f, e, b)) return {
                i: e,
                v: f
            }
        }
        return {
            i: -1,
            v: void 0
        }
    }
};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, a, c) {
    if (c.get || c.set) throw new TypeError("ES3 does not support getters and setters.");
    b != Array.prototype && b != Object.prototype && (b[a] = c.value)
};
$jscomp.getGlobal = function(b) {
    return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(b, a, c, d) {
    if (a) {
        c = $jscomp.global;
        b = b.split(".");
        for (d = 0; d < b.length - 1; d++) {
            var e = b[d];
            e in c || (c[e] = {});
            c = c[e]
        }
        b = b[b.length - 1];
        d = c[b];
        a = a(d);
        a != d && null != a && $jscomp.defineProperty(c, b, {
            configurable: !0,
            writable: !0,
            value: a
        })
    }
};
$jscomp.polyfill("Array.prototype.find", function(b) {
    return b ? b : function(a, b) {
        return $jscomp.findInternal(this, a, b).v
    }
}, "es6-impl", "es3");
$jscomp.polyfill("Math.log10", function(b) {
    return b ? b : function(a) {
        return Math.log(a) / Math.LN10
    }
}, "es6-impl", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(b) {
    return $jscomp.SYMBOL_PREFIX + (b || "") + $jscomp.symbolCounter_++
};
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var b = $jscomp.global.Symbol.iterator;
    b || (b = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[b] && $jscomp.defineProperty(Array.prototype, b, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(b) {
    var a = 0;
    return $jscomp.iteratorPrototype(function() {
        return a < b.length ? {
            done: !1,
            value: b[a++]
        } : {
            done: !0
        }
    })
};
$jscomp.iteratorPrototype = function(b) {
    $jscomp.initSymbolIterator();
    b = {
        next: b
    };
    b[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return b
};
$jscomp.array = $jscomp.array || {};
$jscomp.iteratorFromArray = function(b, a) {
    $jscomp.initSymbolIterator();
    b instanceof String && (b += "");
    var c = 0,
        d = {
            next: function() {
                if (c < b.length) {
                    var e = c++;
                    return {
                        value: a(e, b[e]),
                        done: !1
                    }
                }
                d.next = function() {
                    return {
                        done: !0,
                        value: void 0
                    }
                };
                return d.next()
            }
        };
    d[Symbol.iterator] = function() {
        return d
    };
    return d
};
$jscomp.polyfill("Array.prototype.values", function(b) {
    return b ? b : function() {
        return $jscomp.iteratorFromArray(this, function(a, b) {
            return b
        })
    }
}, "es6", "es3");
var map, rightMenuVis = !0,
    c_mode = 0,
    activeControl = "",
    visibleRadiance = "wa_2015",
    draw, www2 = "https://www.lightpollutionmap.info/",
    today1 = new Date,
    today = new Date(today1.getFullYear(), today1.getMonth() + 1, today1.getDate()),
    bingKey = "AjfH473Ph0EOxc7MjZfq5__YyrGyDjV4XFi18WxIIEPom7Jemhrwe52pWK6Tski4",
    chartjs_loaded = !1,
    adblocker = !1,
    overlayList = "VIIRS_2019 VIIRS_2018 VIIRS_2017 VIIRS_2016 VIIRS_2015 WA_2015 VIIRS_2014 VIIRS_2013 VIIRS_2012".split(" ");

function dateToString(b) {
    return b.getFullYear() + "-" + ("0" + (b.getMonth() + 1)).slice(-2) + "-" + ("0" + b.getDate()).slice(-2)
}

function dateTimeToString(b) {
    b.setHours(b.getHours() + 2);
    b.setHours(b.getHours() + b.getTimezoneOffset() / 60);
    var a = b.getFullYear() + "-" + ("0" + (b.getMonth() + 1)).slice(-2) + "-" + ("0" + b.getDate()).slice(-2);
    return a += " " + ("0" + b.getHours()).slice(-2) + ":" + ("0" + b.getMinutes()).slice(-2) + ":" + ("0" + b.getSeconds()).slice(-2)
}

function minDefaultValue() {
    return new Date((new Date(today)).setMonth(today.getMonth() - 240))
}
var minDate = dateToString(minDefaultValue()),
    maxDate = dateToString(today),
    layerSQMFilter = "timemeasure > '" + minDate + "' AND timemeasure < '" + maxDate + "'",
    layerObsFilter = "sqm_zenith > 15 AND sqm_zenith < 22";

function init() {
    function b() {
        html2canvas($("#map"), {
            onrendered: function(a) {
                a.msToBlob ? (a = a.msToBlob(), window.navigator.msSaveBlob(a, "LightPollutionMap_Screenshot.png")) : a.toBlob ? a.toBlob(function(a) {
                    saveAs(a, "LightPollutionMap_Screenshot.png")
                }) : alert("Not supported on this browser :(")
            }
        })
    }
    $(function() {
        $(document).tooltip({
            hide: {
                effect: "explode",
                duration: 500
            },
            track: !0,
            content: function() {
                return this.getAttribute("title")
            },
            open: function(a, b) {
                setTimeout(function() {
                    $(b.tooltip).hide("explode", 500)
                }, 5E3)
            },
            show: {
                delay: 500
            }
        })
    });
    $("#extendedToolbar").draggable();
    var a = [];.5 < Math.random() && (bingKey = "hUVe19f6SzYXsN1ha4yU~Mhp5LMs1dbWhj9qvFqir2A~AkvKw-1qKzfiq7rmw5Pudr70N9IM9cyw8x63iKwBGzKv6Iq5rtSwf3BuHiG1eFnz");
    a.push(new ol.layer.Tile({
        visible: !0,
        preload: Infinity,
        name: "LayerBingRoad",
        source: new ol.source.BingMaps({
            key: bingKey,
            imagerySet: "Road"
        })
    }));
    a.push(new ol.layer.Tile({
        visible: !1,
        preload: Infinity,
        name: "LayerBingHybrid",
        source: new ol.source.BingMaps({
            key: bingKey,
            imagerySet: "AerialWithLabels"
        })
    }));
    for (var c =
            0; c < overlayList.length; c++) a.push(new ol.layer.Tile({
        visible: !1,
        opacity: .5,
        name: "Layer" + overlayList[c].replace("_", ""),
        source: new ol.source.TileWMS({
            url: www2 + "geoserver/gwc/service/wms",
            params: {
                LAYERS: "PostGIS:" + overlayList[c],
                TILED: !0,
                SRS: "EPSG:3857",
                FORMAT: "image/png"
            },
            tileGrid: new ol.tilegrid.TileGrid({
                origin: [0, 0],
                resolutions: [156543.62449864, 78271.81224932, 39135.90612466, 19567.95306233, 9783.976531165, 4891.9882655825, 2445.99413279125, 1222.997066395625, 611.4985331978125, 305.7492665989063]
            })
        })
    }));
    a.push(new ol.layer.Image({
        visible: !1,
        opacity: .75,
        name: "LayerSQM",
        source: new ol.source.ImageWMS({
            url: "/geoserver/PostGIS/wms",
            params: {
                LAYERS: "PostGIS:lightpollutionslo_view",
                SRS: "EPSG:3857",
                CQL_FILTER: layerSQMFilter,
                maxFeatures: 2E3,
                sortBy: "rnd D"
            },
            serverType: "geoserver"
        })
    }));
    a.push(new ol.layer.Image({
        visible: !1,
        opacity: 1,
        name: "LayerObs",
        source: new ol.source.ImageWMS({
            url: "/geoserver/PostGIS/wms",
            params: {
                LAYERS: "PostGIS:lp_observatories",
                SRS: "EPSG:3857",
                CQL_FILTER: layerObsFilter
            },
            serverType: "geoserver"
        })
    }));
    var d = new ol.control.Attribution({
            collapsible: !0,
            label: "i",
            collapseLabel: "\u00ab",
            collapsed: !0,
            tipLabel: "Attributions"
        }),
        e = new ol.control.ScaleLine({
            units: "metric",
            minWidth: 100
        });
    map = new ol.Map({
        layers: a,
        target: "map",
        renderer: "canvas",
        loadTilesWhileAnimating: !0,
        loadTilesWhileInteracting: !0,
        controls: ol.control.defaults({
            attribution: !1,
            rotate: !1
        }).extend([e, d]),
        view: new ol.View({
            center: [1619364, 5759860],
            extent: [-20037600, -9611615, 20037600, 12932243],
            resolutions: [78271.81224932, 39135.90612466, 19567.95306233,
                9783.976531165, 4891.9882655825, 2445.99413279125, 1222.997066395625, 611.4985331978125, 305.7492665989063, 152.87463329945314, 76.43731664972657, 38.218658324863284, 19.109329162431642, 9.554664581215821, 4.7773322906079105, 2.3886661453039553, 1.1943330726519776, .5971665363259888, .2985832681629944
            ],
            zoom: 4
        })
    });
    map.on("click", defaultInfo);
    $("#SQMStartDate").MonthPicker({
        Button: !1
    });
    $("#SQMEndDate").MonthPicker({
        Button: !1
    });
    $("#SQMStartDate").mask("9999-99");
    $("#SQMEndDate").mask("9999-99");
    $("#SQMStartDate").MonthPicker({
        MonthFormat: "yy-mm"
    });
    $("#SQMEndDate").MonthPicker({
        MonthFormat: "yy-mm"
    });
    layerSQMFilter = "timemeasure > '" + minDate + "' AND timemeasure < '" + maxDate + "'";
    d = minDate.split("-")[0];
    e = minDate.split("-")[1];
    $("#SQMStartDate").val(d + "-" + e);
    d = maxDate.split("-")[0];
    e = maxDate.split("-")[1];
    $("#SQMEndDate").val(d + "-" + e);
    $(".ui-widget-header").css("background-color", "rgba(127,157,197,0.8)");
    $("#MonthPicker_SQMStartDate").css("font-size", "0.8em");
    $("#MonthPicker_SQMEndDate").css("font-size", "0.8em");
    $("#SQMName").change(function() {
        updateSQMLayer()
    });
    $("#SQMStartDate").change(function() {
        updateSQMLayer()
    });
    $("#SQMEndDate").change(function() {
        updateSQMLayer()
    });
    $("#ObsLowSQM").change(function() {
        updateObsLayer()
    });
    $("#ObsHighSQM").change(function() {
        updateObsLayer()
    });
    $("#overlay_tran_slider").slider({
        value: 60,
        change: function(a, b) {
            $(this).find(".ui-slider-handle").text(b.value)
        },
        slide: function(a, b) {
            getLayerByName("Layer" + $("#overlaySelect").val()).setOpacity(b.value / 100);
            $(this).find(".ui-slider-handle").text(b.value)
        }
    });
    $("#feature_tran_slider").slider({
        value: 85,
        change: function(a, b) {
            $(this).find(".ui-slider-handle").text(b.value)
        },
        slide: function(a, b) {
            var c = getLayerByName("LayerSQM"),
                e = getLayerByName("LayerObs");
            c.setOpacity(b.value / 100);
            e.setOpacity(b.value / 100);
            $(this).find(".ui-slider-handle").text(b.value)
        }
    });
    $("#overlay_tran_slider").slider("value", 60);
    $("#feature_tran_slider").slider("value", 85);
    window.top !== window.self && ($("body").prepend('<div style="position:absolute;top:0;left:0;width:100%;height:2em;background-color:#7f9dc5;font-family:Arial;font-size:1.2em;border-color:#c2c6c7;border-bottom-width:2px;border-bottom-style:solid;z-index:1;cursor:pointer;overflow: hidden;"><div id="topBarText" style="float:left;font-family:Arial;font-size: 1.25em;font-weight: bold;color: #efefef;padding: 0.2em 0.1em 0.1em 0.4em;" onclick="window.open(\'https://www.lightpollutionmap.info/\');">www.lightpollutionmap.info</div><div style="float:right;cursor:pointer;background-image:url(/img/Fullscreen.png);width: 2em;height: 1.33em;background-size: contain;margin-top: 0.25em;margin-right: 0.4em;" onclick="window.open(window.location.href);"></div></div>',
            $("#map")), $("#map").css({
            height: "calc(100% - 2.4em)",
            top: "2.4em",
            bottom: "0em"
        }), 700 > $("#map").height() && (toggleRightMenu("min"), rightMenuVis = !1, "true" == GetHashString("min") && ($("#searchCont").hide(), $("#rightMenuButtonCont").hide(), $("#RightMenu").hide(), $(".toolBar").hide(), $(".ol-zoom").hide(), 320 > $("#map").width() ? $("#topBarText").css({
            "font-size": "0.7em",
            padding: "0.8em 0.1em 0.1em 0.4em"
        }) : 360 > $("#map").width() && $("#topBarText").css({
            "font-size": "1em",
            padding: "0.5em 0.1em 0.1em 0.4em"
        }))), $("#adContainer").hide(),
        $("#_vdo_ads_player_ai_1103").hide(), d = [$("#map").width(), $("#map").height()], map.setSize(d));
    window.addEventListener("resize", function(a) {
        resizeElements()
    });
    resizeElements();
    650 > window.innerWidth && 0 != rightMenuVis && (toggleRightMenu("min"), rightMenuVis = !1);
    $("#RightMenu").css({
        right: "0"
    });
    d = $(".cd-accordion-menu");
    0 < d.length && d.each(function() {
        $(this).on("change", 'input[type="checkbox"]', function() {
            var a = $(this);
            a.prop("checked") ? a.siblings("ul").attr("style", "display:none;").slideDown(300) : a.siblings("ul").attr("style",
                "display:block;").slideUp(300)
        })
    });
    if ("" !== window.location.hash) try {
        var f = parseInt(GetHashString("zoom")),
            k = parseInt(GetHashString("lat")),
            g = parseInt(GetHashString("lon"));
        if (!isNaN(f) && !isNaN(k) && !isNaN(g)) {
            map.getView().setCenter([g, k]);
            map.getView().setZoom(f);
            var m = GetHashString("layers");
            if (-1 != m.indexOf("B") && -1 != m.indexOf("T") && -1 != m.indexOf("F")) {
                for (var k = f = !1, r = $("#overlaySelect").children().length, h = $("#featureSelect").children().length, c = 0; c < m.length; c++)
                    if (2 > c && (0 == k ? "B" == m[c] ? (k = !0,
                            a[c].setVisible(!0)) : a[c].setVisible(!1) : a[c].setVisible(!1)), 2 <= c && c < m.length - h && ("T" == m[c] ? 0 == f ? (f = !0, a[c].setVisible(!0), $("#overlaySelect").attr("previousValue", a[c].get("name").replace("Layer", "")), $("#overlaySelect").val(a[c].get("name").replace("Layer", ""))) : a[c].setVisible(!1) : a[c].setVisible(!1)), c > r + 1 && c < m.length - 1 && c == m.length - 5) {
                        for (var l = m.substring(2 + r, 2 + r + 5).split(""), g = 0; g < l.length; g++) 0 == g && "T" == l[g] ? l[g] = "SQM" : 1 == g && "T" == l[g] ? l[g] = "SQML" : 2 == g && "T" == l[g] ? l[g] = "SQMLE" : 3 == g && "T" == l[g] ?
                            l[g] = "SQC" : 4 == g && "T" == l[g] && (l[g] = "Obs");
                        l = jQuery.grep(l, function(a) {
                            return "F" != a
                        });
                        $("#featureSelect").val(l);
                        setTimeout(function() {
                            $("#featureSelect").trigger("change")
                        }, 500)
                    }
                0 == k && a[0].setVisible(!0);
                if (0 == f) {
                    var n = getLayerByName("LayerWA2015");
                    n.setVisible(!0)
                }
            } else n = getLayerByName("LayerWA2015"), n.setVisible(!0)
        }
    } catch (t) {} else n = getLayerByName("LayerWA2015"), n.setVisible(!0), $("#overlaySelect").attr("previousValue", "WA2015");
    updateLayerSwitcher();
    setLegend();
    var p = function() {
        var b = map.getView(),
            c = b.getCenter(),
            e = "";
        for (key in a) {
            var d = a[key],
                g = d.get("name");
            if (-1 != g.indexOf("LayerBing") || -1 != g.indexOf("LayerVIIRS") || -1 != g.indexOf("LayerWA") || -1 != g.indexOf("LayerSQM") || -1 != g.indexOf("LayerObs"))
                if (-1 != g.indexOf("LayerBing")) e = 1 == d.getVisible() ? e + "B" : e + "0";
                else if (-1 != g.indexOf("LayerVIIRS") || -1 != g.indexOf("LayerWA")) e = 1 == d.getVisible() ? e + "T" : e + "F";
            else if (-1 != g.indexOf("LayerSQM"))
                for (d = $("#featureSelect").children(), g = 0; g < d.length; g++) e = 1 == d[g].selected ? e + "T" : e + "F"
        }
        b = "#zoom=" + b.getZoom() +
            "&lat=" + c[1].toFixed(0) + "&lon=" + c[0].toFixed(0) + "&layers=" + e;
        "3" == GetHashString("SQM") && (b += "&SQM=3&ID=" + GetHashString("ID"));
        window.history.replaceState(void 0, void 0, b);
        updateSocialButtonsURL()
    };
    map.on("moveend", function() {
        p();
        redrawGraticule()
    });
    map.on("postrender", function() {});
    for (key in a) {
        n = a[key];
        c = n.get("name");
        if (-1 != c.indexOf("LayerDMSP") || -1 != c.indexOf("LayerVIIRS") || -1 != c.indexOf("LayerWA")) a[key].on("change:visible", function(a) {
            setLegend();
            p();
            redrawGraticule();
            a = a.target;
            if (a.getVisible()) {
                var b =
                    getLayerByName("layerMeasureArea");
                if ("undefined" != typeof b) {
                    var c = b.getSource().getFeatures();
                    if (0 < c.length) {
                        var b = new ol.Sphere(6378137),
                            e = c[0].getGeometry(),
                            c = map.getView().getProjection();
                        if ("Circle" == e.getType()) var d = e.clone().transform(c, "EPSG:4326"),
                            e = d.getRadius(),
                            d = d.getCenter(),
                            e = b.haversineDistance(d, [d[0] + e, d[1]]),
                            e = ol.geom.Polygon.circular(b, d, e, 32).transform("EPSG:4326", c);
                        var c = e.clone().transform(c, "EPSG:4326"),
                            e = c.getLinearRing(0).getCoordinates(),
                            g = Math.abs(b.geodesicArea(e)) / 1E3 /
                            1E3,
                            b = (new ol.format.WKT).writeGeometry(c),
                            k = new XMLHttpRequest;
                        visibleRadiance = a.get("name").replace("LayerVIIRS", "viirs_").replace("LayerDMSP", "dmps_").replace("LayerWA", "wa_");
                        a = "/QueryRaster/?qk=" + obf() + "&ql=" + visibleRadiance + "&qt=area&qd=" + b.replace("POLYGON(", "LINESTRING").replace("))", ")");
                        k.open("GET", a, !0);
                        k.send();
                        document.getElementById("map").style.cursor = "wait";
                        k.onreadystatechange = function(a, b) {
                            return function() {
                                if (4 == k.readyState && 200 == k.status) {
                                    document.getElementById("map").style.cursor =
                                        "default";
                                    var a;
                                    a = 1E3 < g ? g.toFixed(0) + " km<span style='vertical-align: super;font-size: 11px;font-weight: bold;'>2</span>" : g.toFixed(2) + " km<span style='vertical-align: super;font-size: 11px;font-weight: bold;'>2</span>";
                                    var c = window.location.href.split("/"),
                                        c = c[0] + "//" + c[2] + b,
                                        e = k.responseText.split(","),
                                        d = "Radiance",
                                        m = "* 10^-9 W/cm^2 * sr";
                                    "dmps_2010" == visibleRadiance && (m = "Visible band digital number");
                                    var f, h, l, t;
                                    f = parseFloat(e[2]).toFixed(4);
                                    h = parseFloat(e[3]).toFixed(4);
                                    l = parseFloat(e[4]).toFixed(4);
                                    t = parseFloat(e[5]).toFixed(4); - 1 < visibleRadiance.indexOf("wa_") && (m = "Predicted zenith sky brightness. Units: mag./arc sec^2 (MPSAS)", d = "Zenith sky brightness", f = (Math.log10((parseFloat(e[2]) + .171168465) / 108E6) / -.4).toFixed(2), h = (Math.log10((parseFloat(e[3]) + .171168465) / 108E6) / -.4).toFixed(2), l = (Math.log10((parseFloat(e[4]) + .171168465) / 108E6) / -.4).toFixed(2), t = (Math.log10((parseFloat(e[5]) + .171168465) / 108E6) / -.4).toFixed(2));
                                    var n = getLPColorCode(visibleRadiance, f);
                                    innerHTML = "<div style='font-family:Arial;font-weight:bold;overflow:hidden;white-space:nowrap;line-height:1.2em;'>" +
                                        d + " statistics (" + $("#overlaySelect").val().replace("VIIRS", "").replace("WA", "") + ")</div>";
                                    innerHTML += "<div class='tableContainer'>";
                                    innerHTML += "<div class='tableRow'><div class='tableCell'><span title='Number of pixels completely inside the drawn polygon' style='cursor:help;'>Pixel count</span></div><div class='tableCellValues'>" + e[0] + "</div></div>"; - 1 == visibleRadiance.indexOf("wa_") && (innerHTML += "<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Sum of pixel values completely inside the drawn polygon. Units: " +
                                        m + "' style='cursor:help;'>Sum</span></div><div class='tableCellValues' style='font-size: 110%;'>" + Math.round(100 * parseFloat(+e[1]).toFixed(2)) / 100 + "</div></div>");
                                    innerHTML += "<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Polygon area' style='cursor:help;'>Area</span></div><div class='tableCellValues' style='font-size: 110%;'>" + a + "</div></div>";
                                    innerHTML = -1 == visibleRadiance.indexOf("wa_") ? innerHTML + ("<div class='tableRow'><div class='tableCell'><span title='Mean of pixel values completely inside the drawn polygon. Units: " +
                                        m + "' style='cursor:help;'>Mean</span></div><div class='tableCellValues'><div style='float:left;'>" + f + "</div><div style='height: 1em;width: 1em;float: left;border-radius: 0.1em;margin-left: 0.5em;background-color:" + n + ";'></div></div></div>") : innerHTML + ("<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Mean of pixel values completely inside the drawn polygon. Units: " + m + "' style='cursor:help;'>Mean</span></div><div class='tableCellValues'><div style='float:left;font-size:110%;'>" +
                                        f + "</div></div></div>");
                                    innerHTML += "<div class='tableRow'><div class='tableCell'><span title='Standard deviation of pixel values completely inside the drawn polygon. Units: " + m + "' style='cursor:help;'>Std. dev.</span></div><div class='tableCellValues'>" + h + "</div></div>";
                                    innerHTML += "<div class='tableRow'><div class='tableCell'><span title='Minimum of pixel values completely inside the drawn polygon. Units: " + m + "' style='cursor:help;'>Minimum</span></div><div class='tableCellValues'>" + l + "</div></div>";
                                    innerHTML += "<div class='tableRow'><div class='tableCell'><span title='Maximum of pixel values completely inside the drawn polygon. Units: " + m + "' style='cursor:help;'>Maximum</span></div><div class='tableCellValues'>" + t + "</div></div>";
                                    innerHTML += "</div>"; - 1 == visibleRadiance.indexOf("wa_") && (innerHTML += "<div><div class='areaExportButton' style='float:left;width: 8em;height: 2em;font-size: 0.8em;padding-top: 0.55em;padding-left: 0.8em;border-radius: 4px;;' title='Export area to raw GeoTIFF<br/>Use GIS software to view' onclick='window.location=\"" +
                                        c.replace("&qt=area&", "&qt=raster&") + "\";'>Raw GeoTIFF</div>");
                                    isNaN(e[0]) && setTimeout(function() {
                                        window.location.reload()
                                    }, 3E3);
                                    $(".ol-popup-content").html(innerHTML)
                                }
                            }
                        }(a, a)
                    }
                }
            }
        });
        if (-1 != c.indexOf("LayerSQM")) a[key].on("change:visible", function() {
            setLegend();
            p()
        });
        if (-1 != c.indexOf("LayerObs")) a[key].on("change:visible", function() {
            setLegend();
            p()
        });
        if (-1 != c.indexOf("LayerBing")) a[key].on("change:visible", function() {
            p()
        })
    }
    map.on("pointermove", function(a) {
        a = ol.proj.transform(a.coordinate, "EPSG:3857",
            "EPSG:4326");
        a = formatDegMinSec(a, c_mode);
        document.getElementById("coordinates").innerHTML = "" + a[0] + " " + a[1]
    });
    document.getElementById("coordinates").addEventListener("click", toggleCoorDisplayType, !1);
    var q = new ol.Geolocation({
        name: "ctrlGeolocation",
        projection: "EPSG:3857"
    });
    q.once("change:accuracyGeometry", function() {
        flyTo(q.getPosition(), 10)
    });
    c = new ol.layer.Vector({
        name: "layerGeolocation",
        source: new ol.source.Vector({
            features: []
        })
    });
    map.addLayer(c);
    q.on("change", function(a) {
        document.getElementById("geolocateButton").style.backgroundImage =
            "url(/img/geolocate_on2.png)";
        a = q.getPosition();
        $("#geolocationIcon").remove();
        clearOverlays("geolocationIcon");
        navigator.userAgent.match(/Trident.*rv\:11\./) ? $("body").append('<div id="geolocationIcon" style="height:45px;width:59px;margin-left:38px;margin-top:-27px;background-image:url(/img/location_pin_red_shadow.png);"></div>') : $("body").append('<div id="geolocationIcon"><svg width="100px" height="100px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 14 14"><circle fill="none" cx="7" cy="7" r="1.2"  style="stroke: #4692dd; stroke-width: 0.3;" stroke-opacity="1.0"><animate attributeName="r" attributeType="XML"from="1.2"  to="5"begin="0s" dur="2s"fill="freeze" repeatCount="indefinite"/><animate attributeName="stroke-opacity" attributeType="XML"from="0.9"  to="0"begin="0s" dur="2s"fill="freeze" repeatCount="indefinite"/></circle><circle fill="#ffffff" cx="7" cy="7" r="1.2"/><circle fill="#bcdeff" cx="7" cy="7" r="1.1"/><circle fill="#4692dd" cx="7" cy="7" r="0.9"></circle></svg></div>');
        var b = new ol.Overlay({
            map: map,
            id: "geolocationIcon",
            element: document.getElementById("geolocationIcon"),
            positioning: "center-center",
            stopEvent: !1
        });
        b.setPosition(a);
        map.addOverlay(b);
        map.render()
    });
    q.on("error", function(a) {
        alert(a.message)
    });
    document.getElementById("geolocateButton").addEventListener("click", function() {
        q.getTracking() ? (document.getElementById("geolocateButton").style.backgroundImage = "url('/img/geolocate_off2.png')", q.setTracking(!1), $("#geolocationIcon").remove(), clearOverlays("geolocationIcon"),
            map.render()) : (document.getElementById("geolocateButton").style.backgroundImage = "url('/img/geolocate_anim_32.gif')", q.setTracking(!0), "undefined" != typeof q.getPosition() && flyTo(q.getPosition(), 10))
    });
    document.getElementById("addMarkerButton").addEventListener("click", function() {
        removeInteractions();
        "AddMarker" == activeControl ? (activeControl = "", map.on("click", defaultInfo), document.getElementById("addMarkerButton").style.backgroundImage = "url(/img/addMarkerButton_off.png)") : (activeControl = "AddMarker",
            map.on("click", addMarker), document.getElementById("addMarkerButton").style.backgroundImage = "url(/img/addMarkerButton_on.png)")
    });
    c = new ol.layer.Vector({
        name: "layerMarkers",
        source: new ol.source.Vector({
            features: []
        })
    });
    map.addLayer(c);
    document.getElementById("rulerButton").addEventListener("click", function() {
        removeInteractions();
        "Measure" == activeControl ? (activeControl = "", map.on("click", defaultInfo), document.getElementById("rulerButton").style.backgroundImage = "url(/img/ruler_off.png)") : (activeControl =
            "Measure", measureCtrl(), document.getElementById("rulerButton").style.backgroundImage = "url(/img/ruler_on.png)")
    });
    document.getElementById("areaInfoButton").addEventListener("click", function() {
        removeInteractions();
        "RadianceAreaInfo" == activeControl ? (activeControl = "", map.on("click", defaultInfo), document.getElementById("areaInfoButton").style.backgroundImage = "url(/img/area_info_off.png)") : (activeControl = "RadianceAreaInfo", radianceAreaInfo(), document.getElementById("areaInfoButton").style.backgroundImage =
            "url(/img/area_info_on.png)");
        redrawGraticule()
    });
    document.getElementById("areaInfoButton2").addEventListener("click", function() {
        removeInteractions();
        "RadianceAreaInfo2" == activeControl ? (activeControl = "", map.on("click", defaultInfo), document.getElementById("areaInfoButton2").style.backgroundImage = "url(/img/area_info2_off.png)") : (activeControl = "RadianceAreaInfo2", radianceAreaInfo2(), document.getElementById("areaInfoButton2").style.backgroundImage = "url(/img/area_info2_on.png)");
        redrawGraticule()
    });
    document.getElementById("extendedToolbarButton").addEventListener("click",
        function() {
            0 < $(this).css("background-image").indexOf("off") ? (document.getElementById("extendedToolbarButton").style.backgroundImage = "url(/img/tools_on.png)", document.getElementById("extendedToolbar").style.display = "block") : (document.getElementById("extendedToolbarButton").style.backgroundImage = "url(/img/tools_off.png)", document.getElementById("extendedToolbar").style.display = "none", removeInteractions(), activeControl = "", map.on("click", defaultInfo))
        });
    document.getElementById("pointInfoButton").addEventListener("click",
        function() {
            removeInteractions();
            "RadiancePointInfo" == activeControl ? (activeControl = "", map.on("click", defaultInfo), document.getElementById("map").style.cursor = "default", document.getElementById("pointInfoButton").style.backgroundImage = "url(/img/point_info_off.png)") : (activeControl = "RadiancePointInfo", map.on("click", radiancePointInfo), document.getElementById("map").style.cursor = "crosshair", document.getElementById("pointInfoButton").style.backgroundImage = "url(/img/point_info_on.png)");
            redrawGraticule()
        });
    document.getElementById("addSQMButton").addEventListener("click", function() {
        removeInteractions();
        "addSQM" == activeControl ? (activeControl = "", map.on("click", defaultInfo), document.getElementById("map").style.cursor = "default", document.getElementById("addSQMButton").style.backgroundImage = "url(/img/addSQM_off.png)") : (0 > $("#overlaySelect").val().indexOf("SQM") && $("#featureSelect").val("SQM").trigger("change"), activeControl = "addSQM", map.on("click", addSQM), document.getElementById("map").style.cursor = "crosshair",
            document.getElementById("addSQMButton").style.backgroundImage = "url(/img/addSQM_on.png)")
    });
    $("#printButton").click(function() {
        "function" == typeof html2canvas ? b() : jQuery.ajax({
            url: "/lib/html2canvas.js",
            dataType: "script",
            cache: !0
        }).done(function() {
            b()
        })
    });
    $("#dialog").jqm({
        onShow: function(a) {
            600 > window.innerWidth && (a.w[0].style.width = window.innerWidth - 100 + "px", a.w[0].style.marginLeft = 0 - (window.innerWidth - 100) / 2 + "px");
            a.o.prependTo("body");
            a.w.css("opacity", .88).fadeIn()
        },
        onHide: function(a) {
            a.w.fadeOut("2000",
                function() {
                    a.o.remove()
                })
        }
    });
    "true" != GetHashString("min") && (c = Cookies.get("lpinfo"), "undefined" == typeof c ? $("#dialog").jqmShow() : (c = JSON.parse(c), c[0] ? ($("#dialog").jqmShow(), $("#splashCheckbox").prop("checked", !1)) : $("#splashCheckbox").prop("checked", !0)));
    $(window).resize(function() {
        var a = $("#map").innerWidth(),
            b = $("#RightMenu").innerWidth(),
            c = $("#searchCont").innerWidth();
        320 > a - 107 - b ? $("#searchCont").css("width", a - 107 - b) : 320 > c && $("#searchCont").css("width", 320)
    });
    $(window).trigger("resize");
    $("#searchBox").autocomplete({
        source: function(a,
            b) {
            $.ajax({
                url: "https://dev.virtualearth.net/REST/v1/Locations",
                dataType: "jsonp",
                data: {
                    key: bingKey,
                    q: a.term
                },
                jsonp: "jsonp",
                success: function(a) {
                    (a = a.resourceSets[0]) && 0 < a.estimatedTotal && b($.map(a.resources, function(a) {
                        return {
                            data: a,
                            label: a.name + " (" + a.address.countryRegion + ")",
                            value: a.name
                        }
                    }))
                }
            })
        },
        minLength: 4,
        delay: 750,
        change: function(a, b) {
            b.item && "" != $("#searchBox").val() || ($("#searchBox").val(""), clearVectorLayer("layerGeolocation"))
        },
        select: function(a, b) {
            zoomToSearchResult(b.item.data, 10);
            document.getElementById("geolocateButton").style.backgroundImage =
                "url('/img/geolocate_off2.png')";
            q.setTracking(!1);
            $("#geolocationIcon").remove();
            clearOverlays("geolocationIcon")
        }
    });
    d = new ol.Attribution({
        html: '<br/><div style="font-family:Arial;text-decoration: underline;cursor:pointer;font-size:1.5em;" onclick="$(\'#dialog\').jqmShow();">Show splash window</div><div>Jurij Stare, <a href="https://www.lightpollutionmap.info">www.lightpollutionmap.info</a><div>VIIRS <a href="https://ngdc.noaa.gov/eog/" target="_blank">Earth Observation Group, NOAA National Geophysical Data Center</a>'
    });
    m = new ol.Attribution({
        html: '<br/><div style="font-family:Arial;text-decoration: underline;cursor:pointer;font-size:1.5em;" onclick="$(\'#dialog\').jqmShow();">Show splash window</div><div>Jurij Stare, <a href="https://www.lightpollutionmap.info">www.lightpollutionmap.info</a><div>World Atlas 2015 - Falchi, Fabio; Cinzano, Pierantonio; Duriscoe, Dan; Kyba, Christopher C. M.; Elvidge, Christopher D.; Baugh, Kimberly; Portnov, Boris; Rybnikova, Nataliya A.; Furgoni, Riccardo (2016): Supplement to: The New World Atlas of Artificial Night Sky Brightness. GFZ Data Services. <a href="http://doi.org/10.5880/GFZ.1.4.2016.001">http://doi.org/10.5880/GFZ.1.4.2016.001</a>; Falchi F, Cinzano P, Duriscoe D, Kyba CC, Elvidge CD, Baugh K, Portnov BA, Rybnikova NA, Furgoni R. The new world atlas of artificial night sky brightness. Science Advances. 2016 Jun 1;2(6):e1600377.'
    });
    for (c = 0; c < overlayList.length; c++) - 1 == overlayList[c].indexOf("WA") ? getLayerByName("Layer" + overlayList[c].replace("_", "")).getSource().setAttributions(d) : getLayerByName("Layer" + overlayList[c].replace("_", "")).getSource().setAttributions(m);
    $("#unlck").click(function() {
        var a = getLayerByName("LayerObs"),
            b = "_";
        0 < a.getSource().getParams().LAYERS.indexOf("s_") ? (b = "", $("#ObsToolsLabel").html("")) : $("#ObsToolsLabel").html("(h. acc)");
        b = new ol.source.ImageWMS({
            url: "/geoserver/PostGIS/wms",
            params: {
                LAYERS: "PostGIS:lp_observatories" +
                    b,
                SRS: "EPSG:3857",
                CQL_FILTER: layerObsFilter
            },
            serverType: "geoserver"
        });
        a.setSource(b);
        populateObsAutocomplete()
    });
    $("#overlaySelect").change(function() {
        var a = getLayerByName("Layer" + this.value);
        a.setOpacity($("#overlay_tran_slider").slider("value") / 100);
        a.setVisible(!0);
        "" != $("#overlaySelect").attr("previousValue") && (a = getLayerByName("Layer" + $("#overlaySelect").attr("previousValue")), $("#overlaySelect").attr("previousValue") != this.value && a.setVisible(!1));
        $("#overlaySelect").attr("previousValue", this.value)
    });
    $(function() {
        $("#featureSelect").multiselect({
            header: !1,
            buttonWidth: 145,
            buttonHeight: 22,
            noneSelectedText: "None selected",
            selectedList: 5,
            selectedListSeparator: " + "
        });
        $("#overlaySelect").multiselect({
            header: !1,
            buttonWidth: 145,
            buttonHeight: 22,
            selectedList: 1
        })
    });
    $("#featureSelect").change(function() {
        var a = $("#featureSelect").val();
        if (0 < a.length) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b],
                    e = ""; - 1 < c.indexOf("SQ") && (e = "SQM"); - 1 < c.indexOf("Obs") && (e = "Obs");
                c = getLayerByName("Layer" + e);
                null != c && (c.setOpacity($("#feature_tran_slider").slider("value") /
                    100), -1 < e.indexOf("SQ") && (c = getLayerByName("LayerSQM")), c.setVisible(!0))
            }
            a = a.join(" ");
            0 > a.indexOf("Obs") && (b = getLayerByName("LayerObs"), b.setVisible(!1));
            0 > a.indexOf("SQ") && setTimeout(function() {
                getLayerByName("LayerSQM").setVisible(!1)
            }, 900)
        } else b = getLayerByName("LayerObs"), getLayerByName("LayerSQM"), b.setVisible(!1), setTimeout(function() {
            getLayerByName("LayerSQM").setVisible(!1)
        }, 900);
        updateSQMLayer();
        p();
        setLegend()
    });
    document.getElementById("splashCheckbox").addEventListener("click", function() {
        var a =
            Cookies.get("lpinfo");
        $(this).is(":checked") ? "undefined" == typeof a ? a = [!1] : (a = JSON.parse(a), a[0] = !1) : "undefined" == typeof a ? a = [!0] : (a = JSON.parse(a), a[0] = !0);
        Cookies.set("lpinfo", a, {
            expires: 3E3,
            secure: !0
        })
    });
    "2" == GetHashString("SQM") ? (c = {
        pixel: [100, 100]
    }, c.coordinate = map.getView().getCenter(), addMarker(c), minDate = $("#SQMStartDate").val("2000-01"), $("#featureSelect").val("SQC").trigger("change")) : "3" == GetHashString("SQM") && "" != GetHashString("ID") && (c = [parseFloat(GetHashString("lon")), parseFloat(GetHashString("lat"))],
        c = ol.proj.transform(c, "EPSG:900913", "EPSG:4326"), openSQMLE(GetHashString("ID"), c));
    map.on("pointermove", mapSQMPointer);
    $.adblockDetector.detect().done(function(a) {
        var b = "0";
        a ? b = "0" : (b = "1", adblocker = !0, $("#adContainer").hide(0), window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "100%"), a = [$("#map").width(), $("#map").height()], map.setSize(a));
        $.ajax({
            type: "GET",
            url: "/astat/default.ashx?p=" + b,
            success: function(a) {}
        });
        setTimeout(function() {
                try {
                    adsbygoogle.loaded ||
                        "undefined" != typeof Cookies.get("lpads") || ($("body").append("<div class='jqmWindow jqm-init' id='adblock_msg' style='font-family: Arial;font-size: 13px;z-index: 3000;opacity: 0.88;display: block;text-align: center;'><span style='     font-size: 200%; '>Adblock detected!</span><br/><br/><br/>It seems you are using an ad block software to block ads on this website.<br/><br/>If you enjoy this websites' content, please consider whitelisting it to help me with the cost of running it or donate via <a href='https://www.lightpollutionmap.info/help.html#Support' target='_blank'>Paypal</a>.<br/><br/><br/><div class='jqmClose' style='     display: inline-block;     width: 260px;     background-color: #a5ff81;     padding: 7px; cursor: pointer;'>Yes, I will turn off Adblock for this website</div><br><div id='AdsNoThanks' class='jqmClose' style='     display: inline-block;     width: 260px;     background-color: #ffffff;     padding: 7px; cursor: pointer;'>No, thanks and don't bother me again</div></div>"),
                            $("#AdsNoThanks").click(function() {
                                Cookies.set("lpads", [!0], {
                                    expires: 3E3,
                                    secure: !0
                                })
                            }), $("#adblock_msg").jqm({
                                modal: !0,
                                onShow: function(a) {
                                    $("#dialog").jqmHide();
                                    500 > window.innerWidth && (a.w[0].style.width = window.innerWidth - 50 + "px", a.w[0].style.marginLeft = 0 - (window.innerWidth - 50) / 2 + "px");
                                    a.o.prependTo("body");
                                    a.w.css("opacity", .88).fadeIn()
                                },
                                onHide: function(a) {
                                    a.w.fadeOut("2000", function() {
                                        a.o.remove()
                                    })
                                }
                            }), $("#adblock_msg").css("width", "500px"), $("#adblock_msg").css("margin-left", "-250px"), $("#adblock_msg").jqmShow())
                } catch (u) {}
            },
            1E4)
    });
    setTimeout(function() {
        adResizeMap()
    }, 1E3)
}

function adResizeMap() {
    var b = $("#adContainer").height(),
        a = $("#map").height(),
        a = b / a;.25 < a && (window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "calc(100% - " + b + "px)"), b = [$("#map").width(), $("#map").height()], map.setSize(b), $("#adContainer").append("<div id='adCloseBox' style='position: absolute;top: -18px;left: 0px;background-color: red;color: white;font-family: Arial;padding: 1px 5px;'>Hide advertisement</div>"), $("#adCloseBox").click(function() {
        $(this).parent().hide(0);
        window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "100%");
        var a = [$("#map").width(), $("#map").height()];
        map.setSize(a)
    }));
    adblocker || (b = $("#adContainer").height(), .15 > a ? ($(".ol-attribution").css("bottom", "135px"), $(".ol-scale-line").css("bottom", "100px")) : window.top == window.self && ($(".ol-attribution").css("bottom", "3.0em"), $(".ol-scale-line").css("bottom", "1.1em"), 500 > $("#map").width() && ($(".ol-attribution").css("bottom", b + 35 + "px"), $(".ol-scale-line").css("bottom",
        b + "px"))))
}

function populateObsAutocomplete() {
    var b = getLayerByName("LayerObs").getSource().getParams();
    $.ajax({
        type: "GET",
        url: "/geoserver/PostGIS/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=" + encodeURIComponent(b.LAYERS) + "&propertyName=name%2Clat%2Clon%2Cmpc_code&outputFormat=application%2Fjson&rnd=" + Math.random(),
        success: function(a) {
            a = a.features;
            for (var b = [], d = 0; d < a.length; d++) {
                var e = {};
                e.value = a[d].properties.name;
                e.label = a[d].properties.name;
                e.lat = a[d].properties.lat;
                e.lon = a[d].properties.lon;
                b.push(e)
            }
            b.sort(function(a,
                b) {
                return a.label > b.label ? 1 : b.label > a.label ? -1 : 0
            });
            $("#ObsName").autocomplete({
                minLength: 3,
                delay: 500,
                source: function(a, c) {
                    var e = $.ui.autocomplete.filter(b, a.term);
                    c(e.slice(0, 30))
                },
                position: {
                    my: "left top",
                    at: "left bottom",
                    offset: "120 0"
                },
                select: function(a, b) {
                    var c = {
                        point: {}
                    };
                    c.point.coordinates = [b.item.lat, b.item.lon];
                    zoomToSearchResult(c, 15)
                },
                sortResults: !0
            });
            for (var f = [], d = 0; d < a.length; d++) e = {}, e.value = a[d].properties.mpc_code, e.label = a[d].properties.mpc_code, e.lat = a[d].properties.lat, e.lon = a[d].properties.lon,
                f.push(e);
            f.sort(function(a, b) {
                return a.label > b.label ? 1 : b.label > a.label ? -1 : 0
            });
            $("#ObsMPCCode").autocomplete({
                minLength: 1,
                delay: 500,
                source: f,
                position: {
                    my: "left top",
                    at: "left bottom",
                    offset: "120 0"
                },
                select: function(a, b) {
                    var c = {
                        point: {}
                    };
                    c.point.coordinates = [b.item.lat, b.item.lon];
                    zoomToSearchResult(c, 15)
                },
                sortResults: !0
            });
            $("#ObsName").autocomplete("enable");
            $("#ObsMPCCode").autocomplete("enable");
            $("#ObsName").attr("autocomp", "on")
        }
    })
}

function launchIntoFullscreen(b) {
    b.requestFullscreen ? b.requestFullscreen() : b.mozRequestFullScreen ? b.mozRequestFullScreen() : b.webkitRequestFullscreen ? b.webkitRequestFullscreen() : b.msRequestFullscreen && b.msRequestFullscreen()
}

function resizeElements() {
    var b = document.getElementById("RightMenu"),
        a = $("#SQMToolsCont [type='text']").is(":focus");
    if (1 == rightMenuVis && !a) try {
        for (var c = b.clientHeight, d = $(".cd-accordion-menu")[0].childElementCount; window.innerHeight < c && 115 < c;) document.getElementById("group-" + d).checked = !1, c = b.clientHeight, --d
    } catch (e) {}
    242 > $("#map").innerHeight() ? $(".ol-attribution").css({
        right: "",
        left: "5.1em"
    }) : $(".ol-attribution").css({
        right: "",
        left: "0.5em"
    });
    0 == adblocker && (750 > $("#map").innerHeight() ? (window.top !==
        window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "100%"), b = [$("#map").width(), $("#map").height()], map.setSize(b)) : 1 == rightMenuVis && (window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "100%")))
}

function toggleRightMenu(b) {
    "toggle" == b ? 0 == rightMenuVis ? (rightMenuVis = !0, $("#socialButtons").fadeOut("slow", function() {
            300 < $("#map").innerHeight() - 40 && $(".resp-sharing-button__link").css("margin-top", "0.5em");
            document.getElementById("RightMenu").style.width = "260px";
            document.getElementById("socialButtons").style.width = "260px";
            document.getElementById("socialButtons").style.left = "0px";
            document.getElementById("socialButtons").style.top = "0px";
            document.getElementById("socialButtons").style.display = "block"
        }),
        $("#rightMenuButton").stop().animate({
            width: 22
        }, 500), $("#rightMenuButtonCont").stop().animate({
            right: -3,
            top: -3,
            width: 28,
            height: 28
        }, 500, function() {
            $("#RightMenu").stop().animate({
                top: 0
            }, 500, function() {
                $(window).trigger("resize");
                window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "100%");
                var a = [$("#map").width(), $("#map").height()];
                map.setSize(a)
            })
        })) : (750 < $("#map").innerHeight() && (window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height",
        "100%"), b = [$("#map").width(), $("#map").height()], map.setSize(b)), $("#RightMenu").stop().animate({
        top: 0 - $("#RightMenu").innerHeight()
    }, 500, function() {
        $("#rightMenuButton").stop().animate({
            width: 32,
            height: 32
        });
        rightMenuVis = !1;
        $("#rightMenuButtonCont").stop().animate({
            right: 8,
            top: 8,
            width: 38,
            height: 38
        }, 500, function() {
            document.getElementById("RightMenu").style.width = "40px";
            document.getElementById("socialButtons").style.display = "none";
            document.getElementById("socialButtons").style.width = "40px";
            document.getElementById("socialButtons").style.left =
                "-6px";
            document.getElementById("socialButtons").style.top = "90px";
            $(".resp-sharing-button__link").css("margin-top", "0.1em");
            $("#socialButtons").fadeIn("slow");
            $(window).trigger("resize")
        })
    })) : "min" == b && (750 < $("#map").innerHeight() && (window.top !== window.self ? $("#map").css("height", "calc(100% - 2.4em)") : $("#map").css("height", "100%"), b = [$("#map").width(), $("#map").height()], map.setSize(b)), $("#RightMenu").stop().animate({
        top: 0 - $("#RightMenu").innerHeight()
    }, 0, function() {
        rightMenuVis = !1;
        $("#rightMenuButton").stop().animate({
            width: 32,
            height: 32
        });
        $("#rightMenuButtonCont").stop().animate({
            right: 8,
            top: 8,
            width: 38,
            height: 38
        }, 0, function() {
            document.getElementById("RightMenu").style.width = "40px";
            document.getElementById("socialButtons").style.display = "none";
            document.getElementById("socialButtons").style.width = "40px";
            document.getElementById("socialButtons").style.left = "-6px";
            document.getElementById("socialButtons").style.top = "90px";
            $(".resp-sharing-button__link").css("margin-top", "0.1em");
            $("#socialButtons").fadeIn("slow");
            $(window).trigger("resize")
        })
    }))
}

function updateSocialButtonsURL() {
    var b = "https%3A%2F%2Fwww.lightpollutionmap.info%2F" + encodeURIComponent(window.location.hash),
        a = $(".resp-sharing-button__link");
    a[0].href = "https://facebook.com/sharer/sharer.php?u=" + b;
    a[1].href = "https://twitter.com/intent/tweet/?text=Interactive%20Light%20Pollution%20Map.&amp;url=" + b;
    a[2].href = "https://reddit.com/submit/?url=" + b + "&resubmit=true&title=Interactive%20Light%20Pollution%20Map.";
    a[3].href = "https://www.tumblr.com/share/link?url=" + b;
    a[4].href = "https://pinterest.com/pin/create/button/?url=" +
        b + "&amp;media=" + b + "&amp;summary=Interactive%20Light%20Pollution%20Map.";
    a[5].href = "https://www.linkedin.com/cws/share?url=" + b
}

function getLayerByName(b) {
    var a = map.getLayers().getArray(),
        c;
    for (key in a)
        if (a[key].get("name") == b) {
            c = a[key];
            break
        }
    return c
}

function getInteractionByType(b) {
    var a = map.getInteractions().getArray(),
        c;
    for (key in a)
        if (a[key] instanceof b) {
            c = a[key];
            break
        }
    return c
}

function updateLayerSwitcher() {
    var b = map.getLayers().getArray();
    for (key in b) {
        var a = b[key],
            c = a.get("name"); - 1 == c.indexOf("LayerWA") && -1 == c.indexOf("LayerVIIRS") || 1 != a.getVisible() || $("#overlaySelect").val(c.replace("Layer", "")); - 1 != c.indexOf("LayerObs") && 1 == a.getVisible() && $("#featureSelect").val(c.replace("Layer", "")); - 1 != c.indexOf("LayerBing") && (1 == a.getVisible() ? document.getElementById(c).checked = !0 : document.getElementById(c).checked = !1)
    }
}

function toggleFeatureOptions() {
    $("#ObsToolsCont").is(":visible");
    $("#SQMToolsCont").is(":visible");
    var b = $("#featureSelect").val().join(" "),
        a = $("#optionsIcon").attr("state");
    "off" == a ? ($("#featureSettings").slideDown(function() {
        $("#optionsIcon").attr("state", "on")
    }), $("#optionsIcon").css("filter", "drop-shadow(1px 1px 1px rgba(0,0,0,0.7))")) : "on" == a && ($("#featureSettings").slideUp(function() {
        $("#optionsIcon").attr("state", "off")
    }), $("#optionsIcon").css("filter", "drop-shadow(1px 1px 1px rgba(0,0,0,0.1))")); - 1 < b.indexOf("SQ") ? $("#SQMToolsCont").show() : $("#SQMToolsCont").hide(); - 1 < b.indexOf("Obs") ? ("off" == $("#ObsName").attr("autocomp") && populateObsAutocomplete(), $("#ObsToolsCont").show()) : $("#ObsToolsCont").hide()
}

function toggleBaseMap(b) {
    1 == document.getElementById("LayerBingRoad").checked ? (getLayerByName("LayerBingRoad").setVisible(!0), getLayerByName("LayerBingHybrid").setVisible(!1)) : (getLayerByName("LayerBingRoad").setVisible(!1), getLayerByName("LayerBingHybrid").setVisible(!0))
}

function setLegend() {
    document.getElementById("map").style.cursor = "default";
    var b = map.getLayers().getArray();
    for (key in b) {
        var a = b[key],
            c = a.get("name");
        if (-1 != c.indexOf("LayerVIIRS") && 1 == a.getVisible()) visibleRadiance = c.replace("LayerVIIRS", "viirs_");
        else if (-1 != c.indexOf("LayerWA") && 1 == a.getVisible()) visibleRadiance = c.replace("LayerWA", "wa_");
        else if (-1 != c.indexOf("LayerSQM") && (1 == a.getVisible() ? (map.on("click", SQMPointInfo), $("#SQMToolsCont").show()) : (map.un("click", SQMPointInfo), map.un("click",
                addSQM), $("#SQMToolsCont").hide())), -1 != c.indexOf("LayerObs"))
            if (1 == a.getVisible()) getLayerByName("LayerSQM").getVisible() && map.un("click", SQMPointInfo), map.on("click", ObsPointInfo), $("#ObsToolsCont").show();
            else {
                map.un("click", ObsPointInfo);
                if (getLayerByName("LayerSQM").getVisible()) map.on("click", SQMPointInfo);
                $("#ObsToolsCont").hide()
            }
    }
    a = $("#overlaySelect").val();
    b = $("#featureSelect").val(); - 1 < a.indexOf("VIIRS") ? $("#legend_overlay").attr("src", "img/Legend_VIIRS.png") : -1 < a.indexOf("WA") && $("#legend_overlay").attr("src",
        "img/Legend_WA2015.png");
    $("#legend_feature").empty();
    for (a = 0; a < b.length; a++) $("#legend_feature").append("<img id='legend_feature_" + b[a] + "' src='img/Legend_" + b[a] + ".png' />")
}

function toggleCoorDisplayType(b) {
    var a = document.getElementById("coordinates").innerHTML;
    c_mode = 0;
    c_mode = 0 == a.indexOf(" ") ? 1 : 0;
    void 0 != b && (b = map.getCoordinateFromPixel([b.clientX, b.clientY]), b = ol.proj.transform(b, "EPSG:3857", "EPSG:4326"), b = formatDegMinSec(b, c_mode), document.getElementById("coordinates").innerHTML = "" + b[0] + " " + b[1])
}

function addLeadingZero(b) {
    b = b.toString().split(".");
    for (var a = 0; a < b.length; a++) 1 == b[a].length && (b[a] = "0" + b[a]);
    return 1 == b.length ? b[0] : b[0] + "." + b[1].substring(1, 2)
}

function formatDegMinSec(b, a) {
    var c, d;
    if (180 < Math.abs(b[0]))
        if (0 < b[0])
            for (; 180 < b[0];) b[0] -= 360;
        else
            for (; - 180 > b[0];) b[0] += 360;
    c = 0 <= b[0] ? "E" : "W";
    d = 0 <= b[1] ? "N" : "S";
    var e = [Math.abs(b[0]), Math.abs(b[1])];
    output = [];
    if (1 == a)
        for (var f = 0; 2 > f; f++) {
            var k, g, m;
            val = e[f];
            k = Math.floor(val);
            g = Math.floor(60 * (val - k));
            m = (3600 * (val - k - g / 60)).toFixed(1);
            output[f] = k + "&#176; " + addLeadingZero(g) + "' " + addLeadingZero(m);
            output[f] = 0 == f ? output[f] + (" " + c) : output[f] + (" " + d)
        } else output = [" " + b[0].toFixed(5), b[1].toFixed(5)];
    return output
}

function GetHashString(b) {
    b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    b = (new RegExp("[\\#&]" + b + "=([^&#]*)")).exec(window.location.hash);
    return null == b ? "" : decodeURIComponent(b[1].replace(/\+/g, " "))
}

function measureCtrl() {
    function b() {
        e && e.parentNode.removeChild(e);
        e = document.createElement("div");
        e.className = "tooltip tooltip-measure";
        f = new ol.Overlay({
            id: "Measure",
            element: e,
            offset: [0, -15],
            positioning: "bottom-center"
        });
        map.addOverlay(f)
    }
    var a = new ol.source.Vector,
        c = new ol.layer.Vector({
            name: "layerMeasureLength",
            source: a,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(255, 0, 0, 1.0)"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(255, 0, 0, 1.0)",
                    lineDash: [10, 10],
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: "#ffcc33"
                    })
                })
            })
        }),
        d, e, f;
    "undefined" != typeof getLayerByName("layerMeasureLength") && map.removeLayer(getLayerByName("layerMeasureLength"));
    map.addLayer(c);
    map.on("pointermove", function(a) {
        a.dragging || d && d.getGeometry()
    });
    (function() {
        draw = new ol.interaction.Draw({
            source: a,
            type: "LineString",
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(255, 255, 255, 0.0)"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(255, 0, 0, 1.0)",
                    lineDash: [10, 10],
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: "rgba(255, 0, 0, 1.0)"
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(255, 255, 255, 0.2)"
                    })
                })
            })
        });
        map.addInteraction(draw);
        b();
        var c;
        draw.on("drawstart", function(a) {
            d = a.feature;
            var b = a.coordinate;
            c = d.getGeometry().on("change", function(a) {
                a = a.target;
                var c, d = a.getCoordinates();
                c = d[d.length - 1][0] - d[d.length - 2][0];
                d = d[d.length - 1][1] - d[d.length - 2][1];
                0 < c ? azimut = 90 - 180 * Math.atan(d / c) / Math.PI : 0 > c ? azimut = 270 - 180 * Math.atan(d / c) / Math.PI : 0 == c && (azimut = 0 < d ? 0 : 180);
                c = 0;
                for (var d = a.getCoordinates(),
                        g = map.getView().getProjection(), k = new ol.Sphere(6378137), m = 0, r = d.length - 1; m < r; ++m) {
                    var B = ol.proj.transform(d[m], g, "EPSG:4326"),
                        u = ol.proj.transform(d[m + 1], g, "EPSG:4326");
                    c += k.haversineDistance(B, u)
                }
                c = (1E3 <= c && 1E4 >= c ? Math.round(c / 1E3 * 100) / 100 + " km" : 1E4 <= c && 1E5 >= c ? Math.round(c / 1E3 * 10) / 10 + " km" : 1E3 > c ? Math.round(c) + " m" : Math.round(c / 1E3) + " km") + "  " + azimut.toFixed(0) + "&deg;";
                b = a.getLastCoordinate();
                f.setOffset([0, -23]);
                e.innerHTML = c;
                f.setPosition(b)
            })
        }, this);
        draw.on("drawend", function(a) {
            a = a.feature.getGeometry();
            2 < a.getCoordinates().length && (e.innerHTML = e.innerHTML.split("  ")[0]);
            f.setPosition(a.getCoordinateAt(.5));
            f.setOffset([0, -7]);
            e = d = null;
            b();
            ol.Observable.unByKey(c)
        }, this)
    })()
}

function removeInteractions() {
    map.getInteractions().forEach(function(a) {
        a instanceof ol.interaction.Draw && map.removeInteraction(a)
    }, this);
    var b = getLayerByName("layerMeasureLength");
    "undefined" != typeof b && map.removeLayer(getLayerByName("layerMeasureLength"));
    b = getLayerByName("layerMeasureArea");
    "undefined" != typeof b && map.removeLayer(getLayerByName("layerMeasureArea"));
    clearOverlays("all");
    map.un("click", addMarker);
    map.un("click", radiancePointInfo);
    map.un("click", radianceAreaInfo);
    map.un("click", radianceAreaInfo2);
    map.un("click", addSQM);
    map.un("click", defaultInfo);
    document.getElementById("rulerButton").style.backgroundImage = "url(/img/ruler_off.png)";
    document.getElementById("addMarkerButton").style.backgroundImage = "url(/img/addMarkerButton_off.png)";
    document.getElementById("pointInfoButton").style.backgroundImage = "url(/img/point_info_off.png)";
    document.getElementById("areaInfoButton").style.backgroundImage = "url(/img/area_info_off.png)";
    document.getElementById("areaInfoButton2").style.backgroundImage = "url(/img/area_info2_off.png)";
    document.getElementById("addSQMButton").style.backgroundImage = "url(/img/addSQM_off.png)";
    document.getElementById("map").style.cursor = "default"
}

function addMarker(b) {
    var a = getLayerByName("layerMarkers"),
        c = b.coordinate,
        d = b.pixel;
    b = a.get("counter");
    "undefined" == typeof b && (a.set("counter", 1), b = a.get("counter"));
    0 == a.getSource().getFeatures().length ? a.set("counter", 1) : a.set("counter", b + 1);
    b = a.get("counter");
    var e = new ol.Feature;
    e.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            anchor: [9, 38],
            src: "/img/location_pin_red_shadow.png"
        }),
        text: new ol.style.Text({
            font: "bold 22px Arial",
            fill: new ol.style.Fill({
                color: "#ea3618"
            }),
            stroke: new ol.style.Stroke({
                color: "#4e1e16",
                width: 5
            }),
            text: b.toString(),
            offsetX: 30,
            offsetY: -40
        })
    }));
    c = new ol.geom.Point(c);
    e.setGeometry(c);
    var c = map.getCoordinateFromPixel([d[0] + 25, d[1] + 25]),
        d = map.getCoordinateFromPixel([d[0] - 25, d[1] - 25]),
        f, k;
    try {
        f = ol.extent.boundingExtent([c, d]), k = a.getSource().getFeaturesInExtent(f)
    } catch (g) {
        k = []
    }
    if (0 < k.length)
        for (f = 0; f < k.length; f++) a.getSource().removeFeature(k[f]), a.set("counter", b - 1);
    else a.getSource().addFeature(e)
}

function defaultInfo(b) {
    "" != activeControl || getLayerByName("LayerSQM").getVisible() || getLayerByName("LayerObs").getVisible() || radiancePointInfo(b)
}

function radiancePointInfo(b) {
    var a = ol.proj.transform(b.coordinate, "EPSG:3857", "EPSG:4326");
    clearOverlays("all");
    var c = new XMLHttpRequest,
        d = "/QueryRaster/?qk=" + obf() + "&ql=" + visibleRadiance + "&qt=point&qd=" + a[0] + "," + a[1];
    c.open("GET", d, !0);
    c.send();
    c.onreadystatechange = function() {
        if (4 == c.readyState && 200 == c.status) {
            var e = c.responseText.split(","),
                d = parseFloat(e[0]),
                e = parseFloat(e[1]),
                e = isNaN(e) ? "unknown" : e + " meters";
            isNaN(d) && 75 > a.y && -65 < a.y && setTimeout(function() {
                window.location.reload()
            }, 3E3);
            if ("dmps_2010" ==
                visibleRadiance) d = d.toFixed(0);
            else if ("wa_2015" == visibleRadiance) {
                var k = (Math.log10((d + .171168465) / 108E6) / -.4).toFixed(2),
                    g = formatDouble(d + .171168465);.171 == g && (g = "< 0.171");
                var m = formatDouble(1E3 * d),
                    r = formatDouble(1E3 * d / 171),
                    h = "<a href='https://www.handprint.com/ASTRO/bortle.html' target='_blank'>" + bortleClass(Math.log10((d + .171168465) / 108E6) / -.4) + "</a>"
            } else d = d.toFixed(2);
            var l = ol.coordinate.toStringHDMS(ol.proj.transform(b.coordinate, "EPSG:3857", "EPSG:4326"), 0),
                n = a[1].toFixed(5) + ", " + a[0].toFixed(5),
                p = getLPColorCode(visibleRadiance, parseFloat(d)),
                q = "Radiance value. Units: 10^-9 W/cm^2 * sr";
            "dmps_2010" == visibleRadiance && (q = "Radiance value. Units: Visible band digital number"); - 1 < visibleRadiance.indexOf("wa_") ? (q = "Predicted zenith sky brightness. Units: mag./arc sec^2 (MPSAS)", k = "<span style='font-family:arial;font-size:1em;font-weight: bold;'>Zenith sky brightness info (2015)</span><br/><div class='tableContainer' style='width:20em;font-family:arial;font-size:1em;>" + ("<div class='tableRow'><div class='tableCell'><span title='WGS coordinates (latitude, longitude)' style='cursor:help;'>Coordinates</span></div><div class='tableCellValues' style='cursor:pointer;user-select:none;' title='Click to copy coordinates to clipboard'><div onClick='$(this).hide();$(this).next().show();copyTextToClipboard(\"" +
                    n + "\");'>" + n + "</div><div onClick='$(this).hide();$(this).prev().show();copyTextToClipboard(\"" + n + "\");' style='display:none;'>" + l + "</div></div>") + ("<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Approximate total brightness SQM' style='cursor:help;'>SQM</span></div><div class='tableCellValues' style='font-size: 110%;'>" + k + " mag./arc sec<span style='vertical-align: super;font-size: 12px;font-weight:bold;'>2</span></div></div>") + ("<div class='tableRow'><div class='tableCell'><span title='Approximate total brightness' style='cursor:help;'>Brightness</span></div><div class='tableCellValues'>" +
                    g + " mcd/m<span style='vertical-align: super;font-size: 11px;'>2</span></div></div>"), k += "<div class='tableRow'><div class='tableCell'><span title='Artificial brightness' style='cursor:help;'>Artif. bright.</span></div><div class='tableCellValues'>" + m + " \u03bccd/m<span style='vertical-align: super;font-size: 11px;'>2</span></div></div>", k += "<div class='tableRow'><div class='tableCell'><span title='Ratio to natural brightness' style='cursor:help;'>Ratio</span></div><div class='tableCellValues'>" + r +
                "</div></div>", k += "<div class='tableRow'><div class='tableCell'><span title='Bortle class estimation, based on zenith brightness' style='cursor:help;'>Bortle</span></div><div class='tableCellValues'>" + h + "</div></div>", k += "<div class='tableRow'><div class='tableCell'><span title='Elevation above sea level' style='cursor:help;'>Elevation </span></div><div class='tableCellValues'>" + e + "</div></div>") : (k = "<div style='width:20em;font-family:arial;font-size:1em;line-height:1.2em;'><span style='font-weight: bold;'>Radiance info (" +
                $("#overlaySelect").val().replace("VIIRS", "").replace("WA", "") + ")</span><br/>", k += "<div style='width:33%;float:left;'>Coordinates:<br/><span title='" + q + "' style='cursor:help;'>Value:</span><br/><span title='Elevation above sea level. Units: meters' style='cursor:help;'>Elevation:</span></div>", k = k + ("<div style='float:left;'><div title='Click to copy coordinates to clipboard' style='cursor:pointer;user-select:none;' onClick='$(this).hide();$(this).next().show();copyTextToClipboard(\"" + n + "\");'>" + n +
                    "</div><div title='Click to copy coordinates to clipboard' onClick='$(this).hide();$(this).prev().show();copyTextToClipboard(\"" + n + "\");' style='display:none;cursor:pointer;user-select:none;'>" + l + "</div><div><div style='float:left;'>" + d + "</div>") + ("<div style='height: 1em;width: 1em;float: left;border-radius: 0.1em;margin-left: 0.5em;background-color:" + p + ";'></div>"), k += "</div><br/><div>" + e + "</div></div>");
            k += "</div>";
            650 > document.getElementById("map").clientWidth ? openBigPopup('<div id="lightpollutionformcont" style="cursor: default;position: absolute;left: 0;top: 0;width: 1%;height: 100%;background-color: #ffffff;z-index: 15002;border-top: 5px double #7f9dc5;overflow-y:auto;"><div class="ol-popup-closer"></div>' +
                k.replace("width:20em", "padding: 7px 0px 1px 10px;") + "</div>", "") : (d = new ol.Overlay.Popup({
                id: "popup"
            }), map.addOverlay(d), d.show(b.coordinate, k), hideMenuIfCollision())
        }
    }
}

function radianceAreaInfo2() {
    map.removeInteraction(draw);
    var b, a = getLayerByName("layerMeasureArea");
    map.getOverlays();
    if ("undefined" == typeof a) var a = new ol.source.Vector({
            wrapX: !1
        }),
        c = new ol.layer.Vector({
            name: "layerMeasureArea",
            source: a,
            style: function() {
                var a = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: "rgba(255, 0, 0, 0.0)"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "rgba(255, 0, 0, 1.0)",
                            width: 3
                        }),
                        text: new ol.style.Text({
                            offsetY: -10,
                            text: "",
                            scale: 2,
                            fill: new ol.style.Fill({
                                color: "#000000"
                            }),
                            stroke: new ol.style.Stroke({
                                color: "#FF0000",
                                width: 1
                            })
                        })
                    }),
                    b = [a];
                return function(c, e) {
                    a.getText().setText(c.get("text"));
                    return b
                }
            }()
        });
    map.addLayer(c);
    (function() {
        draw = new ol.interaction.Draw({
            source: null,
            type: "Circle",
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(255, 0, 0, 0.0)"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(255, 0, 0, 0.0)",
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: "rgba(255, 0, 0, 1.0)"
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(255, 255, 255, 0.2)"
                    })
                })
            })
        });
        map.addInteraction(draw);
        draw.on("drawstart", function(a) {
            clearOverlays("all");
            c.getSource().clear();
            b = a.feature;
            listener = b.getGeometry().on("change", function(a) {
                var b = a.target;
                b.getExtent();
                a = map.getView().getProjection();
                a = b.clone().transform(a, "EPSG:4326");
                var c = new ol.Sphere(6378137),
                    d = a.getRadius(),
                    e = a.getCenter();
                a = b.getCenter();
                for (var r = [e[0] + d, e[1]], d = b.getRadius(), c = c.haversineDistance(e, r) / 1.00322, e = new ol.Feature, r = new ol.Feature, h = getLayerByName("layerMeasureArea"), b = b.clone(), l = 1; 21 > l; l++)
                    if (c >= 1E3 * (l - 1) && c <
                        1E3 * l) {
                        h.getSource().clear();
                        b.setRadius(1E3 * l * d / c);
                        r.setGeometry(b);
                        h.getSource().addFeature(r);
                        var n = [a, [a[0] + 1E3 * l * d / c, a[1]]],
                            n = new ol.geom.LineString(n);
                        e.setGeometry(n);
                        e.set("text", l + "km");
                        h.getSource().addFeature(e)
                    }
                for (l = 20; 100 > l; l += 5) c >= 1E3 * l && c < 1E3 * (l + 5) && (h.getSource().clear(), b.setRadius(1E3 * (l + 5) * d / c), r.setGeometry(b), h.getSource().addFeature(r), n = [a, [a[0] + 1E3 * (l + 5) * d / c, a[1]]], n = new ol.geom.LineString(n), e.setGeometry(n), e.set("text", l + 5 + "km"), h.getSource().addFeature(e));
                for (l = 100; 300 >=
                    l; l += 50) c >= 1E3 * l && c < 1E3 * (l + 50) && (h.getSource().clear(), b.setRadius(1E3 * (l + 50) * d / c), r.setGeometry(b), h.getSource().addFeature(r), n = [a, [a[0] + 1E3 * (l + 50) * d / c, a[1]]], n = new ol.geom.LineString(n), e.setGeometry(n), e.set("text", l + 50 + "km"), h.getSource().addFeature(e))
            })
        }, this);
        draw.on("drawend", function(a) {
            var b = getLayerByName("layerMeasureArea").getSource().getFeatures()[0].getGeometry(),
                c = b.getExtent(),
                d = map.getView().getProjection(),
                g = b.clone().transform(d, "EPSG:4326"),
                b = new ol.Sphere(6378137),
                d = g.getRadius(),
                g = g.getCenter(),
                d = b.haversineDistance(g, [g[0] + d, g[1]]),
                g = ol.geom.Polygon.circular(b, g, d, 32),
                m = g.getLinearRing(0).getCoordinates(),
                r = (c[0] + c[2]) / 2,
                h = c[3],
                l = Math.abs(b.geodesicArea(m)) / 1E3 / 1E3,
                n = new ol.Overlay.Popup({
                    id: "popup"
                });
            map.addOverlay(n);
            var p = "",
                c = (new ol.format.WKT).writeGeometry(g);
            if (4E5 < l) p = "<span style='font-family:Arial;font-weight: bold;'>Too large area</span>", n.show(a.feature.getGeometry().getInteriorPoint().getCoordinates(), p), $(".ol-popup-closer").click(function() {
                    clearVectorLayer("layerMeasureArea")
                }),
                hideMenuIfCollision();
            else if (!isNaN(d))
                if (1800 < c.length) p = "<span style='font-family:Arial;font-weight: bold;'>Too complicated polygon drawn</span>", n.show(a.feature.getGeometry().getInteriorPoint().getCoordinates(), p), $(".ol-popup-closer").click(function() {
                    clearVectorLayer("layerMeasureArea")
                }), hideMenuIfCollision();
                else {
                    var q = new XMLHttpRequest;
                    a = "/QueryRaster/?qk=" + obf() + "&ql=" + visibleRadiance + "&qt=area&qd=" + c.replace("POLYGON(", "LINESTRING").replace("))", ")");
                    q.open("GET", a, !0);
                    q.send();
                    document.getElementById("map").style.cursor =
                        "wait";
                    q.onreadystatechange = function(a, b) {
                        return function() {
                            if (4 == q.readyState && 200 == q.status) {
                                document.getElementById("map").style.cursor = "default";
                                if (-1 < q.responseText.indexOf("topology")) p = "<span style='font-family:Arial;font-weight: bold;'>Invalid area</span>";
                                else {
                                    var a;
                                    a = 1E3 < l ? l.toFixed(0) + " km<span style='vertical-align: super;font-size: 11px;font-weight: bold;'>2</span>" : l.toFixed(2) + " km<span style='vertical-align: super;font-size: 11px;font-weight: bold;'>2</span>";
                                    var c = window.location.href.split("/"),
                                        c = c[0] + "//" + c[2] + b,
                                        d = q.responseText.split(","),
                                        e = "* 10^-9 W/cm^2 * sr",
                                        g = "Radiance";
                                    "dmps_2010" == visibleRadiance && (e = "Visible band digital number");
                                    var m, k, f, C;
                                    m = parseFloat(d[2]).toFixed(4);
                                    k = parseFloat(d[3]).toFixed(4);
                                    f = parseFloat(d[4]).toFixed(4);
                                    C = parseFloat(d[5]).toFixed(4); - 1 < visibleRadiance.indexOf("wa_") && (e = "Predicted zenith sky brightness. Units: mag./arc sec^2 (MPSAS)", g = "Zenith sky brightness", m = (Math.log10((parseFloat(d[2]) + .171168465) / 108E6) / -.4).toFixed(2), k = (Math.log10((parseFloat(d[3]) +
                                        .171168465) / 108E6) / -.4).toFixed(2), f = (Math.log10((parseFloat(d[4]) + .171168465) / 108E6) / -.4).toFixed(2), C = (Math.log10((parseFloat(d[5]) + .171168465) / 108E6) / -.4).toFixed(2));
                                    var E = getLPColorCode(visibleRadiance, m);
                                    p = "<div style='font-family:Arial;font-weight:bold;overflow:hidden;white-space:nowrap;line-height:1.2em;'>" + g + " statistics (" + $("#overlaySelect").val().replace("VIIRS", "").replace("WA", "") + ")</div>";
                                    p += "<div class='tableContainer'>";
                                    p += "<div class='tableRow'><div class='tableCell'><span title='Number of pixels completely inside the drawn polygon' style='cursor:help;'>Pixel count</span></div><div class='tableCellValues'>" +
                                        d[0] + "</div></div>"; - 1 == visibleRadiance.indexOf("wa_") && (p += "<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Sum of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Sum</span></div><div class='tableCellValues' style='font-size: 110%;'>" + Math.round(100 * parseFloat(+d[1]).toFixed(2)) / 100 + "</div></div>");
                                    p += "<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Polygon area' style='cursor:help;'>Area</span></div><div class='tableCellValues' style='font-size: 110%;'>" +
                                        a + "</div></div>";
                                    p = -1 == visibleRadiance.indexOf("wa_") ? p + ("<div class='tableRow'><div class='tableCell'><span title='Mean of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Mean</span></div><div class='tableCellValues'><div style='float:left;'>" + m + "</div><div style='height: 1em;width: 1em;float: left;border-radius: 0.1em;margin-left: 0.5em;background-color:" + E + ";'></div></div></div>") : p + ("<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Mean of pixel values completely inside the drawn polygon. Units: " +
                                        e + "' style='cursor:help;'>Mean</span></div><div class='tableCellValues'><div style='float:left;font-size:110%;'>" + m + "</div></div></div>");
                                    p += "<div class='tableRow'><div class='tableCell'><span title='Standard deviation of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Std. dev.</span></div><div class='tableCellValues'>" + k + "</div></div>";
                                    p += "<div class='tableRow'><div class='tableCell'><span title='Minimum of pixel values completely inside the drawn polygon. Units: " +
                                        e + "' style='cursor:help;'>Minimum</span></div><div class='tableCellValues'>" + f + "</div></div>";
                                    p += "<div class='tableRow'><div class='tableCell'><span title='Maximum of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Maximum</span></div><div class='tableCellValues'>" + C + "</div></div>";
                                    p += "</div>"; - 1 == visibleRadiance.indexOf("wa_") && (p += "<div><div class='areaExportButton' style='float:left;width: 8em;height: 2em;font-size: 0.8em;padding-top: 0.55em;padding-left: 0.8em;border-radius: 4px;;' title='Export area to raw GeoTIFF<br/>Use GIS software to view' onclick='window.location=\"" +
                                        c.replace("&qt=area&", "&qt=raster&") + "\";'>Raw GeoTIFF</div>");
                                    isNaN(d[0]) && setTimeout(function() {
                                        window.location.reload()
                                    }, 3E3)
                                }
                                if (650 > document.getElementById("map").clientWidth) openBigPopup('<div id="lightpollutionformcont" style="cursor: default;position: absolute;left: 0;top: 0;width: 1%;height: 100%;background-color: #ffffff;z-index: 15002;border-top: 5px double #7f9dc5;overflow-y:auto;"><div class="ol-popup-closer"></div>' + p.replace("font-family:Arial;", "font-family:Arial;padding: 7px 0px 1px 10px;").replace("width:15em",
                                    "") + "</div>", "layerMeasureArea");
                                else try {
                                    n.show([r, h], p), $(".ol-popup-closer").click(function() {
                                        clearVectorLayer("layerMeasureArea")
                                    }), hideMenuIfCollision(), makePopupDraggable()
                                } catch (G) {}
                            }
                        }
                    }(a, a)
                }
        }, this)
    })()
}

function radianceAreaInfo() {
    map.removeInteraction(draw);
    var b = getLayerByName("layerMeasureArea");
    map.getOverlays();
    if ("undefined" == typeof b) var a = new ol.source.Vector({
            wrapX: !1
        }),
        c = new ol.layer.Vector({
            name: "layerMeasureArea",
            source: a,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "rgba(255, 0, 0, 0.0)"
                }),
                stroke: new ol.style.Stroke({
                    color: "rgba(255, 0, 0, 1.0)",
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: "rgba(255, 255, 255, 0.2)"
                    })
                })
            })
        });
    map.addLayer(c);
    (function() {
        draw =
            new ol.interaction.Draw({
                source: a,
                type: "Polygon",
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(255, 0, 0, 0.0)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "rgba(255, 0, 0, 1.0)",
                        width: 3
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: "rgba(255, 0, 0, 1.0)"
                        }),
                        fill: new ol.style.Fill({
                            color: "rgba(255, 255, 255, 0.2)"
                        })
                    })
                })
            });
        map.addInteraction(draw);
        draw.on("drawstart", function() {
            clearOverlays("all");
            c.getSource().clear()
        }, this);
        draw.on("drawend", function(a) {
            for (var b =
                    a.feature.getGeometry(), c = map.getView().getProjection(), c = b.clone().transform(c, "EPSG:4326"), d = c.getLinearRing(0).getCoordinates(), b = b.getLinearRing(0).getCoordinates(), g = -3E7, m = -5E6, r = 0; r < b.length; r++) b[r][1] > m && (g = b[r][0], m = b[r][1]);
            var b = new ol.Sphere(6378137),
                h = Math.abs(b.geodesicArea(d)) / 1E3 / 1E3,
                l = new ol.Overlay.Popup({
                    id: "popup"
                });
            map.addOverlay(l);
            var n = "",
                c = (new ol.format.WKT).writeGeometry(c);
            if (4E5 < h) n = "<span style='font-family:Arial;font-weight: bold;'>Too large area</span>", l.show(a.feature.getGeometry().getInteriorPoint().getCoordinates(),
                n), $(".ol-popup-closer").click(function() {
                clearVectorLayer("layerMeasureArea")
            }), hideMenuIfCollision();
            else if (1800 < c.length) n = "<span style='font-family:Arial;font-weight: bold;'>Too complicated polygon drawn</span>", l.show(a.feature.getGeometry().getInteriorPoint().getCoordinates(), n), $(".ol-popup-closer").click(function() {
                clearVectorLayer("layerMeasureArea")
            }), hideMenuIfCollision();
            else {
                var p = new XMLHttpRequest;
                a = "/QueryRaster/?qk=" + obf() + "&ql=" + visibleRadiance + "&qt=area&qd=" + c.replace("POLYGON(",
                    "LINESTRING").replace("))", ")");
                p.open("GET", a, !0);
                p.send();
                document.getElementById("map").style.cursor = "wait";
                p.onreadystatechange = function(a, b) {
                    return function() {
                        if (4 == p.readyState && 200 == p.status) {
                            document.getElementById("map").style.cursor = "default";
                            if (-1 < p.responseText.indexOf("topology")) n = "<span style='font-family:Arial;font-weight: bold;'>Invalid area</span>";
                            else {
                                var a;
                                a = 1E3 < h ? h.toFixed(0) + " km<span style='vertical-align: super;font-size: 11px;font-weight: bold;'>2</span>" : h.toFixed(2) + " km<span style='vertical-align: super;font-size: 11px;font-weight: bold;'>2</span>";
                                var c = window.location.href.split("/"),
                                    c = c[0] + "//" + c[2] + b,
                                    d = p.responseText.split(","),
                                    e = "* 10^-9 W/cm^2 * sr",
                                    k = "Radiance";
                                "dmps_2010" == visibleRadiance && (e = "Visible band digital number");
                                var f, r, q, t;
                                f = parseFloat(d[2]).toFixed(4);
                                r = parseFloat(d[3]).toFixed(4);
                                q = parseFloat(d[4]).toFixed(4);
                                t = parseFloat(d[5]).toFixed(4); - 1 < visibleRadiance.indexOf("wa_") && (e = "Predicted zenith sky brightness. Units: mag./arc sec^2 (MPSAS)", k = "Zenith sky brightness", f = (Math.log10((parseFloat(d[2]) + .171168465) / 108E6) / -.4).toFixed(2),
                                    r = (Math.log10((parseFloat(d[3]) + .171168465) / 108E6) / -.4).toFixed(2), q = (Math.log10((parseFloat(d[4]) + .171168465) / 108E6) / -.4).toFixed(2), t = (Math.log10((parseFloat(d[5]) + .171168465) / 108E6) / -.4).toFixed(2));
                                var C = getLPColorCode(visibleRadiance, f);
                                n = "<div style='font-family:Arial;font-weight:bold;overflow:hidden;white-space:nowrap;line-height:1.2em;'>" + k + " statistics (" + $("#overlaySelect").val().replace("VIIRS", "").replace("WA", "") + ")</div>";
                                n += "<div class='tableContainer'>";
                                n += "<div class='tableRow'><div class='tableCell'><span title='Number of pixels completely inside the drawn polygon' style='cursor:help;'>Pixel count</span></div><div class='tableCellValues'>" +
                                    d[0] + "</div></div>"; - 1 == visibleRadiance.indexOf("wa_") && (n += "<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Sum of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Sum</span></div><div class='tableCellValues' style='font-size: 110%;'>" + Math.round(100 * parseFloat(+d[1]).toFixed(2)) / 100 + "</div></div>");
                                n += "<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Polygon area' style='cursor:help;'>Area</span></div><div class='tableCellValues' style='font-size: 110%;'>" +
                                    a + "</div></div>";
                                n = -1 == visibleRadiance.indexOf("wa_") ? n + ("<div class='tableRow'><div class='tableCell'><span title='Mean of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Mean</span></div><div class='tableCellValues'><div style='float:left;'>" + f + "</div><div style='height: 1em;width: 1em;float: left;border-radius: 0.1em;margin-left: 0.5em;background-color:" + C + ";'></div></div></div>") : n + ("<div class='tableRow' style='background-color:#c9e1ff;'><div class='tableCell'><span title='Mean of pixel values completely inside the drawn polygon. Units: " +
                                    e + "' style='cursor:help;'>Mean</span></div><div class='tableCellValues'><div style='float:left;font-size:110%;'>" + f + "</div></div></div>");
                                n += "<div class='tableRow'><div class='tableCell'><span title='Standard deviation of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Std. dev.</span></div><div class='tableCellValues'>" + r + "</div></div>";
                                n += "<div class='tableRow'><div class='tableCell'><span title='Minimum of pixel values completely inside the drawn polygon. Units: " +
                                    e + "' style='cursor:help;'>Minimum</span></div><div class='tableCellValues'>" + q + "</div></div>";
                                n += "<div class='tableRow'><div class='tableCell'><span title='Maximum of pixel values completely inside the drawn polygon. Units: " + e + "' style='cursor:help;'>Maximum</span></div><div class='tableCellValues'>" + t + "</div></div>";
                                n += "</div>"; - 1 == visibleRadiance.indexOf("wa_") && (n += "<div><div class='areaExportButton' style='float:left;width: 8em;height: 2em;font-size: 0.8em;padding-top: 0.55em;padding-left: 0.8em;border-radius: 4px;;' title='Export area to raw GeoTIFF<br/>Use GIS software to view' onclick='window.location=\"" +
                                    c.replace("&qt=area&", "&qt=raster&") + "\";'>Raw GeoTIFF</div>");
                                isNaN(d[0]) && setTimeout(function() {
                                    window.location.reload()
                                }, 3E3)
                            }
                            if (650 > document.getElementById("map").clientWidth) openBigPopup('<div id="lightpollutionformcont" style="cursor: default;position: absolute;left: 0;top: 0;width: 1%;height: 100%;background-color: #ffffff;z-index: 15002;border-top: 5px double #7f9dc5;overflow-y:auto;"><div class="ol-popup-closer"></div>' + n.replace("font-family:Arial;", "font-family:Arial;padding: 7px 0px 1px 10px;").replace("width:15em",
                                "") + "</div>", "layerMeasureArea");
                            else try {
                                l.show([g, m], n), $(".ol-popup-closer").click(function() {
                                    clearVectorLayer("layerMeasureArea")
                                }), hideMenuIfCollision(), makePopupDraggable()
                            } catch (E) {}
                        }
                    }
                }(a, a)
            }
        }, this)
    })()
}

function getRadianceLayer() {
    var b = "",
        a = map.getLayers().getArray();
    for (key in a) {
        var c = a[key],
            d = c.get("name"); - 1 == d.indexOf("LayerVIIRS") && -1 == d.indexOf("LayerWA") && -1 == d.indexOf("LayerDMSP") || 1 != c.getVisible() || (-1 != d.indexOf("LayerVIIRS") && (b = "viirs_" + d.replace("LayerVIIRS", "")), -1 != d.indexOf("LayerWA") && (b = "wa_" + d.replace("LayerWA", "")), "LayerDMSP2010" == d && (b = "dmps_2010"))
    }
    return b
}

function clearVectorLayer(b) {
    b = getLayerByName(b);
    "undefined" != typeof b && b.getSource().clear()
}

function obf() {
    var b = (new Date).getTime();
    return btoa(b + ";isuckdicks:)")
}

function SQMPointInfo(b) {
    if ("" == activeControl) {
        clearOverlays("all");
        var a = b.pixel,
            c = 5;
        if ("ontouchstart" in window || navigator.msMaxTouchPoints) c = 10;
        var d = map.getCoordinateFromPixel([a[0] + c, a[1] + c]),
            a = map.getCoordinateFromPixel([a[0] - c, a[1] - c]),
            d = ol.proj.transform(d, "EPSG:900913", "EPSG:4326"),
            a = ol.proj.transform(a, "EPSG:900913", "EPSG:4326"),
            d = ol.extent.boundingExtent([d, a]),
            a = getLayerByName("LayerSQM").getSource().getParams(),
            e, f = new XMLHttpRequest,
            d = "/geoserver/PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=lightpollutionslo_view&maxFeatures=200&sortBy=timemeasure+D&CQL_FILTER=" +
            encodeURIComponent(a.CQL_FILTER + " AND BBOX(geom," + d[0] + "," + d[1] + "," + d[2] + "," + d[3] + ")") + "&outputFormat=application/json";
        f.open("GET", d, !0);
        f.send();
        f.onreadystatechange = function() {
            if (4 == f.readyState && 200 == f.status) {
                e = jQuery.parseJSON(f.responseText).features;
                var a = "<table style='max-width:20em;font-family:Arial;font-size:1em;color:#000000;'>";
                if (0 < e.length) {
                    for (var c = 0; c < e.length; c++) {
                        var d, r = e[c].properties.timemeasuretext,
                            h = getLPColorCode("SQM", e[c].properties.sqm),
                            l = e[c].properties.imagename;
                        "1" ==
                        e[c].properties.sqm_l ? d = "SQM-L (lens)" : "2" == e[c].properties.sqm_l ? (d = "Sky Quality Camera", l = l.replace(".jpg", "_thumbnail.jpg")) : d = "3" == e[c].properties.sqm_l ? "SQM-LE (stationary)" : "SQM (no lens)";
                        0 === c % 2 ? (a = 0 < c ? a + ("<tr bgcolor='#FFFFFF'><td style='min-width:6em;padding-top:10px;'><b>" + (c + 1) + ".</b> </td><td style='width:100%;'></td></tr>") : a + ("<tr bgcolor='#FFFFFF'><td style='min-width:6em;'><b>" + (c + 1) + ".</b></td><td style='width:100%;'></td></tr>"), 2 == e[c].properties.sqm_l && (a += "<tr bgcolor='#FFFFFF'><td colspan='2' style='vertical-align:top;'><img style='cursor:pointer;' title='Sky Quality Camera (click to enlarge)' onclick='showSQCimage(\"input/uploads/" +
                                l.replace("_thumbnail.jpg", ".jpg") + "\")' src='input/uploads/" + l + "' width='240px' alt='small sqm image' ><div style='color:#4f81bd;'><a href='input/uploads/" + l.substring(0, 6) + ".zip' target='_blank' style='font-weight: bold;'>Download</a> / <a href='javascript:void(0);' onclick='showSQCimages(\"" + e[c].properties.gid + "\");' style='font-weight: bold;'>Show</a> all images</div></td></tr>"), null != e[c].properties.name && 1 < e[c].properties.name.length && (a += "<tr bgcolor='#FFFFFF'><td style='vertical-align:top;cursor:help;' title='Name or location'><b>Name:</b> </td><td>" +
                                e[c].properties.name + "</td></tr>"), a = 3 == e[c].properties.sqm_l ? a + "" : a + ("<tr bgcolor='#FFFFFF' style='white-space:nowrap;'><td style='cursor:help;' title='Local time of the measurement'><b>Date/Time:</b> </td><td>" + r.replace(" ", "&nbsp;&nbsp;&nbsp;") + "<div class='moonIcon' id='moonPhase_" + c + "' style='width:32px;height:32px;position:relative;top:32px;left:125px;margin:-32px 0px 0px 0px;cursor:help;'></div></td></tr>"), 2 == e[c].properties.sqm_l ? (a += "<tr bgcolor='#FFFFFF'><td style='cursor:help;' title='SQC V mag value in mag/arcsec&#178;'><b>SQC <span style='font-size:75%;'>(0&deg;-30&deg;)</span>:</b> </td><td><div style='float:left;font-weight:bold;'>" +
                                e[c].properties.sqm.toFixed(2) + " V mag</div><div style='height: 0.9em;width: 0.9em;float: left;border-radius: 0.45em;background-color:" + h + ";margin-left: 0.5em;'></div></td></tr>", a += "<tr bgcolor='#FFFFFF'><td style='cursor:help;' title='Clouds percentage'><b>Clouds:</b> </td><td><div style='float:left;'>" + e[c].properties.clouds.toFixed(0) + " %</div></td></tr>") : a = 3 == e[c].properties.sqm_l ? a + ("<tr bgcolor='#FFFFFF'><td style='cursor:help;' title='SQM value in mag/arcsec&#178;'><b>SQM:</b> </td><td><div id='sqmleGraphLink_" +
                                c + "' style='float:left;font-weight:bold;cursor:pointer;'>View graph<img src='img/sqmle.png' style='box-shadow: 0 0 4px 0px rgb(0, 0, 0);'/></div></td></tr>") : a + ("<tr bgcolor='#FFFFFF'><td style='cursor:help;' title='SQM value in mag/arcsec&#178;'><b>SQM:</b> </td><td><div style='float:left;font-weight:bold;'>" + e[c].properties.sqm.toFixed(2) + "</div><div style='height: 0.9em;width: 0.9em;float: left;border-radius: 0.45em;background-color:" + h + ";margin-left: 0.5em;'></div></td></tr>"), a += "<tr bgcolor='#FFFFFF'><td style='cursor:help;'title='Device type used'><b>Device:</b> </td><td>" +
                            d + "</td></tr>", null != e[c].properties.comment && 1 < e[c].properties.comment.length && (a += "<tr bgcolor='#FFFFFF' style='vertical-align:top;'><td style='cursor:help;' title='Additional comment'><b>Comment:</b> </td><td>" + e[c].properties.comment + "</td></tr>")) : (a += "<tr bgcolor='#F0F0F0'><td style='min-width:6em;padding-top:10px;'><b>" + (c + 1) + ".</b> </td><td style='width:100%;'></td></tr>", 2 == e[c].properties.sqm_l && (a += "<tr bgcolor='#F0F0F0'><td colspan='2' style='vertical-align:top;'><img style='cursor:pointer;' title='Sky Quality Camera (click to enlarge)' onclick='showSQCimage(\"input/uploads/" +
                                l.replace("_thumbnail.jpg", ".jpg") + "\")' src='input/uploads/" + l + "' width='240px' alt='small sqm image' ><div style='color:#4f81bd;'><a href='input/uploads/" + l.substring(0, 6) + ".zip' target='_blank' style='font-weight: bold;'>Download</a> / <a href='javascript:void(0);' onclick='showSQCimages(\"" + e[c].properties.gid + "\");' style='font-weight: bold;'>Show</a> all images</div></td></tr>"), null != e[c].properties.name && 1 < e[c].properties.name.length && (a += "<tr bgcolor='#F0F0F0'><td style='vertical-align:top;cursor:help;' title='Name or location'><b>Name:</b> </td><td>" +
                                e[c].properties.name + "</td></tr>"), a = 3 == e[c].properties.sqm_l ? a + "" : a + ("<tr bgcolor='#F0F0F0' style='white-space:nowrap;'><td style='cursor:help;' title='Local time of the measurement'><b>Date/Time:</b> </td><td>" + r.replace(" ", "&nbsp;&nbsp;&nbsp;") + "<div class='moonIcon' id='moonPhase_" + c + "' style='width:32px;height:32px;position:relative;top:32px;left:125px;margin:-32px 0px 0px 0px;cursor:help;'></div></td></tr>"), 2 == e[c].properties.sqm_l ? (a += "<tr bgcolor='#F0F0F0'><td style='cursor:help;' title='SQC V mag value in mag/arcsec&#178;'><b>SQC <span style='font-size:75%;'>(0&deg;-30&deg;)</span>:</b> </td><td><div style='float:left;font-weight:bold;'>" +
                                e[c].properties.sqm.toFixed(2) + " V mag</div><div style='height: 0.9em;width: 0.9em;float: left;border-radius: 0.45em;background-color:" + h + ";margin-left: 0.5em;'></div></td></tr>", a += "<tr bgcolor='#F0F0F0'><td style='cursor:help;' title='Clouds percentage'><b>Clouds:</b> </td><td><div style='float:left;'>" + e[c].properties.clouds.toFixed(0) + " %</div></td></tr>") : a = 3 == e[c].properties.sqm_l ? a + ("<tr bgcolor='#F0F0F0'><td style='cursor:help;' title='SQM value in mag/arcsec&#178;'><b>SQM:</b> </td><td><div id='sqmleGraphLink_" +
                                c + "' style='float:left;font-weight:bold;cursor:pointer;'>View graph<img src='img/sqmle.png' style='box-shadow: 0 0 4px 0px rgb(0, 0, 0);'/></div></td></tr>") : a + ("<tr bgcolor='#F0F0F0'><td style='cursor:help;' title='SQM value in mag/arcsec&#178;'><b>SQM:</b> </td><td><div style='float:left;font-weight:bold;'>" + e[c].properties.sqm.toFixed(2) + "</div><div style='height: 0.9em;width: 0.9em;float: left;border-radius: 0.45em;background-color:" + h + ";margin-left: 0.5em;'></div></td></tr>"), a += "<tr bgcolor='#F0F0F0'><td style='cursor:help;'title='Device type used'><b>Device:</b> </td><td>" +
                            d + "</td></tr>", null != e[c].properties.comment && 1 < e[c].properties.comment.length && (a += "<tr bgcolor='#F0F0F0' style='vertical-align:top;'><td style='cursor:help;' title='Additional comment'><b>Comment:</b> </td><td>" + e[c].properties.comment + "</td></tr>"))
                    }
                    a += "</table>";
                    650 > document.getElementById("map").clientWidth && (rightMenuVis || 2 < e.length) ? openBigPopup('<div id="lightpollutionformcont" style="cursor: default;position: absolute;left: 0;top: 0;width: 1%;height: 100%;background-color: #ffffff;z-index: 15002;border-top: 5px double #7f9dc5;overflow-y:auto;"><div class="ol-popup-closer"></div>' +
                        a.replace("font-size:1em", "font-size:1em;margin: 10px 0px 10px 10px").replace("width:20em", "") + "</div>", "") : (c = new ol.Overlay.Popup({
                        id: "popup"
                    }), map.addOverlay(c), d = map.getView().getProjection(), c.show(ol.proj.transform(e[0].geometry.coordinates, "EPSG:4326", d), a), hideMenuIfCollision());
                    for (c = 0; c < e.length; c++)(function(a) {
                        3 == e[a].properties.sqm_l ? $("#sqmleGraphLink_" + a).click(function() {
                            openSQMLE(e[a].properties.gid, e[a].geometry.coordinates)
                        }) : $.ajax({
                            url: "input2/gettimezone.aspx?QueryData=" + e[a].geometry.coordinates[0] +
                                "," + e[a].geometry.coordinates[1],
                            type: "GET",
                            success: function(b) {
                                var c = 180 / Math.PI,
                                    d = e[a].geometry.coordinates[1],
                                    m = e[0].geometry.coordinates[0];
                                b = moment.tz(e[a].properties.timemeasuretext, b);
                                b = new A.JulianDay(b.toDate());
                                var g = A.EclCoord.fromWgs84(d, m, 0),
                                    d = A.Moon.topocentricPosition(b, g, !0),
                                    m = A.Solar.apparentTopocentric(b, g),
                                    h = A.MoonIllum.phaseAngleEq2(d.eq, m);
                                d.illum = A.MoonIllum.illuminated(h);
                                d.hz.alt *= c;
                                b = A.Solar.topocentricPosition(b, g, !0);
                                b.hz.alt *= c;
                                c = 0 < A.MoonIllum.positionAngle(d.eq, m) ? !1 :
                                    !0;
                                $("#moonPhase_" + a).attr("title", "Moon illumination: " + (100 * d.illum).toFixed(0) + "%<br />Moon altitude: " + d.hz.alt.toFixed(0) + "\u00b0<br />Sun altitude: " + b.hz.alt.toFixed(0) + "\u00b0");
                                drawPlanetPhase(document.getElementById("moonPhase_" + a), d.illum, c)
                            }
                        })
                    })(c)
                } else radiancePointInfo(b)
            }
        }
    }
}

function ObsPointInfo(b) {
    if ("" == activeControl) {
        clearOverlays("all");
        var a = b.pixel,
            c = 15,
            d = map.getView().getZoom();
        9 > d && (c = 10);
        7 > d && (c = 7);
        d = map.getCoordinateFromPixel([a[0] + c, a[1] + c]);
        a = map.getCoordinateFromPixel([a[0] - c, a[1] - c]);
        d = ol.proj.transform(d, "EPSG:900913", "EPSG:4326");
        a = ol.proj.transform(a, "EPSG:900913", "EPSG:4326");
        a = ol.extent.boundingExtent([d, a]);
        c = getLayerByName("LayerObs").getSource().getParams();
        d = "";
        0 < c.LAYERS.indexOf("s_") && (d = "_");
        var e, f = new XMLHttpRequest,
            a = "/geoserver/PostGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=lp_observatories" +
            d + "&maxFeatures=200&sortBy=instrument_size+D&CQL_FILTER=" + encodeURIComponent(c.CQL_FILTER + " AND BBOX(geom," + a[0] + "," + a[1] + "," + a[2] + "," + a[3] + ")") + "&outputFormat=application/json";
        f.open("GET", a, !0);
        f.send();
        f.onreadystatechange = function() {
            if (4 == f.readyState && 200 == f.status) {
                e = jQuery.parseJSON(f.responseText).features;
                var a = ol.coordinate.toStringHDMS(ol.proj.transform(b.coordinate, "EPSG:3857", "EPSG:4326"), 0),
                    c;
                c = "<span style='font-family:arial;font-size:1em;font-weight: bold;'>Observatory information</span><br/><div class='tableContainer' style='width:20em;font-family:arial;font-size:1em;'>";
                if (0 < e.length) {
                    var d = e[0].properties.lat.toFixed(5) + ", " + e[0].properties.lon.toFixed(5);
                    c = null != e[0].properties.link ? c + ("<div class='tableRow'><div class='tableCell'><span title='Observatory name' style='cursor:help;'>Name</span></div><div class='tableCellValues'><a href='" + e[0].properties.link + "' target='_blank'>" + e[0].properties.name + "</a></div></div>") : c + ("<div class='tableRow'><div class='tableCell'><span title='Observatory name' style='cursor:help;'>Name</span></div><div class='tableCellValues'>" +
                        e[0].properties.name + "</div></div>");
                    c = c + ("<div class='tableRow'><div class='tableCell'><span title='WGS coordinates (latitude, longitude)' style='cursor:help;'>Coordinates</span></div><div class='tableCellValues' style='cursor:pointer;user-select:none;' title='Click to copy coordinates to clipboard'><div onClick='$(this).hide();$(this).next().show();copyTextToClipboard(\"" + d + "\");'>" + d + "</div><div onClick='$(this).hide();$(this).prev().show();copyTextToClipboard(\"" + d + "\");' style='display:none;'>" +
                        a + "</div></div></div>") + ("<div class='tableRow'><div class='tableCell'><span title='Observatory MPC code' style='cursor:help;'>MPC</span></div><div class='tableCellValues' id='testis'>" + e[0].properties.mpc_code + "</div></div>");
                    0 < e[0].properties.instrument_size && (c += "<div class='tableRow'><div class='tableCell'><span title='Largest observatory telescope' style='cursor:help;'>Size</span></div><div class='tableCellValues'>" + e[0].properties.instrument_size + " m</div></div>");
                    c += "<div class='tableRow'><div class='tableCell'><span title='World Atlas 2015 Zenith SQM magnitude' style='cursor:help;'>Zen. mag.</span></div><div class='tableCellValues'>" +
                        e[0].properties.sqm_zenith.toFixed(2) + " mag./arc sec\u00b2</div></div>";
                    null != e[0].properties.sqm_scalar && (c += "<div class='tableRow'><div class='tableCell'><span title='Scalar SQM magnitude' style='cursor:help;'>Sca. mag.</span></div><div class='tableCellValues'>" + e[0].properties.sqm_scalar.toFixed(2) + " mag./arc sec\u00b2</div></div>");
                    null != e[0].properties.altitude && (c += "<div class='tableRow'><div class='tableCell'><span title='Elevation above sea level' style='cursor:help;'>Elevation</span></div><div class='tableCellValues'>" +
                        e[0].properties.altitude + " m</div></div>");
                    c += "</div>";
                    650 > document.getElementById("map").clientWidth && (rightMenuVis || 2 < e.length) ? openBigPopup('<div id="lightpollutionformcont" style="cursor: default;position: absolute;left: 0;top: 0;width: 1%;height: 100%;background-color: #ffffff;z-index: 15002;border-top: 5px double #7f9dc5;overflow-y:auto;"><div class="ol-popup-closer"></div>' + c.replace("font-size:1em", "font-size:1em;margin: 10px 0px 10px 10px").replace("width:20em", "") + "</div>", "") : (a = new ol.Overlay.Popup({
                            id: "popup"
                        }),
                        map.addOverlay(a), d = map.getView().getProjection(), a.show(ol.proj.transform(e[0].geometry.coordinates, "EPSG:4326", d), c), hideMenuIfCollision())
                } else SQMPointInfo(b)
            }
        }
    }
}

function mapSQMPointer(b) {
    if (!b.dragging && "" == activeControl) {
        b = map.getEventPixel(b.originalEvent);
        try {
            var a = map.forEachLayerAtPixel(b, function(a) {
                return !0
            }, this, function(a) {
                a = a.get("name");
                if ("LayerSQM" == a || "LayerObs" == a) return !0
            });
            map.getTargetElement().style.cursor = a ? "pointer" : "default"
        } catch (c) {}
    }
}

function addSQM(b) {
    clearOverlays("all");
    var a = b.coordinate,
        a = "/input2/?Zoom=" + map.getView().getZoom() + "&Lat=" + a[1] + "&Lon=" + a[0] + "&Mobile=0";
    if (650 > document.getElementById("map").clientWidth) openBigPopup('<div id="lightpollutionformcont" style="cursor: default;position: absolute;left: 0;top: 0;width: 1%;height: 100%;background-color: #ffffff;z-index: 15002;border-top: 5px double #7f9dc5;overflow-y:auto;"><div class="ol-popup-closer"></div><iframe style="width:19em;height:18.5em" id="lightpollutionform" name="form" scrolling="no" frameBorder="0" src=' +
        a + "></iframe></div>", "LayerSQM");
    else {
        a = "<div style='height:19.5em'><iframe style='width:19em;height:19.2em' id='lightpollutionform' name='form' scrolling='no' frameBorder='0' src='" + a + "'></iframe></div>";
        $(".ol-popup-closer").click(function() {
            var a = getLayerByName("LayerSQM");
            a.getSource().changed();
            a.getSource().refresh()
        });
        var c = new ol.Overlay.Popup({
            id: "popup"
        });
        map.addOverlay(c);
        c.show(b.coordinate, a);
        $(".ol-popup-closer").click(function() {
            var a = getLayerByName("LayerSQM");
            a.getSource().changed();
            a.getSource().refresh()
        });
        hideMenuIfCollision()
    }
}

function updateSQMLayer() {
    var b = $("#SQMName").val();
    minDate = $("#SQMStartDate").val() + "-01";
    maxDate = $("#SQMEndDate").val() + "-32";
    for (var a = $("#featureSelect").val(), c = [], d = 0; d < a.length; d++) {
        var e = a[d];
        "SQM" == e ? c.push("sqm_l = 0") : "SQML" == e ? c.push("sqm_l = 1") : "SQMLE" == e ? c.push("sqm_l = 3") : "SQC" == e ? c.push("sqm_l = 2") : c.push("sqm_l = 99")
    }
    a = 0 < a.length ? " AND (" + c.join(" OR ") + ") " : " AND sqm_l = 99 ";
    layerSQMFilter = "timemeasure > '" + minDate + "' AND timemeasure < '" + maxDate + "' " + a;
    "" != b && (layerSQMFilter +=
        " AND strToLowerCase(name) like '%" + b.toLowerCase() + "%'");
    b = getLayerByName("LayerSQM");
    a = b.getSource().getParams();
    a.CQL_FILTER = layerSQMFilter;
    b.getSource().updateParams(a)
}

function updateObsLayer() {
    var b = $("#ObsLowSQM").val(),
        a = $("#ObsHighSQM").val();
    isNaN(b) || "" == b ? (alert("SQM needs to be a number between 15 and 22!"), $("#ObsLowSQM").val("15")) : isNaN(a) || "" == a ? (alert("SQM needs to be a number between 15 and 22!"), $("#ObsHighSQM").val("22")) : (layerObsFilter = "sqm_zenith > '" + b + "' AND sqm_zenith < '" + a + "'", b = getLayerByName("LayerObs"), a = b.getSource().getParams(), a.CQL_FILTER = layerObsFilter, b.getSource().updateParams(a))
}

function openBigPopup(b, a) {
    $("#map").append(b);
    $("#lightpollutionformcont").animate({
        width: "100%"
    }, 1E3);
    $(".ol-popup-closer").click(function() {
        $("#lightpollutionformcont").animate({
            width: "1%"
        }, 1E3, function() {
            $("#lightpollutionformcont").remove()
        });
        if ("" != a) {
            var b = getLayerByName(a);
            b.getSource() instanceof ol.source.Vector ? clearVectorLayer(a) : (b.getSource().changed(), b.getSource().refresh())
        }
    })
}

function zoomToSearchResult(b, a) {
    var c = new ol.Feature;
    c.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            anchor: [9, 38],
            src: "/img/location_pin_red_shadow.png"
        })
    }));
    var d = map.getView().getProjection(),
        d = new ol.geom.Point(ol.proj.transform([b.point.coordinates[1], b.point.coordinates[0]], "EPSG:4326", d));
    c.setGeometry(d);
    d = getLayerByName("layerGeolocation");
    clearVectorLayer(d.get("name"));
    d.getSource().addFeature(c);
    flyTo(c.getGeometry().getCoordinates(),
        a)
}

function hideMenuIfCollision() {
    var b = $(".ol-popup"),
        a = $("#RightMenu");
    if (1 == rightMenuVis) {
        var c = b.offset().left,
            d = b.offset().top,
            e = b.outerHeight(!0),
            b = b.outerWidth(!0),
            e = d + e,
            b = c + b,
            f = a.offset().left,
            k = a.offset().top,
            g = a.outerHeight(!0),
            a = a.outerWidth(!0);
        e < k || d > k + g || b < f || c > f + a || toggleRightMenu("min")
    }
}

function getLPColorCode(b, a) {
    if (-1 < b.indexOf("SQM")) {
        if (19.399 > a) return "#C2523C";
        if (19.399 <= a && 20.399 > a) return "#EDA113";
        if (20.399 <= a && 20.899 > a) return "#FFFF00";
        if (20.899 <= a && 21.199 > a) return "#00DB00";
        if (21.199 <= a && 21.499 > a) return "#20998F";
        if (21.499 <= a && 21.799 > a) return "#0B2C6F";
        if (21.799 <= a) return "#000000"
    }
    if (-1 < b.indexOf("wa_")) {
        if (19.399 > a) return "#C2523C";
        if (19.399 <= a && 20.399 > a) return "#EDA113";
        if (20.399 <= a && 20.899 > a) return "#FFFF00";
        if (20.899 <= a && 21.199 > a) return "#00DB00";
        if (21.199 <= a && 21.499 > a) return "#20998F";
        if (21.499 <= a && 21.799 > a) return "#0B2C6F";
        if (21.799 <= a) return "#000000"
    }
    if (-1 < b.indexOf("viirs")) {
        if (.25 > a) return "#010101";
        if (.25 <= a && .4 > a) return "#0B2C6F";
        if (.4 <= a && 1 > a) return "#20998F";
        if (1 <= a && 3 > a) return "#01FF01";
        if (3 <= a && 6 > a) return "#FFFF01";
        if (6 <= a && 20 > a) return "#EDA113";
        if (20 <= a && 40 > a) return "#C2523C";
        if (40 <= a) return "#B00112"
    }
    if (-1 < b.indexOf("dmps")) {
        if (6 > a) return "#000000";
        if (6 == a) return "#0B2C6F";
        if (7 <= a && 16 > a) return "#20998F";
        if (16 <= a && 30 > a) return "#00DB00";
        if (30 <= a && 47 > a) return "#FFFF00";
        if (47 <= a && 55 >
            a) return "#EDA113";
        if (50 <= a && 58 > a || 58 <= a) return "#C2523C"
    }
}

function clearOverlays(b) {
    for (var a = map.getOverlays(), c = a.getArray().slice(0), d = 0; d < c.length; d++) {
        var e = c[d].getId();
        "all" == b ? -1 == e.indexOf("geolocationIcon") && a.remove(c[d]) : -1 != e.indexOf(b) && a.remove(c[d])
    }
}

function flyTo(b, a) {
    function c(a) {
        --e;
        f || 0 !== e && a || (f = !0)
    }
    var d = map.getView(),
        e = 2,
        f = !1,
        k = 1;
    5E5 < (new ol.Sphere(6378137)).haversineDistance(ol.proj.transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326"), ol.proj.transform(b, "EPSG:3857", "EPSG:4326")) && 8 < d.getZoom() && (k = 5);
    d.animate({
        center: b,
        duration: 2E3
    }, c);
    d.animate({
        zoom: a - k,
        duration: 1E3
    }, {
        zoom: a,
        duration: 1E3
    }, c)
}

function makePopupDraggable() {
    $(".ol-popup").draggable({
        cancel: ".ol-popup-content",
        drag: function() {
            $(".ol-popup").addClass("ol-popupDrag").removeClass("ol-popup");
            $(".ol-popupDrag").css("bottom", "auto");
            $(".ol-popupDrag").css("left", "auto")
        }
    });
    $(".ol-popup").css("cursor", "move");
    $(".ol-popup-content").css("cursor", "auto")
}

function redrawGraticule() {
    var b = getLayerByName("layerGraticule");
    "undefined" == typeof b ? (b = new ol.layer.Vector({
        name: "layerGraticule",
        source: new ol.source.Vector({
            features: []
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "rgba(255, 0, 0, 0.2)",
                width: 1
            })
        })
    }), map.addLayer(b), b = getLayerByName("layerGraticule")) : b.getSource().clear();
    if (-1 != activeControl.indexOf("Radiance") && !(13 > map.getView().getZoom())) {
        var a = map.getView().getCenter(),
            c = new ol.geom.Point(a),
            c = c.transform("EPSG:3857",
                "EPSG:4326"),
            a = getRadianceLayer();
        if (-1 != a.indexOf("viirs")) var a = .0041666667,
            d = Math.floor(c.getCoordinates()[0] / a) * a + a / 2,
            c = Math.floor(c.getCoordinates()[1] / a) * a + a / 2;
        else -1 != a.indexOf("wa_") ? (a = .0083333333, d = Math.floor(c.getCoordinates()[0] / a) * a, c = Math.floor(c.getCoordinates()[1] / a) * a + a / 2) : (a = .0083333333, d = Math.floor(c.getCoordinates()[0] / a) * a, c = Math.floor(c.getCoordinates()[1] / a) * a);
        var c = new ol.geom.Point([d, c]),
            e = map.getView().calculateExtent(map.getSize()),
            d = new ol.geom.Point([e[0], e[1]]),
            d = d.transform("EPSG:3857",
                "EPSG:4326"),
            e = new ol.geom.Point([e[2], e[3]]),
            e = e.transform("EPSG:3857", "EPSG:4326"),
            f = Math.round(2 * (Math.abs(c.getCoordinates()[1] - e.getCoordinates()[1]) / a + 3));
        if (30 > f) {
            for (var k = -f; k < f + 1; k++) {
                var g = new ol.Feature,
                    m = [
                        [d.getCoordinates()[0], c.getCoordinates()[1] + k * a],
                        [e.getCoordinates()[0], c.getCoordinates()[1] + k * a]
                    ],
                    m = new ol.geom.LineString(m),
                    m = m.transform("EPSG:4326", "EPSG:3857");
                g.setGeometry(m);
                b.getSource().addFeature(g)
            }
            for (k = -f; k < f + 1; k++) g = new ol.Feature, m = [
                [c.getCoordinates()[0] + k * a, e.getCoordinates()[1]],
                [c.getCoordinates()[0] + k * a, d.getCoordinates()[1]]
            ], m = new ol.geom.LineString(m), m = m.transform("EPSG:4326", "EPSG:3857"), g.setGeometry(m), b.getSource().addFeature(g)
        }
    }
}

function formatDouble(b) {
    return .1 <= b && 1 > b ? b.toFixed(3) : 1E-5 > b ? 0 : .1 > b ? b.toFixed(4) : 1 <= b && 10 > b ? b.toFixed(2) : 10 <= b && 100 > b ? b.toFixed(1) : 100 <= b && 1E3 > b ? b.toFixed(0) : 1E3 <= b && 1E4 > b ? 10 * Math.round(b / 10) : 1E4 <= b && 1E5 > b ? 100 * Math.round(b / 100) : 1E5 <= b && 1E6 > b ? 1E3 * Math.round(b / 1E3) : b
}

function bortleClass(b) {
    return 18.38 > b ? "class 8-9" : 18.38 <= b && 18.94 > b ? "class 7" : 18.94 <= b && 19.5 > b ? "class 6" : 19.5 <= b && 20.49 > b ? "class 5" : 20.49 <= b && 21.69 > b ? "class 4" : 21.69 <= b && 21.89 > b ? "class 3" : 21.89 <= b && 21.99 > b ? "class 2" : "class 1"
}

function showSQCimages(b) {
    $.ajax({
        url: "input2/getsqcimages.aspx?gid=" + b,
        type: "GET",
        dataType: "json",
        success: function(a) {
            $("#map").append('<div id="sqcimages" style="cursor: default;position: absolute;left:0px;top:0px;width:100%;height:100%;background-color: #000000;z-index: 16001;opacity:0.8"></div>');
            $("#map").append('<div id="sqcimagesinner" style="cursor: default;position: absolute;top:50%;left:50%;transform: translate(-50%,-50%);max-width:720px;width: calc(100% - 40px);height:auto;background-color: #000000;z-index: 16002;"><div id="sqcimages-closer" class="ol-popup-closer" style="right: -19px;top: -19px;font-size: 180%;padding: 4px 7px;background-color: #000000;border-radius: 30px;border-color: #FFFFFF;border-style: solid;border-width: 2px;"></div></div>');
            $("#sqcimages-closer").click(function() {
                $("#sqcimages").remove();
                $("#sqcimagesinner").remove()
            });
            for (var b = [], d = 0; d < a.images.length; d++) switch (a.images[d].substring(21, 23)) {
                case "01":
                    b[5] = a.images[d];
                    break;
                case "02":
                    b[6] = a.images[d];
                    break;
                case "03":
                    b[1] = a.images[d];
                    break;
                case "04":
                    b[4] = a.images[d];
                    break;
                case "05":
                    b[8] = a.images[d];
                    break;
                case "06":
                    b[12] = a.images[d];
                    break;
                case "07":
                    b[7] = a.images[d];
                    break;
                case "08":
                    b[11] = a.images[d];
                    break;
                case "09":
                    b[9] = a.images[d];
                    break;
                case "10":
                    b[10] = a.images[d];
                case "11":
                    b[0] =
                        a.images[d]
            }
            b[2] = "input/uploads/sqcempty.jpg";
            b[3] = "input/uploads/sqcimagesbar.jpg";
            for (d = 0; d < b.length; d++) 3 == d ? $("#sqcimagesinner").append('<img style="float:left;width:100%;height:auto;max-width:760px;max-height:30px;cursor:default;" src="' + b[d] + '" onclick="showSQCimage(\'' + b[d] + "')\" />") : 6 == d || 9 == d || 12 == d ? $("#sqcimagesinner").append('<img style="width:33%;height:auto;max-width:240px;max-height:180px;cursor:pointer;" src="' + b[d] + '" onclick="showSQCimage(\'' + b[d].replace("_thumbnail", "") + "')\" />") :
                $("#sqcimagesinner").append('<img style="float:left;width:33%;height:auto;max-width:240px;max-height:180px;cursor:pointer;" src="' + b[d] + '" onclick="showSQCimage(\'' + b[d].replace("_thumbnail", "") + "')\" />")
        }
    })
}

function showSQCimage(b) {
    if (-1 == b.indexOf("sqcempty.jpg") && -1 == b.indexOf("sqcimagesbar.jpg")) {
        if ($("#sqcimages").length) {
            $("#sqcimagesinner").hide();
            var a = parseInt(b.substring(21, 23)),
                c = "960px";
            5 <= a && 10 >= a && (c = "400px");
            $("#map").append('<div id="sqcimageinner" style="cursor: default;background-color: #000000;z-index: 16004;margin: auto;position: absolute;top: 20px;left: 20px;bottom: 20px;right: 20px;max-height: ' + c + ';max-width: 1280px;"><div id="sqcimage-closer" class="ol-popup-closer" style="right: -19px;top: -19px;font-size: 180%;padding: 4px 7px;background-color: #000000;border-radius: 30px;border-color: #FFFFFF;border-style: solid;border-width: 2px;"></div></div>');
            $("#sqcimage-closer").click(function() {
                $("#sqcimageinner").remove();
                $("#sqcimagesinner").show()
            })
        } else $("#map").append('<div id="sqcimages" style="cursor: default;position: absolute;left:0px;top:0px;width:100%;height:100%;background-color: #000000;z-index: 16001;opacity:0.8"></div>'), $("#map").append('<div id="sqcimageinner" style="cursor: default;background-color: #000000;z-index: 16004;margin: auto;position: absolute;top: 20px;left: 20px;bottom: 20px;right: 20px;max-height: 960px;max-width: 1280px;"><div id="sqcimage-closer" class="ol-popup-closer" style="right: -19px;top: -19px;font-size: 180%;padding: 4px 7px;background-color: #000000;border-radius: 30px;border-color: #FFFFFF;border-style: solid;border-width: 2px;"></div></div>'),
            $("#sqcimage-closer").click(function() {
                $("#sqcimages").remove();
                $("#sqcimageinner").remove()
            });
        $("#sqcimageinner").append('<img style="max-width: 100%;max-height: 100%;display: block;margin: auto;" src="' + b + '" />')
    }
}

function updateSQMLEchart(b, a, c) {
    var d = $("#dateTimeContainer").data().tz;
    a = moment.tz(a, d);
    a.add(12, "hours");
    var e, f;
    "day" == c ? (d = a.clone(), d.add(1, "days")) : (d = a.clone(), d.add(1, "months"), d.add(-1, "days"));
    f = d.format("YYYY-MM-DD HH:mm:ss");
    d = a.clone();
    d.add(-1, "days");
    e = d.format("YYYY-MM-DD HH:mm:ss");
    $.ajax({
        url: "sqm/select.ashx?id=" + b + "&tstart=" + e + "&tend=" + f,
        type: "GET",
        dataType: "json",
        success: function(a) {
            window.SQMchart.data.datasets = [];
            for (var b = [], d = [], k = {}, h = 0; h < a.data.time.length; h++) k.x = a.data.time[h],
                k.y = a.data.value[h], d.push(k), k = {};
            b.push({
                label: "SQM value",
                backgroundColor: "rgba(0, 149, 255, 1)",
                borderColor: "rgba(0, 149, 255, 1)",
                pointStyle: "circle",
                radius: 2,
                pointRadius: 2,
                pointHitRadius: 2,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 1,
                yAxisID: "A",
                fill: !1,
                data: d,
                spanGaps: !0,
                lineTension: .1,
                showLine: !1
            });
            var h = $("#dateTimeContainer").data(),
                d = 180 / Math.PI,
                k = h.lat,
                l = h.lon,
                n = h.tz,
                p = h.elevation;
            tstart_d = moment.tz(e, n);
            tend_d = moment.tz(f, n);
            var q = 300;
            "month" == c && (q = 2E3);
            for (var t = moment.duration(tend_d.diff(tstart_d)).asMilliseconds() /
                    q, B = [], u = {}, h = 0; h < q; h++) {
                var w = tstart_d.clone(),
                    w = w.add((h + 1) * t, "milliseconds"),
                    v = new A.JulianDay(w.toDate()),
                    D = A.EclCoord.fromWgs84(k, l, p),
                    x = A.Moon.topocentricPosition(v, D, !0),
                    v = A.Solar.apparentTopocentric(v, D),
                    v = A.MoonIllum.phaseAngleEq2(x.eq, v);
                x.illum = A.MoonIllum.illuminated(v);
                x.hz.alt *= d;
                0 <= x.hz.alt && (u.x = w.format("YYYY-MM-DD HH:mm:ss"), u.y = x.hz.alt, u.illum = 100 * x.illum, B.push(u), u = {})
            }
            b.push({
                label: "Moon alt.",
                backgroundColor: "rgba(96, 96, 96, 1)",
                borderColor: "rgba(96, 96, 96, 1)",
                pointStyle: "circle",
                radius: 1,
                pointRadius: 1,
                pointHitRadius: 2,
                pointHoverRadius: 3,
                pointHoverBorderWidth: 1,
                yAxisID: "B",
                fill: !1,
                data: B,
                showLine: !1
            });
            window.SQMchart.data.datasets = b;
            window.SQMchart.options = {
                responsive: !0,
                onClick: chartClickEvent,
                onResize: function(a, b) {
                    $("#chart_y_limit_control").css("height", b.height - 125 + "px");
                    $("#chart_x_limit_control").css("width", b.width - 210 + "px")
                },
                title: {
                    display: !0,
                    text: "SQM data (" + moment(new Date(e)).format("YYYY-MM-DD HH:mm:ss") + " - " + moment(new Date(f)).format("YYYY-MM-DD HH:mm:ss") +
                        ")",
                    fontSize: 16
                },
                legend: {
                    position: "right",
                    labels: {
                        usePointStyle: !0
                    }
                },
                tooltips: {
                    mode: "nearest",
                    callbacks: {
                        title: function(a, c) {
                            if (0 < a.length) return moment(new Date(b[a[0].datasetIndex].data[a[0].index].x)).format("YYYY-MM-DD HH:mm:ss")
                        },
                        label: function(a, b) {
                            var c = b.datasets[a.datasetIndex].label || "";
                            c && (c += ": ");
                            c += (Math.round(100 * a.yLabel) / 100).toFixed(2);
                            return c = -1 < c.indexOf("Moon alt.") ? c + ("\u00b0 (" + (Math.round(10 * b.datasets[a.datasetIndex].data[a.index].illum) / 10).toFixed(1) + "% illum.)") : c + " mag./arc sec\u00b2"
                        }
                    },
                    position: "nearest",
                    intersect: !0
                },
                hover: {
                    mode: "nearest",
                    intersect: !1
                },
                annotation: {
                    annotations: []
                },
                scales: {
                    xAxes: [{
                        id: "C",
                        type: "time",
                        time: {
                            unit: "hour",
                            unitStepSize: 1,
                            displayFormats: {
                                hour: "HH:mm"
                            },
                            min: e,
                            max: f
                        },
                        ticks: {
                            autoSkip: !0
                        },
                        scaleLabel: {
                            display: !0,
                            labelString: "Time"
                        }
                    }],
                    yAxes: [{
                        id: "A",
                        display: !0,
                        position: "left",
                        type: "linear",
                        ticks: {
                            autoSkip: !0,
                            beginAtZero: !1,
                            reverse: !0
                        },
                        scaleLabel: {
                            display: !0,
                            labelString: "MPSAS (mag./arc sec\u00b2)"
                        }
                    }, {
                        id: "B",
                        display: !0,
                        position: "right",
                        type: "linear",
                        ticks: {
                            autoSkip: !0,
                            max: 90,
                            beginAtZero: !0,
                            reverse: !1,
                            callback: function(a, b, c) {
                                return Math.round(10 * a) / 10 + " \u00b0"
                            }
                        },
                        scaleLabel: {
                            display: !0,
                            labelString: "Altitude (degrees)"
                        }
                    }]
                }
            };
            q = [];
            t = [];
            B = (tend_d - tstart_d) / 6E4;
            for (h = u = 0; h < B; h++) w = tstart_d.clone(), w = moment(w).tz(n), w = w.add(6E4 * (h + 1), "milliseconds"), v = new A.JulianDay(w.toDate()), D = A.EclCoord.fromWgs84(k, l, p), v = A.Solar.topocentricPosition(v, D, !0), v.hz.alt *= d, -18 > v.hz.alt && 0 == u && (q.push(w.format("YYYY-MM-DD HH:mm:ss")), u = 1), -18 < v.hz.alt && 1 == u && (t.push(w.format("YYYY-MM-DD HH:mm:ss")),
                u = 0);
            d = [];
            for (h = 0; h < q.length; h++) "undefined" != typeof q[h] && "undefined" != typeof t[h] && d.push({
                drawTime: "beforeDatasetsDraw",
                type: "box",
                yScaleID: "B",
                xScaleID: "C",
                xMin: q[h],
                xMax: t[h],
                backgroundColor: "rgba(0, 0, 0, 0.1)"
            });
            window.SQMchart.options.annotation.annotations = d;
            "day" == c ? (window.SQMchart.options.scales.xAxes[0].time.displayFormats = {
                    hour: "DD HH:mm"
                }, window.SQMchart.options.scales.xAxes[0].time.unit = "hour", window.SQMchart.options.scales.xAxes[0].scaleLabel.labelString = "Time (hour)", window.SQMchart.options.title.text =
                "SQM data (" + moment(new Date(e)).format("YYYY-MM-DD HH:mm:ss") + " - " + moment(new Date(f)).format("YYYY-MM-DD HH:mm:ss") + ")") : (window.SQMchart.options.scales.xAxes[0].time.displayFormats = {
                day: "DD"
            }, window.SQMchart.options.scales.xAxes[0].time.unit = "day", window.SQMchart.options.scales.xAxes[0].scaleLabel.labelString = "Time (day)", window.SQMchart.options.title.text = "SQM data (" + moment(new Date(e)).format("YYYY MMMM") + ")");
            window.SQMchart.update();
            var h = window.SQMchart.scales.A,
                y = h.max,
                z = h.min;
            $("#chart_y_limit_control").css("height",
                $("#canvasContainer").height() - 125 + "px");
            try {
                $("#chart_y_limit_control").slider("destroy")
            } catch (F) {}
            $("#chart_y_limit_control").slider({
                range: !0,
                animate: "slow",
                orientation: "vertical",
                min: z,
                max: y,
                values: [z, y],
                step: .1,
                change: function(a, b) {
                    var c = z + y - b.values[1],
                        d = z + y - b.values[0],
                        e = $(this).find(".ui-slider-handle");
                    e[0].innerHTML = d.toFixed(1);
                    e[1].innerHTML = c.toFixed(1);
                    window.SQMchart.options.scales.yAxes[0] = {
                        id: "A",
                        display: !0,
                        position: "left",
                        type: "linear",
                        ticks: {
                            autoSkip: !0,
                            beginAtZero: !1,
                            reverse: !0,
                            min: c,
                            max: d
                        },
                        scaleLabel: {
                            display: !0,
                            labelString: "MPSAS (mag./arc sec\u00b2)"
                        }
                    };
                    window.SQMchart.update()
                },
                slide: function(a, b) {
                    var c = z + y - b.values[1],
                        d = z + y - b.values[0],
                        e = $(this).find(".ui-slider-handle");
                    e[0].innerHTML = d.toFixed(1);
                    e[1].innerHTML = c.toFixed(1)
                }
            });
            h = $("#chart_y_limit_control").find(".ui-slider-handle");
            h[0].innerHTML = y.toFixed(1);
            h[1].innerHTML = z.toFixed(1);
            $("#chart_x_limit_control").css("width", $("#canvasContainer").width() - 210 + "px");
            try {
                $("#chart_x_limit_control").slider("destroy")
            } catch (F) {}
            d = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
            if ("month" == c)
                for (k = daysInMonth(tstart_d.clone().add(1, "months").format("M"), tstart_d.format("YYYY")), d = [], h = 0; h < k; h++) d.push(h + 1);
            $("#chart_x_limit_control").slider({
                range: !0,
                animate: "slow",
                min: 1,
                max: d[d.length - 1],
                values: [1, d[d.length - 1]],
                step: 1,
                change: function(a, b) {
                    var d = $(this).find(".ui-slider-handle");
                    "day" == c ? (d[0].innerHTML = b.values[0] + "h", d[1].innerHTML =
                        b.values[1] + "h", d = tstart_d.clone(), d.add(b.values[0] - 1, "hours"), window.SQMchart.options.scales.xAxes[0].time.min = d.format("YYYY-MM-DD HH:mm:ss"), d = tstart_d.clone(), d.add(b.values[1], "hours")) : (d[0].innerHTML = b.values[0], d[1].innerHTML = b.values[1], d = tstart_d.clone(), d.add(b.values[0] - 1, "days"), window.SQMchart.options.scales.xAxes[0].time.min = d.format("YYYY-MM-DD HH:mm:ss"), d = tstart_d.clone(), d.add(b.values[1], "days"));
                    window.SQMchart.options.scales.xAxes[0].time.max = d.format("YYYY-MM-DD HH:mm:ss");
                    window.SQMchart.update()
                },
                slide: function(a, b) {
                    var d = $(this).find(".ui-slider-handle");
                    "day" == c ? (d[0].innerHTML = b.values[0] + "h", d[1].innerHTML = b.values[1] + "h") : (d[0].innerHTML = b.values[0], d[1].innerHTML = b.values[1])
                }
            });
            h = $("#chart_x_limit_control").find(".ui-slider-handle");
            "day" == c ? (h[0].innerHTML = "1h", h[1].innerHTML = d[d.length - 1] + "h") : (h[0].innerHTML = 1, h[1].innerHTML = d[d.length - 1]);
            $(".chartStats").remove();
            $("#chartStats fieldset").append(chartStats(a.data.stats));
            $("#chartStats").fadeIn();
            $("#canvasContainer").is(":visible") ||
                $("#canvasContainer").fadeIn();
            $("#dateTimeContainer").is(":visible") || $("#dateTimeContainer").fadeIn()
        }
    })
}

function chartStats(b) {
    var a = "<div class='chartStats chartStats1'>Average</div><div class='chartStats chartStats2'>" + b.avg + "</div>",
        a = a + ("<div class='chartStats chartStats1'>Maximum</div><div class='chartStats chartStats2'>" + b.max + "</div>"),
        a = a + ("<div class='chartStats chartStats1'>Minimum</div><div class='chartStats chartStats2'>" + b.min + "</div>"),
        a = a + ("<div class='chartStats chartStats1'>Mode</div><div class='chartStats chartStats2'>" + b.mode + "</div>"),
        a = a + ("<div class='chartStats chartStats1'>Std. dev</div><div class='chartStats chartStats2'>" +
            b.stddev + "</div>");
    return a += "<div class='chartStats chartStats1'>Variance</div><div class='chartStats chartStats2'>" + b.variance + "</div>"
}

function daysInMonth(b, a) {
    return (new Date(a, b, 0)).getDate()
}

function openSQMLE(b, a) {
    0 == chartjs_loaded && $.getScript("lib/Chart.bundle.min.js", function(a, b, e) {
        chartjs_loaded = !0
    });
    0 == $("#sqm-le_panel").length && ($("body").append("<div id='sqm-le_panel'><div id='sqm-le_panel-closer' class='ol-popup-closer'></div><div id='sqm-le_panel_content'><div><div id='chart_y_limit_control'></div><div id='canvasContainer' onclick='event.stopPropagation();' class='chart'><canvas id='canvas' class='chart'></canvas></div></div><div><div id='chart_x_limit_control'></div><div id='dateTimeContainer' style='margin: 0px 0px 0px 10px;    display: inline-block;    float: left;    width: 300px;    line-height: 30px;display:none;'><fieldset class='fieldSet'><legend style='font-size: 18px;'>Time settings</legend><label for='dateTimeContainer_radio-day' style='padding: 0.2em 0.5em;'>Day</label><input type='radio' name='dateTimeContainer_radio' id='dateTimeContainer_radio-day' class='dateTimeContainer_radio' checked><label for='dateTimeContainer_radio-month' style='padding: 0.2em 0.5em;'>Month</label><input type='radio' name='dateTimeContainer_radio' id='dateTimeContainer_radio-month' class='dateTimeContainer_radio'><div id='dateTimeContainer_months_slider_label' style='width: 100%;font-family: Arial;'></div><div id='dateTimeContainer_months_slider' style='width: 100%;' title='Month picker'></div><div id='dateTimeContainer_days' style='width: 100%;margin: 20px 0px 0px 0px;'></div></fieldset></div><div id='chartStats' style='margin: 0px 0px 0px 10px;display: inline-block;float: left;width: 200px;line-height: 30px;display:none;'><fieldset class='fieldSet'><legend style='font-size: 18px;'>Chart statistics</legend></fieldset></div><div id='datasetStats' style='margin: 0px 0px 0px 10px;display: inline-block;float: left;width: 200px;line-height: 30px;display:none;'><fieldset class='fieldSet'><legend style='font-size: 18px;'>Alltime statistics</legend></fieldset></div></div></div>"), $("#sqm-le_panel").fadeIn(),
        $("#sqm-le_panel-closer").click(function() {
            $("#sqm-le_panel").fadeOut(function() {
                $(this).remove()
            })
        }));
    $("input[type=radio][name=dateTimeContainer_radio]").change(function() {
        if ("dateTimeContainer_radio-day" == this.id) {
            $("#dateTimeContainer_days").fadeIn();
            var a = $("#dateTimeContainer").data();
            updateSQMLEchart(b, a.date, "day")
        } else "dateTimeContainer_radio-month" == this.id && ($("#dateTimeContainer_days").fadeOut(), a = $("#dateTimeContainer").data(), updateSQMLEchart(b, a.date, "month"))
    });
    $.when(function() {
        return $.ajax({
            url: "sqm/stats.ashx?id=" +
                b,
            type: "GET",
            dataType: "json",
            success: function(a) {}
        })
    }(), function() {
        return $.ajax({
            url: "input2/gettimezone.aspx?QueryData=" + a[0] + "," + a[1],
            type: "GET",
            success: function(a) {}
        })
    }()).done(function(c, d) {
        $("#dateTimeContainer").data("date", c[0].data.months[c[0].data.months.length - 1]);
        $("#dateTimeContainer").data("tz", d[0]);
        $("#dateTimeContainer").data("lon", a[0]);
        $("#dateTimeContainer").data("lat", a[1]);
        $("#dateTimeContainer").data("elevation", c[0].data.elevation);
        $("#dateTimeContainer_months_slider").slider({
            value: c[0].data.months.length -
                1,
            min: 0,
            max: c[0].data.months.length - 1,
            step: 1,
            change: function(a, d) {
                $("#dateTimeContainer_days").datepicker("destroy");
                $("#dateTimeContainer_days").datepicker({
                    beforeShowDay: function(a) {
                        var b = moment(a).format("YYYY-MM-DD"),
                            b = $.inArray(b, c[0].data.days),
                            d = $("#dateTimeContainer").data(),
                            e = d.lat,
                            f = d.lon,
                            g = d.tz,
                            d = 180 / Math.PI;
                        a = moment.tz(moment(a).clone().add(12, "hours"), g);
                        a = new A.JulianDay(a.toDate());
                        var g = A.EclCoord.fromWgs84(e, f, 0),
                            e = A.Moon.topocentricPosition(a, g, !0),
                            f = A.Solar.apparentTopocentric(a,
                                g),
                            k = A.MoonIllum.phaseAngleEq2(e.eq, f);
                        e.illum = A.MoonIllum.illuminated(k);
                        e.hz.alt *= d;
                        a = A.Solar.topocentricPosition(a, g, !0);
                        a.hz.alt *= d;
                        0 < A.MoonIllum.positionAngle(e.eq, f) ? (d = !1, f = "waning") : (d = !0, f = "waxing");
                        e = 100 * e.illum;
                        if (-1 == b) return [!1, "dateTimeContainer_days-cross", "No readings"];
                        if (1 == d) {
                            if (0 < e && 10 >= e) return [!0, "dateTimeContainer_days-ok-1", "Moon " + e.toFixed(0) + "% - " + f];
                            if (10 < e && 40 >= e) return [!0, "dateTimeContainer_days-ok-3", "Moon " + e.toFixed(0) + "% - " + f];
                            if (40 < e && 60 >= e) return [!0, "dateTimeContainer_days-ok-7",
                                "Moon " + e.toFixed(0) + "% - " + f
                            ];
                            if (60 < e && 90 >= e) return [!0, "dateTimeContainer_days-ok-17", "Moon " + e.toFixed(0) + "% - " + f]
                        } else {
                            if (0 < e && 10 >= e) return [!0, "dateTimeContainer_days-ok-1", "Moon " + e.toFixed(0) + "% - " + f];
                            if (10 < e && 40 >= e) return [!0, "dateTimeContainer_days-ok-10", "Moon " + e.toFixed(0) + "% - " + f];
                            if (40 < e && 60 >= e) return [!0, "dateTimeContainer_days-ok-21", "Moon " + e.toFixed(0) + "% - " + f];
                            if (60 < e && 90 >= e) return [!0, "dateTimeContainer_days-ok-26", "Moon " + e.toFixed(0) + "% - " + f]
                        }
                        if (90 < e) return [!0, "dateTimeContainer_days-ok-14",
                            "Moon " + e.toFixed(0) + "% - " + f
                        ]
                    },
                    onSelect: function(a, c) {
                        var d = $(this).datepicker("getDate");
                        updateSQMLEchart(b, moment(d).format("YYYY-MM-DD"), "day")
                    }
                }).datepicker("setDate", new Date(c[0].data.months[d.value]));
                1 == $("#dateTimeContainer_radio-month").prop("checked") && updateSQMLEchart(b, c[0].data.months[d.value], "month");
                $("#dateTimeContainer").data("date", c[0].data.months[d.value])
            },
            slide: function(a, b) {
                moment(new Date(c[0].data.months[b.value])).format("MMMM");
                moment(new Date(c[0].data.months[b.value])).format("YYYY");
                $("#dateTimeContainer_months_slider_label").html(moment(new Date(c[0].data.months[b.value])).format("YYYY") + " " + moment(new Date(c[0].data.months[b.value])).format("MMMM"))
            }
        });
        $("#dateTimeContainer_months_slider").find(".ui-slider-handle").html("&nbsp;&nbsp;&nbsp;");
        $("#dateTimeContainer_months_slider_label").html(moment(new Date(c[0].data.months[c[0].data.months.length - 1])).format("YYYY") + " " + moment(new Date(c[0].data.months[c[0].data.months.length - 1])).format("MMMM"));
        $(".dateTimeContainer_radio").checkboxradio({
            icon: !1
        });
        $("#dateTimeContainer_days").datepicker({
            beforeShowDay: function(a) {
                var b = moment(a).format("YYYY-MM-DD"),
                    b = $.inArray(b, c[0].data.days),
                    d = $("#dateTimeContainer").data(),
                    e = d.lat,
                    f = d.lon,
                    h = d.tz,
                    d = 180 / Math.PI;
                a = moment.tz(moment(a).clone().add(12, "hours"), h);
                a = new A.JulianDay(a.toDate());
                var h = A.EclCoord.fromWgs84(e, f, 0),
                    e = A.Moon.topocentricPosition(a, h, !0),
                    f = A.Solar.apparentTopocentric(a, h),
                    l = A.MoonIllum.phaseAngleEq2(e.eq, f);
                e.illum = A.MoonIllum.illuminated(l);
                e.hz.alt *= d;
                a = A.Solar.topocentricPosition(a,
                    h, !0);
                a.hz.alt *= d;
                0 < A.MoonIllum.positionAngle(e.eq, f) ? (d = !1, f = "waning") : (d = !0, f = "waxing");
                e = 100 * e.illum;
                if (-1 == b) return [!1, "dateTimeContainer_days-cross", "No readings"];
                if (1 == d) {
                    if (0 < e && 10 >= e) return [!0, "dateTimeContainer_days-ok-1", "Moon " + e.toFixed(0) + "% - " + f];
                    if (10 < e && 40 >= e) return [!0, "dateTimeContainer_days-ok-3", "Moon " + e.toFixed(0) + "% - " + f];
                    if (40 < e && 60 >= e) return [!0, "dateTimeContainer_days-ok-7", "Moon " + e.toFixed(0) + "% - " + f];
                    if (60 < e && 90 >= e) return [!0, "dateTimeContainer_days-ok-17", "Moon " + e.toFixed(0) +
                        "% - " + f
                    ]
                } else {
                    if (0 < e && 10 >= e) return [!0, "dateTimeContainer_days-ok-1", "Moon " + e.toFixed(0) + "% - " + f];
                    if (10 < e && 40 >= e) return [!0, "dateTimeContainer_days-ok-10", "Moon " + e.toFixed(0) + "% - " + f];
                    if (40 < e && 60 >= e) return [!0, "dateTimeContainer_days-ok-21", "Moon " + e.toFixed(0) + "% - " + f];
                    if (60 < e && 90 >= e) return [!0, "dateTimeContainer_days-ok-26", "Moon " + e.toFixed(0) + "% - " + f]
                }
                if (90 < e) return [!0, "dateTimeContainer_days-ok-14", "Moon " + e.toFixed(0) + "% - " + f]
            },
            onSelect: function(a, c) {
                var d = $(this).datepicker("getDate");
                updateSQMLEchart(b, moment(d).format("YYYY-MM-DD"), "day")
            }
        });
        var e = "<div style='width:115px;display: inline-block;'>Average</div><div style='display: inline-block;'>" + c[0].data.stats.avg + "</div>",
            e = e + ("<div style='width:115px;display: inline-block;'>Maximum</div><div style='display: inline-block;'>" + c[0].data.stats.max + "</div>"),
            e = e + ("<div style='width:115px;display: inline-block;'>Minimum</div><div style='display: inline-block;'>" + c[0].data.stats.min + "</div>"),
            e = e + ("<div style='width:115px;display: inline-block;'>Mode</div><div style='display: inline-block;'>" +
                c[0].data.stats.mode + "</div>"),
            e = e + ("<div style='width:115px;display: inline-block;'>Std. dev</div><div style='display: inline-block;'>" + c[0].data.stats.stddev + "</div>"),
            e = e + ("<div style='width:115px;display: inline-block;'>Variance</div><div style='display: inline-block;'>" + c[0].data.stats.variance + "</div>");
        $("#datasetStats fieldset").append(e);
        $("#datasetStats").fadeIn();
        e = document.getElementById("canvas").getContext("2d");
        window.SQMchart = new Chart(e, {
            type: "line",
            data: {
                datasets: []
            }
        });
        updateSQMLEchart(b,
            c[0].data.days[c[0].data.days.length - 1], "day")
    })
}

function chartClickEvent(b, a) {
    if (a[0]) {
        var c = a[0]._chart.config.data.datasets[0].data[a[0]._index].x;
        $("#chartStats").data("clickTimeISO", c)
    }
}

function fallbackCopyTextToClipboard(b) {
    var a = document.createElement("textarea");
    a.value = b;
    document.body.appendChild(a);
    a.focus();
    a.select();
    try {
        var c = document.execCommand("copy");
        console.log("Fallback: Copying text command was " + (c ? "successful" : "unsuccessful"))
    } catch (d) {
        console.error("Fallback: Oops, unable to copy", d)
    }
    document.body.removeChild(a)
}

function copyTextToClipboard(b) {
    navigator.clipboard ? navigator.clipboard.writeText(b).then(function() {
        console.log("Async: Copying to clipboard was successful!")
    }, function(a) {
        console.error("Async: Could not copy text: ", a)
    }) : fallbackCopyTextToClipboard(b)
};