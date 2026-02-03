const duckdbExamples = {
  "duck test 1": `{
    "total_bytes_written": 0,
    "total_bytes_read": 0,
    "rows_returned": 0,
    "latency": 0.0,
    "result_set_size": 0,
    "query_name": "",
    "blocked_thread_time": 0.0,
    "system_peak_buffer_memory": 0,
    "system_peak_temp_dir_size": 0,
    "cpu_time": 0.0,
    "extra_info": {},
    "cumulative_cardinality": 0,
    "cumulative_rows_scanned": 0,
    "children": [
        {
            "total_bytes_written": 0,
            "total_bytes_read": 0,
            "result_set_size": 0,
            "operator_name": "EXPLAIN_ANALYZE",
            "cpu_time": 0.0,
            "extra_info": {},
            "cumulative_cardinality": 0,
            "operator_type": "EXPLAIN_ANALYZE",
            "operator_cardinality": 0,
            "cumulative_rows_scanned": 0,
            "operator_rows_scanned": 0,
            "operator_timing": 0.00000426,
            "children": [
                {
                    "total_bytes_written": 0,
                    "total_bytes_read": 0,
                    "result_set_size": 146540,
                    "operator_name": "ORDER_BY",
                    "cpu_time": 0.0,
                    "extra_info": {
                        "Order By": [
                            "o.order_id ASC",
                            "p.product_name ASC"
                        ]
                    },
                    "cumulative_cardinality": 0,
                    "operator_type": "ORDER_BY",
                    "operator_cardinality": 2155,
                    "cumulative_rows_scanned": 0,
                    "operator_rows_scanned": 0,
                    "operator_timing": 0.0007123170000000001,
                    "children": [
                        {
                            "total_bytes_written": 0,
                            "total_bytes_read": 0,
                            "result_set_size": 146540,
                            "operator_name": "PROJECTION",
                            "cpu_time": 0.0,
                            "extra_info": {
                                "Projections": [
                                    "order_id",
                                    "order_date",
                                    "company_name",
                                    "product_name",
                                    "quantity",
                                    "unit_price",
                                    "line_total"
                                ],
                                "Estimated Cardinality": "2154"
                            },
                            "cumulative_cardinality": 0,
                            "operator_type": "PROJECTION",
                            "operator_cardinality": 2155,
                            "cumulative_rows_scanned": 0,
                            "operator_rows_scanned": 0,
                            "operator_timing": 0.0001151,
                            "children": [
                                {
                                    "total_bytes_written": 0,
                                    "total_bytes_read": 0,
                                    "result_set_size": 146540,
                                    "operator_name": "HASH_JOIN",
                                    "cpu_time": 0.0,
                                    "extra_info": {
                                        "Join Type": "INNER",
                                        "Conditions": "order_id = order_id",
                                        "Estimated Cardinality": "2154"
                                    },
                                    "cumulative_cardinality": 0,
                                    "operator_type": "HASH_JOIN",
                                    "operator_cardinality": 2155,
                                    "cumulative_rows_scanned": 0,
                                    "operator_rows_scanned": 0,
                                    "operator_timing": 0.000889021,
                                    "children": [
                                        {
                                            "total_bytes_written": 0,
                                            "total_bytes_read": 0,
                                            "result_set_size": 103440,
                                            "operator_name": "HASH_JOIN",
                                            "cpu_time": 0.0,
                                            "extra_info": {
                                                "Join Type": "INNER",
                                                "Conditions": "product_id = product_id",
                                                "Estimated Cardinality": "2154"
                                            },
                                            "cumulative_cardinality": 0,
                                            "operator_type": "HASH_JOIN",
                                            "operator_cardinality": 2155,
                                            "cumulative_rows_scanned": 0,
                                            "operator_rows_scanned": 0,
                                            "operator_timing": 0.001242281,
                                            "children": [
                                                {
                                                    "total_bytes_written": 0,
                                                    "total_bytes_read": 0,
                                                    "result_set_size": 86200,
                                                    "operator_name": "SQLITE_SCAN ",
                                                    "cpu_time": 0.0,
                                                    "extra_info": {
                                                        "Table": "order_details",
                                                        "File": "sqlite.db",
                                                        "Projections": [
                                                            "order_id",
                                                            "product_id",
                                                            "quantity",
                                                            "unit_price",
                                                            "discount"
                                                        ],
                                                        "Estimated Cardinality": "2154"
                                                    },
                                                    "cumulative_cardinality": 0,
                                                    "operator_type": "TABLE_SCAN",
                                                    "operator_cardinality": 2155,
                                                    "cumulative_rows_scanned": 0,
                                                    "operator_rows_scanned": 2154,
                                                    "operator_timing": 0.0005965909999999999,
                                                    "children": []
                                                },
                                                {
                                                    "total_bytes_written": 0,
                                                    "total_bytes_read": 0,
                                                    "result_set_size": 1848,
                                                    "operator_name": "SQLITE_SCAN ",
                                                    "cpu_time": 0.0,
                                                    "extra_info": {
                                                        "Table": "products",
                                                        "File": "sqlite.db",
                                                        "Projections": [
                                                            "product_id",
                                                            "product_name"
                                                        ],
                                                        "Estimated Cardinality": "76"
                                                    },
                                                    "cumulative_cardinality": 0,
                                                    "operator_type": "TABLE_SCAN",
                                                    "operator_cardinality": 77,
                                                    "cumulative_rows_scanned": 0,
                                                    "operator_rows_scanned": 76,
                                                    "operator_timing": 0.000042325,
                                                    "children": []
                                                }
                                            ]
                                        },
                                        {
                                            "total_bytes_written": 0,
                                            "total_bytes_read": 0,
                                            "result_set_size": 23240,
                                            "operator_name": "HASH_JOIN",
                                            "cpu_time": 0.0,
                                            "extra_info": {
                                                "Join Type": "INNER",
                                                "Conditions": "customer_id = customer_id",
                                                "Estimated Cardinality": "829"
                                            },
                                            "cumulative_cardinality": 0,
                                            "operator_type": "HASH_JOIN",
                                            "operator_cardinality": 830,
                                            "cumulative_rows_scanned": 0,
                                            "operator_rows_scanned": 0,
                                            "operator_timing": 0.001798993,
                                            "children": [
                                                {
                                                    "total_bytes_written": 0,
                                                    "total_bytes_read": 0,
                                                    "result_set_size": 23240,
                                                    "operator_name": "SQLITE_SCAN ",
                                                    "cpu_time": 0.0,
                                                    "extra_info": {
                                                        "Table": "orders",
                                                        "File": "sqlite.db",
                                                        "Projections": [
                                                            "customer_id",
                                                            "order_id",
                                                            "order_date"
                                                        ],
                                                        "Estimated Cardinality": "829"
                                                    },
                                                    "cumulative_cardinality": 0,
                                                    "operator_type": "TABLE_SCAN",
                                                    "operator_cardinality": 830,
                                                    "cumulative_rows_scanned": 0,
                                                    "operator_rows_scanned": 829,
                                                    "operator_timing": 0.000288657,
                                                    "children": []
                                                },
                                                {
                                                    "total_bytes_written": 0,
                                                    "total_bytes_read": 0,
                                                    "result_set_size": 2912,
                                                    "operator_name": "SQLITE_SCAN ",
                                                    "cpu_time": 0.0,
                                                    "extra_info": {
                                                        "Table": "customers",
                                                        "File": "sqlite.db",
                                                        "Projections": [
                                                            "customer_id",
                                                            "company_name"
                                                        ],
                                                        "Estimated Cardinality": "90"
                                                    },
                                                    "cumulative_cardinality": 0,
                                                    "operator_type": "TABLE_SCAN",
                                                    "operator_cardinality": 91,
                                                    "cumulative_rows_scanned": 0,
                                                    "operator_rows_scanned": 90,
                                                    "operator_timing": 0.000052592,
                                                    "children": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}`,
  "rows heavy": `{
    "cpu_time": 0.12,
    "children": [
        {
            "operator_name": "SEQ_SCAN",
            "operator_type": "TABLE_SCAN",
            "operator_timing": 0.08,
            "operator_cardinality": 10000,
            "operator_rows_scanned": 10000,
            "result_set_size": 200000,
            "extra_info": {
                "Table": "orders",
                "Estimated Cardinality": "100"
            },
            "children": []
        },
        {
            "operator_name": "FILTER",
            "operator_type": "FILTER",
            "operator_timing": 0.02,
            "operator_cardinality": 100,
            "operator_rows_scanned": 10000,
            "result_set_size": 2000,
            "extra_info": {
                "Estimated Cardinality": "100"
            },
            "children": []
        }
    ]
}`,
  "result heavy": `{
    "cpu_time": 0.09,
    "children": [
        {
            "operator_name": "PROJECTION",
            "operator_type": "PROJECTION",
            "operator_timing": 0.04,
            "operator_cardinality": 200,
            "operator_rows_scanned": 200,
            "result_set_size": 900000,
            "extra_info": {
                "Estimated Cardinality": "200"
            },
            "children": []
        },
        {
            "operator_name": "FILTER",
            "operator_type": "FILTER",
            "operator_timing": 0.02,
            "operator_cardinality": 50,
            "operator_rows_scanned": 200,
            "result_set_size": 10000,
            "extra_info": {
                "Estimated Cardinality": "50"
            },
            "children": []
        }
    ]
}`,
  "slow operator": `{
    "cpu_time": 0.5,
    "children": [
        {
            "operator_name": "HASH_JOIN",
            "operator_type": "HASH_JOIN",
            "operator_timing": 0.45,
            "operator_cardinality": 120,
            "operator_rows_scanned": 240,
            "result_set_size": 48000,
            "extra_info": {
                "Estimated Cardinality": "120"
            },
            "children": []
        }
    ]
}`,
};

export default duckdbExamples;
