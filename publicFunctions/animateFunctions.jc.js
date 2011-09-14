jCanvaScript.animateFunctions = {
    linear:function(progress, params) {
        return progress;
    },
    exp:function(progress, params) {
        var n = params.n || 2;
        return m_pow(progress, n);
    },
    circ:function(progress, params) {
        return 1 - m_sqrt(1 - progress * progress);
    },
    sine:function(progress, params) {
        return 1 - m_sin((1 - progress) * m_pi / 2);
    },
    back:function(progress, params) {
        var n = params.n || 2;
        var x = params.x || 1.5;
        return m_pow(progress, n) * ((x + 1) * progress - x);
    },
    elastic:function(progress, params) {
        var n = params.n || 2;
        var m = params.m || 20;
        var k = params.k || 3;
        var x = params.x || 1.5;
        return m_pow(n, 10 * (progress - 1)) * m_cos(m * progress * m_pi * x / k);
    },
    bounce:function(progress, params) {
        var n = params.n || 4;
        var b = params.b || 0.25;
        var sum = [1];
        for (var i = 1; i < n; i++) sum[i] = sum[i - 1] + m_pow(b, i / 2);
        var x = 2 * sum[n - 1] - 1;
        for (i = 0; i < n; i++) {
            if (x * progress >= (i > 0 ? 2 * sum[i - 1] - 1 : 0) && x * progress <= 2 * sum[i] - 1)
                return m_pow(x * (progress - (2 * sum[i] - 1 - m_pow(b, i / 2)) / x), 2) + 1 - m_pow(b, i);
        }
        return 1;
    }
}

jCanvaScript.addAnimateFunction = function(name, fn) {
    jCanvaScript.animateFunctions[name] = fn;
    return this;
};